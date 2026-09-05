// gToons — the card battle. Each player fills a 2x3 grid (6 slots) from a
// 12-card deck, one card per turn, drawing a hand of 4. Card abilities
// modify points based on position, neighbours and the rival card across.
import { BY_ID } from './data.js';

export const SLOTS = 6;
export const COLS = 3;
export const HAND = 4;

const rowOf = (i) => Math.floor(i / COLS);
const colOf = (i) => i % COLS;
function neighbours(i) {
  const r = rowOf(i), c = colOf(i), out = [];
  if (c > 0) out.push(i - 1);
  if (c < COLS - 1) out.push(i + 1);
  if (r > 0) out.push(i - COLS);
  if (r < 1) out.push(i + COLS);
  return out;
}

// side = { slots: [ctoonId|null x6], order: [slotIndex placed in turn order] }
export function scoreSides(me, rival) {
  const mods = Array(SLOTS).fill(0).map(() => []);
  const rmods = Array(SLOTS).fill(0).map(() => []);
  const card = (side, i) => side.slots[i] ? BY_ID[side.slots[i]] : null;
  const placedCount = me.order.length;

  for (let i = 0; i < SLOTS; i++) {
    const t = card(me, i);
    if (!t) continue;
    const ab = t.ability;
    const add = (v, why) => mods[i].push({ v, why });
    const rival_t = card(rival, i);
    switch (ab.t) {
      case 'adjSame': { const n = neighbours(i).filter(j => card(me, j)?.series === t.series).length; if (n) add(ab.n * n, `${n} adjacent ${t.series}`); break; }
      case 'adjAny':  { const n = neighbours(i).filter(j => card(me, j)).length; if (n) add(ab.n * n, `${n} adjacent`); break; }
      case 'top':     if (rowOf(i) === 0) add(ab.n, 'top row'); break;
      case 'bottom':  if (rowOf(i) === 1) add(ab.n, 'bottom row'); break;
      case 'corner':  if (colOf(i) !== 1) add(ab.n, 'corner'); break;
      case 'center':  if (colOf(i) === 1) add(ab.n, 'center'); break;
      case 'opp':     if (rival_t) rmods[i].push({ v: -ab.n, why: `${t.name}` }); break;
      case 'oppHalf': if (rival_t) rmods[i].push({ v: -Math.floor(rival_t.points / 2), why: `${t.name}` }); break;
      case 'oppRow':  for (let j = 0; j < SLOTS; j++) if (rowOf(j) === rowOf(i) && card(rival, j)) rmods[j].push({ v: -ab.n, why: `${t.name}` }); break;
      case 'series':  { let n = 0; for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)?.series === t.series) n++; if (n) add(ab.n * n, `${n} allies`); break; }
      case 'rare':    { let n = 0; for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j) && card(me, j).rarity >= 2) n++; if (n) add(ab.n * n, `${n} rares`); break; }
      case 'ally':    for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)?.series === t.series) mods[j].push({ v: ab.n, why: t.name }); break;
      case 'allyAll': for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)) mods[j].push({ v: ab.n, why: t.name }); break;
      case 'last':    if (me.order[SLOTS - 1] === i) add(ab.n, 'last placed'); break;
      case 'first':   if (me.order[0] === i) add(ab.n, 'first placed'); break;
      case 'lonely':  if (!neighbours(i).some(j => card(me, j))) add(ab.n, 'alone'); break;
      case 'mirror':  if (rival_t) add(rival_t.points, `mirrors ${rival_t.name}`); break;
      case 'steal':   if (rival_t) { add(ab.n, 'stolen'); rmods[i].push({ v: -ab.n, why: `${t.name}` }); } break;
    }
  }
  void placedCount;
  return { mods, rmods };
}

// Full evaluation of both sides -> per-slot final values and totals.
export function evaluate(a, b) {
  const A = scoreSides(a, b), B = scoreSides(b, a);
  const finalFor = (side, own, incoming) => side.slots.map((id, i) => {
    if (!id) return null;
    const t = BY_ID[id];
    const list = [...own[i], ...incoming[i]];
    const total = Math.max(0, t.points + list.reduce((s, m) => s + m.v, 0));
    return { id, base: t.points, mods: list, total };
  });
  const av = finalFor(a, A.mods, B.rmods);
  const bv = finalFor(b, B.mods, A.rmods);
  const sum = (v) => v.reduce((s, x) => s + (x ? x.total : 0), 0);
  return { a: av, b: bv, aTotal: sum(av), bTotal: sum(bv) };
}

function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function newMatch(playerDeck, aiDeck, opponent) {
  const pd = shuffle(playerDeck), ad = shuffle(aiDeck);
  const playerFirst = Math.random() < 0.5;
  return {
    opponent,
    turn: playerFirst ? 'p' : 'ai',
    p:  { slots: Array(SLOTS).fill(null), order: [], deck: pd.slice(HAND), hand: pd.slice(0, HAND) },
    ai: { slots: Array(SLOTS).fill(null), order: [], deck: ad.slice(HAND), hand: ad.slice(0, HAND) },
    done: false,
    lastMove: null,
  };
}

export function place(match, who, handIndex, slot) {
  const side = match[who];
  if (side.slots[slot] || handIndex < 0 || handIndex >= side.hand.length) return false;
  const id = side.hand.splice(handIndex, 1)[0];
  side.slots[slot] = id;
  side.order.push(slot);
  if (side.deck.length) side.hand.push(side.deck.shift());
  match.lastMove = { who, slot, id };
  if (match.p.order.length === SLOTS && match.ai.order.length === SLOTS) match.done = true;
  else match.turn = who === 'p' ? 'ai' : 'p';
  return true;
}

// Greedy AI: try every (card, slot) and keep the best score swing, with a
// difficulty-scaled chance of just playing something random.
export function aiChoose(match) {
  const side = match.ai;
  const empties = side.slots.map((s, i) => s ? -1 : i).filter(i => i >= 0);
  if (Math.random() > match.opponent.diff) {
    return { handIndex: Math.floor(Math.random() * side.hand.length), slot: empties[Math.floor(Math.random() * empties.length)] };
  }
  let best = null;
  side.hand.forEach((id, hi) => {
    empties.forEach(slot => {
      const trial = { slots: side.slots.slice(), order: side.order.concat(slot) };
      trial.slots[slot] = id;
      const ev = evaluate(trial, match.p);
      const swing = ev.aTotal - ev.bTotal + Math.random() * 2;
      if (!best || swing > best.swing) best = { handIndex: hi, slot, swing };
    });
  });
  return best;
}

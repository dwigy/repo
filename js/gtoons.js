// gToons — the card battle. Each side has 7 sockets: a back row of 3 and a
// front row of 4 (front rows face each other across the VS line). Players
// take turns placing one gToon from a hand of 5 drawn from a 12-gToon deck.
// Swapping a hand gToon for the next in the deck costs 10 points.
import { BY_ID, COLORS } from './data.js';

export const SLOTS = 7;          // 0..2 back row, 3..6 front row
export const HAND = 5;
export const SWAP_COST = 10;
export const COLOR_SET = 3;      // 3 of one colour = a colour bonus
export const COLOR_BONUS = 5;

export const rowOf = (i) => (i < 3 ? 'back' : 'front');
function neighbours(i) {
  // back row j touches back j±1, front j and j+1. front j touches front j±1, back j-1 and j (where valid)
  const out = [];
  if (i < 3) { if (i > 0) out.push(i - 1); if (i < 2) out.push(i + 1); out.push(3 + i, 4 + i); }
  else { const j = i - 3; if (j > 0) out.push(i - 1); if (j < 3) out.push(i + 1); if (j - 1 >= 0) out.push(j - 1); if (j <= 2) out.push(j); }
  return out;
}
// Opposing socket across the VS line: same index on the other side.
const across = (i) => i;

function colorCounts(side) {
  const c = {};
  side.slots.forEach(id => { if (id) { const k = BY_ID[id].color; c[k] = (c[k] || 0) + 1; } });
  return c;
}

// Compute modifiers this side's powers create. `mods` land on own slots,
// `rmods` on the rival's slots.
function powersFor(me, rival) {
  const mods = Array(SLOTS).fill(0).map(() => []);
  const rmods = Array(SLOTS).fill(0).map(() => []);
  const card = (side, i) => side.slots[i] ? BY_ID[side.slots[i]] : null;
  const myC = colorCounts(me), rvC = colorCounts(rival);
  for (let i = 0; i < SLOTS; i++) {
    const t = card(me, i); if (!t) continue;
    const p = t.power; const add = (v, why) => mods[i].push({ v, why });
    const rt = card(rival, across(i));
    switch (p.t) {
      case 'x2':            for (let j = 0; j < SLOTS; j++) if (j !== i && me.slots[j] === p.id) mods[j].push({ v: BY_ID[p.id].pts, why: `x2 from ${t.name}` }); break;
      case 'perOppColor':   { const n = rvC[p.color] || 0; if (n) add(p.n * n, `${n} rival ${COLORS[p.color].name}`); break; }
      case 'perOwnColor':   { const n = (myC[p.color] || 0) - (t.color === p.color ? 1 : 0); if (n > 0) add(p.n * n, `${n} ${COLORS[p.color].name}`); break; }
      case 'minusOppColor': for (let j = 0; j < SLOTS; j++) if (card(rival, j)?.color === p.color) rmods[j].push({ v: -p.n, why: t.name }); break;
      case 'plusOwnColor':  for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)?.color === p.color) mods[j].push({ v: p.n, why: t.name }); break;
      case 'plusAll':       for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)) mods[j].push({ v: p.n, why: t.name }); break;
      case 'opp':           if (rt) rmods[across(i)].push({ v: -p.n, why: t.name }); break;
      case 'steal':         if (rt) { add(p.n, `from ${rt.name}`); rmods[across(i)].push({ v: -p.n, why: t.name }); } break;
      case 'mirror':        if (rt) add(rt.pts, `copies ${rt.name}`); break;
      case 'back':          if (rowOf(i) === 'back') add(p.n, 'back row'); break;
      case 'front':         if (rowOf(i) === 'front') add(p.n, 'front row'); break;
      case 'first':         if (me.order[0] === i) add(p.n, 'played first'); break;
      case 'last':          if (me.order.length === SLOTS && me.order[SLOTS - 1] === i) add(p.n, 'played last'); break;
      case 'lonely':        if (!neighbours(i).some(j => card(me, j))) add(p.n, 'alone'); break;
    }
  }
  return { mods, rmods };
}

// Full evaluation -> per-slot values, colour bonuses, swap penalties, totals.
export function evaluate(a, b) {
  const A = powersFor(a, b), B = powersFor(b, a);
  const finalFor = (side, own, incoming) => side.slots.map((id, i) => {
    if (!id) return null;
    const t = BY_ID[id]; const list = [...own[i], ...incoming[i]];
    return { id, base: t.pts, mods: list, total: Math.max(0, t.pts + list.reduce((s, m) => s + m.v, 0)) };
  });
  const av = finalFor(a, A.mods, B.rmods), bv = finalFor(b, B.mods, A.rmods);
  const bonus = (side) => Object.entries(colorCounts(side)).reduce((s, [, n]) => s + Math.floor(n / COLOR_SET) * COLOR_BONUS, 0);
  const sum = (v) => v.reduce((s, x) => s + (x ? x.total : 0), 0);
  const aBonus = bonus(a), bBonus = bonus(b);
  return {
    a: av, b: bv, aBonus, bBonus, aSwaps: a.swaps || 0, bSwaps: b.swaps || 0,
    aTotal: Math.max(0, sum(av) + aBonus - (a.swaps || 0) * SWAP_COST),
    bTotal: Math.max(0, sum(bv) + bBonus - (b.swaps || 0) * SWAP_COST),
    aColors: colorCounts(a), bColors: colorCounts(b),
  };
}

function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function mkSide(deck) { const d = shuffle(deck); return { slots: Array(SLOTS).fill(null), order: [], deck: d.slice(HAND), hand: d.slice(0, HAND), swaps: 0 }; }

export function newMatch(playerDeck, aiDeck, opponent) {
  return { opponent, turn: Math.random() < 0.5 ? 'p' : 'ai', p: mkSide(playerDeck), ai: mkSide(aiDeck), done: false, lastMove: null, round: 1 };
}

export function place(match, who, handIndex, slot) {
  const side = match[who];
  if (side.slots[slot] || handIndex < 0 || handIndex >= side.hand.length) return false;
  const id = side.hand.splice(handIndex, 1)[0];
  side.slots[slot] = id; side.order.push(slot);
  if (side.deck.length) side.hand.push(side.deck.shift());
  match.lastMove = { who, slot, id };
  if (match.p.order.length === SLOTS && match.ai.order.length === SLOTS) match.done = true;
  else match.turn = who === 'p' ? 'ai' : 'p';
  match.round = Math.min(SLOTS, Math.max(match.p.order.length, match.ai.order.length) + (match.turn === 'p' ? 1 : 0));
  return true;
}

// Swap a hand gToon for the next one in the deck (-10 points).
export function swap(match, who, handIndex) {
  const side = match[who];
  if (!side.deck.length || handIndex < 0 || handIndex >= side.hand.length) return false;
  const old = side.hand[handIndex];
  side.hand[handIndex] = side.deck.shift();
  side.deck.push(old);
  side.swaps++;
  return true;
}

// Greedy AI with difficulty-scaled randomness.
export function aiChoose(match) {
  const side = match.ai;
  const empties = side.slots.map((s, i) => s ? -1 : i).filter(i => i >= 0);
  if (Math.random() > match.opponent.diff) {
    return { handIndex: Math.floor(Math.random() * side.hand.length), slot: empties[Math.floor(Math.random() * empties.length)] };
  }
  let best = null;
  side.hand.forEach((id, hi) => {
    empties.forEach(slot => {
      const trial = { slots: side.slots.slice(), order: side.order.concat(slot), swaps: side.swaps };
      trial.slots[slot] = id;
      const ev = evaluate(trial, match.p);
      const swing = ev.aTotal - ev.bTotal + Math.random() * 1.5;
      if (!best || swing > best.swing) best = { handIndex: hi, slot, swing };
    });
  });
  return best;
}

// The two colours a deck leans on most (shown in the side panels).
export function topColors(ids) {
  const c = {};
  ids.forEach(id => { const k = BY_ID[id]?.color; if (k) c[k] = (c[k] || 0) + 1; });
  const sorted = Object.keys(COLORS).sort((x, y) => (c[y] || 0) - (c[x] || 0));
  return sorted.slice(0, 2);
}

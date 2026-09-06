// gToons — the card battle. Each side has 7 sockets: a back row of 3 and a
// front row of 4 (front rows face each other across the VS line). Players
// take turns placing one gToon from a hand drawn from a 12-gToon deck.
//
// A match carries a `rules` object (house rules) so the campaign can bend
// the game: colour-set size and bonus, swap cost, no swaps, no powers, a
// bonus for a row, a smaller hand, and which chips have their secret power
// awake. Everything defaults to the classic rules.
import { BY_ID, COLORS } from './data.js';

export const SLOTS = 7;          // 0..2 back row, 3..6 front row
export const HAND = 5;
export const SWAP_COST = 10;
export const COLOR_SET = 3;      // 3 of one colour = a colour bonus
export const COLOR_BONUS = 5;

export const DEFAULT_RULES = Object.freeze({
  colorSet: COLOR_SET, colorBonus: COLOR_BONUS, swapCost: SWAP_COST, noSwap: false, noPowers: false,
  rowBonus: { back: 0, front: 0 }, handSize: HAND, openHand: false, secretsOn: false,
  mult: null,          // { opp: 2, steal: 2, bomb: 2 } multiplies those powers
  flipRows: false,     // back-row powers fire in the front row and vice versa
  lastBonus: 0,        // the chip each side plays last gets this
  reelChange: false,   // after three placements a side discards its hand and redraws
  heroP: null, heroAi: null, heroBonus: 6, // stack leaders: +heroBonus when played first
});
export const withRules = (r) => ({ ...DEFAULT_RULES, ...(r || {}), rowBonus: { ...DEFAULT_RULES.rowBonus, ...((r && r.rowBonus) || {}) } });

export const rowOf = (i) => (i < 3 ? 'back' : 'front');
const rowFor = (i, rules) => rules.flipRows ? (rowOf(i) === 'back' ? 'front' : 'back') : rowOf(i);
export function neighbours(i) {
  // back row j touches back j±1, front j and j+1. front j touches front j±1, back j-1 and j (where valid)
  const out = [];
  if (i < 3) { if (i > 0) out.push(i - 1); if (i < 2) out.push(i + 1); out.push(3 + i, 4 + i); }
  else { const j = i - 3; if (j > 0) out.push(i - 1); if (j < 3) out.push(i + 1); if (j - 1 >= 0) out.push(j - 1); if (j <= 2) out.push(j); }
  return out;
}
const rowMates = (i) => (i < 3 ? [0, 1, 2] : [3, 4, 5, 6]).filter(j => j !== i);
// Opposing socket across the VS line: same index on the other side.
const across = (i) => i;

function colorCounts(side) {
  const c = {};
  side.slots.forEach(id => { if (id) { const k = BY_ID[id].color; c[k] = (c[k] || 0) + 1; } });
  return c;
}
const card = (side, i) => side.slots[i] ? BY_ID[side.slots[i]] : null;
const awake = (side, id) => side.awake === 'all' || (Array.isArray(side.awake) && side.awake.includes(id));

// Slots whose power is cancelled by a rival Veto across the line. A Veto chip
// cannot itself be vetoed, so two Vetos facing each other both stand.
const hasPower = (side, i, kind) => { const t = card(side, i); return !!t && (t.power.t === kind || (t.secret && t.secret.t === kind && awake(side, t.id))); };
function silencedBy(rival, me) {
  const out = new Set();
  for (let i = 0; i < SLOTS; i++) {
    if (!hasPower(rival, i, 'veto')) continue;
    if (card(me, across(i)) && !hasPower(me, across(i), 'veto')) out.add(across(i));
  }
  return out;
}
// Shielded slots on a side (a silenced Shield does not count).
const shieldsOf = (side, silenced) => new Set([...Array(SLOTS).keys()].filter(i => !silenced.has(i) && hasPower(side, i, 'shield')));

// Compute modifiers this side's powers create. `mods` land on own slots,
// `rmods` on the rival's slots, `shield` marks own slots immune to penalties.
function powersFor(me, rival, rules, silenced, rivalShield = new Set()) {
  const mods = Array(SLOTS).fill(0).map(() => []);
  const rmods = Array(SLOTS).fill(0).map(() => []);
  const shield = new Set();
  if (rules.noPowers) return { mods, rmods, shield };
  const myC = colorCounts(me), rvC = colorCounts(rival);
  const apply = (p0, i, t, tag) => {
    const p = rules.mult && rules.mult[p0.t] && p0.n ? { ...p0, n: p0.n * rules.mult[p0.t] } : p0;
    const add = (v, why) => mods[i].push({ v, why: tag ? `${why} (secret)` : why });
    const rt = card(rival, across(i));
    const name = t.short || t.name;
    switch (p.t) {
      case 'x2':            for (let j = 0; j < SLOTS; j++) { const b = card(me, j); if (j !== i && b && b.char === p.id) mods[j].push({ v: b.pts, why: `x2 from ${name}` }); } break;
      case 'perOppColor':   { const n = rvC[p.color] || 0; if (n) add(p.n * n, `${n} rival ${COLORS[p.color].name}`); break; }
      case 'perOwnColor':   { const n = (myC[p.color] || 0) - (t.color === p.color ? 1 : 0); if (n > 0) add(p.n * n, `${n} ${COLORS[p.color].name}`); break; }
      case 'minusOppColor': for (let j = 0; j < SLOTS; j++) if (card(rival, j)?.color === p.color) rmods[j].push({ v: -p.n, why: name }); break;
      case 'plusOwnColor':  for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)?.color === p.color) mods[j].push({ v: p.n, why: name }); break;
      case 'plusAll':       for (let j = 0; j < SLOTS; j++) if (j !== i && card(me, j)) mods[j].push({ v: p.n, why: name }); break;
      case 'opp':           if (rt) rmods[across(i)].push({ v: -p.n, why: name }); break;
      case 'steal':         if (rt) { if (!rivalShield.has(across(i))) add(p.n, `from ${rt.short || rt.name}`); rmods[across(i)].push({ v: -p.n, why: name }); } break;
      case 'mirror':        if (rt) add(rt.pts, `copies ${rt.short || rt.name}`); break;
      case 'back':          if (rowFor(i, rules) === 'back') add(p.n, 'back row'); break;
      case 'front':         if (rowFor(i, rules) === 'front') add(p.n, 'front row'); break;
      case 'first':         if (me.order[0] === i) add(p.n, 'played first'); break;
      case 'last':          if (me.order.length === SLOTS && me.order[SLOTS - 1] === i) add(p.n, 'played last'); break;
      case 'late':          if (me.order.indexOf(i) >= SLOTS - 3) add(p.n, 'played late'); break;
      case 'lonely':        if (!neighbours(i).some(j => card(me, j))) add(p.n, 'alone'); break;
      case 'pair':          if (neighbours(i).some(j => card(me, j)?.char === t.char)) add(p.n, 'with a twin'); break;
      case 'chain':         { const n = rowMates(i).filter(j => card(me, j)).length; if (n) add(p.n * n, `${n} in the row`); break; }
      case 'crown':         { const mine = t.pts; if (!me.slots.some((id, j) => id && j !== i && BY_ID[id].pts > mine)) add(p.n, 'highest on the side'); break; }
      case 'underdog':      if (rt && rt.pts > t.pts) add(p.n, `under ${rt.short || rt.name}`); break;
      case 'bomb':          { const hit = [across(i), ...rowMates(across(i)).filter(j => Math.abs(j - across(i)) === 1)]; hit.forEach(j => { if (card(rival, j)) rmods[j].push({ v: -p.n, why: name }); }); break; }
      case 'shield':        shield.add(i); break;
      case 'veto':          break; // handled by silencedBy()
    }
  };
  const hero = me === undefined ? null : (me.isAi ? rules.heroAi : rules.heroP);
  for (let i = 0; i < SLOTS; i++) {
    const t = card(me, i); if (!t) continue;
    if (hero && t.id === hero && me.order[0] === i) mods[i].push({ v: rules.heroBonus, why: 'leader played first' });
    if (silenced.has(i)) continue;
    apply(t.power, i, t, false);
    if (t.secret && awake(me, t.id)) apply(t.secret, i, t, true);
  }
  return { mods, rmods, shield };
}

// Full evaluation -> per-slot values, colour bonuses, swap penalties, totals.
export function evaluate(a, b, rulesIn) {
  const rules = rulesIn ? withRules(rulesIn) : DEFAULT_RULES;
  const silA = silencedBy(b, a), silB = silencedBy(a, b);
  const A = powersFor(a, b, rules, silA, shieldsOf(b, silB)), B = powersFor(b, a, rules, silB, shieldsOf(a, silA));
  const finalFor = (side, own, incoming, shield) => side.slots.map((id, i) => {
    if (!id) return null;
    const t = BY_ID[id];
    const inc = shield.has(i) ? incoming[i].filter(m => m.v >= 0) : incoming[i];
    const list = [...own[i], ...inc];
    const rb = rules.rowBonus[rowFor(i, rules)]; if (rb) list.push({ v: rb, why: `${rowFor(i, rules)} row rule` });
    if (rules.lastBonus && side.order.length === SLOTS && side.order[SLOTS - 1] === i) list.push({ v: rules.lastBonus, why: 'played last (house rule)' });
    return { id, base: t.pts, mods: list, total: Math.max(0, t.pts + list.reduce((s, m) => s + m.v, 0)), shield: shield.has(i), silenced: (side === a ? silA : silB).has(i) };
  });
  const av = finalFor(a, A.mods, B.rmods, A.shield), bv = finalFor(b, B.mods, A.rmods, B.shield);
  const bonus = (side) => Object.entries(colorCounts(side)).reduce((s, [, n]) => s + Math.floor(n / rules.colorSet) * rules.colorBonus, 0);
  const sum = (v) => v.reduce((s, x) => s + (x ? x.total : 0), 0);
  const aBonus = bonus(a), bBonus = bonus(b);
  return {
    a: av, b: bv, aBonus, bBonus, aSwaps: a.swaps || 0, bSwaps: b.swaps || 0,
    aTotal: Math.max(0, sum(av) + aBonus - (a.swaps || 0) * rules.swapCost),
    bTotal: Math.max(0, sum(bv) + bBonus - (b.swaps || 0) * rules.swapCost),
    aColors: colorCounts(a), bColors: colorCounts(b), rules,
  };
}

function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function mkSide(deck, hand, awakeIds, isAi = false) { const d = shuffle(deck); return { slots: Array(SLOTS).fill(null), order: [], deck: d.slice(hand), hand: d.slice(0, hand), swaps: 0, awake: awakeIds || [], isAi }; }

// opts: { rules, pAwake: [ids], aiAwake: [ids] | 'all', first: 'p'|'ai' }
export function newMatch(playerDeck, aiDeck, opponent, opts = {}) {
  const rules = withRules(opts.rules);
  const first = opts.first || (Math.random() < 0.5 ? 'p' : 'ai');
  const aiAwake = opts.aiAwake ?? (rules.secretsOn ? 'all' : []);
  return { opponent, rules, turn: first, p: mkSide(playerDeck, rules.handSize, opts.pAwake), ai: mkSide(aiDeck, rules.handSize, aiAwake, true), done: false, lastMove: null, round: 1 };
}

export function place(match, who, handIndex, slot) {
  const side = match[who];
  if (side.slots[slot] || handIndex < 0 || handIndex >= side.hand.length) return false;
  const id = side.hand.splice(handIndex, 1)[0];
  side.slots[slot] = id; side.order.push(slot);
  if (side.deck.length) side.hand.push(side.deck.shift());
  if (match.rules?.reelChange && side.order.length === 3 && side.deck.length) { side.deck.push(...side.hand); side.hand = side.deck.splice(0, match.rules.handSize); side.reel = true; }
  match.lastMove = { who, slot, id };
  if (match.p.order.length === SLOTS && match.ai.order.length === SLOTS) match.done = true;
  else match.turn = who === 'p' ? 'ai' : 'p';
  match.round = Math.min(SLOTS, Math.max(match.p.order.length, match.ai.order.length) + (match.turn === 'p' ? 1 : 0));
  return true;
}

// Swap a hand gToon for the next one in the deck (costs rules.swapCost).
export function swap(match, who, handIndex) {
  const side = match[who];
  if (match.rules?.noSwap || !side.deck.length || handIndex < 0 || handIndex >= side.hand.length) return false;
  const old = side.hand[handIndex];
  side.hand[handIndex] = side.deck.shift();
  side.deck.push(old);
  side.swaps++;
  return true;
}

// Greedy AI with difficulty-scaled randomness. Opponents with `smart` also
// look one move ahead at the player's best reply from their hand.
export function aiChoose(match) {
  const side = match.ai;
  const empties = side.slots.map((s, i) => s ? -1 : i).filter(i => i >= 0);
  if (Math.random() > match.opponent.diff) {
    return { handIndex: Math.floor(Math.random() * side.hand.length), slot: empties[Math.floor(Math.random() * empties.length)] };
  }
  const rules = match.rules;
  let best = null;
  side.hand.forEach((id, hi) => {
    empties.forEach(slot => {
      const trial = { ...side, slots: side.slots.slice(), order: side.order.concat(slot) };
      trial.slots[slot] = id;
      let swing;
      if (match.opponent.smart) {
        // worst case over the player's replies
        const pEmpties = match.p.slots.map((s, i) => s ? -1 : i).filter(i => i >= 0);
        let worst = Infinity;
        match.p.hand.forEach(pid => pEmpties.forEach(ps => {
          const pt = { ...match.p, slots: match.p.slots.slice(), order: match.p.order.concat(ps) }; pt.slots[ps] = pid;
          const ev = evaluate(pt, trial, rules); worst = Math.min(worst, ev.bTotal - ev.aTotal);
        }));
        if (worst === Infinity) { const ev = evaluate(match.p, trial, rules); worst = ev.bTotal - ev.aTotal; }
        swing = worst + Math.random() * 0.5;
      } else {
        const ev = evaluate(match.p, trial, rules);
        swing = ev.bTotal - ev.aTotal + Math.random() * 1.5;
      }
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

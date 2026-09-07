// Balance simulation: greedy player stacks vs Train pools, players and Keepers.
// Usage: node scripts/sim.mjs [meetings per matchup=2000] [--check]
import * as B from '../js/meeting.js';
import { BY_ID, PACKABLE } from '../js/data.js';
import { REGIONS, STARTERS, GATHERING, HALL } from '../js/campaign.js';
const N = +(process.argv[2] || 2000); const CHECK = process.argv.includes('--check');
const rnd = Math.random;
function pool(node) {
  if (node.kind === 'train') { const p = PACKABLE.filter(t => t.rarity >= node.minR && t.rarity <= node.maxR); const out = []; while (out.length < 20) out.push(p[Math.floor(rnd() * p.length)].id); return out; }
  const pl = node.pool || {}; if (pl.fixed) return pl.fixed.slice();
  const c = PACKABLE.filter(t => t.rarity >= (pl.minR ?? 0) && t.rarity <= (pl.maxR ?? 4)); const out = []; const span = (pl.maxR ?? 4) - (pl.minR ?? 0) + 1;
  while (out.length < 20) { const r = (pl.minR ?? 0) + Math.floor(Math.pow(rnd(), 1.4) * span); const p = c.filter(t => t.rarity === r); const src = p.length ? p : c; out.push(src[Math.floor(rnd() * src.length)].id); }
  return out;
}
// Player stacks modelled on real play: the first stack plus pulls from each region's packs
// on the road so far (PULLS packs per region), then the best legal twenty of what is owned.
const PULLS = 6;
function rollPack(pack) {
  const out = [];
  for (let i = 0; i < pack.size; i++) {
    let r = 0, x = rnd(), acc = 0;
    for (let k = 0; k < pack.odds.length; k++) { acc += pack.odds[k]; if (x < acc) { r = k; break; } r = k; }
    if (i === 0 && r < pack.minRarity) r = pack.minRarity;
    if (pack.maxRarity != null && r > pack.maxRarity) r = pack.maxRarity;
    let pl = PACKABLE.filter(t => t.rarity === r); while (!pl.length && r > 0) { r--; pl = PACKABLE.filter(t => t.rarity === r); }
    out.push(pl[Math.floor(rnd() * pl.length)].id);
  }
  return out;
}
function legal(ids) { const list = ids.map(id => BY_ID[id]).sort(byPts); const out = []; const byForm = {}; let whole = 0; for (const t of list) { if (out.length >= 20) break; if ((byForm[t.char] || 0) >= 3) continue; if (t.series === 'whole' && whole) continue; out.push(t.id); byForm[t.char] = (byForm[t.char] || 0) + 1; if (t.series === 'whole') whole++; } return out; }
const byPts = (a, b) => b.pts - a.pts;
function roadStack(upTo) {
  let owned = STARTERS[0].chips.slice();
  for (let n = 1; n <= upTo; n++) { for (let k = 0; k < PULLS; k++) owned = owned.concat(rollPack(REGIONS[n - 1].pack)); if (n < upTo) owned.push(`one${n}`); }
  return legal(owned);
}
const stacks = { first: () => STARTERS[0].chips.slice() };
REGIONS.forEach(r => { stacks[`road${r.n}`] = () => roadStack(r.n); });
stacks.full = () => roadStack(7);
function play(pStack, node, opp) {
  const m = B.newMatch(pStack, pool(node), opp, { rules: node.rules, pAwake: [], heroP: null });
  const mover = (side) => B.aiChoose({ opponent: { diff: 1 }, rules: m.rules, ai: side === 'p' ? m.p : m.ai, p: side === 'p' ? m.ai : m.p });
  while (!m.done) { if (m.turn === 'p') { const mv = mover('p'); B.place(m, 'p', mv.handIndex, mv.slot); } else { const mv = B.aiChoose(m); B.place(m, 'ai', mv.handIndex, mv.slot); } }
  const ev = B.evaluate(m.p, m.ai, m.rules); return ev.aTotal > ev.bTotal ? 1 : 0;
}
function rate(mk, node, opp, n = N) { let w = 0; let st = mk(); for (let i = 0; i < n; i++) { if (i % 25 === 0) st = mk(); w += play(st, node, opp); } return Math.round(100 * w / n); }
const rows = []; const out = [];
out.push(`# Balance (${N} meetings per matchup)\n\nGreedy players on both sides. "first" is the first stack; "road N" is the best legal stack from light up to that region's tier; "full" is the best from everything.\n`);
out.push('| Region | Node | diff | first | road N | full |\n| --- | --- | --- | --- | --- | --- |');
for (const r of REGIONS) {
  const road = stacks[`road${r.n}`];
  for (const node of [r.train, ...r.npcs, r.gate]) {
    const opp = node.kind === 'train' ? { diff: Math.min(1, 0.5 + (r.n - 1) * 0.08), smart: false } : { diff: node.diff, smart: !!node.smart };
    const a = rate(stacks.first, node, opp), b = rate(road, node, opp), c = rate(stacks.full, node, opp);
    rows.push({ region: r.n, id: node.id, kind: node.kind, first: a, road: b, full: c });
    out.push(`| ${r.n} | ${node.id} ${node.kind} | ${opp.diff.toFixed(2)}${opp.smart ? '*' : ''} | ${a}% | ${b}% | ${c}% |`);
  }
}
for (const node of GATHERING.concat(HALL)) { const opp = { diff: node.diff, smart: !!node.smart }; const b = rate(stacks.road7, node, opp), c = rate(stacks.full, node, opp); rows.push({ region: 8, id: node.id, kind: node.kind, first: 0, road: b, full: c }); out.push(`| ${node.region} | ${node.id} ${node.kind} | ${opp.diff.toFixed(2)}* | – | ${b}% | ${c}% |`); }
const t1 = rows.find(x => x.id === 't1'), g1 = rows.find(x => x.id === 'g1'), g7 = rows.find(x => x.id === 'g7');
const checks = [
  ['first stack vs region-1 Train 75–85%', t1.first, 75, 85],
  ['Keeper 1 vs region-1 stack 45–55%', g1.road, 45, 55],
  ['Keeper 7 vs full-road stack 25–35%', g7.full, 25, 35],
];
const keeperRates = rows.filter(x => x.kind === 'keeper').map(x => x.road);
const monotonic = keeperRates.every((v, i) => i === 0 || v <= keeperRates[i - 1] + 8);
out.push('\n## Targets\n\n| Target | Result | Pass |\n| --- | --- | --- |');
let pass = true;
for (const [name, v, lo, hi] of checks) { const ok = v >= lo && v <= hi; pass = pass && ok; out.push(`| ${name} | ${v}% | ${ok ? 'yes' : 'no'} |`); }
out.push(`| Keeper curve monotonic (road stacks) | ${keeperRates.join(' → ')} | ${monotonic ? 'yes' : 'no'} |`);
pass = pass && monotonic;
const text = out.join('\n') + '\n';
console.log(text);
if (process.argv.includes('--write')) { const fs = await import('node:fs'); fs.writeFileSync(new URL('../docs/balance.md', import.meta.url), text); }
if (CHECK && !pass) { console.error('balance targets not met'); process.exit(1); }

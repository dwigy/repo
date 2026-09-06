// The Orbit Tour: seven zones in a loop that starts and ends at Orbit
// Station. Each zone has two challenges, a sparring partner and a Keeper.
// This file is the mechanics spec (decks, house rules, goals, rewards); the
// story cards live in story.js and are merged in by zone id.
//
// node.rules   -> house rules handed to the battle engine (see gtoons.js)
// node.goal    -> { type: 'win' | 'margin' | 'score' | 'sets', n }
// node.deck    -> constraint on the player's deck: { maxRarity, minTour, maxTotal, color, series }
// node.pool    -> how the opponent's deck is drawn: { series: [...], minR, maxR, fixed: [ids] }
// node.reward  -> { points, pack: 'std'|'prem'|'mega', chip: id }
import { STORY } from './story.js';

const K = (n, avatar, diff, pool, rules, reward, extra = {}) => ({ id: `k${n}`, kind: 'keeper', avatar, diff, pool, rules, goal: { type: 'win' }, reward, ...extra });
const C = (id, avatar, diff, pool, rules, goal, deck, reward) => ({ id, kind: 'challenge', avatar, diff, pool, rules, goal, deck, reward });
const S = (id, avatar, diff, pool) => ({ id, kind: 'spar', avatar, diff, pool, rules: {}, goal: { type: 'win' }, reward: { points: 40 } });

export const ZONES = [
  { id: 'inkwell', n: 1, series: 'ink', hue: '#6b6b6b', sky: ['#3a3a3a', '#8a8a8a', '#1c1c1c'],
    spar: S('s1', 'bimbo1', 0.3, { series: ['sil', 'fun', 'rub'], minR: 0, maxR: 0 }),
    challenges: [
      C('c1a', 'koko2', 0.4, { series: ['sil', 'rub', 'fun'], minR: 0, maxR: 0 }, {}, { type: 'win' }, { maxRarity: 1 }, { points: 150, chip: 'bobby1' }),
      C('c1b', 'betty2', 0.45, { series: ['ink', 'sil', 'rub'], minR: 0, maxR: 1 }, { noPowers: true }, { type: 'win' }, null, { points: 200, pack: 'std' }),
    ],
    keeper: K(1, 'koko3', 0.55, { fixed: ['koko3', 'koko2', 'koko1', 'bimbo2', 'bimbo1', 'betty2', 'betty1', 'felix2', 'gertie2', 'alfalfa2', 'bobby2', 'heeza1'] }, {}, { points: 400, pack: 'prem', chip: 'kp1' }) },

  { id: 'docks', n: 2, series: 'thm', hue: '#2e86c1', sky: ['#7fc8f8', '#2e86c1', '#0b3a5c'],
    spar: S('s2', 'olive1', 0.4, { series: ['thm', 'sil', 'rub'], minR: 0, maxR: 1 }),
    challenges: [
      C('c2a', 'olive2', 0.5, { series: ['thm', 'sil', 'rub'], minR: 0, maxR: 1 }, {}, { type: 'win' }, { maxColor: { color: 'blu', n: 1 } }, { points: 220, chip: 'heeza1' }),
      C('c2b', 'popeye2', 0.55, { series: ['thm', 'rub', 'sil'], minR: 0, maxR: 2 }, { rowBonus: { back: 4 } }, { type: 'margin', n: 6 }, null, { points: 260, pack: 'std' }),
    ],
    keeper: K(2, 'popeye3', 0.65, { fixed: ['popeye3', 'popeye2', 'popeye4', 'olive3', 'olive2', 'olive4', 'oswald2', 'oswald3', 'nemo2', 'julius2', 'bimbo2', 'bosko2'] }, { colorBonus: 10 }, { points: 550, pack: 'prem', chip: 'kp2' }) },

  { id: 'kounty', n: 3, series: 'fun', hue: '#d97706', sky: ['#fbbf24', '#d97706', '#7c2d12'],
    spar: S('s3', 'ignatz1', 0.5, { series: ['fun', 'sil'], minR: 0, maxR: 1 }),
    challenges: [
      C('c3a', 'ignatz3', 0.65, { fixed: ['ignatz3', 'ignatz2', 'ignatz1', 'buster2', 'buster1', 'pete2', 'heeza2', 'krazy1', 'krazy2', 'hooligan1', 'mutt1', 'jeff1'] }, { mult: { opp: 2, steal: 2, bomb: 2 } }, { type: 'win' }, null, { points: 260, chip: 'julius2' }),
      C('c3b', 'krazy3', 0.65, { series: ['fun', 'sil'], minR: 1, maxR: 2 }, { noSwap: true }, { type: 'win' }, { maxTotal: 72 }, { points: 300, pack: 'std' }),
    ],
    keeper: K(3, 'ignatz7', 0.78, { fixed: ['ignatz7', 'ignatz3', 'ignatz4', 'krazy3', 'krazy4', 'buster3', 'buster2', 'pete2', 'pete3', 'heeza3', 'hooligan3', 'mutt2'] }, { noSwap: true }, { points: 700, pack: 'prem', chip: 'kp3' }) },

  { id: 'slumber', n: 4, series: 'fun', hue: '#7c3aed', sky: ['#c4b5fd', '#7c3aed', '#1e1b4b'],
    spar: S('s4', 'nemo1', 0.55, { series: ['fun', 'lot'], minR: 0, maxR: 2 }),
    challenges: [
      C('c4a', 'nemo2', 0.7, { series: ['fun', 'ink'], minR: 1, maxR: 2 }, { flipRows: true }, { type: 'win' }, null, { points: 320, chip: 'minnie2' }),
      C('c4b', 'gertie3', 0.7, { series: ['sil', 'fun'], minR: 1, maxR: 3 }, { lastBonus: 8 }, { type: 'margin', n: 5 }, null, { points: 360, pack: 'prem' }),
    ],
    keeper: K(4, 'nemo6', 0.85, { fixed: ['nemo6', 'nemo4', 'nemo3', 'krazy6', 'krazy3', 'gertie4', 'gertie3', 'julius3', 'julius4', 'minnie3', 'oswald4', 'felix3'] }, { rowBonus: { back: 3 }, handSize: 4, secretsOn: true }, { points: 900, pack: 'prem', chip: 'kp4' }) },

  { id: 'lot', n: 5, series: 'lot', hue: '#2aa198', sky: ['#a7f3eb', '#2aa198', '#0f3d3a'],
    spar: S('s5', 'julius1', 0.6, { series: ['lot', 'rub'], minR: 1, maxR: 2 }),
    challenges: [
      C('c5a', 'pete3', 0.8, { mirror: true }, {}, { type: 'win' }, null, { points: 400, chip: 'horace3' }),
      C('c5b', 'willie3', 0.8, { series: ['rub', 'lot'], minR: 2, maxR: 3 }, {}, { type: 'win' }, { maxColor: { color: 'slv', n: 0 } }, { points: 450, pack: 'prem' }),
    ],
    keeper: K(5, 'oswald7', 0.9, { fixed: ['oswald7', 'oswald4', 'oswald3', 'willie3', 'willie2', 'pete3', 'pete2', 'julius3', 'clara3', 'horace3', 'minnie3', 'bosko3'] }, { noPowers: true, rowBonus: { back: 3 } }, { points: 1100, pack: 'mega', chip: 'kp5' }) },

  { id: 'funnies', n: 6, series: 'fun', hue: '#f4b942', sky: ['#fde68a', '#f4b942', '#6b3f00'],
    spar: S('s6', 'jeff1', 0.65, { series: ['fun'], minR: 1, maxR: 2 }),
    challenges: [
      C('c6a', 'mutt3', 0.85, { series: ['fun'], minR: 2, maxR: 3 }, { handSize: 4, openHand: true }, { type: 'win' }, null, { points: 480, chip: 'hooligan3' }),
      C('c6b', 'buster3', 0.85, { series: ['fun', 'sil'], minR: 2, maxR: 3 }, { colorSet: 2, colorBonus: 4 }, { type: 'sets', n: 3 }, null, { points: 520, pack: 'prem' }),
    ],
    keeper: K(6, 'mutt7', 0.95, { fixed: ['mutt7', 'mutt4', 'jeff4', 'jeff3', 'buster4', 'buster3', 'hooligan4', 'hooligan3', 'krazy5', 'ignatz5', 'nemo5', 'heeza4'] }, { openHand: true, colorSet: 2, colorBonus: 4 }, { points: 1300, pack: 'mega', chip: 'kp6' }, { smart: true }) },

  { id: 'station', n: 7, series: 'tour', hue: '#7b4dd6', sky: ['#0b1b3a', '#1f3d7a', '#0d2350'],
    spar: S('s7', 'felix2', 0.7, { minR: 1, maxR: 3 }),
    challenges: [
      C('c7a', 'alfalfa3', 0.9, { minR: 2, maxR: 4 }, { reelChange: true }, { type: 'win' }, { minTour: 3 }, { points: 600, chip: 'clara3' }),
      C('c7b', 'willie5', 0.9, { minR: 3, maxR: 4 }, { secretsOn: true }, { type: 'score', n: 50 }, null, { points: 700, pack: 'mega' }),
    ],
    keeper: K(7, 'felix7', 1.0, { fixed: ['felix7', 'felix8', 'popeye7', 'betty7', 'willie7', 'pete7', 'koko7', 'nemo7', 'oswald7', 'heeza7', 'mutt7', 'krazy7'] }, { secretsOn: true }, { points: 2500, pack: 'mega', chip: 'kp7' }, { smart: true }) },
];

// Merge story text by zone id and give every node its display fields.
ZONES.forEach((z, i) => {
  const st = (STORY.zones || []).find(s => s.id === z.id) || {};
  z.name = st.name || z.id; z.place = st.place || ''; z.tagline = st.tagline || '';
  z.story = { arrive: st.arrive || [], midway: st.midway || [], beforeKeeper: st.beforeKeeper || [], afterKeeper: st.afterKeeper || [] };
  const sk = st.keeper || {};
  Object.assign(z.keeper, { name: sk.name || `Keeper ${z.n}`, title: sk.title || 'Keeper', intro: sk.intro || '', taunt: sk.taunt || '', beaten: sk.beaten || '', zone: z.id });
  Object.assign(z.spar, { name: (st.spar && st.spar.name) || 'Sparring Partner', taunt: (st.spar && st.spar.line) || '', zone: z.id });
  z.challenges.forEach((c, j) => { const sc = (st.challenges || [])[j] || {}; Object.assign(c, { name: sc.name || `Challenge ${j + 1}`, kicker: sc.kicker || '', opponent: sc.opponent || 'Challenger', taunt: sc.line || '', zone: z.id }); });
  z.nodes = [z.challenges[0], z.challenges[1], z.spar, z.keeper];
});
export const NODES = Object.fromEntries(ZONES.flatMap(z => z.nodes.map(n => [n.id, n])));
export const zoneOf = (node) => ZONES.find(z => z.id === node.zone);
export const PROLOGUE = STORY.prologue || [];
export const EPILOGUE = STORY.epilogue || [];

// Human text for a rule set and a goal (title-card voice).
export function ruleText(r = {}) {
  const out = [];
  if (r.noPowers) out.push('NO POWERS. POINTS ONLY.');
  if (r.noSwap) out.push('NO SWAPS.');
  if (r.handSize && r.handSize !== 5) out.push(`HAND OF ${r.handSize}.`);
  if (r.colorSet && r.colorSet !== 3) out.push(`${r.colorSet} OF A COLOUR IS A SET.`);
  if (r.colorBonus && r.colorBonus !== 5) out.push(`SETS WORTH ${r.colorBonus}.`);
  if (r.rowBonus && r.rowBonus.back) out.push(`BACK ROW +${r.rowBonus.back}.`);
  if (r.rowBonus && r.rowBonus.front) out.push(`FRONT ROW +${r.rowBonus.front}.`);
  if (r.mult) out.push('BRICKS, JABS AND STEALS COUNT DOUBLE.');
  if (r.flipRows) out.push('FRONT IS BACK. BACK IS FRONT.');
  if (r.lastBonus) out.push(`LAST CHIP PLAYED +${r.lastBonus}.`);
  if (r.reelChange) out.push('HANDS REDRAW AFTER THREE PLAYS.');
  if (r.openHand) out.push('THEIR HAND IS FACE UP.');
  if (r.secretsOn) out.push('THEIR SECRET POWERS ARE AWAKE.');
  return out;
}
export function goalText(g = { type: 'win' }) {
  switch (g.type) {
    case 'margin': return `WIN BY ${g.n} OR MORE`;
    case 'score':  return `WIN WITH ${g.n} POINTS OR MORE`;
    case 'sets':   return `WIN WITH ${g.n} COLOUR SET${g.n > 1 ? 'S' : ''}`;
    default:       return 'WIN THE MATCH';
  }
}
export function deckText(d) {
  if (!d) return '';
  const out = [];
  if (d.maxRarity === 0) out.push('COMMONS ONLY');
  else if (d.maxRarity != null) out.push(`${['COMMON', 'UNCOMMON', 'RARE', 'MYTHIC'][d.maxRarity]} OR BELOW`);
  if (d.maxTotal) out.push(`DECK TOTAL ${d.maxTotal} POINTS OR LESS`);
  if (d.minTour) out.push(`AT LEAST ${d.minTour} KEEPER'S FRAMES`);
  if (d.maxColor) out.push(d.maxColor.n === 0 ? `NO ${d.maxColor.color === 'slv' ? 'SILVER' : d.maxColor.color.toUpperCase()}` : `AT MOST ${d.maxColor.n} ${d.maxColor.color === 'blu' ? 'BLUE' : d.maxColor.color.toUpperCase()}`);
  if (d.color) out.push(`${d.color.toUpperCase()} ONLY`);
  if (d.series) out.push(`${d.series.toUpperCase()} ONLY`);
  return out.join(' · ');
}

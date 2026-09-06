// The campaign: seven regions in order, each a themed page with Train, Shop,
// three NPCs, a Gatekeeper and places to Explore. After all seven, the three
// Heroes. All names are placeholders in brackets until branding lands.
//
// node.kind     -> 'npc' | 'gate' | 'hero' | 'train'
// node.rules    -> house rules handed to the battle engine (see gtoons.js)
// node.pool     -> how the opponent's stack is drawn: { fixed: [ids] } or { minR, maxR, series }
// place.kind    -> 'lore' | 'find' | 'game'   (explore places)
import { LORE } from './story.js';

const NPC = (id, region, avatar, diff, pool, rules = {}, reward = {}) => ({ id, kind: 'npc', region, avatar, diff, pool, rules, reward: { coins: 120, ...reward } });
const GATE = (n, avatar, diff, fixed, rules, smart = false) => ({ id: `g${n}`, kind: 'gate', region: n, avatar, diff, smart, pool: { fixed }, rules, reward: { coins: 400 + n * 150, one: `one${n}`, badge: `region${n}` } });
const HERO = (n, avatar, diff, fixed, rules) => ({ id: `h${n}`, kind: 'hero', region: 8, avatar, diff, smart: true, pool: { fixed }, rules, reward: { coins: 1500 } });
const TRAIN = (n, minR, maxR) => ({ id: `t${n}`, kind: 'train', region: n, minR, maxR, coins: 40 + n * 15 });
const PLACE = (id, kind, name, reward = {}) => ({ id, kind, name, reward });

// Region-only packs: better odds and level than the open shop at that tier.
const RPACK = (n, price, size, odds, minRarity, maxRarity) => ({ id: `rp${n}`, region: n, name: `[REGION ${n}] Pack`, price, size, odds, minRarity, maxRarity, desc: `${size} chips. Only sold in [REGION ${n}].` });

export const REGIONS = [
  { n: 1, id: 'r1', name: '[REGION 1]', theme: { hue: '#2f7ff5', sky: ['#a9cdf5', '#2f7ff5', '#0f2f66'] },
    train: TRAIN(1, 0, 0), pack: RPACK(1, 250, 3, [0.70, 0.30, 0, 0, 0], 0, 1),
    npcs: [NPC('n1a', 1, 'delta1', 0.4, { minR: 0, maxR: 0 }), NPC('n1b', 1, 'echo1', 0.45, { minR: 0, maxR: 0 }), NPC('n1c', 1, 'foxtrot2', 0.5, { minR: 0, maxR: 1 })],
    gate: GATE(1, 'delta3', 0.6, ['delta3', 'delta2', 'delta1', 'echo2', 'echo1', 'echo3', 'foxtrot2', 'foxtrot1', 'foxtrot3', 'alpha2', 'bravo2', 'charlie2'], {}),
    places: [PLACE('p1a', 'lore', '[Place 1-1]'), PLACE('p1b', 'find', '[Place 1-2]', { chip: 'papa1' }), PLACE('p1c', 'game', '[Place 1-3]', { coins: 80 })] },
  { n: 2, id: 'r2', name: '[REGION 2]', theme: { hue: '#2e86c1', sky: ['#7fc8f8', '#2e86c1', '#0b3a5c'] },
    train: TRAIN(2, 0, 1), pack: RPACK(2, 400, 3, [0.45, 0.45, 0.10, 0, 0], 1, 2),
    npcs: [NPC('n2a', 2, 'hotel1', 0.5, { minR: 0, maxR: 1 }), NPC('n2b', 2, 'hotel2', 0.55, { minR: 0, maxR: 1 }, { rowBonus: { back: 4 } }), NPC('n2c', 2, 'golf2', 0.6, { minR: 1, maxR: 2 }, { noSwap: true })],
    gate: GATE(2, 'golf3', 0.7, ['golf3', 'golf2', 'golf4', 'hotel3', 'hotel2', 'hotel4', 'india2', 'india3', 'oscar2', 'romeo2', 'echo2', 'kilo2'], { colorBonus: 10 }),
    places: [PLACE('p2a', 'lore', '[Place 2-1]'), PLACE('p2b', 'game', '[Place 2-2]', { coins: 120 }), PLACE('p2c', 'find', '[Place 2-3]', { chip: 'quebec1' })] },
  { n: 3, id: 'r3', name: '[REGION 3]', theme: { hue: '#d97706', sky: ['#fbbf24', '#d97706', '#7c2d12'] },
    train: TRAIN(3, 0, 2), pack: RPACK(3, 600, 4, [0.35, 0.40, 0.22, 0.03, 0], 1, 3),
    npcs: [NPC('n3a', 3, 'november1', 0.6, { minR: 0, maxR: 2 }), NPC('n3b', 3, 'november3', 0.65, { fixed: ['november3', 'november2', 'november1', 'zulu2', 'zulu1', 'sierra2', 'quebec2', 'mike1', 'mike2', 'yankee1', 'whiskey1', 'xray1'] }, { mult: { opp: 2, steal: 2, bomb: 2 } }), NPC('n3c', 3, 'mike3', 0.65, { minR: 1, maxR: 2 }, { noSwap: true })],
    gate: GATE(3, 'november7', 0.78, ['november7', 'november3', 'november4', 'mike3', 'mike4', 'zulu3', 'zulu2', 'sierra2', 'sierra3', 'quebec3', 'yankee3', 'whiskey2'], { noSwap: true }),
    places: [PLACE('p3a', 'find', '[Place 3-1]', { chip: 'romeo2' }), PLACE('p3b', 'lore', '[Place 3-2]'), PLACE('p3c', 'game', '[Place 3-3]', { coins: 160 })] },
  { n: 4, id: 'r4', name: '[REGION 4]', theme: { hue: '#7c3aed', sky: ['#c4b5fd', '#7c3aed', '#1e1b4b'] },
    train: TRAIN(4, 1, 2), pack: RPACK(4, 800, 4, [0.20, 0.40, 0.30, 0.09, 0.01], 2, 4),
    npcs: [NPC('n4a', 4, 'oscar1', 0.65, { minR: 1, maxR: 2 }), NPC('n4b', 4, 'oscar2', 0.7, { minR: 1, maxR: 2 }, { flipRows: true }), NPC('n4c', 4, 'bravo3', 0.7, { minR: 1, maxR: 3 }, { lastBonus: 8 })],
    gate: GATE(4, 'oscar6', 0.85, ['oscar6', 'oscar4', 'oscar3', 'mike6', 'mike3', 'bravo4', 'bravo3', 'romeo3', 'romeo4', 'victor3', 'india4', 'alpha3'], { rowBonus: { back: 3 }, handSize: 4, secretsOn: true }),
    places: [PLACE('p4a', 'game', '[Place 4-1]', { coins: 200 }), PLACE('p4b', 'lore', '[Place 4-2]'), PLACE('p4c', 'find', '[Place 4-3]', { chip: 'victor2' })] },
  { n: 5, id: 'r5', name: '[REGION 5]', theme: { hue: '#2aa198', sky: ['#a7f3eb', '#2aa198', '#0f3d3a'] },
    train: TRAIN(5, 1, 3), pack: RPACK(5, 1100, 4, [0.10, 0.35, 0.38, 0.15, 0.02], 2, 4),
    npcs: [NPC('n5a', 5, 'romeo1', 0.7, { minR: 1, maxR: 3 }), NPC('n5b', 5, 'sierra3', 0.8, { mirror: true }), NPC('n5c', 5, 'juliett3', 0.8, { minR: 2, maxR: 3 }, { noPowers: true })],
    gate: GATE(5, 'india7', 0.9, ['india7', 'india4', 'india5', 'juliett4', 'juliett3', 'sierra4', 'sierra3', 'romeo4', 'tango3', 'uniform3', 'victor4', 'kilo3'], { noPowers: true, rowBonus: { back: 3 } }),
    places: [PLACE('p5a', 'lore', '[Place 5-1]'), PLACE('p5b', 'find', '[Place 5-2]', { chip: 'uniform3' }), PLACE('p5c', 'game', '[Place 5-3]', { coins: 240 })] },
  { n: 6, id: 'r6', name: '[REGION 6]', theme: { hue: '#f4b942', sky: ['#fde68a', '#f4b942', '#6b3f00'] },
    train: TRAIN(6, 1, 3), pack: RPACK(6, 1500, 5, [0.05, 0.30, 0.40, 0.21, 0.04], 3, 4),
    npcs: [NPC('n6a', 6, 'xray1', 0.75, { minR: 1, maxR: 3 }), NPC('n6b', 6, 'whiskey3', 0.85, { minR: 2, maxR: 3 }, { handSize: 4, openHand: true }), NPC('n6c', 6, 'zulu3', 0.85, { minR: 2, maxR: 3 }, { colorSet: 2, colorBonus: 4 })],
    gate: GATE(6, 'whiskey7', 0.95, ['whiskey7', 'whiskey4', 'xray4', 'xray3', 'zulu4', 'zulu3', 'yankee4', 'yankee3', 'mike5', 'november5', 'oscar5', 'quebec4'], { openHand: true, colorSet: 2, colorBonus: 4 }, true),
    places: [PLACE('p6a', 'find', '[Place 6-1]', { chip: 'yankee3' }), PLACE('p6b', 'game', '[Place 6-2]', { coins: 300 }), PLACE('p6c', 'lore', '[Place 6-3]')] },
  { n: 7, id: 'r7', name: '[REGION 7]', theme: { hue: '#7b4dd6', sky: ['#0b1b3a', '#1f3d7a', '#0d2350'] },
    train: TRAIN(7, 2, 3), pack: RPACK(7, 2200, 5, [0, 0.25, 0.40, 0.28, 0.07], 3, 4),
    npcs: [NPC('n7a', 7, 'alpha2', 0.8, { minR: 2, maxR: 3 }), NPC('n7b', 7, 'charlie3', 0.9, { minR: 2, maxR: 4 }, { reelChange: true }), NPC('n7c', 7, 'juliett5', 0.9, { minR: 3, maxR: 4 }, { secretsOn: true })],
    gate: GATE(7, 'alpha7', 1.0, ['alpha7', 'alpha8', 'golf7', 'foxtrot7', 'juliett7', 'sierra7', 'delta7', 'oscar7', 'india7', 'quebec7', 'whiskey7', 'mike7'], { secretsOn: true }, true),
    places: [PLACE('p7a', 'lore', '[Place 7-1]'), PLACE('p7b', 'game', '[Place 7-2]', { coins: 400 }), PLACE('p7c', 'find', '[Place 7-3]', { chip: 'tango3' })] },
];
export const HEROES = [
  HERO(1, 'golf8', 1.0, ['golf8', 'golf7', 'hotel7', 'hotel8', 'india8', 'kilo7', 'lima7', 'echo8', 'delta8', 'foxtrot8', 'romeo7', 'sierra8'], { colorBonus: 8 }),
  HERO(2, 'mike8', 1.0, ['mike8', 'november8', 'oscar8', 'bravo8', 'zulu8', 'yankee8', 'whiskey8', 'xray8', 'quebec8', 'papa8', 'tango8', 'uniform8'], { secretsOn: true, lastBonus: 6 }),
  HERO(3, 'alpha8', 1.0, ['alpha8', 'alpha7', 'juliett8', 'victor8', 'charlie8', 'golf8', 'oscar8', 'sierra8', 'india8', 'foxtrot8', 'whiskey8', 'delta8'], { secretsOn: true, reelChange: true }),
];
// Five starter stacks. Every hero chip's ability is +X if played first.
export const STARTERS = [
  { id: 'st1', name: '[STACK A]', hero: 'alpha1', color: 'slv', chips: ['alpha1', 'delta1', 'echo1', 'juliett1', 'romeo1', 'foxtrot1', 'bravo1', 'papa1', 'kilo1', 'lima1', 'india1', 'golf1'] },
  { id: 'st2', name: '[STACK B]', hero: 'golf1', color: 'blu', chips: ['golf1', 'hotel1', 'india1', 'oscar1', 'juliett1', 'romeo1', 'alpha1', 'kilo1', 'bravo1', 'foxtrot1', 'echo1', 'papa1'] },
  { id: 'st3', name: '[STACK C]', hero: 'november1', color: 'org', chips: ['november1', 'quebec1', 'yankee1', 'uniform1', 'papa1', 'zulu1', 'mike1', 'lima1', 'bravo1', 'golf1', 'hotel1', 'alpha1'] },
  { id: 'st4', name: '[STACK D]', hero: 'mike1', color: 'prp', chips: ['mike1', 'oscar1', 'victor1', 'bravo1', 'lima1', 'whiskey1', 'xray1', 'juliett1', 'delta1', 'foxtrot1', 'india1', 'papa1'] },
  { id: 'st5', name: '[STACK E]', hero: 'sierra1', color: 'red', chips: ['sierra1', 'hotel1', 'zulu1', 'victor1', 'foxtrot1', 'india1', 'kilo1', 'papa1', 'quebec1', 'alpha1', 'oscar1', 'bravo1'] },
];
export const HERO_FIRST = { t: 'first', n: 6 }; // every starter hero gets this power while it leads its stack
export const REGION_PACKS = REGIONS.map(r => r.pack);
export const NODES = {};
REGIONS.forEach(r => { r.npcs.forEach(n => { NODES[n.id] = n; }); NODES[r.gate.id] = r.gate; NODES[r.train.id] = r.train; r.places.forEach(p => { NODES[p.id] = p; p.region = r.n; }); });
HEROES.forEach(h => { NODES[h.id] = h; });
export const regionOf = (node) => REGIONS[(node.region || 1) - 1];
export const totalExplore = REGIONS.reduce((a, r) => a + r.places.length, 0);

// Story text lookups (placeholders live in story.js)
export const lore = (key, fallback = '') => LORE[key] || fallback;

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

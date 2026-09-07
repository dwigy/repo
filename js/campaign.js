// The road: seven regions in order, each a town and the country around it, with a
// shop, three players worth meeting, places to explore and one Keeper. Then the
// Gathering at the foot of the Summit, and after seven Seals, the Hall.
//
// Names come from the lexicon; copy comes from story.js by key. This file is mechanics.
// node.kind   -> 'npc' | 'keeper' | 'corp' | 'buyer' | 'hall' | 'train' | 'lore' | 'find' | 'game'
// node.rules  -> house rules handed to the engine (see meeting.js)
// node.pool   -> how the opponent's stack is drawn: { fixed: [ids] } (padded to twenty) or { minR, maxR }
import { LORE } from './story.js';
import { WORLD, region as regionOf_ } from './lexicon.js';
import { BY_ID, PACKABLE } from './data.js';

// Keeper conditions (PROPOSAL, behind config): a Keeper meeting needs the region's house
// rule, the bow, and a balanced stack. Unbalanced stacks are declined, no penalty.
export const KEEPER_RULES = { bow: true, bowMs: 600, maxRareUp: 6, maxWhole: 1 };

// Fixed stacks list twelve signature companions; the rest of the twenty are lower
// editions of the same forms, so an opponent's stack is theirs all the way down.
export function padStack(ids, size = 20) {
  const out = ids.slice();
  let n = 8;
  while (out.length < size && n > 0) {
    for (const id of ids) { if (out.length >= size) break; const t = BY_ID[id]; if (!t || !t.char) continue; const m = t.id.match(/^([a-z]+)(\d)$/); if (!m) continue; const e = Math.max(1, +m[2] - Math.ceil((9 - n) / 2)); const alt = `${m[1]}${Math.max(1, Math.min(8, e))}`; if (BY_ID[alt] && out.filter(x => x === alt).length < 3 && out.filter(x => BY_ID[x].char === t.char).length < 3) out.push(alt); }
    n--;
  }
  // last resort: commons of any form
  const commons = PACKABLE.filter(t => t.rarity === 0);
  while (out.length < size) out.push(commons[out.length % commons.length].id);
  return out;
}
const NPC = (id, region, avatar, diff, pool, rules = {}, reward = {}) => ({ id, kind: 'npc', region, avatar, diff, pool, rules, reward: { coins: 120, ...reward } });
const KEEPER = (n, avatar, diff, fixed, rules, telling, title, smart = false) => ({ id: `g${n}`, kind: 'keeper', region: n, avatar, diff, smart, pool: { fixed: padStack(fixed) }, rules, telling, title, reward: { coins: 400 + n * 150, whole: `one${n}`, seal: `region${n}`, pack: `rp${n}` } });
const CORP = (id, region, role, avatar, diff, fixed, rules, extra = {}) => ({ id, kind: 'corp', region, role, avatar, diff, pool: fixed ? { fixed: padStack(fixed) } : { minR: 1, maxR: 3 }, rules, reward: { coins: 300 }, ...extra });
const HALL_ONE = (n, avatar, diff, fixed, rules) => ({ id: `h${n}`, kind: 'hall', region: 8, seat: n, avatar, diff, smart: true, pool: { fixed: padStack(fixed) }, rules, reward: { coins: 1500 } });
const TRAIN = (n, minR, maxR) => ({ id: `t${n}`, kind: 'train', region: n, minR, maxR, coins: 40 + n * 15 });
const PLACE = (id, kind, reward = {}) => ({ id, kind, reward });
// Region-only packs: that town's blanks. Better light than the open shop at the same tier.
const RPACK = (n, price, size, odds, minRarity, maxRarity) => ({ id: `rp${n}`, region: n, price, size, odds, minRarity, maxRarity });

const R = (n) => regionOf_(n);
export const REGIONS = [
  { n: 1, id: 'r1', ...R(1), theme: { hue: R(1).hue, sky: ['#ffb4a8', R(1).hue, '#5a0a08'] },
    shop: { name: 'The Cellar Door', craft: 'potter' }, players: ['the miller\'s apprentice', 'a kid with a kite', 'the grandmother on the corner bench'],
    train: TRAIN(1, 0, 0), pack: RPACK(1, 250, 3, [0.70, 0.30, 0, 0, 0], 0, 1),
    npcs: [NPC('n1a', 1, 'delta1', 0.4, { minR: 0, maxR: 0 }), NPC('n1b', 1, 'bravo1', 0.45, { minR: 0, maxR: 0 }), NPC('n1c', 1, 'charlie2', 0.5, { minR: 0, maxR: 1 })],
    gate: KEEPER(1, 'delta3', 0.3, ['delta3', 'delta2', 'delta4', 'bravo2', 'bravo3', 'bravo4', 'charlie2', 'charlie3', 'charlie1', 'alpha2', 'golf2', 'mike2'], {}, 'luck', 'the Baker'),
    places: [PLACE('p1a', 'lore'), PLACE('p1b', 'find', { chip: 'papa1' }), PLACE('p1c', 'game', { coins: 80 })] },
  { n: 2, id: 'r2', ...R(2), theme: { hue: R(2).hue, sky: ['#ffd9a8', R(2).hue, '#6b2a00'] },
    shop: { name: 'Blanks by the Ferry', craft: 'driftwood turner' }, players: ['the ferry cook', 'a dockhand who whistles', 'the bridge toll collector'],
    train: TRAIN(2, 0, 1), pack: RPACK(2, 400, 3, [0.45, 0.45, 0.10, 0, 0], 1, 2),
    npcs: [NPC('n2a', 2, 'hotel1', 0.5, { minR: 0, maxR: 1 }), NPC('n2b', 2, 'echo2', 0.55, { minR: 0, maxR: 1 }, { rowBonus: { back: 4 } }), NPC('n2c', 2, 'foxtrot2', 0.6, { minR: 1, maxR: 2 }, { noSwap: true })],
    gate: KEEPER(2, 'hotel3', 0.6, ['hotel3', 'hotel2', 'echo3', 'echo2', 'foxtrot2', 'foxtrot3', 'golf2', 'sierra2', 'delta2', 'kilo2', 'alpha2', 'mike2'], { colorBonus: 8 }, 'seed', 'the Pilot'),
    corp: { id: 'c2', kind: 'buyer', region: 2, offer: 900 },
    places: [PLACE('p2a', 'lore'), PLACE('p2b', 'game', { coins: 120 }), PLACE('p2c', 'find', { chip: 'quebec1' })] },
  { n: 3, id: 'r3', ...R(3), theme: { hue: R(3).hue, sky: ['#fff2a8', R(3).hue, '#7a5a00'] },
    shop: { name: 'The Kiln', craft: 'glassblower' }, players: ['the bellows hand', 'a tiler with burnt hands', 'the scrapyard grandmother'],
    train: TRAIN(3, 0, 2), pack: RPACK(3, 600, 4, [0.35, 0.40, 0.22, 0.03, 0], 1, 3),
    npcs: [NPC('n3a', 3, 'india1', 0.6, { minR: 0, maxR: 2 }), NPC('n3b', 3, 'juliett3', 0.65, { fixed: padStack(['juliett3', 'juliett2', 'juliett1', 'kilo2', 'kilo1', 'india2', 'sierra2', 'mike1', 'mike2', 'november1', 'golf1', 'alpha1']) }, { mult: { opp: 2, steal: 2, bomb: 2 } }), NPC('n3c', 3, 'kilo3', 0.65, { minR: 1, maxR: 2 }, { noSwap: true })],
    gate: KEEPER(3, 'india7', 0.55, ['india7', 'india3', 'india4', 'juliett3', 'juliett4', 'kilo3', 'kilo2', 'sierra2', 'sierra3', 'november3', 'mike3', 'golf2'], { noSwap: true }, null, 'the Smith'),
    places: [PLACE('p3a', 'find', { chip: 'romeo2' }), PLACE('p3b', 'lore'), PLACE('p3c', 'game', { coins: 160 })] },
  { n: 4, id: 'r4', ...R(4), theme: { hue: R(4).hue, sky: ['#c8ffb0', R(4).hue, '#0f4a08'] },
    shop: { name: 'The Pressing House', craft: 'woodturner' }, players: ['the orchard picker', 'the cider presser', 'a kid up a tree'],
    train: TRAIN(4, 1, 2), pack: RPACK(4, 800, 4, [0.20, 0.40, 0.30, 0.09, 0.01], 2, 4),
    npcs: [NPC('n4a', 4, 'lima1', 0.65, { minR: 1, maxR: 2 }), NPC('n4b', 4, 'oscar2', 0.7, { minR: 1, maxR: 2 }, { flipRows: true }), NPC('n4c', 4, 'papa3', 0.7, { minR: 1, maxR: 3 }, { lastBonus: 8 })],
    gate: KEEPER(4, 'oscar7', 1.0, ['oscar7', 'oscar6', 'oscar5', 'lima6', 'lima5', 'papa6', 'papa5', 'mike5', 'mike4', 'november5', 'alpha5', 'golf5'], { rowBonus: { back: 3 }, handSize: 4, secretsOn: true }, 'love', 'the Beekeeper', true),
    corp: CORP('c4', 4, 'baker', 'delta4', 0.72, ['delta4', 'delta3', 'delta2', 'bravo3', 'bravo2', 'charlie3', 'charlie2', 'alpha3', 'golf3', 'mike2', 'november2', 'sierra2'], { noSwap: true }),
    places: [PLACE('p4a', 'game', { coins: 200 }), PLACE('p4b', 'lore'), PLACE('p4c', 'find', { chip: 'victor2' })] },
  { n: 5, id: 'r5', ...R(5), theme: { hue: R(5).hue, sky: ['#b8dcff', R(5).hue, '#0a2a6b'] },
    shop: { name: 'Blanks Under the Bells', craft: 'bronze caster' }, players: ['the bell ringer', 'the late-night radio host', 'the bus driver on the night route'],
    train: TRAIN(5, 1, 3), pack: RPACK(5, 1100, 4, [0.10, 0.35, 0.38, 0.15, 0.02], 2, 4),
    npcs: [NPC('n5a', 5, 'quebec1', 0.7, { minR: 1, maxR: 3 }), NPC('n5b', 5, 'romeo3', 0.8, { mirror: true }), NPC('n5c', 5, 'tango3', 0.8, { minR: 2, maxR: 3 }, { noPowers: true })],
    gate: KEEPER(5, 'romeo7', 1.0, ['romeo7', 'romeo6', 'romeo5', 'quebec6', 'quebec5', 'tango6', 'tango5', 'sierra6', 'mike6', 'november5', 'alpha5', 'golf5'], { noPowers: true, rowBonus: { back: 3 } }, 'mirror', 'the Singer', true),
    places: [PLACE('p5a', 'lore'), PLACE('p5b', 'find', { chip: 'uniform3' }), PLACE('p5c', 'game', { coins: 240 })] },
  { n: 6, id: 'r6', ...R(6), theme: { hue: R(6).hue, sky: ['#c9c2ff', R(6).hue, '#120a40'] },
    shop: { name: 'The Lens Room', craft: 'lens grinder' }, players: ['the night porter', 'the star chart clerk', 'a kid with a paper telescope'],
    train: TRAIN(6, 1, 3), pack: RPACK(6, 1500, 5, [0.05, 0.30, 0.40, 0.21, 0.04], 3, 4),
    npcs: [NPC('n6a', 6, 'uniform1', 0.75, { minR: 1, maxR: 3 }), NPC('n6b', 6, 'victor3', 0.85, { minR: 2, maxR: 3 }, { handSize: 4, openHand: true }), NPC('n6c', 6, 'whiskey3', 0.85, { minR: 2, maxR: 3 }, { colorSet: 2, colorBonus: 4 })],
    gate: KEEPER(6, 'whiskey7', 0.9, ['whiskey7', 'whiskey4', 'victor4', 'victor3', 'uniform4', 'uniform3', 'mike5', 'november5', 'sierra5', 'alpha5', 'golf5', 'quebec4'], { colorSet: 2, colorBonus: 4, secretsOn: true }, 'sleep', 'the Astronomer', true),
    corp: CORP('c6', 6, 'pilot', 'hotel5', 0.88, ['hotel5', 'hotel4', 'echo5', 'echo4', 'foxtrot4', 'foxtrot3', 'golf4', 'sierra4', 'alpha4', 'mike4', 'delta4', 'kilo4'], { noSwap: true, lastBonus: 6 }),
    places: [PLACE('p6a', 'find', { chip: 'yankee3' }), PLACE('p6b', 'game', { coins: 300 }), PLACE('p6c', 'lore')] },
  { n: 7, id: 'r7', ...R(7), theme: { hue: R(7).hue, sky: ['#ffffff', R(7).hue, '#1a0630'] },
    shop: { name: 'The Last Door', craft: 'candle dipper' }, players: ['the door warden', 'the weather reader', 'the one who sweeps the steps'],
    train: TRAIN(7, 2, 3), pack: RPACK(7, 2200, 5, [0, 0.25, 0.40, 0.28, 0.07], 3, 4),
    npcs: [NPC('n7a', 7, 'xray2', 0.8, { minR: 2, maxR: 3 }), NPC('n7b', 7, 'yankee3', 0.9, { minR: 2, maxR: 4 }, { reelChange: true }), NPC('n7c', 7, 'zulu5', 0.9, { minR: 3, maxR: 4 }, { secretsOn: true })],
    gate: KEEPER(7, 'zulu7', 0.7, ['zulu7', 'zulu8', 'xray7', 'yankee7', 'alpha7', 'golf7', 'mike7', 'november7', 'sierra7', 'whiskey7', 'romeo7', 'delta7'], { secretsOn: true }, null, 'the Keeper of the Summit', true),
    places: [PLACE('p7a', 'lore'), PLACE('p7b', 'game', { coins: 400 }), PLACE('p7c', 'find', { chip: 'tango3' })] },
];
// The Gathering: a hidden eighth place at the foot of the Summit. Two meetings in a row.
export const GATHERING = [
  CORP('c7a', 7, 'astronomer', 'whiskey6', 1.0, ['whiskey6', 'whiskey5', 'victor6', 'victor5', 'uniform6', 'uniform5', 'mike6', 'november6', 'sierra6', 'alpha6', 'golf6', 'romeo6'], { openHand: false, secretsOn: true }, { smart: true, stage: 1 }),
  CORP('c7b', 7, 'chief', 'zulu6', 1.0, ['zulu6', 'zulu5', 'xray6', 'xray5', 'yankee6', 'yankee5', 'alpha6', 'golf6', 'mike6', 'november6', 'sierra6', 'whiskey6'], { secretsOn: true, handSize: 4 }, { smart: true, stage: 2, reward: { coins: 2000 } }),
];
// The Hall's three: three of the twelve test each arrival.
export const HALL = [
  HALL_ONE(1, 'golf8', 0.6, ['golf8', 'golf7', 'hotel7', 'hotel8', 'india8', 'kilo7', 'lima7', 'echo8', 'delta8', 'foxtrot8', 'romeo7', 'sierra8'], { colorBonus: 8 }),
  HALL_ONE(2, 'mike8', 1.0, ['mike8', 'november8', 'oscar8', 'bravo8', 'zulu8', 'yankee8', 'whiskey8', 'xray8', 'quebec8', 'papa8', 'tango8', 'uniform8'], { secretsOn: true, lastBonus: 6 }),
  HALL_ONE(3, 'alpha8', 0.6, ['alpha8', 'alpha7', 'juliett7', 'victor7', 'charlie7', 'golf7', 'oscar7', 'sierra7', 'india7', 'foxtrot7', 'whiskey7', 'delta7'], { reelChange: true }),
];
export const HEROES = HALL;
// Five first stacks. Twenty companions, one wanderer in front. Every leader gets +X when played first.
const S20 = (hero, rest) => [hero].concat(rest);
export const STARTERS = [
  { id: 'st1', name: 'the first stack', hero: 'alpha1', color: 'slv', chips: S20('alpha1', ['delta1', 'echo1', 'juliett1', 'romeo1', 'foxtrot1', 'bravo1', 'papa1', 'kilo1', 'lima1', 'india1', 'golf1', 'alpha2', 'delta2', 'echo2', 'bravo2', 'kilo2', 'charlie1', 'hotel1', 'oscar1']) },
  { id: 'st2', name: 'the second stack', hero: 'golf1', color: 'blu', chips: S20('golf1', ['hotel1', 'india1', 'oscar1', 'juliett1', 'romeo1', 'alpha1', 'kilo1', 'bravo1', 'foxtrot1', 'echo1', 'papa1', 'golf2', 'hotel2', 'india2', 'oscar2', 'juliett2', 'charlie1', 'delta1', 'lima1']) },
  { id: 'st3', name: 'the third stack', hero: 'november1', color: 'org', chips: S20('november1', ['quebec1', 'yankee1', 'uniform1', 'papa1', 'zulu1', 'mike1', 'lima1', 'bravo1', 'golf1', 'hotel1', 'alpha1', 'november2', 'quebec2', 'yankee2', 'uniform2', 'zulu2', 'charlie1', 'delta1', 'echo1']) },
  { id: 'st4', name: 'the fourth stack', hero: 'mike1', color: 'prp', chips: S20('mike1', ['oscar1', 'victor1', 'bravo1', 'lima1', 'whiskey1', 'xray1', 'juliett1', 'delta1', 'foxtrot1', 'india1', 'papa1', 'mike2', 'oscar2', 'victor2', 'whiskey2', 'xray2', 'charlie1', 'echo1', 'kilo1']) },
  { id: 'st5', name: 'the fifth stack', hero: 'sierra1', color: 'red', chips: S20('sierra1', ['hotel1', 'zulu1', 'victor1', 'foxtrot1', 'india1', 'kilo1', 'papa1', 'quebec1', 'alpha1', 'oscar1', 'bravo1', 'sierra2', 'hotel2', 'zulu2', 'victor2', 'foxtrot2', 'charlie1', 'delta1', 'lima1']) },
];
export const HERO_FIRST = { t: 'first', n: 6 };
export const REGION_PACKS = REGIONS.map(r => r.pack);
export const NODES = {};
REGIONS.forEach(r => { r.npcs.forEach(n => { NODES[n.id] = n; }); NODES[r.gate.id] = r.gate; NODES[r.train.id] = r.train; r.places.forEach(p => { NODES[p.id] = p; p.region = r.n; }); if (r.corp) NODES[r.corp.id] = r.corp; });
GATHERING.forEach(c => { NODES[c.id] = c; });
HALL.forEach(h => { NODES[h.id] = h; });
export const regionOf = (node) => REGIONS[(node.region || 1) - 1];
export const totalExplore = REGIONS.reduce((a, r) => a + r.places.length, 0);
export const lore = (key, fallback = '') => LORE[key] || fallback;
export const TELLINGS = WORLD.tellings;

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
  if (r.lastBonus) out.push(`LAST ONE PLAYED +${r.lastBonus}.`);
  if (r.reelChange) out.push('HANDS REDRAW EVERY FOUR PLAYS.');
  if (r.openHand) out.push('THEIR HAND IS FACE UP.');
  if (r.secretsOn) out.push('THEIR SECRET POWERS ARE AWAKE.');
  return out;
}

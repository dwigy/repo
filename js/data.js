// Cartoon Orbit — catalog data.
// The cast are cartoon stars whose original works are in the US public domain
// (published 1905–1930). Every portrait is drawn from scratch for this game.

// Five rarity tiers (plus earn-only Prizes). `color` is the tier colour used on
// rings, labels and pack reveals; `glow` is the reveal burst colour.
export const RARITY = [
  { key: 'common',    name: 'Common',    color: '#8f98a8', glow: '#c7ced8', recycle: 25   },
  { key: 'uncommon',  name: 'Uncommon',  color: '#2fbf5a', glow: '#7ee3a0', recycle: 60   },
  { key: 'rare',      name: 'Rare',      color: '#1e8fff', glow: '#7cc4ff', recycle: 150  },
  { key: 'mythic',    name: 'Mythic',    color: '#9b4dff', glow: '#c9a0ff', recycle: 500  },
  { key: 'legendary', name: 'Legendary', color: '#f5a623', glow: '#ffd76a', recycle: 1500 },
  { key: 'prize',     name: 'Prize',     color: '#f06aa8', glow: '#ffb3d6', recycle: 0    },
];
export const MYTHIC = 3, LEGENDARY = 4;
const VALUE = [25, 60, 150, 500, 1500, 750];

// gToon colour groups (the ring around a chip and its point bubble).
export const COLORS = {
  grn: { name: 'Green',  abbr: 'Grn', hex: '#3ec81e', dark: '#1d7a0c' },
  yel: { name: 'Yellow', abbr: 'Yel', hex: '#f7e400', dark: '#a89a00' },
  org: { name: 'Orange', abbr: 'Org', hex: '#ff8a1e', dark: '#b85400' },
  red: { name: 'Red',    abbr: 'Red', hex: '#e8221c', dark: '#8f0f0b' },
  blu: { name: 'Blue',   abbr: 'Blu', hex: '#2f8ff5', dark: '#10469c' },
  prp: { name: 'Purple', abbr: 'Prp', hex: '#c02fe0', dark: '#6a1280' },
  slv: { name: 'Silver', abbr: 'Slv', hex: '#c4ced8', dark: '#6d7a88' },
};

export const SERIES = {
  sil: { name: 'Silent Screen',       color: '#d9c27a', bg: ['#4a3618', '#b48a4a'], blurb: 'The very first animated stars, straight off the nickelodeon reel.' },
  ink: { name: 'Inkwell Studio',      color: '#d0d0d0', bg: ['#2b2b2b', '#7a7a7a'], blurb: 'Out of the inkwell and onto the screen. Boop-oop-a-doop!' },
  thm: { name: 'Thimble Theatre',     color: '#4aa3df', bg: ['#0b3a5c', '#2e86c1'], blurb: 'Sailors, spinach and the funny pages of 1929.' },
  rub: { name: 'Rubber Hose Rascals', color: '#e05a5a', bg: ['#5c0f14', '#c0392b'], blurb: 'Pie-cut eyes, bendy arms and a whole lot of whistling.' },
  fun: { name: 'Funny Pages',         color: '#f4b942', bg: ['#6b3f00', '#f4b942'], blurb: 'Bricks, dreams and the wildest Sunday comics ever printed.' },
  pz:  { name: 'Orbit Prizes',        color: '#ffffff', bg: ['#1f1f3a', '#4a4a8a'], blurb: 'Exclusive cToons you can only earn, never buy.' },
};

// Characters: name, series, debut, film used for the Reel edition, rarity of the top edition,
// and four [colour, gToon points, power] tuples for the Classic / Reel / Spotlight / top editions.
export const CHARACTERS = {
  felix:   { name: 'Felix the Cat', wiki: 'Felix_the_Cat',          series: 'sil', year: 1919, film: 'Feline Follies',        top: 5, blurb: 'The first cartoon superstar. Keeps on walking.',
             stats: [['slv', 4, { t: 'perOwnColor', color: 'slv', n: 2 }], ['blu', 6, { t: 'front', n: 4 }], ['slv', 9, { t: 'minusOppColor', color: 'blu', n: 3 }], ['slv', 16, { t: 'plusAll', n: 2 }]] },
  gertie:  { name: 'Gertie the Dinosaur', wiki: 'Gertie_the_Dinosaur',    series: 'sil', year: 1914, film: 'Gertie the Dinosaur',   top: 4, blurb: 'The friendliest brontosaurus in vaudeville. Does tricks.',
             stats: [['grn', 3, { t: 'back', n: 3 }], ['grn', 7, { t: 'lonely', n: 5 }], ['grn', 8, { t: 'perOwnColor', color: 'grn', n: 2 }], ['grn', 13, { t: 'plusOwnColor', color: 'grn', n: 3 }]] },
  alfalfa: { name: 'Farmer Al Falfa', wiki: 'Farmer_Al_Falfa',        series: 'sil', year: 1916, film: "Al Falfa's Catastrophe", top: 3, blurb: 'Grumpy, bearded, and forever losing to his own farm animals.',
             stats: [['yel', 3, { t: 'none' }], ['org', 6, { t: 'back', n: 4 }], ['yel', 8, { t: 'steal', n: 3 }], ['yel', 11, { t: 'perOppColor', color: 'grn', n: 3 }]] },
  koko:    { name: 'Koko the Clown', wiki: 'Koko_the_Clown',         series: 'ink', year: 1918, film: 'Out of the Inkwell',    top: 4, blurb: 'Climbs out of the inkwell every night to cause trouble.',
             stats: [['slv', 4, { t: 'x2', id: 'bimbo' }], ['prp', 6, { t: 'opp', n: 3 }], ['slv', 9, { t: 'mirror' }], ['slv', 13, { t: 'minusOppColor', color: 'red', n: 3 }]] },
  bimbo:   { name: 'Bimbo', wiki: 'Bimbo_(Fleischer_Studios)',                  series: 'ink', year: 1930, film: 'Hot Dog',               top: 3, blurb: 'A dog about town with big ears and bigger ideas.',
             stats: [['slv', 2, { t: 'perOwnColor', color: 'slv', n: 2 }], ['blu', 5, { t: 'first', n: 4 }], ['slv', 7, { t: 'lonely', n: 4 }], ['slv', 10, { t: 'plusOwnColor', color: 'slv', n: 2 }]] },
  betty:   { name: 'Betty Boop', wiki: 'Betty_Boop',             series: 'ink', year: 1930, film: 'Dizzy Dishes',          top: 5, blurb: 'The 1930 original, floppy ears and all. Boop-oop-a-doop!',
             stats: [['red', 4, { t: 'x2', id: 'bimbo' }], ['red', 7, { t: 'front', n: 4 }], ['red', 10, { t: 'plusOwnColor', color: 'red', n: 2 }], ['red', 15, { t: 'perOwnColor', color: 'red', n: 3 }]] },
  popeye:  { name: 'Popeye', wiki: 'Popeye',                 series: 'thm', year: 1929, film: 'Thimble Theatre',       top: 5, blurb: 'He is what he is. Strong to the finish.',
             stats: [['blu', 5, { t: 'x2', id: 'olive' }], ['blu', 8, { t: 'opp', n: 4 }], ['blu', 10, { t: 'steal', n: 4 }], ['blu', 16, { t: 'opp', n: 8 }]] },
  olive:   { name: 'Olive Oyl', wiki: 'Olive_Oyl',              series: 'thm', year: 1919, film: 'Thimble Theatre',       top: 3, blurb: 'Tall, tough and ten years older than Popeye.',
             stats: [['red', 2, { t: 'x2', id: 'popeye' }], ['red', 5, { t: 'back', n: 3 }], ['red', 7, { t: 'perOwnColor', color: 'blu', n: 2 }], ['red', 10, { t: 'plusOwnColor', color: 'blu', n: 2 }]] },
  oswald:  { name: 'Oswald the Lucky Rabbit', wiki: 'Oswald_the_Lucky_Rabbit', series: 'rub', year: 1927, film: 'Trolley Troubles',     top: 4, blurb: 'Lucky by name. Detachable by design.',
             stats: [['blu', 4, { t: 'lonely', n: 3 }], ['blu', 7, { t: 'front', n: 3 }], ['prp', 9, { t: 'minusOppColor', color: 'grn', n: 3 }], ['blu', 13, { t: 'plusOwnColor', color: 'blu', n: 3 }]] },
  willie:  { name: 'Steamboat Willie', wiki: 'Steamboat_Willie',       series: 'rub', year: 1928, film: 'Steamboat Willie',      top: 5, blurb: 'The 1928 deckhand who whistled his way into history.',
             stats: [['slv', 4, { t: 'first', n: 3 }], ['org', 7, { t: 'perOwnColor', color: 'org', n: 2 }], ['slv', 9, { t: 'back', n: 5 }], ['slv', 15, { t: 'plusAll', n: 2 }]] },
  bosko:   { name: 'Bosko', wiki: 'Bosko',                  series: 'rub', year: 1929, film: "Sinkin' in the Bathtub", top: 3, blurb: 'The Talk-Ink Kid. Never stops singing.',
             stats: [['org', 3, { t: 'none' }], ['org', 6, { t: 'perOppColor', color: 'slv', n: 2 }], ['org', 8, { t: 'front', n: 4 }], ['org', 11, { t: 'plusOwnColor', color: 'org', n: 2 }]] },
  flip:    { name: 'Flip the Frog', wiki: 'Flip_the_Frog',          series: 'rub', year: 1930, film: 'Fiddlesticks',          top: 3, blurb: 'Fiddles, dances and hops out of every jam.',
             stats: [['grn', 3, { t: 'back', n: 2 }], ['grn', 6, { t: 'x2', id: 'bosko' }], ['grn', 8, { t: 'opp', n: 4 }], ['grn', 11, { t: 'perOwnColor', color: 'grn', n: 2 }]] },
  krazy:   { name: 'Krazy Kat', wiki: 'Krazy_Kat',              series: 'fun', year: 1913, film: 'Krazy Kat',             top: 4, blurb: 'In love with a mouse who throws bricks. It is complicated.',
             stats: [['prp', 3, { t: 'x2', id: 'ignatz' }], ['prp', 6, { t: 'mirror' }], ['prp', 8, { t: 'lonely', n: 6 }], ['prp', 12, { t: 'minusOppColor', color: 'blu', n: 3 }]] },
  ignatz:  { name: 'Ignatz Mouse', wiki: 'Ignatz_Mouse',           series: 'fun', year: 1913, film: 'Krazy Kat',             top: 3, blurb: 'One mouse. One brick. One target.',
             stats: [['slv', 2, { t: 'opp', n: 2 }], ['org', 5, { t: 'steal', n: 2 }], ['slv', 7, { t: 'opp', n: 5 }], ['slv', 10, { t: 'steal', n: 5 }]] },
  nemo:    { name: 'Little Nemo', wiki: 'Little_Nemo',            series: 'fun', year: 1905, film: 'Slumberland',           top: 4, blurb: 'Falls out of bed at the end of every adventure.',
             stats: [['blu', 3, { t: 'first', n: 4 }], ['yel', 6, { t: 'lonely', n: 4 }], ['blu', 8, { t: 'last', n: 6 }], ['blu', 12, { t: 'last', n: 12 }]] },
};

// Eight editions per character. Common/Uncommon/Rare are the base set; Mythic and
// Legendary carry the collectible metal and Dark Matter variants.
export const EDITIONS = [
  { n: 1, variant: 'classic',  pose: 'normal', rarity: 0, label: (c) => c.name,                    tag: 'Classic',                         short: 'Classic' },
  { n: 2, variant: 'reel',     pose: 'mirror', rarity: 1, label: (c) => `${c.name} · ${c.film}`,   tag: (c) => `${c.film} (${c.year})`,    short: (c) => `Reel ${c.year}` },
  { n: 3, variant: 'stage',    pose: 'zoom',   rarity: 2, label: (c) => `${c.name} · Spotlight`,   tag: 'Spotlight',                       short: 'Spotlight' },
  { n: 4, variant: 'holo',     pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Holo`,        tag: 'Holo',                            short: 'Holo' },
  { n: 5, variant: 'silver',   pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Silver`,      tag: 'Full Silver',                     short: 'Silver' },
  { n: 6, variant: 'dark',     pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Dark Matter`, tag: 'Dark Matter',                     short: 'Dark Matter' },
  { n: 7, variant: 'gold',     pose: 'hero',   rarity: 4, label: (c) => `${c.name} · Gold`,        tag: 'Full Gold',                       short: 'Gold' },
  { n: 8, variant: 'platinum', pose: 'hero',   rarity: 4, label: (c) => `${c.name} · Platinum`,    tag: 'Full Platinum',                   short: 'Platinum' },
];
// Which colour each character's Dark Matter edition punishes.
const RIVAL_COLOR = { grn: 'red', yel: 'blu', org: 'blu', red: 'grn', blu: 'org', prp: 'yel', slv: 'prp' };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function editionStats(c, e, i) {
  if (i < 3) return c.stats[i];
  const [topColor, topPts, topPower] = c.stats[3];
  const own = c.stats[0][0];
  switch (e.variant) {
    case 'holo':     return [own, clamp(topPts - 4, 8, 12), { t: 'perOwnColor', color: own, n: 2 }];
    case 'silver':   return ['slv', clamp(topPts - 3, 9, 13), c.name.length % 2 ? { t: 'mirror' } : { t: 'steal', n: 4 }];
    case 'dark':     return [own, clamp(topPts - 3, 9, 13), { t: 'minusOppColor', color: RIVAL_COLOR[own] || 'blu', n: 3 }];
    case 'gold':     return [topColor, clamp(topPts, 13, 16), topPower];
    case 'platinum': return ['slv', clamp(topPts - 1, 13, 16), { t: 'plusAll', n: 2 }];
  }
  return c.stats[3];
}

function build() {
  const out = [];
  for (const [key, c] of Object.entries(CHARACTERS)) {
    EDITIONS.forEach((e, i) => {
      const rarity = e.rarity;
      const [color, pts, power] = editionStats(c, e, i);
      out.push({ id: `${key}${e.n}`, char: key, series: c.series, name: e.label(c), short: c.name, edition: typeof e.tag === 'function' ? e.tag(c) : e.tag,
        edShort: typeof e.short === 'function' ? e.short(c) : e.short,
        variant: e.variant, pose: e.pose, rarity, points: VALUE[rarity], color, pts, power, blurb: c.blurb, year: c.year });
    });
  }
  const prize = (id, char, name, color, pts, power, blurb) => ({ id, char, series: 'pz', name, short: name, edition: 'Prize', edShort: 'Prize', variant: 'holo', pose: 'normal', rarity: 5, points: VALUE[5], color, pts, power, blurb, year: 2000 });
  out.push(
    prize('pz01', 'rookie', 'Orbit Rookie',      'slv', 7,  { t: 'first', n: 5 },                          'Awarded to every new Orbiter. Welcome aboard!'),
    prize('pz02', 'comet',  'Streak Comet',      'org', 11, { t: 'front', n: 5 },                          'Earned by logging in 7 days in a row.'),
    prize('pz03', 'crown',  "Collector's Crown", 'yel', 11, { t: 'perOwnColor', color: 'slv', n: 3 },      'Earned by collecting 60 different cToons.'),
    prize('pz04', 'titan',  'Trade Titan',       'slv', 12, { t: 'plusOwnColor', color: 'slv', n: 2 },     'Earned by completing 10 trades.'),
    prize('pz05', 'badge',  'Battle Badge',      'red', 12, { t: 'opp', n: 7 },                            'Earned by winning 25 gToons matches.'),
    prize('pz06', 'champ',  "Champion's Star",   'slv', 16, { t: 'plusAll', n: 2 },                        'Earned by defeating the Orbit Master.'),
  );
  return out;
}
export const CTOONS = build();
export const BY_ID = Object.fromEntries(CTOONS.map(t => [t.id, t]));
export const PACKABLE = CTOONS.filter(t => t.series !== 'pz');

export const PACKS = [
  { id: 'std',  name: 'Standard cPack', price: 300, size: 3, desc: '3 cToons. Uncommon or better guaranteed.',
    odds: [0.60, 0.27, 0.10, 0.025, 0.005], minRarity: 1 },
  { id: 'prem', name: 'Premium cPack',  price: 900, size: 4, desc: '4 cToons. Rare or better guaranteed. Better odds all round.',
    odds: [0.25, 0.35, 0.28, 0.10, 0.02],  minRarity: 2 },
  { id: 'mega', name: 'Mega cPack',     price: 2000, size: 5, desc: '5 cToons. One Mythic or better guaranteed.',
    odds: [0.28, 0.30, 0.25, 0.13, 0.04],  minRarity: 3 },
];

export const BACKGROUNDS = [
  { id: 'orbit',   name: 'Orbit Blue',      cost: 0,    css: 'radial-gradient(circle at 50% 30%, #4d8fd6 0%, #1f5fb0 45%, #0f3a7a 100%)' },
  { id: 'space',   name: 'Deep Space',      cost: 300,  css: 'radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0b1020 55%, #000 100%)' },
  { id: 'reel',    name: 'Silver Screen',   cost: 400,  css: 'repeating-linear-gradient(90deg, #111 0 12px, #2a2a2a 12px 24px)' },
  { id: 'inkwell', name: 'Inkwell',         cost: 400,  css: 'radial-gradient(circle at 50% 80%, #6e6e6e 0%, #1a1a1a 70%)' },
  { id: 'harbor',  name: 'Sweethaven Harbor', cost: 400, css: 'linear-gradient(180deg, #7fc8f8 0%, #2e86c1 55%, #0b3a5c 100%)' },
  { id: 'sunday',  name: 'Sunday Funnies',  cost: 400,  css: 'repeating-linear-gradient(45deg, #f4b942 0 24px, #f7d27a 24px 48px)' },
  { id: 'desert',  name: 'Kokonino Kounty', cost: 400,  css: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)' },
  { id: 'disco',   name: 'Orbit Disco',     cost: 1500, css: 'conic-gradient(from 0deg, #f472b6, #facc15, #4ade80, #38bdf8, #c084fc, #f472b6)' },
];

export const OPPONENTS = [
  { id: 'rex',    name: 'Rookie Rex',       diff: 0.35, minR: 0, maxR: 0, reward: 120, avatar: 'bosko1',   taunt: 'I just got my first cPack yesterday!' },
  { id: 'betty',  name: 'Binder Betty',     diff: 0.55, minR: 0, maxR: 1, reward: 180, avatar: 'betty1',   taunt: 'I have every Common. Every. Single. One.' },
  { id: 'tom',    name: 'Tycoon Tom',       diff: 0.7,  minR: 1, maxR: 2, reward: 240, avatar: 'ignatz2',  taunt: 'I could buy your whole binder. Twice.' },
  { id: 'vendor', name: 'The Vendor',       diff: 0.85, minR: 2, maxR: 3, reward: 320, avatar: 'alfalfa3', taunt: 'You have been buying my packs. Now face my deck.' },
  { id: 'master', name: 'Orbit Master',     diff: 1.0,  minR: 3, maxR: 4, reward: 500, avatar: 'willie7',  taunt: 'Nobody has beaten me. Nobody will.' },
];

export const TRADERS = [
  { id: 'gus',  name: 'Swap-Meet Gus',    line: 'Everything must go. Especially the weird ones.' },
  { id: 'vera', name: 'Very Rare Vera',   line: 'I only deal in quality. Show me something shiny.' },
  { id: 'kip',  name: 'Kip the Kid',      line: 'Trade ya! Trade ya! Trade ya!' },
];

export const QUESTS = [
  { id: 'win1',  text: 'Win a gToons battle',             goal: 1, stat: 'winsToday',   reward: 150 },
  { id: 'play2', text: 'Play 2 gToons battles',           goal: 2, stat: 'playsToday',  reward: 120 },
  { id: 'pack1', text: 'Open a cPack',                    goal: 1, stat: 'packsToday',  reward: 100 },
  { id: 'zone3', text: 'Place 3 cToons in your cZone',    goal: 3, stat: 'placedToday', reward: 100 },
  { id: 'trade1',text: 'Make a trade at the Auction',     goal: 1, stat: 'tradesToday', reward: 150 },
  { id: 'rec1',  text: 'Recycle a duplicate cToon',       goal: 1, stat: 'recycToday',  reward: 80 },
];

export const NPC_ZONES = [
  { id: 'campers',  owner: 'Crazy Campers',   bg: 'desert',  award: 'Muddiest cZone' },
  { id: 'book',     owner: 'Book Club',       bg: 'orbit',   award: null },
  { id: 'agents',   owner: 'Secret Agents',   bg: 'space',   award: 'Sneakiest cZone' },
  { id: 'sports',   owner: 'Extreme Sports',  bg: 'harbor',  award: null },
  { id: 'candy',    owner: 'Candy Lovers',    bg: 'sunday',  award: 'Sweetest cZone' },
  { id: 'rockers',  owner: 'Rockers',         bg: 'disco',   award: 'Loudest cZone' },
  { id: 'muscle',   owner: 'Muscle Men',      bg: 'harbor',  award: null },
  { id: 'reels',    owner: 'Reel Collectors', bg: 'reel',    award: 'Classiest cZone' },
  { id: 'spooks',   owner: 'Night Shift',     bg: 'inkwell', award: 'Creepiest cZone' },
  { id: 'farm',     owner: "Farmin' Folks",   bg: 'sunday',  award: null },
];

export const PROMO_CODES = {
  'ORBIT2000':   { points: 500,   text: '500 points. Welcome to the Orbit!' },
  'GTOONS':      { pack: 'std',   text: 'A free Standard cPack!' },
  'INKWELL':     { ctoon: 'koko2',   text: 'Koko the Clown · Out of the Inkwell joins your binder!' },
  'SPINACH':     { ctoon: 'popeye2', text: 'Popeye · Thimble Theatre joins your binder!' },
  'SLUMBERLAND': { ctoon: 'nemo2',   text: 'Little Nemo · Slumberland joins your binder!' },
};
export const FEATURED_CODES = ['TURKEY', 'PANCAKE', 'MOONBOOTS', 'WAFFLES', 'SPATULA', 'ORBITAL', 'INKBLOT', 'BOOPOOP', 'SPINACH2', 'TROLLEY', 'FIDDLE', 'BRICK', 'STEAMBOAT', 'COMET'];

export function powerText(p) {
  const cn = (c) => COLORS[c]?.name || c;
  switch (p.t) {
    case 'none':          return 'NO POWER';
    case 'x2':            return `x2 to ${CHARACTERS[p.id]?.name || '?'}`;
    case 'perOppColor':   return `+${p.n} for each opponent ${cn(p.color)} gToon`;
    case 'perOwnColor':   return `+${p.n} for each of your ${cn(p.color)} gToons`;
    case 'minusOppColor': return `-${p.n} to each opponent ${cn(p.color)} gToon`;
    case 'plusOwnColor':  return `+${p.n} to each of your other ${cn(p.color)} gToons`;
    case 'plusAll':       return `+${p.n} to each of your other gToons`;
    case 'opp':           return `-${p.n} to the opposing gToon`;
    case 'steal':         return `Takes ${p.n} points from the opposing gToon`;
    case 'mirror':        return `Copies the opposing gToon's points`;
    case 'back':          return `+${p.n} when played in the back row`;
    case 'front':         return `+${p.n} when played in the front row`;
    case 'first':         return `+${p.n} if played first`;
    case 'last':          return `+${p.n} if played last`;
    case 'lonely':        return `+${p.n} if no gToons are next to it`;
  }
  return '';
}

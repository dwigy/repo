// [GAME] — catalog data. Placeholder names throughout: characters are Alpha to Zulu,
// sets are Set One to Set Six. Mechanics (colours, points, powers) are final;
// names and artwork are stand-ins until branding lands.

// Five rarity tiers (plus earn-only Awards). `color` is the tier colour used on
// rings, labels and pack reveals; `glow` is the reveal burst colour.
export const RARITY = [
  { key: 'common',    name: 'Common',    color: '#8f98a8', glow: '#c7ced8', recycle: 25   },
  { key: 'uncommon',  name: 'Uncommon',  color: '#2fbf5a', glow: '#7ee3a0', recycle: 60   },
  { key: 'rare',      name: 'Rare',      color: '#1e8fff', glow: '#7cc4ff', recycle: 150  },
  { key: 'mythic',    name: 'Mythic',    color: '#9b4dff', glow: '#c9a0ff', recycle: 500  },
  { key: 'legendary', name: 'Legendary', color: '#f5a623', glow: '#ffd76a', recycle: 1500 },
  { key: 'award',     name: 'Award',     color: '#f06aa8', glow: '#ffb3d6', recycle: 0    },
];
export const MYTHIC = 3, LEGENDARY = 4;
export const PACK_TINTS = { std: ['#5b8def', '#1a3d78'], prem: ['#b06cff', '#4d1a9e'], mega: ['#ffd76a', '#b8780c'], starter: ['#8fd3ff', '#1e6fd0'], region: ['#6ee7b7', '#065f46'] };
const VALUE = [25, 60, 150, 500, 1500, 750];

// Chip colour groups (the ring around a chip and its point bubble).
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
  sil: { name: 'Set One',   color: '#d9c27a', bg: ['#4a3618', '#b48a4a'], blurb: '[Placeholder set description]' },
  ink: { name: 'Set Two',   color: '#d0d0d0', bg: ['#2b2b2b', '#7a7a7a'], blurb: '[Placeholder set description]' },
  thm: { name: 'Set Three', color: '#4aa3df', bg: ['#0b3a5c', '#2e86c1'], blurb: '[Placeholder set description]' },
  rub: { name: 'Set Four',  color: '#e05a5a', bg: ['#5c0f14', '#c0392b'], blurb: '[Placeholder set description]' },
  fun: { name: 'Set Five',  color: '#f4b942', bg: ['#6b3f00', '#f4b942'], blurb: '[Placeholder set description]' },
  lot: { name: 'Set Six',   color: '#7fd1c8', bg: ['#0f3d3a', '#2aa198'], blurb: '[Placeholder set description]' },
  one: { name: 'One of One', color: '#ffd166', bg: ['#2b1a4a', '#7b4dd6'], blurb: 'Won from gatekeepers and completion. Never in a pack.' },
  pz:  { name: 'Awards',    color: '#ffffff', bg: ['#1f1f3a', '#4a4a8a'], blurb: 'Earned, never bought.' },
};

export const CHARACTERS = {
  alpha:    { name: "Alpha", quips: ["Ready.", "Hm.", "Again."], series: "sil", top: 5, blurb: '[Placeholder chip bio]',
             stats: [["slv", 4, {"t": "perOwnColor", "color": "slv", "n": 2}], ["blu", 6, {"t": "front", "n": 4}], ["slv", 9, {"t": "minusOppColor", "color": "blu", "n": 3}], ["slv", 16, {"t": "plusAll", "n": 2}]] },
  bravo:    { name: "Bravo", quips: ["Watch this.", "Easy.", "Next."], series: "sil", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["grn", 3, {"t": "back", "n": 3}], ["grn", 7, {"t": "lonely", "n": 5}], ["grn", 8, {"t": "perOwnColor", "color": "grn", "n": 2}], ["grn", 13, {"t": "plusOwnColor", "color": "grn", "n": 3}]] },
  charlie:  { name: "Charlie", quips: ["Steady.", "Hold.", "Now."], series: "sil", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["yel", 3, {"t": "none"}], ["org", 6, {"t": "back", "n": 4}], ["yel", 8, {"t": "steal", "n": 3}], ["yel", 11, {"t": "perOppColor", "color": "grn", "n": 3}]] },
  delta:    { name: "Delta", quips: ["Here we go.", "Fine.", "Done."], series: "ink", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["slv", 4, {"t": "x2", "id": "echo"}], ["prp", 6, {"t": "opp", "n": 3}], ["slv", 9, {"t": "mirror"}], ["slv", 13, {"t": "minusOppColor", "color": "red", "n": 3}]] },
  echo:     { name: "Echo", quips: ["Onward.", "Careful.", "Ha."], series: "ink", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["slv", 2, {"t": "perOwnColor", "color": "slv", "n": 2}], ["blu", 5, {"t": "first", "n": 4}], ["slv", 7, {"t": "lonely", "n": 4}], ["slv", 10, {"t": "plusOwnColor", "color": "slv", "n": 2}]] },
  foxtrot:  { name: "Foxtrot", quips: ["Let's see.", "Close.", "Right."], series: "ink", top: 5, blurb: '[Placeholder chip bio]',
             stats: [["red", 4, {"t": "x2", "id": "echo"}], ["red", 7, {"t": "front", "n": 4}], ["red", 10, {"t": "plusOwnColor", "color": "red", "n": 2}], ["red", 15, {"t": "perOwnColor", "color": "red", "n": 3}]] },
  golf:     { name: "Golf", quips: ["Ready.", "Hm.", "Again."], series: "thm", top: 5, blurb: '[Placeholder chip bio]',
             stats: [["blu", 5, {"t": "x2", "id": "hotel"}], ["blu", 8, {"t": "opp", "n": 4}], ["blu", 10, {"t": "steal", "n": 4}], ["blu", 16, {"t": "opp", "n": 8}]] },
  hotel:    { name: "Hotel", quips: ["Watch this.", "Easy.", "Next."], series: "thm", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["red", 2, {"t": "x2", "id": "golf"}], ["red", 5, {"t": "back", "n": 3}], ["red", 7, {"t": "perOwnColor", "color": "blu", "n": 2}], ["red", 10, {"t": "plusOwnColor", "color": "blu", "n": 2}]] },
  india:    { name: "India", quips: ["Steady.", "Hold.", "Now."], series: "rub", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["blu", 4, {"t": "lonely", "n": 3}], ["blu", 7, {"t": "front", "n": 3}], ["prp", 9, {"t": "minusOppColor", "color": "grn", "n": 3}], ["blu", 13, {"t": "plusOwnColor", "color": "blu", "n": 3}]] },
  juliett:  { name: "Juliett", quips: ["Here we go.", "Fine.", "Done."], series: "rub", top: 5, blurb: '[Placeholder chip bio]',
             stats: [["slv", 4, {"t": "first", "n": 3}], ["org", 7, {"t": "perOwnColor", "color": "org", "n": 2}], ["slv", 9, {"t": "back", "n": 5}], ["slv", 15, {"t": "plusAll", "n": 2}]] },
  kilo:     { name: "Kilo", quips: ["Onward.", "Careful.", "Ha."], series: "rub", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["org", 3, {"t": "none"}], ["org", 6, {"t": "perOppColor", "color": "slv", "n": 2}], ["org", 8, {"t": "front", "n": 4}], ["org", 11, {"t": "plusOwnColor", "color": "org", "n": 2}]] },
  lima:     { name: "Lima", quips: ["Let's see.", "Close.", "Right."], series: "rub", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["grn", 3, {"t": "back", "n": 2}], ["grn", 6, {"t": "x2", "id": "kilo"}], ["grn", 8, {"t": "opp", "n": 4}], ["grn", 11, {"t": "perOwnColor", "color": "grn", "n": 2}]] },
  mike:     { name: "Mike", quips: ["Ready.", "Hm.", "Again."], series: "fun", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["prp", 3, {"t": "x2", "id": "november"}], ["prp", 6, {"t": "mirror"}], ["prp", 8, {"t": "lonely", "n": 6}], ["prp", 12, {"t": "minusOppColor", "color": "blu", "n": 3}]] },
  november: { name: "November", quips: ["Watch this.", "Easy.", "Next."], series: "fun", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["slv", 2, {"t": "opp", "n": 2}], ["org", 5, {"t": "steal", "n": 2}], ["slv", 7, {"t": "opp", "n": 5}], ["slv", 10, {"t": "steal", "n": 5}]] },
  oscar:    { name: "Oscar", quips: ["Steady.", "Hold.", "Now."], series: "fun", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["blu", 3, {"t": "first", "n": 4}], ["yel", 6, {"t": "lonely", "n": 4}], ["blu", 8, {"t": "last", "n": 6}], ["blu", 12, {"t": "last", "n": 12}]] },
  papa:     { name: "Papa", quips: ["Here we go.", "Fine.", "Done."], series: "sil", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["yel", 3, {"t": "first", "n": 2}], ["yel", 6, {"t": "chain", "n": 1}], ["org", 8, {"t": "underdog", "n": 5}], ["yel", 11, {"t": "chain", "n": 2}]] },
  quebec:   { name: "Quebec", quips: ["Onward.", "Careful.", "Ha."], series: "sil", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["org", 4, {"t": "crown", "n": 3}], ["org", 6, {"t": "bomb", "n": 2}], ["red", 9, {"t": "veto"}], ["org", 13, {"t": "crown", "n": 6}]] },
  romeo:    { name: "Romeo", quips: ["Let's see.", "Close.", "Right."], series: "lot", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["slv", 3, {"t": "lonely", "n": 3}], ["slv", 6, {"t": "shield"}], ["blu", 9, {"t": "underdog", "n": 6}], ["slv", 13, {"t": "minusOppColor", "color": "red", "n": 3}]] },
  sierra:   { name: "Sierra", quips: ["Ready.", "Hm.", "Again."], series: "lot", top: 5, blurb: '[Placeholder chip bio]',
             stats: [["red", 5, {"t": "opp", "n": 3}], ["red", 8, {"t": "bomb", "n": 2}], ["red", 10, {"t": "veto"}], ["red", 16, {"t": "bomb", "n": 4}]] },
  tango:    { name: "Tango", quips: ["Watch this.", "Easy.", "Next."], series: "lot", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["yel", 3, {"t": "plusOwnColor", "color": "yel", "n": 1}], ["yel", 6, {"t": "back", "n": 4}], ["yel", 8, {"t": "perOwnColor", "color": "yel", "n": 2}], ["yel", 11, {"t": "plusAll", "n": 1}]] },
  uniform:  { name: "Uniform", quips: ["Steady.", "Hold.", "Now."], series: "lot", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["org", 3, {"t": "chain", "n": 1}], ["org", 6, {"t": "front", "n": 3}], ["blu", 8, {"t": "crown", "n": 4}], ["org", 11, {"t": "chain", "n": 2}]] },
  victor:   { name: "Victor", quips: ["Here we go.", "Fine.", "Done."], series: "lot", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["red", 4, {"t": "x2", "id": "juliett"}], ["red", 7, {"t": "plusOwnColor", "color": "red", "n": 2}], ["prp", 9, {"t": "shield"}], ["red", 13, {"t": "plusAll", "n": 2}]] },
  whiskey:  { name: "Whiskey", quips: ["Onward.", "Careful.", "Ha."], series: "fun", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["grn", 4, {"t": "x2", "id": "xray"}], ["grn", 7, {"t": "late", "n": 4}], ["grn", 9, {"t": "underdog", "n": 6}], ["grn", 13, {"t": "plusOwnColor", "color": "grn", "n": 3}]] },
  xray:     { name: "Xray", quips: ["Let's see.", "Close.", "Right."], series: "fun", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["grn", 2, {"t": "x2", "id": "whiskey"}], ["yel", 5, {"t": "lonely", "n": 4}], ["grn", 7, {"t": "first", "n": 5}], ["grn", 10, {"t": "late", "n": 6}]] },
  yankee:   { name: "Yankee", quips: ["Ready.", "Hm.", "Again."], series: "fun", top: 3, blurb: '[Placeholder chip bio]',
             stats: [["org", 3, {"t": "underdog", "n": 3}], ["org", 5, {"t": "steal", "n": 2}], ["org", 8, {"t": "lonely", "n": 5}], ["org", 11, {"t": "underdog", "n": 8}]] },
  zulu:     { name: "Zulu", quips: ["Watch this.", "Easy.", "Next."], series: "fun", top: 4, blurb: '[Placeholder chip bio]',
             stats: [["red", 3, {"t": "bomb", "n": 1}], ["red", 6, {"t": "opp", "n": 3}], ["yel", 9, {"t": "chain", "n": 2}], ["red", 12, {"t": "bomb", "n": 3}]] },
};

// Eight editions per character. Common/Uncommon/Rare are the base set; Mythic and
// Legendary carry the collectible metal and Dark variants.
export const EDITIONS = [
  { n: 1, variant: 'classic',  pose: 'normal', rarity: 0, label: (c) => c.name,                 tag: 'Classic',       short: 'Classic' },
  { n: 2, variant: 'reel',     pose: 'mirror', rarity: 1, label: (c) => `${c.name} · Vintage`,  tag: 'Vintage',       short: 'Vintage' },
  { n: 3, variant: 'stage',    pose: 'zoom',   rarity: 2, label: (c) => `${c.name} · Spotlight`, tag: 'Spotlight',    short: 'Spotlight' },
  { n: 4, variant: 'holo',     pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Holo`,     tag: 'Holo',          short: 'Holo' },
  { n: 5, variant: 'silver',   pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Silver`,   tag: 'Full Silver',   short: 'Silver' },
  { n: 6, variant: 'dark',     pose: 'hero',   rarity: 3, label: (c) => `${c.name} · Dark`,     tag: 'Dark Matter',   short: 'Dark' },
  { n: 7, variant: 'gold',     pose: 'hero',   rarity: 4, label: (c) => `${c.name} · Gold`,     tag: 'Full Gold',     short: 'Gold' },
  { n: 8, variant: 'platinum', pose: 'hero',   rarity: 4, label: (c) => `${c.name} · Platinum`, tag: 'Full Platinum', short: 'Platinum' },
];
// Which colour each character's Dark Matter edition punishes.
const RIVAL_COLOR = { grn: 'red', yel: 'blu', org: 'blu', red: 'grn', blu: 'org', prp: 'yel', slv: 'prp' };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Secret powers: a second power on Mythic and Legendary editions that wakes up
// after the chip has been on the board for three wins (see game.train()).
const SECRETS = {
  holo:     { t: 'chain', n: 1 },
  silver:   { t: 'shield' },
  dark:     { t: 'bomb', n: 2 },
  gold:     { t: 'crown', n: 4 },
  platinum: { t: 'veto' },
};
export const TRAIN_WINS = 3;
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
        variant: e.variant, pose: e.pose, rarity, points: VALUE[rarity], color, pts, power, secret: SECRETS[e.variant] || null, blurb: c.blurb });
    });
  }
  // Award chips: earned by milestones, never in a pack.
  const award = (id, char, name, color, pts, power, blurb) => ({ id, char, series: 'pz', name, short: name, edition: 'Award', edShort: 'Award', variant: 'holo', pose: 'normal', rarity: 5, points: VALUE[5], color, pts, power, blurb });
  out.push(
    award('pz01', 'rookie', 'Award · First Day',   'slv', 7,  { t: 'first', n: 5 },                       'Given to every new player.'),
    award('pz02', 'comet',  'Award · Seven Days',  'org', 11, { t: 'front', n: 5 },                       'Log in seven days in a row.'),
    award('pz03', 'crown',  'Award · Collector',   'yel', 11, { t: 'perOwnColor', color: 'slv', n: 3 },   'Collect 60 different chips.'),
    award('pz04', 'titan',  'Award · Trader',      'slv', 12, { t: 'plusOwnColor', color: 'slv', n: 2 },  'Complete 10 trades.'),
    award('pz05', 'badge',  'Award · Fighter',     'red', 12, { t: 'opp', n: 7 },                         'Win 25 matches.'),
    award('pz06', 'champ',  'Award · Champion',    'slv', 16, { t: 'plusAll', n: 2 },                     'Beat the Master in training.'),
  );
  // One-of-one chips: one per region gatekeeper, one for 100% completion. Never in a pack.
  const one = (n, name, color, pts, power, secret, blurb) => ({ id: `one${n}`, char: 'one', series: 'one', name: `${name} · 1/1`, short: name, edition: '1 of 1', edShort: '1/1', variant: 'gold', pose: 'hero', rarity: 4, points: VALUE[4], color, pts, power, secret, blurb, one: n });
  out.push(
    one(1, '[REGION 1] Keepsake', 'slv', 12, { t: 'mirror' },                          { t: 'shield' },          'One of one. Won from the first gatekeeper.'),
    one(2, '[REGION 2] Keepsake', 'blu', 14, { t: 'opp', n: 6 },                       { t: 'crown', n: 4 },     'One of one. Won from the second gatekeeper.'),
    one(3, '[REGION 3] Keepsake', 'org', 12, { t: 'bomb', n: 3 },                      { t: 'late', n: 5 },      'One of one. Won from the third gatekeeper.'),
    one(4, '[REGION 4] Keepsake', 'blu', 13, { t: 'last', n: 9 },                      { t: 'veto' },            'One of one. Won from the fourth gatekeeper.'),
    one(5, '[REGION 5] Keepsake', 'prp', 14, { t: 'plusOwnColor', color: 'prp', n: 3 }, { t: 'chain', n: 2 },    'One of one. Won from the fifth gatekeeper.'),
    one(6, '[REGION 6] Keepsake', 'grn', 13, { t: 'chain', n: 2 },                     { t: 'underdog', n: 8 },  'One of one. Won from the sixth gatekeeper.'),
    one(7, '[REGION 7] Keepsake', 'slv', 16, { t: 'plusAll', n: 2 },                   { t: 'crown', n: 6 },     'One of one. Won from the seventh gatekeeper.'),
    one(8, 'Completion Keepsake', 'yel', 16, { t: 'plusAll', n: 3 },                   { t: 'veto' },            'One of one. Granted at 100% completion.'),
  );
  return out;
}
export const CTOONS = build();
export const CHIPS = CTOONS;
export const BY_ID = Object.fromEntries(CTOONS.map(t => [t.id, t]));
export const PACKABLE = CTOONS.filter(t => t.series !== 'pz' && t.series !== 'one');
// The eight editions that make up a character's set (1/1s and Awards are not part of any set).
export const setOf = (charKey) => CTOONS.filter(t => t.char === charKey && t.series !== 'one' && t.series !== 'pz');
export const isTour = (t) => !!t && t.series === 'one';
export const isOneOfOne = isTour;

export const PACKS = [
  { id: 'std',  name: 'Standard Pack', price: 300, size: 3, desc: '3 chips. Uncommon or better guaranteed.',
    odds: [0.60, 0.27, 0.10, 0.025, 0.005], minRarity: 1 },
  { id: 'prem', name: 'Premium Pack',  price: 900, size: 4, desc: '4 chips. Rare or better guaranteed. Better odds all round.',
    odds: [0.25, 0.35, 0.28, 0.10, 0.02],  minRarity: 2 },
  { id: 'mega', name: 'Mega Pack',     price: 2000, size: 5, desc: '5 chips. One Mythic or better guaranteed.',
    odds: [0.28, 0.30, 0.25, 0.13, 0.04],  minRarity: 3 },
];

export const BACKGROUNDS = [
  { id: 'orbit',   name: 'Blue',        cost: 0,    css: 'radial-gradient(circle at 50% 30%, #4d8fd6 0%, #1f5fb0 45%, #0f3a7a 100%)' },
  { id: 'space',   name: 'Deep Space',  cost: 300,  css: 'radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0b1020 55%, #000 100%)' },
  { id: 'reel',    name: 'Monochrome',  cost: 400,  css: 'repeating-linear-gradient(90deg, #111 0 12px, #2a2a2a 12px 24px)' },
  { id: 'inkwell', name: 'Charcoal',    cost: 400,  css: 'radial-gradient(circle at 50% 80%, #6e6e6e 0%, #1a1a1a 70%)' },
  { id: 'harbor',  name: 'Harbour',     cost: 400,  css: 'linear-gradient(180deg, #7fc8f8 0%, #2e86c1 55%, #0b3a5c 100%)' },
  { id: 'sunday',  name: 'Stripes',     cost: 400,  css: 'repeating-linear-gradient(45deg, #f4b942 0 24px, #f7d27a 24px 48px)' },
  { id: 'desert',  name: 'Sunset',      cost: 400,  css: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)' },
  { id: 'disco',   name: 'Prism',       cost: 1500, css: 'conic-gradient(from 0deg, #f472b6, #facc15, #4ade80, #38bdf8, #c084fc, #f472b6)' },
];

// Training roster: sparring partners available from every region's Train.
export const OPPONENTS = [
  { id: 'rex',    name: 'Rookie',     diff: 0.35, minR: 0, maxR: 0, reward: 120, avatar: 'kilo1',     taunt: '[Placeholder line: the rookie.]' },
  { id: 'betty',  name: 'Collector',  diff: 0.55, minR: 0, maxR: 1, reward: 180, avatar: 'foxtrot1',  taunt: '[Placeholder line: the collector.]' },
  { id: 'tom',    name: 'Tycoon',     diff: 0.7,  minR: 1, maxR: 2, reward: 240, avatar: 'november2', taunt: '[Placeholder line: the tycoon.]' },
  { id: 'vendor', name: 'Vendor',     diff: 0.85, minR: 2, maxR: 3, reward: 320, avatar: 'charlie3',  taunt: '[Placeholder line: the vendor.]' },
  { id: 'master', name: 'Master',     diff: 1.0,  minR: 3, maxR: 4, reward: 500, avatar: 'juliett7',  taunt: '[Placeholder line: the master.]' },
];

export const TRADERS = [
  { id: 'gus',  name: 'Trader One',   line: '[Placeholder line: trader one.]' },
  { id: 'vera', name: 'Trader Two',   line: '[Placeholder line: trader two.]' },
  { id: 'kip',  name: 'Trader Three', line: '[Placeholder line: trader three.]' },
];

export const QUESTS = [
  { id: 'win1',  text: 'Win a match',              goal: 1, stat: 'winsToday',   reward: 150 },
  { id: 'play2', text: 'Play 2 matches',           goal: 2, stat: 'playsToday',  reward: 120 },
  { id: 'pack1', text: 'Open a pack',              goal: 1, stat: 'packsToday',  reward: 100 },
  { id: 'trade1', text: 'Make a trade',            goal: 1, stat: 'tradesToday', reward: 100 },
  { id: 'recyc2', text: 'Recycle 2 chips',         goal: 2, stat: 'recycToday',  reward: 80 },
];

export const PROMO_CODES = {
  'WELCOME500': { points: 500,     text: '500 coins. Welcome.' },
  'FREEPACK':   { pack: 'std',     text: 'A free Standard Pack.' },
  'CODEALPHA':  { ctoon: 'alpha2', text: 'Alpha · Vintage joins your binder.' },
  'CODEGOLF':   { ctoon: 'golf2',  text: 'Golf · Vintage joins your binder.' },
  'CODEOSCAR':  { ctoon: 'oscar2', text: 'Oscar · Vintage joins your binder.' },
};
export const FEATURED_CODES = ['TURKEY', 'PANCAKE', 'MOONBOOTS', 'WAFFLES', 'SPATULA', 'ROCKET', 'INKBLOT', 'LANTERN', 'PEPPER', 'TROLLEY', 'FIDDLE', 'BRICK', 'HARBOUR', 'COMET'];

export function powerText(p) {
  const cn = (c) => COLORS[c]?.name || c;
  switch (p.t) {
    case 'none':          return 'NO POWER';
    case 'x2':            return `x2 to ${CHARACTERS[p.id]?.name || '?'}`;
    case 'perOppColor':   return `+${p.n} for each opponent ${cn(p.color)} chip`;
    case 'perOwnColor':   return `+${p.n} for each of your ${cn(p.color)} chips`;
    case 'minusOppColor': return `-${p.n} to each opponent ${cn(p.color)} chip`;
    case 'plusOwnColor':  return `+${p.n} to each of your other ${cn(p.color)} chips`;
    case 'plusAll':       return `+${p.n} to each of your other chips`;
    case 'opp':           return `-${p.n} to the opposing chip`;
    case 'steal':         return `Takes ${p.n} points from the opposing chip`;
    case 'mirror':        return `Copies the opposing chip's points`;
    case 'back':          return `+${p.n} when played in the back row`;
    case 'front':         return `+${p.n} when played in the front row`;
    case 'first':         return `+${p.n} if played first`;
    case 'last':          return `+${p.n} if played last`;
    case 'lonely':        return `+${p.n} if no chips are next to it`;
    case 'late':          return `+${p.n} if played in the last three turns`;
    case 'pair':          return `+${p.n} if next to another ${p.id ? CHARACTERS[p.id]?.name : 'chip of the same star'}`;
    case 'chain':         return `+${p.n} for each other chip in its row`;
    case 'crown':         return `+${p.n} if nothing on your side has more points`;
    case 'underdog':      return `+${p.n} if the opposing chip has more points`;
    case 'bomb':          return `-${p.n} to the opposing chip and its row neighbours`;
    case 'shield':        return 'Cannot lose points to opposing powers';
    case 'veto':          return 'Cancels the opposing chip\'s power';
  }
  return '';
}
export const POWER_NAMES = { x2: 'Buddy', perOppColor: 'Counter', perOwnColor: 'Rally', minusOppColor: 'Hex', plusOwnColor: 'Boost', plusAll: 'Anthem', opp: 'Jab', steal: 'Pickpocket', mirror: 'Mirror', back: 'Backstage', front: 'Spotlight', first: 'Opener', last: 'Closer', late: 'Encore', lonely: 'Loner', pair: 'Twins', chain: 'Chorus Line', crown: 'Crown', underdog: 'Underdog', bomb: 'Brick', shield: 'Shield', veto: 'Veto', none: 'None' };

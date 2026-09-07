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

// Chip colour groups (the ring around a companion and its point bubble).
export const COLORS = {
  grn: { name: 'Green',  abbr: 'Grn', hex: '#3ec81e', dark: '#1d7a0c' },
  yel: { name: 'Yellow', abbr: 'Yel', hex: '#f7e400', dark: '#a89a00' },
  org: { name: 'Orange', abbr: 'Org', hex: '#ff8a1e', dark: '#b85400' },
  red: { name: 'Red',    abbr: 'Red', hex: '#e8221c', dark: '#8f0f0b' },
  blu: { name: 'Blue',   abbr: 'Blu', hex: '#2f8ff5', dark: '#10469c' },
  prp: { name: 'Purple', abbr: 'Prp', hex: '#c02fe0', dark: '#6a1280' },
  slv: { name: 'Silver', abbr: 'Slv', hex: '#c4ced8', dark: '#6d7a88' },
};

// Findings: published sets of forms. The catalogue is open-ended: new fragments are
// found every year, so nothing displays a total, only what is known.
export const FINDINGS = {
  f1: { name: 'First Finding',  color: '#d9c27a', bg: ['#4a3618', '#b48a4a'], blurb: 'The first forms anyone wrote down. Kitchens, doorsteps, a river bend.' },
  f2: { name: 'Second Finding', color: '#d0d0d0', bg: ['#2b2b2b', '#7a7a7a'], blurb: 'Found along the road between the first towns.' },
  f3: { name: 'Third Finding',  color: '#4aa3df', bg: ['#0b3a5c', '#2e86c1'], blurb: 'Forms that only settle near water and work.' },
  f4: { name: 'Fourth Finding', color: '#e05a5a', bg: ['#5c0f14', '#c0392b'], blurb: 'Loud ones. Bright ones. Forms that like company.' },
  f5: { name: 'Fifth Finding',  color: '#f4b942', bg: ['#6b3f00', '#f4b942'], blurb: 'Written down late, on a cold clear night.' },
  f6: { name: 'Sixth Finding',  color: '#7fd1c8', bg: ['#0f3d3a', '#2aa198'], blurb: 'The newest pages. Still being added to.' },
  whole: { name: 'Whole Fragments', color: '#ffd166', bg: ['#2b1a4a', '#7b4dd6'], blurb: 'Unbroken pieces. Each is held by a Keeper. Never sold, never traded.' },
  award: { name: 'Awards',      color: '#ffffff', bg: ['#1f1f3a', '#4a4a8a'], blurb: 'Given for the road itself. Never in a pack.' },
};
FINDINGS.meta = { total: null }; // never known


// Forms: the fixed catalogue of shapes a fragment takes. 21 are bound to a region
// (three each), five are wanderers found anywhere; wanderers lead the first stacks.
export const FORMS = {
  alpha:    { name: 'Alpha', quips: ["Ready.", "Hm.", "Again."], finding: 'f1', wanderer: true, top: 5, home: 'Anywhere with a doorstep. It waits to be let in.', pull: 'Like a hand finding yours in a crowd.', quirk: 'Takes the first front socket and refuses to move.',
             stats: [["slv", 4, {"t": "perOwnColor", "color": "slv", "n": 2}], ["blu", 6, {"t": "front", "n": 4}], ["slv", 9, {"t": "minusOppColor", "color": "blu", "n": 3}], ["slv", 16, {"t": "plusAll", "n": 2}]] },
  bravo:    { name: 'Bravo', quips: ["Watch this.", "Easy.", "Next."], finding: 'f1', region: 1, top: 4, home: 'In the back of the bakery oven, after closing.', pull: 'Bread smell on a cold morning. That, exactly.', quirk: 'Warms the two sockets on either side of it.',
             stats: [["grn", 3, {"t": "back", "n": 3}], ["grn", 7, {"t": "lonely", "n": 5}], ["grn", 8, {"t": "perOwnColor", "color": "grn", "n": 2}], ["grn", 13, {"t": "plusOwnColor", "color": "grn", "n": 3}]] },
  charlie:  { name: 'Charlie', quips: ["Steady.", "Hold.", "Now."], finding: 'f1', region: 1, top: 3, home: 'Root cellar steps, third one down, always cool.', pull: 'A quiet you did not know you needed.', quirk: 'Only wakes up in a night socket.',
             stats: [["yel", 3, {"t": "none"}], ["org", 6, {"t": "back", "n": 4}], ["yel", 8, {"t": "steal", "n": 3}], ["yel", 11, {"t": "perOppColor", "color": "grn", "n": 3}]] },
  delta:    { name: 'Delta', quips: ["Here we go.", "Fine.", "Done."], finding: 'f2', region: 1, top: 4, home: 'Above the main street chimneys when supper is on.', pull: 'Someone waving from a lit window.', quirk: 'Rises to the back row and stays there.',
             stats: [["slv", 4, {"t": "x2", "id": "echo"}], ["prp", 6, {"t": "opp", "n": 3}], ["slv", 9, {"t": "mirror"}], ["slv", 13, {"t": "minusOppColor", "color": "red", "n": 3}]] },
  echo:     { name: 'Echo', quips: ["Onward.", "Careful.", "Ha."], finding: 'f2', region: 2, top: 3, home: 'Under the ferry ropes, counting its own feet.', pull: 'A tug on the line. Something is there.', quirk: 'Moves with the current. Front at dawn, back by dusk.',
             stats: [["slv", 2, {"t": "perOwnColor", "color": "slv", "n": 2}], ["blu", 5, {"t": "first", "n": 4}], ["slv", 7, {"t": "lonely", "n": 4}], ["slv", 10, {"t": "plusOwnColor", "color": "slv", "n": 2}]] },
  foxtrot:  { name: 'Foxtrot', quips: ["Let's see.", "Close.", "Right."], finding: 'f2', region: 2, top: 5, home: 'The shallows below the dock, where feet go numb.', pull: 'Cold at first. Then you stop noticing.', quirk: 'Never leaves the socket it lands in.',
             stats: [["red", 4, {"t": "x2", "id": "echo"}], ["red", 7, {"t": "front", "n": 4}], ["red", 10, {"t": "plusOwnColor", "color": "red", "n": 2}], ["red", 15, {"t": "perOwnColor", "color": "red", "n": 3}]] },
  golf:     { name: 'Golf', quips: ["Ready.", "Hm.", "Again."], finding: 'f3', wanderer: true, top: 5, home: 'In coat pockets, forgotten, then found again.', pull: 'Heavy in the good way. Like being held.', quirk: 'Sits at the back and holds up whatever it can.',
             stats: [["blu", 5, {"t": "x2", "id": "hotel"}], ["blu", 8, {"t": "opp", "n": 4}], ["blu", 10, {"t": "steal", "n": 4}], ["blu", 16, {"t": "opp", "n": 8}]] },
  hotel:    { name: 'Hotel', quips: ["Watch this.", "Easy.", "Next."], finding: 'f3', region: 2, top: 3, home: 'On the water before the first ferry runs.', pull: 'Not knowing where the bank is, and not minding.', quirk: 'Hides whoever stands behind it until noon.',
             stats: [["red", 2, {"t": "x2", "id": "golf"}], ["red", 5, {"t": "back", "n": 3}], ["red", 7, {"t": "perOwnColor", "color": "blu", "n": 2}], ["red", 10, {"t": "plusOwnColor", "color": "blu", "n": 2}]] },
  india:    { name: 'India', quips: ["Steady.", "Hold.", "Now."], finding: 'f4', region: 3, top: 4, home: 'Inside a cooling kiln, where it is warmest.', pull: 'Like holding a mug too hot to hold.', quirk: 'Refuses a night socket. Daylight only, no discussion.',
             stats: [["blu", 4, {"t": "lonely", "n": 3}], ["blu", 7, {"t": "front", "n": 3}], ["prp", 9, {"t": "minusOppColor", "color": "grn", "n": 3}], ["blu", 13, {"t": "plusOwnColor", "color": "blu", "n": 3}]] },
  juliett:  { name: 'Juliett', quips: ["Here we go.", "Fine.", "Done."], finding: 'f4', region: 3, top: 5, home: 'The reject shelf behind the workshop, slightly cracked.', pull: 'Stubborn. Yours anyway. Mostly the second thing.', quirk: 'Holds up two front sockets instead of one.',
             stats: [["slv", 4, {"t": "first", "n": 3}], ["org", 7, {"t": "perOwnColor", "color": "org", "n": 2}], ["slv", 9, {"t": "back", "n": 5}], ["slv", 15, {"t": "plusAll", "n": 2}]] },
  kilo:     { name: 'Kilo', quips: ["Onward.", "Careful.", "Ha."], finding: 'f4', region: 3, top: 3, home: 'Over the sun-baked terraces at the hottest hour.', pull: 'Wanting to make something before the day ends.', quirk: 'Wobbles the socket in front of it. On purpose.',
             stats: [["org", 3, {"t": "none"}], ["org", 6, {"t": "perOppColor", "color": "slv", "n": 2}], ["org", 8, {"t": "front", "n": 4}], ["org", 11, {"t": "plusOwnColor", "color": "org", "n": 2}]] },
  lima:     { name: 'Lima', quips: ["Let's see.", "Close.", "Right."], finding: 'f4', region: 4, top: 3, home: 'In the orchard, in the tallest tree\'s crook.', pull: 'Being handed something sweet without asking.', quirk: 'Passes warmth to whoever sits behind it.',
             stats: [["grn", 3, {"t": "back", "n": 2}], ["grn", 6, {"t": "x2", "id": "kilo"}], ["grn", 8, {"t": "opp", "n": 4}], ["grn", 11, {"t": "perOwnColor", "color": "grn", "n": 2}]] },
  mike:     { name: 'Mike', quips: ["Ready.", "Hm.", "Again."], finding: 'f5', wanderer: true, top: 4, home: 'The corner of any room, just past the lamp.', pull: 'A draft that somehow knows your name.', quirk: 'Drifts one socket left whenever nobody is looking.',
             stats: [["prp", 3, {"t": "x2", "id": "november"}], ["prp", 6, {"t": "mirror"}], ["prp", 8, {"t": "lonely", "n": 6}], ["prp", 12, {"t": "minusOppColor", "color": "blu", "n": 3}]] },
  november: { name: 'November', quips: ["Watch this.", "Easy.", "Next."], finding: 'f5', wanderer: true, top: 3, home: 'Wherever the umbrella got left behind.', pull: 'Like the first rain after a long dry week.', quirk: 'Dampens the socket beside it. Nobody minds.',
             stats: [["slv", 2, {"t": "opp", "n": 2}], ["org", 5, {"t": "steal", "n": 2}], ["slv", 7, {"t": "opp", "n": 5}], ["slv", 10, {"t": "steal", "n": 5}]] },
  oscar:    { name: 'Oscar', quips: ["Steady.", "Hold.", "Now."], finding: 'f5', region: 4, top: 4, home: 'Under the hive stands, where the grass stays soft.', pull: 'Old friend. You just met. Both are true.', quirk: 'Plays slow. The board somehow waits for it.',
             stats: [["blu", 3, {"t": "first", "n": 4}], ["yel", 6, {"t": "lonely", "n": 4}], ["blu", 8, {"t": "last", "n": 6}], ["blu", 12, {"t": "last", "n": 12}]] },
  papa:     { name: 'Papa', quips: ["Here we go.", "Fine.", "Done."], finding: 'f1', region: 4, top: 3, home: 'Coming through the orchard rows, smelling of leaves.', pull: 'Someone opening a window in a stuffy room.', quirk: 'Nudges every companion one socket toward the front.',
             stats: [["yel", 3, {"t": "first", "n": 2}], ["yel", 6, {"t": "chain", "n": 1}], ["org", 8, {"t": "underdog", "n": 5}], ["yel", 11, {"t": "chain", "n": 2}]] },
  quebec:   { name: 'Quebec', quips: ["Onward.", "Careful.", "Ha."], finding: 'f1', region: 5, top: 4, home: 'The bell tower, hanging by too many feet.', pull: 'A word said plainly, and meant.', quirk: 'Rings once when it takes a front socket.',
             stats: [["org", 4, {"t": "crown", "n": 3}], ["org", 6, {"t": "bomb", "n": 2}], ["red", 9, {"t": "veto"}], ["org", 13, {"t": "crown", "n": 6}]] },
  romeo:    { name: 'Romeo', quips: ["Let's see.", "Close.", "Right."], finding: 'f6', region: 5, top: 4, home: 'The steps below the radio tower, listening.', pull: 'Being heard without raising your voice.', quirk: 'Copies whoever plays beside it, half a turn late.',
             stats: [["slv", 3, {"t": "lonely", "n": 3}], ["slv", 6, {"t": "shield"}], ["blu", 9, {"t": "underdog", "n": 6}], ["slv", 13, {"t": "minusOppColor", "color": "red", "n": 3}]] },
  sierra:   { name: 'Sierra', quips: ["Ready.", "Hm.", "Again."], finding: 'f6', wanderer: true, top: 5, home: 'Rolling along any road, going the way you go.', pull: 'Company on a walk you meant to take alone.', quirk: 'Swaps front to back every turn. Never explains.',
             stats: [["red", 5, {"t": "opp", "n": 3}], ["red", 8, {"t": "bomb", "n": 2}], ["red", 10, {"t": "veto"}], ["red", 16, {"t": "bomb", "n": 4}]] },
  tango:    { name: 'Tango', quips: ["Watch this.", "Easy.", "Next."], finding: 'f6', region: 5, top: 3, home: 'Between the radio towers, in the soft static.', pull: 'The quiet after a bell stops.', quirk: 'Goes silent in daylight. Loud in a night socket.',
             stats: [["yel", 3, {"t": "plusOwnColor", "color": "yel", "n": 1}], ["yel", 6, {"t": "back", "n": 4}], ["yel", 8, {"t": "perOwnColor", "color": "yel", "n": 2}], ["yel", 11, {"t": "plusAll", "n": 1}]] },
  uniform:  { name: 'Uniform', quips: ["Steady.", "Hold.", "Now."], finding: 'f6', region: 6, top: 3, home: 'The telescope dome, curled where the lens cap goes.', pull: 'Being seen properly, all at once.', quirk: 'Sees the back row. Tells the front row.',
             stats: [["org", 3, {"t": "chain", "n": 1}], ["org", 6, {"t": "front", "n": 3}], ["blu", 8, {"t": "crown", "n": 4}], ["org", 11, {"t": "chain", "n": 2}]] },
  victor:   { name: 'Victor', quips: ["Here we go.", "Fine.", "Done."], finding: 'f6', region: 6, top: 4, home: 'The hill path, cold, where the stars come lowest.', pull: 'Frost on a clear morning. Bright and brief.', quirk: 'Only ever takes a night socket. Shines there.',
             stats: [["red", 4, {"t": "x2", "id": "juliett"}], ["red", 7, {"t": "plusOwnColor", "color": "red", "n": 2}], ["prp", 9, {"t": "shield"}], ["red", 13, {"t": "plusAll", "n": 2}]] },
  whiskey:  { name: 'Whiskey', quips: ["Onward.", "Careful.", "Ha."], finding: 'f5', region: 6, top: 4, home: 'Above the hill town on nights with no cloud.', pull: 'Seeing the whole sky and feeling small, kindly.', quirk: 'Turns the socket beside it from daylight to night.',
             stats: [["grn", 4, {"t": "x2", "id": "xray"}], ["grn", 7, {"t": "late", "n": 4}], ["grn", 9, {"t": "underdog", "n": 6}], ["grn", 13, {"t": "plusOwnColor", "color": "grn", "n": 3}]] },
  xray:     { name: 'Xray', quips: ["Let's see.", "Close.", "Right."], finding: 'f5', region: 7, top: 3, home: 'Above the weather, on the last steps up.', pull: 'Everything you brought, all at once, held gently.', quirk: 'Takes whichever socket is empty. Fills it completely.',
             stats: [["grn", 2, {"t": "x2", "id": "whiskey"}], ["yel", 5, {"t": "lonely", "n": 4}], ["grn", 7, {"t": "first", "n": 5}], ["grn", 10, {"t": "late", "n": 6}]] },
  yankee:   { name: 'Yankee', quips: ["Ready.", "Hm.", "Again."], finding: 'f5', region: 7, top: 3, home: 'The top of the highest building, catching wind.', pull: 'Standing still and finally feeling it.', quirk: 'Holds up the whole front row on its own.',
             stats: [["org", 3, {"t": "underdog", "n": 3}], ["org", 5, {"t": "steal", "n": 2}], ["org", 8, {"t": "lonely", "n": 5}], ["org", 11, {"t": "underdog", "n": 8}]] },
  zulu:     { name: 'Zulu', quips: ["Watch this.", "Easy.", "Next."], finding: 'f5', region: 7, top: 4, home: 'Where the weather stops and the light turns white.', pull: 'Arriving. Being the one who arrived.', quirk: 'Counts as daylight and night. Both at once.',
             stats: [["red", 3, {"t": "bomb", "n": 1}], ["red", 6, {"t": "opp", "n": 3}], ["yel", 9, {"t": "chain", "n": 2}], ["red", 12, {"t": "bomb", "n": 3}]] },
};
export const CHARACTERS = FORMS;

// Eight editions per form. Common/Uncommon/Rare are the base set; Mythic and
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
// after the companion has been on the board for three wins (see game.train()).
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
      out.push({ id: `${key}${e.n}`, char: key, series: c.finding, finding: c.finding, region: c.region || null, wanderer: !!c.wanderer, name: e.label(c), short: c.name, edition: typeof e.tag === 'function' ? e.tag(c) : e.tag,
        edShort: typeof e.short === 'function' ? e.short(c) : e.short,
        variant: e.variant, pose: e.pose, rarity, light: rarity, points: VALUE[rarity], color, pts, power, secret: SECRETS[e.variant] || null, home: c.home, pull: c.pull, quirk: c.quirk });
    });
  }
  // Awards: given for the road itself, never in a pack.
  const award = (id, char, name, color, pts, power, blurb) => ({ id, char, series: 'award', finding: 'award', name, short: name, edition: 'Award', edShort: 'Award', variant: 'holo', pose: 'normal', rarity: 5, light: 5, points: VALUE[5], color, pts, power, blurb });
  out.push(
    award('pz01', 'rookie', 'Award · The First Day',   'slv', 7,  { t: 'first', n: 5 },                       'Given to everyone who sets out.'),
    award('pz02', 'comet',  'Award · Seven Days',  'org', 11, { t: 'front', n: 5 },                       'Come back seven days running.'),
    award('pz03', 'crown',  'Award · The Collector',   'yel', 11, { t: 'perOwnColor', color: 'slv', n: 3 },   'Find sixty different companions.'),
    award('pz04', 'titan',  'Award · The Trader',      'slv', 12, { t: 'plusOwnColor', color: 'slv', n: 2 },  'Trade ten times.'),
    award('pz05', 'badge',  'Award · The Player',     'red', 12, { t: 'opp', n: 7 },                         'Win twenty-five meetings.'),
    award('pz06', 'champ',  'Award · The Champion',    'slv', 16, { t: 'plusAll', n: 2 },                     'Meet the toughest sparring partner.'),
  );
  // Whole fragments: one per Keeper, one for every known companion. Never in a pack.
  const one = (n, name, color, pts, power, secret, blurb) => ({ id: `one${n}`, char: 'one', series: 'whole', finding: 'whole', name, short: name, edition: 'Whole fragment', edShort: 'Whole', variant: 'gold', pose: 'hero', rarity: 4, light: 4, points: VALUE[4], color, pts, power, secret, blurb, one: n, region: n <= 7 ? n : null });
  out.push(
    one(1, 'Whole fragment of The Hearth', 'slv', 12, { t: 'mirror' },                          { t: 'shield' },          'Unbroken. Held by the Keeper of the Hearth until a true meeting.'),
    one(2, 'Whole fragment of The Tide', 'blu', 14, { t: 'opp', n: 6 },                       { t: 'crown', n: 4 },     'Unbroken. Held by the second Keeper until a true meeting.'),
    one(3, 'Whole fragment of The Forge', 'org', 12, { t: 'bomb', n: 3 },                      { t: 'late', n: 5 },      'Unbroken. Held by the third Keeper until a true meeting.'),
    one(4, 'Whole fragment of The Grove', 'blu', 13, { t: 'last', n: 9 },                      { t: 'veto' },            'Unbroken. Held by the fourth Keeper until a true meeting.'),
    one(5, 'Whole fragment of The Choir', 'prp', 14, { t: 'plusOwnColor', color: 'prp', n: 3 }, { t: 'chain', n: 2 },    'Unbroken. Held by the fifth Keeper until a true meeting.'),
    one(6, 'Whole fragment of The Observatory', 'grn', 13, { t: 'chain', n: 2 },                     { t: 'underdog', n: 8 },  'Unbroken. Held by the sixth Keeper until a true meeting.'),
    one(7, 'Whole fragment of The Summit', 'slv', 16, { t: 'plusAll', n: 2 },                   { t: 'crown', n: 6 },     'Unbroken. Held by the seventh Keeper until a true meeting.'),
    one(8, 'Whole fragment of the road', 'yel', 16, { t: 'plusAll', n: 3 },                   { t: 'veto' },            'Unbroken. For the one who found every known companion.'),
  );
  return out;
}
export const CATALOGUE = build();
export const CHIPS = CATALOGUE;
export const BY_ID = Object.fromEntries(CATALOGUE.map(t => [t.id, t]));
export const PACKABLE = CATALOGUE.filter(t => t.series !== 'award' && t.series !== 'whole');
// The eight editions that make up a character's set (1/1s and Awards are not part of any set).
export const setOf = (charKey) => CATALOGUE.filter(t => t.char === charKey && t.series !== 'whole' && t.series !== 'award');
export const isWhole = (t) => !!t && t.series === 'whole';
export const isTour = isWhole;
export const isOneOfOne = isTour;

export const PACKS = [
  { id: 'std',  name: 'Plain Blanks', price: 300, size: 3, desc: '3 blanks. Uncommon light or better.',
    odds: [0.60, 0.27, 0.10, 0.025, 0.005], minRarity: 1 },
  { id: 'prem', name: 'Good Blanks',  price: 900, size: 4, desc: '4 blanks. Rare light or better. Kinder odds all round.',
    odds: [0.25, 0.35, 0.28, 0.10, 0.02],  minRarity: 2 },
  { id: 'mega', name: 'Fine Blanks',     price: 2000, size: 5, desc: '5 blanks. One Mythic light or better.',
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
  { id: 'win1',  text: 'Win a meeting',              goal: 1, stat: 'winsToday',   reward: 150 },
  { id: 'play2', text: 'Play two meetings',           goal: 2, stat: 'playsToday',  reward: 120 },
  { id: 'pack1', text: 'Open a pack of blanks',              goal: 1, stat: 'packsToday',  reward: 100 },
  { id: 'trade1', text: 'Trade with someone',            goal: 1, stat: 'tradesToday', reward: 100 },
  { id: 'recyc2', text: 'Let two companions go',         goal: 2, stat: 'recycToday',  reward: 80 },
];

export const PROMO_CODES = {
  'WELCOME500': { points: 500,     text: '500 coins. Welcome to the road.' },
  'FREEPACK':   { pack: 'std',     text: 'A free Plain Blanks.' },
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
    case 'perOppColor':   return `+${p.n} for each opponent ${cn(p.color)} companion`;
    case 'perOwnColor':   return `+${p.n} for each of your ${cn(p.color)} companions`;
    case 'minusOppColor': return `-${p.n} to each opponent ${cn(p.color)} companion`;
    case 'plusOwnColor':  return `+${p.n} to each of your other ${cn(p.color)} companions`;
    case 'plusAll':       return `+${p.n} to each of your other companions`;
    case 'opp':           return `-${p.n} to the opposing companion`;
    case 'steal':         return `Takes ${p.n} points from the opposing companion`;
    case 'mirror':        return `Copies the opposing companion's points`;
    case 'back':          return `+${p.n} when played in the back row`;
    case 'front':         return `+${p.n} when played in the front row`;
    case 'first':         return `+${p.n} if played first`;
    case 'last':          return `+${p.n} if played last`;
    case 'lonely':        return `+${p.n} if no companions are next to it`;
    case 'late':          return `+${p.n} if played in the last three turns`;
    case 'pair':          return `+${p.n} if next to another ${p.id ? CHARACTERS[p.id]?.name : 'companion of the same star'}`;
    case 'chain':         return `+${p.n} for each other companion in its row`;
    case 'crown':         return `+${p.n} if nothing on your side has more points`;
    case 'underdog':      return `+${p.n} if the opposing companion has more points`;
    case 'bomb':          return `-${p.n} to the opposing companion and its row neighbours`;
    case 'shield':        return 'Cannot lose points to opposing powers';
    case 'veto':          return 'Cancels the opposing companion\'s power';
  }
  return '';
}
export const POWER_NAMES = { x2: 'Buddy', perOppColor: 'Counter', perOwnColor: 'Rally', minusOppColor: 'Hex', plusOwnColor: 'Boost', plusAll: 'Anthem', opp: 'Jab', steal: 'Pickpocket', mirror: 'Mirror', back: 'Backstage', front: 'Spotlight', first: 'Opener', last: 'Closer', late: 'Encore', lonely: 'Loner', pair: 'Twins', chain: 'Chorus Line', crown: 'Crown', underdog: 'Underdog', bomb: 'Brick', shield: 'Shield', veto: 'Veto', none: 'None' };

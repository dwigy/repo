// The single source of truth for every world term and proper noun.
// Nothing else in the app may hard-code a world noun: render through t()/T()
// and WORLD. Renaming the collectible or the corporation is a one-line change here.

export const TERM = {
  // the collectible. `brand` is the one cool word still pending; until it lands, UI uses `companion`/`disc` by context.
  brand:        { s: 'companion', p: 'companions' },   // PENDING: replace with the final brand word in one place
  companion:    { s: 'companion', p: 'companions' },   // a fragment that has settled into a disc and bonded with a person
  disc:         { s: 'disc',      p: 'discs' },        // the physical object
  blank:        { s: 'blank',     p: 'blanks' },       // an empty disc, hand-made, sold sealed in packs
  fragment:     { s: 'fragment',  p: 'fragments' },    // the piece of the universe itself; never sold, never counted
  form:         { s: 'form',      p: 'forms' },        // the shape a fragment takes (a catalogue entry)
  finding:      { s: 'finding',   p: 'findings' },     // a published set of forms (replaces "set"/"series")
  stack:        { s: 'stack',     p: 'stacks' },       // 20 companions carried together; 12 played
  meeting:      { s: 'meeting',   p: 'meetings' },     // a match
  student:      { s: 'student',   p: 'students' },     // anyone on the road
  champion:     { s: 'champion',  p: 'champions' },
  keeper:       { s: 'Keeper',    p: 'Keepers' },      // region leader
  seal:         { s: 'Seal',      p: 'Seals' },        // region mark on the profile (replaces badge)
  whole:        { s: 'whole fragment', p: 'whole fragments' }, // the 1/1s
  region:       { s: 'region',    p: 'regions' },
  town:         { s: 'town',      p: 'towns' },
  shop:         { s: 'shop',      p: 'shops' },
  pack:         { s: 'pack',      p: 'packs' },        // a sealed pack of blanks
  coin:         { s: 'coin',      p: 'coins' },
  portfolio:    { s: 'portfolio', p: 'portfolios' },
  light:        { s: 'light',     p: 'light' },        // rarity inside the fiction: how much of the original light a companion kept
  binder:       { s: 'binder',    p: 'binders' },      // where the collection lives on the device
  award:        { s: 'award',     p: 'awards' },       // milestone companions, never in a pack
};

export const WORLD = {
  // PENDING (agency). Changing this renames the game everywhere in the app.
  // Two files cannot import a module and carry the literal: index.html (title,
  // boot line, apple-mobile-web-app-title) and manifest.webmanifest (name,
  // short_name). Change those three by hand and nothing else.
  game:        '[GAME]',
  corp:        '[CORP]',            // PENDING: the corporation. Candidates: Everhold Corp., Meridian Corp., Halcyon Corp., Vantage Corp.
  corpChief:   'the Chief',         // its executive; face unseen until the end
  gathering:   'the Gathering',     // the corporation's plan
  tinker:      'the Tinker',        // the anonymous inventor of the disc
  tinkersNight:'Tinker\'s Night',   // the longest night of the year, a celebration
  breath:      'the Breath',        // the rumour: blanks are empty until the opener's breath draws a fragment in
  dimming:     'the Dimming',       // the centuries-long fading of fragment power
  split:       'the Great Split',
  before:      'before the Split',  // the time before has NO proper noun, ever
  hall:        'the Hall',          // the circle of champions: twelve seats and an empty thirteenth chair
  chair:       'the empty chair',
  regions: [   // index 0..6 = regions 1..7. Town-scale. Colour is the region light.
    { key: 'hearth',      name: 'The Hearth',      town: 'a warm village with root cellars and one long main street', hue: '#e8221c', lesson: 'Foundation', line: 'Stand somewhere before you go anywhere.', question: 'Where do you come from?' },
    { key: 'tide',        name: 'The Tide',        town: 'a river town of docks and ferries',                          hue: '#ff8a1e', lesson: 'Flow',       line: 'Let things move. Feel what you feel.',   question: 'What do you want?' },
    { key: 'forge',       name: 'The Forge',       town: 'a workshop town of kilns and sun-baked terraces',           hue: '#f7e400', lesson: 'Will',       line: 'Make something and stand behind it.',     question: 'What will you do?' },
    { key: 'grove',       name: 'The Grove',       town: 'an orchard town with a wind that smells green',             hue: '#3ec81e', lesson: 'Care',       line: 'Play for the other player too.',          question: 'Who is this for?' },
    { key: 'signal',      name: 'The Signal',      town: 'a small city of radio towers and open windows',             hue: '#2f8ff5', lesson: 'Voice',      line: 'Say the true thing plainly.',             question: 'What do you mean?' },
    { key: 'observatory', name: 'The Observatory', town: 'a hill town under clear cold nights',                       hue: '#4b3fbf', lesson: 'Sight',      line: 'See the board that is really there.',     question: 'What do you see?' },
    { key: 'summit',      name: 'The Summit',      town: 'a handful of buildings above the weather',                  hue: '#c02fe0', lesson: 'Wholeness',  line: 'Bring it all with you.',                  question: 'Who are you now?', lightAtClear: '#ffffff' },
  ],
  tellings: [  // the five beliefs about the Split. Never resolved. Each Keeper holds one; the Hall holds all.
    { key: 'love',   name: 'the Love telling',   card: 'Harmony broke itself on purpose. So it could be found again, piece by piece, by hands that chose it.', color: '#ff5c8a' },
    { key: 'luck',   name: 'the Luck telling',   card: 'Nothing chose anything. Chance is the oldest law. The fragments are lucky because they remember the roll.', color: '#f5a623' },
    { key: 'seed',   name: 'the Seed telling',   card: 'Harmony did not break. It planted itself. A seed comes apart to grow.', color: '#3ec81e' },
    { key: 'mirror', name: 'the Mirror telling', card: 'Harmony looked at itself and saw two. The fragments are the one meeting itself.', color: '#7cc4ff' },
    { key: 'sleep',  name: 'the Sleep telling',  card: 'Harmony is not gone. It is asleep. The fragments are its dreams.', color: '#9b4dff' },
  ],
};

// t('companion') -> 'companion'; t('companion', 2) -> 'companions'; T() capitalises the first letter.
export const t = (key, n = 1) => { const e = TERM[key]; if (!e) return key; return n === 1 ? e.s : e.p; };
export const T = (key, n = 1) => { const w = t(key, n); return w.charAt(0).toUpperCase() + w.slice(1); };
export const U = (key, n = 1) => t(key, n).toUpperCase();
export const region = (n) => WORLD.regions[Math.max(1, Math.min(7, n)) - 1];
export const telling = (key) => WORLD.tellings.find(x => x.key === key) || null;
// "N of M known" — the catalogue is open-ended; never say "total".
export const known = (have, knownCount) => `${have} of ${knownCount} known`;

// Cartoon Orbit — catalog data.
// All characters, series and artwork are original creations for this game.

export const RARITY = [
  { key: 'common',    name: 'Common',          color: '#9aa3b2', recycle: 25   },
  { key: 'uncommon',  name: 'Uncommon',        color: '#4ade80', recycle: 60   },
  { key: 'rare',      name: 'Rare',            color: '#60a5fa', recycle: 150  },
  { key: 'veryrare',  name: 'Very Rare',       color: '#c084fc', recycle: 400  },
  { key: 'extreme',   name: 'Extremely Rare',  color: '#fb923c', recycle: 1000 },
  { key: 'ultra',     name: 'Ultra Rare',      color: '#fbbf24', recycle: 2500 },
  { key: 'prize',     name: 'Prize',           color: '#f472b6', recycle: 0    },
];

export const SERIES = {
  rr: { name: 'Rocket Rascals',    color: '#38bdf8', bg: '#0b2a4a', blurb: 'Six kids, one leaky rocket, zero adult supervision.' },
  gw: { name: 'Grumble Woods',     color: '#4ade80', bg: '#0f3a22', blurb: 'The forest where every monster is mostly harmless.' },
  rd: { name: 'Robo Diner',        color: '#fb923c', bg: '#4a2508', blurb: 'Open 24 hours. Staffed entirely by malfunctioning robots.' },
  ss: { name: 'Spooky Street',     color: '#c084fc', bg: '#2e1052', blurb: 'The friendliest haunted block in town.' },
  mm: { name: 'Mega Muffin Squad', color: '#f472b6', bg: '#4a0f2e', blurb: 'Baked goods with super powers and short tempers.' },
  cc: { name: 'Captain Cactus',    color: '#facc15', bg: '#4a3a05', blurb: 'One prickly hero. One very big desert.' },
  pz: { name: 'Orbit Prizes',      color: '#ffffff', bg: '#1f1f3a', blurb: 'Exclusive cToons you can only earn, never buy.' },
};

// Build a cToon. r = rarity index, p = points, ab = gToons ability.
function c(id, series, name, r, p, ab, art, blurb) {
  return { id, series, name, rarity: r, points: p, ability: ab, art, blurb };
}

export const CTOONS = [
  // ---------- Rocket Rascals ----------
  c('rr01','rr','Zip Nova',0,12,{t:'adjSame',n:4},{body:'round',c1:'#7dd3fc',c2:'#0369a1',eyes:'big',mouth:'grin',hat:'helmet',extra:'none'},'Never met a launch button she did not push.'),
  c('rr02','rr','Cosmo Pip',0,10,{t:'top',n:5},{body:'round',c1:'#bae6fd',c2:'#0284c7',eyes:'dot',mouth:'smile',hat:'antenna',extra:'blush'},'The smallest rascal. Fits in the glove box.'),
  c('rr03','rr','Luna Beep',0,14,{t:'none'},{body:'square',c1:'#a5b4fc',c2:'#3730a3',eyes:'happy',mouth:'open',hat:'helmet',extra:'star'},'Communicates only in beeps. Everyone understands her perfectly.'),
  c('rr04','rr','Comet Kid',1,24,{t:'first',n:10},{body:'tall',c1:'#60a5fa',c2:'#1e3a8a',eyes:'angry',mouth:'grin',hat:'cap',extra:'cape'},'Fast. Loud. Frequently on fire.'),
  c('rr05','rr','Astro Tuffy',1,28,{t:'opp',n:6},{body:'square',c1:'#93c5fd',c2:'#1d4ed8',eyes:'angry',mouth:'flat',hat:'helmet',extra:'scar'},'Has arm-wrestled a black hole. Lost, but still.'),
  c('rr06','rr','Orbit Otto',2,42,{t:'series',n:6},{body:'round',c1:'#0ea5e9',c2:'#082f49',eyes:'sleepy',mouth:'smile',hat:'antenna',extra:'glasses'},'The navigator. Has never once known where they are.'),
  c('rr07','rr','Starla Zoom',2,46,{t:'center',n:15},{body:'star',c1:'#fde68a',c2:'#f59e0b',eyes:'big',mouth:'grin',hat:'none',extra:'none'},'Literally a star. Do not touch. Very hot.'),
  c('rr08','rr','Captain Quasar',3,70,{t:'ally',n:8},{body:'tall',c1:'#3b82f6',c2:'#172554',eyes:'angry',mouth:'grin',hat:'helmet',extra:'badge'},'The leader. Elected because he had the biggest hat.'),
  c('rr09','rr','Nebula Nan',4,100,{t:'oppRow',n:8},{body:'blob',c1:'#a78bfa',c2:'#4c1d95',eyes:'three',mouth:'wavy',hat:'none',extra:'sparkle'},'A cloud of gas the size of a galaxy. Bakes cookies.'),
  c('rr10','rr','Big Bang Baby',5,150,{t:'allyAll',n:8},{body:'round',c1:'#fbbf24',c2:'#b45309',eyes:'big',mouth:'open',hat:'crown',extra:'sparkle'},'Started the universe by accident. Was not grounded for it.'),

  // ---------- Grumble Woods ----------
  c('gw01','gw','Mossy',0,11,{t:'lonely',n:8},{body:'blob',c1:'#86efac',c2:'#166534',eyes:'sleepy',mouth:'smile',hat:'leaves',extra:'none'},'Moves one inch per day. Considers this rushing.'),
  c('gw02','gw','Twiggle',0,13,{t:'adjAny',n:3},{body:'tall',c1:'#bef264',c2:'#3f6212',eyes:'dot',mouth:'grin',hat:'leaves',extra:'none'},'Part stick, part bug, all trouble.'),
  c('gw03','gw','Bramble Bob',0,15,{t:'none'},{body:'round',c1:'#4ade80',c2:'#14532d',eyes:'angry',mouth:'flat',hat:'none',extra:'spikes'},'Do not hug. He would like a hug, but do not.'),
  c('gw04','gw','Fernando Fuzz',1,26,{t:'adjSame',n:6},{body:'blob',c1:'#22c55e',c2:'#052e16',eyes:'big',mouth:'open',hat:'none',extra:'fuzz'},'Ninety percent fur. Ten percent enthusiasm.'),
  c('gw05','gw','Old Stumpy',1,30,{t:'bottom',n:12},{body:'square',c1:'#a16207',c2:'#422006',eyes:'sleepy',mouth:'flat',hat:'mushroom',extra:'none'},'Has been here longer than the forest. Will not explain.'),
  c('gw06','gw','Snoot the Newt',2,40,{t:'steal',n:6},{body:'tall',c1:'#fb923c',c2:'#7c2d12',eyes:'happy',mouth:'tongue',hat:'none',extra:'spots'},'Steals snacks. Steals hearts. Mostly snacks.'),
  c('gw07','gw','Mushroom Marge',2,48,{t:'ally',n:7},{body:'round',c1:'#fecaca',c2:'#991b1b',eyes:'happy',mouth:'smile',hat:'mushroom',extra:'spots'},'Runs the forest bakery. Everything tastes of dirt. Delicious dirt.'),
  c('gw08','gw','Grumble King',3,72,{t:'oppRow',n:6},{body:'blob',c1:'#166534',c2:'#022c22',eyes:'angry',mouth:'fang',hat:'crown',extra:'none'},'Rules the woods with an iron grumble.'),
  c('gw09','gw','Great Owlbert',4,105,{t:'rare',n:10},{body:'owl',c1:'#d6d3d1',c2:'#44403c',eyes:'big',mouth:'beak',hat:'none',extra:'monocle'},'Knows everything. Charges by the hour.'),
  c('gw10','gw','Root Mother',5,155,{t:'series',n:14},{body:'tall',c1:'#65a30d',c2:'#1a2e05',eyes:'sleepy',mouth:'smile',hat:'leaves',extra:'sparkle'},'Every tree in Grumble Woods is technically her kid.'),

  // ---------- Robo Diner ----------
  c('rd01','rd','Toaster Ted',0,12,{t:'top',n:4},{body:'robot',c1:'#fdba74',c2:'#7c2d12',eyes:'dot',mouth:'flat',hat:'antenna',extra:'none'},'Two slots. No patience.'),
  c('rd02','rd','Flip-Bot',0,13,{t:'none'},{body:'robot',c1:'#fed7aa',c2:'#9a3412',eyes:'happy',mouth:'grin',hat:'chef',extra:'none'},'Flips burgers, pancakes, and occasionally customers.'),
  c('rd03','rd','Sprinkles',0,10,{t:'adjAny',n:4},{body:'round',c1:'#fda4af',c2:'#be123c',eyes:'big',mouth:'smile',hat:'none',extra:'sprinkles'},'Dispenses sprinkles. Has never been asked to.'),
  c('rd04','rd','Waffle Wally',1,25,{t:'corner',n:10},{body:'square',c1:'#f59e0b',c2:'#78350f',eyes:'sleepy',mouth:'open',hat:'none',extra:'grid'},'Square. Deeply, structurally square.'),
  c('rd05','rd','Fry-o-Matic',1,29,{t:'opp',n:7},{body:'robot',c1:'#f97316',c2:'#431407',eyes:'angry',mouth:'fang',hat:'antenna',extra:'none'},'Runs hot. Do not mention the grease fire.'),
  c('rd06','rd','Chef Circuit',2,44,{t:'ally',n:6},{body:'robot',c1:'#e5e7eb',c2:'#374151',eyes:'angry',mouth:'flat',hat:'chef',extra:'mustache'},'Michelin-rated. Also rated for indoor use only.'),
  c('rd07','rd','Milkshake Mike',2,41,{t:'mirror'},{body:'tall',c1:'#f5d0fe',c2:'#a21caf',eyes:'happy',mouth:'grin',hat:'cherry',extra:'none'},'Shakes so hard the diner moves.'),
  c('rd08','rd','Deep Fryer Dave',3,68,{t:'oppHalf'},{body:'square',c1:'#eab308',c2:'#713f12',eyes:'angry',mouth:'grin',hat:'none',extra:'bubbles'},'Will fry anything. Has fried everything.'),
  c('rd09','rd','The Manager',4,98,{t:'allyAll',n:6},{body:'robot',c1:'#94a3b8',c2:'#0f172a',eyes:'dot',mouth:'flat',hat:'tophat',extra:'badge'},'Would like to see YOU in the office.'),
  c('rd10','rd','Golden Spatula',5,140,{t:'last',n:60},{body:'spatula',c1:'#fde047',c2:'#a16207',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'The most powerful utensil in the known universe.'),

  // ---------- Spooky Street ----------
  c('ss01','ss','Boo-Boo',0,11,{t:'lonely',n:6},{body:'ghost',c1:'#f5f3ff',c2:'#6d28d9',eyes:'big',mouth:'open',hat:'none',extra:'blush'},'Tries to scare people. Apologizes immediately.'),
  c('ss02','ss','Wisp',0,10,{t:'adjSame',n:5},{body:'ghost',c1:'#ddd6fe',c2:'#5b21b6',eyes:'dot',mouth:'smile',hat:'none',extra:'sparkle'},'Mostly a suggestion of a ghost.'),
  c('ss03','ss','Chilly Chad',0,14,{t:'bottom',n:5},{body:'ghost',c1:'#a5f3fc',c2:'#155e75',eyes:'sleepy',mouth:'wavy',hat:'cap',extra:'none'},'Always cold. Always says so.'),
  c('ss04','ss','Madame Moth',1,27,{t:'top',n:10},{body:'moth',c1:'#e9d5ff',c2:'#7e22ce',eyes:'big',mouth:'smile',hat:'none',extra:'none'},'Runs toward every light. Has never found the right one.'),
  c('ss05','ss','Rattles',1,24,{t:'adjAny',n:5},{body:'skull',c1:'#fafaf9',c2:'#3f3f46',eyes:'x',mouth:'grin',hat:'none',extra:'none'},'A very upbeat skeleton. Loves maracas.'),
  c('ss06','ss','Count Snackula',2,45,{t:'steal',n:8},{body:'tall',c1:'#c4b5fd',c2:'#2e1065',eyes:'angry',mouth:'fang',hat:'none',extra:'cape'},'Only bites cookies. Only at midnight.'),
  c('ss07','ss','Sheet Face',2,38,{t:'mirror'},{body:'ghost',c1:'#ffffff',c2:'#7c3aed',eyes:'x',mouth:'open',hat:'none',extra:'none'},'Copies everyone. Is very good at it.'),
  c('ss08','ss','Mayor Gloom',3,74,{t:'oppRow',n:7},{body:'square',c1:'#6b7280',c2:'#111827',eyes:'sleepy',mouth:'flat',hat:'tophat',extra:'mustache'},'Elected on a platform of more fog.'),
  c('ss09','ss','Midnight Cat',4,102,{t:'lonely',n:40},{body:'cat',c1:'#1e1b4b',c2:'#facc15',eyes:'happy',mouth:'smile',hat:'none',extra:'none'},'Crosses your path on purpose. Personally.'),
  c('ss10','ss','Lady Lantern',5,152,{t:'allyAll',n:9},{body:'lantern',c1:'#fde68a',c2:'#b45309',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Lights every street on Spooky Street. Asks nothing in return.'),

  // ---------- Mega Muffin Squad ----------
  c('mm01','mm','Blueberry Bill',0,12,{t:'adjSame',n:4},{body:'muffin',c1:'#c7d2fe',c2:'#4338ca',eyes:'happy',mouth:'smile',hat:'none',extra:'spots'},'Full of berries. Full of feelings.'),
  c('mm02','mm','Crumbs',0,10,{t:'adjAny',n:3},{body:'round',c1:'#fde68a',c2:'#92400e',eyes:'dot',mouth:'smile',hat:'none',extra:'none'},'What is left after the squad has a meeting.'),
  c('mm03','mm','Choco Chip Chuck',0,15,{t:'none'},{body:'muffin',c1:'#d6b48a',c2:'#3f2314',eyes:'angry',mouth:'grin',hat:'none',extra:'spots'},'The muscle. Also the chips.'),
  c('mm04','mm','Bran Flakes',1,23,{t:'bottom',n:9},{body:'square',c1:'#d4a373',c2:'#6b3f1d',eyes:'sleepy',mouth:'flat',hat:'none',extra:'glasses'},'Good for you. Knows it. Mentions it.'),
  c('mm05','mm','Sprinkle Sue',1,28,{t:'series',n:5},{body:'muffin',c1:'#fbcfe8',c2:'#be185d',eyes:'big',mouth:'grin',hat:'bow',extra:'sprinkles'},'Sparkle level: unsafe.'),
  c('mm06','mm','Captain Cupcake',2,47,{t:'ally',n:7},{body:'muffin',c1:'#f9a8d4',c2:'#9d174d',eyes:'angry',mouth:'grin',hat:'cherry',extra:'cape'},'Leads the squad. Frosting-first into danger.'),
  c('mm07','mm','Dr. Donut',2,43,{t:'center',n:14},{body:'donut',c1:'#fda4af',c2:'#881337',eyes:'happy',mouth:'smile',hat:'none',extra:'sprinkles'},'Has a hole where his heart should be. Is fine with it.'),
  c('mm08','mm','Frosting Fury',3,71,{t:'opp',n:14},{body:'round',c1:'#fecdd3',c2:'#e11d48',eyes:'angry',mouth:'fang',hat:'none',extra:'swirl'},'Do not ask about the sprinkles incident.'),
  c('mm09','mm','The Baker',4,99,{t:'rare',n:9},{body:'tall',c1:'#fef3c7',c2:'#78350f',eyes:'sleepy',mouth:'smile',hat:'chef',extra:'mustache'},'Made the whole squad. Regrets a few of them.'),
  c('mm10','mm','Mega Muffin Prime',5,158,{t:'series',n:12},{body:'muffin',c1:'#fbbf24',c2:'#7c2d12',eyes:'big',mouth:'grin',hat:'crown',extra:'sparkle'},'The final form. Blueberry, chocolate AND bran.'),

  // ---------- Captain Cactus ----------
  c('cc01','cc','Prickles',0,13,{t:'opp',n:3},{body:'cactus',c1:'#86efac',c2:'#166534',eyes:'big',mouth:'smile',hat:'none',extra:'spikes'},'Tiny. Pointy. Adorable at a distance.'),
  c('cc02','cc','Sandy',0,10,{t:'lonely',n:7},{body:'blob',c1:'#fde68a',c2:'#a16207',eyes:'dot',mouth:'smile',hat:'none',extra:'none'},'A living pile of sand. Gets everywhere.'),
  c('cc03','cc','Tumbleweed Tim',0,12,{t:'adjAny',n:3},{body:'tumble',c1:'#d4a373',c2:'#78350f',eyes:'sleepy',mouth:'flat',hat:'none',extra:'none'},'Goes wherever the wind says. The wind says a lot.'),
  c('cc04','cc','Rattlesnake Ray',1,26,{t:'steal',n:5},{body:'snake',c1:'#a3e635',c2:'#365314',eyes:'angry',mouth:'tongue',hat:'cowboy',extra:'none'},'Shakes before he bites. It is only polite.'),
  c('cc05','cc','Dusty the Mule',1,29,{t:'adjSame',n:7},{body:'tall',c1:'#a8a29e',c2:'#44403c',eyes:'sleepy',mouth:'flat',hat:'none',extra:'ears'},'Carries everything. Complains about all of it.'),
  c('cc06','cc','Captain Cactus',2,50,{t:'ally',n:8},{body:'cactus',c1:'#22c55e',c2:'#14532d',eyes:'angry',mouth:'grin',hat:'cowboy',extra:'badge'},'The hero of the desert. Needs water. Never says so.'),
  c('cc07','cc','Sheriff Scorch',2,44,{t:'oppRow',n:5},{body:'square',c1:'#f97316',c2:'#7c2d12',eyes:'angry',mouth:'flat',hat:'cowboy',extra:'mustache'},'Keeps the peace. Keeps it very hot.'),
  c('cc08','cc','Mirage Mae',3,66,{t:'mirror'},{body:'ghost',c1:'#fef9c3',c2:'#ca8a04',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Might not be real. Definitely charming.'),
  c('cc09','cc','The Sun Baron',4,108,{t:'top',n:30},{body:'sun',c1:'#fbbf24',c2:'#dc2626',eyes:'angry',mouth:'grin',hat:'none',extra:'none'},'Owns the sun. Rents it out by the afternoon.'),
  c('cc10','cc','The Lost Oasis',5,160,{t:'allyAll',n:10},{body:'oasis',c1:'#67e8f9',c2:'#0e7490',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Everybody is looking for it. It is also looking for you.'),

  // ---------- Orbit Prizes (earn only) ----------
  c('pz01','pz','Orbit Rookie',6,60,{t:'first',n:20},{body:'round',c1:'#e0e7ff',c2:'#4f46e5',eyes:'happy',mouth:'grin',hat:'helmet',extra:'star'},'Awarded to every new Orbiter. Welcome aboard!'),
  c('pz02','pz','Streak Comet',6,120,{t:'adjAny',n:8},{body:'star',c1:'#fef08a',c2:'#ea580c',eyes:'big',mouth:'grin',hat:'none',extra:'sparkle'},'Earned by logging in 7 days in a row.'),
  c('pz03','pz','Collector\'s Crown',6,130,{t:'rare',n:12},{body:'square',c1:'#fde68a',c2:'#a16207',eyes:'sleepy',mouth:'smile',hat:'crown',extra:'sparkle'},'Earned by collecting 40 different cToons.'),
  c('pz04','pz','Trade Titan',6,125,{t:'series',n:8},{body:'robot',c1:'#c7d2fe',c2:'#312e81',eyes:'angry',mouth:'grin',hat:'tophat',extra:'badge'},'Earned by completing 10 trades.'),
  c('pz05','pz','Battle Badge',6,135,{t:'opp',n:18},{body:'shield',c1:'#f87171',c2:'#7f1d1d',eyes:'angry',mouth:'grin',hat:'none',extra:'star'},'Earned by winning 25 gToons matches.'),
  c('pz06','pz','Champion\'s Star',6,170,{t:'allyAll',n:12},{body:'star',c1:'#ffffff',c2:'#f59e0b',eyes:'happy',mouth:'grin',hat:'crown',extra:'sparkle'},'Earned by defeating the Orbit Master.'),
];

export const BY_ID = Object.fromEntries(CTOONS.map(t => [t.id, t]));
export const PACKABLE = CTOONS.filter(t => t.series !== 'pz');

export const PACKS = [
  { id: 'std',  name: 'Standard cPack', price: 300, size: 3, desc: '3 random cToons. Uncommon or better guaranteed.',
    odds: [0.55, 0.27, 0.12, 0.045, 0.013, 0.002], minRarity: 1 },
  { id: 'prem', name: 'Premium cPack',  price: 900, size: 3, desc: '3 cToons. Rare or better guaranteed. Better odds all round.',
    odds: [0.20, 0.30, 0.30, 0.14, 0.05, 0.01],  minRarity: 2 },
  { id: 'mega', name: 'Mega cPack',     price: 2000, size: 5, desc: '5 cToons. One Very Rare or better guaranteed.',
    odds: [0.30, 0.30, 0.22, 0.12, 0.05, 0.01],  minRarity: 3 },
];

export const BACKGROUNDS = [
  { id: 'space',   name: 'Deep Space',      cost: 0,    css: 'radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0b1020 55%, #000 100%)' },
  { id: 'woods',   name: 'Grumble Woods',   cost: 400,  css: 'linear-gradient(180deg, #14532d 0%, #052e16 70%, #1a2e05 100%)' },
  { id: 'diner',   name: 'Robo Diner',      cost: 400,  css: 'repeating-linear-gradient(45deg, #7c2d12 0 24px, #9a3412 24px 48px)' },
  { id: 'street',  name: 'Spooky Street',   cost: 400,  css: 'linear-gradient(180deg, #2e1065 0%, #4c1d95 60%, #1e1b4b 100%)' },
  { id: 'bakery',  name: 'Muffin Bakery',   cost: 400,  css: 'repeating-linear-gradient(90deg, #9d174d 0 30px, #be185d 30px 60px)' },
  { id: 'desert',  name: 'Big Desert',      cost: 400,  css: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)' },
  { id: 'disco',   name: 'Orbit Disco',     cost: 1500, css: 'conic-gradient(from 0deg, #f472b6, #facc15, #4ade80, #38bdf8, #c084fc, #f472b6)' },
];

export const OPPONENTS = [
  { id: 'rex',    name: 'Rookie Rex',       diff: 0.35, minR: 0, maxR: 0, reward: 120, taunt: 'I just got my first cPack yesterday!' },
  { id: 'betty',  name: 'Binder Betty',     diff: 0.55, minR: 0, maxR: 1, reward: 180, taunt: 'I have every Common. Every. Single. One.' },
  { id: 'tom',    name: 'Tycoon Tom',       diff: 0.7,  minR: 1, maxR: 2, reward: 240, taunt: 'I could buy your whole binder. Twice.' },
  { id: 'vendor', name: 'The Vendor',       diff: 0.85, minR: 2, maxR: 3, reward: 320, taunt: 'You have been buying my packs. Now face my deck.' },
  { id: 'master', name: 'Orbit Master',     diff: 1.0,  minR: 3, maxR: 5, reward: 500, taunt: 'Nobody has beaten me. Nobody will.' },
];

export const TRADERS = [
  { id: 'gus',  name: 'Swap-Meet Gus',    line: 'Everything must go. Especially the weird ones.' },
  { id: 'vera', name: 'Very Rare Vera',   line: 'I only deal in quality. Show me something shiny.' },
  { id: 'kip',  name: 'Kip the Kid',      line: 'Trade ya! Trade ya! Trade ya!' },
];

export const QUESTS = [
  { id: 'win1',  text: 'Win a gToons match',              goal: 1, stat: 'winsToday',   reward: 150 },
  { id: 'play2', text: 'Play 2 gToons matches',           goal: 2, stat: 'playsToday',  reward: 120 },
  { id: 'pack1', text: 'Open a cPack',                    goal: 1, stat: 'packsToday',  reward: 100 },
  { id: 'zone3', text: 'Place 3 cToons in your cZone',    goal: 3, stat: 'placedToday', reward: 100 },
  { id: 'trade1',text: 'Make a trade at the Trading Post',goal: 1, stat: 'tradesToday', reward: 150 },
  { id: 'rec1',  text: 'Recycle a duplicate cToon',       goal: 1, stat: 'recycToday',  reward: 80 },
];

// Promo "Orbit Codes" (like the codes printed on cereal boxes back in the day).
export const PROMO_CODES = {
  'ORBIT2000':   { points: 500,  text: '500 points. Welcome to the Orbit!' },
  'GTOONS':      { pack: 'std',  text: 'A free Standard cPack!' },
  'ROCKETRASCAL':{ ctoon: 'rr07', text: 'Starla Zoom joins your binder!' },
  'SPOOKY':      { ctoon: 'ss05', text: 'Rattles joins your binder!' },
  'MUFFINTIME':  { ctoon: 'mm07', text: 'Dr. Donut joins your binder!' },
};

export function abilityText(ab, series) {
  const s = SERIES[series]?.name || 'same-series';
  switch (ab.t) {
    case 'none':    return 'No special ability.';
    case 'adjSame': return `+${ab.n} for each adjacent ${s} cToon.`;
    case 'adjAny':  return `+${ab.n} for each adjacent cToon.`;
    case 'top':     return `+${ab.n} when placed in the top row.`;
    case 'bottom':  return `+${ab.n} when placed in the bottom row.`;
    case 'corner':  return `+${ab.n} when placed in a corner slot.`;
    case 'center':  return `+${ab.n} when placed in the middle column.`;
    case 'opp':     return `-${ab.n} to the rival cToon directly across.`;
    case 'oppHalf': return `Halves the base points of the rival cToon across.`;
    case 'oppRow':  return `-${ab.n} to every rival cToon in the same row.`;
    case 'series':  return `+${ab.n} for each other ${s} cToon on your side.`;
    case 'rare':    return `+${ab.n} for each other Rare-or-better cToon on your side.`;
    case 'ally':    return `+${ab.n} to each other ${s} cToon on your side.`;
    case 'allyAll': return `+${ab.n} to every other cToon on your side.`;
    case 'last':    return `+${ab.n} if this is the last cToon you place.`;
    case 'first':   return `+${ab.n} if this is the first cToon you place.`;
    case 'lonely':  return `+${ab.n} if no cToons are adjacent to it.`;
    case 'mirror':  return `Gains the base points of the rival cToon across.`;
    case 'steal':   return `Takes ${ab.n} points from the rival cToon across.`;
  }
  return '';
}

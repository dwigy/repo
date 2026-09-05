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

// gToon colour groups (the ring around a gToon and its point bubble).
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
  rr: { name: 'Rocket Rascals',    color: '#38bdf8', bg: ['#0b2a4a', '#1d5f9c'], blurb: 'Six kids, one leaky rocket, zero adult supervision.' },
  gw: { name: 'Grumble Woods',     color: '#4ade80', bg: ['#0f3a22', '#2f8a3e'], blurb: 'The forest where every monster is mostly harmless.' },
  rd: { name: 'Robo Diner',        color: '#fb923c', bg: ['#4a2508', '#b5651d'], blurb: 'Open 24 hours. Staffed entirely by malfunctioning robots.' },
  ss: { name: 'Spooky Street',     color: '#c084fc', bg: ['#2e1052', '#6b2fb0'], blurb: 'The friendliest haunted block in town.' },
  mm: { name: 'Mega Muffin Squad', color: '#f472b6', bg: ['#4a0f2e', '#c2367a'], blurb: 'Baked goods with super powers and short tempers.' },
  cc: { name: 'Captain Cactus',    color: '#facc15', bg: ['#6b4a05', '#e0a020'], blurb: 'One prickly hero. One very big desert.' },
  pz: { name: 'Orbit Prizes',      color: '#ffffff', bg: ['#1f1f3a', '#4a4a8a'], blurb: 'Exclusive cToons you can only earn, never buy.' },
};

// c(id, series, name, rarity, collection value, gToon colour, gToon points, power, art, blurb)
function c(id, series, name, r, value, color, pts, power, art, blurb) {
  return { id, series, name, rarity: r, points: value, color, pts, power, art, blurb };
}

export const CTOONS = [
  // ---------- Rocket Rascals ----------
  c('rr01','rr','Zip Nova',0,25,'blu',4,{t:'x2',id:'rr02'},{body:'round',c1:'#7dd3fc',c2:'#0369a1',eyes:'big',mouth:'grin',hat:'helmet',extra:'none'},'Never met a launch button she did not push.'),
  c('rr02','rr','Cosmo Pip',0,25,'blu',2,{t:'perOwnColor',color:'blu',n:2},{body:'round',c1:'#bae6fd',c2:'#0284c7',eyes:'dot',mouth:'smile',hat:'antenna',extra:'blush'},'The smallest rascal. Fits in the glove box.'),
  c('rr03','rr','Luna Beep',0,30,'slv',5,{t:'none'},{body:'square',c1:'#a5b4fc',c2:'#3730a3',eyes:'happy',mouth:'open',hat:'helmet',extra:'star'},'Communicates only in beeps. Everyone understands her perfectly.'),
  c('rr04','rr','Comet Kid',1,60,'red',6,{t:'first',n:4},{body:'tall',c1:'#60a5fa',c2:'#1e3a8a',eyes:'angry',mouth:'grin',hat:'cap',extra:'cape'},'Fast. Loud. Frequently on fire.'),
  c('rr05','rr','Astro Tuffy',1,70,'blu',7,{t:'opp',n:3},{body:'square',c1:'#93c5fd',c2:'#1d4ed8',eyes:'angry',mouth:'flat',hat:'helmet',extra:'scar'},'Has arm-wrestled a black hole. Lost, but still.'),
  c('rr06','rr','Orbit Otto',2,120,'blu',8,{t:'perOwnColor',color:'blu',n:2},{body:'round',c1:'#0ea5e9',c2:'#082f49',eyes:'sleepy',mouth:'smile',hat:'antenna',extra:'glasses'},'The navigator. Has never once known where they are.'),
  c('rr07','rr','Starla Zoom',2,130,'yel',9,{t:'front',n:5},{body:'star',c1:'#fde68a',c2:'#f59e0b',eyes:'big',mouth:'grin',hat:'none',extra:'none'},'Literally a star. Do not touch. Very hot.'),
  c('rr08','rr','Captain Quasar',3,250,'blu',10,{t:'plusOwnColor',color:'blu',n:2},{body:'tall',c1:'#3b82f6',c2:'#172554',eyes:'angry',mouth:'grin',hat:'helmet',extra:'badge'},'The leader. Elected because he had the biggest hat.'),
  c('rr09','rr','Nebula Nan',4,500,'prp',12,{t:'minusOppColor',color:'yel',n:3},{body:'blob',c1:'#a78bfa',c2:'#4c1d95',eyes:'three',mouth:'wavy',hat:'none',extra:'sparkle'},'A cloud of gas the size of a galaxy. Bakes cookies.'),
  c('rr10','rr','Big Bang Baby',5,1000,'org',15,{t:'plusAll',n:2},{body:'round',c1:'#fbbf24',c2:'#b45309',eyes:'big',mouth:'open',hat:'crown',extra:'sparkle'},'Started the universe by accident. Was not grounded for it.'),

  // ---------- Grumble Woods ----------
  c('gw01','gw','Mossy',0,25,'grn',3,{t:'lonely',n:4},{body:'blob',c1:'#86efac',c2:'#166534',eyes:'sleepy',mouth:'smile',hat:'leaves',extra:'none'},'Moves one inch per day. Considers this rushing.'),
  c('gw02','gw','Twiggle',0,25,'grn',4,{t:'x2',id:'gw01'},{body:'tall',c1:'#bef264',c2:'#3f6212',eyes:'dot',mouth:'grin',hat:'leaves',extra:'none'},'Part stick, part bug, all trouble.'),
  c('gw03','gw','Bramble Bob',0,30,'grn',5,{t:'none'},{body:'round',c1:'#4ade80',c2:'#14532d',eyes:'angry',mouth:'flat',hat:'none',extra:'spikes'},'Do not hug. He would like a hug, but do not.'),
  c('gw04','gw','Fernando Fuzz',1,60,'grn',6,{t:'perOwnColor',color:'grn',n:2},{body:'blob',c1:'#22c55e',c2:'#052e16',eyes:'big',mouth:'open',hat:'none',extra:'fuzz'},'Ninety percent fur. Ten percent enthusiasm.'),
  c('gw05','gw','Old Stumpy',1,70,'org',7,{t:'back',n:4},{body:'square',c1:'#a16207',c2:'#422006',eyes:'sleepy',mouth:'flat',hat:'mushroom',extra:'none'},'Has been here longer than the forest. Will not explain.'),
  c('gw06','gw','Snoot the Newt',2,120,'org',7,{t:'steal',n:3},{body:'tall',c1:'#fb923c',c2:'#7c2d12',eyes:'happy',mouth:'tongue',hat:'none',extra:'spots'},'Steals snacks. Steals hearts. Mostly snacks.'),
  c('gw07','gw','Mushroom Marge',2,130,'red',8,{t:'plusOwnColor',color:'grn',n:2},{body:'round',c1:'#fecaca',c2:'#991b1b',eyes:'happy',mouth:'smile',hat:'mushroom',extra:'spots'},'Runs the forest bakery. Everything tastes of dirt. Delicious dirt.'),
  c('gw08','gw','Grumble King',3,250,'grn',11,{t:'minusOppColor',color:'grn',n:3},{body:'blob',c1:'#166534',c2:'#022c22',eyes:'angry',mouth:'fang',hat:'crown',extra:'none'},'Rules the woods with an iron grumble.'),
  c('gw09','gw','Great Owlbert',4,500,'slv',12,{t:'perOppColor',color:'grn',n:3},{body:'owl',c1:'#d6d3d1',c2:'#44403c',eyes:'big',mouth:'beak',hat:'none',extra:'monocle'},'Knows everything. Charges by the hour.'),
  c('gw10','gw','Root Mother',5,1000,'grn',14,{t:'plusOwnColor',color:'grn',n:3},{body:'tall',c1:'#65a30d',c2:'#1a2e05',eyes:'sleepy',mouth:'smile',hat:'leaves',extra:'sparkle'},'Every tree in Grumble Woods is technically her kid.'),

  // ---------- Robo Diner ----------
  c('rd01','rd','Toaster Ted',0,25,'org',3,{t:'back',n:2},{body:'robot',c1:'#fdba74',c2:'#7c2d12',eyes:'dot',mouth:'flat',hat:'antenna',extra:'none'},'Two slots. No patience.'),
  c('rd02','rd','Flip-Bot',0,25,'org',4,{t:'none'},{body:'robot',c1:'#fed7aa',c2:'#9a3412',eyes:'happy',mouth:'grin',hat:'chef',extra:'none'},'Flips burgers, pancakes, and occasionally customers.'),
  c('rd03','rd','Sprinkles',0,30,'red',2,{t:'x2',id:'rd02'},{body:'round',c1:'#fda4af',c2:'#be123c',eyes:'big',mouth:'smile',hat:'none',extra:'sprinkles'},'Dispenses sprinkles. Has never been asked to.'),
  c('rd04','rd','Waffle Wally',1,60,'yel',6,{t:'front',n:3},{body:'square',c1:'#f59e0b',c2:'#78350f',eyes:'sleepy',mouth:'open',hat:'none',extra:'grid'},'Square. Deeply, structurally square.'),
  c('rd05','rd','Fry-o-Matic',1,70,'org',7,{t:'opp',n:4},{body:'robot',c1:'#f97316',c2:'#431407',eyes:'angry',mouth:'fang',hat:'antenna',extra:'none'},'Runs hot. Do not mention the grease fire.'),
  c('rd06','rd','Chef Circuit',2,120,'slv',8,{t:'plusOwnColor',color:'org',n:2},{body:'robot',c1:'#e5e7eb',c2:'#374151',eyes:'angry',mouth:'flat',hat:'chef',extra:'mustache'},'Michelin-rated. Also rated for indoor use only.'),
  c('rd07','rd','Milkshake Mike',2,130,'prp',7,{t:'mirror'},{body:'tall',c1:'#f5d0fe',c2:'#a21caf',eyes:'happy',mouth:'grin',hat:'cherry',extra:'none'},'Shakes so hard the diner moves.'),
  c('rd08','rd','Deep Fryer Dave',3,250,'org',10,{t:'perOppColor',color:'blu',n:3},{body:'square',c1:'#eab308',c2:'#713f12',eyes:'angry',mouth:'grin',hat:'none',extra:'bubbles'},'Will fry anything. Has fried everything.'),
  c('rd09','rd','The Manager',4,500,'slv',12,{t:'plusAll',n:1},{body:'robot',c1:'#94a3b8',c2:'#0f172a',eyes:'dot',mouth:'flat',hat:'tophat',extra:'badge'},'Would like to see YOU in the office.'),
  c('rd10','rd','Golden Spatula',5,1000,'yel',14,{t:'last',n:10},{body:'spatula',c1:'#fde047',c2:'#a16207',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'The most powerful utensil in the known universe.'),

  // ---------- Spooky Street ----------
  c('ss01','ss','Boo-Boo',0,25,'prp',3,{t:'lonely',n:3},{body:'ghost',c1:'#f5f3ff',c2:'#6d28d9',eyes:'big',mouth:'open',hat:'none',extra:'blush'},'Tries to scare people. Apologizes immediately.'),
  c('ss02','ss','Wisp',0,25,'prp',2,{t:'perOwnColor',color:'prp',n:2},{body:'ghost',c1:'#ddd6fe',c2:'#5b21b6',eyes:'dot',mouth:'smile',hat:'none',extra:'sparkle'},'Mostly a suggestion of a ghost.'),
  c('ss03','ss','Chilly Chad',0,30,'blu',5,{t:'front',n:2},{body:'ghost',c1:'#a5f3fc',c2:'#155e75',eyes:'sleepy',mouth:'wavy',hat:'cap',extra:'none'},'Always cold. Always says so.'),
  c('ss04','ss','Madame Moth',1,60,'prp',6,{t:'back',n:4},{body:'moth',c1:'#e9d5ff',c2:'#7e22ce',eyes:'big',mouth:'smile',hat:'none',extra:'none'},'Runs toward every light. Has never found the right one.'),
  c('ss05','ss','Rattles',1,70,'slv',6,{t:'x2',id:'ss01'},{body:'skull',c1:'#fafaf9',c2:'#3f3f46',eyes:'x',mouth:'grin',hat:'none',extra:'none'},'A very upbeat skeleton. Loves maracas.'),
  c('ss06','ss','Count Snackula',2,120,'red',8,{t:'steal',n:4},{body:'tall',c1:'#c4b5fd',c2:'#2e1065',eyes:'angry',mouth:'fang',hat:'none',extra:'cape'},'Only bites cookies. Only at midnight.'),
  c('ss07','ss','Sheet Face',2,130,'slv',6,{t:'mirror'},{body:'ghost',c1:'#ffffff',c2:'#7c3aed',eyes:'x',mouth:'open',hat:'none',extra:'none'},'Copies everyone. Is very good at it.'),
  c('ss08','ss','Mayor Gloom',3,250,'prp',10,{t:'minusOppColor',color:'red',n:3},{body:'square',c1:'#6b7280',c2:'#111827',eyes:'sleepy',mouth:'flat',hat:'tophat',extra:'mustache'},'Elected on a platform of more fog.'),
  c('ss09','ss','Midnight Cat',4,500,'prp',11,{t:'lonely',n:8},{body:'cat',c1:'#1e1b4b',c2:'#facc15',eyes:'happy',mouth:'smile',hat:'none',extra:'none'},'Crosses your path on purpose. Personally.'),
  c('ss10','ss','Lady Lantern',5,1000,'yel',14,{t:'plusOwnColor',color:'prp',n:3},{body:'lantern',c1:'#fde68a',c2:'#b45309',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Lights every street on Spooky Street. Asks nothing in return.'),

  // ---------- Mega Muffin Squad ----------
  c('mm01','mm','Blueberry Bill',0,25,'blu',4,{t:'perOwnColor',color:'red',n:1},{body:'muffin',c1:'#c7d2fe',c2:'#4338ca',eyes:'happy',mouth:'smile',hat:'none',extra:'spots'},'Full of berries. Full of feelings.'),
  c('mm02','mm','Crumbs',0,25,'yel',2,{t:'x2',id:'mm03'},{body:'round',c1:'#fde68a',c2:'#92400e',eyes:'dot',mouth:'smile',hat:'none',extra:'none'},'What is left after the squad has a meeting.'),
  c('mm03','mm','Choco Chip Chuck',0,30,'red',5,{t:'none'},{body:'muffin',c1:'#d6b48a',c2:'#3f2314',eyes:'angry',mouth:'grin',hat:'none',extra:'spots'},'The muscle. Also the chips.'),
  c('mm04','mm','Bran Flakes',1,60,'org',6,{t:'back',n:3},{body:'square',c1:'#d4a373',c2:'#6b3f1d',eyes:'sleepy',mouth:'flat',hat:'none',extra:'glasses'},'Good for you. Knows it. Mentions it.'),
  c('mm05','mm','Sprinkle Sue',1,70,'red',6,{t:'perOwnColor',color:'red',n:2},{body:'muffin',c1:'#fbcfe8',c2:'#be185d',eyes:'big',mouth:'grin',hat:'bow',extra:'sprinkles'},'Sparkle level: unsafe.'),
  c('mm06','mm','Captain Cupcake',2,120,'red',9,{t:'plusOwnColor',color:'red',n:2},{body:'muffin',c1:'#f9a8d4',c2:'#9d174d',eyes:'angry',mouth:'grin',hat:'cherry',extra:'cape'},'Leads the squad. Frosting-first into danger.'),
  c('mm07','mm','Dr. Donut',2,130,'prp',8,{t:'front',n:4},{body:'donut',c1:'#fda4af',c2:'#881337',eyes:'happy',mouth:'smile',hat:'none',extra:'sprinkles'},'Has a hole where his heart should be. Is fine with it.'),
  c('mm08','mm','Frosting Fury',3,250,'red',10,{t:'opp',n:6},{body:'round',c1:'#fecdd3',c2:'#e11d48',eyes:'angry',mouth:'fang',hat:'none',extra:'swirl'},'Do not ask about the sprinkles incident.'),
  c('mm09','mm','The Baker',4,500,'slv',12,{t:'perOppColor',color:'red',n:3},{body:'tall',c1:'#fef3c7',c2:'#78350f',eyes:'sleepy',mouth:'smile',hat:'chef',extra:'mustache'},'Made the whole squad. Regrets a few of them.'),
  c('mm10','mm','Mega Muffin Prime',5,1000,'red',15,{t:'perOwnColor',color:'red',n:3},{body:'muffin',c1:'#fbbf24',c2:'#7c2d12',eyes:'big',mouth:'grin',hat:'crown',extra:'sparkle'},'The final form. Blueberry, chocolate AND bran.'),

  // ---------- Captain Cactus ----------
  c('cc01','cc','Prickles',0,25,'grn',4,{t:'opp',n:2},{body:'cactus',c1:'#86efac',c2:'#166534',eyes:'big',mouth:'smile',hat:'none',extra:'spikes'},'Tiny. Pointy. Adorable at a distance.'),
  c('cc02','cc','Sandy',0,25,'yel',3,{t:'lonely',n:3},{body:'blob',c1:'#fde68a',c2:'#a16207',eyes:'dot',mouth:'smile',hat:'none',extra:'none'},'A living pile of sand. Gets everywhere.'),
  c('cc03','cc','Tumbleweed Tim',0,30,'yel',3,{t:'x2',id:'cc02'},{body:'tumble',c1:'#d4a373',c2:'#78350f',eyes:'sleepy',mouth:'flat',hat:'none',extra:'none'},'Goes wherever the wind says. The wind says a lot.'),
  c('cc04','cc','Rattlesnake Ray',1,60,'grn',6,{t:'steal',n:2},{body:'snake',c1:'#a3e635',c2:'#365314',eyes:'angry',mouth:'tongue',hat:'cowboy',extra:'none'},'Shakes before he bites. It is only polite.'),
  c('cc05','cc','Dusty the Mule',1,70,'slv',7,{t:'perOwnColor',color:'yel',n:2},{body:'tall',c1:'#a8a29e',c2:'#44403c',eyes:'sleepy',mouth:'flat',hat:'none',extra:'ears'},'Carries everything. Complains about all of it.'),
  c('cc06','cc','Captain Cactus',2,130,'grn',9,{t:'plusOwnColor',color:'yel',n:2},{body:'cactus',c1:'#22c55e',c2:'#14532d',eyes:'angry',mouth:'grin',hat:'cowboy',extra:'badge'},'The hero of the desert. Needs water. Never says so.'),
  c('cc07','cc','Sheriff Scorch',2,120,'org',8,{t:'minusOppColor',color:'blu',n:2},{body:'square',c1:'#f97316',c2:'#7c2d12',eyes:'angry',mouth:'flat',hat:'cowboy',extra:'mustache'},'Keeps the peace. Keeps it very hot.'),
  c('cc08','cc','Mirage Mae',3,250,'yel',9,{t:'mirror'},{body:'ghost',c1:'#fef9c3',c2:'#ca8a04',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Might not be real. Definitely charming.'),
  c('cc09','cc','The Sun Baron',4,500,'yel',13,{t:'back',n:6},{body:'sun',c1:'#fbbf24',c2:'#dc2626',eyes:'angry',mouth:'grin',hat:'none',extra:'none'},'Owns the sun. Rents it out by the afternoon.'),
  c('cc10','cc','The Lost Oasis',5,1000,'blu',14,{t:'plusOwnColor',color:'yel',n:3},{body:'oasis',c1:'#67e8f9',c2:'#0e7490',eyes:'happy',mouth:'smile',hat:'none',extra:'sparkle'},'Everybody is looking for it. It is also looking for you.'),

  // ---------- Orbit Prizes (earn only) ----------
  c('pz01','pz','Orbit Rookie',6,200,'slv',7,{t:'first',n:5},{body:'round',c1:'#e0e7ff',c2:'#4f46e5',eyes:'happy',mouth:'grin',hat:'helmet',extra:'star'},'Awarded to every new Orbiter. Welcome aboard!'),
  c('pz02','pz','Streak Comet',6,750,'org',11,{t:'front',n:5},{body:'star',c1:'#fef08a',c2:'#ea580c',eyes:'big',mouth:'grin',hat:'none',extra:'sparkle'},'Earned by logging in 7 days in a row.'),
  c('pz03','pz','Collector\'s Crown',6,750,'yel',11,{t:'perOwnColor',color:'slv',n:3},{body:'square',c1:'#fde68a',c2:'#a16207',eyes:'sleepy',mouth:'smile',hat:'crown',extra:'sparkle'},'Earned by collecting 40 different cToons.'),
  c('pz04','pz','Trade Titan',6,750,'slv',12,{t:'plusOwnColor',color:'slv',n:2},{body:'robot',c1:'#c7d2fe',c2:'#312e81',eyes:'angry',mouth:'grin',hat:'tophat',extra:'badge'},'Earned by completing 10 trades.'),
  c('pz05','pz','Battle Badge',6,750,'red',12,{t:'opp',n:7},{body:'shield',c1:'#f87171',c2:'#7f1d1d',eyes:'angry',mouth:'grin',hat:'none',extra:'star'},'Earned by winning 25 gToons matches.'),
  c('pz06','pz','Champion\'s Star',6,2000,'slv',16,{t:'plusAll',n:2},{body:'star',c1:'#ffffff',c2:'#f59e0b',eyes:'happy',mouth:'grin',hat:'crown',extra:'sparkle'},'Earned by defeating the Orbit Master.'),
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
  { id: 'orbit',   name: 'Orbit Blue',      cost: 0,    css: 'radial-gradient(circle at 50% 30%, #4d8fd6 0%, #1f5fb0 45%, #0f3a7a 100%)' },
  { id: 'space',   name: 'Deep Space',      cost: 300,  css: 'radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0b1020 55%, #000 100%)' },
  { id: 'woods',   name: 'Grumble Woods',   cost: 400,  css: 'linear-gradient(180deg, #14532d 0%, #052e16 70%, #1a2e05 100%)' },
  { id: 'diner',   name: 'Robo Diner',      cost: 400,  css: 'repeating-linear-gradient(45deg, #7c2d12 0 24px, #9a3412 24px 48px)' },
  { id: 'street',  name: 'Spooky Street',   cost: 400,  css: 'linear-gradient(180deg, #2e1065 0%, #4c1d95 60%, #1e1b4b 100%)' },
  { id: 'bakery',  name: 'Muffin Bakery',   cost: 400,  css: 'repeating-linear-gradient(90deg, #9d174d 0 30px, #be185d 30px 60px)' },
  { id: 'desert',  name: 'Big Desert',      cost: 400,  css: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)' },
  { id: 'disco',   name: 'Orbit Disco',     cost: 1500, css: 'conic-gradient(from 0deg, #f472b6, #facc15, #4ade80, #38bdf8, #c084fc, #f472b6)' },
];

export const OPPONENTS = [
  { id: 'rex',    name: 'Rookie Rex',       diff: 0.35, minR: 0, maxR: 0, reward: 120, avatar: 'rr02', taunt: 'I just got my first cPack yesterday!' },
  { id: 'betty',  name: 'Binder Betty',     diff: 0.55, minR: 0, maxR: 1, reward: 180, avatar: 'mm05', taunt: 'I have every Common. Every. Single. One.' },
  { id: 'tom',    name: 'Tycoon Tom',       diff: 0.7,  minR: 1, maxR: 2, reward: 240, avatar: 'rd06', taunt: 'I could buy your whole binder. Twice.' },
  { id: 'vendor', name: 'The Vendor',       diff: 0.85, minR: 2, maxR: 3, reward: 320, avatar: 'rd09', taunt: 'You have been buying my packs. Now face my deck.' },
  { id: 'master', name: 'Orbit Master',     diff: 1.0,  minR: 3, maxR: 5, reward: 500, avatar: 'ss08', taunt: 'Nobody has beaten me. Nobody will.' },
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
  { id: 'trade1',text: 'Make a trade at the Auction',     goal: 1, stat: 'tradesToday', reward: 150 },
  { id: 'rec1',  text: 'Recycle a duplicate cToon',       goal: 1, stat: 'recycToday',  reward: 80 },
];

// Visitable NPC cZones (names + theme). Contents are generated daily.
export const NPC_ZONES = [
  { id: 'campers',  owner: 'Crazy Campers',   bg: 'woods',  award: 'Muddiest cZone' },
  { id: 'book',     owner: 'Book Club',       bg: 'orbit',  award: null },
  { id: 'agents',   owner: 'Secret Agents',   bg: 'space',  award: 'Sneakiest cZone' },
  { id: 'sports',   owner: 'Extreme Sports',  bg: 'desert', award: null },
  { id: 'candy',    owner: 'Candy Lovers',    bg: 'bakery', award: 'Sweetest cZone' },
  { id: 'rockers',  owner: 'Rockers',         bg: 'disco',  award: 'Loudest cZone' },
  { id: 'muscle',   owner: 'Muscle Men',      bg: 'diner',  award: null },
  { id: 'bugs',     owner: 'Bug Club',        bg: 'woods',  award: null },
  { id: 'spooks',   owner: 'Night Shift',     bg: 'street', award: 'Creepiest cZone' },
  { id: 'farm',     owner: "Farmin' Folks",   bg: 'desert', award: null },
];

// Promo "Orbit Codes" (like the codes printed on cereal boxes back in the day).
export const PROMO_CODES = {
  'ORBIT2000':   { points: 500,  text: '500 points. Welcome to the Orbit!' },
  'GTOONS':      { pack: 'std',  text: 'A free Standard cPack!' },
  'ROCKETRASCAL':{ ctoon: 'rr07', text: 'Starla Zoom joins your binder!' },
  'SPOOKY':      { ctoon: 'ss05', text: 'Rattles joins your binder!' },
  'MUFFINTIME':  { ctoon: 'mm07', text: 'Dr. Donut joins your binder!' },
};
// The rotating "featured code" shown on the front page; each is worth 150 points once.
export const FEATURED_CODES = ['TURKEY', 'PANCAKE', 'MOONBOOTS', 'WAFFLES', 'SPATULA', 'ORBITAL', 'GRUMBLE', 'BOOBOO', 'CACTUS', 'ROCKET', 'MUFFIN', 'GHOSTLY', 'DINER', 'COMET'];

export function powerText(p) {
  const cn = (c) => COLORS[c]?.name || c;
  switch (p.t) {
    case 'none':          return 'NO POWER';
    case 'x2':            return `x2 to ${BY_ID[p.id]?.name || '?'}`;
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

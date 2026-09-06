// Version log and roadmap shown on the Home page and under Profile.
// Newest first. Keep entries short: a title card, then a few lines.
export const APP_VERSION = '0.9.0';

export const NEWS = [
  { v: '0.9.0', date: '2026-09-06', title: 'Motion',
    items: [
      'Screens crossfade and rise when you change tabs; the header and bottom bar stay put.',
      'Sheets rise over a darkening backdrop and settle back on close. Cards, tiles and chips stage in when a screen opens.',
      'Every surface answers a press. The coin counter bumps when coins arrive. Results and scouting reports stage in.',
      'Light and dark crossfade. Everything switches off under the system reduced-motion setting.',
      'Six collection tabs fit on a phone and keep the active one in view.',
    ] },
  { v: '0.8.0', date: '2026-09-06', title: 'Placeholder rebrand and the campaign',
    items: [
      'All names are placeholders now: [GAME], chips, stacks, coins, regions. Chip art is a stand-in sigil per character until the new library lands.',
      'A cover page with tap to start, a new placeholder logo and app icon, and a dark mode (Profile > Settings > Theme).',
      'Five tabs: Home, Collection, Campaign in the centre, Online (coming soon) and Profile.',
      'The campaign has three save slots, a spoken intro, five starter stacks with a leader chip (+6 when played first), seven regions with Train, Shop, three players, a gatekeeper and places to explore, then the three heroes and 100% completion.',
      'Gatekeepers grant a badge for your profile and a 1/1 chip. Completion grants another of each.',
      'The old zone page is now your portfolio: background, favourite chips, badges and a link to your stack.',
    ] },
  { v: '0.7.0', date: '2026-09-06', title: 'The Orbit Tour',
    items: [
      'A seven-zone campaign that leaves Orbit Station and comes back to it. Two challenges, a sparring partner and a Keeper in every zone.',
      'House rules bend each match: no swaps, no powers, a hand of three, double sets, open hands, secret powers awake.',
      'Eleven new stars: Bobby Bumps, Colonel Heeza Liar, Julius the Cat, Pete, Clarabelle, Horace, Minnie (1928), Mutt, Jeff, Happy Hooligan and Buster Brown.',
      'Eight new powers: Encore, Twins, Chorus Line, Crown, Underdog, Brick, Shield and Veto.',
      'Secret powers on Mythic and Legendary chips wake up after three wins on the board.',
      "Seven 1/1 chip chips you can only win on the Tour.",
    ] },
  { v: '0.6.0', date: '2026-09-06', title: 'A new front door',
    items: [
      'Five tabs: Home, Collection, Battle, Market, Profile. The old top tabs are gone.',
      'Home is a poster of this week\'s featured series, your daily ritual, the main menu and this news card.',
      'Collection gathers your binder, a new Sets page and your portfolio in one place.',
      'Battle opens on your next challenger with one big PLAY button and the full ladder below.',
      'Profile holds your stats, awards, log and every setting, backup and install step.',
    ] },
  { v: '0.5.0', date: '2026-09-06', title: 'Hold the chip',
    items: [
      'Tilt any chip with your finger on its details page and flip it to see its mint number and where it came from.',
      'A sound kit for ripping, flipping, landing and scoring, with matching visual pulses.',
      'Battles end with a socket-by-socket tally, character quips and a result poster.',
      'Completing all eight editions of a character shows a set poster.',
    ] },
  { v: '0.4.0', date: '2026-09-06', title: 'Five tiers and the rip',
    items: [
      'Common, Uncommon, Rare, Mythic and Legendary chips with published pack odds.',
      'Silver, Gold, Platinum and Dark Matter editions for the top tiers.',
      'Packs are ripped open by hand and reveal least rare to most rare.',
      'The clean white spaceship look, so the chips carry the colour.',
    ] },
  { v: '0.3.0', date: '2026-09-05', title: 'Real stars, real artwork',
    items: [
      'A cast of fifteen public-domain cartoon stars, from Felix to Little Nemo.',
      'Real artwork loads from Wikimedia Commons, and you can use your own image on any chip.',
      'Glossy chips, chip flights and landings on the Game Zone board, BATTLE at the centre of the bar.',
    ] },
  { v: '0.2.0', date: '2026-09-05', title: 'Back to 2003',
    items: ['The original Orbit layout: folder tabs, sunburst sockets, the seven-socket chips board and portfolio badges.'] },
  { v: '0.1.0', date: '2026-09-05', title: 'Launch',
    items: ['chips, chips and portfolio, installable on iPhone from Safari, with automatic saving.'] },
];

export const ROADMAP = [
  { k: 'next', title: 'Rarity tell on the card back', note: 'The face-down chip hints its tier before the flip.' },
  { k: 'next', title: 'Pick inside Premium and Mega packs', note: 'Three chips fan out; you keep one.' },
  { k: 'soon', title: 'Share card for Mythic and Legendary pulls', note: 'One tap makes a poster to send to a friend.' },
  { k: 'soon', title: 'portfolio reactions', note: 'Tap a displayed chip for a bounce and a quip.' },
  { k: 'idea', title: 'New series', note: 'More public-domain stars and editions.' },
  { k: 'idea', title: 'Music', note: 'A quiet theme for the Home page and the Game Zone.' },
];

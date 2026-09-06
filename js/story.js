// Placeholder lore for the campaign. Every line is a title card: short, present
// tense, no proper nouns. Keys: intro (array), r<N>.arrive, r<N>.npc<a|b|c>.<intro|win|lose>,
// r<N>.gate.<intro|win|lose>, r<N>.place<a|b|c>, heroes.intro, heroes.win, complete.
const R = (n) => ({
  [`r${n}.arrive`]: [`[REGION ${n}]. A new gate, a new keeper, three players in the way.`, `Train for coins. Buy the local pack. Beat the three. Then knock.`],
  [`r${n}.npca.intro`]: `[NPC ${n}-1 intro line. Adds a detail about this region.]`,
  [`r${n}.npca.win`]: `[NPC ${n}-1 loses: a line that points toward the next player.]`,
  [`r${n}.npca.lose`]: `[NPC ${n}-1 wins: a hint about their stack.]`,
  [`r${n}.npcb.intro`]: `[NPC ${n}-2 intro line. Names the house rule they play by.]`,
  [`r${n}.npcb.win`]: `[NPC ${n}-2 loses: something about the gatekeeper.]`,
  [`r${n}.npcb.lose`]: `[NPC ${n}-2 wins: a taunt.]`,
  [`r${n}.npcc.intro`]: `[NPC ${n}-3 intro line. The region's secret, half told.]`,
  [`r${n}.npcc.win`]: `[NPC ${n}-3 loses: the gate is open now.]`,
  [`r${n}.npcc.lose`]: `[NPC ${n}-3 wins: try the shop.]`,
  [`r${n}.gate.intro`]: `[GATEKEEPER ${n} intro. Why they hold this gate.]`,
  [`r${n}.gate.win`]: `[GATEKEEPER ${n} beaten. Hands over the 1/1 and the badge.]`,
  [`r${n}.gate.lose`]: `[GATEKEEPER ${n} wins. Come back stronger.]`,
  [`r${n}.placea`]: [`[Place ${n}-1 lore card one.]`, `[Place ${n}-1 lore card two.]`],
  [`r${n}.placeb`]: [`[Place ${n}-2 lore card.]`],
  [`r${n}.placec`]: [`[Place ${n}-3 lore card.]`],
});
export const LORE = Object.assign({
  intro: [
    'Welcome to [GAME].',
    'Everything here is a chip. Every chip has a colour, a number and a power.',
    'A match is seven chips a side on a board of seven sockets. Highest total wins.',
    'Three of one colour is a set. Sets are worth extra. Powers change the numbers.',
    'You will pick a stack of twelve. One chip leads it. Play the leader first and it is stronger.',
    'Seven regions. Seven gates. Three players guard each gate. Beat them and the gate opens.',
    'Train for coins. Explore for chips. Collect the badges. Then meet the heroes.',
  ],
  'starter.intro': ['Choose your first stack. Twelve chips, one leader.'],
  'heroes.intro': ['Seven badges. The last door opens. Three heroes wait behind it.'],
  'heroes.win': ['The three are beaten. The regions know your name.'],
  'complete': ['Every chip. Every place. Every badge. One hundred percent.', 'A last 1/1 for the binder. A last badge for the profile.'],
}, ...[1, 2, 3, 4, 5, 6, 7].map(R));

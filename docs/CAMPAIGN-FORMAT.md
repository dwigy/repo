# [GAME] Campaign Format v2

The campaign is the centre button of [GAME]. Online sits beside it, greyed, "coming soon". One story across seven regions, climbing. Each region is a town with one Keeper. Seven Keepers hold seven lessons and seven Seals. Seven Seals earn the Hall. The player is a student. A champion is what a student becomes. Along the road, [CORP] is buying. It is never loud. It is convincing.

Every mechanic is judged against "day 30, 10 minutes". A player who cleared the Grove resumes a slot. They practise once, open one pack, meet one player or the Keeper. One Explore door, a stack edit, close. No action exceeds 3 minutes. Nothing expires. Nothing needs a connection.

## 1. Loop and pacing

- **Meeting:** twelve sockets a side, six front and six back. Twenty in the stack, five in hand, twelve placed. 2–3 minutes. Both players bow before and after.
- **Session:** 2–4 Meetings plus one pack, 8–12 minutes.
- **Core loop:** Practice, Shop, Meeting, Explore, stack edit. One tap each.
- **Always available:** Practice (unlimited, always pays). Shop (coins only). Rematch of any beaten player or Keeper at 40% coins. Hard variant at full coins: `handSize:4`, `mult:{opp:2,steal:2,bomb:2}`.
- **Daily (local midnight, all slots):** first 3 Practice wins pay 2×. One "Wanted" rematch pays 2×. Shown as three checks and seven lanterns. A missed day dims one lantern, never wipes.
- **Weekly (Monday, offline):** a seeded Circuit of 3 Meetings, one house rule. Reward: 1 Premium pack of the highest open region.
- **Yearly, the longest night:** Tinker's Night. Lanterns on every page, one free blank, every companion out at once.

## 2. Save slots

Three cards. An empty card reads NEW GAME over a disc silhouette. A filled card shows name, first friend, Seal sockets, region, completion.

- **Per slot:** story, coins, stack, results, belief. **Global:** portfolio, profile Seals, daily state, settings.
- **Whole fragment rule:** minted once per device. A second slot beating that Keeper earns only the Seal and coins.
- **New game:** empty card → name → intro → starter → Hearth. Under 4 minutes.
- **Back:** a chevron top-left on every page, 44 px, never animated.

## 3. Intro

Spoken-only. A grandparent talks over a Meeting that plays itself. The player only advances title cards of 12 words or fewer. Six beats, 90–120 seconds, skippable once seen:

1. "Long ago, all forces lived in harmony. Children draw a circle."
2. "Then the Great Split. Fragments fell everywhere, the way rain falls."
3. "Some rivers are brave. Some kitchens are kind. Those are fragments."
4. "Meet one and it takes a form. Give it a name."
5. "Twelve sockets. Six of daylight, six of night. Bow first."
6. "Seven Keepers know seven lessons. Go and ask them."

The first Practice runs at `diff 0.2`, `openHand: true`. Companion voice lines carry the rest.

## 4. Starter stacks

Five stacks of twenty, 95–105 points each. Common bodies plus one Uncommon first friend. Every first friend carries the engine's `first` power: **+X if played first**. X = 4 at ship.

- **Colour**, a stone with a face: 13 of one colour; `plusOwnColor`, `perOwnColor`.
- **Position**, a creature with too many feet: `back`, `front`, `lonely`, `chain`.
- **Pressure**, a kettle that will not sit still: `opp`, `steal`, small `bomb`.
- **Tempo**, a wisp in the corner: `late`, `last`, `underdog`.
- **Guard**, a coat with too many pockets: `shield`, `veto`, `mirror`.

Shape differs, not strength. The unchosen four sell at the Summit, 2,000 coins.

## 5. Region template and economy

One vertical page per region. A three-stop sky and an ambient loop. Top to bottom:

1. **Header:** the whole fragment at 220 px, silhouetted until won. Name, line, Seal socket.
2. **Practice:** one large button, opponent at Keeper diff − 0.20.
3. **Shop:** Standard 3, Premium 5, Mega 5 with 1 top light. The region's finding: 24 forms sold nowhere else. A blank stays blank until you open it. That is the Breath.
4. **Players:** three portraits, any order. Beaten lines are town talk about the Keeper. Only player 3 constrains the stack (`maxRarity` or `maxTotal`).
5. **Keeper:** lit at 3/3 player pins.
6. **Explore:** three mini-game doors, three places.

Each Seal opens the next region.

| Region | Practice win / loss | Std / Prem / Mega | Pack light | Keeper diff | Keeper tier | New rule |
|---|---|---|---|---|---|---|
| Hearth | 40 / 10 | 120 / 300 / — | Common | 0.65 | -0.75 | none |
| Tide | 55 / 14 | 160 / 400 / — | Common–Uncommon | 0.65 | -0.25 | `colorBonus: 8` |
| Forge | 70 / 18 | 200 / 500 / 1,200 | Uncommon | 0.85 | -0.25 | `noSwap` |
| Grove | 90 / 22 | 250 / 650 / 1,500 | Uncommon–Rare | 0.65 `smart` | -1.5 | `rowBonus.back: 3`, `handSize: 4`, `secretsOn` |
| Signal | 110 / 28 | 320 / 800 / 1,900 | Rare | 0.75 `smart` | -1.85 | `noPowers`, `rowBonus.back: 3` |
| Observatory | 140 / 35 | 400 / 1,000 / 2,400 | Rare–Mythic | 0.75 `smart` | +2.55 | `colorSet: 2`, `colorBonus: 4`, `secretsOn` |
| Summit | 180 / 45 | 500 / 1,300 / 3,000 | Mythic; Legendary in Mega | 0.55 `smart` | +0.4 | `secretsOn`, `reelChange` |

**Keeper tier** shifts every companion in a Keeper's stack after the signature one up or down an edition; a fraction shifts that share of the list. It is the strength knob, and difficulty is the fine adjustment. Both are measured, not guessed: `scripts/ladder.mjs` sweeps the grid and `scripts/sim.mjs` writes `docs/balance.md`.

A house rule applies to both sides of the table. `secretsOn` wakes every secret power present, the player's included; a rule that woke only the Keeper's was a wall no stack could pass.

Standard = 3 Practice wins, Premium = 7. A player's first win pays 4× Practice, a Keeper 10×. A 1.25× coin lever lives in config. Opponent totals rise from 92 to 158. One Standard pack per region keeps the player within 8.

## 6. The road

A Keeper is not a gate. They know the lesson best and have waited to teach it. They cannot be flattered or forced. The answer to their question is a Meeting, not a menu.

| Region | Lesson | Question | Keeper | Telling |
|---|---|---|---|---|
| The Hearth | Foundation | Where do you come from? | a baker, flour on everything, asks about your family | Luck |
| The Tide | Flow | What do you want? | a ferry pilot, always moving, never rushed | Seed |
| The Forge | Will | What will you do? | a young smith, burnt eyebrows, opinions | none yet, and says so |
| The Grove | Care | Who is this for? | an old beekeeper; the board is a garden | Love |
| The Signal | Voice | What do you mean? | the Caller, retired; you have to listen | Mirror |
| The Observatory | Sight | What do you see? | an astronomer, lights off, knows your stack | Sleep |
| The Summit | Wholeness | Who are you now? | barely there; the fewest words | all; will not say which |

At the Summit the light turns white.

**[CORP] on the road.** [CORP] collects for the wrong reason: to own the universe. It believes the Dimming was a theft. It cannot pass a Keeper, so it buys. Its plan, the Gathering: every fragment in one building, one hand.

- **Tide:** a friendly buyer offers too much for one companion. It is the false baker. They ask about your family, then your price. Refusing costs nothing. The only button is No.
- **Grove:** the shop opens empty. The false pilot ferried the batch away. The potter fires a new batch; shelves refill after two players.
- **Observatory:** the false astronomer, in the open, holding a stolen whole fragment. They will not bow. Not a Meeting. Yet.
- **Foot of the Summit:** the Gathering begins. Every page on the map goes grey and halts. Two Meetings in the open at `diff 1.0`, `smart`, `secretsOn`. The false astronomer, then the Chief (`handSize: 4`). A loss restarts the pair. The Chief turns out ordinary: a coat, a clipboard, tired. The player bows first. The Chief bows last, badly. It counts. The stolen fragment goes home.

The false baker and pilot never bow. So they never get a Meeting.

## 7. Keepers, whole fragments, Seals, the Hall, 100%

- **Keeper:** fixed stack of twenty, region rules active. Balanced: the Keeper's total sits within 8 points of yours. Skipping the bow ends the Meeting, said once.
- **First win:** the Keeper's telling, one story only they hold. The region's Seal, a profile mark, never a companion. The **whole fragment**: 1/1, base 9–12, one unique power, never packable. 500 coins, 1 Premium pack. The smith's telling card reads "Not yet." It counts.
- **The Hall:** seven Seals earn an invitation and an eighth door. Twelve seats and a thirteenth chair, always empty. Three of the twelve test the arrival in sequence. `diff 1.0`, `smart`, `secretsOn`; the third adds `handSize: 4`. A loss restarts the sequence. Then the player is offered the empty chair. The game never says why.
- **The choice:** one card asks which telling the player believes. Five buttons: Love, Luck, Seed, Mirror, Sleep. No wrong answer. It marks the profile. Reward: five ending cards, 1 Legendary pack, a gold Seal ring.
- **100% per slot:** 21 players, 7 Keepers, 21 places, 21 mini-games. Every campaign companion. Reward: a poster with the player's name in the largest type. Nothing else. That is the point.

## 8. Explore mini-games (roadmap, unbuilt)

All three reuse the disc renderer, sockets and `evaluate()`. One screen, 60–90 seconds. Reward tier equals Seals held, Common to Mythic.

1. **The socket puzzle:** 7 placed, 5 in hand. Hit an exact target under the region's house rule. 5 authored puzzles per region, plus a daily one. The answer is chosen first, the target read off `evaluate()`. So always solvable. Clearing all 5: a companion at the current tier.
2. **The weighing room:** ten face up. Pick exactly five whose points hit the target. 10 rounds, 60 s; Bronze 5, Silver 8, Gold 10. Gold: a tiered companion, then 3× Practice coins.
3. **The dark reel:** 12 face-down, 6 pairs, 18 flips. Each pair shows one line of town talk. Clear: 1 Standard pack, then 2× Practice coins on replay.

**Places:** 3 per region, one opens per player beaten. Each is one title card in the grandparent's voice.

## 9. Risks and what to cut first

1. **Writing volume:** 21 player scripts, 7 tellings, 21 places, four [CORP] scenes. Cut first: 1 place per region. Keep beaten lines; they carry the town.
2. **Mini-games:** the socket puzzle needs 35 boards. Cut to 3 per region before cutting a game. The weighing room is never cut.
3. **Economy numbers** are unverified: ship the table and the 1.25× lever. Weekly Circuit is the first cadence to cut.

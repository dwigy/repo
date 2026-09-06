# [GAME] Campaign Format v1

The campaign is the centre button of [GAME]; online sits beside it, greyed, "coming soon". It is one story across seven regions: the [ARCHIVE] that held every chip went dark, each region hides one piece of why, and the three [CHAMPION] chips at the end hold the answer. Every mechanic is judged against one target session, "day 30, 10 minutes": a player who cleared [REGION 4] last week resumes a slot, Trains once, rips one pack, attempts one NPC or gatekeeper, opens one Explore spot, edits their stack and closes. No action exceeds 3 minutes, nothing expires, nothing needs a connection.

## 1. Loop and pacing

- **Session:** one match is 14 placements, 2–3 minutes; a session is 2–4 matches plus one rip, 8–12 minutes.
- **Core loop:** Train → Shop → NPC or gatekeeper → Explore → stack edit, all one tap from the region page.
- **Always available:** Train (unlimited, always pays); Shop (limited only by coins); Rematch of any beaten NPC or gatekeeper at 40% coins, or its "hard" variant (`handSize: 4`, `mult: {opp: 2, steal: 2, bomb: 2}`) at full coins; every mini-game, replayable for 10 coins (first-clear reward and lore point are one-time).
- **Daily (local midnight, shared by all slots):** first 3 Train wins pay 2×; one "Wanted" NPC rematch pays 2×; one current-region pack 25% off. Shown as three checks and seven orbs; a missed day dims one orb, never wipes.
- **Weekly (Monday, seed = ISO week number, offline):** a Circuit of 3 matches under one seeded house rule. Reward: 1 Premium pack of the highest unlocked region and 1 lore card. Wins fill a ring around the badge row, not a new badge.
- **Never resets:** coins, chips, badges, lore, completion.

## 2. Save slots

Three cards, each 33% of screen height. An empty card reads NEW GAME over a chip silhouette. A filled card shows: slot name (12 characters), hero chip at 120 px, seven badge sockets, current region, completion percent, coins, playtime, last played. No collection data.

- **Per slot:** story flags, region unlocks, coins, campaign stack, NPC/gatekeeper/finale results, Explore and lore state, badge and 1/1 flags.
- **Global:** the chip collection (chips won in any slot land there immediately), profile badges (union of slots), daily state, settings.
- **1/1 rule:** minted once per device; a second slot beating the same gatekeeper earns badge and coins only, said before the fight.
- **New game:** empty card → name → intro → starter → [REGION 1], under 4 minutes. Only the chosen starter's 12 chips enter the collection. Delete needs a 1.5 s hold and a confirm card. No Copy.
- **Back to main menu:** a chevron top-left on every campaign page, 44 px hit target, always visible, never animated.

## 3. Intro and tutorial

Spoken-only. [THE GUIDE], an old projectionist, talks over a match that plays itself; the player only advances title cards of 12 words or fewer. Six beats, 90–120 seconds, skippable once seen:

1. "The [ARCHIVE] went dark. The chips forgot each other." (a chip: a number, a colour, a habit)
2. "Seven sockets. Three behind, four in front." (one chip thunks down)
3. "A chip is worth its number, until it stands beside a friend." (`plusOwnColor` fires)
4. "Three of one colour and the room lights up." (colour set +5)
5. "Your hero remembers being first. Play it first and it proves it." (hero +X)
6. "Seven gatekeepers kept seven pieces. Go and ask them." (map reveal, [REGION 1] lit)

No drag exercises. The first Train match runs at `diff 0.2` with `openHand: true`; chip voice lines carry the rest.

## 4. Starter stacks

Five 12-chip stacks, Common bodies plus one Uncommon hero, each 58–62 points. Every hero uses the engine's `first` power: **+X if played first**. X = 4 at ship; held for v1.1, X rises to 6 at badge 4, 8 at badge 7, 10 at 100%, so the hero "remembers more" as the mystery resolves.

| Stack | Hero (base pts) | Identity and powers |
|---|---|---|
| [STACK A] Colour | [HERO A] (5) | 8 chips of one colour; `plusOwnColor`, `perOwnColor` |
| [STACK B] Position | [HERO B] (5) | rows matter; `back`, `front`, `lonely`, `chain` |
| [STACK C] Pressure | [HERO C] (6) | hurts the chip opposite; `opp`, `steal`, small `bomb` |
| [STACK D] Tempo | [HERO D] (4) | order of play; `late`, `last`, `underdog` |
| [STACK E] Guard | [HERO E] (4) | denies the rival's plan; `shield`, `veto`, `mirror` |

Stacks differ in shape, not strength; each hero's lore line hints at a different region's secret. The four unchosen heroes sell in [REGION 7]'s shop at 2,000 coins each, so the pick matters for six regions but never blocks 100%.

## 5. Region template

One vertical page per region: a three-stop sky gradient and an ambient loop; region hue only on sky and chip rings; the header flips from ink to colour when all its lore is read. Chevron top-left, map bottom-right (unlocked regions only). Top to bottom:

1. **Header:** the region's 1/1 chip at 220 px, silhouetted until won (a chip is the hero of the page), region name, badge socket.
2. **Train:** one large button; opponent from the region pool at gatekeeper diff − 0.20. Always open.
3. **Shop:** three packs (Standard 3 chips, Premium 5, Mega 5 with 1 guaranteed top-rarity) from 24 chips sold nowhere else, ink silhouettes until owned, so the shop is a checklist. Open on arrival.
4. **NPCs:** three portraits, any order, each with a 3-line intro, a taunt and a beaten line carrying the lore. Only NPC 3 applies a stack constraint (`maxRarity` or `maxTotal`).
5. **Gatekeeper:** lit at 3/3 NPC pins.
6. **Explore:** three mini-game doors and three lore points; doors 1–2 open on arrival, door 3 after two NPCs.

[REGION N+1] unlocks on [REGION N]'s badge.

| Region | Train win / loss | Std / Prem / Mega | Pack rarity (engine 0–4) | Gatekeeper diff |
|---|---|---|---|---|
| 1 | 40 / 10 | 120 / 300 / — | Common | 0.55 |
| 2 | 55 / 14 | 160 / 400 / — | Common–Uncommon | 0.65 |
| 3 | 70 / 18 | 200 / 500 / 1,200 | Uncommon | 0.75 |
| 4 | 90 / 22 | 250 / 650 / 1,500 | Uncommon–Rare | 0.82, `smart` |
| 5 | 110 / 28 | 320 / 800 / 1,900 | Rare | 0.88, `smart` |
| 6 | 140 / 35 | 400 / 1,000 / 2,400 | Rare–Mythic | 0.94, `smart` |
| 7 | 180 / 45 | 500 / 1,300 / 3,000 | Mythic; Legendary in Mega | 1.0, `smart` |

Standard = 3 Train wins, Premium = 7. NPC first win pays 4× Train, gatekeeper 10×. A 1.25× coin lever lives in config, not code.

## 6. Explore mini-games

All three reuse the chip renderer, sockets and `evaluate()`; one screen, 60–90 seconds. Reward tier equals badges held (0–1 Common, 2–3 Uncommon, 4–5 Rare, 6–7 Mythic), so early rooms stay worth replaying.

1. **[SOCKET PUZZLE]:** 4 chips pre-placed, 3 in hand; hit an exact target score under the region's house rule. 5 authored puzzles per region plus a daily one seeded from the date, generated by choosing the answer first and reading the target off `evaluate()`, so always solvable. Clearing all 5: a chip at the current tier that gains one edition whenever the player clears a later region's set.
2. **[WEIGHING ROOM]:** six chips face up; pick exactly three whose points hit the target. 10 rounds, 60 s; Bronze 5, Silver 8, Gold 10. Gold: a tiered chip, then 3× Train coins.
3. **[DARK REEL]:** 8 face-down chips, 4 pairs, 12 flips, on the existing flip animation; each match shows a lore line. Clear: 1 Standard pack, then 2× Train coins on replay.

**Lore points:** 3 per region, 21 total, one per NPC beaten; each plays one title card in [THE GUIDE]'s voice. Reading all 3 reveals the gatekeeper's true intro line; the 21 cards in order are the whole story of the [ARCHIVE].

## 7. Gatekeepers, 1/1 chips, badges, heroes finale, 100%

- **Gatekeeper:** fixed 12-chip stack, region rules active, diff per Section 5. Loss costs nothing; rematch immediately.
- **First win:** the region's **1/1 chip** (Award rarity, base 9–12, one unique power, never packable or tradeable), the **region badge** (a profile pin, offline now and online at launch, never a chip), 500 coins, 1 Premium pack.
- **Heroes finale:** at 7 badges a hidden eighth door, the [ARCHIVE], opens on the map. [CHAMPION A], [CHAMPION B], [CHAMPION C] in sequence at `diff 1.0`, `smart`, `secretsOn`; the third adds `handSize: 4`; a loss restarts the sequence. Reward: the ending in five title cards, 1 Legendary pack, a gold ring around the badge row.
- **100% per slot:** 21 NPCs, 7 gatekeepers, 7 badges, 21 mini-games at Bronze+, 21 lore points, 3 champions, and every campaign chip: 168 shop exclusives, 7 gatekeeper 1/1s, 7 puzzle chips, 5 starter heroes. Reward: the **Completion badge**, the **[COMPLETION 1/1]** (an Award-rarity edition of the starter hero with X = 10) and a poster with the player's name in the largest type in the app. Percent is evenly weighted over seven counts.

## 8. Difficulty and progression curve

Each region introduces one house rule its NPCs teach and its gatekeeper stacks on earlier ones; the story moves from "learn numbers" through "the rules bend" to "everything remembers". NPC 3 goals rotate (margin 5, score 50, sets 3).

| Region | NPC diff | New rule |
|---|---|---|
| 1 | 0.35 | none; `noPowers` for NPC 2 |
| 2 | 0.45 | `colorBonus: 8` |
| 3 | 0.55 | `noSwap` |
| 4 | 0.65 | `flipRows`, `lastBonus: 8` |
| 5 | 0.72 | `noPowers`, `rowBonus.back: 3` |
| 6 | 0.80 | `openHand`, `colorSet: 2`, `colorBonus: 4` |
| 7 | 0.88 | `secretsOn`, `reelChange` |

Opponent totals rise from 54 to 92 points; one Standard pack per region keeps the player within 8. Stacks are constrained only on NPC 3, never at gatekeepers, so the outside collection always counts.

## 9. Data model sketch (per slot, under 8 KB)

- slot id, name, schema version, created, last played, playtime seconds, checksum
- starter id, hero chip id, hero X level, coins, campaign stack (12 chip ids)
- current region, unlocked regions (bitmask 7), archive door open
- per region: Train wins and losses, NPC results (beaten, attempts, hard wins), gatekeeper (beaten, attempts), doors open, three best ranks, lore read (bitmask 3), puzzles solved (bitmask 5), shop chips owned (bitmask 24)
- badges (bitmask 7 plus completion), 1/1 grant flags, finale stage, ending seen, intro seen
- weekly: seed, matches done, reward claimed (daily state is global)
- cached completion percent

## 10. Risks and what to cut first

1. **Writing volume** (21 NPC scripts, 21 lore cards, 11 intro and ending cards). Cut first: 1 lore point per region; keep NPC beaten lines, they carry the story.
2. **Mini-games.** [SOCKET PUZZLE] needs 35 authored boards; cut to 3 per region before cutting a game. [WEIGHING ROOM] has zero content and is never cut.
3. **1/1 art:** 9 bespoke chips. Fallback: alt-art editions of existing characters, one tuned power.
4. **Region 6 spike** (`smart` plus `openHand`): drop `openHand` from the gatekeeper if median attempts exceed 4.
5. **Economy tuning** is unverified: ship the table and the 1.25× lever. Clock spoofing of dailies: accept it; nothing offline needs protecting.
6. **Hero X scaling** adds four editions per hero: ship X = 4 and the completion hero only.
7. **Weekly Circuit** is the least essential ritual; cut it before anything on the region page.

---

*Drafted by three independent designers (loop-first, story-first, collector-first), judged and synthesised. Judge notes:*

- **loop-first**: coverage 8, concreteness 9, buildability 9, fun 7. Best: The 'day 30, 10 minutes' spine: a named target session (Train → rip → NPC/gatekeeper → Explore → adjust stack) that every feature is judged against, with a hard cap of no mandatory action over 3 min.; Full economy table (coins per Train win/loss, Std/Prem/Mega prices, max rarity per region) with a stated rule of thumb (Standard = 3 Train wins, Premium = 7) and a config-level 1.25x coin lever instead of code changes.; Difficulty table maps one-to-one onto the real engine: diff values per NPC/gatekeeper, `smart` from Region 4, house rules quoted by their actual keys (`flipRows`, `reelChange`, `colorSet: 2, colorBonus: 4`).. Gaps: 'Main menu' lives only on the map, not the region page, so it is two taps away; the brief asks for a control that is out of the way but easy to access on the campaign UI itself.; [HERO A/B/C] are used both as the five starter heroes and as the three finale heroes; the finale needs distinct placeholders.
- **story-first**: coverage 9, concreteness 9, buildability 8, fun 9. Best: A single spine mystery ([ARCHIVE] went dark; each region hides one piece) that turns every NPC beaten-line, lore point and gatekeeper into a story payload; the 42 lore cards read in order are the full story.; Hero '+X if played first' scales with the mystery (X = 4, then 6 after badge 4, 8 after badge 7, 10 at completion): the mechanic and the lore are the same thing. Ship fixed X first as the draft's own risk list says, but keep the design.; Intro over a match that plays itself, narrated by [THE GUIDE]; six beats, 90–120 s, every beat a 12-word title card, no drag exercises; the map reveal is the last beat.. Gaps: Stack level cap ('max level = region tier') contradicts the brief's framing that the collection lives outside the campaign and could stall collectors; the draft flags it but keeps it as default. Prefer opt-in constraints on NPC 3 only.; Back-to-menu chevron at 32 px is below a comfortable tap target; should be 44 px with a larger hit area.
- **collector-first**: coverage 9, concreteness 8, buildability 7, fun 8. Best: The Completion Ledger: one page per slot with seven badge sockets, seven 1/1 silhouettes, per-region chip counters in ink until owned, and a percent that every activity moves; the shop doubles as a checklist of that region's 24 exclusive chips.; Explore reward tier equals badges held (0–7 → Common through Mythic), a one-line rule that makes early mini-games worth replaying later.; Back-to-menu spelled out: chevron top-left on every campaign page, 44 px hit target, always visible, never animated.. Gaps: The 'framed print' duplicate of a 1/1 chip for a second slot undermines the 1/1 promise; mint once per device (the draft's own fallback) and give later slots the badge only.; 'Prize rarity' is not in the engine's rarity ladder (Common to Legendary); either use Legendary or define Prize as a material variant like Full Gold.

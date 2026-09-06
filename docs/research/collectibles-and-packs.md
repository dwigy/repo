# Collectible and Pack-Opening Experiences: Research for Cartoon Orbit

Scope: how the best collect-and-reveal products communicate rarity, make variants feel exclusive, stage the reveal, pace the loop, keep people opening "one more" without dark patterns, and let people flex. Each entity is rated on the owner's four axes (unique / user-friendly / art-first / addictive), then principles are extracted with evidence and a concrete "apply to Orbit" note. Where a claim is from memory rather than a fetched source it is marked **(memory)**.

## 0. Where Orbit stands today (from the screenshots and `js/pack.js`)

What already works:

- The pack flow has the right skeleton: sealed foil pack, drag-to-rip with a physical tear, white flash + sparks in the best pull's colour, chip backs flying into a stack, one-at-a-time tap-to-flip, dot progress in rarity colours, a legendary "tension" beat (shimmer + drum + 900 ms hold), screen shake + confetti at Mythic+, and a summary grid with NEW badges. Ordering reveals least-rare to most-rare is correct (Hearthstone, Pocket and Top Shot all end on the hit).
- The binder shows silhouettes ("???") with per-character 1/8 progress pips, which is the Pokedex/living-binder pattern.
- cMart prints pull odds on the pack, which is the honest, non-dark-pattern baseline.
- The detail sheet has a quote, a power line and ownership counts.

What reads as "generic game" rather than "expensive object":

1. **Rarity palette is the MMO loot palette.** Grey / green / blue / purple / orange rings are Diablo-WoW-Hearthstone defaults; every vibe-coded gacha uses them. Nothing in this palette says "1920s cartoon star" or "2003 Cartoon Network". The Mythic/Legendary tiers differ only by a thin ring, a dashed inner ring and a few sparkles.
2. **The metal editions flatten the art.** On `sheet.png`, Silver / Platinum / Dark Matter grey-out or purple-out the portrait. Every product below that people pay real money for (Pocket, Snap, Panini, Japanese SAR) *adds* to the art at higher tiers (full art, foil layered on top, animation), never subtracts colour from it.
3. **Chips are static.** No tilt, no light band, no parallax; the "holo" edition is a rainbow gradient background rather than a light-reactive surface. The single biggest "luxury" tell in every digital collectible below is a surface that reacts to the phone's motion or the finger.
4. **The pack reveal has no delta from the ordinary.** All three chips get the same rays; the hint sound fires before the flip but the *card back* never signals. In Hearthstone, Pocket and Master Duel, the *back or edge* of the card tells you something is coming.
5. **The summary screen is a list, not a moment.** "All duplicates, recycle them for points" is honest but anticlimactic; there is no "what this means for my binder" (set progress ticks, a new best chip, a serial number).
6. **No serial / provenance.** A Legendary Felix is every Legendary Felix. Top Shot, Sorare, Panini and Bunt all show that a number (#23/100) is what turns a copy into *mine*.

## 1. Entity-by-entity

### 1.1 Pokemon TCG Pocket (DeNA / Creatures)

**What it is.** Mobile Pokemon TCG with a compressed rule set and a lavish collection layer: two free packs per day (one every 12 hours), Wonder Pick, immersive cards, binders and display boards, Community Showcase.

**Unique.** Three ideas nobody else has done together: (a) *Immersive cards* (three-star rarity) where press-and-hold dives *into* the illustration and plays a short animated scene of the Pokemon in its environment; the immersive card is "a mere visual spectacle" with no gameplay difference, which is precisely the point. (b) *Wonder Pick*: you choose one of *another player's* opened packs, the five cards shuffle face-down, and you draw one blind. It turns other people's luck into your content and creates a daily reason to look at strangers' pulls. (c) *Rarity as a typographic system*: diamonds (1-4), stars (1-3), shiny stars, crown. The crown rare is full-art EX of the pack cover Pokemon with a gold spiral background and a gold/rainbow holographic border; the "rare pack" (all-rare "god pack") shows at 0.05%.

**User-friendly.** Pack opening is a single vertical swipe to "cut" the seal, then swipe each card off the stack **(memory)**; you can replay and share the opening; the whole rip is under 20 seconds; skip is always available; free packs recharge on a visible timer so nothing needs a purchase to complete the daily loop.

**Art-first.** The card *is* the product. Card backs are plain so the front lands harder; full art, alt art and immersive cards exist *only* as art upgrades; the collection view lets you tilt a card and see foil react **(memory)**; binders and display boards exist purely to arrange art and share it (people thank you for a Wonder Pick or like your showcase, and that gives *you* a reward).

**Addictive.** Two-pack cadence (12 h), Wonder Pick timer (a few hours), pack points as a deterministic pity you can spend on a specific card, the "one rare per pack, sometimes a god pack" variance, and the social loop (showcases, thank-yous). Notable: the pity is *visible and spendable*, not a hidden counter, so the "one more pack" feeling comes from being 3 packs away from a card you can see, not from a black-box roll.

### 1.2 Marvel Snap (Second Dinner)

**What it is.** Fast six-turn card battler where the collection is organised entirely around *cosmetics of a card you already own*.

**Unique.** *Infinity Splits.* Upgrading a card (Common -> Uncommon -> Rare -> Epic -> Legendary -> Ultra -> Infinite) changes its *frame* (3D, then 3D + foil border, then frame break where the art escapes the frame). At Infinite the card "splits" into a fresh copy with a random *finish* (Foil, Prism, Ink, Gold) and *flare* (Glimmer, Kirby Krackle, Sparkle, Stardust, in several colours). There are ~128 combinations per variant; Ink and Gold cannot appear before the third split and are ~10% each; a Gold or Ink with Black Krackle is among the rarest objects in the game. Variants (different art of the same card) are a separate axis. So *the same card* has hundreds of visually distinct states, none of which change gameplay.

**User-friendly.** Everything is deterministic: boosters (earned by playing the card) + credits = a guaranteed upgrade. There is no pack. The collection level is a single number that ticks up with every upgrade and unlocks the next card, so every cosmetic action is also progress.

**Art-first.** Each card art is layered for parallax and the 3D frame tilts with the phone **(memory)**; frame break lets characters overlap the border, which is the digital equivalent of a physical full-art card. The variant store shows art large with the artist credited.

**Addictive.** Splitting is a slot machine you pull *by playing*: the roll happens only when you have earned it, so it never feels like a purchase. The rarest results (Gold, Ink) are communicated with an unmistakable moment (the card shatters and reforms in the new finish). Collection level makes all of that also feel like "levelling".

### 1.3 Hearthstone (Blizzard) pack opening, golden, signature, diamond cards

**What it is.** The template every digital pack opening has copied since 2014.

**Unique.** Five cards fan out face-down around the ripped pack; you tap each; *before the flip* a card's back glows in its rarity colour (blue, purple, orange) with a matching chime, and a Legendary gets an orange sunburst and a distinctive sound *before* you see it **(memory, confirmed by the fan wiki language "the thrilling promise of that elusive orange glow")**. Golden cards are animated versions of the same art; Blizzard's animator Hadidjah described the philosophy as "subtle, looping, in-character" motion rather than spectacle. Signature cards (2022+) use stylised full-art in a per-expansion visual language (icy sepia for Lich King, etc.) with a border that changes by year. Diamond cards are 3D-rendered.

**User-friendly.** Duplicate protection, guaranteed legendary in the first 10 packs of an expansion, a visible pity counter in the pack UI, the ability to open many packs quickly.

**Art-first.** The golden treatment is a *time-based* art upgrade (motion), which showed that "the same card, moving" is a tier collectors will chase.

**Addictive.** The pre-flip tell is the whole trick: it converts the moment before information into the most exciting moment. The 4-common-plus-1 structure means the last card is often the hit, and the rarity tells let you *feel* the hit arriving.

### 1.4 Clash Royale chests and Lucky Drops; Brawl Stars Starr Drops (Supercell)

**What they are.** Reward containers that escalate. Clash Royale replaced its chest queue with instant Lucky Drops/Lucky Chests: you tap a box repeatedly and *each tap can upgrade its star rating* from Common to Legendary/Champion before it opens. Brawl Stars' Starr Drop starts Rare and can upgrade to Super Rare, Epic, Mythic or Legendary (50/28/15/5/2%); the outcome is decided at award time and the reveal is a playback of that outcome.

**Unique.** *Escalation as the reveal.* Rarity is not shown once; it is shown as a staircase, and each tap is a mini-cliffhanger. Chest opening in classic Clash Royale showed cards flying out and *counting up* with a "NEW CARD" fanfare and set-completion ticks **(memory)**.

**User-friendly.** Free, fast (a Starr Drop is three taps), no timers on the reveal, clear odds published by Supercell ("ALL ABOUT DROP RATES").

**Art-first.** Not really: these are reward boxes, not art. But their *shape language* (a box whose colour and glow changes as it upgrades) is the clearest example of rarity communicated by form and light rather than by a label.

**Addictive.** Variable-ratio escalation with tiny effort cost. Note the honest design detail: the outcome is fixed at award time, so the taps are theatre, not gambling *inputs*; the player still gets the felt sense of "it went up one more tier".

### 1.5 Genshin Impact wishes and Honkai: Star Rail warps (HoYoverse)

**What they are.** Gacha "ceremonies". Genshin: a meteor streaks toward the camera; its colour (blue / purple / gold) tells the best rarity of the batch before anything is shown **(memory)**. Star Rail: Pom-Pom's train door glows in the rarity colour, and a five-star ticket "looks blurry with a rainbow effect" and the music pitches up. Pity: 4-star guaranteed at 10, 5-star hard pity at 90 (80 weapon) with soft pity ramping from ~74; 50/50 with a guarantee after a loss.

**Unique.** The *tell precedes the reveal* and is scoped to the whole 10-pull, so a gold meteor makes you sit through all ten reveals in a state of excitement. The reveal itself is a full-screen character splash with voice line and a title card; the ceremony is ~25 seconds and skippable.

**User-friendly.** Pity is public, counted in the UI by the community (the games themselves show the history log), and deterministic. Every currency is spelt out.

**Art-first.** The five-star splash art *is* the reward; the animation is built to frame the illustration.

**Addictive.** Soft pity means most people hit at 74-80 and the "I'm at 71" feeling is a powerful pull. This is the line Orbit should not cross: hidden ramps and 50/50 losses are the dark-pattern side of pity. What *is* transferable is the pre-reveal colour tell and the idea that the ceremony's duration scales with the rarity.

### 1.6 NBA Top Shot (Dapper Labs)

**What it is.** Licensed NBA highlight clips as serial-numbered "Moments" sold in timed pack drops with a randomised queue.

**Unique.** Three things: the *drop* (an event with a start time, a 10-minute join window and a randomised queue, so buying is itself a ceremony and a community event); the *serial number* (every Moment is "#n/edition size", and matching a jersey number, e.g. LeBron #23, carries a premium); and the *Moment* format (a looping video in a 3D cube you can rotate **(memory)**). Pack tiers: Base/Common, Rare, Legendary (one legendary + three rares + commons).

**User-friendly.** Queue is fair (randomised, not fastest-finger). Showcases let you arrange Moments into named shelves.

**Art-first.** Motion is the art; the cube frame is a consistent, expensive-looking container.

**Addictive.** Drop calendars and the queue turned buying into an appointment; serial numbers made even commons collectable (low serials, jersey matches). Top Shot's decline shows the risk of tying the loop to secondary-market price rather than to the art.

### 1.7 Sorare

**What it is.** Fantasy football/NBA/MLB with player cards in four scarcities: Limited (yellow, 1000/season), Rare (red, 100), Super Rare (blue, 10), Unique (purple, 1). Each card carries a serial number and season; each scarcity has five design variations per player.

**Unique.** Scarcity is a *colour* first and a word second; the entire UI, borders and market are keyed to the four colours. The Unique tier (exactly 1) makes a single object per player per season a public event. Cards tilt in 3D on the web with a light sheen on hover **(memory)**.

**User-friendly.** No packs: you buy the exact card you want from an auction, and the "reveal" is winning the auction. Orbit already has an auction screen; Sorare shows how to make it the *premium* path.

**Art-first.** Photo-forward, a shield frame, minimal chrome, a lot of negative space; the card design was revised specifically to enlarge the player and simplify the border.

**Addictive.** Weekly competition plus provable scarcity. Transferable: named scarcity tiers with fixed edition sizes and serials.

### 1.8 Topps Bunt / Topps Kick (Topps digital)

**What it is.** The longest-running digital card app (2012+). Weekly releases, base sets of 15 stars per team, colour parallels, signature and relic cards, "Signature Awards" for collecting across parallels, motion and audio fx cards, live video signatures, one-of-one digital parallels.

**Unique.** Bunt translated *physical* hobby grammar (parallels, numbered inserts, set awards) into digital without inventing new vocabulary; collectors who know Topps physical understand Bunt instantly. It also proved that *completing a set of parallels* (the award) is a stronger driver than any single card.

**User-friendly.** Trading is first-class (it is in the app's name); daily free packs; sets have clear checklists.

**Art-first.** Motion and audio fx cards, throwback designs, original artwork releases; cards tilt with a subtle holographic band **(memory)**.

**Addictive.** Weekly release rhythm plus award chases. Transferable: an "award" chip you get for completing a colour run.

### 1.9 Panini (Prizm and parallels), and physical trading-card culture

**What it is.** The physical hobby's rarity language. A *parallel* is the same photo and design with a different foil/colour: Silver, Blue, Red, Gold /10, Black 1/1, plus "hobby-memory" parallels (Choice Nebula, Black Gold). Value comes "from scarcity and finish desirability, not from any additional content"; two near-identical Luka Doncic cards differ by $5,000 because of a Gold /10 stamp. Chase cards are the cards a set is opened *for*; Japanese Pokemon SAR (Special Art Rare) hits about once every 3-4 booster boxes and uses a unique alternate illustration that exists nowhere else in the set; AR (Art Rare) re-prints a common with a full illustrated background.

**Unique.** *Numbering* ("/10" stamped on the card) and *grading* (PSA 1-10 with a slab and a label) turn condition and print run into visible, ownable facts. The *holo tilt* ("tilt the card and move it slowly under the light, watch the band of light travel") is the sensory signature of the hobby; factory holo defects and print lines are the top reason a card fails PSA 10, which shows how closely people look at the surface.

**User-friendly.** Not particularly; the transferable bit is that the vocabulary (parallel, numbered, chase, slab, binder page) is shared and legible.

**Art-first.** Full art and alt art are *the* premium; the highest tiers are the ones where "the illustration expands across the entire card" and "the visual presence of the artwork is much stronger". Nostalgia is the primary driver for a third of collectors; nearly half see a collection as hybrid hobby/asset.

**Addictive.** The chase (a card you can name and picture), the tilt (a surface that rewards handling), the binder page (a 3x3 grid that makes a gap visible), and the community rip (group breaks, trade nights).

### 1.10 Magic: The Gathering Arena packs and showcase frames

**What it is.** Digital MTG. Showcase frames (Throne of Eldraine, 2019 onward) are alternate frames + art that "tie together some theme of the set" and were introduced explicitly "to make opening booster packs more engaging"; borderless, extended-art and retro frames sit alongside. In Arena they are "card styles" you can buy or earn and toggle on a card you already own; showcase cards replace a same-rarity card in packs.

**Unique.** *Set-themed treatments.* Each set gets its own frame language (storybook for Eldraine, Viking runes for Kaldheim, film-reel for Doctor Who), so a showcase card tells you *where* it came from. Arena's pack opening fans 8 cards in an arc; rares/mythics shimmer and are sorted last **(memory)**.

**User-friendly.** Wildcards (deterministic crafting) and duplicate protection (the "vault"). Styles are separated from cards, so cosmetics never gate play.

**Art-first.** Card styles are pure art purchases; the "parallax" full-art styles animate slightly.

**Addictive.** Moderate; the transferable idea is *series-specific frames*: Orbit already has five series with their own colours and blurbs, which is the raw material for five bespoke edition frames.

### 1.11 Yu-Gi-Oh! Master Duel (Konami)

**What it is.** Digital YGO. Finishes: Basic, Glossy (a glow across the art), Royal (rainbow reflective border plus prismatic foil across the whole card; only SR and UR can be Royal). The pack opening shows cards face-down; the *back* of a card that will be SR/UR glows and a Royal finish card back has a rainbow pulse before the flip **(memory, consistent with fan posts about "shine" on the back)**. *Secret Packs*: pulling or crafting an SR/UR unlocks a themed 8-card Secret Pack for 24 hours; pulling another related SR/UR resets the timer; the first key unlock grants one free pack.

**Unique.** The Secret Pack loop is a *discovery* mechanic: a good pull opens a door to a themed shop for a day. It is a soft, time-boxed reason to come back that does not require a purchase, and it rewards you for the pull with *access*, not just the card.

**User-friendly.** Craft points from dismantling (10/15/30 by finish) and free daily gems keep the economy readable.

**Art-first.** Royal finish is the only reason to chase beyond playability, and it is explicitly a surface effect.

**Addictive.** Secret Pack timers plus pre-flip tells.

### 1.12 Legends of Runeterra (Riot)

**What it is.** Riot's CCG, famous for a generous economy: no random packs at launch; a weekly Vault that opens on a fixed day; wildcards. Prismatic card styles add a silver (gold for champions) border, a sheen and "a subtle animation reminiscent of a physical holographic foil card". Champions have full-art level-up animations; the card art is viewable full-screen and zoomed in the collection.

**Unique.** The *weekly Vault* is an appointment reward that grows with play and opens with a ceremony (chests within chests, the number of chests upgrading as you play) **(memory)**. Rarity is communicated by the *level-up*: a champion's card visibly transforms mid-match.

**User-friendly.** The most player-friendly economy of its generation; showed that a collectible game can drop packs entirely and still have a reveal ceremony (the Vault).

**Art-first.** Full-bleed art on hover, "high definition art" for every card, level-up animations.

**Addictive.** Weekly rhythm plus visible Vault tier growth.

### 1.13 Gwent (CD Projekt Red)

**What it is.** The Witcher card game, with *premium* (animated) cards and *kegs*. A keg contains 5 cards: the first 4 are flipped one by one, then for the 5th you *choose one of three*, each Rare or better; the two you did not choose are destroyed.

**Unique.** *Choice inside the rip.* The keg mixes chance (4 cards) with agency (pick 1 of 3), which is the single best anti-dark-pattern reveal design in the genre: the last card is never a dud, and the player's decision is the climax. Premium cards began as "a gif of a cat with parallax"; the art director's PAX talk described full 2D -> 3D -> animation -> VFX -> sound pipelines for each premium card, treating each as a tiny looping scene.

**User-friendly.** Kegs come from play; scrap crafting; the board itself is a piece of set design.

**Art-first.** The premium card is the best-in-class "living painting": parallax layers, weather, particle effects, looped sound.

**Addictive.** The pick-1-of-3 finisher.

### 1.14 Balatro (LocalThunk)

**What it is.** Poker roguelike whose "juice" is the reason people describe it as addictive. Cards have physical inertia when dragged, push neighbours, and snap with "magnetic damping"; scoring stacks screen shake, flip animations, exponentially escalating numbers with tick sounds, fire effects and chip sounds. Editions: Base, Foil, Holographic, Polychrome, Negative (0.3% on jokers, inverts colours and adds shine); seals (Red, Blue, Purple, Gold).

**Unique.** Editions are *shaders on a tilting card* (a true light-reactive foil, holo and polychrome band that moves as the card wobbles) and each edition is also a mechanical bonus, so art tier and power tier coincide. Every card has a tiny idle wobble; hovering lifts it. Booster packs (Standard/Jumbo/Mega) fan cards out and let you *pick* one or two.

**User-friendly.** Hover-to-read, zero menus, one-click undo of a selection.

**Art-first.** Pixel art at 2x with a CRT/bloom pass; the Negative edition proves that a colour inversion can read as *luxury* if it is paired with a shine layer (the opposite of Orbit's flattened Silver).

**Addictive.** The count-up. Balatro's score ticker is the most quoted example of turning arithmetic into fireworks; it is directly reusable in Orbit's match result and pack summary.

### 1.15 Inscryption (Daniel Mullins)

**What it is.** A card game inside a cabin. Cards are placed on a physical table with hands, sacrifices carve marks into cards, the sound design provides "thuds and snaps" of the card game, and the rules are conveyed by sigil pictures rather than text because Mullins "deliberately did not use text and preferred symbols with clear metaphors".

**Unique.** *Physicality as world-building.* The card is a thing with weight; card packs come from a trader who lays them on a table; the camera looks *down* at the table.

**User-friendly.** Symbols over text; a tutorial delivered by the antagonist.

**Art-first.** Every card is a woodcut-style illustration with a paper texture; the pack is a paper pack.

**Addictive.** The feel of dropping a card and hearing it land.

### 1.16 Slay the Spire (Mega Crit)

**What it is.** Deckbuilder; after every fight you see three cards face-up and choose one or skip. "Skipping feels bad because you are wasting a reward, but a skipped reward is an investment in deck consistency."

**Unique.** Choice as the reward. Cards are unlocked at account level with a small ceremony of new cards fanning in.

**User-friendly.** Everything is legible: the three cards are shown at full size with hover text.

**Art-first.** Card frames by colour with a portrait; rarity shown by the gem in the frame (common grey, uncommon blue, rare gold) **(memory)**.

**Addictive.** The pick-1-of-3 decision repeated dozens of times per run.

### 1.17 Cultist Simulator (Weather Factory)

**What it is.** A game "of nothing but cards" on a dim table; cards are dragged into verb boxes; timers run; cards decay. Kennedy: cards "combine text and pictures into slices of frozen meaning"; a card-based approach "made concepts tangible and allowed players to organise the cards as they saw fit".

**Unique.** *The table is the UI*: no menus, only cards, stacks and slots; players arrange their own layout, which means the collection becomes a personal desk.

**User-friendly.** Arguably not (it is deliberately obscure), but the *drag-to-slot* interaction with magnetic snapping is extremely learnable.

**Art-first.** Small illustrated cards on a textured table, with card *decay* animated as a burning fuse.

**Addictive.** Timers that finish while you are doing something else. Transferable: a free-arrangement cZone as a table you curate.

### 1.18 Nike SNKRS

**What it is.** Nike's drop app. Drops have calendar dates and a countdown; the "Got 'Em" screen is the payoff and has become a cultural object (printed on hangtags and sockliners); the alternative is "Didn't get 'em".

**Unique.** The outcome screen *is* the brand. People screenshot it. Nike literally manufactures products themed on the screen.

**User-friendly.** A calendar, notifications, one tap to enter, one screen for the result.

**Art-first.** Product photography on a white ground with nothing else; the entire UI is white space, one typeface and a photo.

**Addictive.** Scarcity, appointments and a bragging artefact. Transferable: a share-ready "pull card" for every Mythic+ pull that people want to post.

### 1.19 Pokemon GO (Niantic)

**What it is.** The mainstream template for collection compulsion: Pokedex silhouettes, shiny variants (sparkle on encounter), medals, Community Days.

**Unique.** The *silhouette dex* (you can see the shape of what you do not have) and *shiny* as a variant that is only distinguishable by colour and a sparkle animation at encounter; the reinforcement arc is "curiosity -> anticipation -> dopamine spike -> reveal -> drop -> chase", with the biggest spike "right before you open it".

**User-friendly.** The dex and medals are visible progress; the shiny sparkle is instantly legible.

**Art-first.** Not particularly.

**Addictive.** Community Day is the best appointment mechanic in mobile: a three-hour window, a featured character, boosted shiny odds, and a *special move* only obtainable then. The cautionary side: the 2026 criticism of "investment trap" shiny mythical quests.

## 2. Transferable principles (with evidence and an Orbit application)

### P1. Tell before you show: the surface should leak rarity before the flip

*Evidence.* Hearthstone's rarity-coloured card-back glow and Legendary orange sunburst; Genshin's meteor colour and Star Rail's door glow/rainbow ticket/higher-pitched music; Master Duel's glowing/rainbow-pulsing backs; Brawl Stars' upgrade staircase.

*Apply to Orbit.* In `renderReveal`, the chip back should not be identical for all three chips. Give the back a *rarity-keyed rim light*: Common backs are matte; Uncommon/Rare backs pick up a thin coloured edge; Mythic backs have a slow rotating light band on the rim and a low hum; Legendary backs have a visible pulse, a sub-bass drum and the background rays start *before* the flip. Better still, run a Supercell-style escalation: the back starts grey, and on the tap it "climbs" through rings (grey -> green -> blue -> purple -> gold) and stops at the true tier, which the player already knows was fixed when the pack was bought (say so in the cMart odds text: "your pulls are decided when you buy").

### P2. Higher tiers add art; they never subtract it

*Evidence.* Pocket (full art, immersive), Japanese SAR/AR (bigger illustration, unique alt art), Panini (same photo, more foil), Snap (frame break lets art escape the border), Gwent premium (animated scene), Hearthstone golden (motion), Balatro Negative (inversion plus shine).

*Apply to Orbit.* Replace the flattened Silver/Platinum/Dark Matter portraits with treatments that layer *on top of* the coloured portrait: a metallic rim and a light band over full-colour art, a Dark Matter that keeps the character in full colour against a starfield, and, at the top tier, a "Frame Break" where the portrait's ears/hat/hand overlap the ring. Add a "Reel" tier that *moves* (a 2-3 frame loop of the character, or a subtle film-grain flicker) as Orbit's golden card. Keep the metals as a *colourway of the ring*, not a filter on the face.

### P3. Rarity needs a bespoke visual language, not the loot-drop palette

*Evidence.* Pocket uses diamonds/stars/crown; Sorare uses yellow/red/blue/purple with fixed edition sizes; Panini uses named colours and numbered stamps; MTG uses set-themed frames; Snap uses finish + flare vocabulary. None of them use grey-green-blue-purple-orange rings.

*Apply to Orbit.* Build Orbit's own scale from its two source periods (1920s theatre and 2003 CN): e.g. Common = "Reel" (paper/nitrate), Uncommon = "Matinee", Rare = "Marquee" (brass), Mythic = "Spotlight" (chrome + light band), Legendary = "Premiere" (24k gold + rainbow holo), Prize = "One Sheet". Encode rarity with three redundant channels: ring material, a small pip glyph (like Pocket's diamonds/stars/crown) and the name. Keep the tier colour as accent only. The current five-tier structure and odds can stay; only the language changes.

### P4. Numbers make copies into possessions

*Evidence.* Top Shot serials (#23 LeBron premium), Sorare serials and fixed print runs, Panini "/10" stamps and 1/1s, Bunt one-of-one parallels, PSA slab labels.

*Apply to Orbit.* Stamp every chip instance with a mint number on the chip edge ("No. 0417"), keep per-edition mint counts in `store.js`, give Mythic+ a visible edition size ("No. 12 of 250"), and make Prize cToons true 1/1 or /10. Show the number on the detail sheet, in the auction and on the pack summary; add "Low mint" and "Jersey/Year match" (e.g. No. 1919 Felix) as visible badges. This costs almost nothing in code and gives the auction screen a reason to exist.

### P5. The card must react to light and motion

*Evidence.* Physical holo tilt ("watch the band of light travel"); Pocket, Snap, Sorare, Bunt and Balatro all implement a tilt-driven sheen; Runeterra prismatic "subtle animation reminiscent of a physical holographic foil"; Master Duel Royal finish's prismatic band.

*Apply to Orbit.* Add a `DeviceOrientation` (with permission on iOS) and pointer-driven light band to `art.js`: a diagonal specular highlight and a rainbow interference gradient masked to the ring and, on Holo+ editions, to the portrait, offset by tilt. On desktop, use pointer position. Make the detail sheet chip large (80% width) and tiltable, and let the binder grid apply a cheap version (highlight only) so the page shimmers when the phone moves. This single feature is the strongest "expensive" signal available.

### P6. Ceremony length scales with rarity, and everything is skippable

*Evidence.* Genshin/Star Rail (long ceremony, skippable), Hearthstone (legendary pause), Pocket (immersive dive on press-and-hold), Orbit's own 900 ms legendary shimmer.

*Apply to Orbit.* Keep the current beats but grade them: Common flips in ~200 ms with a soft click; Rare adds a ring flash; Mythic adds the slow flip, rays and shake (already there); Legendary adds a *pre-flip stage*: dim the room, spotlight iris, 1.5 s pulse, then the flip, then a 2 s hold with the name set in the Orbit display face, then the confetti. Add press-and-hold on any revealed Legendary to "enter" the chip (Pocket immersive): the portrait zooms to full-screen with its series backdrop and a one-line film credit ("Feline Follies, 1919").

### P7. End on the hit, then show what it meant

*Evidence.* Hearthstone and Pocket order the rare last; Clash Royale chests count up with "NEW CARD" and set ticks; Balatro count-ups; Bunt Signature Awards for completing a colour run; Pokemon GO dex silhouettes.

*Apply to Orbit.* On the summary screen, replace "All duplicates, recycle them for points" with a *ledger*: each chip slides into a mini binder row and the relevant set counter ticks up ("Silent Screen 3/24 -> 4/24"), duplicates convert to points with a Balatro-style ticker and chip sound, and if the pack contained the player's new best chip, show "New best in binder" with the chip enlarged. If a set completes, run a dedicated Award ceremony (a Bunt-style award chip).

### P8. Put choice inside the rip

*Evidence.* Gwent keg (4 random + choose 1 of 3, all Rare+); Slay the Spire (pick 1 of 3 or skip); Balatro booster packs (pick 1-2 of 3-5); Pocket Wonder Pick (choose a pack, then draw blind).

*Apply to Orbit.* Make the Premium and Mega cPacks end with a *Pick*: after the random chips, three face-up Rare+ chips fan out and the player takes one; the other two dissolve. This is the most "not a slot machine" move available and adds a real decision to every premium open. Add a daily *Wonder Pick* analogue: pick one of three "Orbiter" packs (seeded NPC pulls, or real friends' pulls via the backup/visit system), then draw one of its chips blind.

### P9. Appointment rhythms beat timers-on-everything

*Evidence.* Pocket's 12-hour pack and Wonder Pick; Runeterra's weekly Vault; Master Duel's 24-hour Secret Pack unlocked *by a good pull*; Pokemon GO Community Day; SNKRS drop calendar and countdown; Top Shot's queue.

*Apply to Orbit.* Orbit already has a daily free cToon and a streak. Add: (a) a weekly "Premiere Night" drop with a countdown on the home tab, a featured character, boosted odds for that character's Spotlight/Holo, and a Prize only available that night; (b) a Master Duel-style *Secret cPack*: pulling a Mythic+ unlocks that character's series pack for 24 hours; (c) a visible pack-points pity you can spend on a specific chip (Pocket), so "one more pack" is grounded in a number the player can see.

### P10. Make the collection a place, not a list

*Evidence.* Pocket binders/display boards/Community Showcase; Top Shot showcases; Cultist Simulator's free-arrangement table; physical 3x3 binder pages; Pokemon GO's silhouette dex.

*Apply to Orbit.* The binder grid is already a Pokedex. Turn it into *pages*: 3x3 or 2x4 pages per character/series with a page-turn gesture, silhouettes for missing chips, and a "spine" that fills as pages complete. Let the cZone be a free-drag table (Cultist Simulator) with a limited number of slots that people arrange and screenshot; add a "Showcase" of three featured chips that appears on the visit screen for others and on a shareable image.

### P11. The result screen is a brand artefact

*Evidence.* SNKRS "Got 'Em"; Pocket shareable pack-opening replays; Snap's split reveal.

*Apply to Orbit.* Produce a share image on any Mythic+ pull or set completion: chip large, mint number, edition, date, and the Cartoon Orbit mark, on the pack's foil texture. Since downloads may be blocked in a PWA context, draw it to a canvas and offer "Save to Photos" via long-press, plus copy-to-clipboard.

### P12. Sound and inertia are half of "expensive"

*Evidence.* Balatro (inertia, magnetic snap, tick sounds), Inscryption ("thuds and snaps"), Gwent premium (looped sound per card), Star Rail (music pitch as a rarity tell).

*Apply to Orbit.* Orbit's `sfx` hooks exist. Design a small kit with a period flavour: nitrate projector clatter for pack rip, a gramophone swell for Legendary, a poker-chip click for common flips and binder placements, and a chip *clink* when two chips touch in the cZone. Give chips a drag inertia and a snap into binder/deck slots.

### P13. Odds, pity and outcome-locking should be visible, not hidden

*Evidence.* Supercell publishes drop rates and locks the outcome at award time; Pocket shows pack points; Hearthstone and MTG Arena show pity/duplicate protection; Genshin's *hidden* soft pity and 50/50 are the part the community reverse-engineers and resents.

*Apply to Orbit.* Keep the printed odds in cMart. Add duplicate protection ("no more than one duplicate per pack until a series is complete"), show the pack-points balance and what it buys, and state that outcomes are fixed at purchase. This is the difference between "addictive" and "predatory" and is entirely compatible with the reveal theatre above.

## 3. A concrete Orbit ceremony spec (pulling the principles together)

1. **cMart.** Pack art per tier with distinct foil (already), plus mint counts and pity/pack-points shown. The Mega pack says "ends with a Pick".
2. **Sealed.** Pack sits on a dark stage; the tear strip has a period label ("TEAR HERE — CARTOON ORBIT — 3 cTOONS"). Drag to rip with projector clatter.
3. **Burst.** White flash in the best pull's *material* colour (brass, chrome, gold) rather than its loot colour. Chip backs fly to a stack. **Backs carry the rim tell** (P1).
4. **Reveal 1..n.** Ordered by rarity. Common: tap, 200 ms flip, click. Rare: ring flash. Mythic: slow flip, rays, shake, light band starts moving with tilt. Legendary: spotlight iris and pulse first, drum, flip, hold with title card, confetti in gold/cream/black (period palette, not rainbow), press-and-hold to enter the portrait full-screen.
5. **Pick (Premium/Mega).** Three Rare+ chips fan; pick one; others dissolve.
6. **Ledger.** Chips slide into binder rows; set counters tick; duplicates count up into points with chip sounds; mint number stamps on each with a press; "New best" or "Set complete" award if applicable.
7. **Share.** One-tap share card for Mythic+.
8. **Aftermath.** If Mythic+ was pulled, the Secret cPack for that series lights up with a 24 h countdown on the home tab.

## 4. Sources

Fetched search snippets (titles as returned):

- Pokemon TCG Pocket: Serebii preview; Pokemon.com "A Guide to Collecting Cards and Using Wonder Picks"; CBR "How to Get Immersive Cards"; ptcgpocket.gg "Rarity Explained: Diamonds, Stars, Crowns"; Dexerto "card rarities explained"; TheGamer/Sportskeeda rarest-cards pieces (0.05% rare pack).
- Marvel Snap: MarvelSnapZone "Infinity Splits"; snap.fan "Infinity Splits and Frame Breaks"; GameRant "Infinity Splits Explained"; Forbes (Paul Tassi) "How Marvel Snap's Infinity Splits Work".
- Hearthstone: HearthPwn "Design Philosophy on Hearthstone's Golden Animations with Hadidjah"; Hearthstone Wiki "Signature card"; HearthPwn "New Signature Cards".
- Supercell: Brawl Stars Wiki "Starr Drops"; brawl.tube Starr Drops guide (outcome locked at award); zleague "Psychology of Brawl Stars' Drops"; Clash Royale Support "Lucky Chests & Boxes"; Supercell blog "ALL ABOUT DROP RATES"; Clash Royale December 2025 update (Lucky Drops replace chest queue).
- HoYoverse: GINX "Honkai Star Rail 4-Star & 5-Star Warp Animation Differences"; Game8 and Sportskeeda pity guides; HostedGG warp guide.
- NBA Top Shot: Support "Pack Drops and the Queue", "Pack Types", "Packs"; Blazer's Edge primer; ClutchPoints encyclopedia.
- Sorare: sorareceo "Card Scarcities Explained"; help.sorare.com Limited card article; WeSorare "Updated Sorare Card Design".
- Topps Bunt: App Store listing; Beckett "The Continued Evolution of Topps BUNT"; MLB Daily Dingers "5 Reasons".
- Panini / physical hobby: QP Market "Sports Card Parallels Explained"; Beckett Prizm parallel guide; SI "Which Panini Prizm Parallels will matter now"; Espionage Protectables "What Are Chase Cards"; Gold Card Auctions "Psychology of Card Collecting"; Delightful TCG condition guide (holo tilt); Samurai Sword Tokyo SAR/AR guides; Neokyo "What Are Full Art Pokemon Cards"; RRD collector study (Business Wire).
- MTG Arena: MTG Wiki "Card frame" and "Showcase"; Draftsim showcase frames; Epicstream Kaldheim styles; Wizards LotR Arena collecting article.
- Master Duel: TV Tropes entry (finishes); Yugipedia "Secret Pack"; TheGamer and PCGamesN Secret Pack guides.
- Runeterra / Gwent: Out of Games "Runeterra's Prismatic Cards"; LoL Wiki "Card style (LoR)"; Gwent Wiki "Card Keg"; playgwent.com "GWENT CARDS — HOW THEY COME TO LIFE"; PC Gamer "It all started with a gif of a cat"; GameAnim "Creating Living Images".
- Balatro: Blake Crosley "Juicy Feedback in a Poker Roguelike"; cccChoice Medium design analysis; Balatro Wiki edition pages.
- Inscryption: Game Developer "How a game jam on sacrifices became Inscryption"; Escapist design discussion; Best Deckbuilders review.
- Slay the Spire: Fandom "Card Rewards"; Spire Builds "Understanding Card Rewards".
- Cultist Simulator: Game Developer "Why the Cultist Simulator devs built their game on a house of cards"; PCGamesN; Geek Culture review.
- SNKRS: Will Chavez "GOT 'EM — SNKRS Generator"; Kicks You Wear newsletter; Nike Instant Got 'Em terms.
- Pokemon GO: Rowan Center "Psychology of the Collectible Craze"; uxdesign.cc "Pokemon Go: addictive by design"; Access-Ability 2026 "Shiny Mythical Quests are Investment Traps".

Items marked **(memory)** in the text are from general knowledge and were not confirmed by a fetched source in this session.

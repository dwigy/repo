# Cartoon Orbit — UX Philosophy

*The design constitution for the app. Every screen, sound and animation is judged against this document.*

## How this was built

We studied the people and products that make software feel expensive, art-first and hard to put down, one by one, and cross-referenced what they share. The full research notes are in `docs/research/`. The groups:

- **Art-first studios:** ustwo (Monument Valley, Assemble with Care), Snowman (Alto's), Simogo (Sayonara Wild Hearts, Device 6), thatgamecompany (Journey, Sky), Playdead (Limbo, Inside), Annapurna's portfolio (Florence, Gorogoa, Neon White), Not Boring Software (Andy Allen), Panic (Playdate), House House, Toca Boca, Sago Mini, Tinybop, Nomada (Gris, Neva), Geometric Interactive (Cocoon), Dinosaur Polo Club (Mini Metro), Sirvo (Threes), Playdots, Joel McDonald (Prune), Square Enix Montreal (Hitman GO, Lara Croft GO), and the Apple Design Award winners 2020–2026 (Balatro, Rooms, NYT Games, Infinity Nikki, Bears Gratitude, Tide Guide).
- **Collectible and pack experiences:** Pokémon TCG Pocket (immersive cards, pack ripping), Marvel Snap (variants, Collector's Vault), Hearthstone (pack tension, golden cards), Genshin Impact (wish ceremony and pity), Clash Royale, NBA Top Shot, physical TCG culture (chase cards, holo tilt, binders).
- **Luxury and industrial design:** Apple and Jony Ive's HIG, Dieter Rams and Braun, Teenage Engineering, Nothing, Leica, Muji (Kenya Hara, Naoto Fukasawa), Hermès and Aesop online, Family wallet (Benji Taylor), Arc, Linear, Things 3.
- **Interaction craft and juice:** Emil Kowalski, Rauno Freiberg, Loren Brichter, Mike Matas, Disney's twelve principles, "Juice it or lose it" (Jonasson and Purho), "The Art of Screenshake" (Vlambeer), Balatro, Nintendo's menu feel, Steve Swink's *Game Feel*.
- **Game UI identity:** Persona 5, NieR: Automata, Splatoon, Destiny, Hitman, Gwent, Hades, Cuphead's 1930s authenticity, and the Frutiger Aero / Y2K revival.
- **Ethical retention:** Nir Eyal's Hook model, variable rewards, Duolingo's streaks and the "earn back" correction, Wordle and NYT Games' daily ritual, Animal Crossing's real-time rituals, Genshin's pity, and the Center for Humane Technology's line between ritual and manipulation.

## What they all share

Cross-referencing these, five things repeat in every entity that people describe as "expensive", "art-first" and "can't stop using":

1. **One object is the hero and everything else steps back.** Monument Valley's rule that every screenshot could hang on a wall. Persona 5 allowing one colour and no sub-colours. Apple's product pages with a single object on white. Leica's red dot on black. Not Boring's giant single element per screen. The chrome exists to frame the art.
2. **Materiality: things have weight, sound and thickness.** Balatro's cards slam and its numbers tick in pitch with the music. Assemble with Care's hand-made foley. Not Boring's "sound is half the experience" and "sound adds materiality". Teenage Engineering's exposed screws. Hitman GO's plastic pieces. Software that feels like an object, not a document.
3. **One perfected gesture.** Prune's swipe-cut, Alto's tap, Pokémon TCG Pocket's rip, Playdate's crank, Tinder's swipe (Brichter's pull-to-refresh before it). Each product owns a physical verb that feels good enough to do for its own sake.
4. **Ceremony scaled to rarity, never lying.** Hearthstone glows the face-down card in its rarity colour but never fakes patterns. Genshin's meteor turns gold. Pokémon TCG Pocket extends the pull into an immersive scene for the top tier. The reveal lengthens as the prize grows, and the build-up is honest.
5. **Ritual over pressure.** NYT Games, Wordle, Animal Crossing, Sky's daily candles, Duolingo's earn-back rather than pay-to-freeze. A small daily thing worth showing up for, with slack for missing a day, and something to show for it.

The opposite of all five is what people call "vibe-coded": three navigation systems on one screen, sentences of explanation, colour everywhere, instant state changes with no weight, toasts as the reward, and streak anxiety as the loop.

## North star

**Cartoon Orbit is a shelf of beautiful chips you can hold, rip, play and show off, inside a clean white spaceship from 2003.** The chips carry every bit of colour and every bit of story. The interface is a bright, quiet, glossy frame that gets out of the way, speaks in short title cards, and rewards you with ceremony sized to what you found. It should feel like a made object from a small studio, not a template.

## The ten tenets

### 1. The chip is the hero
The largest, most saturated thing on any screen is a chip. Copy is subordinate to it, and there is at most one call to action beside it.
- Home leads with one chip at 220 px or more on a living background, one line of copy, one action.
- Chrome uses only white, silver, navy and one blue. Rarity colours appear only on and around chips.
- Never place two competing navigation systems on the same screen. One sub-nav (the angled Orbit folder tabs) plus the bottom bar is the maximum.

### 2. Materiality: weight, gloss and sound
Every chip behaves like a lacquered coin: it has thickness, a specular highlight that moves, a landing sound and a shadow that lengthens when it is in the air.
- Chips lift (scale 1.08, shadow 0 14px 12px) when picked, land with a 0.55 s overshoot and a shockwave ring, and thunk.
- Sockets are recesses. Packs are foil with a crimp and a tear line. Buttons are glass with a top highlight and a 3 px bottom edge.
- Sound accompanies every physical event (tear, burst, flip, clink, thunk, tick) and is paired with a visual pulse, because iOS Safari has no haptics.

### 3. One perfected gesture: the rip
The pack rip is Orbit's signature verb. Every session should include one. It must feel better than tapping a button.
- Real drag with the strip following the finger, a tear line that grows, resistance (0.6× travel), and a sliver of the top chip showing before release.
- Threshold 70% of the pack width; release below it springs back; release above it bursts.
- A tap fallback exists (RIP IT) but is visually secondary.

### 4. Honest ceremony, scaled to rarity
Reveal length, sound, light and motion grow with rarity. The face-down chip may hint its tier (a coloured pulse) but never fakes it.

| Tier | Colour | Hint before flip | Flip | After flip |
| --- | --- | --- | --- | --- |
| Common | grey #8f98a8 | none | 220 ms | soft rays 25%, single tick |
| Uncommon | green #2fbf5a | none | 220 ms | rays 45%, two-note chime |
| Rare | electric blue #1e8fff | none | 320 ms | rays 60%, three-note chime |
| Mythic | purple #9b4dff | purple pulse | 380 ms + shake | rays 80%, four-note, 18 confetti |
| Legendary | gold #f5a623 | gold pulse + 0.9 s shimmer + drum | 520 ms + shake | rays 100%, six-note fanfare, 46 confetti, dashed gold ring |

Cards are always revealed least rare to most rare so the session ends on its high note.

### 5. Subtract until it is quiet
Copy is title cards, not paragraphs. If a sentence explains a feature, the feature should explain itself instead.
- Labels: uppercase condensed italic, 2–4 words. No sentence longer than 12 words outside Help.
- Delete anything that does not change what the player does next.
- Empty states are a single chip silhouette and one line.

### 6. Colour is progress
Owned chips are colour; unowned chips are ink. Completing a set floods its page with colour and ends in a poster-sized payoff. The binder is a showcase first, a database second.

### 7. Numbers become moments
A score never just changes. It counts up with ticks, the digits scale on the beat, deltas pop in after the land, and the final tally at the end of a match is a sequence, not a jump.
- Count-ups take 550 ms with an ease-out cubic; ticks rise in pitch with the value.
- Match end: each socket adds to the total in turn (120 ms apart), then colour bonuses, then the winner.

### 8. Characters have voices
Every star gets a line when played, a reaction when a power lands, and an idle habit in the cZone. Small enough to overlook, like Threes' faces. Silent-film slapstick is the register.

### 9. Ritual, not pressure
One daily ritual: claim, rip, play. Three visible goals at a time. Streaks are drawn as a physical row of seven orbs, never as a countdown, and missing a day dims one orb instead of resetting everything. Nothing is ever sold to relieve anxiety.

### 10. Made, not generated
Bespoke details everywhere a template would have a default: a wordmark with its own O, angled folder tabs, sunburst sockets, hand-drawn portraits with an artist byline, a per-set typographic identity, a sound kit designed for this app. Consistency in the small things is what reads as expensive.

## The design system

### Type
- Display: Michroma (wide, Eurostile-like). Wordmark, Game Zone title, section tabs only. 10–14 px, letter-spacing 0.1em. Never body text.
- UI: Barlow Condensed 800 italic uppercase for titles (30 px), buttons (15 px), labels (11–13 px). Barlow Condensed 600 for body (17 px, line-height 1.3).
- Scale: 11 / 13 / 15 / 17 / 20 / 30 / 38 px. Nothing between.

### Space
- Base 4 px. Panel padding 16. Section gap 16. Grid gap 14 × 10. Content gutter 14. Bottom nav 64.
- Rule: if two blocks touch, add 8.

### Colour roles
- Ground: #dfe6ee to #cfd9e4 with a white bloom at the top.
- Surface: white panels with a 40% white gloss over the top 40% and a 1 px #c8d4e1 line.
- Ink: #14356d navy for all text; #5d6f88 for secondary.
- Action: one blue (#2f7ff5 → #1a56c4 glass). Everything else is grey glass.
- Chips carry every other colour. Rarity ladder: grey, green, electric blue, purple, gold, with Full Silver, Full Gold, Full Platinum and Dark Matter as material variants at Mythic and Legendary.

### Motion
- Micro (hover, press): 120 ms, ease-out.
- State change (tab, list): 200 ms, cubic-bezier(.2,.8,.2,1).
- Object motion (chip flight): 700–750 ms, cubic-bezier(.35,.6,.3,1), two rotations, lifted arc.
- Landing: 550 ms overshoot cubic-bezier(.2,1.5,.4,1).
- Count-ups: 550 ms ease-out cubic.
- Shake: only for Mythic+ reveals and power hits, 360 ms, ±6 px.
- Stagger: 70–90 ms between siblings.
- Never linear. Never longer than 300 ms for anything that is not a chip or a ceremony.

### Sound and haptic map
Sound is synthesized in-app (WebAudio), paired with a visual pulse on iOS.

| Event | Sound | Visual pulse |
| --- | --- | --- |
| Tap | 520 Hz square, 50 ms | none |
| Pick chip | 220 Hz triangle blip | lift |
| Chip flight | rising whoosh 300 → 900 Hz | motion blur shadow |
| Chip lands | 120 Hz square + 60 Hz saw thunk | shockwave ring |
| Power hit up / down | triangle chime / saw buzz | glow / shake |
| Score tick | short sine, pitch rises with value | digit scale 1.35 |
| Foil grab / tear | low triangle / filtered saw rasps | strip follows finger |
| Burst | 90 Hz saw + 700 + 1100 Hz triangles | white flash, 28 sparks |
| Flip | 600 Hz square, 60 ms | 3D flip |
| Reveal by tier | 1 to 6 note arpeggios | rays + confetti |
| Win / loss | major fanfare / low saw | poster card |

### Copy voice
Short, confident, warm, slightly old-Hollywood. Title cards. "Your pulls." "Set complete." "Rookie Rex is waiting." Never "Click here to", never exclamation marks in a row, never explaining the obvious.

## Rituals
- **Daily:** claim the bonus, take the free chip, play one battle. One card on Home shows all three with three checkmarks.
- **Weekly:** a seeded challenge deck every player faces on the same day, with a lineup card to share.
- **Set completion:** a full-screen poster with the eight editions, the character's name in the largest type in the app, and a permanent gold ring on the set in the binder.
- **Showcase:** the cZone is a room you arrange; the front page features one chip you choose.

## Never
- No fake scarcity, no timers to pay through, no streak anxiety, no "last chance".
- No colour in chrome except one blue.
- No paragraph explaining a mechanic; the mechanic demonstrates itself.
- No instant state changes for anything physical.
- No third-party branding, fonts or artwork.
- No emoji in the UI.

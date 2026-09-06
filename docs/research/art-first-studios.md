# Art-First App and Game Studios: What They Do, and What Cartoon Orbit Should Steal

Research brief for the Cartoon Orbit redesign (fan-made PWA, iPhone Safari, plain HTML/CSS/ES modules). Goal per the owner: chip-art focused, game focused, expensive and luxurious feeling, bespoke rather than "vibe-coded", addictive, and still unmistakably Cartoon Orbit 2003.

Method: one web search pass per entity (page fetches mostly blocked, so search snippets plus prior knowledge), cross-referenced against the current Orbit screenshots (`shots/02-home`, `04-binder`, `05-detail`, `06e-pack-flip1`, `09-match`, `sheet.png`). Where a claim comes from memory rather than a search result it is marked **(memory)**.

## What the current Orbit screens tell us (baseline)

- **Home** is three stacked navigation systems (COLLECT/COMPETE/ORBIT/cZONE pill tabs, HOME/QUESTS/UPDATES folder tabs, and a five-item bottom bar) plus a "Now in Orbit" text panel stack. The only chip on the screen is a 150 px Flip the Frog at the bottom. The art is not the hero; the chrome is.
- **Binder** shows ownership with "???" silhouettes in a 2-up grid with an edition dot strip. Good bones: the silhouette-until-owned idea already carries a "reveal" promise.
- **Detail** is a white modal with the chip at ~300 px, tag pills, a value row, flavor line, and four grey buttons. The chip does not react to touch.
- **Pack flip** (blue starburst, single centered chip, rarity pill, name) is the strongest screen in the app. It is the one moment the product is art-first.
- **Match** is a dense 7-socket board with numeric badges and small "+2 / -2" bubbles. Scoring changes are instantaneous numbers, with no build-up.
- **Sheet** shows eight editions per character (Classic, Reel, Spotlight, Holo, Silver, Dark Matter, Gold, Platinum). The metal editions are visually the most "expensive"; the Classic ring is the least distinct.

Keep this in mind while reading the studios: most of the transferable lessons are about *subtraction* (chrome, text, tiers) and *addition of feel* (sound, motion, reaction), not about more features.

---

## Entity-by-entity

### 1. ustwo games (Monument Valley 1/2/3, Assemble with Care; Ken Wong, David Fernández Huerta)

- **What it is.** A UX studio's game arm. Monument Valley started as a way for ustwo to showcase its UI/UX work; the studio later became the first B-Corp game studio and shipped Monument Valley 3 with Netflix.
- **Unique.** The founding rule was that "every screen of the game would be a work of art in itself", so that "every screenshot could be printed out and hung on a wall" (Ken Wong, GDC Europe 2014 "Less Game, More Experience"; Wallpaper* retrospective). Wong said they discarded "70, 80, 90 percent" of their work to get the spare look.
- **User-friendly.** They "rethought games as user experiences and traded challenging puzzles for an aesthetic journey", keeping it short. One-finger input, no fail state, no HUD.
- **Art-first.** Escher-derived impossible architecture is both the art and the mechanic; David Fernández Huerta (art director on MV1/2) talked about levels as posters with one dominant hue each (GDC "The Art of Monument Valley 2"). Assemble with Care carries the same "hide complexity under simplicity" approach into tactile object repair, and even the foley (glue-bottle squelch = stirring carbonara) was hand-made.
- **Addictive/compelling.** Chapter-sized sessions, a constant "what does the next screen look like" pull, and a strong sense of ownership of each beautiful moment.
- **Apply to Orbit.** Adopt the wallpaper test: any screen you cannot screenshot and hang is not done. Today only the pack-flip screen passes. Cut two of the three navigation tiers on Home; let a single large chip own the screen with the copy subordinate to it.

### 2. Snowman (Alto's Adventure, Alto's Odyssey, Where Cards Fall; Ryan Cash, Harry Nesbitt)

- **What it is.** Toronto studio; Alto's Adventure (2015), Alto's Odyssey (2018, Apple Design Award 2018), and publisher/partner on Where Cards Fall (ADA 2020).
- **Unique.** A one-touch endless snowboarder whose identity is atmosphere: procedural weather, day-night cycle, parallax layers, silhouetted characters. Cash said Nesbitt's art style "may have been half the reason we got into talking about a snowboarding game in the first place" (Android Authority interview). Where Cards Fall builds houses of cards as the core verb and has "a lot of empty space for reflection" (Apple Behind the Design).
- **User-friendly.** One input (tap to jump, hold to backflip). Zen Mode removes score entirely. The team studied Tony Hawk on PS2 to make the trick feel right; refinement, not features.
- **Art-first.** "We knew we wanted to make something calm and serene" (Cash); music, palette and silhouettes were designed together. The Odyssey press kit leads with the sky gradients.
- **Addictive/compelling.** Goal ladders (three small goals at a time) plus the sensory pull of watching the sky change. Sessions are short and restart is instant.
- **Apply to Orbit.** Give Orbit a living background: a slow sky/space gradient that shifts by time of day behind the chip area (cheap in CSS). Expose three visible goals at a time instead of a Quests tab. Add a "Zen" binder mode with no counts or numbers, just art.

### 3. Simogo (Year Walk, Device 6, Sayonara Wild Hearts, Lorelei and the Laser Eyes; Simon Flesser, Magnus "Gordon" Gardebäck)

- **What it is.** Two-person Swedish studio that reinvents its form every game.
- **Unique.** Each game has a conceit that is also its identity: Device 6 is a typographic spy novel whose text is the map (inspired by Tschichold, Oliver Byrne's Euclid, Sam Suliman covers, per Simogo's "Making of Device 6: Art"); Year Walk shipped with a companion app whose story "spills into the real world"; Sayonara Wild Hearts is "a pop album brought to life" with tarot arcana as the visual system because they "come with a lot of free visual ideas" (Flesser).
- **User-friendly.** Their rule: controls that "you could put into the hands of a person who has never played a game before"; contextual inputs, minimum buttons, "while still providing something that felt as spectacular as a grand 3D game" (Game Developer).
- **Art-first.** Typography, palette and music are decided before mechanics. Sayonara Wild Hearts won ADA 2020.
- **Addictive/compelling.** Score-attack replay with ranks, and the album structure (short "tracks") that makes "one more song" natural.
- **Apply to Orbit.** Give the catalog a conceit: each set is an "album" or "reel" with its own typographic treatment and palette (the Reel 1919 / Reel 1930 editions already hint at this). Treat the cToon name lockup as a bespoke typographic object, not a default bold sans in a pill.

### 4. thatgamecompany (Journey, Sky: Children of the Light; Jenova Chen)

- **What it is.** Studio founded to "expand the range of emotional experiences possible in video games"; Sky (2019, ADA 2020) is a 50M-install social game.
- **Unique.** Emotions other than excitement (awe, loneliness, generosity). In Sky, Hearts (the cosmetic currency) can only be obtained through gifts between players, so "every player is, by definition, needed by others" (MCV/Develop, Forbes).
- **User-friendly.** No text chat by default; expression is gesture, light, and holding hands. Launched mobile-first on purpose.
- **Art-first.** Cloth, light and sand simulation are the game; the Apple Behind the Design piece is almost entirely about the visual language.
- **Addictive/compelling.** Daily candle collection, seasonal spirits and cosmetics, and social obligation to friends. Chen: "I wanted our IAPs to feel like taking your family to Disneyland or buying a present for a friend."
- **Apply to Orbit.** Orbit already has "Gift to a friend" as a grey button. Make gifting the social engine: a gifted chip carries the giver's name in its provenance, and some editions (e.g. a "Gifted" foil) can only be received, never bought. Replace "Featured code accepted! +150 points" toasts with something that feels like receiving a present.

### 5. Playdead (Limbo, Inside; Arnt Jensen)

- **What it is.** Copenhagen studio; each game took six years.
- **Unique.** Silent narrative. Jensen "famously insisted on the removal of all text and dialogue" and chose a "minimalist silent film era style" over high-poly models. No HUD, no tutorial, no menu inside play.
- **User-friendly.** Two verbs (jump, grab). The environment teaches through death; checkpoints are frequent so failure costs seconds.
- **Art-first.** Monochrome/desaturated palettes, film grain, cinematic 2D framing. Sound: minimal music in Limbo; for Inside, Martin Stig Andersen ran audio through a human skull to get bone-conduction texture (Wikipedia/interviews).
- **Addictive/compelling.** Curiosity and dread; every screen poses a question.
- **Apply to Orbit.** Orbit's subject matter is literally silent-era cartoons. Lean into it: the match intro and result screens can be title cards (black card, white serif, iris wipe) instead of blue gradient panels. Remove the explanatory sentences ("Log in every day to keep your streak. Day 0 streak...") and let the first pack teach.

### 6. Annapurna Interactive portfolio (Florence, Gorogoa, Neon White)

- **Florence (Mountains, Ken Wong).** "A collection of mini-games" where "every chapter has custom gameplay around trying to evoke the emotions of the different stages of a relationship" (Female mag, It's Nice That). A 30-minute interactive comic; input is the metaphor (fitting speech-bubble puzzle pieces gets easier as the couple gets comfortable).
- **Gorogoa (Jason Roberts).** Seven years of hand-drawn illustration; "any given scene is not a single drawing, but many layers of separate drawings" (Hyperallergic). Four tiles you drag and stack; the art *is* the puzzle.
- **Neon White (Angel Matrix, Ben Esposito).** Cards are guns, discarding a card is a movement ability; levels finish in nine seconds; global leaderboards and a par-time medal system create "one more run". Esposito designed from watching speedrun videos (Game Informer, Engadget).
- **Common thread.** A single strong conceit executed to the end, with a signature visual identity per game.
- **Apply to Orbit.** From Florence: make the interaction the metaphor (peeling a pack should feel like foil; sliding a chip into a socket should feel like a coin into a slot). From Gorogoa: chips built from layered SVG groups (background plate, character, gloss, ring) that can parallax on tilt or drag. From Neon White: an instant "Rematch" with a par score and a tiny leaderboard beats the current "Quit / Deck 4" footer.

### 7. Not Boring Software (Andy Allen: Weather, Habits, Timer, Calculator, Vibes)

- **What it is.** Two-person studio making "eye-popping aesthetics, zingy haptics, spiffy 3D animations" versions of utility apps (Apple Behind the Design: Habits). (Not Boring) Habits won ADA 2022 Delight and Fun and was a Visuals and Graphics finalist **(memory for the win; finalist status from search)**.
- **Unique.** Allen's strategic argument: "big teams will always have more features than we do... But design is difficult to copy." A patron plan with no extra features outsold expectations (RevenueCat), proving that people pay for feel.
- **User-friendly.** One screen per app, giant type, themes as the product.
- **Art-first.** Themes are collectible skins; the sound essay "The Sound of Software" (with composer Thomas Williams) argues "sound is half the experience", that "sound and haptics are close cousins and should almost always be paired", and that sound "adds a sense of materiality" (like macOS's paper-crumple trash).
- **Addictive/compelling.** The apps are fidget toys; streaks in Habits are rendered as physical objects.
- **Apply to Orbit.** Orbit has zero sound. Add a tiny Web Audio kit: foil tear, chip clink, socket thunk, score tick, rarity chime per tier. iOS Safari has no `navigator.vibrate`, so pair sound with visual "haptics" (2-frame scale pulse, subtle screen nudge). Also: themes and chip finishes are the premium product, not more features.

### 8. Panic (Playdate; publisher of Untitled Goose Game and Firewatch) and House House

- **Playdate.** A 1-bit yellow handheld with a crank. Cabel Sasser wanted "something that felt fun and cute and cool, and did not take itself too seriously"; the Game Studies paper calls it "purpose-built for happiness" and notes Panic references 80s/90s product design and software publishing (season-based delivery of games, physical packaging feel).
- **Untitled Goose Game (House House).** A to-do list of mischief, slapstick "like the physical comedy you might see in silent films" (Nico Disseldorp), no score, no fail state. Concept came from a group chat joke; influences from Buster Keaton to Postman Pat.
- **Unique / user-friendly / art-first.** A physical signature (the crank), a limited palette used as a feature, and comedy timing as the design material.
- **Addictive/compelling.** The to-do list with strikethroughs is the whole loop; players finish the list to see what secret list appears next.
- **Apply to Orbit.** Quests should be a hand-written to-do list you strike through with a satisfying line and a honk-equivalent sound, not a tab of cards. Invent one signature physical gesture for Orbit (the rip-tab is the candidate: make it a real drag with resistance and tearing audio). Silent-film slapstick is also the correct comedic register for 1920s cartoon stars.

### 9. Toca Boca and Sago Mini

- **What they are.** Swedish and Canadian studios making "digital toys" for kids; Toca Boca World is one of the most-played kids apps in the world.
- **Unique.** "No rules, no levels, no winning or losing. Just... play." Toca researched wooden blocks and dolls to replicate open-ended play. Sago Mini characters cry and get angry so kids learn actions have consequences.
- **User-friendly.** Everything is draggable, everything reacts, nothing is locked behind reading. Zero text UI.
- **Art-first.** Flat, saturated, characterful illustration; the illustration style is the brand.
- **Addictive/compelling.** Endless recombination (dress-up, room decorating) and a slow drip of new locations/packs; kids return because there is always something new to arrange.
- **Apply to Orbit.** The cZone (currently a static grid of chips) should be a dollhouse: a drag-to-arrange room where chips can be placed, stacked, and posed, with every chip reacting to a tap (blink, bounce, hat tip). "Nothing to win, only things to do" is a good design brief for the cZone specifically, while the arena stays competitive.

### 10. Tinybop (The Human Body, Robot Factory, Homes; Raul Gutierrez)

- **What it is.** Brooklyn studio making explorable "toys" with named guest illustrators (Kelli Anderson for The Human Body).
- **Unique.** "Games have distinct goals or rules... There is nothing to win, only things to do" (Gutierrez, Technical.ly). Every app is a collaboration with a distinct illustrator; the Robot Factory lets kids build and then physically test their creation.
- **User-friendly.** "Show rather than tell"; learning is embedded in interactions.
- **Art-first.** The illustrator is credited as a co-author; each app is a different visual voice.
- **Addictive/compelling.** Poke-everything density: every object hides a reaction.
- **Apply to Orbit.** In the detail view, make the chip pokeable: drag to tilt with a moving gloss highlight, tap for a per-character reaction, long-press to flip and see the "back" (provenance, mint number, previous owners). Credit the artist per set as a feature, the way Tinybop credits illustrators; the "Artwork: drawn portrait..." fine print should become a proud artist byline.

### 11. Nomada Studio (Gris, Neva; Conrad Roset)

- **What it is.** Barcelona studio founded around a fine-art illustrator, not a game artist. Neva was a 2025 ADA Visuals and Graphics finalist.
- **Unique.** Roset "developed the idea of a minimalist and monochrome world that the player would progressively colorize", so color is the progression system. No death, no game over, no text.
- **User-friendly.** Failure is impossible; the pace is set by the player.
- **Art-first.** Watercolor, ink, and a published artbook; Roset says he wants to "bring fresh air into the industry through an artistic approach."
- **Addictive/compelling.** The desire to see the world gain its next color; each chapter ends with a color reward.
- **Apply to Orbit.** The binder's "???" silhouettes are the seed. Go further: an unowned set page is rendered in monochrome ink, and each owned chip restores a splash of color to the page. Completing a set (0 sets today) should visibly "colorize" the whole set page and the set tab. Color-as-progress is a stronger reward than "13/126".

### 12. Geometric Interactive (Cocoon; Jeppe Carlsen, Erwin Kho, Jakob Schmid)

- **What it is.** Ex-Playdead lead gameplay designer's studio; Cocoon (2023) won Golden Joystick Breakthrough and Best Debut at The Game Awards **(memory for TGA)**.
- **Unique.** Worlds nested inside orbs you carry on your back; one button does everything. "The premise of worlds within worlds is simply much more fascinating when the worlds feel real in contrast to simple abstract labyrinths" (Carlsen).
- **User-friendly.** Carlsen: "I never compromise on playability." No text, no tutorial; puzzles teach themselves and the game never lets you get stuck for long.
- **Art-first.** Erwin Kho's biomechanical art direction with vertex-painted surfaces; the orb is both an object and a UI.
- **Addictive/compelling.** Escalating "wait, can I...?" moments; 6.5 years of development spent on making each realization land.
- **Apply to Orbit.** The Orbit *orb* is the brand mark. Use it as Cocoon uses orbs: the pack is a sealed orb you carry to the rip screen, a set is a larger orb containing its chips, the cZone is your orb. One object that is logo, container, and interaction gives the app a bespoke spine instead of generic panels.

### 13. Dinosaur Polo Club (Mini Metro, Mini Motorways; Peter and Robert Curry)

- **What it is.** New Zealand brothers; Mini Metro began as a Ludum Dare 2013 "minimalism" jam entry and was inspired by planning trips on the London Tube map.
- **Unique.** The game is drawn in the language of transit maps (Beck-style 45-degree lines); the level select is a matrix of colored dots inspired by the New York Subway Guide cover. Disasterpeace's audio is generative and driven by the game state.
- **User-friendly.** Draw a line between stations; that is the whole input.
- **Art-first.** Information design *is* the art. Every city has a palette derived from its real map.
- **Addictive/compelling.** Daily challenge with a leaderboard, and the slow-build tension of a system about to fail.
- **Apply to Orbit.** Orbit's stats (value, gToon score, color, rarity) are currently label-number pairs in pills. Redesign them as one consistent diagrammatic language, like a chip's "spec sheet" on a transit-map grid. Add a daily seeded challenge (same AI deck for everyone that day) with a small leaderboard.

### 14. Sirvo (Threes; Asher Vollmer, Greg Wohlwend, Jimmy Hinson)

- **What it is.** The sliding-number puzzle that 2048 cloned; the team published a 45,000-word design log of the 14-month process.
- **Unique.** Every number is a character with a name, a face and a voice: "6 is Thumbert... too big to fit in the jungle gym", 96 growls, 192 is a DJ. Tiles greet each other, get excited near matches, and yawn when you idle (Vice, Wikipedia). Wohlwend "was super set on putting as much personality as possible" while Vollmer "took the bad guy role, trying to take the personality out so you could understand the board"; they settled on faces "just small enough that they could almost be overlooked."
- **User-friendly.** Swipe in four directions; the board is always readable.
- **Art-first.** Tile faces, a pastel palette, and a soundtrack with tile voices recorded by indie devs.
- **Addictive/compelling.** Unlocking the next character is a collect-the-set loop layered on a score chase.
- **Apply to Orbit.** Orbit's chips already have one flavor line ("The first cartoon superstar. Keeps on walking."). Give each character a *voice* that surfaces in play: a quip when placed in a socket, a reaction when a power triggers, a yawn on idle in the cZone. Keep it Threes-small so the board stays legible.

### 15. Playdots (Dots, Two Dots, Dots & Co; Paul Murphy, Patrick Moberg)

- **What it is.** NYC studio whose founding aesthetic came from Moberg's trip to Yayoi Kusama's hometown (The Next Web).
- **Unique.** A minimalist connect-the-dots puzzle wrapped in a hand-illustrated travelogue; thousands of levels each with themed art and animations. Murphy let the team "get creative with concepts without qualitative scrutiny before considering how the title could potentially make money" (PocketGamer.biz).
- **User-friendly.** Connect dots with a finger; the game explains itself by doing.
- **Art-first.** An in-house team of "illustrators, musicians, animators"; level art and seasonal events are the content treadmill.
- **Addictive/compelling.** Level maps, limited moves, and event cadence; the pleasure of squares completing with a satisfying "pop".
- **Apply to Orbit.** Package content drops as illustrated "expeditions" (a new set with its own map/poster) rather than catalog additions. The moment of a set completing should have a full-screen art payoff, like Two Dots' square-clear animation.

### 16. Joel McDonald (Prune)

- **What it is.** A solo "digital bonsai" game; Apple's iPad Game of the Year 2015 and TIME's Game of the Year 2015.
- **Unique.** One gesture (swipe to cut a branch) and one metaphor ("cultivating what matters... remove that which does not matter in favor of that which does"). The tree animation is the reward.
- **User-friendly.** No text, no timer, no scores beyond flowers bloomed.
- **Art-first.** Black silhouettes on gradient skies; the McDonald postmortem (Game Developer) notes the whole game was designed around how good the swipe cut felt.
- **Addictive/compelling.** Watching growth respond to your cut; short levels; a quiet "one more".
- **Apply to Orbit.** Find Orbit's swipe-cut: the pack rip. Right now it is a "RIP HERE" label; it should be a real drag that tears with a curl and reveals a sliver of the top chip. If one gesture is that good, the whole product feels handmade.

### 17. Square Enix Montreal (Hitman GO, Lara Croft GO; Daniel Lutz)

- **What it is.** A AAA publisher's mobile studio that turned action franchises into turn-based board games.
- **Unique.** The brief was to "remake how you felt playing a classic game, not the game itself" (Game Developer). Hitman GO is literally a board game with plastic-looking pieces; Lara Croft GO explored museum dioramas and pop-up books before landing on blocky ruins with foreground silhouettes and blurred backgrounds.
- **User-friendly.** Swipe to move one node; short sessions by design.
- **Art-first.** Every level is a diorama you can rotate in your mind; the "elegant board game" frame guided every decision.
- **Addictive/compelling.** Hidden collectibles (vases) in every level, costume unlocks, and a very clear "just one more level" size.
- **Apply to Orbit.** This is the template for the 2003 revival: recreate how Cartoon Orbit *felt* (chips as physical objects, the thrill of a rare, the cZone as a room you decorate), not its literal HTML tables. Render the gToons board as a diorama: a tabletop with perspective, real chip thickness, socket recesses, and a shadow when a chip lands.

### 18. Apple Design Award winners, Delight & Fun and Visuals & Graphics, 2020–2026

Winners (searched unless marked):

- **2020** (no categories yet): Sayonara Wild Hearts, Sky, Song of Bloom, Where Cards Fall; apps Darkroom, Looom, Shapr3D, StaffPad.
- **2021**: Delight & Fun: Pok Pok Playroom (app), Little Orpheus (game) **(memory)**. Visuals & Graphics: Loóna (app), Genshin Impact (game) **(memory)**.
- **2022**: Delight & Fun: (Not Boring) Habits (app), Overboard! (game) **(memory)**. Visuals & Graphics: Halide Mark II (app; confirmed), finalists Alien: Isolation, Behind the Frame, MD Clock, (Not Boring) Habits.
- **2023**: Delight & Fun: Duolingo (app) **(memory)**, Afterplace (game; confirmed). Visuals & Graphics: Any Distance (app; confirmed), Resident Evil Village (game) **(memory)**.
- **2024**: Delight & Fun: Bears Gratitude (app), NYT Games (game). Visuals & Graphics: Rooms (app), Lies of P (game); finalists Death Stranding DC, Honkai: Star Rail.
- **2025**: Delight & Fun: CapWords (app), Balatro (game). Visuals & Graphics: Feather: Draw in 3D (app), Infinity Nikki (game); finalists include Neva, Control.
- **2026**: Delight & Fun: grug (app), Is This Seat Taken? (game). Visuals & Graphics: Tide Guide (app), Cyberpunk 2077: Ultimate Edition (game).

What the jury keeps rewarding:

- **Rooms** (2024): tiny isometric voxel rooms you decorate and visit, with a strong nostalgic pixel-craft look. Directly relevant to the cZone.
- **Bears Gratitude** (2024): one warm illustration a day, a single action, and a journal that fills up; the illustration is the reward.
- **NYT Games** (2024): daily ritual, streaks, and a shareable result card. Retention through ritual rather than pressure.
- **Balatro** (2025): the best contemporary reference for "juice" in a card game. Cards slam with screen shake, "numbers count up with satisfying tick sounds", multipliers catch fire, and "the frequency of the jumping numbers synchronizes with the pitch of the background audio" (Medium design analysis; Blake Crosley's guide). Presentation "turns a number into a moment."
- **Infinity Nikki** (2025): collecting and dressing; cosmetics as the endgame, presented in a beautiful world.
- **Afterplace** (2023) and **Is This Seat Taken?** (2026): small, charming, hand-made pixel and shape art with humor.
- **Tide Guide** (2026) and **Any Distance** (2023): data rendered as art; a tide chart or a run becomes a poster.

**Apply to Orbit.** Balatro is the closest analog to the gToons match. Score changes should count up with ticks, powers should stack with visible multipliers and an escalating sound, and a winning move should shake the board slightly. From NYT Games: one daily ritual (free chip + daily challenge) with a shareable result card of your chip lineup. From Rooms: the cZone as a decorated room. From Tide Guide/Any Distance: the result screen as a poster you would keep.

---

## Transferable principles (with evidence and Orbit application)

1. **Wallpaper test: every screen is a poster.** Evidence: ustwo's founding rule ("every screenshot could be printed and hung"), Alto's sky gradients, Monument Valley 2's one-hue-per-level. Orbit: Home currently fails (three nav tiers, four text panels). Rebuild Home as a full-bleed featured chip on a living gradient with one line of copy and one action.

2. **Subtract chrome until the art is the interface.** Evidence: Wong discarded 70–90% of work; Playdead removed all text; Cocoon has one button; Prune has one swipe. Orbit: collapse COLLECT/COMPETE/ORBIT/cZONE tabs, HOME/QUESTS/UPDATES tabs and the five-item bottom bar into a single bottom bar; remove sentence-length explanations; let the pack teach.

3. **Sound plus visual haptics make things feel expensive.** Evidence: Andy Allen's "The Sound of Software" ("sound is half the experience"; sound "adds materiality"; pair sound with haptics); Balatro's tick-and-pitch sync; Assemble with Care's hand-made foley. Orbit: add a Web Audio kit (tear, clink, thunk, tick, rarity chimes) and 2-frame scale/nudge pulses; iOS Safari lacks vibrate so the visual pulse stands in.

4. **Objects, not panels: physical metaphors everywhere.** Evidence: Lara Croft GO's "elegant board game" dioramas; Hitman GO's plastic pieces; Where Cards Fall's houses of cards; Playdate's crank. Orbit: chips with thickness and drop shadows, sockets as recesses, packs with foil and a tearable tab, the match board as a perspective tabletop.

5. **One signature gesture, perfected.** Evidence: Prune's swipe-cut, Alto's one-tap, Sayonara's contextual single input, Playdate's crank. Orbit: the pack rip. Make it a real drag with resistance, a curl, and a sliver of the top chip showing.

6. **Color and reveal as progression.** Evidence: Gris colorizes the world as you progress; Two Dots' square-clear payoff; Orbit's own "???" silhouettes. Orbit: unowned set pages in monochrome ink; each owned chip restores color; completing a set floods the page with color and a poster-sized payoff.

7. **Characters have voices.** Evidence: Threes' named, talking numbers kept "just small enough that they could almost be overlooked"; Sago Mini characters with feelings; Goose Game's slapstick. Orbit: per-character quips on placement, reactions on power triggers, idle yawns in the cZone; silent-film slapstick as the humor register.

8. **Juice the numbers.** Evidence: Balatro (count-up ticks, fire multipliers, screen shake, audio-pitch sync; "turn a number into a moment"). Orbit: the match's instantaneous "+2 / -2" badges and score field should count up with ticks, stack multipliers visibly, and end with a landed-chip thunk.

9. **A toy inside the game.** Evidence: Toca Boca's "no rules, no winning, just play"; Tinybop's "nothing to win, only things to do"; Rooms (ADA 2024). Orbit: the cZone becomes a drag-to-arrange room with reacting chips; the detail view becomes a pokeable, tiltable chip with a flip-to-back.

10. **Ritual beats pressure for retention.** Evidence: NYT Games (daily, streak, share card), Bears Gratitude (one illustration a day), Mini Metro daily challenge, Sky's daily candles. Orbit: one daily seeded challenge plus the free chip, a shareable lineup card, and a streak rendered as a physical object rather than "Day 0 streak" text.

11. **Generosity as the social loop.** Evidence: Sky's Hearts only come from gifts; Chen's "buying a present for a friend" IAP philosophy. Orbit: make gifting a first-class flow with provenance on the chip and a gift-only edition.

12. **Content as albums/expeditions with their own identity.** Evidence: Simogo's pop-album and tarot systems; Two Dots' illustrated worlds; Tinybop's per-app illustrators. Orbit: each set gets a typographic and palette identity and a credited artist; new sets ship as illustrated drops.

13. **Remake the feeling, not the artifact.** Evidence: Square Enix Montreal's GO brief; Panic's 80s/90s product references for Playdate. Orbit: keep the 2003 vocabulary (cToons, gToons, cZone, cMart, the orb mark, the folder tabs as a motif) but rebuild the feel around physical chips rather than HTML-table nostalgia.

14. **Design is the moat; feel is the product people pay for.** Evidence: Allen's "design is difficult to copy" and the no-extra-features patron plan that outsold expectations; Threes' 14-month log vs. clones. Orbit: invest sprint time in the rip, the flip, the land, and the score count before any new screens.

---

## Suggested priority for Orbit (highest leverage first)

1. Pack rip gesture + sound kit (principles 3, 5).
2. Match juice: count-ups, multiplier stacking, chip thunk, diorama board (4, 8).
3. Home rebuild: one chip, one gradient, one action; collapse nav tiers (1, 2).
4. Binder colorization and set-complete payoff (6).
5. Character voices in play and pokeable detail view (7, 9).
6. Daily ritual and shareable lineup card (10).
7. Gifting with provenance (11).
8. Per-set typographic identity and artist credits (12).

## Sources

- https://gdcvault.com/play/1020878/Designing-Monument-Valley-Less-Game
- https://www.wallpaper.com/tech/monument-valley-at-10-the-story-of-the-most-meticulous-puzzle-game-ever-created
- https://www.killscreen.com/monument-valley-elegance/
- https://www.gamedeveloper.com/design/designing-the-surprise-mobile-game-hit-i-monument-valley-i-
- https://www.gdcvault.com/play/1025003/The-Art-of-Monument-Valley
- https://mcvuk.com/business-news/priceless-why-ustwo-games-tricky-follow-up-to-monument-valley-found-its-perfect-home-on-apple-arcade/
- https://www.androidauthority.com/interview-altos-snowman-ryan-cash-891232/
- https://www.pocketgamer.com/altos-odyssey/interview-a-closer-look-at-team-altos-stunning-sequel-altos-odyssey/
- https://developer.apple.com/news/?id=fy6rx06s
- https://www.gamedeveloper.com/design/paring-down-the-elegant-control-scheme-of-i-sayonara-wild-hearts-i-
- https://developer.apple.com/news/?id=33kvkagk
- https://simogo.com/2013/11/08/the-making-of-device-6-art/
- https://www.gamedeveloper.com/design/simogo-reinvents-itself-yet-again-with-weird-wild-i-device-6-i-
- https://thatgamecompany.com/interview-jenova-chen-sky/
- https://developer.apple.com/news/?id=zm47it7t
- https://www.pocketgamer.biz/interview/78533/jenova-chen-sky-seven-year-development-monetising-his-way/
- https://mcvuk.com/business-news/pennies-from-heaven-thatgamecompanys-jenova-chen-on-monetisation-in-sky-children-of-the-light/
- https://www.forbes.com/sites/davidewalt/2019/07/23/can-jenova-chen-monetize-altruism-with-sky-children-of-the-light/
- https://en.wikipedia.org/wiki/Inside_(video_game)
- https://www.gamedeveloper.com/business/hanging-in-limbo
- https://www.itsnicethat.com/news/florence-game-mountains-ken-wong-digital-090218
- https://www.femalemag.com.sg/culture/ken-wong-mountains-interview-florence-creative-director/
- https://hyperallergic.com/gorogoa-jason-roberts/
- https://www.gamedeveloper.com/game-platforms/-i-gorogoa-i-how-the-hit-indie-game-derived-from-a-failed-comic-book
- https://gameinformer.com/interview/2021/07/29/ben-esposito-on-neon-white-if-this-is-for-you-its-your-favorite-game
- https://www.engadget.com/neon-white-switch-steam-ben-esposito-interview-183854914.html
- https://developer.apple.com/news/?id=9ab1g4r3
- https://notbor.ing/words/the-sound-of-software
- https://www.revenuecat.com/blog/growth/andy-allen-not-boring-software-launched-podcast-2026
- https://www.dive.club/deep-dives/andy-allen
- https://gamestudies.org/2602/articles/svelch_playdate
- https://www.gamesradar.com/playdate-how-the-publishers-of-untitled-goose-game-built-a-console-designed-to-spark-pure-joy/
- https://www.shacknews.com/article/107642/untitled-goose-game-interview-house-house-dev-nico-disseldorp-talks-being-a-jerk
- https://www.gamedeveloper.com/disciplines/road-to-the-igf-house-house-s-i-untitled-goose-game-i-
- https://grokipedia.com/page/Toca_Boca
- https://sagomini.com/welcome-to-sago-mini/
- https://technical.ly/uncategorized/tinybop-homes-raul-gutierrez-toys-vs-games/
- https://tinybop.com/about
- https://www.digitallydownloaded.net/2024/09/interview-conrad-roset-neva-creative-director.html
- https://thatgamersasylum.wordpress.com/2019/01/26/gris-creative-director-conrad-roset-interview/
- https://www.gamedeveloper.com/design/the-challenges-of-laying-worlds-upon-worlds-in-puzzle-game-cocoon
- https://premortem.games/2024/09/18/cocoon-creator-jeppe-carlsen-i-never-compromise-on-playability/
- https://www.giantbomb.com/profile/gamer_152/blog/interview-peter-curry-co-creator-of-mini-metro/131885/
- https://en.wikipedia.org/wiki/Mini_Metro_(video_game)
- https://mcvuk.com/business-news/going-underground-the-story-of-dinosaur-polo-clubs-mini-metro/
- https://www.gamedeveloper.com/design/-i-threes-i-co-creator-wohlwend-on-the-value-of-minimalist-game-design
- https://www.vice.com/en/article/the-muted-majesty-of-threes-a-calmingly-addictive-puzzle-game/
- https://techcrunch.com/2014/03/27/threes-developers-publish-an-epic-work-log-to-show-how-frustrating-it-is-to-be-cloned/
- https://thenextweb.com/news/two-dots-hearts-nyc
- https://www.pocketgamer.biz/how-new-york-studio-dots-learned-to-thrive-on-mobile/
- https://www.gamedeveloper.com/business/postmortem-joel-mcdonald-s-i-prune-i-
- https://prunegame.com/
- https://www.gamedeveloper.com/design/-i-lara-croft-go-i-dev-remake-how-you-felt-playing-a-classic-game-not-the-game-itself
- https://www.pocketgamer.biz/the-making-of-lara-croft-go/
- https://www.gamesradar.com/how-square-enix-made-turn-based-tomb-raider/
- https://developer.apple.com/design/awards/2020/
- https://developer.apple.com/design/awards/2022/
- https://developer.apple.com/design/awards/2023/
- https://www.apple.com/newsroom/2024/06/apple-announces-winners-of-the-2024-apple-design-awards/
- https://www.apple.com/newsroom/2025/06/apple-unveils-winners-and-finalists-of-the-2025-apple-design-awards/
- https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/
- https://developer.apple.com/design/awards/
- https://medium.com/@yyh19971004/balatro-design-analysis-visual-packaging-and-interactive-feedback-cc6fa6a65370
- https://blakecrosley.com/guides/design/balatro
- https://toucharcade.com/2024/03/18/balatro-interview-mobile-port-localthunk-dlc-plans-updates-new-jokers-demo-feedback/
- https://developer.apple.com/news/?id=9mgkwjnm

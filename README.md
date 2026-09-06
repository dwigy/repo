# Cartoon Orbit

A fan-made homage to the classic 2003 collect-and-battle web game, rebuilt as an
installable web app for your phone in the look of the original site: the teal frame,
steel-blue bevelled panels, angled tabs, the gToon Game Zone board with its sunburst
"ORBIT" sockets, and the cZones badge grid. Collect **cToons**, battle in **gToons**,
decorate your **cZone**, trade at the Auction and redeem **Orbit Codes**. Everything
saves automatically on your device.

It is free and not for sale. The cast are cartoon stars whose original works are in the
US public domain (published 1905–1930): Felix the Cat, Koko the Clown, Oswald the Lucky
Rabbit, Steamboat Willie, Bosko, Bimbo, Flip the Frog, the 1930 Betty Boop, Popeye, Olive
Oyl, Krazy Kat, Ignatz Mouse, Gertie the Dinosaur, Farmer Al Falfa and Little Nemo. Each chip
shows real artwork when it can: the game looks up the character's Wikipedia article and,
if its lead image is hosted on Wikimedia Commons (free-licensed, mostly public-domain stills
from the original works), downloads it once and keeps it for offline play, with a link to
the Commons file in the cToon details. Characters whose article image is a fair-use file
keep a hand-drawn rubber-hose portrait instead, and you can set your own image on any
character from its details page (stored on your device). Switch real artwork off in
Settings if you prefer the drawn set. Each character comes in eight collectible editions across five rarity tiers: Classic
(Common, grey), a film-reel edition named for a public-domain title (Uncommon, green),
Spotlight (Rare, electric blue), Holo / Full Silver / Dark Matter (Mythic, purple) and Full
Gold / Platinum (Legendary, gold). The metal editions render the whole portrait in that
metal; Dark Matter puts it in a starfield. Collect all eight for a character to complete
its set. No Cartoon
Network characters are used. Fonts are open-licensed lookalikes bundled for offline use:
Michroma for the wide headers and Barlow Condensed for the condensed italic numerals
(SIL OFL, see `fonts/LICENSE.txt`).

No app store, no computer and no account needed.

## Install on iPhone or iPad

1. Open the game's link in **Safari** (it must be Safari; Chrome on iOS can't add web apps).
2. Tap the **Share** button (square with an arrow at the bottom of the screen).
3. Scroll down and tap **Add to Home Screen**, then **Add**.
4. Launch it from the icon. It opens full-screen and works offline.

Android: open the link in Chrome, tap the ⋮ menu, then **Install app** / **Add to Home screen**.

## Getting a link (one-time setup on GitHub, works from a phone)

The repo ships with a GitHub Pages workflow. To publish:

1. Merge this branch into `main`.
2. On github.com open the repo → **Settings** → **Pages**.
3. Under *Build and deployment*, set **Source** to **GitHub Actions**.
4. The **Deploy to GitHub Pages** workflow runs on every push to `main` (you can also start it from the **Actions** tab).
   When it finishes the game is live at `https://<your-username>.github.io/<repo-name>/`.

Open that link on your iPhone and follow the install steps above.

## How progress is saved

- Every action (opening a pack, winning a match, moving a cToon in your cZone) is written
  immediately to **both** `localStorage` and IndexedDB on the device. Whichever copy is
  newer is loaded next time, so a cleared cache in one store does not lose your binder.
- The app asks the browser for persistent storage and flushes any pending save when it is
  backgrounded, which matters on iOS.
- **More → Backup** gives you a single copy-and-paste save code (or shares it with the
  iOS share sheet). Paste it under *Restore* on another device to move your whole game.

## What's in the game

| Feature | Details |
| --- | --- |
| Binder | 126 cToons: 15 public-domain stars × 8 editions across 5 series, plus 6 earn-only Prize cToons. Five rarity tiers (Common, Uncommon, Rare, Mythic, Legendary) with per-character set meters. Duplicates can be recycled for points. |
| cMart | Free daily cToon plus Standard, Premium and Mega cPacks with published odds. Opening a pack is a rip: drag across the foil, it bursts, and the chips flip one at a time from least rare to most rare, with bigger effects for Mythic and Legendary pulls and NEW badges for first-time pulls. |
| gToons | Game Zone battles on the original 7-socket board (back row of 3, front row of 4). Every gToon has a colour, 1–16 points and a power (x2 to a buddy, bonuses per colour, penalties to the rival across the line, back/front row bonuses…). Three of a colour scores a bonus; swapping a hand gToon costs 10. Chips flip through the air from your hand to the board, land with a shockwave, and rival chips flash or shake when powers hit them. Five unlockable opponents, deck builder with auto-fill. |
| cZones | Drag-and-drop display room with 8 unlockable backgrounds, plus daily NPC cZones to visit (Previous / Random / Next) with awards. |
| Auction | Three NPC traders with new offers every day. Gift codes let you send a cToon to a friend. |
| Daily loop | Login bonus with streaks, three daily quests, Prize cToons for milestones. |
| Orbit Codes | A featured code on the front page rotates daily (+150). Promo codes: `ORBIT2000`, `GTOONS`, `INKWELL`, `SPINACH` and `SLUMBERLAND`. |
| Look | The 2003 Orbit layout in a clean white, blue and grey finish with glossy highlights, so the chips are the most colourful thing on screen. |
| Front page | A poster of your featured chip (pick any chip and tap FEATURE ON FRONT PAGE), the day's ritual card (bonus, free chip, a battle) and your streak. |
| Chip details | Tilt the chip with your finger, flip it to see its mint number, date and where it came from. Completing all eight editions of a character shows a set poster. |
| Sound | A small synthesised sound kit (rip, flip, clink, land, tally, win) generated in the browser, paired with visual pulses. Toggle in Settings. |

The design thinking behind the app lives in `docs/UX-PHILOSOPHY.md` (north star, ten tenets,
design system) and `docs/UX-EVALUATION.md` (screen-by-screen review and rework plan), with the
research notes in `docs/research/`.

## Running locally

It is plain HTML, CSS and JavaScript with no build step. Serve the folder with any static
server (for example `python3 -m http.server`) and open `index.html`. The service worker
needs `http://localhost` or `https://` to register.

## Project layout

```
index.html            app shell
manifest.webmanifest  PWA manifest (name, icons, standalone display)
sw.js                 offline cache
css/style.css         styling (2003 Orbit look)
css/fonts.css, fonts/ bundled open-licensed fonts
js/data.js            cToon catalog, packs, opponents, quests, codes
js/art.js             vector portraits, glossy chips, metal/dark edition treatments, sockets, badges, pack foils
js/pack.js            pack ripping and reveal overlay
js/sound.js           synthesised sound kit (WebAudio)
js/store.js           autosave (localStorage + IndexedDB), backup codes, seeded RNG
js/game.js            economy: packs, daily rewards, quests, trades, prizes
js/gtoons.js          battle engine and AI
js/ui.js              screens and interactions
icons/                app icons
docs/                 UX philosophy, evaluation and research notes
```

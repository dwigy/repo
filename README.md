# [GAME] (working title)

A fan-made homage to the classic 2003 collect-and-battle web game, rebuilt as an
installable web app for your phone in the look of the original site: the teal frame,
steel-blue bevelled panels, angled tabs, the chip Game Zone board with its sunburst
"ORBIT" sockets, and the portfolios badge grid. Collect **chips**, battle in **chips**,
decorate your **portfolio**, trade at the Auction and redeem **Codes**. Everything
saves automatically on your device.

It is free and not for sale. The cast are cartoon stars whose original works are in the
US public domain (published 1905–1930): Felix the Cat, Koko the Clown, Oswald the Lucky
Rabbit, Steamboat Willie, Bosko, Bimbo, Flip the Frog, the 1930 Betty Boop, Popeye, Olive
Oyl, Krazy Kat, Ignatz Mouse, Gertie the Dinosaur, Farmer Al Falfa and Little Nemo. Each chip
shows real artwork when it can: the game looks up the character's Wikipedia article and,
if its lead image is hosted on Wikimedia Commons (free-licensed, mostly public-domain stills
from the original works), downloads it once and keeps it for offline play, with a link to
the Commons file in the chip details. Characters whose article image is a fair-use file
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

- Every action (opening a pack, winning a match, moving a chip in your portfolio) is written
  immediately to **both** `localStorage` and IndexedDB on the device. Whichever copy is
  newer is loaded next time, so a cleared cache in one store does not lose your binder.
- The app asks the browser for persistent storage and flushes any pending save when it is
  backgrounded, which matters on iOS.
- **More → Backup** gives you a single copy-and-paste save code (or shares it with the
  iOS share sheet). Paste it under *Restore* on another device to move your whole game.

## What's in the game

| Feature | Details |
| --- | --- |
| Binder | 222 chips: 26 placeholder characters (Alpha to Zulu) × 8 editions across 6 sets, 8 one-of-one chips (seven gatekeepers plus 100% completion) and 6 earn-only Award chips. Chip art is a generated placeholder sigil per character until the real library lands. Five rarity tiers (Common, Uncommon, Rare, Mythic, Legendary) with per-character set meters. Duplicates can be recycled for points. |
| Shop | Free daily chip plus Standard, Premium and Mega packs with published odds. Opening a pack is a rip: drag across the foil, it bursts, and the chips flip one at a time from least rare to most rare, with bigger effects for Mythic and Legendary pulls and NEW badges for first-time pulls. |
| chips | Game Zone battles on the original 7-socket board (back row of 3, front row of 4). Every chip has a colour, 1–16 points and one of 22 named powers (Buddy, Rally, Hex, Jab, Pickpocket, Mirror, Backstage, Spotlight, Opener, Closer, Encore, Loner, Twins, Chorus Line, Crown, Underdog, Brick, Shield, Veto…). Mythic and Legendary chips also carry a secret power that wakes after three wins on the board. Three of a colour scores a bonus; swapping a hand chip costs 10. Chips flip through the air from your hand to the board, land with a shockwave, and rival chips flash or shake when powers hit them. Five unlockable opponents, deck builder with auto-fill. |
| portfolios | Drag-and-drop display room with 8 unlockable backgrounds, plus daily NPC portfolios to visit (Previous / Random / Next) with awards. |
| Auction | Three NPC traders with new offers every day. Gift codes let you send a chip to a friend. |
| Daily loop | Login bonus with streaks, three daily quests, Prize chips for milestones. |
| Codes | A featured code rotates daily (+150). Promo codes: `ORBIT2000`, `GTOONS`, `INKWELL`, `SPINACH` and `SLUMBERLAND`. |
| Testing codes | `UNLIMITED` toggles unlimited points (packs and backgrounds are free, the wallet shows ∞). `DEBUG` toggles a hidden Debug tab under Profile, as does tapping the version line in Settings seven times. The debug tab can add points and chips, open free or forced-Legendary packs, reset the day, change the streak, unlock the ladder and backgrounds, replay ceremonies, show the raw save and clear the cache. |
| Look | The 2003 Orbit layout in a clean white, blue and grey finish with glossy highlights, so the chips are the most colourful thing on screen. |
| Navigation | Five tabs along the bottom: Home, Collection, Campaign (the big centre button), Online (coming soon) and Profile. A cover page with tap to start opens the app. Light, dark or system theme under Profile > Settings. |
| Home | A poster of this week's featured series, the day's ritual (bonus, free chip, a battle, three goals), the main menu as glossy tiles, and a What's New card with the version log and what is coming next. |
| Collection | Binder, Sets, your Stack (12 chips), Shop, Trades and Codes. |
| Campaign | Three save slots with progress snapshots. A new save plays a spoken intro, then picks one of five starter stacks, each led by a hero chip (+6 when played first). Seven regions, each its own themed page with Train (coins), a region-only pack, three players to beat, a gatekeeper (badge + 1/1 chip) and three places to explore (lore, a chip to find, a Higher-or-Lower mini-game). After seven badges the three heroes open; 100% completion grants a final badge and 1/1. The map jumps between unlocked regions. Menu is always top-left. |
| Profile | Portfolio (background, favourite chips, badges, link to your stack), Settings (name, sound, theme, artwork, reset), Device (install, backup, restore). |
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
js/data.js            chip catalog, packs, opponents, quests, codes
js/art.js             vector portraits, glossy chips, metal/dark edition treatments, sockets, badges, pack foils
js/pack.js            pack ripping and reveal overlay
js/sound.js           synthesised sound kit (WebAudio)
js/news.js            version log and roadmap shown on Home
js/store.js           autosave (localStorage + IndexedDB), backup codes, seeded RNG
js/game.js            economy: packs, daily rewards, quests, trades, prizes
js/gtoons.js          battle engine (house rules, powers, secrets) and AI
js/campaign.js        regions, players, gatekeepers, heroes, starter stacks, region packs
js/story.js           placeholder lore cards
js/camp.js            the campaign's own UI (slots, intro, starters, regions, explore, mini-game)
js/ui.js              screens and interactions
icons/                app icons
docs/                 UX philosophy, evaluation and research notes
```

## Design documents

- `docs/CAMPAIGN-FORMAT.md` — the agency-style campaign format draft (three angles, judged and synthesised).
- `docs/chips.xlsx` / `docs/chips.csv` — every chip with ids, stats, powers and secret powers.
- `docs/UX-PHILOSOPHY.md`, `docs/UX-EVALUATION.md`, `docs/research/` — the UX research and evaluation.

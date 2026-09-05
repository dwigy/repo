# Cartoon Orbit

A fan-made tribute to the classic collect-and-battle web game, rebuilt as an installable
web app for your phone. Collect **cToons**, battle in **gToons**, decorate your **cZone**,
trade at the Trading Post and redeem **Orbit Codes**. Everything saves automatically on
your device. All 66 characters and their six series are original creations.

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
| Binder | 66 cToons in 7 series and 7 rarity tiers (Common → Ultra Rare, plus earn-only Prize cToons). Duplicates can be recycled for points. |
| cToon Vendor | Free daily cToon plus Standard, Premium and Mega cPacks with published odds. |
| gToons | 2×3 grid card battles against 5 unlockable opponents. Every cToon has an ability (row bonuses, adjacency, penalties to the rival across, mirrors, steals…). Deck builder with auto-fill. |
| cZone | Drag-and-drop display room with 7 unlockable backgrounds. |
| Trading Post | Three NPC traders with new offers every day. Gift codes let you send a cToon to a friend. |
| Daily loop | Login bonus with streaks, three daily quests, Prize cToons for milestones. |
| Orbit Codes | Promo codes for bonuses. Try `ORBIT2000`, `GTOONS`, `ROCKETRASCAL`, `SPOOKY` and `MUFFINTIME`. |

## Running locally

It is plain HTML, CSS and JavaScript with no build step. Serve the folder with any static
server (for example `python3 -m http.server`) and open `index.html`. The service worker
needs `http://localhost` or `https://` to register.

## Project layout

```
index.html            app shell
manifest.webmanifest  PWA manifest (name, icons, standalone display)
sw.js                 offline cache
css/style.css         styling
js/data.js            cToon catalog, packs, opponents, quests, codes
js/art.js             procedural SVG artwork for every cToon
js/store.js           autosave (localStorage + IndexedDB), backup codes, seeded RNG
js/game.js            economy: packs, daily rewards, quests, trades, prizes
js/gtoons.js          battle engine and AI
js/ui.js              screens and interactions
icons/                app icons
```

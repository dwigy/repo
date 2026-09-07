# [GAME]

A collecting and meeting game for the phone. Long ago every force of the universe lived in
harmony. Then the Great Split: it all came apart into fragments that fell across the universe
the way rain falls. Nobody knows why, and nobody knows how many. When a person and a fragment
meet there is a pull, and the fragment settles into a hand-made disc and becomes a **companion**.

You carry twenty companions in a **stack**, play twelve in a **meeting**, and travel a road of
seven towns. This is a working build: every name in brackets is a placeholder until branding
lands. World nouns live in one module, `js/lexicon.js`, so renaming any of them is a one-line
change. The lore canon is `docs/WORLD.md`.

It installs from the browser on iPhone or Android and works offline. Progress saves automatically
on the device.

## Install on iPhone or iPad

1. Open the link in **Safari**.
2. Tap **Share**, then **Add to Home Screen**, then **Add**.

Android: open in Chrome, tap the ⋮ menu, choose **Install app**.

## What's in it

| Part | Details |
| --- | --- |
| Companions | 222 catalogue entries: 26 forms × 8 editions across six findings, 8 whole fragments and 6 awards. Five levels of **light** (Common to Legendary) say how much of the original light a companion kept. The catalogue is open-ended: nothing shows a total, only what is known. |
| Forms | 21 forms are bound to a region, three each; five are wanderers found anywhere and lead the first stacks. Each has a home, a pull and an on-board quirk. |
| Discs and blanks | Shops sell **blanks**: empty discs, hand-made in small batches, sealed a few to a pack. A blank stays empty until it is opened, and the opener's own breath draws a fragment in. The rip overlay opens on "Breathe." |
| A meeting | Twelve sockets a side, six front and six back. Carry twenty, play twelve, hold five in hand. Three of a colour is a set. Twenty-two named powers, plus a secret power on Mythic and Legendary companions that wakes after three wins on the board. Both players bow. |
| The stack | Exactly twenty, no more than three of one form, at most one whole fragment. |
| The road | Seven towns in order: the Hearth, the Tide, the Forge, the Grove, the Signal, the Observatory, the Summit. Each has a shop, three players worth meeting, places to explore, practice for coins, and one **Keeper**. |
| Keepers | Not bosses. The person who knows the region's lesson best. They decline an unbalanced stack with their question and no penalty. Beat one in a true meeting for their telling, a **Seal**, and the region's **whole fragment**. |
| [CORP] | A corporation collecting for the wrong reason. It meets you four times: a friendly buyer, an emptied shop, a stolen whole fragment in the open, and the Gathering at the foot of the Summit. |
| The Hall | Seven Seals earn an invitation. Twelve seats, an empty thirteenth chair, and three of the twelve who test each arrival. Then one question about the Great Split, with five answers and no wrong one. |
| Tinker's Night | On the longest night of the year the Home page turns to lanterns and every companion comes out at once. |
| Portfolio | Your background, favourite companions, Seals and a link to your stack. |
| Motion | Screen crossfades through the View Transitions API, staged entrances, sheet choreography and press feedback, all off under reduced motion. |
| Theme | Light, dark or system, under Profile → Settings. |
| Saving | Everything saves to this device after every action, in two places. A backup code copies the whole save to another device. |

## Codes

`WELCOME500`, `FREEPACK`, `CODEALPHA`, `CODEGOLF`, `CODEOSCAR`. A featured code rotates daily.
For testing: `UNLIMITED` toggles unlimited coins, `DEBUG` shows a debug tab under Profile
(seven taps on the version line does the same).

## Running locally

Plain HTML, CSS and JavaScript, no build step. Serve the folder and open `index.html`:

```
python3 -m http.server 8765
```

The service worker needs `http://localhost` or `https://`.

## Checks

```
npm run lint     # vocabulary lint over every user-facing string
npm run sim      # balance simulation; --write updates docs/balance.md
```

## Project layout

```
index.html            app shell
manifest.webmanifest  install manifest
sw.js                 offline cache
css/style.css         styling
js/lexicon.js         every world term and proper noun, in one place
js/data.js            the catalogue: findings, forms, editions, packs, awards
js/meeting.js         the board: twelve sockets, powers, house rules, opponent play
js/campaign.js        the road: regions, Keepers, [CORP], the Hall
js/story.js           every title card
js/camp.js            the campaign's own screens
js/game.js            saves, coins, packs, companions, progress
js/ui.js              every other screen
js/art.js             placeholder marks, discs, packs, region marks
js/pack.js            opening a pack of blanks
js/store.js           persistence and migration
js/news.js            version log and roadmap
docs/WORLD.md         the lore canon: read this before writing any copy
docs/CAMPAIGN-FORMAT.md   the campaign design document
docs/UX-PHILOSOPHY.md     the design constitution
docs/balance.md       simulation output
docs/catalogue.csv    every catalogue entry
scripts/              lint and simulation
```

## Placeholders

`[GAME]`, `[CORP]` and the brand word for the collectible are pending. Form names are Alpha to
Zulu; findings are First to Sixth. Companion art is a generated placeholder mark per form until
the real library lands.

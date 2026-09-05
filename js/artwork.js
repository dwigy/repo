// Real artwork for the cast. Two sources, in priority order:
//  1. A custom image the player picked from their photos (stored on-device).
//  2. The lead image of the character's Wikipedia article, accepted only when
//     it is hosted on Wikimedia Commons (free-licensed, mostly public domain
//     stills from the original 1905–1930 works). Fair-use images live on
//     en.wikipedia.org instead and are skipped.
// Anything unresolved falls back to the hand-drawn portrait in art.js.
import { CHARACTERS } from './data.js';
import { idbGet, idbSet, state } from './store.js';

const art = {};            // char -> { src, file?, page?, custom? }
const listeners = new Set();
let loaded = false;
const RETRY_MS = 24 * 3600 * 1000;

export function onArtChange(fn) { listeners.add(fn); }

// Only use an image once the browser has actually loaded it, so an offline
// launch or a dead link never paints a broken-image placeholder over a chip.
function verify(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
function notify() { listeners.forEach(fn => fn()); }

export function getArt(char) { return art[char] || null; }
export function artEnabled() { return state.settings.realArt !== false; }

export async function loadArtwork() {
  if (loaded) return;
  loaded = true;
  await Promise.all(Object.keys(CHARACTERS).map(async (char) => {
    const custom = await idbGet('art:custom:' + char);
    if (custom) { art[char] = { src: custom, custom: true }; return; }
    const wiki = await idbGet('art:wiki:' + char);
    if (wiki && wiki.src && await verify(wiki.src)) art[char] = wiki;
  }));
  notify();
  if (artEnabled()) refreshWiki();
}

// Look up each character's Wikipedia page image (once a day at most).
export async function refreshWiki(force = false) {
  if (!navigator.onLine && !force) return;
  for (const [char, c] of Object.entries(CHARACTERS)) {
    if (!c.wiki || art[char]?.custom) continue;
    const cached = await idbGet('art:wiki:' + char);
    if (!force && cached && (cached.src || (cached.checked && Date.now() - cached.checked < RETRY_MS))) continue;
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=480&titles=${encodeURIComponent(c.wiki)}`;
      const res = await fetch(url);
      const data = await res.json();
      const page = Object.values(data?.query?.pages || {})[0];
      const src = page?.thumbnail?.source || '';
      const file = page?.pageimage || '';
      if (src.startsWith('https://upload.wikimedia.org/wikipedia/commons/')) {
        const entry = { src, file, page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`, checked: Date.now() };
        await idbSet('art:wiki:' + char, entry);
        if (await verify(src)) { art[char] = entry; notify(); }
      } else {
        await idbSet('art:wiki:' + char, { checked: Date.now(), reason: src ? 'not on Commons (probably fair use)' : 'no page image' });
      }
    } catch {
      await idbSet('art:wiki:' + char, { checked: Date.now(), reason: 'offline' });
    }
  }
}

// Player-supplied image: cover-crop to a 320px square JPEG and keep on-device.
export function setCustomArt(char, file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        const S = 320, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
        const ctx = cv.getContext('2d');
        const k = Math.max(S / img.width, S / img.height);
        const w = img.width * k, h = img.height * k;
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        const data = cv.toDataURL('image/jpeg', 0.86);
        await idbSet('art:custom:' + char, data);
        art[char] = { src: data, custom: true };
        URL.revokeObjectURL(url); notify(); resolve(data);
      } catch (e) { reject(e); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file is not an image.')); };
    img.src = url;
  });
}
export async function clearCustomArt(char) {
  await idbSet('art:custom:' + char, null);
  const wiki = await idbGet('art:wiki:' + char);
  art[char] = wiki && wiki.src ? wiki : null;
  if (!art[char]) delete art[char];
  notify();
}
export async function forgetWiki() {
  for (const char of Object.keys(CHARACTERS)) { if (!art[char]?.custom) { delete art[char]; await idbSet('art:wiki:' + char, null); } }
  notify();
}

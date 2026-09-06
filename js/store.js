// Persistence. Every mutation goes through `commit()` which autosaves to
// BOTH localStorage and IndexedDB, so progress survives even if Safari
// clears one of them. Export/import codes provide a manual backup too.

const LS_KEY = 'cartoon-orbit-save-v1';
const DB_NAME = 'cartoon-orbit';
const DB_STORE = 'kv';
export const SAVE_VERSION = 1;

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function freshState() {
  return {
    v: SAVE_VERSION,
    created: Date.now(),
    savedAt: 0,
    name: 'player',
    points: 0,
    collection: {},          // { ctoonId: count }
    deck: [],                // up to 12 ctoon ids
    czone: { bg: 'orbit', items: [] }, // items: [{id, x, y}] (x/y 0..1)
    unlockedBgs: ['orbit'],
    daily: { last: '', streak: 0 },
    dailyFree: '',           // date the free vendor chip was claimed
    quests: { date: '', stats: {}, claimed: [] },
    trades: { date: '', done: [] },
    beaten: [],              // opponent ids beaten at least once
    stats: { battles: 0, wins: 0, packs: 0, trades: 0, recycled: 0 },
    redeemed: [],            // promo + gift codes used
    prizes: [],              // prize ctoon ids awarded
    log: [],                 // recent events for the home screen
    settings: { sound: true, theme: 'system' },
    onboarded: false,
    saves: [null, null, null],   // campaign save slots
    activeSave: -1,
    badges: [],                  // profile badges (status symbols, not chips)
    favorites: [],               // chip ids shown on the portfolio
  };
}

// ---- IndexedDB helpers (promise wrapped, tolerant of failure) ----
function openDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
}
export async function idbGet(key) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch { return undefined; }
}
export async function idbSet(key, value) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* ignore */ }
}

export let state = freshState();
const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

let saveTimer = null;
export function saveNow() {
  state.savedAt = Date.now();
  const json = JSON.stringify(state);
  try { localStorage.setItem(LS_KEY, json); } catch { /* quota / private mode */ }
  idbSet(LS_KEY, json);
}
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 120);
}

// Apply a mutation and autosave.
export function commit(fn) {
  const r = fn ? fn(state) : undefined;
  scheduleSave();
  listeners.forEach(l => l(state));
  return r;
}

function migrate(s) {
  const base = freshState();
  const out = { ...base, ...s };
  for (const k of ['czone', 'daily', 'quests', 'trades', 'stats', 'settings']) {
    out[k] = { ...base[k], ...(s[k] || {}) };
  }
  if (!Array.isArray(out.saves) || out.saves.length !== 3) out.saves = [null, null, null];
  if (!Array.isArray(out.badges)) out.badges = [];
  if (!Array.isArray(out.favorites)) out.favorites = [];
  if (!Array.isArray(out.unlockedBgs)) out.unlockedBgs = [];
  if (!out.unlockedBgs.includes('orbit')) out.unlockedBgs.unshift('orbit');
  if (!out.czone.bg) out.czone.bg = 'orbit';
  out.v = SAVE_VERSION;
  return out;
}

export async function load() {
  let ls = null, idb = null;
  try { ls = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { ls = null; }
  try { idb = JSON.parse((await idbGet(LS_KEY)) || 'null'); } catch { idb = null; }
  const pick = [ls, idb].filter(Boolean).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0];
  state = pick ? migrate(pick) : freshState();
  // Ask the browser to keep our storage around.
  try { if (navigator.storage?.persist) navigator.storage.persist(); } catch { /* ignore */ }
  // Flush pending saves when the app is backgrounded (important on iOS).
  const flush = () => { clearTimeout(saveTimer); saveNow(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  return state;
}

export function replaceState(next) {
  state = migrate(next);
  saveNow();
  listeners.forEach(l => l(state));
}

export function resetState() {
  state = freshState();
  saveNow();
  listeners.forEach(l => l(state));
}

// ---- Export / import codes ----
function checksum(str) {
  // cyrb53 — small non-cryptographic hash, plenty for typo detection.
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
function b64e(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function b64d(str) { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; return decodeURIComponent(escape(atob(str))); }

export function exportCode() {
  const payload = b64e(JSON.stringify(state));
  return `SAVE1.${payload}.${checksum(payload)}`;
}
export function parseSaveCode(code) {
  const parts = String(code).trim().split('.');
  if (parts.length !== 3 || parts[0] !== 'SAVE1') throw new Error('That is not a save code.');
  if (checksum(parts[1]) !== parts[2]) throw new Error('Save code is damaged (checksum mismatch).');
  const obj = JSON.parse(b64d(parts[1]));
  if (!obj || typeof obj !== 'object' || !obj.collection) throw new Error('Save code is missing data.');
  return obj;
}

// Gift codes move a single chip from one player to another (for friends).
const GIFT_SALT = 'orbit-gift-2000';
export function makeGiftCode(ctoonId) {
  const nonce = Math.random().toString(36).slice(2, 8);
  const body = `${ctoonId}.${nonce}`;
  return `GIFT-${body}-${checksum(GIFT_SALT + body).slice(0, 5)}`.toUpperCase();
}
export function parseGiftCode(code) {
  const m = String(code).trim().toUpperCase().match(/^GIFT-([A-Z]{2,12}\d{1,2})\.([A-Z0-9]{6})-([A-Z0-9]{5})$/);
  if (!m) return null;
  const body = `${m[1].toLowerCase()}.${m[2].toLowerCase()}`;
  if (checksum(GIFT_SALT + body).slice(0, 5).toUpperCase() !== m[3]) return null;
  return { id: m[1].toLowerCase(), nonce: m[2].toLowerCase(), key: `gift:${body}` };
}

// Seeded RNG for daily content (same offers for the whole day).
export function seededRng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

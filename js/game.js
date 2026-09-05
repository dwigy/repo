// Game rules: economy, packs, daily rewards, quests, trades, prizes.
import { CTOONS, BY_ID, PACKABLE, PACKS, RARITY, QUESTS, TRADERS, OPPONENTS, PROMO_CODES, BACKGROUNDS, NPC_ZONES, FEATURED_CODES } from './data.js';
import { state, commit, todayKey, seededRng, parseGiftCode, makeGiftCode } from './store.js';

export const DAILY_BASE = 100;
export const DAILY_STREAK_BONUS = 25;
export const DAILY_STREAK_CAP = 300;

export function ownedCount(id) { return state.collection[id] || 0; }
export function uniqueOwned() { return Object.keys(state.collection).filter(id => state.collection[id] > 0).length; }
export function totalOwned() { return Object.values(state.collection).reduce((a, b) => a + b, 0); }
export function binderValue() { return Object.entries(state.collection).reduce((s, [id, n]) => s + (BY_ID[id]?.points || 0) * n, 0); }

export function log(text) {
  state.log.unshift({ t: Date.now(), text });
  state.log = state.log.slice(0, 12);
}

export function addCtoon(id, n = 1) {
  state.collection[id] = (state.collection[id] || 0) + n;
}
export function removeCtoon(id, n = 1) {
  const have = state.collection[id] || 0;
  if (have < n) return false;
  state.collection[id] = have - n;
  if (state.collection[id] === 0) {
    delete state.collection[id];
    state.deck = state.deck.filter(d => d !== id);
    state.czone.items = state.czone.items.filter(it => it.id !== id);
  } else {
    // Keep deck/czone counts within what we still own.
    const inDeck = state.deck.filter(d => d === id).length;
    if (inDeck > state.collection[id]) state.deck.splice(state.deck.indexOf(id), 1);
    const inZone = state.czone.items.filter(it => it.id === id).length;
    if (inZone > state.collection[id]) state.czone.items.splice(state.czone.items.findIndex(it => it.id === id), 1);
  }
  return true;
}

// ---- Onboarding ----
export function startNewPlayer(name) {
  return commit(s => {
    s.name = (name || 'Orbiter').trim().slice(0, 16) || 'Orbiter';
    s.points = 500;
    const starters = ['rr01', 'gw02', 'rd02', 'ss01', 'mm02', 'cc01', 'rr03', 'gw03', 'rd01', 'ss03', 'mm03', 'cc03'];
    starters.forEach(id => addCtoon(id));
    addCtoon('pz01'); s.prizes.push('pz01');
    // one random uncommon and one random rare to make the first deck fun
    const pick = (r) => { const pool = PACKABLE.filter(t => t.rarity === r); return pool[Math.floor(Math.random() * pool.length)].id; };
    addCtoon(pick(1)); addCtoon(pick(2));
    s.deck = autoDeck(s);
    s.onboarded = true;
    log('Welcome to the Orbit! Starter binder unlocked.');
  });
}

// Best 12 cards by points (respecting owned counts).
export function autoDeck(s = state) {
  const list = [];
  Object.entries(s.collection).forEach(([id, n]) => { for (let i = 0; i < n; i++) list.push(id); });
  list.sort((a, b) => BY_ID[b].pts - BY_ID[a].pts);
  return list.slice(0, 12);
}

// ---- Daily login ----
export function claimDaily() {
  const today = todayKey();
  if (state.daily.last === today) return null;
  return commit(s => {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const streak = s.daily.last === todayKey(y) ? s.daily.streak + 1 : 1;
    const amount = Math.min(DAILY_STREAK_CAP, DAILY_BASE + DAILY_STREAK_BONUS * (streak - 1));
    s.points += amount;
    s.daily = { last: today, streak };
    log(`Daily bonus: +${amount} points (day ${streak} streak).`);
    const prize = checkPrizes(s);
    return { amount, streak, prize };
  });
}

// ---- Packs ----
export function rollPack(pack, rnd = Math.random) {
  const out = [];
  for (let i = 0; i < pack.size; i++) {
    let r = 0, x = rnd(), acc = 0;
    for (let k = 0; k < pack.odds.length; k++) { acc += pack.odds[k]; if (x < acc) { r = k; break; } r = k; }
    if (i === 0 && r < pack.minRarity) r = pack.minRarity;
    const pool = PACKABLE.filter(t => t.rarity === r);
    out.push(pool[Math.floor(rnd() * pool.length)].id);
  }
  return out;
}
export function buyPack(packId) {
  const pack = PACKS.find(p => p.id === packId);
  if (!pack || state.points < pack.price) return null;
  return commit(s => {
    s.points -= pack.price;
    const ids = rollPack(pack);
    ids.forEach(id => addCtoon(id));
    s.stats.packs++;
    bumpQuest(s, 'packsToday');
    log(`Opened a ${pack.name}: ${ids.map(id => BY_ID[id].name).join(', ')}.`);
    checkPrizes(s);
    return ids;
  });
}
export function grantPack(packId) {
  const pack = PACKS.find(p => p.id === packId);
  const ids = rollPack(pack);
  ids.forEach(id => addCtoon(id));
  state.stats.packs++;
  return ids;
}

// Free daily cToon at the vendor (seeded so it is the same all day).
export function dailyFreeCtoon() {
  const rnd = seededRng('free:' + todayKey());
  const pool = PACKABLE.filter(t => t.rarity <= 1);
  return pool[Math.floor(rnd() * pool.length)];
}
export function claimDailyFree() {
  const today = todayKey();
  if (state.dailyFree === today) return null;
  const t = dailyFreeCtoon();
  return commit(s => { s.dailyFree = today; addCtoon(t.id); log(`Free daily cToon: ${t.name}.`); checkPrizes(s); return t; });
}

export function recycle(id) {
  const t = BY_ID[id];
  if (!t || ownedCount(id) < 2 || t.series === 'pz') return null;
  return commit(s => {
    removeCtoon(id);
    const v = RARITY[t.rarity].recycle;
    s.points += v; s.stats.recycled++;
    bumpQuest(s, 'recycToday');
    log(`Recycled ${t.name} for ${v} points.`);
    return v;
  });
}

// ---- Quests ----
export function ensureQuests(s = state) {
  const today = todayKey();
  if (s.quests.date !== today) {
    s.quests = { date: today, stats: {}, claimed: [] };
  }
}
export function todaysQuests() {
  const rnd = seededRng('quests:' + todayKey());
  const pool = QUESTS.slice();
  const out = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  return out;
}
export function bumpQuest(s, stat, n = 1) {
  ensureQuests(s);
  s.quests.stats[stat] = (s.quests.stats[stat] || 0) + n;
}
export function questProgress(q) { ensureQuests(state); return Math.min(q.goal, state.quests.stats[q.stat] || 0); }
export function claimQuest(qid) {
  const q = QUESTS.find(x => x.id === qid);
  if (!q || questProgress(q) < q.goal || state.quests.claimed.includes(qid)) return null;
  return commit(s => { s.quests.claimed.push(qid); s.points += q.reward; log(`Quest complete: ${q.text} (+${q.reward}).`); return q.reward; });
}

// ---- Trading post (daily NPC offers) ----
export function todaysTrades() {
  const rnd = seededRng('trades:' + todayKey());
  const offers = [];
  TRADERS.forEach((tr, ti) => {
    for (let k = 0; k < 2; k++) {
      // give: rarity g, get: rarity g+1 (or same rarity, different series)
      const g = Math.min(3, Math.floor(rnd() * 3) + (ti === 1 ? 1 : 0));
      const up = rnd() < 0.7 ? 1 : 0;
      const givePool = PACKABLE.filter(t => t.rarity === g);
      const getPool = PACKABLE.filter(t => t.rarity === Math.min(5, g + up));
      const give = givePool[Math.floor(rnd() * givePool.length)];
      let get = getPool[Math.floor(rnd() * getPool.length)];
      if (get.id === give.id) get = getPool[(getPool.indexOf(get) + 1) % getPool.length];
      const giveN = up ? 2 : 1;
      offers.push({ idx: offers.length, trader: tr, give: give.id, giveN, get: get.id });
    }
  });
  return offers;
}
export function tradeDoneToday(idx) { return state.trades.date === todayKey() && state.trades.done.includes(idx); }
export function doTrade(offer) {
  if (tradeDoneToday(offer.idx) || ownedCount(offer.give) < offer.giveN) return false;
  return commit(s => {
    if (s.trades.date !== todayKey()) s.trades = { date: todayKey(), done: [] };
    removeCtoon(offer.give, offer.giveN);
    addCtoon(offer.get);
    s.trades.done.push(offer.idx);
    s.stats.trades++;
    bumpQuest(s, 'tradesToday');
    log(`Traded ${offer.giveN}x ${BY_ID[offer.give].name} for ${BY_ID[offer.get].name}.`);
    checkPrizes(s);
    return true;
  });
}

// ---- Battles ----
// Opponent decks lean toward their lower rarity bound so early opponents
// stay beatable with a starter binder.
export function opponentDeck(op) {
  const out = [];
  while (out.length < 12) {
    const span = op.maxR - op.minR + 1;
    const r = op.minR + Math.floor(Math.pow(Math.random(), 1.6) * span);
    const pool = PACKABLE.filter(t => t.rarity === r);
    out.push(pool[Math.floor(Math.random() * pool.length)].id);
  }
  return out;
}
export function opponentUnlocked(op) {
  const i = OPPONENTS.indexOf(op);
  return i === 0 || state.beaten.includes(OPPONENTS[i - 1].id);
}
export function recordBattle(op, won, margin) {
  return commit(s => {
    s.stats.battles++;
    bumpQuest(s, 'playsToday');
    let points = 0, firstWin = false, bonus = [];
    if (won) {
      s.stats.wins++;
      bumpQuest(s, 'winsToday');
      points = op.reward + Math.min(100, Math.floor(margin / 2));
      if (!s.beaten.includes(op.id)) {
        s.beaten.push(op.id); firstWin = true; points += 200;
        bonus = grantPack('prem');
      }
      log(`Beat ${op.name} (+${points} points).`);
    } else {
      points = Math.floor(op.reward / 5);
      log(`Lost to ${op.name}. Consolation +${points}.`);
    }
    s.points += points;
    const prize = checkPrizes(s);
    return { points, firstWin, bonus, prize };
  });
}

// ---- cZone ----
export function placeInZone(id, x, y) {
  if (ownedCount(id) <= state.czone.items.filter(it => it.id === id).length) return false;
  if (state.czone.items.length >= 20) return false;
  return commit(s => { s.czone.items.push({ id, x, y }); bumpQuest(s, 'placedToday'); return true; });
}
export function moveInZone(index, x, y) { commit(s => { const it = s.czone.items[index]; if (it) { it.x = x; it.y = y; } }); }
export function removeFromZone(index) { commit(s => { s.czone.items.splice(index, 1); }); }
export function buyBackground(id) {
  const bg = BACKGROUNDS.find(b => b.id === id);
  if (!bg || state.unlockedBgs.includes(id) || state.points < bg.cost) return false;
  return commit(s => { s.points -= bg.cost; s.unlockedBgs.push(id); s.czone.bg = id; log(`Unlocked cZone background: ${bg.name}.`); return true; });
}

// ---- Codes ----
export function redeemCode(raw) {
  const code = String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!code) return { ok: false, text: 'Enter a code first.' };
  const gift = parseGiftCode(code);
  if (gift) {
    if (state.redeemed.includes(gift.key)) return { ok: false, text: 'That gift code was already redeemed on this device.' };
    return commit(s => { s.redeemed.push(gift.key); addCtoon(gift.id); log(`Gift received: ${BY_ID[gift.id].name}!`); checkPrizes(s); return { ok: true, text: `${BY_ID[gift.id].name} joins your binder!`, ctoons: [gift.id] }; });
  }
  if (code === featuredCode()) {
    const key = 'featured:' + todayKey() + ':' + code;
    if (state.redeemed.includes(key)) return { ok: false, text: 'You already used today\'s featured code.' };
    return commit(s => { s.redeemed.push(key); s.points += 150; log(`Featured code ${code}: +150 points.`); return { ok: true, text: 'Featured code accepted! +150 points.', ctoons: [] }; });
  }
  const promo = PROMO_CODES[code];
  if (!promo) return { ok: false, text: 'Unknown code. Check the spelling and try again.' };
  const key = 'promo:' + code;
  if (state.redeemed.includes(key)) return { ok: false, text: 'You already used that Orbit Code.' };
  return commit(s => {
    s.redeemed.push(key);
    let ctoons = [];
    if (promo.points) s.points += promo.points;
    if (promo.ctoon) { addCtoon(promo.ctoon); ctoons = [promo.ctoon]; }
    if (promo.pack) ctoons = grantPack(promo.pack);
    log(`Orbit Code ${code}: ${promo.text}`);
    checkPrizes(s);
    return { ok: true, text: promo.text, ctoons };
  });
}
export function giftCtoon(id) {
  if (ownedCount(id) < 1 || BY_ID[id].series === 'pz') return null;
  return commit(s => { removeCtoon(id); const code = makeGiftCode(id); log(`Gift code created for ${BY_ID[id].name}.`); return code; });
}

// ---- Prize cToons ----
export function checkPrizes(s = state) {
  const award = (id) => { if (!s.prizes.includes(id)) { s.prizes.push(id); addCtoon(id); log(`PRIZE unlocked: ${BY_ID[id].name}!`); return id; } return null; };
  const unique = Object.keys(s.collection).filter(id => s.collection[id] > 0).length;
  const got = [];
  if (s.daily.streak >= 7) { const p = award('pz02'); if (p) got.push(p); }
  if (unique >= 40)        { const p = award('pz03'); if (p) got.push(p); }
  if (s.stats.trades >= 10){ const p = award('pz04'); if (p) got.push(p); }
  if (s.stats.wins >= 25)  { const p = award('pz05'); if (p) got.push(p); }
  if (s.beaten.includes('master')) { const p = award('pz06'); if (p) got.push(p); }
  return got[0] || null;
}

export function catalogProgress() {
  const total = CTOONS.length;
  return { have: uniqueOwned(), total };
}

// ---- Front page featured code (rotates daily) ----
export function featuredCode() {
  const rnd = seededRng('featured:' + todayKey());
  return FEATURED_CODES[Math.floor(rnd() * FEATURED_CODES.length)];
}

// ---- Visitable NPC cZones (generated daily from a seed) ----
export function npcZones() {
  const rnd = seededRng('zones:' + todayKey());
  return NPC_ZONES.map(z => {
    const n = 5 + Math.floor(rnd() * 6);
    const items = [];
    for (let i = 0; i < n; i++) {
      const pool = PACKABLE.filter(t => t.rarity <= (rnd() < 0.15 ? 4 : 2));
      items.push({ id: pool[Math.floor(rnd() * pool.length)].id, x: 0.05 + rnd() * 0.78, y: 0.05 + rnd() * 0.7 });
    }
    return { ...z, items, rating: items.reduce((s, it) => s + BY_ID[it.id].points, 0) };
  });
}

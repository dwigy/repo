// All screens and interactions, styled after the 2003 Cartoon Orbit site.
// Rendering is string templates plus one delegated click handler keyed on
// data-action attributes.
import { CTOONS, BY_ID, SERIES, RARITY, COLORS, PACKS, OPPONENTS, BACKGROUNDS, CHARACTERS, EDITIONS, MYTHIC, LEGENDARY, TRAIN_WINS, POWER_NAMES, powerText } from './data.js';
import { ZONES, NODES, zoneOf, PROLOGUE, EPILOGUE, ruleText, goalText, deckText } from './campaign.js';
import { openPack } from './pack.js';
import { play as snd, setEnabled as setSound } from './sound.js';
import { tokenSVG, shadowTokenSVG, socketSVG, badgeSVG, characterSVG, packSVG, zoneBadgeSVG } from './art.js';
import { APP_VERSION, NEWS, ROADMAP } from './news.js';
import { state, commit, exportCode, parseSaveCode, replaceState, resetState, todayKey } from './store.js';
import * as G from './game.js';
import * as B from './gtoons.js';
import { getArt, artEnabled, setCustomArt, clearCustomArt, refreshWiki, forgetWiki } from './artwork.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => n.toLocaleString();

// navigation: section -> sub tab
let section = 'home';
const subs = { home: 'main', collection: 'binder', battle: 'tour', market: 'cmart', profile: 'me' };
let zoneMode = 'mine';     // mine | visit (inside Collection > cZone)
let tourZone = null;       // zone index shown on the Tour page
let binderFocus = null;    // character key to scroll to after the binder renders
let verTaps = 0, verTapAt = 0;
let binderFilter = 'all';
let binderTier = 'all'; // all | mythic | legendary
let match = null;
let selectedHand = -1;
let pendingLand = null;   // {who, slot} socket that just received a chip
let pendingHits = {};     // 'p3' -> 'up'|'down' sockets whose totals changed
let lastTotals = null;    // {a, b} for the rolling score counters
let busy = false;         // true while a chip is in the air
let zonePick = false;
let visitIndex = 0;
let installDismissed = false;
try { installDismissed = sessionStorage.getItem('installDismissed') === '1'; } catch { /* ignore */ }

// ---------- sound (see sound.js) ----------
const packSfx = (kind) => snd(kind);
const sfx = { tap: () => snd('tap'), good: () => snd('good'), great: () => snd('great'), bad: () => snd('bad') };

// ---------- shared components ----------
const rtag = (t) => `<span class="rtag" style="--rc:${RARITY[t.rarity].color}">${RARITY[t.rarity].name}</span>`;
const ctag = (t) => `<span class="ctag" style="--cc:${COLORS[t.color].hex}">${COLORS[t.color].name}</span>`;

// Circular token with a label box beneath, like the cZones page.
function tokenHTML(t, opts = {}) {
  const owned = opts.owned ?? true;
  const cls = ['tok', owned ? '' : 'unowned', opts.selected ? 'selected' : '', opts.small ? 'small' : ''].join(' ');
  const count = opts.count > 1 ? `<span class="tok-count">x${opts.count}</span>` : '';
  const svg = owned ? tokenSVG(t, 100, { bubble: opts.bubble !== false, label: opts.label }) : shadowTokenSVG(t);
  return `<div class="${cls}" data-action="${opts.action || 'detail'}" data-id="${t.id}" ${opts.data || ''}>
    <div class="tok-art">${svg}${count}</div>
    <div class="tok-label">${owned ? esc(opts.name || t.short || t.name) : '???'}</div>
    ${owned && t.edShort && t.edShort !== 'Classic' && t.edShort !== 'Prize' ? `<div class="tok-ed" style="--rc:${RARITY[t.rarity].color}">${esc(t.edShort)}</div>` : ''}
  </div>`;
}

function siteHeader() { return ''; }

const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
  binder: '<svg viewBox="0 0 24 24"><circle cx="7.5" cy="7.5" r="3.6"/><circle cx="16.5" cy="7.5" r="3.6"/><circle cx="7.5" cy="16.5" r="3.6"/><circle cx="16.5" cy="16.5" r="3.6"/></svg>',
  battle: '<svg viewBox="0 0 24 24"><path d="M5 4l13 13"/><path d="M19 4 6 17"/><path d="M4 20l3-3M20 20l-3-3"/><path d="M14.5 15.5l3 3M9.5 15.5l-3 3"/><path d="M5 4h3.5M5 4v3.5M19 4h-3.5M19 4v3.5"/></svg>',
  pack: '<svg viewBox="0 0 24 24"><path d="M7 3.5h10l1 3v14H6v-14z"/><path d="M6 6.5h12"/><path d="M12 6.5v14"/><path d="M9.5 3.5v3M14.5 3.5v3"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/></svg>',
};
const SECTIONS = [
  ['home',       'HOME',       ICON.home],
  ['collection', 'COLLECTION', ICON.binder],
  ['battle',     'BATTLE',     ICON.battle],
  ['market',     'MARKET',     ICON.pack],
  ['profile',    'PROFILE',    ICON.user],
];
const SUBTABS = {
  home:       [],
  collection: [['binder', 'BINDER'], ['sets', 'SETS'], ['czone', 'cZONE']],
  battle:     [['tour', 'THE TOUR'], ['arena', 'LADDER'], ['deck', 'MY DECK'], ['rules', 'HOW TO PLAY']],
  market:     [['cmart', 'cMART'], ['auction', 'AUCTION'], ['codes', 'CODES']],
  profile:    [['me', 'PROFILE'], ['settings', 'SETTINGS'], ['device', 'DEVICE']],
};
function subtabsFor(sec) { const t = SUBTABS[sec] || []; return sec === 'profile' && state.settings.debug ? [...t, ['debug', 'DEBUG']] : t; }
const wallet = () => `<div class="wallet ${state.unlimited ? 'inf' : ''}" data-action="go" data-to="market" data-sub="cmart"><span>POINTS</span><b>${state.unlimited ? '∞' : fmt(state.points)}</b></div>`;

function orbitFrame(inner) {
  const tabs = subtabsFor(section);
  const sub = tabs.length ? `<div class="subnav">${tabs.map(([k, n]) => `<button class="stab ${subs[section] === k ? 'on' : ''}" data-action="sub" data-id="${k}">${n}</button>`).join('')}</div>` : '';
  return `<div class="frame ${tabs.length ? '' : 'nosub'}">
    <div class="orbit-head">
      <div class="orbit-row"><div class="orbit-logo" data-action="go" data-to="home">CARTOON <span class="o">O</span>RBIT<i>®</i></div>${wallet()}</div>
      ${sub}
    </div>
    <div class="content">${inner}</div>
  </div>
  <nav class="leftnav">${SECTIONS.map(([k, n, ic]) => `<button class="lnav ${k === 'battle' ? 'battle' : ''} ${section === k ? 'on' : ''}" data-action="go" data-to="${k}"><i>${ic}</i><span>${n}</span></button>`).join('')}</nav>`;
}

// ---------- modal & toast ----------
export function showModal(html, cls = '') {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-back" data-action="closeModal"></div><div class="modal panel ${cls}">${html}</div>`;
  m.hidden = false;
}
export function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }
let toastTimer = null;
export function toast(text, ms = 2200) {
  const t = $('#toast'); t.textContent = text; t.hidden = false; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.classList.remove('show'); t.hidden = true; }, ms);
}
function isIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function isStandalone() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }

// ---------- ORBIT (front page) ----------
function skyFor(h) {
  if (h < 6) return ['#0b1b3a', '#1f3d7a', '#0d2350'];
  if (h < 9) return ['#f7c9a6', '#8fb8e8', '#2f5fa8'];
  if (h < 17) return ['#eaf4ff', '#9ac6f2', '#3a7fd6'];
  if (h < 20) return ['#ffd2a1', '#b788d8', '#2e3f8a'];
  return ['#0b1b3a', '#1f3d7a', '#0d2350'];
}
function streakOrbs() {
  const n = state.daily.streak;
  return `<div class="orbs">${Array.from({ length: 7 }, (_, i) => `<i class="${i < Math.min(7, n) ? 'on' : ''}"></i>`).join('')}<b>${n >= 7 ? n + ' DAYS' : n ? 'DAY ' + n : 'START'}</b></div>`;
}
function hourNow() { const h = state.settings.debugHour; return typeof h === 'number' ? h : new Date().getHours(); }
const nextOpponent = () => OPPONENTS.find(o => !state.beaten.includes(o.id)) || OPPONENTS[OPPONENTS.length - 1];
const byRank = (a, b) => (b.rarity - a.rarity) || (b.pts - a.pts);

// Hero: this week's featured series as a fan of chips, the best one you own in the middle.
function seriesHero() {
  const key = G.featuredSeriesKey(); const s = SERIES[key];
  const all = CTOONS.filter(t => t.series === key);
  const owned = all.filter(t => G.ownedCount(t.id) > 0);
  const ownedRank = owned.slice().sort(byRank), allRank = all.slice().sort(byRank);
  const showT = BY_ID[G.showcaseId()];
  const centre = showT && showT.series === key && G.ownedCount(showT.id) > 0 ? showT : (ownedRank[0] || allRank[0]);
  const picks = [centre]; const chars = new Set([centre.char]);
  for (const t of ownedRank.concat(allRank)) { if (picks.length >= 5) break; if (chars.has(t.char)) continue; picks.push(t); chars.add(t.char); }
  const order = [picks[3], picks[1], picks[0], picks[2], picks[4]].filter(Boolean);
  const mid = Math.floor(order.length / 2);
  const sky = skyFor(hourNow());
  const stars = Object.values(CHARACTERS).filter(c => c.series === key).length;
  return `<section class="hero" style="--s1:${sky[0]};--s2:${sky[1]};--s3:${sky[2]}">
      <div class="hero-kicker">THIS WEEK IN ORBIT</div>
      <div class="hero-fan">${order.map((t, i) => { const k = i - mid; const own = G.ownedCount(t.id) > 0;
        return `<div class="fan ${k === 0 ? 'centre' : ''}" style="--i:${k};--z:${5 - Math.abs(k)}" data-action="detail" data-id="${t.id}">${own ? tokenSVG(t, 150, { bubble: false }) : shadowTokenSVG(t, 150)}</div>`; }).join('')}</div>
      <div class="hero-name">${esc(s.name)}</div>
      <div class="hero-sub">${owned.length}/${all.length} COLLECTED · ${stars} STARS</div>
      <button class="obtn primary big" data-action="binderSeries" data-id="${key}">OPEN THE BINDER</button>
    </section>`;
}
function todayCard() {
  const today = todayKey();
  const dailyDone = state.daily.last === today, freeDone = state.dailyFree === today, played = state.lastBattle === today;
  const free = G.dailyFreeCtoon(); const nextOp = nextOpponent();
  const goals = G.todaysQuests().map(q => { const p = G.questProgress(q); const done = state.quests.claimed.includes(q.id); const ready = !done && p >= q.goal;
    return `<div class="goal ${done ? 'done' : ''}"><span>${esc(q.text)}</span>${ready ? `<button class="obtn small primary" data-action="claimQuest" data-id="${q.id}">+${q.reward}</button>` : `<b>${done ? '✓' : p + '/' + q.goal}</b>`}</div>`; }).join('');
  return `<div class="panel today">
      <div class="row between"><div class="ptab">TODAY</div>${streakOrbs()}</div>
      <div class="ritual">
        <div class="rit ${dailyDone ? 'done' : ''}"><i>${dailyDone ? '✓' : '1'}</i><div><b>Daily bonus</b><span>${dailyDone ? 'Claimed' : '+' + G.nextDailyAmount() + ' points'}</span></div>${dailyDone ? '' : '<button class="obtn small primary" data-action="claimDaily">CLAIM</button>'}</div>
        <div class="rit ${freeDone ? 'done' : ''}"><i>${freeDone ? '✓' : '2'}</i><div class="mini-tok">${tokenSVG(free, 40, { bubble: false })}</div><div><b>Free chip</b><span>${esc(free.short)}</span></div>${freeDone ? '' : '<button class="obtn small primary" data-action="claimFree">TAKE</button>'}</div>
        <div class="rit ${played ? 'done' : ''}"><i>${played ? '✓' : '3'}</i><div><b>One battle</b><span>${played ? 'Played' : 'vs ' + esc(nextOp.name)}</span></div>${played ? '' : '<button class="obtn small" data-action="go" data-to="battle">GO</button>'}</div>
      </div>
      <div class="goals">${goals}</div>
    </div>`;
}
const ticketSVG = () => `<svg viewBox="0 0 64 44" width="64" height="44"><defs><linearGradient id="tkt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dfe7ef"/></linearGradient></defs><path d="M4 6h56v10a6 6 0 0 0 0 12v10H4V28a6 6 0 0 0 0-12z" fill="url(#tkt)" stroke="#14356d" stroke-width="2"/><path d="M14 16h36M14 22h36M14 28h24" stroke="#2f7ff5" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 5"/></svg>`;
function menuTiles() {
  const nextOp = nextOpponent(); const show = BY_ID[G.showcaseId()];
  const offers = G.todaysTrades(); const open = offers.filter(o => !G.tradeDoneToday(o.idx)).length;
  const zoneN = state.czone.items.length;
  const tiles = [
    { to: 'market', sub: 'cmart', title: 'RIP A PACK', line: G.canAfford(PACKS[0].price) ? `FROM ${fmt(PACKS[0].price)} PTS` : `${fmt(PACKS[0].price - state.points)} PTS TO GO`, art: packSVG(PACKS[0], { size: 52 }) },
    { to: 'battle', sub: 'tour', title: 'THE TOUR', line: G.tourComplete() ? 'REEL RESTORED' : `ZONE ${G.tourZoneIndex() + 1} · ${esc(ZONES[G.tourZoneIndex()].name).toUpperCase()}`, art: zoneBadgeSVG(ZONES[G.tourZoneIndex()], 64, true) },
    { to: 'collection', sub: 'binder', title: 'MY BINDER', line: `${G.uniqueOwned()}/${CTOONS.length} cTOONS`, art: tokenSVG(show, 64, { bubble: false }) },
    { to: 'collection', sub: 'czone', title: 'MY cZONE', line: zoneN ? `${zoneN} ON DISPLAY` : 'NOTHING ON DISPLAY', art: zoneN ? badgeSVG(BY_ID[state.czone.items[0].id], 64) : socketSVG(64) },
    { to: 'market', sub: 'auction', title: 'AUCTION', line: open ? `${open} OFFER${open > 1 ? 'S' : ''} TODAY` : 'ALL TRADED', art: tokenSVG(BY_ID[offers[0].get], 64, { bubble: false }) },
    { to: 'market', sub: 'codes', title: 'ORBIT CODES', line: `TODAY: ${G.featuredCode()}`, art: ticketSVG() },
  ];
  return `<div class="tiles">${tiles.map(t => `<button class="tile" data-action="go" data-to="${t.to}" data-sub="${t.sub}"><div class="tile-art">${t.art}</div><b>${t.title}</b><span>${t.line}</span></button>`).join('')}</div>`;
}
const roadmapRows = (list) => list.map(r => `<div class="rm"><i class="${r.k}">${r.k.toUpperCase()}</i><div><b>${esc(r.title)}</b><span>${esc(r.note)}</span></div></div>`).join('');
function newsCard() {
  const n = NEWS[0];
  return `<div class="panel news">
      <div class="row between"><div class="ptab">WHAT'S NEW</div><span class="ver">v${APP_VERSION}</span></div>
      <div class="news-title">${esc(n.title)}</div>
      <ul class="news-list">${n.items.slice(0, 3).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <div class="ptab grey">COMING UP</div>
      <div class="roadmap">${roadmapRows(ROADMAP.filter(r => r.k !== 'idea').slice(0, 3))}</div>
      <button class="obtn grey block" data-action="allNews">ALL UPDATES</button>
    </div>`;
}
function newsModal() {
  showModal(`<div class="ptab">ORBIT UPDATES</div>
    <div class="updates tall">${NEWS.map(n => `<div class="rel"><div class="rel-head"><b>v${n.v}</b><span>${esc(n.title)}</span><em>${n.date}</em></div><ul class="news-list">${n.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
      <div class="ptab grey">COMING UP</div><div class="roadmap">${roadmapRows(ROADMAP)}</div></div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
function homeView() {
  const install = (!isStandalone() && !installDismissed) ? `<div class="panel slim row between"><div><b>ADD TO HOME SCREEN</b><div class="small">${isIOS() ? 'Share, then Add to Home Screen.' : 'Open in Safari on iPhone.'}</div></div><div class="row"><button class="obtn small" data-action="go" data-to="profile" data-sub="device">HOW</button><button class="obtn small grey" data-action="dismissInstall">LATER</button></div></div>` : '';
  return `${seriesHero()}
    <div class="notice" data-action="go" data-to="market" data-sub="codes"><i>TODAY</i><span>Featured code ${G.featuredCode()} · +150 points</span><em>›</em></div>
    ${todayCard()}${menuTiles()}${newsCard()}${install}`;
}

// ---------- COLLECT ----------
function binderView() {
  const tabs = [['all', 'ALL'], ...Object.entries(SERIES).map(([k, s]) => [k, s.name.toUpperCase()])];
  const ownedIn = (k) => CTOONS.filter(t => (k === 'all' || t.series === k) && G.ownedCount(t.id) > 0).length;
  const totalIn = (k) => CTOONS.filter(t => k === 'all' || t.series === k).length;
  const tierOk = (t) => binderTier === 'all' || (binderTier === 'mythic' && t.rarity === MYTHIC) || (binderTier === 'legendary' && t.rarity === LEGENDARY);
  const chars = Object.entries(CHARACTERS).filter(([, c]) => binderFilter === 'all' || c.series === binderFilter);
  const sets = chars.filter(([k]) => CTOONS.filter(t => t.char === k).every(t => G.ownedCount(t.id) > 0)).length;
  const blocks = chars.map(([key, c]) => {
    const eds = CTOONS.filter(t => t.char === key);
    const have = eds.filter(t => G.ownedCount(t.id) > 0).length;
    const shown = eds.filter(tierOk);
    if (!shown.length) return '';
    return `<div class="charset ${have === eds.length ? 'complete' : ''}" id="cs-${key}">
      <div class="charset-head"><div><b>${esc(c.name)}</b><span class="small">${esc(SERIES[c.series].name)} · ${c.year}</span></div>
        <div class="charset-meter">${eds.map(t => `<i style="--rc:${RARITY[t.rarity].color}" class="${G.ownedCount(t.id) > 0 ? 'on' : ''}"></i>`).join('')}<b>${have}/${eds.length}</b>${have === eds.length ? '<span class="setbadge">SET COMPLETE</span>' : ''}</div></div>
      <div class="tokgrid">${shown.map(t => tokenHTML(t, { owned: G.ownedCount(t.id) > 0, count: G.ownedCount(t.id) })).join('')}</div>
    </div>`;
  }).join('');
  const prizes = (binderFilter === 'all' || binderFilter === 'pz') && binderTier === 'all' ? `<div class="charset"><div class="charset-head"><div><b>Orbit Prizes</b><span class="small">Earn only</span></div></div><div class="tokgrid">${CTOONS.filter(t => t.series === 'pz').map(t => tokenHTML(t, { owned: G.ownedCount(t.id) > 0, count: G.ownedCount(t.id) })).join('')}</div></div>` : '';
  return `<div class="panel">
    <div class="ptab">MY BINDER <em>${G.uniqueOwned()}/${CTOONS.length} cTOONS · ${sets} SETS</em></div>
    <div class="chips scroll">${tabs.map(([k, n]) => `<button class="chip ${binderFilter === k ? 'on' : ''}" data-action="binderFilter" data-id="${k}">${n} <em>${ownedIn(k)}/${totalIn(k)}</em></button>`).join('')}</div>
    <div class="chips tiers">${[['all', 'ALL TIERS', '#5d6f88'], ['mythic', 'MYTHIC', RARITY[MYTHIC].color], ['legendary', 'LEGENDARY', RARITY[LEGENDARY].color]].map(([k, n, col]) => `<button class="chip tier ${binderTier === k ? 'on' : ''}" style="--tc:${col}" data-action="binderTier" data-id="${k}">${n}</button>`).join('')}</div>
    ${binderFilter !== 'all' && SERIES[binderFilter] ? `<div class="series-blurb">${esc(SERIES[binderFilter].blurb)}</div>` : ''}
    ${blocks}${prizes}
  </div>`;
}
function setsView() {
  const chars = Object.entries(CHARACTERS).map(([key, c]) => { const eds = CTOONS.filter(t => t.char === key); const have = eds.filter(t => G.ownedCount(t.id) > 0); return { key, c, eds, have }; });
  chars.sort((a, b) => (b.have.length - a.have.length) || a.c.name.localeCompare(b.c.name));
  const done = chars.filter(x => x.have.length === x.eds.length).length;
  return `<div class="panel">
    <div class="ptab">SETS <em>${done}/${chars.length} COMPLETE</em></div>
    <p class="note">Eight editions per star. Finish a set and it earns its poster.</p>
    <div class="sets">${chars.map(({ key, c, eds, have }) => { const best = have.slice().sort(byRank)[0]; const complete = have.length === eds.length;
      return `<button class="setcard ${complete ? 'complete' : ''}" data-action="binderChar" data-id="${key}">
        <div class="setcard-art">${best ? tokenSVG(best, 96, { bubble: false }) : shadowTokenSVG(eds[0], 96)}</div>
        <b>${esc(c.name)}</b><span>${esc(SERIES[c.series].name)}</span>
        <div class="charset-meter">${eds.map(t => `<i style="--rc:${RARITY[t.rarity].color}" class="${G.ownedCount(t.id) > 0 ? 'on' : ''}"></i>`).join('')}</div>
        <em>${complete ? 'SET COMPLETE' : have.length + '/' + eds.length}</em></button>`; }).join('')}</div>
  </div>`;
}
function detailModal(id) {
  const t = BY_ID[id]; const n = G.ownedCount(id); const s = SERIES[t.series];
  const inDeck = state.deck.filter(d => d === id).length;
  const inZone = state.czone.items.filter(it => it.id === id).length;
  const actions = [];
  if (n > 0) {
    if (inDeck < n && state.deck.length < 12) actions.push(`<button class="obtn" data-action="deckAdd" data-id="${id}">ADD TO DECK</button>`);
    if (inDeck > 0) actions.push(`<button class="obtn grey" data-action="deckRemove" data-id="${id}">REMOVE FROM DECK</button>`);
    if (inZone < n) actions.push(`<button class="obtn" data-action="zoneAdd" data-id="${id}">PUT IN cZONE</button>`);
    if (n > 1 && t.series !== 'pz') actions.push(`<button class="obtn grey" data-action="recycle" data-id="${id}">RECYCLE 1 (+${RARITY[t.rarity].recycle})</button>`);
    if (t.series !== 'pz') actions.push(`<button class="obtn grey" data-action="gift" data-id="${id}">GIFT TO A FRIEND</button>`);
  }
  const prov = (state.prov || {})[id];
  const srcName = { pack: 'a cPack', free: 'the free daily chip', trade: 'the Auction', gift: 'a gift', code: 'an Orbit Code', starter: 'your starter pack', prize: 'a prize' };
  if (n > 0 && t.series !== 'pz') actions.push(`<button class="obtn small ${state.showcase === id ? '' : 'grey'}" data-action="showcase" data-id="${id}">${state.showcase === id ? 'ON FRONT PAGE' : 'FEATURE ON FRONT PAGE'}</button>`);
  showModal(`<div class="detail">
      <div class="ptab">cTOON DETAILS</div>
      <div class="detail-top">
        <div class="tilt" id="tilt"><div class="tilt-in"><div class="tilt-face">${n ? tokenSVG(t, 150) : shadowTokenSVG(t, 150)}</div><div class="tilt-back">${n ? `<div class="back-card" style="--rc:${RARITY[t.rarity].color}"><b>No. ${prov ? String(prov.mint).padStart(4, '0') : '----'}</b><span>${prov ? new Date(prov.t).toLocaleDateString() : ''}</span><span>${prov ? 'from ' + (srcName[prov.src] || prov.src) : ''}</span><em>ORBIT</em></div>` : ''}</div></div>${n ? '<button class="flipbtn" data-action="flipDetail">FLIP</button>' : ''}</div>
        <div class="detail-info">
          <h2>${n ? esc(t.name) : '???'}</h2>
          <div class="row wrap"><span class="stag">${esc(s.name)}</span>${rtag(t)}${t.edition && t.edition !== 'Prize' ? `<span class="etag">${esc(t.edition)}</span>` : ''}</div>
          <div class="statline"><span>VALUE</span><b>${t.points}</b><span>gTOON</span><b>${t.pts}</b>${ctag(t)}</div>
        </div>
      </div>
      ${n ? `<p class="blurb">“${esc(t.blurb)}”</p>` : '<p class="blurb muted">Not in your binder yet. Find it in cPacks, trades or by winning gToons.</p>'}
      <div class="power"><span>POWER</span> <b>${POWER_NAMES[t.power.t] || ''}</b> ${esc(powerText(t.power))}</div>
      ${t.secret ? `<div class="power secret ${G.isAwake(id) ? '' : 'locked'}"><span>SECRET</span> ${G.isAwake(id) ? `<b>${POWER_NAMES[t.secret.t] || ''}</b> ${esc(powerText(t.secret))}` : `Wakes after ${TRAIN_WINS} wins on the board · ${Math.min(TRAIN_WINS, G.trainedWins(id))}/${TRAIN_WINS}`}</div>` : ''}
      <div class="small">Owned ${n} · In deck ${inDeck} · In cZone ${inZone}</div>
      <div class="row wrap">${actions.join('')}</div>
      ${artSection(t)}
      <div class="byline">Portrait drawn for Cartoon Orbit · ${esc(SERIES[t.series].name)} · ${t.year}</div>
      <button class="obtn grey block" data-action="closeModal">CLOSE</button>
    </div>`);
  bindTilt();
}
function bindTilt() {
  const el = $('#tilt'); if (!el) return;
  const inner = el.querySelector('.tilt-in');
  let down = false, moved = false;
  el.addEventListener('pointerdown', (e) => { if (e.target.closest('.flipbtn')) return; down = true; moved = false; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => {
    if (!down) return; moved = true;
    const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${(x * 40).toFixed(1)}deg) rotateX(${(-y * 40).toFixed(1)}deg)`;
    inner.style.setProperty('--gx', `${50 + x * 60}%`); inner.style.setProperty('--gy', `${50 + y * 60}%`);
  });
  const up = () => { if (!down) return; down = false; inner.style.transform = ''; if (!moved) { inner.classList.remove('bounce'); void inner.offsetWidth; inner.classList.add('bounce'); snd('clink'); } };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
}
function artSection(t) {
  if (!t.char || t.series === 'pz') return '';
  const a = getArt(t.char);
  let line;
  if (a?.custom) line = 'Artwork: your own image (stored on this device).';
  else if (a?.src && artEnabled()) line = `Artwork: Wikimedia Commons file <a href="${esc(a.page || a.src)}" target="_blank" rel="noopener">${esc(a.file || 'image')}</a>.`;
  else if (!artEnabled()) line = 'Artwork: drawn portrait (real artwork is switched off in Settings).';
  else line = 'Artwork: drawn portrait. Real artwork appears when a free-licensed image is found on Wikimedia Commons (needs internet once).';
  return `<div class="artbox"><div class="small">${line}</div>
    <div class="row wrap"><label class="obtn small">USE MY OWN IMAGE<input type="file" accept="image/*" hidden data-char="${t.char}" class="artfile"></label>
    ${a?.custom ? `<button class="obtn small grey" data-action="clearArt" data-id="${t.char}">REMOVE MY IMAGE</button>` : ''}</div></div>`;
}

function cmartView() {
  const free = G.dailyFreeCtoon(); const freeDone = state.dailyFree === todayKey();
  return `<div class="panel">
    <div class="ptab">cMART <em>YOUR 24-HOUR ORBIT MARKETPLACE</em></div>
    <div class="promo free-promo ${freeDone ? 'done' : ''}"><div class="row"><div class="promo-tok">${tokenSVG(free, 72)}</div><div><div class="promo-title">FREE cTOON OF THE DAY</div><p>${esc(free.name)} · ${RARITY[free.rarity].name}</p>${freeDone ? '<span class="okchip">COLLECTED</span>' : '<button class="obtn hot" data-action="claimFree">TAKE IT</button>'}</div></div></div>
    ${PACKS.map(p => `<div class="pack ${p.id}">
      <div class="pack-art">${packSVG(p, { size: 58 })}</div>
      <div class="pack-info"><b>${esc(p.name).toUpperCase().replace('CPACK', 'cPACK')}</b><div class="small">${esc(p.desc)}</div>
        <div class="odds">${p.odds.map((o, i) => `<span style="--rc:${RARITY[i].color}">${RARITY[i].name.split(' ').map(w => w[0]).join('')} ${(o * 100).toFixed(o < 0.01 ? 1 : 0)}%</span>`).join('')}</div></div>
      <button class="obtn ${G.canAfford(p.price) ? 'hot' : ''}" data-action="buyPack" data-id="${p.id}" ${G.canAfford(p.price) ? '' : 'disabled'}>${state.unlimited ? 'FREE' : fmt(p.price) + ' PTS'}</button>
    </div>`).join('')}
    <p class="note">Earn points from the daily bonus, quests, gToons wins and by recycling duplicate cToons.</p>
  </div>`;
}
function revealModal(ids, title = 'YOU GOT…') {
  showModal(`<div class="reveal"><div class="ptab">${esc(title)}</div>
    <div class="reveal-toks">${ids.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${tokenHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>
    <button class="obtn block" data-action="closeModal">SWEET!</button></div>`);
  Math.max(...ids.map(id => BY_ID[id].rarity)) >= 3 ? sfx.great() : sfx.good();
}
function auctionView() {
  const offers = G.todaysTrades();
  return `<div class="panel">
    <div class="ptab">AUCTION <em>TRADES REFRESH DAILY</em></div>
    ${offers.map(o => { const give = BY_ID[o.give], get = BY_ID[o.get]; const have = G.ownedCount(o.give); const done = G.tradeDoneToday(o.idx);
      return `<div class="trade ${done ? 'done' : ''}">
        <div class="trader">${esc(o.trader.name).toUpperCase()} <em>“${esc(o.trader.line)}”</em></div>
        <div class="trade-row">
          <div class="trade-side">${tokenHTML(give, { count: 0, label: o.giveN + '×' })}<div class="small">YOU GIVE (HAVE ${have})</div></div>
          <div class="arrow">➜</div>
          <div class="trade-side">${tokenHTML(get, { count: 0 })}<div class="small">YOU GET</div></div>
          ${done ? '<span class="okchip">TRADED</span>' : `<button class="obtn ${have >= o.giveN ? 'hot' : ''}" data-action="trade" data-i="${o.idx}" ${have >= o.giveN ? '' : 'disabled'}>TRADE</button>`}
        </div></div>`; }).join('')}
    <p class="note">Trading with a real friend? Open a cToon in your Binder and choose <b>GIFT TO A FRIEND</b> to make a code they redeem under Market → Codes.</p>
  </div>`;
}

// ---------- COMPETE ----------
// ---------- THE ORBIT TOUR ----------
function tourMap(cur) {
  const c = state.campaign;
  const pts = [];
  for (let i = 0; i < 9; i++) pts.push([50 + 34 * Math.sin(i * 1.15 + 0.6), 6 + i * 11]);
  const d = pts.map((p, i) => i === 0 ? `M${p[0]} ${p[1]}` : `C${pts[i - 1][0]} ${pts[i - 1][1] + 5.5},${p[0]} ${p[1] - 5.5},${p[0]} ${p[1]}`).join(' ');
  const stops = ZONES.map((z, i) => { const [x, y] = pts[i + 1]; const lit = c.badges.includes(z.id); const un = G.zoneUnlocked(z); const right = x < 50;
    return `<div class="stop ${i === cur && !G.tourComplete() ? 'cur' : ''}" style="left:${x}%;top:${y}%" data-action="tourZone" data-id="${i}">${zoneBadgeSVG(z, 48, lit || un)}</div>
      <div class="stop-lbl ${un ? '' : 'locked'}" style="top:${y}%;${right ? `left:calc(${x}% + 32px)` : `right:calc(${100 - x}% + 32px)`}" data-action="tourZone" data-id="${i}">${esc(z.name)}</div>`; }).join('');
  return `<div class="tourmap"><svg class="track" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#c8d4e1" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/></svg>
    <div class="station" style="left:${pts[0][0]}%;top:${pts[0][1]}%">ORBIT STATION</div>${stops}<div class="station" style="left:${pts[8][0]}%;top:${pts[8][1]}%">ORBIT STATION</div></div>`;
}
function tourNodeCard(n) {
  const st = G.nodeStatus(n); const times = G.timesCleared(n);
  const kind = n.kind === 'keeper' ? 'KEEPER' : n.kind === 'spar' ? 'SPARRING' : 'CHALLENGE';
  const goal = n.kind === 'spar' ? '' : goalText(n.goal); const dk = deckText(n.deck);
  const line = st === 'done' ? (n.kind === 'spar' ? `SPARRED ×${times}` : `CLEARED${times > 1 ? ' ×' + times : ''}`) : st === 'locked' ? (n.kind === 'keeper' ? 'CLEAR BOTH CHALLENGES FIRST' : 'LOCKED') : [goal, dk].filter(Boolean).join(' · ') || `+${n.reward.points} PTS`;
  return `<div class="tnode ${st} ${n.kind}" data-action="tourNode" data-id="${n.id}">
    <div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div>
    <div class="tnode-info"><span class="tnode-kind">${kind}${n.kicker ? ' · ' + esc(n.kicker) : ''}</span><b>${esc(n.name)}</b><em>${line}</em></div>
    <span class="tnode-go">${st === 'done' ? '✓' : st === 'locked' ? '·' : '›'}</span>
  </div>`;
}
function tourView() {
  const c = G.ensureCampaign(); const cur = G.tourZoneIndex();
  if (tourZone == null || tourZone > cur) tourZone = cur;
  const z = ZONES[tourZone]; const un = G.zoneUnlocked(z); const complete = G.tourComplete();
  const frames = `<div class="frames">${ZONES.map((zz, i) => `<div class="frame-slot ${c.badges.includes(zz.id) ? 'lit' : ''}" data-action="tourZone" data-id="${i}">${zoneBadgeSVG(zz, 40, c.badges.includes(zz.id))}</div>`).join('')}</div>`;
  return `<section class="tour-head" style="--s1:${z.sky[0]};--s2:${z.sky[1]};--s3:${z.sky[2]}">
      <div class="hero-kicker">THE ORBIT TOUR · ${complete ? 'THE REEL IS WHOLE' : c.badges.length + '/7 FRAMES'}</div>
      ${frames}
      <div class="tour-zone-name">${esc(z.name)}</div>
      <div class="tour-zone-place">${esc(z.place)}</div>
      ${z.tagline ? `<div class="tour-tag">“${esc(z.tagline)}”</div>` : ''}
    </section>
    <div class="panel">
      <div class="ptab">ZONE ${z.n} OF 7 <em>${un ? (c.badges.includes(z.id) ? 'FRAME WON' : 'OPEN') : 'LOCKED · WIN THE FRAME BEFORE IT'}</em></div>
      <div class="tnodes">${z.nodes.map(tourNodeCard).join('')}</div>
    </div>
    <div class="panel"><div class="ptab">THE ROUTE</div>${tourMap(cur)}<p class="note">Orbit Station to Orbit Station. Tap a stop.</p></div>`;
}
function tourNodeModal(id) {
  const n = NODES[id]; if (!n) return; const st = G.nodeStatus(n); const chk = G.deckCheck(n);
  const who = n.kind === 'challenge' ? n.opponent : n.name; const title = n.kind === 'keeper' ? n.title : n.kind === 'spar' ? 'SPARRING PARTNER' : 'CHALLENGER';
  const rules = ruleText(n.rules); const sig = n.pool.fixed ? n.pool.fixed.slice(0, 4) : [];
  const cols = n.pool.fixed ? B.topColors(n.pool.fixed) : [];
  const packName = n.reward.pack ? PACKS.find(p => p.id === n.reward.pack).name : '';
  const rc = n.reward.chip ? BY_ID[n.reward.chip] : null;
  const playable = st !== 'locked' && chk.ok;
  showModal(`<div class="scout">
    <div class="scout-top"><div class="scout-av">${st === 'locked' ? socketSVG(110) : tokenSVG(BY_ID[n.avatar], 110, { bubble: false })}</div><div><div class="scout-kind">${title}</div><div class="scout-name">${esc(who)}</div>${(n.taunt || n.intro) ? `<div class="scout-line">“${esc(n.taunt || n.intro)}”</div>` : ''}</div></div>
    <div class="ptab">${esc(n.name).toUpperCase()}</div>
    ${n.kicker ? `<div class="kicker">${esc(n.kicker)}</div>` : ''}
    <div class="scout-rows">
      <div><span>GOAL</span><b>${goalText(n.goal)}</b></div>
      ${rules.length ? `<div><span>HOUSE RULES</span><b>${rules.join(' ')}</b></div>` : ''}
      ${n.deck ? `<div><span>YOUR DECK</span><b>${deckText(n.deck)}</b></div>` : ''}
      ${n.pool.mirror ? '<div><span>THEY BRING</span><b>A COPY OF YOUR DECK</b></div>' : sig.length ? `<div><span>THEY BRING</span><b class="sig">${sig.map(i => tokenSVG(BY_ID[i], 36, { bubble: false })).join('')}</b></div>` : ''}
      ${cols.length ? `<div><span>THEY LEAN</span><b>${cols.map(k => `<span class="ctag" style="--cc:${COLORS[k].hex}">${COLORS[k].name}</span>`).join(' ')}</b></div>` : ''}
      ${n.smart ? '<div><span>WARNING</span><b>READS YOUR HAND</b></div>' : ''}
      <div><span>REWARD</span><b>+${n.reward.points} PTS${packName ? ' · ' + esc(packName).toUpperCase() : ''}${rc ? ' · ' + esc(rc.name).toUpperCase() : ''}${st === 'done' && n.kind !== 'spar' ? ' (WON)' : ''}</b></div>
    </div>
    ${rc ? `<div class="scout-chip">${G.ownedCount(rc.id) ? tokenSVG(rc, 84, { bubble: false }) : shadowTokenSVG(rc, 84)}</div>` : ''}
    <div class="deckline ${chk.ok ? 'ok' : 'bad'}">${chk.ok ? 'DECK READY' : esc(chk.why).toUpperCase()}${chk.ok ? '' : n.deck ? ` <button class="obtn small" data-action="tourBuild" data-id="${n.id}">BUILD ONE</button>` : ' <button class="obtn small" data-action="autoDeck">AUTO-FILL</button>'}</div>
    <div class="row center"><button class="obtn primary big" data-action="tourPlay" data-id="${n.id}" ${playable ? '' : 'disabled'}>${st === 'done' && n.kind !== 'spar' ? 'PLAY AGAIN' : 'PLAY'}</button><button class="obtn grey" data-action="closeModal">BACK</button></div>
  </div>`);
}
// Title cards: a sequence of story lines, tap to advance.
function showCards(cards, onDone) {
  if (!cards || !cards.length) { if (onDone) onDone(); return; }
  const el = document.createElement('div'); el.className = 'tcard'; let i = 0;
  const draw = () => { el.innerHTML = `<div class="tcard-in"><div class="tcard-frame"><p>${esc(cards[i])}</p></div><div class="tcard-dots">${cards.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div><div class="tcard-hint">${i < cards.length - 1 ? 'TAP' : 'TAP TO CONTINUE'}</div></div>`; };
  draw();
  el.addEventListener('click', () => { i++; if (i >= cards.length) { el.classList.add('out'); setTimeout(() => { el.remove(); if (onDone) onDone(); }, 300); } else { snd('flip'); draw(); } });
  document.body.appendChild(el); snd('flip');
}
// Show the next unseen story beat for the Tour, if any.
function queueTourStory() {
  if (document.querySelector('.tcard, .setpost') || document.body.classList.contains('pk-open') || !$('#modal').hidden) return;
  const c = G.ensureCampaign(); const cur = G.tourZoneIndex();
  const beats = [];
  if (PROLOGUE.length) beats.push(['prologue', PROLOGUE]);
  ZONES.forEach((z, i) => {
    if (i > cur) return;
    if (G.zoneUnlocked(z)) beats.push(['arrive:' + z.id, z.story.arrive]);
    if (z.challenges.some(ch => c.done[ch.id])) beats.push(['mid:' + z.id, z.story.midway]);
    if (G.nodeStatus(z.keeper) !== 'locked') beats.push(['before:' + z.id, z.story.beforeKeeper]);
    if (c.badges.includes(z.id)) beats.push(['after:' + z.id, z.story.afterKeeper]);
  });
  if (G.tourComplete() && EPILOGUE.length) beats.push(['epilogue', EPILOGUE]);
  const next = beats.find(([k, cards]) => cards && cards.length && !G.storySeen(k));
  if (!next) return;
  G.markStory(next[0]);
  showCards(next[1], () => { if (next[0].startsWith('after:')) tourZone = G.tourZoneIndex(); render(); });
}

function arenaView() {
  const deckOk = state.deck.length === 12;
  const next = nextOpponent(); const un = G.opponentUnlocked(next);
  const champion = OPPONENTS.every(o => state.beaten.includes(o.id));
  const st = state.stats; const deckPts = state.deck.reduce((s, id) => s + BY_ID[id].pts, 0);
  return `<section class="challenger">
      <div class="ch-kicker">${champion ? 'CHAMPION · PICK ANY CHALLENGER' : 'NEXT CHALLENGER'}</div>
      <div class="ch-row"><div class="ch-av">${tokenSVG(BY_ID[next.avatar], 120, { bubble: false })}</div>
        <div class="ch-info"><div class="ch-name">${esc(next.name)}</div><div class="ch-taunt">“${esc(next.taunt)}”</div>
        <div class="ch-reward">WIN +${next.reward} PTS${state.beaten.includes(next.id) ? '' : ' · FIRST WIN +200 & A PREMIUM cPACK'}</div></div></div>
      <button class="obtn primary big block" data-action="battle" data-id="${next.id}" ${deckOk && un ? '' : 'disabled'}>PLAY</button>
      ${deckOk ? '' : '<div class="ch-note">Your deck needs 12 gToons. <b data-action="autoDeck">AUTO-FILL IT</b> or <b data-action="sub" data-id="deck">PICK THEM</b>.</div>'}
    </section>
    <div class="panel">
      <div class="row between"><div class="ptab">YOUR DECK <em>${state.deck.length}/12 · ${deckPts} PTS</em></div><div class="row"><button class="obtn small grey" data-action="autoDeck">AUTO</button><button class="obtn small" data-action="sub" data-id="deck">EDIT</button></div></div>
      <div class="deck-strip">${state.deck.map(id => `<div class="mini">${tokenSVG(BY_ID[id], 44)}</div>`).join('')}${Array(12 - state.deck.length).fill(`<div class="mini">${socketSVG(44)}</div>`).join('')}</div>
      <div class="ptab">THE LADDER <em>${st.wins} W · ${st.battles - st.wins} L</em></div>
      <div class="ladder">${OPPONENTS.map((op, i) => { const u = G.opponentUnlocked(op); const beat = state.beaten.includes(op.id); const isNext = op.id === next.id && !champion;
        return `<div class="rung ${u ? '' : 'locked'} ${isNext ? 'next' : ''}">
          <span class="n">0${i + 1}</span><div class="av">${u ? tokenSVG(BY_ID[op.avatar], 44, { bubble: false }) : socketSVG(44)}</div>
          <div class="who"><b>${esc(op.name)}</b><span>${beat ? 'BEATEN · +' + op.reward + ' PTS A WIN' : u ? '+' + op.reward + ' PTS · FIRST WIN BONUS' : 'BEAT THE ONE ABOVE TO UNLOCK'}</span></div>
          ${isNext ? '<span class="lock next">UP NEXT</span>' : u ? `<button class="obtn small grey" data-action="battle" data-id="${op.id}" ${deckOk ? '' : 'disabled'}>PLAY</button>` : '<span class="lock">LOCKED</span>'}
        </div>`; }).join('')}</div>
    </div>`;
}
function deckView() {
  const owned = [];
  Object.entries(state.collection).forEach(([id, n]) => { if (n > 0) owned.push({ id, n }); });
  owned.sort((a, b) => BY_ID[b.id].pts - BY_ID[a.id].pts);
  const cols = B.topColors(state.deck);
  return `<div class="panel">
    <div class="ptab">MY DECK <em>${state.deck.length}/12</em></div>
    <div class="deckbar"><div class="small">Top colours: ${cols.map(c => `<span class="ctag" style="--cc:${COLORS[c].hex}">${COLORS[c].name}</span>`).join(' ')} · 3 of a colour on the board = +${B.COLOR_BONUS}</div><div class="row"><button class="obtn grey" data-action="autoDeck">AUTO</button><button class="obtn" data-action="sub" data-id="arena">DONE</button></div></div>
    <p class="note">Tap a gToon to add it to your deck, tap again to remove it.</p>
    <div class="tokgrid">${owned.map(({ id, n }) => { const t = BY_ID[id]; const inDeck = state.deck.filter(d => d === id).length;
      return tokenHTML(t, { count: n, selected: inDeck > 0, action: 'deckToggle', name: inDeck ? `${t.name} (${inDeck})` : t.name }); }).join('')}</div>
  </div>`;
}
function rulesView() {
  return `<div class="panel"><div class="ptab">HOW TO PLAY gTOONS</div>
    <div class="rules">
      <p><b>THE BOARD.</b> Each player has 7 sockets: a back row of 3 and a front row of 4. The front rows face each other across the VS line.</p>
      <p><b>THE DECK.</b> Bring 12 gToons. You hold 5 in your hand and draw one after every play. Take turns placing one gToon until all 14 sockets are full.</p>
      <p><b>POINTS.</b> Every gToon has a point value (1–16) and a colour. Highest total wins.</p>
      <p><b>POWERS.</b> Most gToons have a power: doubling a buddy, bonuses per colour, penalties to the rival across the line, back-row or front-row bonuses and more. Powers are shown on the right when you select a gToon.</p>
      <p><b>COLOURS.</b> Every 3 gToons of the same colour on your side earns +${B.COLOR_BONUS}.</p>
      <p><b>SWAPPING.</b> Don't like your hand? Swap a gToon for the next one in your deck for -${B.SWAP_COST} points.</p>
    </div></div>`;
}

// ----- the Game Zone -----
function socketHTML(side, i, ev, who) {
  const id = side.slots[i];
  const canDrop = who === 'p' && !id && match.turn === 'p' && selectedHand >= 0 && !match.done;
  if (!id) return `<div class="sock ${canDrop ? 'drop' : ''}" data-action="${who === 'p' ? 'placeCard' : 'none'}" data-i="${i}">${socketSVG(100)}</div>`;
  const t = BY_ID[id]; const v = ev[i]; const delta = v.total - v.base;
  const last = match.lastMove && match.lastMove.who === who && match.lastMove.slot === i;
  const land = pendingLand && pendingLand.who === who && pendingLand.slot === i ? 'land' : '';
  const hit = pendingHits[who + i] ? 'hit-' + pendingHits[who + i] : '';
  return `<div class="sock filled ${last ? 'last' : ''} ${land} ${hit}" data-action="slotInfo" data-who="${who}" data-i="${i}">
    ${tokenSVG(t, 100, { label: v.total })}
    ${delta ? `<span class="delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta}</span>` : ''}
  </div>`;
}
function scoreBox(name, avatarId, ev, prefix, cols, who) {
  const cc = who === 'p' ? ev.aColors : ev.bColors;
  const total = who === 'p' ? ev.aTotal : ev.bTotal;
  const swaps = who === 'p' ? ev.aSwaps : ev.bSwaps;
  return `<div class="sbox ${who}">
    <div class="sbox-id"><div class="sbox-av">${tokenSVG(BY_ID[avatarId], 56, { bubble: false })}</div><div class="sbox-name">${esc(name)}</div></div>
    <div class="sbox-label">COLOR</div>
    <div class="sbox-colors">${cols.map(c => `<div><span>${COLORS[c].abbr}</span><i style="background:${COLORS[c].hex}"></i><b>${cc[c] || 0}</b></div>`).join('')}</div>
    <div class="sbox-label">POINTS</div>
    <div class="sbox-points" data-who="${who}" data-total="${total}">${lastTotals ? (who === 'p' ? lastTotals.a : lastTotals.b) : total}</div>
    <div class="sbox-sub">${match.rules.noSwap ? 'NO SWAPS' : swaps ? `-${swaps * match.rules.swapCost} FOR SWAPPING` : `-${match.rules.swapCost} FOR SWAPPING`}</div>
    ${who === 'ai' && match.rules.openHand ? `<div class="sbox-hand">${match.ai.hand.map(id => tokenSVG(BY_ID[id], 26, { bubble: false })).join('')}</div>` : ''}
  </div>`;
}
function matchScreen() {
  const ev = B.evaluate(match.p, match.ai, match.rules);
  const op = match.opponent;
  const sel = selectedHand >= 0 ? BY_ID[match.p.hand[selectedHand]] : null;
  const status = match.done ? (ev.aTotal > ev.bTotal ? 'GAME OVER — YOU WIN!' : ev.aTotal < ev.bTotal ? `GAME OVER — ${op.name.toUpperCase()} WINS.` : 'GAME OVER — IT’S A DRAW!')
    : match.turn === 'p' ? (sel ? 'NOW TAP AN EMPTY SOCKET ON YOUR SIDE OF THE BOARD.' : `ROUND ${match.round}: PICK A gTOON FROM YOUR HAND.`) : `${op.name.toUpperCase()} IS THINKING…`;
  const pCols = B.topColors(state.deck), aCols = B.topColors(match.ai.slots.filter(Boolean).concat(match.ai.hand, match.ai.deck));
  const canSwap = match.turn === 'p' && !match.done && selectedHand >= 0 && match.p.deck.length > 0 && !match.rules.noSwap;
  return `<div class="gz">
    <div class="gz-title">${match.node ? esc(zoneOf(match.node).name).toUpperCase() : 'GTOON GAME ZONE'}</div>
    ${(() => { const r = ruleText(match.rules); if (match.node && match.node.kind !== 'spar') r.push(goalText(match.node.goal)); return r.length ? `<div class="gz-rules">${r.join(' · ')}</div>` : ''; })()}
    <div class="gz-grid">
      <aside class="gz-left">
        ${scoreBox(op.name, op.avatar, ev, 'ai', aCols, 'ai')}
        <div class="vs">VS.</div>
        ${scoreBox(state.name, state.deck[0] || 'pz01', ev, 'p', pCols, 'p')}
      </aside>
      <div class="gz-board">
        <div class="gz-side ai">
        <div class="gz-row r3">${[0, 1, 2].map(i => socketHTML(match.ai, i, ev.b, 'ai')).join('')}</div>
        <div class="gz-row r4">${[3, 4, 5, 6].map(i => socketHTML(match.ai, i, ev.b, 'ai')).join('')}</div>
        </div>
        <div class="gz-mid"><span class="gz-pill ${match.turn !== 'p' && !match.done ? 'blink' : ''}">${match.done ? 'GAME OVER' : match.turn === 'p' ? 'YOUR TURN' : 'SCORING…'}</span></div>
        <div class="gz-side p">
        <div class="gz-row r4">${[3, 4, 5, 6].map(i => socketHTML(match.p, i, ev.a, 'p')).join('')}</div>
        <div class="gz-row r3">${[0, 1, 2].map(i => socketHTML(match.p, i, ev.a, 'p')).join('')}</div>
        </div>
      </div>
      <aside class="gz-right">
        <div class="gz-sel">
          ${sel ? `<div class="gz-sel-color">${COLORS[sel.color].abbr}</div><div class="gz-sel-tok">${tokenSVG(sel, 96)}</div><div class="gz-sel-name">${esc(sel.name)}</div><div class="gz-sel-power">${esc(powerText(sel.power)).toUpperCase()}</div>`
               : `<div class="gz-sel-tok">${socketSVG(96)}</div><div class="gz-sel-name">SELECT A gTOON</div>`}
        </div>
        <div class="gz-hand-title">YOUR gTOONS</div>
        <div class="gz-hand">${[0, 1, 2, 3, 4, 5].map(hi => { const id = match.p.hand[hi]; if (!id) return `<div class="hslot empty">${socketSVG(100)}</div>`;
          return `<div class="hslot ${selectedHand === hi ? 'sel' : ''}" data-action="pickHand" data-i="${hi}">${tokenSVG(BY_ID[id], 100)}</div>`; }).join('')}</div>
        <div class="gz-tools"><button class="obtn small ${canSwap ? '' : 'grey'}" data-action="swapCard" ${canSwap ? '' : 'disabled'}>SWAP −${match.rules.swapCost}</button><span class="small">DECK ${match.p.deck.length}</span><button class="obtn small grey" data-action="forfeit">${match.done ? 'EXIT' : 'QUIT'}</button></div>
      </aside>
    </div>
    <div class="gz-status">${esc(status)}${match.done ? ' <b data-action="forfeit">CLICK HERE TO RETURN TO THE CHALLENGE ZONE.</b>' : ''}</div>
  </div>`;
}
const rectOf = (sel) => { const el = $(sel); return el ? el.getBoundingClientRect() : null; };

// Fly a chip from one rectangle to another with a flip and an arc.
function flyChip(t, from, to, opts = {}) {
  return new Promise((resolve) => {
    if (!from || !to) return resolve();
    const el = document.createElement('div'); el.className = 'fly';
    el.style.cssText = `left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px`;
    el.innerHTML = tokenSVG(t, 100);
    document.body.appendChild(el);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const sc = to.width / from.width;
    const lift = -Math.max(90, Math.abs(dy) * 0.4);
    const spins = opts.spins || 2;
    const anim = el.animate([
      { transform: 'translate(0,0) scale(1) rotateY(0deg) rotateZ(0deg)', offset: 0 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 + lift}px) scale(${((1 + sc) / 2) * 1.4}) rotateY(${180 * spins}deg) rotateZ(${opts.tilt || -12}deg)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${sc}) rotateY(${360 * spins}deg) rotateZ(0deg)`, offset: 1 },
    ], { duration: opts.dur || 700, easing: 'cubic-bezier(.35,.6,.3,1)', fill: 'forwards' });
    anim.onfinish = () => { el.remove(); resolve(); };
  });
}
function whoosh() { snd('whoosh'); }
function slam() { snd('land'); }

// Which sockets changed value because of the last play? (for flash/shake effects)
function diffHits(before, after, landedWho, landedSlot) {
  const hits = {};
  const cmp = (who, a, b) => a.forEach((v, i) => { const w = b[i]; if (v && w && v.total !== w.total && !(who === landedWho && i === landedSlot)) hits[who + i] = w.total > v.total ? 'up' : 'down'; });
  cmp('p', before.a, after.a); cmp('ai', before.b, after.b);
  return hits;
}

function startMatch(op, aiDeck, opts = {}, node = null) {
  if (state.deck.length !== 12) return;
  match = B.newMatch(state.deck.slice(), aiDeck, op, { rules: opts.rules, pAwake: G.awakeIds() });
  match.node = node;
  selectedHand = -1; lastTotals = null; pendingLand = null; pendingHits = {}; busy = true;
  render();
  const intro = document.createElement('div'); intro.className = 'gz-intro';
  intro.innerHTML = `<b class="ready">${node ? esc(node.kind === 'challenge' ? node.opponent : node.name).toUpperCase() : 'READY?'}</b><b class="fight">${node && node.kicker ? esc(node.kicker) : 'BATTLE!'}</b>`;
  document.body.appendChild(intro);
  sfx.good(); setTimeout(() => sfx.great(), 650);
  setTimeout(() => { intro.remove(); busy = false; render(); if (match && match.turn === 'ai') setTimeout(aiTurn, 500); }, 1500);
}
function startBattle(opId) {
  const op = OPPONENTS.find(o => o.id === opId);
  if (!op || !G.opponentUnlocked(op)) return;
  startMatch(op, G.opponentDeck(op));
}
function startTour(nodeId) {
  const n = NODES[nodeId]; if (!n || G.nodeStatus(n) === 'locked') return;
  const chk = G.deckCheck(n); if (!chk.ok) { toast(chk.why); return; }
  startMatch(G.nodeOpponent(n), G.nodeDeck(n), { rules: n.rules }, n);
}
function aiTurn() {
  if (!match || match.done || match.turn !== 'ai' || busy) return;
  const mv = B.aiChoose(match);
  const t = BY_ID[match.ai.hand[mv.handIndex]];
  const before = B.evaluate(match.p, match.ai, match.rules);
  const from = rectOf('.sbox.ai .sbox-av') || rectOf('.gz-title');
  const to = rectOf(`.gz-side.ai .sock[data-i="${mv.slot}"]`);
  busy = true; whoosh();
  flyChip(t, from, to, { spins: 2, tilt: 14, dur: 750 }).then(() => {
    B.place(match, 'ai', mv.handIndex, mv.slot);
    pendingLand = { who: 'ai', slot: mv.slot };
    pendingHits = diffHits(before, B.evaluate(match.p, match.ai, match.rules), 'ai', mv.slot);
    busy = false; slam(); render();
    if (match.done) setTimeout(finishMatch, 900);
  });
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));
// End of match: every socket adds to its side's total in turn, then colour
// bonuses and swap penalties, then the result. Numbers become a moment.
async function tally(ev) {
  busy = true;
  const pts = { p: $('.sbox.p .sbox-points'), ai: $('.sbox.ai .sbox-points') };
  const run = { p: 0, ai: 0 };
  const setPts = (who, v) => { if (pts[who]) { pts[who].textContent = v; pts[who].classList.remove('bump'); void pts[who].offsetWidth; pts[who].classList.add('bump'); } };
  setPts('ai', 0); setPts('p', 0);
  const pill = $('.gz-pill'); if (pill) pill.textContent = 'SCORING…';
  for (const who of ['ai', 'p']) {
    const vals = who === 'p' ? ev.a : ev.b;
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i]; if (!v) continue;
      const sock = $(`.gz-side.${who} .sock[data-i="${i}"]`);
      if (sock) { sock.classList.add('tally'); setTimeout(() => sock.classList.remove('tally'), 300); }
      run[who] += v.total; setPts(who, run[who]); snd('tick', run[who]);
      await wait(130);
    }
    const bonus = who === 'p' ? ev.aBonus : ev.bBonus; const swaps = (who === 'p' ? ev.aSwaps : ev.bSwaps) * B.SWAP_COST;
    if (bonus) { run[who] += bonus; setPts(who, run[who]); snd('hitUp'); await wait(260); }
    if (swaps) { run[who] = Math.max(0, run[who] - swaps); setPts(who, run[who]); snd('hitDown'); await wait(260); }
    await wait(200);
  }
  busy = false;
}
async function finishMatch() {
  if (!match || !match.done) return;
  const ev = B.evaluate(match.p, match.ai, match.rules);
  await tally(ev);
  const won = ev.aTotal > ev.bTotal; const draw = ev.aTotal === ev.bTotal;
  const lineup = (side) => `<div class="lineup">${side.slots.filter(Boolean).map(id => `<div class="mini">${tokenSVG(BY_ID[id], 40)}</div>`).join('')}</div>`;
  const wokeHTML = (ids) => ids && ids.length ? `<div>${ids.map(id => `<span class="woke">SECRET AWAKE · ${esc(BY_ID[id].short).toUpperCase()}</span>`).join('')}</div>` : '';
  if (match.node) {
    const node = match.node; const res = G.recordTour(node, ev, match.p.slots);
    snd(res.cleared ? 'win' : won ? 'good' : 'lose');
    const title = res.cleared ? (node.kind === 'keeper' ? 'FRAME WON' : node.kind === 'spar' ? 'GOOD SPAR' : 'CLEARED') : won ? 'GOAL MISSED' : 'DEFEAT';
    const packName = node.reward.pack ? PACKS.find(p => p.id === node.reward.pack).name : '';
    showModal(`<div class="reveal result ${res.cleared ? 'won' : 'lost'}">
      <div class="result-title">${title}</div>
      <div class="result-score"><span class="me">${ev.aTotal}</span><i>–</i><span class="them">${ev.bTotal}</span></div>
      <div class="result-names"><span>${esc(state.name)}</span><span>${esc(match.opponent.name)}</span></div>
      ${node.kind !== 'spar' ? `<div class="result-goal">${goalText(node.goal)}${res.cleared ? ' ✓' : ''}</div>` : ''}
      <div class="result-lineups">${lineup(match.p)}${lineup(match.ai)}</div>
      <div class="result-pts">+${res.points} POINTS${res.first && node.kind !== 'spar' ? ' · FIRST CLEAR' : ''}</div>
      ${res.chips.length ? `<div class="small">YOURS NOW</div><div class="reveal-toks">${res.chips.map(id => `<div class="flip">${tokenHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>` : ''}
      ${res.pack.length ? `<div class="small">${esc(packName).toUpperCase()}</div><div class="reveal-toks">${res.pack.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${tokenHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>` : ''}
      ${res.badge ? `<div class="result-pts">FRAME ${zoneOf(node).n} OF 7</div>` : ''}
      ${wokeHTML(res.woke)}
      ${res.prize ? `<div class="result-pts">PRIZE: ${esc(BY_ID[res.prize].name).toUpperCase()}</div>` : ''}
      <div class="row center"><button class="obtn primary" data-action="leaveMatch">CONTINUE</button><button class="obtn grey" data-action="rematch">${res.cleared ? 'AGAIN' : 'RETRY'}</button></div></div>`);
    return;
  }
  const res = draw ? { points: 0, firstWin: false, bonus: [], prize: null, woke: [] } : G.recordBattle(match.opponent, won, ev.aTotal - ev.bTotal, match.p.slots);
  snd(won ? 'win' : draw ? 'good' : 'lose');
  showModal(`<div class="reveal result ${won ? 'won' : draw ? 'drew' : 'lost'}">
    <div class="result-title">${won ? 'VICTORY' : draw ? 'DRAW' : 'DEFEAT'}</div>
    <div class="result-score"><span class="me">${ev.aTotal}</span><i>–</i><span class="them">${ev.bTotal}</span></div>
    <div class="result-names"><span>${esc(state.name)}</span><span>${esc(match.opponent.name)}</span></div>
    <div class="result-lineups">${lineup(match.p)}${lineup(match.ai)}</div>
    ${draw ? '<div class="small">No points this time.</div>' : `<div class="result-pts">+${res.points} POINTS${res.firstWin ? ' · FIRST WIN' : ''}</div>`}
    ${res.bonus.length ? `<div class="small">PREMIUM cPACK</div><div class="reveal-toks">${res.bonus.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${tokenHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>` : ''}
    ${wokeHTML(res.woke)}
    ${res.prize ? `<div class="result-pts">PRIZE: ${esc(BY_ID[res.prize].name).toUpperCase()}</div>` : ''}
    <div class="row center"><button class="obtn primary" data-action="rematch">REMATCH</button><button class="obtn grey" data-action="leaveMatch">LADDER</button></div></div>`);
}

// ---------- cZONES ----------
function zoneStage(items, bgId, editable) {
  const bg = BACKGROUNDS.find(b => b.id === bgId) || BACKGROUNDS[0];
  return `<div class="stage ${editable ? 'editable' : ''}" id="${editable ? 'stage' : ''}" style="background:${bg.css}">
    ${items.map((it, i) => `<div class="placed" data-i="${i}" style="left:${(it.x * 100).toFixed(1)}%;top:${(it.y * 100).toFixed(1)}%">${badgeSVG(BY_ID[it.id], 72)}<span>${esc(BY_ID[it.id].name)}</span></div>`).join('')}
    ${items.length ? '' : '<div class="stage-hint">THIS cZONE IS EMPTY</div>'}
  </div>`;
}
function myZoneView() {
  const rating = state.czone.items.reduce((s, it) => s + BY_ID[it.id].points, 0);
  const ownedIds = Object.keys(state.collection).filter(id => state.collection[id] > state.czone.items.filter(it => it.id === id).length);
  return `<div class="panel">
    <div class="zone-head"><div class="zone-pill"><i>c</i>cZONES</div><div class="zone-owner"><b>${esc(state.name)}</b><span>THE ORBITER</span></div></div>
    <div class="zone-strip"><span>MY cZONE:</span><b>RATING ${fmt(rating)}</b><button class="zbtn" data-action="zonePicker">ADD cTOON</button><button class="zbtn" data-action="bgPicker">BACKGROUND</button><button class="zbtn" data-action="zoneMode" data-id="visit">VISIT cZONES</button></div>
    ${zoneStage(state.czone.items, state.czone.bg, true)}
    <p class="note">Drag cToons to arrange them. Double-tap one to send it back to your binder. Up to 20 on display.</p>
    ${zonePick ? `<div class="ptab">PICK A cTOON</div><div class="tokgrid">${ownedIds.map(id => tokenHTML(BY_ID[id], { count: state.collection[id], action: 'zoneAdd' })).join('') || '<p class="note">Every cToon you own is already on display.</p>'}</div>` : ''}
  </div>`;
}
function visitView() {
  const zones = G.npcZones();
  visitIndex = ((visitIndex % zones.length) + zones.length) % zones.length;
  const z = zones[visitIndex];
  return `<div class="panel">
    <div class="zone-head"><div class="zone-pill"><i>c</i>cZONES</div><div class="zone-owner"><b>${esc(z.owner)}</b><span>${z.award ? z.award.toUpperCase() + ' AWARD' : 'ORBITER'}</span></div></div>
    <div class="zone-strip"><span>cZONES:</span><button class="zbtn" data-action="visit" data-id="prev">PREVIOUS</button><button class="zbtn" data-action="visit" data-id="random">RANDOM</button><button class="zbtn" data-action="visit" data-id="next">NEXT</button><button class="zbtn" data-action="zoneMode" data-id="mine">MY cZONE</button><b>RATING ${fmt(z.rating)}</b></div>
    <div class="badgegrid">${z.items.map(it => `<div class="badge" data-action="detail" data-id="${it.id}">${badgeSVG(BY_ID[it.id], 100)}<span>${esc(BY_ID[it.id].name).toUpperCase()}</span></div>`).join('')}
      ${z.award ? `<div class="badge award"><div class="award-ring">${characterSVG(BY_ID[z.items[0].id], 70)}</div><span class="award-lbl">${esc(z.award).toUpperCase()} AWARD</span></div>` : ''}</div>
    <p class="note">Tap a cToon to see its details. cZones refresh every day.</p>
  </div>`;
}
function zoneView() { return zoneMode === 'visit' ? visitView() : myZoneView(); }
function bgModal() {
  showModal(`<div class="ptab">cZONE BACKGROUNDS</div><div class="bg-grid">${BACKGROUNDS.map(b => { const un = state.unlockedBgs.includes(b.id);
    return `<button class="bg-opt ${state.czone.bg === b.id ? 'on' : ''}" data-action="${un ? 'setBg' : 'buyBg'}" data-id="${b.id}" style="background:${b.css}"><span>${esc(b.name).toUpperCase()}${un ? '' : ` · ${b.cost} PTS`}</span></button>`; }).join('')}</div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
let drag = null;
function bindStage() {
  const stage = $('#stage'); if (!stage) return;
  let lastTap = { i: -1, t: 0 };
  stage.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.placed'); if (!el) return;
    const i = +el.dataset.i; const now = Date.now();
    if (lastTap.i === i && now - lastTap.t < 350) { G.removeFromZone(i); render(); return; }
    lastTap = { i, t: now };
    drag = { el, i, rect: stage.getBoundingClientRect() };
    el.setPointerCapture(e.pointerId); el.classList.add('dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const x = Math.min(0.9, Math.max(0.0, (e.clientX - drag.rect.left) / drag.rect.width - 0.08));
    const y = Math.min(0.82, Math.max(0.0, (e.clientY - drag.rect.top) / drag.rect.height - 0.12));
    drag.el.style.left = (x * 100) + '%'; drag.el.style.top = (y * 100) + '%'; drag.pos = { x, y };
  });
  const end = () => { if (!drag) return; drag.el.classList.remove('dragging'); if (drag.pos) G.moveInZone(drag.i, drag.pos.x, drag.pos.y); drag = null; };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
}

// ---------- MARKET: codes ----------
function codesView() {
  return `<div class="panel"><div class="ptab">ORBIT CODES</div>
    <p class="note">Promo codes give points, packs or cToons. Gift codes from friends move a cToon into your binder.</p>
    <div class="row"><input id="codeInput" class="oinput" placeholder="ENTER CODE" autocapitalize="characters" autocomplete="off"><button class="obtn" data-action="redeem">SUBMIT</button></div>
    <div class="featured">FEATURED CODE: <b>${G.featuredCode()}</b> <span class="small">(new every day, worth 150 points)</span></div>
    <p class="note">Psst: a few more codes are hiding in the game's README on GitHub.</p></div>`;
}

// ---------- PROFILE ----------
function profileView() {
  const show = BY_ID[G.showcaseId()]; const st = state.stats;
  const rating = state.czone.items.reduce((s, it) => s + BY_ID[it.id].points, 0);
  const stats = [['cTOONS', `${G.uniqueOwned()}/${CTOONS.length}`], ['SETS', `${G.completeSets().length}/${Object.keys(CHARACTERS).length}`], ['BINDER VALUE', fmt(G.binderValue())], ['RECORD', `${st.wins}–${st.battles - st.wins}`],
    ['PACKS', st.packs], ['TRADES', st.trades], ['RECYCLED', st.recycled], ['cZONE', fmt(rating)]];
  const d = (t) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const prizes = CTOONS.filter(t => t.series === 'pz');
  return `<section class="pro">
      <div class="pro-chip" data-action="detail" data-id="${show.id}">${tokenSVG(show, 120, { bubble: false })}</div>
      <div class="pro-name">${esc(state.name)}</div>
      <div class="pro-since">ORBITER SINCE ${new Date(state.created).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase()}</div>
      ${streakOrbs()}
    </section>
    <div class="panel">
      <div class="statgrid">${stats.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('')}</div>
      <div class="ptab">AWARDS <em>${state.prizes.length}/${prizes.length}</em></div>
      <div class="awards">${prizes.map(t => { const has = state.prizes.includes(t.id); return `<div class="award ${has ? '' : 'off'}" data-action="detail" data-id="${t.id}"><div>${has ? tokenSVG(t, 64, { bubble: false }) : shadowTokenSVG(t, 64)}</div>${esc(t.short)}</div>`; }).join('')}</div>
      <div class="ptab">ORBIT LOG</div>
      <div class="updates">${state.log.length ? state.log.slice(0, 6).map(l => `<div class="upd"><div class="upd-date">${d(l.t)}</div><div>${esc(l.text)}</div></div>`).join('') : '<div class="upd"><div>Nothing yet. Rip a pack.</div></div>'}</div>
      ${state.log.length > 6 ? '<button class="obtn grey block" data-action="allLog">FULL LOG</button>' : ''}
    </div>`;
}
function settingsView() {
  return `<div class="panel"><div class="ptab">ORBIT NAME</div>
    <div class="row"><input id="nameInput" class="oinput" value="${esc(state.name)}" maxlength="16"><button class="obtn" data-action="saveName">SAVE</button></div>
    <div class="ptab">SOUND</div><button class="obtn ${state.settings.sound ? '' : 'grey'}" data-action="toggleSound">SOUND EFFECTS: ${state.settings.sound ? 'ON' : 'OFF'}</button>
    <div class="ptab">REAL ARTWORK</div>
    <p class="note">Chips show the free-licensed image from each character's Wikipedia article, downloaded once and kept for offline play. Characters without one keep their drawn portrait. You can set your own image on any chip's details page.</p>
    <div class="row wrap"><button class="obtn ${artEnabled() ? '' : 'grey'}" data-action="toggleArt">REAL ARTWORK: ${artEnabled() ? 'ON' : 'OFF'}</button><button class="obtn grey" data-action="refreshArt">CHECK AGAIN</button></div>
    <div class="ptab danger">RESET</div><p class="note">Deletes your binder and progress on this device. Make a backup under Device first.</p><button class="obtn grey" data-action="resetConfirm">RESET GAME</button>
    <p class="fine">Cartoon Orbit is a fan-made homage to the classic collect-and-battle web game. It is free and not for sale. Characters are public-domain cartoon stars; portraits are original. Fonts: Michroma and Barlow Condensed (SIL Open Font License).</p>
    <div class="verline" data-action="versionTap">CARTOON ORBIT v${APP_VERSION}${state.settings.debug ? ' · DEBUG' : ''}</div></div>`;
}
function deviceView() {
  return `<div class="panel"><div class="ptab">INSTALL ON iPHONE OR iPAD</div>
    ${isStandalone() ? '<span class="okchip">INSTALLED · RUNNING AS A HOME SCREEN APP</span>' : ''}
    <ol class="steps">
      <li>Open this page in <b>Safari</b>.</li>
      <li>Tap the <b>Share</b> button (the square with an arrow).</li>
      <li>Tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>
    </ol>
    <p class="note">Android: open the page in Chrome, tap the ⋮ menu and choose <b>Install app</b>.</p>
    <div class="ptab">AUTOMATIC SAVING</div>
    <p class="note">Everything is saved on this device after every action. Last saved ${state.savedAt ? new Date(state.savedAt).toLocaleString() : 'never'}.</p>
    <div class="ptab">BACKUP CODE</div>
    <p class="note">Copy this code somewhere safe or send it to your other device. It holds your whole save.</p>
    <div class="row"><button class="obtn" data-action="copySave">COPY CODE</button>${navigator.share ? '<button class="obtn grey" data-action="shareSave">SHARE…</button>' : ''}</div>
    <div class="ptab">RESTORE</div>
    <p class="note">Paste a backup code. This replaces the save on this device.</p>
    <textarea id="restoreInput" class="oinput" rows="3" placeholder="ORBITSAVE1.…"></textarea>
    <button class="obtn grey" data-action="restoreSave">RESTORE</button></div>`;
}
function debugView() {
  const chipOpts = Object.entries(CHARACTERS).map(([k, c]) => `<optgroup label="${esc(c.name)}">${CTOONS.filter(t => t.char === k).map(t => `<option value="${t.id}">${esc(t.edShort || t.edition)} · ${RARITY[t.rarity].name}${G.ownedCount(t.id) ? ' (x' + G.ownedCount(t.id) + ')' : ''}</option>`).join('')}</optgroup>`).join('')
    + `<optgroup label="Prizes">${CTOONS.filter(t => t.series === 'pz').map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}</optgroup>`;
  const charOpts = Object.entries(CHARACTERS).map(([k, c]) => `<option value="${k}">${esc(c.name)}</option>`).join('');
  const hours = [['', 'REAL TIME'], [3, 'NIGHT'], [7, 'DAWN'], [12, 'DAY'], [18, 'DUSK'], [22, 'LATE']];
  const b = (id, label, cls = 'grey', extra = '') => `<button class="obtn small ${cls}" data-action="dbg" data-id="${id}" ${extra}>${label}</button>`;
  return `<div class="panel dbg"><div class="ptab danger">DEBUG</div>
    <p class="note">Test tools. Nothing here is hidden from your save: what you give yourself stays given.</p>
    <div class="ptab grey">POINTS <em>${state.unlimited ? 'UNLIMITED' : fmt(state.points)}</em></div>
    <div class="grp">${b('pts:1000', '+1,000')}${b('pts:10000', '+10,000')}${b('pts:-1000', '−1,000')}${b('pts:zero', 'SET 0')}${b('unlimited', state.unlimited ? 'UNLIMITED: ON' : 'UNLIMITED: OFF', state.unlimited ? 'hot' : 'grey')}</div>
    <div class="ptab grey">PACKS</div>
    <div class="grp">${b('pack:std', 'FREE STANDARD')}${b('pack:prem', 'FREE PREMIUM')}${b('pack:mega', 'FREE MEGA')}${b('pack:legendary', 'FORCE LEGENDARY', 'hot')}</div>
    <div class="ptab grey">CHIPS</div>
    <div class="row"><select id="dbgChip" class="oinput">${chipOpts}</select>${b('give', 'GIVE 1')}</div>
    <div class="grp">${RARITY.slice(0, 5).map((r, i) => `<button class="obtn small grey" data-action="dbg" data-id="tier:${i}" style="border-left:5px solid ${r.color}">${r.name.toUpperCase()}</button>`).join('')}</div>
    <div class="row"><select id="dbgChar" class="oinput">${charOpts}</select>${b('set', 'GIVE SET')}${b('poster', 'POSTER')}</div>
    <div class="grp">${b('all', 'GIVE EVERYTHING')}${b('dupes', 'REMOVE DUPLICATES')}${b('wipesets', 'FORGET SETS')}</div>
    <div class="ptab grey">DAY</div>
    <div class="grp">${b('daily', 'RESET TODAY')}${b('streak:+1', 'STREAK +1')}${b('streak:7', 'STREAK 7')}${b('streak:0', 'STREAK 0')}</div>
    <div class="row"><span class="small">SKY</span><select id="dbgHour" class="oinput">${hours.map(([v, n]) => `<option value="${v}" ${String(state.settings.debugHour ?? '') === String(v) ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="ptab grey">BATTLE</div>
    <div class="grp">${b('beatall', 'BEAT EVERYONE')}${b('clearbeaten', 'LOCK LADDER')}${b('fakewin', 'FAKE A WIN')}${b('bgs', 'ALL BACKGROUNDS')}</div>
    <div class="ptab grey">CEREMONIES</div>
    <div class="grp">${b('reveal', 'REVEAL MODAL')}${b('prize', 'PRIZE REVEAL')}${b('sfx', 'PLAY ALL SOUNDS')}</div>
    <div class="ptab grey">SAVE</div>
    <div class="grp">${b('dump', 'SHOW SAVE')}${b('sanitize', 'RE-CHECK SAVE')}${b('reload', 'CLEAR CACHE & RELOAD')}${b('hide', 'HIDE DEBUG MENU')}</div>
    <div class="small">v${APP_VERSION} · ${isStandalone() ? 'standalone' : 'browser'} · ${navigator.onLine ? 'online' : 'offline'} · ${screen.width}×${screen.height} @${window.devicePixelRatio}</div>
  </div>`;
}

function onboardingScreen() {
  return `<div class="cn-bar"><div class="cn-strip"><span class="cn-strip-hot">WHAT'S ON IN ORBIT</span><span class="cn-strip-txt">Membership is FREE!</span></div></div>
  <div class="frame onboard">
    <div class="orbit-head"><div class="orbit-logo">CARTOON <span class="o">O</span>RBIT<i>®</i></div></div>
    <div class="content">
      <div class="panel join">
        <div class="ptab">JOIN ORBIT NOW</div>
        <div class="join-toks">${['felix1', 'betty1', 'popeye1', 'willie1', 'koko1', 'krazy1'].map(id => tokenSVG(BY_ID[id], 64)).join('')}</div>
        <p>Start collecting, trading and competing today! Collect <b>cToons</b>, play <b>gToons</b>, build your <b>cZone</b>. Everything saves automatically on this device.</p>
        <label class="small">ORBIT NAME</label>
        <input id="nameInput" class="oinput big" placeholder="Orbiter" maxlength="16" autocomplete="off">
        <button class="obtn hot block" data-action="start">LOG IN NOW ›</button>
        <div class="free-burst">MEMBERSHIP IS FREE!</div>
      </div>
    </div>
  </div>`;
}

export function rerender() { if (!busy) render(); }

function showSetPoster(charKey) {
  const c = CHARACTERS[charKey]; if (!c) return;
  const eds = CTOONS.filter(t => t.char === charKey);
  const el = document.createElement('div'); el.className = 'setpost';
  el.innerHTML = `<div class="setpost-in">
      <div class="setpost-kicker">SET COMPLETE</div>
      <div class="setpost-name">${esc(c.name)}</div>
      <div class="setpost-grid">${eds.map((t, i) => `<div style="animation-delay:${i * 90}ms">${tokenSVG(t, 100, { bubble: false })}</div>`).join('')}</div>
      <div class="setpost-sub">ALL EIGHT EDITIONS · ${esc(SERIES[c.series].name).toUpperCase()} · ${c.year}</div>
      <button class="obtn primary" data-action="none">KEEP COLLECTING</button>
    </div>`;
  el.addEventListener('click', () => { el.classList.add('out'); setTimeout(() => el.remove(), 350); });
  document.body.appendChild(el); snd('set');
}

// ---------- render ----------
export function render() {
  const app = $('#app');
  document.body.classList.toggle('in-match', !!match && state.onboarded);
  if (!state.onboarded) { app.innerHTML = onboardingScreen(); return; }
  G.ensureQuests(state);
  if (match) { app.innerHTML = matchScreen(); afterMatchRender(); return; }
  const views = {
    home: { main: homeView },
    collection: { binder: binderView, sets: setsView, czone: zoneView },
    battle: { tour: tourView, arena: arenaView, deck: deckView, rules: rulesView },
    market: { cmart: cmartView, auction: auctionView, codes: codesView },
    profile: { me: profileView, settings: settingsView, device: deviceView, debug: debugView },
  };
  if (!views[section]) section = 'home';
  if (!views[section][subs[section]] || (subs[section] === 'debug' && !state.settings.debug)) subs[section] = Object.keys(views[section])[0];
  app.innerHTML = orbitFrame(views[section][subs[section]]());
  if (section === 'collection' && subs.collection === 'czone' && zoneMode === 'mine') bindStage();
  if (binderFocus) { const el = $('#cs-' + binderFocus); binderFocus = null; if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }
  if (section === 'battle' && subs.battle === 'tour') setTimeout(queueTourStory, 250);
  if ((state.pendingSets || []).length && !document.body.classList.contains('pk-open') && !document.querySelector('.setpost')) {
    const c = G.popPendingSet(); if (c) setTimeout(() => showSetPoster(c), 400);
  }
}

function quipFor(id) { const c = CHARACTERS[BY_ID[id]?.char]; const q = c && c.quips; return q ? q[Math.floor(Math.random() * q.length)] : null; }
function afterMatchRender() {
  const ev = B.evaluate(match.p, match.ai, match.rules);
  if (pendingLand) {
    const sock = $(`.gz-side.${pendingLand.who} .sock[data-i="${pendingLand.slot}"]`);
    const id = match[pendingLand.who].slots[pendingLand.slot];
    const q = id && quipFor(id);
    if (sock && q) { const b = document.createElement('div'); b.className = 'quip'; b.textContent = q; sock.appendChild(b); snd('quip'); setTimeout(() => b.remove(), 1500); }
  }
  document.querySelectorAll('.sbox-points').forEach(el => {
    const target = +el.dataset.total; const start = +el.textContent || 0;
    if (start === target) { el.textContent = target; return; }
    el.classList.add('bump');
    const t0 = performance.now(), dur = 550; let lastShown = start;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); const v = Math.round(start + (target - start) * e); if (v !== lastShown) { lastShown = v; snd('tick', v); } el.textContent = v; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  lastTotals = { a: ev.aTotal, b: ev.bTotal };
  pendingLand = null; pendingHits = {};
}

// ---------- actions ----------
const actions = {
  go(d) { section = d.to; if (d.sub) subs[section] = d.sub; zonePick = false; zoneMode = 'mine'; window.scrollTo(0, 0); },
  sub(d) { subs[section] = d.id; zonePick = false; window.scrollTo(0, 0); },
  none() {},
  closeModal() { closeModal(); },
  dismissInstall() { installDismissed = true; try { sessionStorage.setItem('installDismissed', '1'); } catch { /* ignore */ } },
  start() { const r = G.startNewPlayer($('#nameInput')?.value); section = 'home'; render(); openPack(r, { sfx: packSfx }).then(() => render()); return false; },
  flipDetail() { const t = $('#tilt .tilt-in'); if (t) { t.classList.toggle('flipped'); snd('flip'); } return false; },
  showcase(d) { G.setShowcase(d.id); snd('clink'); toast('Featured on your front page.'); detailModal(d.id); return false; },
  claimDaily() { const r = G.claimDaily(); if (r) { sfx.good(); toast(`+${r.amount} points! Day ${r.streak} streak.`); if (r.prize) setTimeout(() => revealModal([r.prize], 'PRIZE UNLOCKED!'), 300); } },
  claimQuest(d) { const v = G.claimQuest(d.id); if (v) { sfx.good(); toast(`Quest complete! +${v} points.`); } },
  binderFilter(d) { binderFilter = d.id; },
  binderTier(d) { binderTier = d.id; },
  binderSeries(d) { binderFilter = d.id; binderTier = 'all'; section = 'collection'; subs.collection = 'binder'; window.scrollTo(0, 0); },
  binderChar(d) { const c = CHARACTERS[d.id]; if (!c) return false; binderFilter = c.series; binderTier = 'all'; binderFocus = d.id; section = 'collection'; subs.collection = 'binder'; },
  zoneMode(d) { zoneMode = d.id; zonePick = false; window.scrollTo(0, 0); },
  allNews() { newsModal(); return false; },
  allLog() { const d = (t) => new Date(t).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
    showModal(`<div class="ptab">ORBIT LOG</div><div class="updates tall">${state.log.map(l => `<div class="upd"><div class="upd-date">${d(l.t)}</div><div>${esc(l.text)}</div></div>`).join('')}</div><button class="obtn grey block" data-action="closeModal">CLOSE</button>`); return false; },
  versionTap() { const now = Date.now(); if (now - verTapAt > 2500) verTaps = 0; verTapAt = now; verTaps++;
    if (verTaps >= 7) { verTaps = 0; const on = !state.settings.debug; commit(s => { s.settings.debug = on; if (!on) delete s.settings.debugHour; }); snd(on ? 'great' : 'tap'); toast(on ? 'Debug menu unlocked.' : 'Debug menu hidden.'); if (on) subs.profile = 'debug'; return; }
    if (verTaps >= 4) toast(`${7 - verTaps} more…`, 800); return false; },
  dbg(d) { const [op, arg] = d.id.split(':');
    const show = (r) => { render(); openPack(r, { sfx: packSfx }).then(() => render()); };
    switch (op) {
      case 'pts': if (arg === 'zero') G.debug.points(-state.points); else G.debug.points(+arg); break;
      case 'unlimited': G.setUnlimited(!state.unlimited); break;
      case 'pack': if (arg === 'legendary') show(G.debug.legendaryPack()); else show(G.debug.freePack(arg)); return false;
      case 'give': { const id = $('#dbgChip')?.value; if (id) { G.debug.give(id); toast(`${BY_ID[id].name} added.`); } break; }
      case 'tier': { const t = G.debug.giveTier(+arg); if (t) toast(`${t.name} added.`); break; }
      case 'set': { const k = $('#dbgChar')?.value; if (k) { G.debug.giveSet(k); toast(`${CHARACTERS[k].name} set added.`); } break; }
      case 'poster': { const k = $('#dbgChar')?.value; if (k) showSetPoster(k); return false; }
      case 'all': G.debug.giveAll(); toast('Every packable cToon added.'); break;
      case 'dupes': G.debug.clearDupes(); break;
      case 'wipesets': G.debug.wipeSets(); break;
      case 'daily': G.debug.resetDaily(); toast('Today reset.'); break;
      case 'streak': G.debug.streak(arg === '+1' ? state.daily.streak + 1 : +arg); break;
      case 'beatall': G.debug.beatAll(); break;
      case 'clearbeaten': G.debug.clearBeaten(); break;
      case 'fakewin': { const r = G.debug.fakeWin(nextOpponent().id); toast(`+${r.points} points${r.bonus.length ? ' and a Premium cPack' : ''}.`); break; }
      case 'bgs': G.debug.unlockBgs(); break;
      case 'reveal': revealModal(CTOONS.filter(t => t.rarity === LEGENDARY).slice(0, 3).map(t => t.id), 'TEST REVEAL'); return false;
      case 'prize': revealModal(['pz01'], 'PRIZE UNLOCKED!'); return false;
      case 'sfx': ['tap', 'good', 'great', 'bad', 'clink', 'flip', 'pick', 'whoosh', 'land', 'quip', 'win', 'lose', 'set'].forEach((k, i) => setTimeout(() => snd(k), i * 420)); return false;
      case 'dump': showModal(`<div class="ptab">SAVE</div><pre class="dump">${esc(JSON.stringify(state, null, 1))}</pre><button class="obtn grey block" data-action="closeModal">CLOSE</button>`); return false;
      case 'sanitize': G.sanitize(); toast('Save checked.'); break;
      case 'reload': (async () => { try { const regs = await navigator.serviceWorker?.getRegistrations?.() || []; await Promise.all(regs.map(r => r.unregister())); const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); } catch { /* ignore */ } location.reload(); })(); return false;
      case 'hide': commit(s => { s.settings.debug = false; delete s.settings.debugHour; }); subs.profile = 'settings'; break;
    }
    snd('tap'); },
  detail(d) { snd('clink'); detailModal(d.id); return false; },
  deckAdd(d) { commit(s => { if (s.deck.length < 12) s.deck.push(d.id); }); toast('Added to deck.'); detailModal(d.id); return false; },
  deckRemove(d) { commit(s => { const i = s.deck.indexOf(d.id); if (i >= 0) s.deck.splice(i, 1); }); toast('Removed from deck.'); detailModal(d.id); return false; },
  recycle(d) { const v = G.recycle(d.id); if (v) { sfx.good(); toast(`Recycled for +${v} points.`); } detailModal(d.id); return false; },
  gift(d) { const t = BY_ID[d.id];
    showModal(`<div class="ptab">GIFT ${esc(t.name).toUpperCase()}?</div><p class="note">This removes one ${esc(t.name)} from your binder and creates a code your friend can redeem under Market → Codes. Each code works once.</p>
      <div class="row center"><button class="obtn" data-action="giftConfirm" data-id="${d.id}">CREATE GIFT CODE</button><button class="obtn grey" data-action="closeModal">CANCEL</button></div>`); return false; },
  giftConfirm(d) { const code = G.giftCtoon(d.id); if (!code) return;
    showModal(`<div class="ptab">GIFT CODE</div><p class="note">Send this to your friend:</p><div class="code">${code}</div>
      <div class="row center"><button class="obtn" data-action="copyText" data-text="${code}">COPY</button>${navigator.share ? `<button class="obtn grey" data-action="shareText" data-text="${code}">SHARE…</button>` : ''}<button class="obtn grey" data-action="closeModal">DONE</button></div>`); return false; },
  copyText(d) { copy(d.text); return false; },
  shareText(d) { navigator.share({ text: `A cToon gift for you in Cartoon Orbit! Redeem this code: ${d.text}` }).catch(() => {}); return false; },
  claimFree() { const t = G.claimDailyFree(); if (t) revealModal([t.id], 'FREE cTOON!'); },
  buyPack(d) { const r = G.buyPack(d.id); if (!r) { toast('Not enough points.'); return; } render(); openPack(r, { sfx: packSfx }).then(() => render()); return false; },
  autoDeck() { commit(s => { s.deck = G.autoDeck(s); }); toast('Deck auto-filled with your best gToons.'); },
  deckToggle(d) { commit(s => { const inDeck = s.deck.filter(x => x === d.id).length; const own = s.collection[d.id] || 0;
    if (inDeck < own && s.deck.length < 12) s.deck.push(d.id); else if (inDeck > 0) s.deck = s.deck.filter(x => x !== d.id); else toast('Deck is full (12).'); }); sfx.tap(); },
  battle(d) { startBattle(d.id); return false; },
  pickHand(d) { if (!match || match.turn !== 'p' || match.done || busy) return false; selectedHand = selectedHand === +d.i ? -1 : +d.i; snd('pick'); },
  placeCard(d) { if (!match || match.turn !== 'p' || match.done || selectedHand < 0 || busy) return false;
    const slot = +d.i; if (match.p.slots[slot]) return false;
    const hi = selectedHand; const t = BY_ID[match.p.hand[hi]];
    const before = B.evaluate(match.p, match.ai, match.rules);
    const from = rectOf(`.hslot[data-i="${hi}"]`); const to = rectOf(`.gz-side.p .sock[data-i="${slot}"]`);
    const src = $(`.hslot[data-i="${hi}"]`); if (src) src.style.visibility = 'hidden';
    busy = true; whoosh();
    flyChip(t, from, to, { spins: 2, tilt: -14 }).then(() => {
      B.place(match, 'p', hi, slot); selectedHand = -1;
      pendingLand = { who: 'p', slot };
      pendingHits = diffHits(before, B.evaluate(match.p, match.ai, match.rules), 'p', slot);
      busy = false; slam(); render();
      if (match.done) setTimeout(finishMatch, 900); else setTimeout(aiTurn, 700);
    });
    return false; },
  swapCard() { if (!match || match.turn !== 'p' || match.done || selectedHand < 0 || busy) return false; if (B.swap(match, 'p', selectedHand)) { sfx.bad(); toast('Swapped. -10 points.'); } },
  slotInfo(d) { const side = match[d.who]; const id = side.slots[+d.i]; if (!id) return; const ev = B.evaluate(match.p, match.ai, match.rules); const v = (d.who === 'p' ? ev.a : ev.b)[+d.i]; const t = BY_ID[id];
    showModal(`<div class="detail"><div class="ptab">${esc(t.name).toUpperCase()}</div><div class="detail-tok center">${tokenSVG(t, 120)}</div><div class="power"><span>POWER</span> ${esc(powerText(t.power))}</div>
      <div class="mods"><div>BASE <b>${v.base}</b></div>${v.mods.map(m => `<div>${m.v > 0 ? '+' : ''}${m.v} <span class="small">${esc(m.why)}</span></div>`).join('')}<div>TOTAL <b>${v.total}</b></div></div>
      <button class="obtn grey block" data-action="closeModal">CLOSE</button></div>`); return false; },
  forfeit() { if (busy) return false; if (match && !match.done) { if (!confirm('Quit this match? It counts as a loss.')) return false; if (match.node) G.recordTour(match.node, { aTotal: 0, bTotal: 1, aColors: {}, rules: match.rules }, []); else G.recordBattle(match.opponent, false, 0); } const wasTour = !!(match && match.node); match = null; closeModal(); if (wasTour) { section = 'battle'; subs.battle = 'tour'; } },
  rematch() { const op = match.opponent; const node = match.node; closeModal(); if (node) startTour(node.id); else startBattle(op.id); return false; },
  leaveMatch() { const wasTour = !!(match && match.node); closeModal(); match = null; if (wasTour) { section = 'battle'; subs.battle = 'tour'; } },
  tourZone(d) { tourZone = +d.id; },
  tourNode(d) { const n = NODES[d.id]; if (!n) return false; snd('clink'); tourNodeModal(d.id); return false; },
  tourPlay(d) { closeModal(); startTour(d.id); return false; },
  tourBuild(d) { const n = NODES[d.id]; const deck = n && G.buildDeckFor(n); if (!deck) { toast('Not enough legal gToons in your binder yet.'); return false; } commit(s => { s.deck = deck; }); sfx.good(); toast('Deck built for this challenge.'); tourNodeModal(d.id); return false; },
  zonePicker() { zonePick = !zonePick; },
  zoneAdd(d) { const ok = G.placeInZone(d.id, 0.05 + Math.random() * 0.7, 0.05 + Math.random() * 0.6); if (ok) { toast('Placed in your cZone.'); sfx.tap(); closeModal(); section = 'collection'; subs.collection = 'czone'; zoneMode = 'mine'; zonePick = false; } else toast('cZone is full or you have no spare copy.'); },
  bgPicker() { bgModal(); return false; },
  setBg(d) { commit(s => { s.czone.bg = d.id; }); closeModal(); },
  buyBg(d) { if (G.buyBackground(d.id)) { sfx.good(); toast('Background unlocked!'); closeModal(); } else toast('Not enough points.'); return false; },
  visit(d) { const n = G.npcZones().length; if (d.id === 'prev') visitIndex--; else if (d.id === 'next') visitIndex++; else visitIndex = Math.floor(Math.random() * n); sfx.tap(); },
  trade(d) { const o = G.todaysTrades()[+d.i]; if (G.doTrade(o)) revealModal([o.get], 'TRADE COMPLETE!'); },
  redeem() { const r = G.redeemCode($('#codeInput')?.value); if (r.ok) { sfx.great(); if (r.ctoons?.length) revealModal(r.ctoons, r.text.toUpperCase()); else toast(r.text); } else { sfx.bad(); toast(r.text); } },
  copySave() { copy(exportCode()); return false; },
  shareSave() { navigator.share({ title: 'Cartoon Orbit save', text: exportCode() }).catch(() => {}); return false; },
  restoreSave() { try { const obj = parseSaveCode($('#restoreInput').value); if (!confirm('Replace the save on this device with this backup?')) return false; replaceState(obj); G.sanitize(); sfx.great(); toast('Save restored!'); section = 'home'; } catch (e) { sfx.bad(); toast(e.message); return false; } },
  saveName() { const v = ($('#nameInput')?.value || '').trim().slice(0, 16); if (v) { commit(s => { s.name = v; }); toast('Name saved.'); } },
  toggleSound() { commit(s => { s.settings.sound = !s.settings.sound; }); setSound(state.settings.sound); sfx.tap(); },
  toggleArt() { commit(s => { s.settings.realArt = s.settings.realArt === false; }); if (artEnabled()) refreshWiki(); sfx.tap(); },
  refreshArt() { if (!navigator.onLine) { toast('You are offline. Try again when connected.'); return false; } forgetWiki().then(() => refreshWiki(true)); toast('Looking up artwork…'); return false; },
  clearArt(d) { clearCustomArt(d.id).then(() => { toast('Your image was removed.'); detailModal(CTOONS.find(t => t.char === d.id).id); }); return false; },
  resetConfirm() { showModal(`<div class="ptab danger">RESET GAME?</div><p class="note">This permanently deletes your binder, points and cZone on this device.</p><div class="row center"><button class="obtn danger-btn" data-action="resetDo">YES, RESET</button><button class="obtn grey" data-action="closeModal">CANCEL</button></div>`); return false; },
  resetDo() { resetState(); closeModal(); match = null; section = 'home'; toast('Game reset.'); },
};

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
  catch { showModal(`<div class="ptab">COPY THIS</div><textarea class="oinput" rows="6" readonly>${esc(text)}</textarea><button class="obtn block" data-action="closeModal">DONE</button>`); }
}

export function bind() {
  setSound(state.settings.sound !== false);
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]'); if (!el) return;
    const fn = actions[el.dataset.action]; if (!fn) return;
    e.preventDefault();
    const r = fn(el.dataset);
    if (r !== false) render();
  });
  document.body.addEventListener('change', (e) => {
    if (e.target.id === 'dbgHour') { const v = e.target.value; commit(s => { if (v === '') delete s.settings.debugHour; else s.settings.debugHour = +v; }); return; }
    const inp = e.target.closest('.artfile'); if (!inp || !inp.files?.[0]) return;
    const char = inp.dataset.char;
    setCustomArt(char, inp.files[0]).then(() => { sfx.good(); toast('Artwork updated!'); detailModal(CTOONS.find(t => t.char === char).id); })
      .catch(err => { sfx.bad(); toast(err.message || 'Could not use that image.'); });
  });
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'codeInput') { if (actions.redeem() !== false) render(); }
    if (e.key === 'Enter' && e.target.id === 'nameInput' && !state.onboarded) { actions.start(); render(); }
  });
}

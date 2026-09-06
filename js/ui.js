// All screens and interactions, styled after the 2003 Cartoon Orbit site.
// Rendering is string templates plus one delegated click handler keyed on
// data-action attributes.
import { CTOONS, BY_ID, SERIES, RARITY, COLORS, PACKS, OPPONENTS, BACKGROUNDS, CHARACTERS, EDITIONS, MYTHIC, LEGENDARY, powerText } from './data.js';
import { openPack } from './pack.js';
import { tokenSVG, shadowTokenSVG, socketSVG, badgeSVG, characterSVG } from './art.js';
import { state, commit, exportCode, parseSaveCode, replaceState, resetState, todayKey } from './store.js';
import * as G from './game.js';
import * as B from './gtoons.js';
import { getArt, artEnabled, setCustomArt, clearCustomArt, refreshWiki, forgetWiki } from './artwork.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => n.toLocaleString();

// navigation: section -> sub tab
let section = 'orbit';
const subs = { orbit: 'home', collect: 'binder', compete: 'arena', czone: 'mine', help: 'codes' };
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

// ---------- sound ----------
let audio = null;
function beep(freq = 660, dur = 0.08, type = 'square', vol = 0.05) {
  if (!state.settings.sound) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + dur);
  } catch { /* no audio */ }
}
const packSfx = (kind) => {
  switch (kind) {
    case 'grab': beep(220, 0.05, 'triangle', 0.04); break;
    case 'rip': beep(160 + Math.random() * 80, 0.06, 'sawtooth', 0.05); break;
    case 'burst': beep(90, 0.25, 'sawtooth', 0.07); setTimeout(() => beep(700, 0.15, 'triangle', 0.06), 80); setTimeout(() => beep(1100, 0.2, 'triangle', 0.05), 160); break;
    case 'flip': beep(600, 0.06, 'square', 0.04); break;
    case 'tension': beep(140, 0.5, 'sine', 0.05); break;
    case 'drum': [0, 180, 360, 540].forEach((d, i) => setTimeout(() => beep(110 + i * 20, 0.12, 'square', 0.06), d)); break;
    case 'reveal0': beep(520, 0.08); break;
    case 'reveal1': beep(600, 0.08); setTimeout(() => beep(760, 0.1), 80); break;
    case 'reveal2': [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle', 0.06), i * 80)); break;
    case 'reveal3': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.14, 'triangle', 0.07), i * 90)); break;
    case 'reveal4': [392, 523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'triangle', 0.08), i * 100)); break;
    case 'done': beep(660, 0.08); setTimeout(() => beep(880, 0.12), 80); break;
  }
};
const sfx = {
  tap: () => beep(520, 0.05),
  good: () => { beep(660, 0.08); setTimeout(() => beep(880, 0.12), 80); },
  great: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle', 0.07), i * 90)); },
  bad: () => beep(180, 0.2, 'sawtooth', 0.04),
};

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

function siteHeader() {
  return `<div class="cn-bar">
    <div class="cn-strip"><span class="cn-strip-hot">WHAT'S ON IN ORBIT</span><span class="cn-strip-txt">${esc(headline())}</span></div>
    <div class="cn-bar-row">
      <div class="cn-tabs">
        <span class="cn-tab t1" data-action="go" data-to="collect">COLLECT</span>
        <span class="cn-tab t2" data-action="go" data-to="compete">COMPETE</span>
        <span class="cn-tab t3" data-action="go" data-to="orbit">ORBIT</span>
        <span class="cn-tab t4" data-action="go" data-to="czone">cZONE</span>
      </div>
      <div class="wallet" data-action="go" data-to="collect" data-sub="cmart"><span>POINTS</span><b>${fmt(state.points)}</b></div>
    </div>
  </div>`;
}
function headline() {
  const today = todayKey();
  if (state.daily.last !== today) return 'Your Daily Orbit Bonus is waiting on the front page!';
  const next = OPPONENTS.find(o => !state.beaten.includes(o.id));
  return next ? `${next.name} is waiting in the Challenge Zone.` : 'You are the Orbit Champion. Show off that cZone!';
}

const SECTIONS = [
  ['orbit',   'ORBIT'],
  ['collect', 'CARDS'],
  ['compete', 'BATTLE'],
  ['czone',   'cZONES'],
  ['help',    'HELP'],
];
const SUBTABS = {
  orbit:   [['home', 'HOME'], ['quests', 'QUESTS'], ['updates', 'UPDATES']],
  collect: [['binder', 'BINDER'], ['cmart', 'cMART'], ['auction', 'AUCTION']],
  compete: [['arena', 'CHALLENGE ZONE'], ['deck', 'MY DECK'], ['rules', 'HOW TO PLAY']],
  czone:   [['mine', 'MY cZONE'], ['visit', 'VISIT cZONES']],
  help:    [['codes', 'CODES'], ['backup', 'BACKUP'], ['install', 'INSTALL'], ['settings', 'SETTINGS']],
};

function orbitFrame(inner) {
  const tabs = SUBTABS[section].map(([k, n]) => `<button class="stab ${subs[section] === k ? 'on' : ''}" data-action="sub" data-id="${k}">${n}</button>`).join('');
  return `${siteHeader()}
  <div class="frame">
    <div class="orbit-head">
      <div class="orbit-logo" data-action="go" data-to="orbit">CARTOON <span class="o">O</span>RBIT<i>®</i></div>
      <div class="subnav">${tabs}</div>
    </div>
    <div class="content">${inner}</div>
  </div>
  <nav class="leftnav">${SECTIONS.map(([k, n]) => k === 'compete'
    ? `<button class="lnav battle ${section === k ? 'on' : ''}" data-action="go" data-to="${k}"><i>⚔</i><span>${n}</span></button>`
    : `<button class="lnav ${section === k ? 'on' : ''}" data-action="go" data-to="${k}"><span>${n}</span><i>›</i></button>`).join('')}</nav>`;
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
function homeView() {
  const today = todayKey();
  const dailyDone = state.daily.last === today;
  const prog = G.catalogProgress();
  const free = G.dailyFreeCtoon(); const freeDone = state.dailyFree === today;
  const nextOp = OPPONENTS.find(o => !state.beaten.includes(o.id));
  const featured = G.featuredCode();
  const install = (!isStandalone() && !installDismissed) ? `<div class="promo install-promo">
      <div class="promo-title">ADD ORBIT TO YOUR HOME SCREEN</div>
      <p>${isIOS() ? 'In Safari tap <b>Share</b>, then <b>Add to Home Screen</b>. Orbit installs like an app and works offline.' : 'Open this page in Safari on your iPhone and use Share → Add to Home Screen.'}</p>
      <div class="row"><button class="obtn" data-action="go" data-to="help" data-sub="install">SHOW ME HOW</button><button class="obtn grey" data-action="dismissInstall">LATER</button></div>
    </div>` : '';
  return `<div class="cols">
    <div class="col-main">
      <div class="panel">
        <div class="ptab">NOW IN ORBIT</div>
        ${install}
        <div class="promo daily-promo ${dailyDone ? 'done' : ''}">
          <div class="promo-title">${dailyDone ? 'DAILY BONUS CLAIMED!' : 'YOUR DAILY ORBIT BONUS!'}</div>
          <p>Log in every day to keep your streak. Day ${state.daily.streak} streak${state.daily.streak >= 7 ? ' 🔥' : ''}. Seven days in a row earns a Prize cToon.</p>
          ${dailyDone ? '<span class="okchip">CLAIMED</span>' : '<button class="obtn hot" data-action="claimDaily">CLAIM BONUS</button>'}
        </div>
        <div class="promo free-promo ${freeDone ? 'done' : ''}">
          <div class="row">
            <div class="promo-tok">${tokenSVG(free, 84)}</div>
            <div><div class="promo-title">FREE cTOON OF THE DAY</div><p>${esc(free.name)} · ${RARITY[free.rarity].name}. Every Orbiter gets one, every day.</p>
            ${freeDone ? '<span class="okchip">COLLECTED</span>' : '<button class="obtn hot" data-action="claimFree">TAKE IT</button>'}</div>
          </div>
        </div>
        <div class="orbit-badge">
          <div class="ob-circle">${tokenSVG(BY_ID[state.deck[0] || 'pz01'], 96)}</div>
          <div class="ob-text"><b>${esc(state.name).toUpperCase()}'S 24-HOUR ORBIT</b><div class="ob-stats">${prog.have}/${prog.total} cTOONS · ${state.stats.wins} gTOONS WINS · ${fmt(G.binderValue())} PTS BINDER</div>
            <div class="ob-links"><span data-action="go" data-to="collect">cTOONS</span><span data-action="go" data-to="compete">gTOONS</span><span data-action="go" data-to="collect" data-sub="auction">TRADING</span></div></div>
        </div>
      </div>
      <div class="getstarted">
        <div class="gs-tabs"><span class="on">GET STARTED</span><span data-action="go" data-to="collect">COLLECT</span><span data-action="go" data-to="compete">COMPETE</span><span data-action="go" data-to="collect" data-sub="auction">AUCTION</span><span data-action="go" data-to="czone" data-sub="visit">EXPLORE</span></div>
        <div class="gs-body">
          <div><div class="gs-head">‹ PLAY NOW</div><ul><li data-action="go" data-to="compete">Play gToons${nextOp ? ' vs ' + esc(nextOp.name) : ''}</li><li data-action="go" data-to="collect" data-sub="cmart">Open cPacks at the cMart</li><li data-action="go" data-to="czone">Build your cZone</li></ul></div>
          <div><div class="gs-head">TODAY'S QUESTS ›</div><ul>${G.todaysQuests().map(q => { const p = G.questProgress(q); const done = state.quests.claimed.includes(q.id); return `<li data-action="go" data-to="orbit" data-sub="quests">${done ? '✔ ' : ''}${esc(q.text)} <em>${p}/${q.goal}</em></li>`; }).join('')}</ul></div>
        </div>
      </div>
    </div>
    <div class="col-side">
      <div class="panel side">
        <div class="ptab">COMPETE</div>
        <button class="gtoons-card" data-action="go" data-to="compete"><span class="gt-logo">gTOONS</span><span class="gt-sub">TRADING CARD GAME</span></button>
      </div>
      <div class="panel side">
        <div class="ptab">ORBIT CENTERS</div>
        <ul class="centers">${Object.entries(SERIES).filter(([k]) => k !== 'pz').map(([k, s]) => `<li data-action="binderSeries" data-id="${k}">${esc(s.name).toUpperCase()}</li>`).join('')}<li class="muted-li">CLICK ON A LINK ABOVE</li></ul>
      </div>
      <div class="panel side code-panel">
        <div class="ptab">GOT A CODE?</div>
        <div class="row"><input id="codeInput" class="oinput" placeholder="ENTER IT HERE" autocapitalize="characters" autocomplete="off"><button class="obtn" data-action="redeem">SUBMIT</button></div>
        <div class="featured">FEATURED CODE: <b>${featured}</b></div>
      </div>
    </div>
  </div>`;
}
function questsView() {
  return `<div class="panel">
    <div class="ptab">TODAY'S QUESTS</div>
    <p class="note">New quests every day. Finish them for points.</p>
    <div class="list">${G.todaysQuests().map(q => { const p = G.questProgress(q); const claimed = state.quests.claimed.includes(q.id);
      return `<div class="li"><div><b>${esc(q.text)}</b><div class="small">${p}/${q.goal} · +${q.reward} pts</div></div>
        ${claimed ? '<span class="okchip">DONE</span>' : p >= q.goal ? `<button class="obtn hot" data-action="claimQuest" data-id="${q.id}">CLAIM</button>` : `<span class="pct">${Math.round(100 * p / q.goal)}%</span>`}</div>`; }).join('')}</div>
    <div class="ptab">PRIZE cTOONS</div>
    <div class="list">${CTOONS.filter(t => t.series === 'pz').map(t => `<div class="li"><div class="row"><div class="li-tok">${state.prizes.includes(t.id) ? tokenSVG(t, 48, { bubble: false }) : shadowTokenSVG(t, 48)}</div><div><b>${esc(t.name)}</b><div class="small">${esc(t.blurb)}</div></div></div>${state.prizes.includes(t.id) ? '<span class="okchip">EARNED</span>' : ''}</div>`).join('')}</div>
  </div>`;
}
function updatesView() {
  const d = (t) => new Date(t).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
  return `<div class="panel">
    <div class="ptab">ORBIT UPDATES</div>
    <div class="updates">${state.log.length ? state.log.map(l => `<div class="upd"><div class="upd-date">${d(l.t)}</div><div>${esc(l.text)}</div></div>`).join('') : '<div class="upd"><div class="upd-date">TODAY</div><div>Hey Orbiters, welcome aboard! Open a cPack at the cMart to get started.</div></div>'}</div>
  </div>`;
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
    return `<div class="charset ${have === eds.length ? 'complete' : ''}">
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
  showModal(`<div class="detail">
      <div class="ptab">cTOON DETAILS</div>
      <div class="detail-top">
        <div class="detail-tok">${n ? tokenSVG(t, 150) : shadowTokenSVG(t, 150)}</div>
        <div class="detail-info">
          <h2>${n ? esc(t.name) : '???'}</h2>
          <div class="row wrap"><span class="stag">${esc(s.name)}</span>${rtag(t)}${t.edition && t.edition !== 'Prize' ? `<span class="etag">${esc(t.edition)}</span>` : ''}</div>
          <div class="statline"><span>VALUE</span><b>${t.points}</b><span>gTOON</span><b>${t.pts}</b>${ctag(t)}</div>
        </div>
      </div>
      ${n ? `<p class="blurb">“${esc(t.blurb)}”</p>` : '<p class="blurb muted">Not in your binder yet. Find it in cPacks, trades or by winning gToons.</p>'}
      <div class="power"><span>POWER</span> ${esc(powerText(t.power))}</div>
      <div class="small">Owned ${n} · In deck ${inDeck} · In cZone ${inZone}</div>
      <div class="row wrap">${actions.join('')}</div>
      ${artSection(t)}
      <button class="obtn grey block" data-action="closeModal">CLOSE</button>
    </div>`);
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
      <div class="pack-art">${['📦', '🎁', '💎'][PACKS.indexOf(p)]}</div>
      <div class="pack-info"><b>${esc(p.name).toUpperCase()}</b><div class="small">${esc(p.desc)}</div>
        <div class="odds">${p.odds.map((o, i) => `<span style="--rc:${RARITY[i].color}">${RARITY[i].name.split(' ').map(w => w[0]).join('')} ${(o * 100).toFixed(o < 0.01 ? 1 : 0)}%</span>`).join('')}</div></div>
      <button class="obtn ${state.points >= p.price ? 'hot' : ''}" data-action="buyPack" data-id="${p.id}" ${state.points >= p.price ? '' : 'disabled'}>${fmt(p.price)} PTS</button>
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
    <p class="note">Trading with a real friend? Open a cToon in your Binder and choose <b>GIFT TO A FRIEND</b> to make a code they redeem under Orbit Help → Codes.</p>
  </div>`;
}

// ---------- COMPETE ----------
function arenaView() {
  const deckOk = state.deck.length === 12;
  return `<div class="panel">
    <div class="ptab">CHALLENGE ZONE</div>
    <div class="deckbar">
      <div><b>YOUR DECK</b> <span class="small">${state.deck.length}/12 gTOONS · ${state.deck.reduce((s, id) => s + BY_ID[id].pts, 0)} PTS</span></div>
      <div class="row"><button class="obtn grey" data-action="autoDeck">AUTO</button><button class="obtn" data-action="sub" data-id="deck">EDIT</button></div>
    </div>
    <div class="deck-strip">${state.deck.map(id => `<div class="mini">${tokenSVG(BY_ID[id], 44)}</div>`).join('')}${Array(12 - state.deck.length).fill(`<div class="mini">${socketSVG(44)}</div>`).join('')}</div>
    ${OPPONENTS.map(op => { const un = G.opponentUnlocked(op); const beat = state.beaten.includes(op.id);
      return `<div class="opp ${un ? '' : 'locked'}">
        <div class="opp-tok">${un ? tokenSVG(BY_ID[op.avatar], 64, { bubble: false }) : socketSVG(64)}</div>
        <div class="pack-info"><b>${esc(op.name).toUpperCase()} ${beat ? '✔' : ''}</b><div class="small">${un ? '“' + esc(op.taunt) + '”' : 'Beat the previous opponent to unlock.'}</div><div class="small">WIN +${op.reward} PTS${beat ? '' : ' · FIRST WIN +200 & PREMIUM cPACK'}</div></div>
        <button class="obtn ${un && deckOk ? 'hot' : ''}" data-action="battle" data-id="${op.id}" ${un && deckOk ? '' : 'disabled'}>PLAY</button>
      </div>`; }).join('')}
    ${deckOk ? '' : '<p class="note">You need 12 gToons in your deck. Tap AUTO to fill it with your best.</p>'}
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
    <div class="sbox-sub">${swaps ? `-${swaps * B.SWAP_COST} FOR SWAPPING` : '-10 FOR SWAPPING'}</div>
  </div>`;
}
function matchScreen() {
  const ev = B.evaluate(match.p, match.ai);
  const op = match.opponent;
  const sel = selectedHand >= 0 ? BY_ID[match.p.hand[selectedHand]] : null;
  const status = match.done ? (ev.aTotal > ev.bTotal ? 'GAME OVER — YOU WIN!' : ev.aTotal < ev.bTotal ? `GAME OVER — ${op.name.toUpperCase()} WINS.` : 'GAME OVER — IT’S A DRAW!')
    : match.turn === 'p' ? (sel ? 'NOW TAP AN EMPTY SOCKET ON YOUR SIDE OF THE BOARD.' : `ROUND ${match.round}: PICK A gTOON FROM YOUR HAND.`) : `${op.name.toUpperCase()} IS THINKING…`;
  const pCols = B.topColors(state.deck), aCols = B.topColors(match.ai.slots.filter(Boolean).concat(match.ai.hand, match.ai.deck));
  const canSwap = match.turn === 'p' && !match.done && selectedHand >= 0 && match.p.deck.length > 0;
  return `<div class="gz">
    <div class="gz-title">GTOON GAME ZONE</div>
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
        <div class="gz-tools"><button class="obtn small ${canSwap ? '' : 'grey'}" data-action="swapCard" ${canSwap ? '' : 'disabled'}>SWAP −10</button><span class="small">DECK ${match.p.deck.length}</span><button class="obtn small grey" data-action="forfeit">${match.done ? 'EXIT' : 'QUIT'}</button></div>
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
function whoosh() { if (!state.settings.sound) return; beep(300, 0.12, 'sine', 0.05); setTimeout(() => beep(900, 0.1, 'triangle', 0.06), 120); }
function slam() { if (!state.settings.sound) return; beep(120, 0.15, 'square', 0.07); setTimeout(() => beep(60, 0.2, 'sawtooth', 0.05), 40); }

// Which sockets changed value because of the last play? (for flash/shake effects)
function diffHits(before, after, landedWho, landedSlot) {
  const hits = {};
  const cmp = (who, a, b) => a.forEach((v, i) => { const w = b[i]; if (v && w && v.total !== w.total && !(who === landedWho && i === landedSlot)) hits[who + i] = w.total > v.total ? 'up' : 'down'; });
  cmp('p', before.a, after.a); cmp('ai', before.b, after.b);
  return hits;
}

function startBattle(opId) {
  const op = OPPONENTS.find(o => o.id === opId);
  if (!op || !G.opponentUnlocked(op) || state.deck.length !== 12) return;
  match = B.newMatch(state.deck.slice(), G.opponentDeck(op), op);
  selectedHand = -1; lastTotals = null; pendingLand = null; pendingHits = {}; busy = true;
  render();
  const intro = document.createElement('div'); intro.className = 'gz-intro';
  intro.innerHTML = `<b class="ready">READY?</b><b class="fight">BATTLE!</b>`;
  document.body.appendChild(intro);
  sfx.good(); setTimeout(() => sfx.great(), 650);
  setTimeout(() => { intro.remove(); busy = false; render(); if (match && match.turn === 'ai') setTimeout(aiTurn, 500); }, 1500);
}
function aiTurn() {
  if (!match || match.done || match.turn !== 'ai' || busy) return;
  const mv = B.aiChoose(match);
  const t = BY_ID[match.ai.hand[mv.handIndex]];
  const before = B.evaluate(match.p, match.ai);
  const from = rectOf('.sbox.ai .sbox-av') || rectOf('.gz-title');
  const to = rectOf(`.gz-side.ai .sock[data-i="${mv.slot}"]`);
  busy = true; whoosh();
  flyChip(t, from, to, { spins: 2, tilt: 14, dur: 750 }).then(() => {
    B.place(match, 'ai', mv.handIndex, mv.slot);
    pendingLand = { who: 'ai', slot: mv.slot };
    pendingHits = diffHits(before, B.evaluate(match.p, match.ai), 'ai', mv.slot);
    busy = false; slam(); render();
    if (match.done) setTimeout(finishMatch, 900);
  });
}
function finishMatch() {
  if (!match || !match.done) return;
  const ev = B.evaluate(match.p, match.ai);
  const won = ev.aTotal > ev.bTotal; const draw = ev.aTotal === ev.bTotal;
  const res = draw ? { points: 0, firstWin: false, bonus: [], prize: null } : G.recordBattle(match.opponent, won, ev.aTotal - ev.bTotal);
  won ? sfx.great() : draw ? sfx.good() : sfx.bad();
  showModal(`<div class="reveal"><div class="ptab">${won ? 'VICTORY!' : draw ? 'DRAW' : 'DEFEAT'}</div>
    <p class="big-score">${ev.aTotal} – ${ev.bTotal}</p>
    <div class="small">Colour bonus ${ev.aBonus} vs ${ev.bBonus}${ev.aSwaps ? ` · swaps −${ev.aSwaps * B.SWAP_COST}` : ''}</div>
    ${draw ? '<p>No points this time. Rematch?</p>' : `<p><b>+${res.points} POINTS</b>${res.firstWin ? ' · FIRST WIN BONUS!' : ''}</p>`}
    ${res.bonus.length ? `<p><b>PREMIUM cPACK UNLOCKED:</b></p><div class="reveal-toks">${res.bonus.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${tokenHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>` : ''}
    ${res.prize ? `<p><b>PRIZE cTOON UNLOCKED: ${esc(BY_ID[res.prize].name).toUpperCase()}!</b></p>` : ''}
    <div class="row center"><button class="obtn hot" data-action="rematch">REMATCH</button><button class="obtn grey" data-action="leaveMatch">CHALLENGE ZONE</button></div></div>`);
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
    <div class="zone-strip"><span>MY cZONE:</span><b>RATING ${fmt(rating)}</b><button class="zbtn" data-action="zonePicker">ADD cTOON</button><button class="zbtn" data-action="bgPicker">BACKGROUND</button><button class="zbtn" data-action="go" data-to="collect">VIEW COLLECTION</button></div>
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
    <div class="zone-strip"><span>cZONES:</span><button class="zbtn" data-action="visit" data-id="prev">PREVIOUS</button><button class="zbtn" data-action="visit" data-id="random">RANDOM</button><button class="zbtn" data-action="visit" data-id="next">NEXT</button><b>RATING ${fmt(z.rating)}</b></div>
    <div class="badgegrid">${z.items.map(it => `<div class="badge" data-action="detail" data-id="${it.id}">${badgeSVG(BY_ID[it.id], 100)}<span>${esc(BY_ID[it.id].name).toUpperCase()}</span></div>`).join('')}
      ${z.award ? `<div class="badge award"><div class="award-ring">${characterSVG(BY_ID[z.items[0].id], 70)}</div><span class="award-lbl">${esc(z.award).toUpperCase()} AWARD</span></div>` : ''}</div>
    <p class="note">Tap a cToon to see its details. cZones refresh every day.</p>
  </div>`;
}
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

// ---------- ORBIT HELP ----------
function codesView() {
  return `<div class="panel"><div class="ptab">ORBIT CODES</div>
    <p class="note">Promo codes give points, packs or cToons. Gift codes from friends move a cToon into your binder. Each code works once.</p>
    <div class="row"><input id="codeInput" class="oinput" placeholder="ENTER CODE" autocapitalize="characters" autocomplete="off"><button class="obtn" data-action="redeem">SUBMIT</button></div>
    <div class="featured">FEATURED CODE: <b>${G.featuredCode()}</b> <span class="small">(new every day, worth 150 points)</span></div>
    <p class="note">Psst: a few more codes are hiding in the game's README on GitHub.</p></div>`;
}
function backupView() {
  return `<div class="panel"><div class="ptab">AUTOMATIC SAVING</div>
    <p class="note">Your binder, points, cZone and progress are saved on this device after every action. Last saved: ${state.savedAt ? new Date(state.savedAt).toLocaleString() : 'never'}.</p>
    <div class="ptab">BACKUP CODE</div>
    <p class="note">Copy this code somewhere safe (Notes, email) or share it to your other device. It contains your whole save.</p>
    <div class="row"><button class="obtn" data-action="copySave">COPY CODE</button>${navigator.share ? '<button class="obtn grey" data-action="shareSave">SHARE…</button>' : ''}</div>
    <div class="ptab">RESTORE</div>
    <p class="note">Paste a backup code below. This replaces the save on this device.</p>
    <textarea id="restoreInput" class="oinput" rows="3" placeholder="ORBITSAVE1.…"></textarea>
    <button class="obtn grey" data-action="restoreSave">RESTORE</button></div>`;
}
function installView() {
  return `<div class="panel"><div class="ptab">INSTALL ON iPHONE OR iPAD</div>
    <ol class="steps">
      <li>Open this page in <b>Safari</b> (other browsers can't add web apps on iOS).</li>
      <li>Tap the <b>Share</b> button (the square with an arrow, at the bottom of the screen).</li>
      <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
      <li>Tap <b>Add</b>. Cartoon Orbit gets its own icon, opens full-screen and works offline.</li>
    </ol>
    <p class="note">Your save lives inside the installed app. Use <b>Backup</b> to copy it before switching devices.</p>
    ${isStandalone() ? '<span class="okchip">INSTALLED — YOU ARE RUNNING THE HOME SCREEN APP</span>' : ''}
    <div class="ptab">ANDROID</div><p class="note">Open the page in Chrome, tap the ⋮ menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p></div>`;
}
function settingsView() {
  return `<div class="panel"><div class="ptab">ORBIT NAME</div>
    <div class="row"><input id="nameInput" class="oinput" value="${esc(state.name)}" maxlength="16"><button class="obtn" data-action="saveName">SAVE</button></div>
    <div class="ptab">SOUND</div><button class="obtn ${state.settings.sound ? '' : 'grey'}" data-action="toggleSound">SOUND EFFECTS: ${state.settings.sound ? 'ON' : 'OFF'}</button>
    <div class="ptab">REAL ARTWORK</div>
    <p class="note">When on, each character's chip shows the free-licensed image from its Wikipedia article (hosted on Wikimedia Commons, mostly public-domain stills from the original works). Images are downloaded once and kept for offline play. Characters without a free image keep their drawn portrait. You can also set your own image on any cToon's details page.</p>
    <div class="row wrap"><button class="obtn ${artEnabled() ? '' : 'grey'}" data-action="toggleArt">REAL ARTWORK: ${artEnabled() ? 'ON' : 'OFF'}</button><button class="obtn grey" data-action="refreshArt">CHECK AGAIN</button></div>
    <div class="ptab">STATS</div><p class="note">Battles ${state.stats.battles} · Wins ${state.stats.wins} · Packs ${state.stats.packs} · Trades ${state.stats.trades} · Recycled ${state.stats.recycled} · Orbiter since ${new Date(state.created).toLocaleDateString()}</p>
    <div class="ptab danger">RESET</div><p class="note">Deletes your binder and progress on this device. Make a backup first!</p><button class="obtn grey" data-action="resetConfirm">RESET GAME</button>
    <p class="fine">Cartoon Orbit is a fan-made homage to the classic collect-and-battle web game. It is free, not for sale, and every character, series and piece of artwork here is original. Fonts: Michroma and Barlow Condensed (SIL Open Font License).</p></div>`;
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

// ---------- render ----------
export function render() {
  const app = $('#app');
  document.body.classList.toggle('in-match', !!match && state.onboarded);
  if (!state.onboarded) { app.innerHTML = onboardingScreen(); return; }
  G.ensureQuests(state);
  if (match) { app.innerHTML = matchScreen(); afterMatchRender(); return; }
  const views = {
    orbit: { home: homeView, quests: questsView, updates: updatesView },
    collect: { binder: binderView, cmart: cmartView, auction: auctionView },
    compete: { arena: arenaView, deck: deckView, rules: rulesView },
    czone: { mine: myZoneView, visit: visitView },
    help: { codes: codesView, backup: backupView, install: installView, settings: settingsView },
  };
  app.innerHTML = orbitFrame(views[section][subs[section]]());
  if (section === 'czone' && subs.czone === 'mine') bindStage();
}

function afterMatchRender() {
  const ev = B.evaluate(match.p, match.ai);
  document.querySelectorAll('.sbox-points').forEach(el => {
    const target = +el.dataset.total; const start = +el.textContent || 0;
    if (start === target) { el.textContent = target; return; }
    el.classList.add('bump');
    const t0 = performance.now(), dur = 550;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(start + (target - start) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  lastTotals = { a: ev.aTotal, b: ev.bTotal };
  pendingLand = null; pendingHits = {};
}

// ---------- actions ----------
const actions = {
  go(d) { section = d.to; if (d.sub) subs[section] = d.sub; zonePick = false; window.scrollTo(0, 0); },
  sub(d) { subs[section] = d.id; zonePick = false; window.scrollTo(0, 0); },
  none() {},
  closeModal() { closeModal(); },
  dismissInstall() { installDismissed = true; try { sessionStorage.setItem('installDismissed', '1'); } catch { /* ignore */ } },
  start() { G.startNewPlayer($('#nameInput')?.value); sfx.great(); section = 'orbit';
    setTimeout(() => showModal(`<div class="reveal"><div class="ptab">WELCOME, ${esc(state.name).toUpperCase()}!</div><p>Your starter binder has 15 cToons and 500 points. Claim your daily bonus, then open a cPack at the cMart.</p><button class="obtn block" data-action="closeModal">LET'S GO</button></div>`), 50); },
  claimDaily() { const r = G.claimDaily(); if (r) { sfx.good(); toast(`+${r.amount} points! Day ${r.streak} streak.`); if (r.prize) setTimeout(() => revealModal([r.prize], 'PRIZE UNLOCKED!'), 300); } },
  claimQuest(d) { const v = G.claimQuest(d.id); if (v) { sfx.good(); toast(`Quest complete! +${v} points.`); } },
  binderFilter(d) { binderFilter = d.id; },
  binderTier(d) { binderTier = d.id; },
  binderSeries(d) { binderFilter = d.id; section = 'collect'; subs.collect = 'binder'; window.scrollTo(0, 0); },
  detail(d) { sfx.tap(); detailModal(d.id); return false; },
  deckAdd(d) { commit(s => { if (s.deck.length < 12) s.deck.push(d.id); }); toast('Added to deck.'); detailModal(d.id); return false; },
  deckRemove(d) { commit(s => { const i = s.deck.indexOf(d.id); if (i >= 0) s.deck.splice(i, 1); }); toast('Removed from deck.'); detailModal(d.id); return false; },
  recycle(d) { const v = G.recycle(d.id); if (v) { sfx.good(); toast(`Recycled for +${v} points.`); } detailModal(d.id); return false; },
  gift(d) { const t = BY_ID[d.id];
    showModal(`<div class="ptab">GIFT ${esc(t.name).toUpperCase()}?</div><p class="note">This removes one ${esc(t.name)} from your binder and creates a code your friend can redeem under Orbit Help → Codes. Each code works once.</p>
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
  pickHand(d) { if (!match || match.turn !== 'p' || match.done || busy) return false; selectedHand = selectedHand === +d.i ? -1 : +d.i; sfx.tap(); },
  placeCard(d) { if (!match || match.turn !== 'p' || match.done || selectedHand < 0 || busy) return false;
    const slot = +d.i; if (match.p.slots[slot]) return false;
    const hi = selectedHand; const t = BY_ID[match.p.hand[hi]];
    const before = B.evaluate(match.p, match.ai);
    const from = rectOf(`.hslot[data-i="${hi}"]`); const to = rectOf(`.gz-side.p .sock[data-i="${slot}"]`);
    const src = $(`.hslot[data-i="${hi}"]`); if (src) src.style.visibility = 'hidden';
    busy = true; whoosh();
    flyChip(t, from, to, { spins: 2, tilt: -14 }).then(() => {
      B.place(match, 'p', hi, slot); selectedHand = -1;
      pendingLand = { who: 'p', slot };
      pendingHits = diffHits(before, B.evaluate(match.p, match.ai), 'p', slot);
      busy = false; slam(); render();
      if (match.done) setTimeout(finishMatch, 900); else setTimeout(aiTurn, 700);
    });
    return false; },
  swapCard() { if (!match || match.turn !== 'p' || match.done || selectedHand < 0 || busy) return false; if (B.swap(match, 'p', selectedHand)) { sfx.bad(); toast('Swapped. -10 points.'); } },
  slotInfo(d) { const side = match[d.who]; const id = side.slots[+d.i]; if (!id) return; const ev = B.evaluate(match.p, match.ai); const v = (d.who === 'p' ? ev.a : ev.b)[+d.i]; const t = BY_ID[id];
    showModal(`<div class="detail"><div class="ptab">${esc(t.name).toUpperCase()}</div><div class="detail-tok center">${tokenSVG(t, 120)}</div><div class="power"><span>POWER</span> ${esc(powerText(t.power))}</div>
      <div class="mods"><div>BASE <b>${v.base}</b></div>${v.mods.map(m => `<div>${m.v > 0 ? '+' : ''}${m.v} <span class="small">${esc(m.why)}</span></div>`).join('')}<div>TOTAL <b>${v.total}</b></div></div>
      <button class="obtn grey block" data-action="closeModal">CLOSE</button></div>`); return false; },
  forfeit() { if (busy) return false; if (match && !match.done) { if (!confirm('Quit this match? It counts as a loss.')) return false; G.recordBattle(match.opponent, false, 0); } match = null; closeModal(); },
  rematch() { const op = match.opponent; closeModal(); startBattle(op.id); return false; },
  leaveMatch() { closeModal(); match = null; },
  zonePicker() { zonePick = !zonePick; },
  zoneAdd(d) { const ok = G.placeInZone(d.id, 0.05 + Math.random() * 0.7, 0.05 + Math.random() * 0.6); if (ok) { toast('Placed in your cZone.'); sfx.tap(); closeModal(); section = 'czone'; subs.czone = 'mine'; zonePick = false; } else toast('cZone is full or you have no spare copy.'); },
  bgPicker() { bgModal(); return false; },
  setBg(d) { commit(s => { s.czone.bg = d.id; }); closeModal(); },
  buyBg(d) { if (G.buyBackground(d.id)) { sfx.good(); toast('Background unlocked!'); closeModal(); } else toast('Not enough points.'); return false; },
  visit(d) { const n = G.npcZones().length; if (d.id === 'prev') visitIndex--; else if (d.id === 'next') visitIndex++; else visitIndex = Math.floor(Math.random() * n); sfx.tap(); },
  trade(d) { const o = G.todaysTrades()[+d.i]; if (G.doTrade(o)) revealModal([o.get], 'TRADE COMPLETE!'); },
  redeem() { const r = G.redeemCode($('#codeInput')?.value); if (r.ok) { sfx.great(); if (r.ctoons?.length) revealModal(r.ctoons, r.text.toUpperCase()); else toast(r.text); } else { sfx.bad(); toast(r.text); } },
  copySave() { copy(exportCode()); return false; },
  shareSave() { navigator.share({ title: 'Cartoon Orbit save', text: exportCode() }).catch(() => {}); return false; },
  restoreSave() { try { const obj = parseSaveCode($('#restoreInput').value); if (!confirm('Replace the save on this device with this backup?')) return false; replaceState(obj); G.sanitize(); sfx.great(); toast('Save restored!'); section = 'orbit'; } catch (e) { sfx.bad(); toast(e.message); return false; } },
  saveName() { const v = ($('#nameInput')?.value || '').trim().slice(0, 16); if (v) { commit(s => { s.name = v; }); toast('Name saved.'); } },
  toggleSound() { commit(s => { s.settings.sound = !s.settings.sound; }); sfx.tap(); },
  toggleArt() { commit(s => { s.settings.realArt = s.settings.realArt === false; }); if (artEnabled()) refreshWiki(); sfx.tap(); },
  refreshArt() { if (!navigator.onLine) { toast('You are offline. Try again when connected.'); return false; } forgetWiki().then(() => refreshWiki(true)); toast('Looking up artwork…'); return false; },
  clearArt(d) { clearCustomArt(d.id).then(() => { toast('Your image was removed.'); detailModal(CTOONS.find(t => t.char === d.id).id); }); return false; },
  resetConfirm() { showModal(`<div class="ptab danger">RESET GAME?</div><p class="note">This permanently deletes your binder, points and cZone on this device.</p><div class="row center"><button class="obtn danger-btn" data-action="resetDo">YES, RESET</button><button class="obtn grey" data-action="closeModal">CANCEL</button></div>`); return false; },
  resetDo() { resetState(); closeModal(); match = null; section = 'orbit'; toast('Game reset.'); },
};

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
  catch { showModal(`<div class="ptab">COPY THIS</div><textarea class="oinput" rows="6" readonly>${esc(text)}</textarea><button class="obtn block" data-action="closeModal">DONE</button>`); }
}

export function bind() {
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]'); if (!el) return;
    const fn = actions[el.dataset.action]; if (!fn) return;
    e.preventDefault();
    const r = fn(el.dataset);
    if (r !== false) render();
  });
  document.body.addEventListener('change', (e) => {
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

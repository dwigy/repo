// All screens and interactions. Rendering is simple string templates and a
// single delegated click handler keyed on data-action attributes.
import { CTOONS, BY_ID, SERIES, RARITY, PACKS, OPPONENTS, BACKGROUNDS, abilityText } from './data.js';
import { ctoonSVG, ctoonShadowSVG } from './art.js';
import { state, commit, exportCode, parseSaveCode, replaceState, resetState, todayKey } from './store.js';
import * as G from './game.js';
import * as B from './gtoons.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => n.toLocaleString();

let screen = 'home';
let binderFilter = 'all';
let match = null;          // active gToons match
let selectedHand = -1;
let gtoonsView = 'lobby';  // lobby | deck | match
let zonePick = false;
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
    o.connect(g); g.connect(audio.destination);
    o.start(); o.stop(audio.currentTime + dur);
  } catch { /* no audio */ }
}
const sfx = {
  tap: () => beep(520, 0.05),
  good: () => { beep(660, 0.08); setTimeout(() => beep(880, 0.12), 80); },
  great: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle', 0.07), i * 90)); },
  bad: () => beep(180, 0.2, 'sawtooth', 0.04),
};

// ---------- shared components ----------
function rarityTag(t) { const r = RARITY[t.rarity]; return `<span class="rtag" style="--rc:${r.color}">${r.name}</span>`; }

function cardHTML(t, opts = {}) {
  const owned = opts.owned ?? true;
  const r = RARITY[t.rarity];
  const cls = ['ctoon', `r-${r.key}`, owned ? '' : 'unowned', opts.small ? 'small' : '', opts.selected ? 'selected' : ''].join(' ');
  const count = opts.count > 1 ? `<span class="count">x${opts.count}</span>` : '';
  const badge = opts.badge != null ? `<span class="pts">${opts.badge}</span>` : `<span class="pts">${t.points}</span>`;
  return `<div class="${cls}" style="--rc:${r.color}" data-action="${opts.action || 'detail'}" data-id="${t.id}" ${opts.data || ''}>
    <div class="art">${owned ? ctoonSVG(t) : ctoonShadowSVG(t)}</div>
    <div class="name">${owned ? esc(t.name) : '???'}</div>
    ${badge}${count}
  </div>`;
}

function topbar() {
  return `<div class="topbar">
    <div class="brand"><span class="logo">◉</span> Cartoon Orbit</div>
    <div class="wallet" data-action="nav" data-to="vendor"><span class="coin">●</span> ${fmt(state.points)}</div>
  </div>`;
}

// ---------- modal & toast ----------
export function showModal(html, cls = '') {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-back" data-action="closeModal"></div><div class="modal ${cls}">${html}</div>`;
  m.hidden = false;
}
export function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }
let toastTimer = null;
export function toast(text, ms = 2200) {
  const t = $('#toast');
  t.textContent = text; t.hidden = false; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); t.hidden = true; }, ms);
}

// ---------- screens ----------
function isIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function isStandalone() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }

function installBanner() {
  if (isStandalone() || installDismissed) return '';
  return `<div class="card banner">
    <b>Add Cartoon Orbit to your Home Screen</b>
    <p>${isIOS() ? 'Tap the <b>Share</b> button in Safari, then <b>Add to Home Screen</b>. It installs like an app and works offline.' : 'Open this page in Safari on your iPhone and use Share → Add to Home Screen. On Android, use the browser menu → Install app.'}</p>
    <div class="row"><button class="btn small" data-action="nav" data-to="more" data-sub="install">Show me how</button><button class="btn small ghost" data-action="dismissInstall">Later</button></div>
  </div>`;
}

function homeScreen() {
  const today = todayKey();
  const dailyDone = state.daily.last === today;
  const quests = G.todaysQuests();
  const prog = G.catalogProgress();
  const nextOp = OPPONENTS.find(o => !state.beaten.includes(o.id));
  return `${topbar()}
  <section class="screen">
    ${installBanner()}
    <div class="hero">
      <div class="hero-text">
        <div class="hi">Welcome back, <b>${esc(state.name)}</b></div>
        <div class="sub">${prog.have}/${prog.total} cToons collected · ${state.stats.wins} gToons wins</div>
        <div class="bar"><i style="width:${Math.round(100 * prog.have / prog.total)}%"></i></div>
      </div>
    </div>
    <div class="card daily ${dailyDone ? 'done' : ''}">
      <div>
        <b>Daily Orbit Bonus</b>
        <div class="muted">Streak: ${state.daily.streak} day${state.daily.streak === 1 ? '' : 's'}${state.daily.streak >= 7 ? ' 🔥' : ''} · 7 days in a row unlocks a Prize cToon</div>
      </div>
      ${dailyDone ? '<span class="chip ok">Claimed</span>' : '<button class="btn glow" data-action="claimDaily">Claim</button>'}
    </div>
    <h3>Today's Quests</h3>
    <div class="card list">
      ${quests.map(q => {
        const p = G.questProgress(q); const claimed = state.quests.claimed.includes(q.id);
        return `<div class="li"><div><div>${esc(q.text)}</div><div class="muted">${p}/${q.goal} · +${q.reward} pts</div></div>
          ${claimed ? '<span class="chip ok">Done</span>' : p >= q.goal ? `<button class="btn small glow" data-action="claimQuest" data-id="${q.id}">Claim</button>` : `<span class="chip">${Math.round(100 * p / q.goal)}%</span>`}</div>`;
      }).join('')}
    </div>
    <div class="grid2">
      <button class="tile" data-action="nav" data-to="vendor"><span>🎁</span>cToon Vendor<small>Open cPacks</small></button>
      <button class="tile" data-action="nav" data-to="gtoons"><span>⚔️</span>gToons<small>${nextOp ? 'Next: ' + esc(nextOp.name) : 'Champion!'}</small></button>
      <button class="tile" data-action="nav" data-to="more" data-sub="trade"><span>🔁</span>Trading Post<small>Daily offers</small></button>
      <button class="tile" data-action="nav" data-to="czone"><span>🪐</span>My cZone<small>${state.czone.items.length} on display</small></button>
    </div>
    <h3>Orbit Log</h3>
    <div class="card list log">${state.log.length ? state.log.map(l => `<div class="li"><span>${esc(l.text)}</span></div>`).join('') : '<div class="li muted">Nothing yet. Go open a cPack!</div>'}</div>
  </section>`;
}

function binderScreen() {
  const list = CTOONS.filter(t => binderFilter === 'all' ? true : t.series === binderFilter);
  const tabs = [['all', 'All'], ...Object.entries(SERIES).map(([k, s]) => [k, s.name])];
  const ownedIn = (k) => CTOONS.filter(t => (k === 'all' || t.series === k) && G.ownedCount(t.id) > 0).length;
  const totalIn = (k) => CTOONS.filter(t => k === 'all' || t.series === k).length;
  return `${topbar()}
  <section class="screen">
    <div class="tabs scroll">${tabs.map(([k, n]) => `<button class="tab ${binderFilter === k ? 'on' : ''}" data-action="binderFilter" data-id="${k}">${esc(n)} <em>${ownedIn(k)}/${totalIn(k)}</em></button>`).join('')}</div>
    ${binderFilter !== 'all' ? `<div class="muted series-blurb" style="border-color:${SERIES[binderFilter].color}">${esc(SERIES[binderFilter].blurb)}</div>` : ''}
    <div class="muted small-note">Binder value: ${fmt(G.binderValue())} pts · ${G.totalOwned()} cToons total</div>
    <div class="grid cards">${list.map(t => cardHTML(t, { owned: G.ownedCount(t.id) > 0, count: G.ownedCount(t.id) })).join('')}</div>
  </section>`;
}

function detailModal(id) {
  const t = BY_ID[id]; const n = G.ownedCount(id); const s = SERIES[t.series];
  const inDeck = state.deck.filter(d => d === id).length;
  const inZone = state.czone.items.filter(it => it.id === id).length;
  const actions = [];
  if (n > 0) {
    if (inDeck < n && state.deck.length < 12) actions.push(`<button class="btn small" data-action="deckAdd" data-id="${id}">Add to deck</button>`);
    if (inDeck > 0) actions.push(`<button class="btn small ghost" data-action="deckRemove" data-id="${id}">Remove from deck</button>`);
    if (inZone < n) actions.push(`<button class="btn small" data-action="zoneAdd" data-id="${id}">Place in cZone</button>`);
    if (n > 1 && t.series !== 'pz') actions.push(`<button class="btn small ghost" data-action="recycle" data-id="${id}">Recycle 1 (+${RARITY[t.rarity].recycle})</button>`);
    if (t.series !== 'pz') actions.push(`<button class="btn small ghost" data-action="gift" data-id="${id}">Gift to a friend</button>`);
  }
  showModal(`
    <div class="detail" style="--rc:${RARITY[t.rarity].color}">
      <div class="big-art ${n ? '' : 'unowned'}">${n ? ctoonSVG(t) : ctoonShadowSVG(t)}</div>
      <h2>${n ? esc(t.name) : '???'}</h2>
      <div class="row center"><span class="stag" style="--sc:${s.color}">${esc(s.name)}</span>${rarityTag(t)}<span class="chip">${t.points} pts</span></div>
      ${n ? `<p class="blurb">“${esc(t.blurb)}”</p>` : '<p class="blurb muted">Not in your binder yet. Find it in cPacks, trades or by winning gToons.</p>'}
      <div class="ability"><b>gToons ability:</b> ${esc(abilityText(t.ability, t.series))}</div>
      <div class="muted">Owned: ${n} · In deck: ${inDeck} · In cZone: ${inZone}</div>
      <div class="row wrap">${actions.join('')}</div>
      <button class="btn ghost block" data-action="closeModal">Close</button>
    </div>`);
}

function vendorScreen() {
  const free = G.dailyFreeCtoon(); const freeDone = state.dailyFree === todayKey();
  return `${topbar()}
  <section class="screen">
    <div class="vendor-head"><div class="vendor-face">🤖</div><div><b>The Vendor</b><div class="muted">“Fresh cPacks! Get 'em while they're... packed.”</div></div></div>
    <div class="card daily ${freeDone ? 'done' : ''}">
      <div class="row"><div class="mini-art">${ctoonSVG(free, 48)}</div><div><b>Free daily cToon</b><div class="muted">${esc(free.name)} · ${RARITY[free.rarity].name}</div></div></div>
      ${freeDone ? '<span class="chip ok">Claimed</span>' : '<button class="btn glow" data-action="claimFree">Take it</button>'}
    </div>
    <h3>cPacks</h3>
    ${PACKS.map(p => `<div class="card pack ${p.id}">
      <div class="pack-art">${p.id === 'std' ? '📦' : p.id === 'prem' ? '🎁' : '💎'}</div>
      <div class="pack-info"><b>${esc(p.name)}</b><div class="muted">${esc(p.desc)}</div>
        <div class="odds">${p.odds.map((o, i) => `<span style="--rc:${RARITY[i].color}">${RARITY[i].name.split(' ').map(w => w[0]).join('')} ${(o * 100).toFixed(o < 0.01 ? 1 : 0)}%</span>`).join('')}</div></div>
      <button class="btn ${state.points >= p.price ? 'glow' : ''}" data-action="buyPack" data-id="${p.id}" ${state.points >= p.price ? '' : 'disabled'}>● ${fmt(p.price)}</button>
    </div>`).join('')}
    <p class="muted small-note">Earn points from the daily bonus, quests, gToons wins and recycling duplicate cToons.</p>
  </section>`;
}

function revealModal(ids, title = 'You got…') {
  showModal(`<div class="reveal"><h2>${esc(title)}</h2>
    <div class="reveal-cards">${ids.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${cardHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>
    <button class="btn block" data-action="closeModal">Sweet!</button></div>`);
  const best = Math.max(...ids.map(id => BY_ID[id].rarity));
  best >= 3 ? sfx.great() : sfx.good();
}

// ---- gToons ----
function gtoonsScreen() {
  if (gtoonsView === 'match' && match) return matchScreen();
  if (gtoonsView === 'deck') return deckScreen();
  const deckOk = state.deck.length === 12;
  return `${topbar()}
  <section class="screen">
    <h2 class="title">gToons Arena</h2>
    <div class="card row between">
      <div><b>Your deck</b><div class="muted">${state.deck.length}/12 cToons · ${fmt(state.deck.reduce((s, id) => s + BY_ID[id].points, 0))} base pts</div></div>
      <div class="row"><button class="btn small ghost" data-action="autoDeck">Auto</button><button class="btn small" data-action="gtoonsView" data-id="deck">Edit</button></div>
    </div>
    <div class="deck-strip">${state.deck.map(id => `<div class="mini">${ctoonSVG(BY_ID[id], 40)}</div>`).join('')}${Array(12 - state.deck.length).fill('<div class="mini empty"></div>').join('')}</div>
    <h3>Opponents</h3>
    ${OPPONENTS.map(op => { const un = G.opponentUnlocked(op); const beat = state.beaten.includes(op.id);
      return `<div class="card opp ${un ? '' : 'locked'}">
        <div class="opp-face">${['🧢', '📒', '🎩', '🤖', '👑'][OPPONENTS.indexOf(op)]}</div>
        <div class="pack-info"><b>${esc(op.name)} ${beat ? '✅' : ''}</b><div class="muted">${un ? '“' + esc(op.taunt) + '”' : 'Beat the previous opponent to unlock.'}</div><div class="muted">Win: +${op.reward} pts${beat ? '' : ' · first win: +200 & Premium cPack'}</div></div>
        <button class="btn ${un && deckOk ? 'glow' : ''}" data-action="battle" data-id="${op.id}" ${un && deckOk ? '' : 'disabled'}>Battle</button>
      </div>`; }).join('')}
    ${deckOk ? '' : '<p class="muted small-note">You need 12 cToons in your deck to battle. Tap Auto to fill it.</p>'}
    <details class="card rules"><summary>How to play gToons</summary>
      <p>Both players fill a 2×3 grid, one cToon per turn, from a hand of 4. When all 12 slots are full, points are added up. Highest total wins.</p>
      <p>Every cToon has an ability: bonuses for the top or bottom row, for adjacent cToons of the same series, penalties to the rival cToon directly across, and more. Read the abilities in your Binder and build a deck that works together.</p>
    </details>
  </section>`;
}

function deckScreen() {
  const owned = [];
  Object.entries(state.collection).forEach(([id, n]) => { if (n > 0) owned.push({ id, n }); });
  owned.sort((a, b) => BY_ID[b.id].points - BY_ID[a.id].points);
  return `${topbar()}
  <section class="screen">
    <div class="row between"><h2 class="title">Deck (${state.deck.length}/12)</h2><div class="row"><button class="btn small ghost" data-action="autoDeck">Auto</button><button class="btn small" data-action="gtoonsView" data-id="lobby">Done</button></div></div>
    <p class="muted small-note">Tap a cToon to add it to your deck, tap again to remove. You can add duplicates if you own more than one.</p>
    <div class="grid cards">${owned.map(({ id, n }) => { const t = BY_ID[id]; const inDeck = state.deck.filter(d => d === id).length;
      return cardHTML(t, { count: n, selected: inDeck > 0, action: 'deckToggle', badge: inDeck ? `${inDeck} in deck` : t.points }); }).join('')}</div>
  </section>`;
}

function slotHTML(side, i, ev, who) {
  const id = side.slots[i];
  const canDrop = who === 'p' && !id && match.turn === 'p' && selectedHand >= 0 && !match.done;
  if (!id) return `<div class="slot empty ${canDrop ? 'drop' : ''}" data-action="${who === 'p' ? 'placeCard' : 'none'}" data-i="${i}"></div>`;
  const t = BY_ID[id]; const v = ev[i];
  const delta = v.total - v.base;
  const last = match.lastMove && match.lastMove.who === who && match.lastMove.slot === i;
  return `<div class="slot filled ${last ? 'last' : ''}" style="--rc:${RARITY[t.rarity].color}" data-action="slotInfo" data-who="${who}" data-i="${i}">
    <div class="art">${ctoonSVG(t)}</div>
    <div class="val">${v.total}</div>
    ${delta ? `<div class="delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta}</div>` : ''}
  </div>`;
}

function matchScreen() {
  const ev = B.evaluate(match.p, match.ai);
  const op = match.opponent;
  const status = match.done ? (ev.aTotal > ev.bTotal ? 'You win!' : ev.aTotal < ev.bTotal ? `${op.name} wins.` : 'It’s a draw!') : match.turn === 'p' ? (selectedHand >= 0 ? 'Now tap an empty slot on your side.' : 'Your turn: pick a cToon from your hand.') : `${op.name} is thinking…`;
  return `<section class="screen match">
    <div class="score-head">
      <div class="side-score rival"><b>${esc(op.name)}</b><span>${ev.bTotal}</span></div>
      <div class="vs">VS</div>
      <div class="side-score me"><b>${esc(state.name)}</b><span>${ev.aTotal}</span></div>
    </div>
    <div class="board rival-board">${[0, 1, 2, 3, 4, 5].map(i => slotHTML(match.ai, i, ev.b, 'ai')).join('')}</div>
    <div class="status">${esc(status)}</div>
    <div class="board my-board">${[0, 1, 2, 3, 4, 5].map(i => slotHTML(match.p, i, ev.a, 'p')).join('')}</div>
    <div class="hand">${match.p.hand.map((id, hi) => cardHTML(BY_ID[id], { small: true, selected: selectedHand === hi, action: 'pickHand', data: `data-i="${hi}"` })).join('')}</div>
    <div class="row center"><button class="btn small ghost" data-action="forfeit">${match.done ? 'Back to arena' : 'Forfeit'}</button><span class="muted">Deck: ${match.p.deck.length} left</span></div>
  </section>`;
}

function startBattle(opId) {
  const op = OPPONENTS.find(o => o.id === opId);
  if (!op || !G.opponentUnlocked(op) || state.deck.length !== 12) return;
  match = B.newMatch(state.deck.slice(), G.opponentDeck(op), op);
  selectedHand = -1; gtoonsView = 'match';
  render();
  if (match.turn === 'ai') setTimeout(aiTurn, 700);
}
function aiTurn() {
  if (!match || match.done || match.turn !== 'ai') return;
  const mv = B.aiChoose(match);
  B.place(match, 'ai', mv.handIndex, mv.slot);
  sfx.tap(); render();
  if (match.done) setTimeout(finishMatch, 500);
}
function finishMatch() {
  if (!match || !match.done) return;
  const ev = B.evaluate(match.p, match.ai);
  const won = ev.aTotal > ev.bTotal; const draw = ev.aTotal === ev.bTotal;
  const res = draw ? { points: 0, firstWin: false, bonus: [], prize: null } : G.recordBattle(match.opponent, won, ev.aTotal - ev.bTotal);
  won ? sfx.great() : draw ? sfx.good() : sfx.bad();
  showModal(`<div class="reveal"><h2>${won ? '🏆 Victory!' : draw ? '🤝 Draw' : '💀 Defeat'}</h2>
    <p class="big-score">${ev.aTotal} – ${ev.bTotal}</p>
    ${draw ? '<p class="muted">No points this time. Rematch?</p>' : `<p>+${res.points} points${res.firstWin ? ' · First win bonus!' : ''}</p>`}
    ${res.bonus.length ? `<p><b>Premium cPack unlocked:</b></p><div class="reveal-cards">${res.bonus.map((id, i) => `<div class="flip" style="animation-delay:${i * 260}ms">${cardHTML(BY_ID[id], { count: 0 })}</div>`).join('')}</div>` : ''}
    ${res.prize ? `<p><b>PRIZE cToon unlocked: ${esc(BY_ID[res.prize].name)}!</b></p>` : ''}
    <div class="row center"><button class="btn" data-action="rematch">Rematch</button><button class="btn ghost" data-action="leaveMatch">Arena</button></div></div>`);
}

// ---- cZone ----
function czoneScreen() {
  const bg = BACKGROUNDS.find(b => b.id === state.czone.bg) || BACKGROUNDS[0];
  const rating = state.czone.items.reduce((s, it) => s + BY_ID[it.id].points, 0);
  const ownedIds = Object.keys(state.collection).filter(id => state.collection[id] > state.czone.items.filter(it => it.id === id).length);
  return `${topbar()}
  <section class="screen">
    <div class="row between"><h2 class="title">${esc(state.name)}'s cZone</h2><span class="chip">Rating ${fmt(rating)}</span></div>
    <div class="stage" id="stage" style="background:${bg.css}">
      ${state.czone.items.map((it, i) => `<div class="placed" data-i="${i}" style="left:${(it.x * 100).toFixed(1)}%;top:${(it.y * 100).toFixed(1)}%">${ctoonSVG(BY_ID[it.id], 56)}</div>`).join('')}
      ${state.czone.items.length ? '' : '<div class="stage-hint">Your cZone is empty. Add some cToons!</div>'}
    </div>
    <p class="muted small-note">Drag cToons to arrange them. Double-tap a cToon to remove it. Up to 20 on display.</p>
    <div class="row"><button class="btn" data-action="zonePicker">＋ Add cToon</button><button class="btn ghost" data-action="bgPicker">Background</button></div>
    ${zonePick ? `<h3>Pick a cToon</h3><div class="grid cards">${ownedIds.map(id => cardHTML(BY_ID[id], { count: state.collection[id], action: 'zoneAdd' })).join('') || '<p class="muted">Every cToon you own is already on display.</p>'}</div>` : ''}
  </section>`;
}
function bgModal() {
  showModal(`<h2>cZone Backgrounds</h2><div class="bg-grid">${BACKGROUNDS.map(b => { const un = state.unlockedBgs.includes(b.id);
    return `<button class="bg-opt ${state.czone.bg === b.id ? 'on' : ''}" data-action="${un ? 'setBg' : 'buyBg'}" data-id="${b.id}" style="background:${b.css}"><span>${esc(b.name)}${un ? '' : ` · ● ${b.cost}`}</span></button>`; }).join('')}</div>
    <button class="btn ghost block" data-action="closeModal">Close</button>`);
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
    const x = Math.min(0.95, Math.max(0.02, (e.clientX - drag.rect.left) / drag.rect.width - 0.07));
    const y = Math.min(0.9, Math.max(0.02, (e.clientY - drag.rect.top) / drag.rect.height - 0.1));
    drag.el.style.left = (x * 100) + '%'; drag.el.style.top = (y * 100) + '%';
    drag.pos = { x, y };
  });
  const end = () => { if (!drag) return; drag.el.classList.remove('dragging'); if (drag.pos) G.moveInZone(drag.i, drag.pos.x, drag.pos.y); drag = null; };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
}

// ---- More: trade / codes / backup / install / settings ----
let moreSub = 'trade';
function moreScreen() {
  const subs = [['trade', 'Trading Post'], ['codes', 'Orbit Codes'], ['backup', 'Backup'], ['install', 'Install'], ['settings', 'Settings']];
  return `${topbar()}
  <section class="screen">
    <div class="tabs scroll">${subs.map(([k, n]) => `<button class="tab ${moreSub === k ? 'on' : ''}" data-action="moreSub" data-id="${k}">${n}</button>`).join('')}</div>
    ${{ trade: tradeView, codes: codesView, backup: backupView, install: installView, settings: settingsView }[moreSub]()}
  </section>`;
}
function tradeView() {
  const offers = G.todaysTrades();
  return `<p class="muted small-note">Traders swap fresh offers every day. Give duplicates, get upgrades.</p>
    ${offers.map(o => { const give = BY_ID[o.give], get = BY_ID[o.get]; const have = G.ownedCount(o.give); const done = G.tradeDoneToday(o.idx);
      return `<div class="card trade ${done ? 'done' : ''}">
        <div class="trader">${esc(o.trader.name)}</div>
        <div class="trade-row">
          <div class="trade-side">${cardHTML(give, { count: 0, badge: `${o.giveN}× · ${give.points}` })}<div class="muted">You give (have ${have})</div></div>
          <div class="arrow">➜</div>
          <div class="trade-side">${cardHTML(get, { count: 0 })}<div class="muted">You get</div></div>
        </div>
        ${done ? '<span class="chip ok">Traded</span>' : `<button class="btn ${have >= o.giveN ? 'glow' : ''}" data-action="trade" data-i="${o.idx}" ${have >= o.giveN ? '' : 'disabled'}>Trade</button>`}
      </div>`; }).join('')}
    <p class="muted small-note">Want to trade with a real friend? Open a cToon in your Binder and tap <b>Gift to a friend</b> to create a code they can redeem under Orbit Codes.</p>`;
}
function codesView() {
  return `<div class="card"><b>Redeem an Orbit Code</b><p class="muted">Promo codes give points, packs or cToons. Gift codes from friends move a cToon into your binder.</p>
    <div class="row"><input id="codeInput" class="input" placeholder="e.g. ORBIT2000" autocapitalize="characters" autocomplete="off"><button class="btn" data-action="redeem">Redeem</button></div></div>
    <p class="muted small-note">Psst: there are a few codes hiding in the game's README on GitHub.</p>`;
}
function backupView() {
  return `<div class="card"><b>Automatic saving</b><p class="muted">Your binder, points, cZone and progress are saved on this device automatically after every action. Last saved: ${state.savedAt ? new Date(state.savedAt).toLocaleString() : 'never'}.</p></div>
    <div class="card"><b>Backup code</b><p class="muted">Copy this code somewhere safe (Notes, email) or share it to your other device. It contains your whole save.</p>
      <div class="row"><button class="btn" data-action="copySave">Copy code</button>${navigator.share ? '<button class="btn ghost" data-action="shareSave">Share…</button>' : ''}</div></div>
    <div class="card"><b>Restore from code</b><p class="muted">Paste a backup code below. This replaces the save on this device.</p>
      <textarea id="restoreInput" class="input" rows="3" placeholder="ORBITSAVE1.…"></textarea>
      <button class="btn ghost" data-action="restoreSave">Restore</button></div>`;
}
function installView() {
  return `<div class="card">
    <b>Install on iPhone or iPad (no computer needed)</b>
    <ol class="steps">
      <li>Open this page in <b>Safari</b> (other browsers can't add web apps on iOS).</li>
      <li>Tap the <b>Share</b> button (the square with an arrow, at the bottom of the screen).</li>
      <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
      <li>Tap <b>Add</b>. Cartoon Orbit now has its own icon, opens full-screen and works offline.</li>
    </ol>
    <p class="muted">Your save lives inside the installed app. Use <b>Backup</b> to copy it before switching devices.</p>
    ${isStandalone() ? '<span class="chip ok">Installed — you are running the Home Screen app.</span>' : ''}
  </div>
  <div class="card"><b>Android</b><p class="muted">Open the page in Chrome, tap the ⋮ menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p></div>`;
}
function settingsView() {
  return `<div class="card"><b>Orbiter name</b><div class="row"><input id="nameInput" class="input" value="${esc(state.name)}" maxlength="16"><button class="btn" data-action="saveName">Save</button></div></div>
    <div class="card row between"><b>Sound effects</b><button class="btn small ${state.settings.sound ? '' : 'ghost'}" data-action="toggleSound">${state.settings.sound ? 'On' : 'Off'}</button></div>
    <div class="card"><b>Stats</b><div class="muted">Battles ${state.stats.battles} · Wins ${state.stats.wins} · Packs ${state.stats.packs} · Trades ${state.stats.trades} · Recycled ${state.stats.recycled}</div><div class="muted">Playing since ${new Date(state.created).toLocaleDateString()}</div></div>
    <div class="card danger"><b>Reset everything</b><p class="muted">Deletes your binder and progress on this device. Make a backup first!</p><button class="btn ghost" data-action="resetConfirm">Reset game</button></div>
    <p class="muted small-note">Cartoon Orbit is a fan-made tribute to the classic collect-and-battle web game. All characters here are original.</p>`;
}

function onboardingScreen() {
  return `<section class="screen onboard">
    <div class="logo-big">◉</div>
    <h1>Cartoon Orbit</h1>
    <p>Collect cToons. Battle in gToons. Decorate your cZone. Everything saves automatically on this device.</p>
    <label class="muted">What should we call you?</label>
    <input id="nameInput" class="input big" placeholder="Orbiter" maxlength="16" autocomplete="off">
    <button class="btn glow block" data-action="start">Launch into Orbit</button>
  </section>`;
}

// ---------- render ----------
const NAV = [['home', '🏠', 'Orbit'], ['binder', '📒', 'Binder'], ['vendor', '🎁', 'Vendor'], ['gtoons', '⚔️', 'gToons'], ['czone', '🪐', 'cZone'], ['more', '⋯', 'More']];
export function render() {
  const app = $('#app');
  if (!state.onboarded) { app.innerHTML = onboardingScreen(); return; }
  G.ensureQuests(state);
  const body = { home: homeScreen, binder: binderScreen, vendor: vendorScreen, gtoons: gtoonsScreen, czone: czoneScreen, more: moreScreen }[screen]();
  const inMatch = screen === 'gtoons' && gtoonsView === 'match';
  app.innerHTML = body + (inMatch ? '' : `<nav class="tabbar">${NAV.map(([k, ic, n]) => `<button class="nav ${screen === k ? 'on' : ''}" data-action="nav" data-to="${k}"><span>${ic}</span>${n}</button>`).join('')}</nav>`);
  if (screen === 'czone') bindStage();
}

// ---------- actions ----------
const actions = {
  nav(d) { screen = d.to; if (d.sub) moreSub = d.sub; if (screen === 'gtoons' && gtoonsView === 'match' && !match) gtoonsView = 'lobby'; zonePick = false; window.scrollTo(0, 0); },
  none() {},
  closeModal() { closeModal(); },
  dismissInstall() { installDismissed = true; try { sessionStorage.setItem('installDismissed', '1'); } catch { /* ignore */ } },
  start() { const name = $('#nameInput')?.value; G.startNewPlayer(name); sfx.great(); screen = 'home';
    setTimeout(() => showModal(`<div class="reveal"><h2>Welcome, ${esc(state.name)}!</h2><p>Your starter binder has 15 cToons and 500 points. Claim your daily bonus, then open a cPack at the Vendor.</p><button class="btn block" data-action="closeModal">Let's go</button></div>`), 50); },
  claimDaily() { const r = G.claimDaily(); if (r) { sfx.good(); toast(`+${r.amount} points! Day ${r.streak} streak.`); if (r.prize) setTimeout(() => revealModal([r.prize], 'PRIZE unlocked!'), 300); } },
  claimQuest(d) { const v = G.claimQuest(d.id); if (v) { sfx.good(); toast(`Quest complete! +${v} points.`); } },
  binderFilter(d) { binderFilter = d.id; },
  detail(d) { sfx.tap(); detailModal(d.id); return false; },
  deckAdd(d) { commit(s => { if (s.deck.length < 12) s.deck.push(d.id); }); toast('Added to deck.'); detailModal(d.id); return false; },
  deckRemove(d) { commit(s => { const i = s.deck.indexOf(d.id); if (i >= 0) s.deck.splice(i, 1); }); toast('Removed from deck.'); detailModal(d.id); return false; },
  recycle(d) { const v = G.recycle(d.id); if (v) { sfx.good(); toast(`Recycled for +${v} points.`); } detailModal(d.id); return false; },
  gift(d) { const t = BY_ID[d.id];
    showModal(`<h2>Gift ${esc(t.name)}?</h2><p class="muted">This removes one ${esc(t.name)} from your binder and creates a code your friend can redeem under More → Orbit Codes. Each code works once.</p>
      <div class="row center"><button class="btn" data-action="giftConfirm" data-id="${d.id}">Create gift code</button><button class="btn ghost" data-action="closeModal">Cancel</button></div>`); return false; },
  giftConfirm(d) { const code = G.giftCtoon(d.id); if (!code) return;
    showModal(`<h2>Gift code</h2><p class="muted">Send this to your friend:</p><div class="code">${code}</div>
      <div class="row center"><button class="btn" data-action="copyText" data-text="${code}">Copy</button>${navigator.share ? `<button class="btn ghost" data-action="shareText" data-text="${code}">Share…</button>` : ''}<button class="btn ghost" data-action="closeModal">Done</button></div>`); return false; },
  copyText(d) { copy(d.text); return false; },
  shareText(d) { navigator.share({ text: `A cToon gift for you in Cartoon Orbit! Redeem this code: ${d.text}` }).catch(() => {}); return false; },
  claimFree() { const t = G.claimDailyFree(); if (t) revealModal([t.id], 'Free cToon!'); },
  buyPack(d) { const ids = G.buyPack(d.id); if (ids) revealModal(ids, 'cPack opened!'); else toast('Not enough points.'); },
  gtoonsView(d) { gtoonsView = d.id; },
  autoDeck() { commit(s => { s.deck = G.autoDeck(s); }); toast('Deck auto-filled with your best cToons.'); },
  deckToggle(d) { commit(s => { const inDeck = s.deck.filter(x => x === d.id).length; const own = s.collection[d.id] || 0;
    if (inDeck < own && s.deck.length < 12) s.deck.push(d.id); else if (inDeck > 0) s.deck = s.deck.filter(x => x !== d.id); else toast('Deck is full (12).'); }); sfx.tap(); },
  battle(d) { startBattle(d.id); return false; },
  pickHand(d) { if (!match || match.turn !== 'p' || match.done) return; selectedHand = selectedHand === +d.i ? -1 : +d.i; sfx.tap(); },
  placeCard(d) { if (!match || match.turn !== 'p' || match.done || selectedHand < 0) return;
    if (B.place(match, 'p', selectedHand, +d.i)) { selectedHand = -1; sfx.tap(); render(); if (match.done) setTimeout(finishMatch, 500); else setTimeout(aiTurn, 650); } return false; },
  slotInfo(d) { const side = match[d.who]; const id = side.slots[+d.i]; if (!id) return; const ev = B.evaluate(match.p, match.ai); const v = (d.who === 'p' ? ev.a : ev.b)[+d.i]; const t = BY_ID[id];
    showModal(`<div class="detail" style="--rc:${RARITY[t.rarity].color}"><div class="big-art">${ctoonSVG(t)}</div><h2>${esc(t.name)}</h2><div class="ability"><b>Ability:</b> ${esc(abilityText(t.ability, t.series))}</div>
      <div class="mods"><div>Base <b>${v.base}</b></div>${v.mods.map(m => `<div>${m.v > 0 ? '+' : ''}${m.v} <span class="muted">${esc(m.why)}</span></div>`).join('')}<div>Total <b>${v.total}</b></div></div>
      <button class="btn ghost block" data-action="closeModal">Close</button></div>`); return false; },
  forfeit() { if (match && !match.done) { if (!confirm('Forfeit this match? It counts as a loss.')) return false; G.recordBattle(match.opponent, false, 0); } match = null; gtoonsView = 'lobby'; },
  rematch() { const op = match.opponent; closeModal(); startBattle(op.id); return false; },
  leaveMatch() { closeModal(); match = null; gtoonsView = 'lobby'; },
  zonePicker() { zonePick = !zonePick; },
  zoneAdd(d) { const ok = G.placeInZone(d.id, 0.1 + Math.random() * 0.7, 0.1 + Math.random() * 0.6); if (ok) { toast('Placed in your cZone.'); sfx.tap(); closeModal(); screen = 'czone'; zonePick = false; } else toast('cZone is full or you have no spare copy.'); },
  bgPicker() { bgModal(); return false; },
  setBg(d) { commit(s => { s.czone.bg = d.id; }); closeModal(); },
  buyBg(d) { if (G.buyBackground(d.id)) { sfx.good(); toast('Background unlocked!'); closeModal(); } else toast('Not enough points.'); return false; },
  moreSub(d) { moreSub = d.id; },
  trade(d) { const o = G.todaysTrades()[+d.i]; if (G.doTrade(o)) { revealModal([o.get], 'Trade complete!'); } },
  redeem() { const r = G.redeemCode($('#codeInput')?.value); if (r.ok) { sfx.great(); if (r.ctoons?.length) revealModal(r.ctoons, r.text); else toast(r.text); } else { sfx.bad(); toast(r.text); } },
  copySave() { copy(exportCode()); return false; },
  shareSave() { navigator.share({ title: 'Cartoon Orbit save', text: exportCode() }).catch(() => {}); return false; },
  restoreSave() { try { const obj = parseSaveCode($('#restoreInput').value); if (!confirm('Replace the save on this device with this backup?')) return false; replaceState(obj); sfx.great(); toast('Save restored!'); screen = 'home'; } catch (e) { sfx.bad(); toast(e.message); return false; } },
  saveName() { const v = ($('#nameInput')?.value || '').trim().slice(0, 16); if (v) { commit(s => { s.name = v; }); toast('Name saved.'); } },
  toggleSound() { commit(s => { s.settings.sound = !s.settings.sound; }); sfx.tap(); },
  resetConfirm() { showModal(`<h2>Reset game?</h2><p class="muted">This permanently deletes your binder, points and cZone on this device.</p><div class="row center"><button class="btn danger-btn" data-action="resetDo">Yes, reset</button><button class="btn ghost" data-action="closeModal">Cancel</button></div>`); return false; },
  resetDo() { resetState(); closeModal(); match = null; gtoonsView = 'lobby'; screen = 'home'; toast('Game reset.'); },
};

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
  catch { showModal(`<h2>Copy this</h2><textarea class="input" rows="6" readonly>${esc(text)}</textarea><button class="btn block" data-action="closeModal">Done</button>`); }
}

export function bind() {
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]'); if (!el) return;
    const fn = actions[el.dataset.action]; if (!fn) return;
    e.preventDefault();
    const r = fn(el.dataset);
    if (r !== false) render();
  });
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'codeInput') actions.redeem() !== false && render();
    if (e.key === 'Enter' && e.target.id === 'nameInput' && !state.onboarded) { actions.start(); render(); }
  });
}

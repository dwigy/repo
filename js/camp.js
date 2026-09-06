// The campaign's own UI: save slots, intro, starter stacks, region pages,
// the map, explore places and the heroes. Rendered full-screen by ui.js when
// the Campaign tab is open; shares helpers through init().
import { BY_ID, COLORS, RARITY, PACKS } from './data.js';
import { REGIONS, HEROES, STARTERS, REGION_PACKS, NODES, HERO_FIRST, lore, ruleText } from './campaign.js';
import { tokenSVG, shadowTokenSVG, socketSVG, zoneBadgeSVG, packSVG } from './art.js';
import { state, commit } from './store.js';
import * as G from './game.js';
import * as B from './gtoons.js';

let H = {}; // helpers from ui.js: esc, fmt, showModal, closeModal, toast, snd, tokenHTML, showCards, startMatch, render, openPack
export function init(helpers) { H = helpers; }
let region = null;      // region index being viewed (1..7) or 8 for heroes
let game = null;        // running mini-game state
const esc = (s) => H.esc(s);

const regionBadge = (r, lit) => zoneBadgeSVG({ n: r.n, hue: r.theme.hue, name: r.name }, 44, lit);
const badgeSVG = (id, size = 40) => { const n = +String(id).replace('region', ''); const r = REGIONS[n - 1]; return id === 'complete' ? zoneBadgeSVG({ n: '★', hue: '#f5a623', name: '100%' }, size, true) : r ? zoneBadgeSVG({ n: r.n, hue: r.theme.hue, name: r.name }, size, true) : ''; };
export { badgeSVG };

// ---------- save slots ----------
export function slotsView() {
  const sv = G.saves();
  return `<div class="camp-shell slots">
    <div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>CAMPAIGN</b><span></span></div>
    <div class="slots-head"><div class="hero-kicker">CHOOSE A SAVE</div><h1>Three journeys. One binder.</h1></div>
    <div class="slot-list">${sv.map((s, i) => s ? `<div class="slot" data-action="campSelect" data-id="${i}">
        <div class="slot-badges">${s.badges.length ? s.badges.slice(0, 8).map(b => badgeSVG(b, 34)).join('') : zoneBadgeSVG({ n: s.region || 1, hue: '#8a97a8', name: '' }, 34, false)}</div>
        <div class="slot-info"><b>SAVE ${i + 1}${s.complete ? ' · 100%' : ''}</b><span>${s.stage === 'play' ? `[REGION ${G.currentRegionOf ? G.currentRegionOf(s) : regionOfSave(s)}] · ${s.gates.length}/7 BADGES · ${completionOf(s)}%` : s.stage === 'starter' ? 'CHOOSING A STACK' : 'INTRO'}</span><em>${playedText(s)} · ${new Date(s.lastPlayed).toLocaleDateString()}</em></div>
        <button class="slot-del" data-action="campDelete" data-id="${i}" aria-label="Delete save">×</button>
      </div>` : `<div class="slot empty" data-action="campNew" data-id="${i}"><div class="slot-badges">${socketSVG(34)}</div><div class="slot-info"><b>SAVE ${i + 1}</b><span>EMPTY · TAP TO BEGIN</span></div></div>`).join('')}</div>
  </div>`;
}
const regionOfSave = (s) => { let n = 1; while (n < 7 && s.gates.includes(`g${n}`)) n++; return n; };
const completionOf = (s) => G.completion(s).pct;
const playedText = (s) => { const m = Math.round((s.played || 0) / 60000); return m < 60 ? `${m} MIN` : `${Math.floor(m / 60)}H ${m % 60}M`; };

// ---------- intro ----------
export function introView() {
  return `<div class="camp-shell intro"><div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>[GAME]</b><span></span></div>
    <div class="intro-body"><div class="intro-art">${tokenSVG(BY_ID.alpha1, 150, { bubble: false })}</div>
    <h1>[GAME]</h1><p>A short introduction, told in title cards.</p>
    <button class="obtn primary big" data-action="campIntro">BEGIN</button></div></div>`;
}
// ---------- starter stacks ----------
export function starterView() {
  return `<div class="camp-shell starter"><div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>CHOOSE A STACK</b><span></span></div>
    <div class="slots-head"><div class="hero-kicker">FIVE STACKS. ONE LEADER EACH.</div><h1>Pick your first twelve.</h1><p class="note">The leader is the face of the stack. Play it first and it gets +${HERO_FIRST.n}.</p></div>
    <div class="starters">${STARTERS.map(st => { const hero = BY_ID[st.hero]; return `<div class="starter" style="--sc:${COLORS[st.color].hex}">
        <div class="starter-hero">${tokenSVG(hero, 96, { bubble: false })}</div>
        <div class="starter-info"><span class="tnode-kind">LEADER · ${esc(hero.short)}</span><b>${esc(st.name)}</b><em>${st.chips.slice(1).map(id => BY_ID[id].short).join(' · ')}</em></div>
        <div class="starter-strip">${st.chips.slice(1, 7).map(id => `<div class="mini">${tokenSVG(BY_ID[id], 30, { bubble: false })}</div>`).join('')}</div>
        <button class="obtn primary" data-action="campStarter" data-id="${st.id}">TAKE IT</button>
      </div>`; }).join('')}</div></div>`;
}

// ---------- region page ----------
function nodeCard(n, r) {
  const st = G.campStatus(n); const sv = G.activeSave();
  if (n.kind === 'npc') { const op = G.campOpponent(n); const k = 'abc'.indexOf(n.id.slice(-1));
    return `<div class="tnode ${st} npc" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div>
      <div class="tnode-info"><span class="tnode-kind">PLAYER ${k + 1} OF 3${ruleText(n.rules).length ? ' · ' + ruleText(n.rules)[0] : ''}</span><b>${esc(op.name)}</b><em>${st === 'done' ? 'BEATEN' + ((sv.beaten[n.id] || 0) > 1 ? ' ×' + sv.beaten[n.id] : '') : '+' + n.reward.coins + ' COINS'}</em></div><span class="tnode-go">${st === 'done' ? '✓' : '›'}</span></div>`; }
  if (n.kind === 'gate') return `<div class="tnode ${st} keeper" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div>
      <div class="tnode-info"><span class="tnode-kind">GATEKEEPER${ruleText(n.rules).length ? ' · ' + ruleText(n.rules)[0] : ''}</span><b>Gatekeeper ${r.n}</b><em>${st === 'done' ? 'BEATEN · BADGE WON' : st === 'locked' ? 'BEAT THE THREE PLAYERS FIRST' : 'BADGE + 1/1 CHIP'}</em></div><span class="tnode-go">${st === 'done' ? '✓' : st === 'locked' ? '·' : '›'}</span></div>`;
  return '';
}
export function regionView() {
  const sv = G.activeSave(); const cur = G.currentRegion();
  if (region == null || (region <= 7 && !G.regionUnlocked(region)) || (region === 8 && !G.heroesOpen())) region = cur;
  if (region === 8) return heroesView();
  const r = REGIONS[region - 1]; const gateDone = sv.gates.includes(r.gate.id);
  const npcDone = r.npcs.filter(n => sv.beaten[n.id]).length;
  const explored = r.places.filter(p => sv.explored.includes(p.id)).length;
  const pack = r.pack;
  return `<div class="camp-shell region" style="--s1:${r.theme.sky[0]};--s2:${r.theme.sky[1]};--s3:${r.theme.sky[2]};--hue:${r.theme.hue}">
    <div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>${esc(r.name)}</b><span class="camp-coins" data-action="campShop">${state.unlimited ? '∞' : H.fmt(state.points)} <i>COINS</i></span></div>
    <section class="region-hero">
      <div class="region-badge">${regionBadge(r, gateDone)}</div>
      <div class="hero-kicker">REGION ${r.n} OF 7${gateDone ? ' · BADGE WON' : ''}</div>
      <div class="tour-zone-name">${esc(r.name)}</div>
      <div class="tour-zone-place">[Region tagline placeholder]</div>
      <div class="region-meter"><span>${npcDone}/3 PLAYERS</span><span>${gateDone ? 'GATE OPEN' : 'GATE CLOSED'}</span><span>${explored}/${r.places.length} PLACES</span></div>
    </section>
    <div class="camp-body">
      <div class="tiles camp-tiles">
        <button class="tile" data-action="campNode" data-id="${r.train.id}"><div class="tile-art">${tokenSVG(BY_ID[G.campTrainOpponent(r.train).avatar], 60, { bubble: false })}</div><b>TRAIN</b><span>+${r.train.coins} COINS A WIN</span></button>
        <button class="tile" data-action="campShop"><div class="tile-art">${packSVG(pack, { size: 50 })}</div><b>SHOP</b><span>${esc(pack.name).toUpperCase()}</span></button>
        <button class="tile" data-action="campExplore"><div class="tile-art">${zoneBadgeSVG({ n: '?', hue: r.theme.hue, name: '' }, 60, true)}</div><b>EXPLORE</b><span>${explored}/${r.places.length} PLACES</span></button>
        <button class="tile" data-action="campMap"><div class="tile-art">${socketSVG(60)}</div><b>MAP</b><span>REGION ${cur} OF 7</span></button>
      </div>
      <div class="panel"><div class="ptab">THE GATE <em>${npcDone}/3 · ${gateDone ? 'OPEN' : 'CLOSED'}</em></div>
        <div class="tnodes">${r.npcs.map(n => nodeCard(n, r)).join('')}${nodeCard(r.gate, r)}</div></div>
      ${G.heroesOpen() ? `<div class="panel"><div class="ptab">THE HEROES</div><div class="tnodes"><div class="tnode open keeper" data-action="campRegion" data-id="8"><div class="tnode-av">${tokenSVG(BY_ID[HEROES[0].avatar], 56, { bubble: false })}</div><div class="tnode-info"><span class="tnode-kind">FINALE</span><b>Three Heroes</b><em>${sv.heroes.length}/3 BEATEN</em></div><span class="tnode-go">›</span></div></div></div>` : ''}
    </div></div>`;
}
function heroesView() {
  const sv = G.activeSave();
  return `<div class="camp-shell region" style="--s1:#1b2a44;--s2:#0f1a30;--s3:#05070f;--hue:#f5a623">
    <div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>THE HEROES</b><span class="camp-coins">${state.unlimited ? '∞' : H.fmt(state.points)} <i>COINS</i></span></div>
    <section class="region-hero"><div class="region-badge">${zoneBadgeSVG({ n: '★', hue: '#f5a623', name: 'heroes' }, 44, true)}</div><div class="hero-kicker">FINALE</div><div class="tour-zone-name">Three Heroes</div><div class="tour-zone-place">${sv.heroes.length}/3 BEATEN</div></section>
    <div class="camp-body"><div class="panel"><div class="tnodes">${HEROES.map((h, i) => { const st = G.campStatus(h); return `<div class="tnode ${st} keeper" data-action="campNode" data-id="${h.id}"><div class="tnode-av">${tokenSVG(BY_ID[h.avatar], 56, { bubble: false })}</div><div class="tnode-info"><span class="tnode-kind">HERO ${i + 1}${ruleText(h.rules).length ? ' · ' + ruleText(h.rules)[0] : ''}</span><b>[HERO ${'ABC'[i]}]</b><em>${st === 'done' ? 'BEATEN' : '+' + h.reward.coins + ' COINS'}</em></div><span class="tnode-go">${st === 'done' ? '✓' : '›'}</span></div>`; }).join('')}</div>
      <button class="obtn grey block" data-action="campMap">MAP</button></div></div></div>`;
}
export function mapModal() {
  const sv = G.activeSave(); const cur = G.currentRegion(); const c = G.completion(sv);
  H.showModal(`<div class="ptab">MAP <em>${c.pct}% COMPLETE</em></div>
    <div class="map-grid">${REGIONS.map(r => { const un = G.regionUnlocked(r.n); const done = sv.gates.includes(r.gate.id);
      return `<button class="map-stop ${un ? '' : 'locked'} ${r.n === cur ? 'cur' : ''}" data-action="campRegion" data-id="${r.n}" ${un ? '' : 'disabled'}>${regionBadge(r, done)}<b>${esc(r.name)}</b><span>${done ? 'BADGE WON' : un ? 'OPEN' : 'LOCKED'}</span></button>`; }).join('')}
      <button class="map-stop ${G.heroesOpen() ? '' : 'locked'}" data-action="campRegion" data-id="8" ${G.heroesOpen() ? '' : 'disabled'}>${zoneBadgeSVG({ n: '★', hue: '#f5a623', name: '' }, 44, G.heroesOpen())}<b>Heroes</b><span>${G.heroesOpen() ? sv.heroes.length + '/3' : 'SEVEN BADGES FIRST'}</span></button></div>
    <div class="small">${c.parts.map(([k, x, t]) => `${k.toUpperCase()} ${x}/${t}`).join(' · ')}</div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function shopModal() {
  const r = REGIONS[Math.min(7, region || 1) - 1]; const pack = r.pack; const free = G.dailyFreeCtoon(); const freeDone = state.dailyFree === (new Date()).toISOString().slice(0, 10);
  H.showModal(`<div class="ptab">${esc(r.name).toUpperCase()} SHOP</div>
    <div class="pack"><div class="pack-art">${packSVG(pack, { size: 58 })}</div><div class="pack-info"><b>${esc(pack.name).toUpperCase()}</b><div class="small">${esc(pack.desc)}</div>
      <div class="odds">${pack.odds.map((o, i) => o ? `<span style="--rc:${RARITY[i].color}">${RARITY[i].name[0]} ${(o * 100).toFixed(o < 0.01 ? 1 : 0)}%</span>` : '').join('')}</div></div>
      <button class="obtn ${G.canAfford(pack.price) ? 'hot' : ''}" data-action="campBuy" data-id="${r.n}" ${G.canAfford(pack.price) ? '' : 'disabled'}>${state.unlimited ? 'FREE' : H.fmt(pack.price) + ' COINS'}</button></div>
    ${PACKS.map(p => `<div class="pack"><div class="pack-art">${packSVG(p, { size: 58 })}</div><div class="pack-info"><b>${esc(p.name).toUpperCase()}</b><div class="small">${esc(p.desc)}</div></div><button class="obtn ${G.canAfford(p.price) ? 'hot' : ''}" data-action="buyPack" data-id="${p.id}" ${G.canAfford(p.price) ? '' : 'disabled'}>${state.unlimited ? 'FREE' : H.fmt(p.price) + ' COINS'}</button></div>`).join('')}
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function exploreModal() {
  const r = REGIONS[Math.min(7, region || 1) - 1]; const sv = G.activeSave();
  H.showModal(`<div class="ptab">EXPLORE ${esc(r.name).toUpperCase()}</div>
    <div class="tnodes">${r.places.map(p => { const done = sv.explored.includes(p.id); const kind = p.kind === 'lore' ? 'LORE' : p.kind === 'find' ? 'A CHIP TO FIND' : 'MINI-GAME';
      return `<div class="tnode ${done ? 'done' : 'open'}" data-action="campPlace" data-id="${p.id}"><div class="tnode-av">${p.kind === 'find' && p.reward.chip ? (done ? tokenSVG(BY_ID[p.reward.chip], 56, { bubble: false }) : shadowTokenSVG(BY_ID[p.reward.chip], 56)) : zoneBadgeSVG({ n: p.kind === 'game' ? '▶' : '¶', hue: r.theme.hue, name: '' }, 56, !done)}</div>
        <div class="tnode-info"><span class="tnode-kind">${kind}</span><b>${esc(p.name)}</b><em>${done ? (p.kind === 'game' ? 'BEST ' + (sv.games[p.id] || 0) + '/5 · PLAY AGAIN' : 'VISITED') : p.kind === 'game' ? 'UP TO +' + p.reward.coins + ' COINS' : p.kind === 'find' ? 'SOMETHING IS HERE' : 'A STORY'}</em></div><span class="tnode-go">${done && p.kind !== 'game' ? '✓' : '›'}</span></div>`; }).join('')}</div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function nodeModal(id) {
  const n = NODES[id]; if (!n) return; const st = G.campStatus(n); const chk = G.deckCheck();
  const op = n.kind === 'train' ? G.campTrainOpponent(n) : G.campOpponent(n); const rules = ruleText(n.rules || {});
  const r = n.region <= 7 ? REGIONS[n.region - 1] : null;
  const key = n.kind === 'npc' ? `r${n.region}.npc${n.id.slice(-1)}.intro` : n.kind === 'gate' ? `r${n.region}.gate.intro` : n.kind === 'hero' ? 'heroes.intro' : '';
  const line = n.kind === 'train' ? op.taunt : n.kind === 'hero' ? (lore(key) || [])[0] : lore(key);
  const sig = n.pool && n.pool.fixed ? n.pool.fixed.slice(0, 4) : [];
  H.showModal(`<div class="scout">
    <div class="scout-top"><div class="scout-av">${st === 'locked' ? socketSVG(110) : tokenSVG(BY_ID[op.avatar], 110, { bubble: false })}</div><div><div class="scout-kind">${n.kind === 'train' ? 'TRAINING' : n.kind === 'gate' ? 'GATEKEEPER' : n.kind === 'hero' ? 'HERO' : 'PLAYER'}</div><div class="scout-name">${esc(op.name)}</div>${line ? `<div class="scout-line">“${esc(line)}”</div>` : ''}</div></div>
    <div class="scout-rows">
      ${rules.length ? `<div><span>HOUSE RULES</span><b>${rules.join(' ')}</b></div>` : ''}
      ${n.pool && n.pool.mirror ? '<div><span>THEY BRING</span><b>A COPY OF YOUR STACK</b></div>' : sig.length ? `<div><span>THEY BRING</span><b class="sig">${sig.map(i => tokenSVG(BY_ID[i], 36, { bubble: false })).join('')}</b></div>` : ''}
      ${n.smart ? '<div><span>WARNING</span><b>READS YOUR HAND</b></div>' : ''}
      <div><span>REWARD</span><b>${n.kind === 'train' ? '+' + n.coins + ' COINS A WIN' : '+' + n.reward.coins + ' COINS' + (n.reward.one ? ' · 1/1 CHIP · BADGE' : '')}</b></div>
    </div>
    ${n.reward && n.reward.one ? `<div class="scout-chip">${G.ownedCount(n.reward.one) ? tokenSVG(BY_ID[n.reward.one], 84, { bubble: false }) : shadowTokenSVG(BY_ID[n.reward.one], 84)}</div>` : ''}
    <div class="deckline ${chk.ok ? 'ok' : 'bad'}">${chk.ok ? 'STACK READY' : esc(chk.why).toUpperCase() + ' <button class="obtn small" data-action="autoDeckCamp" data-id="' + n.id + '">AUTO-FILL</button>'}</div>
    <div class="row center"><button class="obtn primary big" data-action="campPlay" data-id="${n.id}" ${st !== 'locked' && chk.ok ? '' : 'disabled'}>${st === 'done' && n.kind !== 'train' ? 'PLAY AGAIN' : 'PLAY'}</button><button class="obtn grey" data-action="closeModal">BACK</button></div>
  </div>`);
}
// Mini-game: Higher or Lower, five rounds on chip points.
export function gameView(placeId) {
  const p = NODES[placeId]; const r = REGIONS[(p.region || 1) - 1];
  const pool = Object.keys(state.collection).filter(id => BY_ID[id] && BY_ID[id].series !== 'pz');
  const pick = () => BY_ID[pool[Math.floor(Math.random() * pool.length)]];
  game = { place: p, round: 0, score: 0, cur: pick(), next: pick(), max: 5, over: false, last: null };
  return gameHTML(r);
}
function gameHTML(r) {
  const g = game;
  return `<div class="camp-shell region" style="--s1:${r.theme.sky[0]};--s2:${r.theme.sky[1]};--s3:${r.theme.sky[2]};--hue:${r.theme.hue}">
    <div class="camp-top"><button class="camp-menu" data-action="campRegion" data-id="${r.n}">‹ BACK</button><b>${esc(g.place.name)}</b><span class="camp-coins">${g.score}/${g.max}</span></div>
    <div class="camp-body minigame">
      <div class="hero-kicker">HIGHER OR LOWER · ROUND ${Math.min(g.max, g.round + 1)} OF ${g.max}</div>
      <div class="mg-board"><div class="mg-cur">${tokenSVG(g.cur, 140)}</div><div class="mg-next">${g.over || g.last ? tokenSVG(g.last ? g.last.chip : g.next, 110) : shadowTokenSVG(g.next, 110)}</div></div>
      ${g.over ? `<div class="result-title">${g.score >= 4 ? 'SHARP' : g.score >= 2 ? 'NOT BAD' : 'UNLUCKY'}</div><div class="result-pts">${g.score}/${g.max} · +${g.coins} COINS</div><div class="row center"><button class="obtn primary" data-action="campRegion" data-id="${r.n}">DONE</button><button class="obtn grey" data-action="campPlace" data-id="${g.place.id}">AGAIN</button></div>`
      : `<p class="note">Is the next chip's number higher or lower than ${g.cur.pts}?</p>${g.last ? `<div class="mg-last ${g.last.ok ? 'ok' : 'bad'}">${g.last.ok ? 'RIGHT' : 'WRONG'} · ${g.last.chip.pts} vs ${g.last.prev}</div>` : ''}<div class="row center"><button class="obtn primary big" data-action="campGuess" data-id="hi">HIGHER</button><button class="obtn primary big" data-action="campGuess" data-id="lo">LOWER</button></div>`}
    </div></div>`;
}
export function guess(dir) {
  const g = game; if (!g || g.over) return;
  const ok = dir === 'hi' ? g.next.pts >= g.cur.pts : g.next.pts <= g.cur.pts;
  if (ok) g.score++;
  g.last = { ok, chip: g.next, prev: g.cur.pts }; g.round++;
  g.cur = g.next; const pool = Object.keys(state.collection).filter(id => BY_ID[id] && BY_ID[id].series !== 'pz'); g.next = BY_ID[pool[Math.floor(Math.random() * pool.length)]];
  H.snd(ok ? 'good' : 'bad');
  if (g.round >= g.max) { g.over = true; const res = G.finishGame(g.place.id, g.score, g.max); g.coins = res ? res.coins : 0; H.snd(g.score >= 4 ? 'win' : 'good'); }
}
export const inGame = () => !!game && !game.over;
export const currentGame = () => game;
export function clearGame() { game = null; }

// ---------- entry ----------
export function view() {
  const sv = G.activeSave();
  if (!sv) return slotsView();
  if (sv.stage === 'intro') return introView();
  if (sv.stage === 'starter') return starterView();
  if (game) return gameHTML(REGIONS[(game.place.region || 1) - 1]);
  return regionView();
}
export function setRegion(n) { region = n; }
export function getRegion() { return region; }

// Story beats to show on the region page: arrival cards once per region.
export function pendingStory() {
  const sv = G.activeSave(); if (!sv || sv.stage !== 'play' || game) return null;
  const n = region || G.currentRegion(); if (n > 7) { if (G.heroesOpen() && !G.storySeen('heroes.intro')) return ['heroes.intro', lore('heroes.intro')]; return null; }
  if (!G.storySeen(`r${n}.arrive`)) return [`r${n}.arrive`, lore(`r${n}.arrive`)];
  if (sv.complete && !G.storySeen('complete')) return ['complete', lore('complete')];
  return null;
}

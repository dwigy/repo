// The campaign's own UI: save slots, the intro, the first stack, town pages, the road
// map, places, the Gathering, the Hall, the chair and the belief. Rendered full-screen
// by ui.js when the Campaign tab is open; shares helpers through init().
import { BY_ID, COLORS, RARITY, PACKS } from './data.js';
import { REGIONS, GATHERING, HALL, STARTERS, NODES, HERO_FIRST, KEEPER_RULES, lore, ruleText } from './campaign.js';
import { WORLD, TERM, t, T, U, telling as tellingOf } from './lexicon.js';
import { tokenSVG, shadowTokenSVG, socketSVG, zoneBadgeSVG, packSVG } from './art.js';
import { state, commit } from './store.js';
import * as G from './game.js';
import * as B from './meeting.js';

let H = {}; // helpers from ui.js: esc, fmt, showModal, closeModal, toast, snd, tokenHTML, showCards, startMatch, render, openPack
export function init(helpers) { H = helpers; }
let region = null;      // region being viewed (1..7), 8 = the Gathering, 9 = the Hall
let game = null;        // running mini-game state
const esc = (s) => H.esc(s);
const first = (v) => Array.isArray(v) ? v[0] : v;

export const sealSVG = (id, size = 40) => {
  if (id === 'complete') return zoneBadgeSVG({ n: '★', hue: '#f5a623', name: 'every known' }, size, true);
  const n = +String(id).replace('region', ''); const r = REGIONS[n - 1];
  return r ? zoneBadgeSVG({ n: r.n, hue: r.theme.hue, name: r.name }, size, true) : '';
};
export const badgeSVG = sealSVG;
const regionMark = (r, lit) => zoneBadgeSVG({ n: r.n, hue: r.theme.hue, name: r.name }, 44, lit);

// ---------- save slots ----------
export function slotsView() {
  const sv = G.saves();
  return `<div class="camp-shell slots">
    <div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>THE ROAD</b><span></span></div>
    <div class="slots-head"><div class="hero-kicker">CHOOSE A ROAD</div><h1>Three roads. One ${t('binder')}.</h1></div>
    <div class="slot-list">${sv.map((s, i) => s ? `<div class="slot" data-action="campSelect" data-id="${i}">
        <div class="slot-badges">${s.seals.length ? s.seals.slice(0, 8).map(b => sealSVG(b, 34)).join('') : zoneBadgeSVG({ n: regionOfSave(s), hue: '#8a97a8', name: '' }, 34, false)}</div>
        <div class="slot-info"><b>ROAD ${i + 1}${s.complete ? ' · EVERY KNOWN' : ''}</b><span>${s.stage === 'play' ? `${esc(REGIONS[regionOfSave(s) - 1].name).toUpperCase()} · ${s.gates.length}/7 ${U('seal', 2)} · ${G.completion(s).pct}%` : s.stage === 'starter' ? 'CHOOSING A FIRST STACK' : 'THE BEGINNING'}</span><em>${playedText(s)} · ${new Date(s.lastPlayed).toLocaleDateString()}</em></div>
        <button class="slot-del" data-action="campDelete" data-id="${i}" aria-label="Delete road">×</button>
      </div>` : `<div class="slot empty" data-action="campNew" data-id="${i}"><div class="slot-badges">${socketSVG(34)}</div><div class="slot-info"><b>ROAD ${i + 1}</b><span>EMPTY · TAP TO SET OUT</span></div></div>`).join('')}</div>
  </div>`;
}
const regionOfSave = (s) => { let n = 1; while (n < 7 && s.gates.includes(`g${n}`)) n++; return n; };
const playedText = (s) => { const m = Math.round((s.played || 0) / 60000); return m < 60 ? `${m} MIN` : `${Math.floor(m / 60)}H ${m % 60}M`; };

// ---------- intro ----------
export function introView() {
  return `<div class="camp-shell intro"><div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>${esc(WORLD.game)}</b><span></span></div>
    <div class="intro-body"><div class="intro-art">${tokenSVG(BY_ID.alpha1, 150, { bubble: false })}</div>
    <h1>${esc(WORLD.game)}</h1><p>Seven ${t('town', 2)}. Seven ${t('keeper', 2)}. A ${t('stack')} of friends.</p>
    <button class="obtn primary big" data-action="campIntro">BEGIN</button></div></div>`;
}
// ---------- first stack ----------
export function starterView() {
  return `<div class="camp-shell starter"><div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>YOUR FIRST ${U('stack')}</b><span></span></div>
    <div class="slots-head"><div class="hero-kicker">FIVE ${U('stack', 2)}. ONE LEADER EACH.</div><h1>Pick your first twenty.</h1><p class="note">The leader stands in front. Play it first and it gets +${HERO_FIRST.n}.</p></div>
    <div class="starters">${STARTERS.map(st => { const hero = BY_ID[st.hero]; return `<div class="starter" style="--sc:${COLORS[st.color].hex}">
        <div class="starter-hero">${tokenSVG(hero, 96, { bubble: false })}</div>
        <div class="starter-info"><span class="tnode-kind">LEADER · ${esc(hero.short)}</span><b>${esc(st.name)}</b><em>${esc(hero.pull || '')}</em></div>
        <div class="starter-strip">${st.chips.slice(1, 8).map(id => `<div class="mini">${tokenSVG(BY_ID[id], 30, { bubble: false })}</div>`).join('')}</div>
        <button class="obtn primary" data-action="campStarter" data-id="${st.id}">CARRY THESE</button>
      </div>`; }).join('')}</div></div>`;
}

// ---------- town page ----------
function nodeCard(n, r) {
  const st = G.campStatus(n); const sv = G.activeSave();
  if (n.kind === 'npc') { const op = G.campOpponent(n);
    return `<div class="tnode ${st} npc" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div>
      <div class="tnode-info"><span class="tnode-kind">A PLAYER WORTH MEETING${ruleText(n.rules).length ? ' · ' + ruleText(n.rules)[0] : ''}</span><b>${esc(op.name)}</b><em>${st === 'done' ? 'MET' + ((sv.beaten[n.id] || 0) > 1 ? ' ×' + sv.beaten[n.id] : '') : '+' + n.reward.coins + ' ' + U('coin', 2)}</em></div><span class="tnode-go">${st === 'done' ? '✓' : '›'}</span></div>`; }
  if (n.kind === 'keeper') { const tl = n.telling ? tellingOf(n.telling) : null;
    return `<div class="tnode ${st} keeper" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div>
      <div class="tnode-info"><span class="tnode-kind">THE ${U('keeper')}'S DOOR${ruleText(n.rules).length ? ' · ' + ruleText(n.rules)[0] : ''}</span><b>${esc(n.title)}</b><em>${st === 'done' ? U('seal') + ' HELD' + (tl ? ' · ' + esc(tl.name).toUpperCase() : '') : st === 'locked' ? 'MEET THE THREE PLAYERS FIRST' : U('seal') + ' · ' + U('whole')}</em></div><span class="tnode-go">${st === 'done' ? '✓' : st === 'locked' ? '·' : '›'}</span></div>`; }
  if (n.kind === 'buyer') return `<div class="tnode ${st} corp" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${zoneBadgeSVG({ n: '?', hue: '#8a97a8', name: '' }, 56, st !== 'done')}</div><div class="tnode-info"><span class="tnode-kind">SOMEONE NEW IN TOWN</span><b>A friendly buyer</b><em>${st === 'done' ? (sv.corp.buyer === 'sold' ? 'YOU SOLD' : 'YOU SAID NO') : 'HAS A QUESTION FOR YOU'}</em></div><span class="tnode-go">›</span></div>`;
  if (n.kind === 'corp') return `<div class="tnode ${st} corp" data-action="campNode" data-id="${n.id}"><div class="tnode-av">${st === 'locked' ? socketSVG(56) : tokenSVG(BY_ID[n.avatar], 56, { bubble: false })}</div><div class="tnode-info"><span class="tnode-kind">${esc(WORLD.corp).toUpperCase()}${ruleText(n.rules).length ? ' · ' + ruleText(n.rules)[0] : ''}</span><b>${esc(G.campOpponent(n).name)}</b><em>${st === 'done' ? 'OUT-PLAYED' : n.role === 'baker' ? 'THE SHOP IS BARE UNTIL THEY LEAVE' : n.role === 'pilot' ? 'HOLDING A STOLEN ' + U('whole') : n.role === 'astronomer' ? 'THE FIRST OF TWO' : 'THE SECOND OF TWO'}</em></div><span class="tnode-go">${st === 'done' ? '✓' : st === 'locked' ? '·' : '›'}</span></div>`;
  return '';
}
export function regionView() {
  const sv = G.activeSave(); const cur = G.currentRegion();
  if (region == null || (region <= 7 && !G.regionUnlocked(region)) || (region === 8 && !G.gatheringOpen() && !G.gatheringDone()) || (region === 9 && !G.hallOpen())) region = cur;
  if (region === 8) return gatheringView();
  if (region === 9) return hallView();
  const r = REGIONS[region - 1]; const sealed = sv.gates.includes(r.gate.id);
  const npcDone = r.npcs.filter(n => sv.beaten[n.id]).length; const explored = r.places.filter(p => sv.explored.includes(p.id)).length;
  const closed = G.shopClosed(r.n);
  const white = r.n === 7 && sealed ? '#ffffff' : null;
  return `<div class="camp-shell region" style="--s1:${white || r.theme.sky[0]};--s2:${white ? '#dfe6ee' : r.theme.sky[1]};--s3:${white ? '#9fb0c6' : r.theme.sky[2]};--hue:${r.theme.hue}">
    <div class="camp-top"><button class="camp-menu" data-action="campExit">‹ MENU</button><b>${esc(r.name)}</b><span class="camp-coins" data-action="campShop">${state.unlimited ? '∞' : H.fmt(state.points)} <i>${U('coin', 2)}</i></span></div>
    <section class="region-hero ${white ? 'white' : ''}">
      <div class="region-badge">${regionMark(r, sealed)}</div>
      <div class="hero-kicker">${U('region')} ${r.n} OF 7 · ${esc(r.lesson).toUpperCase()}${sealed ? ' · ' + U('seal') + ' HELD' : ''}</div>
      <div class="tour-zone-name">${esc(r.name)}</div>
      <div class="tour-zone-place">${esc(r.town)}</div>
      <div class="tour-tag">“${esc(r.line)}”</div>
      <div class="region-meter"><span>${npcDone}/3 PLAYERS</span><span>${sealed ? U('seal') + ' HELD' : 'THE DOOR IS ' + (npcDone === 3 ? 'OPEN' : 'CLOSED')}</span><span>${explored}/${r.places.length} PLACES</span></div>
    </section>
    <div class="camp-body">
      <div class="tiles camp-tiles">
        <button class="tile" data-action="campNode" data-id="${r.train.id}"><div class="tile-art">${tokenSVG(BY_ID[G.campTrainOpponent(r.train).avatar], 60, { bubble: false })}</div><b>PRACTICE</b><span>+${r.train.coins} ${U('coin', 2)} A WIN</span></button>
        <button class="tile ${closed ? 'closed' : ''}" data-action="campShop"><div class="tile-art">${packSVG(r.pack, { size: 50 })}</div><b>${esc(r.shop.name).toUpperCase()}</b><span>${closed ? 'SHELVES BARE' : esc(r.shop.craft).toUpperCase()}</span></button>
        <button class="tile" data-action="campExplore"><div class="tile-art">${zoneBadgeSVG({ n: '?', hue: r.theme.hue, name: '' }, 60, true)}</div><b>EXPLORE</b><span>${explored}/${r.places.length} PLACES</span></button>
        <button class="tile" data-action="campMap"><div class="tile-art">${socketSVG(60)}</div><b>THE ROAD</b><span>${U('town')} ${cur} OF 7</span></button>
      </div>
      <div class="panel"><div class="ptab">${esc(r.name).toUpperCase()} <em>${npcDone}/3 · ${sealed ? 'HELD' : npcDone === 3 ? 'THE DOOR IS OPEN' : 'THE DOOR IS CLOSED'}</em></div>
        <div class="tnodes">${r.corp && r.corp.kind === 'buyer' ? nodeCard(r.corp, r) : ''}${r.corp && r.corp.kind === 'corp' && closed ? nodeCard(r.corp, r) : ''}${r.npcs.map(n => nodeCard(n, r)).join('')}${r.corp && r.corp.kind === 'corp' && !closed && r.corp.role === 'pilot' ? nodeCard(r.corp, r) : ''}${nodeCard(r.gate, r)}</div></div>
      ${r.n === 6 && (G.gatheringOpen() || G.gatheringDone()) ? `<div class="panel"><div class="ptab">THE FOOT OF THE SUMMIT</div><div class="tnodes"><div class="tnode ${G.gatheringDone() ? 'done' : 'open'} keeper" data-action="campRegion" data-id="8"><div class="tnode-av">${zoneBadgeSVG({ n: '!', hue: '#5d6f88', name: '' }, 56, true)}</div><div class="tnode-info"><span class="tnode-kind">${esc(WORLD.corp).toUpperCase()}</span><b>${esc(T('gathering' in TERM ? 'gathering' : 'x'))}${esc(WORLD.gathering.replace(/^the /, 'The '))}</b><em>${G.gatheringDone() ? 'STOPPED' : 'EVERYONE IS HALTED'}</em></div><span class="tnode-go">›</span></div></div></div>` : ''}
      ${G.hallOpen() ? `<div class="panel"><div class="ptab">${esc(WORLD.hall).toUpperCase()}</div><div class="tnodes"><div class="tnode open keeper" data-action="campRegion" data-id="9"><div class="tnode-av">${zoneBadgeSVG({ n: '12', hue: '#f5a623', name: '' }, 56, true)}</div><div class="tnode-info"><span class="tnode-kind">AN INVITATION</span><b>${esc(WORLD.hall.replace(/^the /, 'The '))}</b><em>${sv.hall.length}/3 SEATS MET${sv.belief ? ' · ' + esc(tellingOf(sv.belief).name).toUpperCase() : ''}</em></div><span class="tnode-go">›</span></div></div></div>` : ''}
    </div></div>`;
}
function gatheringView() {
  const sv = G.activeSave();
  return `<div class="camp-shell region" style="--s1:#9aa6b8;--s2:#3b465a;--s3:#0f1420;--hue:#5d6f88">
    <div class="camp-top"><button class="camp-menu" data-action="campRegion" data-id="6">‹ ${esc(REGIONS[5].name).toUpperCase()}</button><b>${esc(WORLD.gathering).toUpperCase()}</b><span class="camp-coins">${state.unlimited ? '∞' : H.fmt(state.points)} <i>${U('coin', 2)}</i></span></div>
    <section class="region-hero"><div class="region-badge">${zoneBadgeSVG({ n: '!', hue: '#5d6f88', name: '' }, 44, true)}</div><div class="hero-kicker">THE FOOT OF THE SUMMIT</div><div class="tour-zone-name">${esc(WORLD.gathering.replace(/^the /, ''))}</div><div class="tour-zone-place">${esc(WORLD.corp)} · two meetings, in the open</div></section>
    <div class="camp-body"><div class="panel"><div class="tnodes">${GATHERING.map(c => nodeCard(c, REGIONS[6])).join('')}</div>
      <p class="note">${G.gatheringDone() ? `The road to ${esc(REGIONS[6].name)} is open.` : 'Lose the second and the pair starts again.'}</p>
      ${G.gatheringDone() ? `<button class="obtn primary block" data-action="campRegion" data-id="7">GO UP</button>` : ''}</div></div></div>`;
}
function hallView() {
  const sv = G.activeSave(); const three = sv.hall.length >= HALL.length;
  if (three && !sv.chair) return chairView();
  if (three && sv.chair && !sv.belief) return beliefView();
  const tl = sv.belief ? tellingOf(sv.belief) : null;
  return `<div class="camp-shell region" style="--s1:#1b2a44;--s2:#0f1a30;--s3:#05070f;--hue:${tl ? tl.color : '#f5a623'}">
    <div class="camp-top"><button class="camp-menu" data-action="campRegion" data-id="7">‹ ${esc(REGIONS[6].name).toUpperCase()}</button><b>${esc(WORLD.hall).toUpperCase()}</b><span class="camp-coins">${state.unlimited ? '∞' : H.fmt(state.points)} <i>${U('coin', 2)}</i></span></div>
    <section class="region-hero"><div class="region-badge">${zoneBadgeSVG({ n: '12', hue: tl ? tl.color : '#f5a623', name: '' }, 44, true)}</div><div class="hero-kicker">TWELVE SEATS. ONE EMPTY CHAIR.</div><div class="tour-zone-name">${esc(WORLD.hall.replace(/^the /, ''))}</div><div class="tour-zone-place">${sv.hall.length}/3 SEATS MET${tl ? ' · ' + esc(tl.name) : ''}</div></section>
    <div class="camp-body"><div class="panel"><div class="tnodes">${HALL.map((h, i) => { const st = G.campStatus(h); return `<div class="tnode ${st} keeper" data-action="campNode" data-id="${h.id}"><div class="tnode-av">${tokenSVG(BY_ID[h.avatar], 56, { bubble: false })}</div><div class="tnode-info"><span class="tnode-kind">SEAT ${i + 1} OF TWELVE${ruleText(h.rules).length ? ' · ' + ruleText(h.rules)[0] : ''}</span><b>${esc(first(lore(`hall.${['one', 'two', 'three'][i]}.intro`)) || 'One of the twelve')}</b><em>${st === 'done' ? 'BOWED' : '+' + h.reward.coins + ' ' + U('coin', 2)}</em></div><span class="tnode-go">${st === 'done' ? '✓' : '›'}</span></div>`; }).join('')}</div>
      ${sv.corp && sv.corp.recovered ? `<div class="small">In the Hall's keeping: a ${t('whole')}, recovered on the road.</div><div class="scout-chip">${shadowTokenSVG(BY_ID.one6, 64)}</div>` : ''}
      <button class="obtn grey block" data-action="campMap">THE ROAD</button></div></div></div>`;
}
function chairView() {
  const seats = Array.from({ length: 13 }, (_, i) => `<div class="seat ${i === 12 ? 'empty' : ''}" ${i === 12 ? 'data-action="campSit"' : ''}>${i === 12 ? '' : socketSVG(40)}</div>`).join('');
  return `<div class="camp-shell region chair" style="--s1:#1b2a44;--s2:#0f1a30;--s3:#05070f;--hue:#f5a623">
    <div class="camp-top"><span></span><b>${esc(WORLD.hall).toUpperCase()}</b><span></span></div>
    <div class="camp-body chair-body"><div class="hero-kicker">TWELVE SEATS. ONE EMPTY CHAIR.</div><div class="seats">${seats}</div>
      <div class="tour-zone-name">Sit.</div><button class="obtn primary big" data-action="campSit">SIT</button></div></div>`;
}
function beliefView() {
  return `<div class="camp-shell region belief" style="--s1:#1b2a44;--s2:#0f1a30;--s3:#05070f;--hue:#f5a623">
    <div class="camp-top"><span></span><b>WHICH DO YOU BELIEVE?</b><span></span></div>
    <div class="camp-body"><div class="hero-kicker">NO WRONG ANSWER</div>
      <div class="tellings">${WORLD.tellings.map(tl => `<button class="telling" style="--tc:${tl.color}" data-action="campBelieve" data-id="${tl.key}"><b>${esc(tl.name.replace(/^the /, 'The '))}</b><p>${esc(tl.card)}</p></button>`).join('')}</div></div></div>`;
}
export function mapModal() {
  const sv = G.activeSave(); const cur = G.currentRegion(); const c = G.completion(sv);
  H.showModal(`<div class="ptab">THE ROAD <em>${c.pct}%</em></div>
    <div class="map-grid">${REGIONS.map(r => { const un = G.regionUnlocked(r.n); const done = sv.gates.includes(r.gate.id);
      return `<button class="map-stop ${un ? '' : 'locked'} ${r.n === cur ? 'cur' : ''}" data-action="campRegion" data-id="${r.n}" ${un ? '' : 'disabled'}>${regionMark(r, done)}<b>${esc(r.name)}</b><span>${done ? U('seal') + ' HELD' : un ? 'OPEN' : r.n === 7 && G.gatheringOpen() ? 'HALTED' : 'FURTHER ON'}</span></button>`; }).join('')}
      ${G.gatheringOpen() || G.gatheringDone() ? `<button class="map-stop ${G.gatheringDone() ? '' : 'cur'}" data-action="campRegion" data-id="8">${zoneBadgeSVG({ n: '!', hue: '#5d6f88', name: '' }, 44, true)}<b>${esc(WORLD.gathering.replace(/^the /, 'The '))}</b><span>${G.gatheringDone() ? 'STOPPED' : 'IN THE WAY'}</span></button>` : ''}
      <button class="map-stop ${G.hallOpen() ? '' : 'locked'}" data-action="campRegion" data-id="9" ${G.hallOpen() ? '' : 'disabled'}>${zoneBadgeSVG({ n: '12', hue: '#f5a623', name: '' }, 44, G.hallOpen())}<b>${esc(WORLD.hall.replace(/^the /, 'The '))}</b><span>${G.hallOpen() ? sv.hall.length + '/3' : 'SEVEN ' + U('seal', 2) + ' FIRST'}</span></button></div>
    <div class="small">${c.parts.map(([k, x, tt]) => `${k.toUpperCase()} ${x}/${tt}`).join(' · ')}</div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function shopModal() {
  const r = REGIONS[Math.min(7, region || 1) - 1]; const pack = r.pack; const closed = G.shopClosed(r.n);
  H.showModal(`<div class="ptab">${esc(r.shop.name).toUpperCase()} <em>${esc(r.shop.craft).toUpperCase()}</em></div>
    ${closed ? `<p class="note">${esc(first(lore('corp.emptied.closed')) || 'The shelves are bare today.')}</p>` : `<p class="note">Hand-made ${t('blank', 2)}, sealed. Empty until you open them.</p>
    <div class="pack"><div class="pack-art">${packSVG(pack, { size: 58 })}</div><div class="pack-info"><b>${esc(r.name).toUpperCase()} ${U('blank', 2)}</b><div class="small">${pack.size} ${t('blank', 2)}. Only sold here.</div>
      <div class="odds">${pack.odds.map((o, i) => o ? `<span style="--rc:${RARITY[i].color}">${RARITY[i].name[0]} ${(o * 100).toFixed(o < 0.01 ? 1 : 0)}%</span>` : '').join('')}</div></div>
      <button class="obtn ${G.canAfford(pack.price) ? 'hot' : ''}" data-action="campBuy" data-id="${r.n}" ${G.canAfford(pack.price) ? '' : 'disabled'}>${state.unlimited ? 'FREE' : H.fmt(pack.price) + ' ' + U('coin', 2)}</button></div>
    ${PACKS.map(p => `<div class="pack"><div class="pack-art">${packSVG(p, { size: 58 })}</div><div class="pack-info"><b>${esc(p.name).toUpperCase()}</b><div class="small">${esc(p.desc)}</div></div><button class="obtn ${G.canAfford(p.price) ? 'hot' : ''}" data-action="buyPack" data-id="${p.id}" ${G.canAfford(p.price) ? '' : 'disabled'}>${state.unlimited ? 'FREE' : H.fmt(p.price) + ' ' + U('coin', 2)}</button></div>`).join('')}`}
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function exploreModal() {
  const r = REGIONS[Math.min(7, region || 1) - 1]; const sv = G.activeSave();
  H.showModal(`<div class="ptab">EXPLORE ${esc(r.name).toUpperCase()}</div>
    <div class="tnodes">${r.places.map((p, i) => { const done = sv.explored.includes(p.id); const kind = p.kind === 'lore' ? 'A PLACE' : p.kind === 'find' ? 'SOMEONE IS WAITING' : 'A GAME';
      const name = first(lore(`r${r.n}.place${'abc'[i]}`)) || 'A place';
      return `<div class="tnode ${done ? 'done' : 'open'}" data-action="campPlace" data-id="${p.id}"><div class="tnode-av">${p.kind === 'find' && p.reward.chip ? (done ? tokenSVG(BY_ID[p.reward.chip], 56, { bubble: false }) : shadowTokenSVG(BY_ID[p.reward.chip], 56)) : zoneBadgeSVG({ n: p.kind === 'game' ? '▶' : '¶', hue: r.theme.hue, name: '' }, 56, !done)}</div>
        <div class="tnode-info"><span class="tnode-kind">${kind}</span><b>${esc(name.length > 34 ? name.slice(0, 32) + '…' : name)}</b><em>${done ? (p.kind === 'game' ? 'BEST ' + (sv.games[p.id] || 0) + '/5 · PLAY AGAIN' : 'VISITED') : p.kind === 'game' ? 'UP TO +' + p.reward.coins + ' ' + U('coin', 2) : p.kind === 'find' ? 'A NEW FRIEND' : 'WORTH A LOOK'}</em></div><span class="tnode-go">${done && p.kind !== 'game' ? '✓' : '›'}</span></div>`; }).join('')}</div>
    <button class="obtn grey block" data-action="closeModal">CLOSE</button>`);
}
export function nodeModal(id) {
  const n = NODES[id]; if (!n) return; const st = G.campStatus(n); const chk = G.deckCheck();
  if (n.kind === 'buyer') { const r = REGIONS[n.region - 1]; const sv = G.activeSave();
    H.showModal(`<div class="scout"><div class="ptab">A FRIENDLY BUYER</div>${(lore('corp.buyer.intro') || []).map(c => `<div class="scout-line">“${esc(c)}”</div>`).join('')}
      <div class="scout-rows"><div><span>THE OFFER</span><b>${n.offer} ${U('coin', 2)} for one of your doubles</b></div></div>
      ${st === 'done' ? `<p class="note">${esc(sv.corp.buyer === 'sold' ? lore('corp.buyer.accept') : lore('corp.buyer.refuse'))}</p><button class="obtn grey block" data-action="closeModal">CLOSE</button>` : `<div class="row center"><button class="obtn grey" data-action="campBuyer" data-id="yes">SELL ONE</button><button class="obtn primary" data-action="campBuyer" data-id="no">NO, THANK YOU</button></div>`}</div>`); return; }
  const op = n.kind === 'train' ? G.campTrainOpponent(n) : G.campOpponent(n); const rules = ruleText(n.rules || {});
  const r = n.region <= 7 ? REGIONS[n.region - 1] : null;
  const key = n.kind === 'npc' ? `r${n.region}.npc${n.id.slice(-1)}.intro` : n.kind === 'keeper' ? `r${n.region}.keeper.greet` : n.kind === 'hall' ? `hall.${['one', 'two', 'three'][n.seat - 1]}.intro` : n.kind === 'corp' ? `corp.${n.role === 'baker' ? 'emptied' : n.role === 'pilot' ? 'stolen' : n.role}.intro` : '';
  const line = n.kind === 'train' ? '' : first(lore(key));
  const sig = n.pool && n.pool.fixed ? n.pool.fixed.slice(0, 4) : [];
  const balance = n.kind === 'keeper' ? G.keeperBalance() : { ok: true };
  const declined = n.kind === 'keeper' && st === 'open' && !balance.ok;
  const playable = st !== 'locked' && chk.ok && !declined;
  const tl = n.kind === 'keeper' && st === 'done' && n.telling ? tellingOf(n.telling) : null;
  H.showModal(`<div class="scout">
    <div class="scout-top"><div class="scout-av">${st === 'locked' ? socketSVG(110) : tokenSVG(BY_ID[op.avatar], 110, { bubble: false })}</div><div><div class="scout-kind">${n.kind === 'train' ? 'PRACTICE' : n.kind === 'keeper' ? U('keeper') + ' OF ' + esc(r.name).toUpperCase() : n.kind === 'hall' ? 'ONE OF THE TWELVE' : n.kind === 'corp' ? esc(WORLD.corp).toUpperCase() : 'A PLAYER'}</div><div class="scout-name">${esc(op.name)}</div>${line ? `<div class="scout-line">“${esc(line)}”</div>` : ''}</div></div>
    ${declined ? `<div class="decline"><p>${esc(first(lore(`r${n.region}.keeper.decline`)) || 'Not like this.')}</p><p><b>${esc(r.question)}</b></p><p class="small">${esc(balance.why)}</p></div>` : ''}
    <div class="scout-rows">
      ${rules.length ? `<div><span>HOUSE RULE</span><b>${rules.join(' ')}</b></div>` : ''}
      ${n.kind === 'keeper' ? `<div><span>THE ${U('keeper')}</span><b>A balanced ${t('stack')}: six bright ones at most, one ${t('whole')} at most. Bow before and after.</b></div>` : ''}
      ${n.pool && n.pool.mirror ? `<div><span>THEY BRING</span><b>A COPY OF YOUR ${U('stack')}</b></div>` : sig.length ? `<div><span>THEY BRING</span><b class="sig">${sig.map(i => tokenSVG(BY_ID[i], 36, { bubble: false })).join('')}</b></div>` : ''}
      ${n.smart ? '<div><span>KNOWN FOR</span><b>SEEING YOUR HAND</b></div>' : ''}
      <div><span>AFTER</span><b>${n.kind === 'train' ? '+' + n.coins + ' ' + U('coin', 2) + ' A WIN' : '+' + n.reward.coins + ' ' + U('coin', 2) + (n.reward.whole ? ' · A ' + U('seal') + ' · THE ' + U('whole') : '')}</b></div>
      ${tl ? `<div><span>THEIR TELLING</span><b>${esc(tl.name)}</b></div>` : ''}
    </div>
    ${n.reward && n.reward.whole ? `<div class="scout-chip">${G.ownedCount(n.reward.whole) ? tokenSVG(BY_ID[n.reward.whole], 84, { bubble: false }) : shadowTokenSVG(BY_ID[n.reward.whole], 84)}</div>` : ''}
    <div class="deckline ${chk.ok ? 'ok' : 'bad'}">${chk.ok ? U('stack') + ' READY' : esc(chk.why).toUpperCase() + ' <button class="obtn small" data-action="autoDeckCamp" data-id="' + n.id + '">FILL IT</button>'}</div>
    <div class="row center"><button class="obtn primary big" data-action="campPlay" data-id="${n.id}" ${playable ? '' : 'disabled'}>${n.kind === 'keeper' ? 'KNOCK' : st === 'done' && n.kind !== 'train' ? 'MEET AGAIN' : 'MEET'}</button><button class="obtn grey" data-action="closeModal">BACK</button></div>
  </div>`);
}
// Mini-game: Higher or Lower, five rounds on companion numbers.
export function gameView(placeId) {
  const p = NODES[placeId]; const r = REGIONS[(p.region || 1) - 1];
  const pool = Object.keys(state.collection).filter(id => BY_ID[id] && BY_ID[id].series !== 'award');
  const pick = () => BY_ID[pool[Math.floor(Math.random() * pool.length)]];
  game = { place: p, round: 0, score: 0, cur: pick(), next: pick(), max: 5, over: false, last: null };
  return gameHTML(r);
}
function gameHTML(r) {
  const g = game;
  return `<div class="camp-shell region" style="--s1:${r.theme.sky[0]};--s2:${r.theme.sky[1]};--s3:${r.theme.sky[2]};--hue:${r.theme.hue}">
    <div class="camp-top"><button class="camp-menu" data-action="campRegion" data-id="${r.n}">‹ BACK</button><b>HIGHER OR LOWER</b><span class="camp-coins">${g.score}/${g.max}</span></div>
    <div class="camp-body minigame">
      <div class="hero-kicker">ROUND ${Math.min(g.max, g.round + 1)} OF ${g.max}</div>
      <div class="mg-board"><div class="mg-cur">${tokenSVG(g.cur, 140)}</div><div class="mg-next">${g.over || g.last ? tokenSVG(g.last ? g.last.chip : g.next, 110) : shadowTokenSVG(g.next, 110)}</div></div>
      ${g.over ? `<div class="result-title">${g.score >= 4 ? 'SHARP' : g.score >= 2 ? 'NOT BAD' : 'UNLUCKY'}</div><div class="result-pts">${g.score}/${g.max} · +${g.coins} ${U('coin', 2)}</div><div class="row center"><button class="obtn primary" data-action="campRegion" data-id="${r.n}">DONE</button><button class="obtn grey" data-action="campPlace" data-id="${g.place.id}">AGAIN</button></div>`
      : `<p class="note">Is the next number higher or lower than ${g.cur.pts}?</p>${g.last ? `<div class="mg-last ${g.last.ok ? 'ok' : 'bad'}">${g.last.ok ? 'RIGHT' : 'WRONG'} · ${g.last.chip.pts} vs ${g.last.prev}</div>` : ''}<div class="row center"><button class="obtn primary big" data-action="campGuess" data-id="hi">HIGHER</button><button class="obtn primary big" data-action="campGuess" data-id="lo">LOWER</button></div>`}
    </div></div>`;
}
export function guess(dir) {
  const g = game; if (!g || g.over) return;
  const ok = dir === 'hi' ? g.next.pts >= g.cur.pts : g.next.pts <= g.cur.pts;
  if (ok) g.score++;
  g.last = { ok, companion: g.next, prev: g.cur.pts }; g.round++;
  g.cur = g.next; const pool = Object.keys(state.collection).filter(id => BY_ID[id] && BY_ID[id].series !== 'award'); g.next = BY_ID[pool[Math.floor(Math.random() * pool.length)]];
  H.snd(ok ? 'good' : 'bad');
  if (g.round >= g.max) { g.over = true; const res = G.finishGame(g.place.id, g.score, g.max); g.coins = res ? res.coins : 0; H.snd(g.score >= 4 ? 'win' : 'good'); }
}
export const inGame = () => !!game && !game.over;
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

// Story beats on the town page, each once per road.
export function pendingStory() {
  const sv = G.activeSave(); if (!sv || sv.stage !== 'play' || game) return null;
  const n = region || G.currentRegion();
  if (n === 8) { if (G.gatheringOpen() && !G.storySeen('corp.gathering.halt')) return ['corp.gathering.halt', lore('corp.gathering.halt')]; return null; }
  if (n === 9) { if (!G.storySeen('hall.intro')) return ['hall.intro', lore('hall.intro')]; if (sv.hall.length >= 3 && !G.storySeen('hall.win')) return ['hall.win', lore('hall.win')]; if (sv.hall.length >= 3 && !sv.chair && !G.storySeen('chair')) return ['chair', lore('chair')]; if (sv.chair && !sv.belief && !G.storySeen('belief.ask')) return ['belief.ask', lore('belief.ask')]; if (sv.belief && !G.storySeen('belief.after')) return ['belief.after', [lore('belief.after')].flat()]; return null; }
  if (!G.storySeen(`r${n}.arrive`)) return [`r${n}.arrive`, lore(`r${n}.arrive`)];
  if (n === 6 && G.gatheringOpen() && !G.storySeen('corp.gathering.halt')) return ['corp.gathering.halt', lore('corp.gathering.halt')];
  if (sv.complete && !G.storySeen('complete')) return ['complete', lore('complete')];
  return null;
}

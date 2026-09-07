// End-to-end smoke test: a new save walks the whole road, from the cover page to the
// belief. Fails on any console error. Run with the app served at 127.0.0.1:8765.
//   python3 -m http.server 8765 & node scripts/smoke.mjs
import { chromium } from '/tmp/claude-0/-home-user-repo/c19aa6cd-c871-5486-8793-3befcb5f9f6b/scratchpad/node_modules/playwright-core/index.mjs';
const URL_ = process.env.SMOKE_URL || 'http://127.0.0.1:8765/index.html';
const SHOTS = process.env.SMOKE_SHOTS || '/tmp/claude-0/-home-user-repo/c19aa6cd-c871-5486-8793-3befcb5f9f6b/scratchpad/shots4';
const step = (n) => console.log('·', n);
let page;
const cards = async () => { for (let i = 0; i < 16; i++) { const c = await page.$('.tcard'); if (!c) { await page.waitForTimeout(350); if (!(await page.$('.tcard'))) break; continue; } try { await c.click(); } catch {} await page.waitForTimeout(300); } };
const shot = (n) => page.screenshot({ path: `${SHOTS}/${n}.png` }).catch(() => {});
const rip = async () => { await page.waitForSelector('#pkRip', { timeout: 12000 }); await page.click('#pkRip'); await page.waitForSelector('#pkCard', { timeout: 12000 }); await page.click('#pkSkip'); await page.waitForSelector('#pkDone'); await page.click('#pkDone'); await page.waitForTimeout(300); };
const meet = async () => {
  await page.waitForSelector('.gz', { timeout: 12000 }); await page.waitForTimeout(1600);
  for (let i = 0; i < 90; i++) {
    if (await page.$('.reveal')) break;
    const hand = page.locator('.hslot:not(.empty)').first();
    const drop = page.locator('.gz-side.p .sock.drop').first();
    try {
      if (await hand.count()) { await hand.click({ timeout: 2000 }); }
      if (await drop.count()) { await drop.click({ force: true, timeout: 2000 }); }
    } catch { /* the board re-rendered between queries; poll again */ }
    await page.waitForTimeout(450);
  }
  await page.waitForSelector('.reveal', { timeout: 20000 }); await page.waitForTimeout(250);
};
// Run a snippet in the page with the app's modules in scope: G game, S store, C campaign, D data, B meeting.
const dbg = (src) => page.evaluate(async (code) => {
  const [G, S, C, D, B] = await Promise.all(['./js/game.js', './js/store.js', './js/campaign.js', './js/data.js', './js/meeting.js'].map(m => import(m)));
  const AsyncFn = Object.getPrototypeOf(async () => {}).constructor;
  return new AsyncFn('G', 'S', 'C', 'D', 'B', code)(G, S, C, D, B);
}, src);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' <- ')));
page.on('console', m => { if (m.type() === 'error' && !/TUNNEL|net::|Failed to load resource/.test(m.text())) errors.push('CONSOLE ' + m.text()); });
try {
  step('cover'); await page.goto(URL_); await page.waitForSelector('.cover', { timeout: 15000 }); await shot('00-cover'); await page.click('.cover');
  step('new player'); await page.waitForSelector('#nameInput'); await page.fill('#nameInput', 'Smoke'); await page.click('[data-action=start]'); await rip();
  step('home'); await shot('01-home');
  step('binder'); await page.click('.lnav[data-to=collection]'); await page.waitForTimeout(300); await shot('02-binder');
  await page.click('.stab[data-id=stack]'); await page.waitForTimeout(250);
  const stackLine = (await page.textContent('.deckline')).trim(); step(`stack: ${stackLine}`);
  if (!/READY/.test(stackLine)) throw new Error('stack not ready: ' + stackLine);
  step('codes'); await page.click('.stab[data-id=codes]'); await page.fill('#codeInput', 'UNLIMITED'); await page.click('[data-action=redeem]'); await page.waitForTimeout(250);
  await page.fill('#codeInput', 'DEBUG'); await page.click('[data-action=redeem]'); await page.waitForTimeout(250);
  step('campaign: new road'); await page.click('.lnav[data-to=campaign]'); await page.waitForSelector('.slots'); await shot('03-roads'); await page.click('.slot.empty');
  await page.waitForSelector('.intro'); await page.click('[data-action=campIntro]'); await page.waitForTimeout(500); await shot('04-intro-card'); await cards();
  step('first stack'); await page.waitForSelector('.starters', { timeout: 10000 }); await shot('05-stacks'); await page.click('[data-action=campStarter][data-id=st1]'); await page.waitForTimeout(600); await cards();
  step('town'); await page.waitForSelector('.region', { timeout: 10000 }); await shot('06-town');
  const town = (await page.textContent('.tour-zone-name')).trim(); if (town !== 'The Hearth') throw new Error('wrong town: ' + town);
  step('shop'); await page.click('[data-action=campShop]'); await page.waitForSelector('.modal .pack'); await shot('07-shop'); await page.click('[data-action=campBuy]'); await rip();
  step('explore'); await page.click('[data-action=campExplore]'); await page.waitForSelector('.modal .tnodes'); await shot('08-explore');
  await page.click('.modal .tnode[data-id=p1b]'); await page.waitForSelector('.reveal', { timeout: 8000 }); await shot('09-found'); await page.click('.modal [data-action=closeModal]');
  step('a player'); await page.click('.tnode[data-id=n1a]'); await page.waitForSelector('.scout'); await shot('10-scout'); await page.click('[data-action=campPlay]'); await meet();
  step(`  result: ${(await page.textContent('.result-title')).trim()} ${(await page.textContent('.result-score')).trim().replace(/\s+/g, ' ')}`); await shot('11-result');
  await page.click('[data-action=leaveMatch]'); await page.waitForTimeout(400); await cards();
  step('Keeper declines an unbalanced stack');
  await dbg("return G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(4), G.debug.giveTier(3), null;");
  await dbg("const st = G.autoStack(); S.commit(x => { x.stack = st; }); return st.length;");
  await dbg("G.debug.winNode('n1a'); G.debug.winNode('n1b'); G.debug.winNode('n1c'); return null;");
  await page.reload(); await page.waitForSelector('.cover'); await page.click('.cover'); await page.waitForTimeout(500);
  await page.click('.lnav[data-to=campaign]'); await page.waitForTimeout(400); await cards();
  await page.waitForSelector('.tnode[data-id=g1]', { timeout: 10000 }); await page.click('.tnode[data-id=g1]'); await page.waitForSelector('.scout');
  const declined = await page.$('.decline'); step(`  declined: ${!!declined}`); await shot('12-keeper-decline');
  step('Keeper accepts a balanced stack');
  await dbg("const commons = D.PACKABLE.filter(t => t.rarity <= 1); const seen = {}; const out = []; for (const t of commons) { if (out.length >= 20) break; if ((seen[t.char] || 0) >= 3) continue; if (!S.state.collection[t.id]) G.debug.give(t.id); seen[t.char] = (seen[t.char] || 0) + 1; out.push(t.id); } S.commit(x => { x.stack = out; }); return B.validateStack(out);");
  await page.click('.modal [data-action=closeModal]'); await page.waitForTimeout(300);
  await page.click('.tnode[data-id=g1]'); await page.waitForSelector('.scout'); await page.waitForTimeout(200);
  const stillDeclined = await page.$('.decline'); step(`  declined now: ${!!stillDeclined}`);
  if (stillDeclined) throw new Error('Keeper still declines a balanced stack');
  await page.click('.modal [data-action=closeModal]');
  step('walk the rest of the road with the debug helpers');
  await dbg("G.debug.winNode('g1'); return null;");
  await page.reload(); await page.waitForSelector('.cover'); await page.click('.cover'); await page.waitForTimeout(400);
  await page.click('.lnav[data-to=campaign]'); await page.waitForTimeout(400); await cards();
  const seals1 = await dbg("return (G.activeSave().seals || []).length;"); step(`  Seals after Keeper 1: ${seals1}`);
  if (seals1 !== 1) throw new Error('no Seal after the first Keeper');
  await dbg("G.debug.buyerSeen(false); return null;");
  await dbg("G.debug.clearRoad(); return null;");
  await page.reload(); await page.waitForSelector('.cover'); await page.click('.cover'); await page.waitForTimeout(400);
  await page.click('.lnav[data-to=campaign]'); await page.waitForTimeout(500); await cards();
  const state1 = await dbg("const sv = G.activeSave(); return { seals: sv.seals.length, gathering: !!sv.corp.gathering, hall: G.hallOpen() };");
  step(`  ${JSON.stringify(state1)}`); await shot('13-summit');
  if (!state1.gathering || state1.seals < 7) throw new Error('road not finished: ' + JSON.stringify(state1));
  step('the Hall'); await page.click('[data-action=campRegion][data-id="9"]').catch(async () => { await page.click('[data-action=campMap]'); await page.click('.map-stop[data-id="9"]'); });
  await page.waitForTimeout(600); await cards(); await shot('14-hall');
  await dbg("G.debug.winNode('h1'); G.debug.winNode('h2'); G.debug.winNode('h3'); return null;");
  await page.click('[data-action=campMap]').catch(() => {}); await page.click('.modal [data-action=closeModal]').catch(() => {});
  await page.click('[data-action=campRegion][data-id="9"]').catch(() => {}); await page.waitForTimeout(600); await cards();
  step('the empty chair'); await page.waitForSelector('.seat.empty', { timeout: 10000 }); await shot('15-chair'); await page.click("[data-action=campSit]", { force: true }); await page.waitForTimeout(600); await cards();
  step('the belief'); await page.waitForSelector('.telling', { timeout: 10000 }); await shot('16-belief'); await page.click('.telling[data-id=seed]'); await page.waitForTimeout(600); await cards();
  const belief = await dbg("return G.activeSave().belief;"); step(`  belief: ${belief}`);
  if (belief !== 'seed') throw new Error('belief not stored');
  step('back to the app'); await page.click('[data-action=campRegion][data-id="7"]', { timeout: 5000 }).catch(() => {}); await page.waitForTimeout(400); await cards();
  await page.click('[data-action=campExit]', { timeout: 8000 }); await page.waitForTimeout(400);
  step('profile'); await page.click('.lnav[data-to=profile]'); await page.waitForTimeout(400); await shot('17-profile');
  const sealsShown = await page.$$eval('.award:not(.off)', els => els.length); step(`  Seals shown: ${sealsShown}`);
  if (sealsShown < 7) throw new Error('Seals missing on the profile: ' + sealsShown);
  const persisted = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('cartoon-orbit-save-v1')); return { v: s.v, stack: s.stack.length, companions: s.companions.length, seals: s.seals.length, belief: s.belief }; });
  step(`persisted: ${JSON.stringify(persisted)}`);
  if (persisted.v !== 2 || persisted.stack !== 20) throw new Error('bad save: ' + JSON.stringify(persisted));
  if (errors.length) throw new Error('console errors: ' + errors.slice(0, 4).join(' | '));
  console.log('\nsmoke: clean');
  await browser.close();
} catch (e) {
  console.log('\nSMOKE FAILED:', e.message.split('\n')[0]);
  try { await shot('zz-fail'); console.log('screen:', (await page.evaluate(() => document.body.innerText)).slice(0, 220).replace(/\n+/g, ' | ')); } catch {}
  if (errors.length) console.log('errors:', errors.slice(0, 5));
  await browser.close(); process.exit(1);
}

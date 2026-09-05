// Pack opening: rip the foil, burst, then flip the chips one by one from
// least rare to most rare. Runs as a full-screen overlay and resolves when
// the player collects their pulls.
import { BY_ID, RARITY, MYTHIC, LEGENDARY } from './data.js';
import { tokenSVG, chipBackSVG, packSVG } from './art.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export function openPack({ pack, ids, newIds = [] }, hooks = {}) {
  const sfx = hooks.sfx || (() => {});
  return new Promise((resolve) => {
    const root = document.createElement('div');
    root.className = 'pk';
    document.body.appendChild(root);
    document.body.classList.add('pk-open');
    let stage = 'sealed', idx = 0, flipped = false, busy = false;
    const cards = ids.map(id => BY_ID[id]);
    const best = Math.max(...cards.map(t => t.rarity));

    const close = () => { root.remove(); document.body.classList.remove('pk-open'); resolve(); };

    // ---------- sealed ----------
    function renderSealed() {
      root.innerHTML = `<div class="pk-back"></div>
        <div class="pk-stage">
          <div class="pk-hint">${esc(pack.name).toUpperCase()}</div>
          <div class="pk-packwrap"><div class="pk-pack" id="pkPack">${packSVG(pack, { size: 230 })}</div><div class="pk-tear" id="pkTear"></div></div>
          <div class="pk-sub">DRAG ACROSS THE TOP TO RIP IT OPEN</div>
          <button class="obtn pk-btn" id="pkRip">RIP IT</button>
          <button class="pk-x" id="pkSkip">SKIP</button>
        </div>`;
      const el = root.querySelector('#pkPack'), top = () => el.querySelector('.pack-top'), body = () => el.querySelector('.pack-body');
      let drag = null, progress = 0;
      const apply = (p) => {
        progress = p;
        const t = top(); if (!t) return;
        t.setAttribute('transform', `translate(${(p * 140).toFixed(1)} ${(-p * 26).toFixed(1)}) rotate(${(-p * 14).toFixed(1)} 110 20)`);
        body().setAttribute('transform', `translate(${(Math.sin(p * 40) * p * 2).toFixed(1)} 0)`);
        root.querySelector('#pkTear').style.width = (p * 100) + '%';
      };
      el.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, w: el.getBoundingClientRect().width }; el.setPointerCapture(e.pointerId); if (!progress) sfx('grab'); });
      el.addEventListener('pointermove', (e) => { if (!drag) return; const p = Math.min(1, Math.max(0, (e.clientX - drag.x) / (drag.w * 0.6))); if (p > progress + 0.12) sfx('rip'); apply(p); });
      const release = () => { if (!drag) return; drag = null; if (progress >= 0.7) burst(); else { const a = el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }], { duration: 250 }); a.onfinish = () => apply(0); } };
      el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release);
      root.querySelector('#pkRip').addEventListener('click', () => { if (stage !== 'sealed') return; apply(1); setTimeout(burst, 120); });
      root.querySelector('#pkSkip').addEventListener('click', () => renderSummary());
    }

    // ---------- burst ----------
    async function burst() {
      if (stage !== 'sealed') return; stage = 'burst';
      sfx('burst');
      const wrap = root.querySelector('.pk-packwrap');
      const pack = root.querySelector('#pkPack');
      const rect = pack.getBoundingClientRect();
      pack.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.18) rotate(-4deg)', opacity: 1, offset: .3 }, { transform: 'scale(.6)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
      // sparks
      const glow = RARITY[best].glow;
      for (let i = 0; i < 28; i++) {
        const s = document.createElement('i'); s.className = 'pk-spark';
        const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.2, d = 120 + (i % 5) * 45;
        s.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;background:${i % 4 ? '#fff' : glow};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--rot:${(i * 37) % 360}deg`;
        root.appendChild(s); setTimeout(() => s.remove(), 900);
      }
      root.querySelector('.pk-back').animate([{ background: 'rgba(8,14,32,.78)' }, { background: 'rgba(255,255,255,.9)', offset: .2 }, { background: 'rgba(8,14,32,.82)' }], { duration: 700 });
      // chips shoot out of the pack into a stack
      const stack = document.createElement('div'); stack.className = 'pk-flyers'; root.appendChild(stack);
      cards.forEach((t, i) => {
        const c = document.createElement('div'); c.className = 'pk-flyer'; c.innerHTML = chipBackSVG(100);
        c.style.cssText = `left:${rect.left + rect.width / 2 - 40}px;top:${rect.top + rect.height / 2 - 40}px;`;
        stack.appendChild(c);
        c.animate([
          { transform: 'translate(0,0) scale(.4) rotateY(0deg)', opacity: 0 },
          { transform: `translate(${(i - (cards.length - 1) / 2) * 60}px, -160px) scale(1) rotateY(360deg)`, opacity: 1, offset: .55 },
          { transform: `translate(${(i - (cards.length - 1) / 2) * 4}px, -40px) scale(1.1) rotateY(720deg)`, opacity: 1 },
        ], { duration: 900, delay: i * 70, easing: 'cubic-bezier(.3,.8,.3,1)', fill: 'forwards' });
      });
      await wait(900 + cards.length * 70 + 200);
      wrap.remove(); stack.remove();
      renderReveal();
    }

    // ---------- reveal ----------
    function renderReveal() {
      stage = 'reveal'; flipped = false;
      const t = cards[idx]; const r = RARITY[t.rarity];
      const hint = t.rarity >= LEGENDARY ? 'hint-legend' : t.rarity >= MYTHIC ? 'hint-mythic' : '';
      root.innerHTML = `<div class="pk-back"></div>
        <div class="pk-stage">
          <div class="pk-dots">${cards.map((c, i) => `<i class="${i < idx ? 'done' : ''} ${i === idx ? 'now' : ''}" style="--rc:${RARITY[c.rarity].color}"></i>`).join('')}</div>
          <div class="pk-rays" id="pkRays" style="--glow:${r.glow};--rc:${r.color}"></div>
          <div class="pk-card ${hint}" id="pkCard" style="--rc:${r.color};--glow:${r.glow}">
            <div class="pk-face pk-face-back">${chipBackSVG(220)}</div>
          </div>
          <div class="pk-info" id="pkInfo" hidden>
            <div class="pk-rarity" style="background:${r.color}">${r.name.toUpperCase()}${newIds.includes(t.id) ? ' · NEW!' : ''}</div>
            <div class="pk-name">${esc(t.short)}</div>
            <div class="pk-ed">${esc(t.edShort || t.edition)} · ${t.pts} PTS</div>
          </div>
          <div class="pk-sub" id="pkSub">${idx + 1} OF ${cards.length} · TAP TO FLIP</div>
          <button class="pk-x" id="pkSkip">SKIP</button>
        </div>`;
      root.querySelector('#pkSkip').addEventListener('click', () => renderSummary());
      const card = root.querySelector('#pkCard');
      const onTap = () => { if (busy) return; if (!flipped) flip(); else next(); };
      root.querySelector('.pk-stage').addEventListener('click', (e) => { if (e.target.closest('.pk-x')) return; onTap(); });
      // swipe left/up also advances
      let sx = 0, sy = 0;
      root.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
      root.addEventListener('pointerup', (e) => { if (flipped && !busy && (sx - e.clientX > 50 || sy - e.clientY > 50)) next(); });
      if (hint) sfx('tension');
    }
    async function flip() {
      busy = true; const t = cards[idx]; const card = root.querySelector('#pkCard'); const rays = root.querySelector('#pkRays');
      sfx('flip');
      const slow = t.rarity >= MYTHIC;
      if (t.rarity >= LEGENDARY) { card.classList.add('shimmer'); sfx('drum'); await wait(900); }
      await card.animate([{ transform: 'rotateY(0deg) scale(1)' }, { transform: 'rotateY(90deg) scale(1.08)' }], { duration: slow ? 380 : 220, easing: 'ease-in', fill: 'forwards' }).finished;
      card.classList.remove('shimmer');
      card.innerHTML = `<div class="pk-face">${tokenSVG(t, 220)}</div>`;
      card.animate([{ transform: 'rotateY(-90deg) scale(1.08)' }, { transform: 'rotateY(0deg) scale(1.15)', offset: .7 }, { transform: 'rotateY(0deg) scale(1)' }], { duration: slow ? 520 : 320, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' });
      rays.classList.add('on', 'r' + t.rarity);
      root.querySelector('#pkInfo').hidden = false;
      root.querySelector('#pkSub').textContent = idx < cards.length - 1 ? 'TAP OR SWIPE FOR THE NEXT ONE' : 'TAP TO SEE YOUR PULLS';
      sfx('reveal' + Math.min(4, t.rarity));
      if (t.rarity >= MYTHIC) {
        root.querySelector('.pk-stage').animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-5px,3px)' }, { transform: 'translate(5px,-3px)' }, { transform: 'translate(-3px,2px)' }, { transform: 'translate(0,0)' }], { duration: 360 });
        confetti(t.rarity >= LEGENDARY ? 46 : 18, RARITY[t.rarity]);
      }
      flipped = true; busy = false;
    }
    function confetti(n, r) {
      const cols = [r.color, r.glow, '#fff', r.color];
      for (let i = 0; i < n; i++) {
        const c = document.createElement('i'); c.className = 'pk-conf';
        c.style.cssText = `left:${50 + (Math.random() * 60 - 30)}%;top:40%;background:${cols[i % cols.length]};--dx:${(Math.random() * 2 - 1) * 260}px;--dy:${-120 - Math.random() * 260}px;--rot:${Math.random() * 720}deg;--dur:${900 + Math.random() * 600}ms`;
        root.appendChild(c); setTimeout(() => c.remove(), 1700);
      }
    }
    async function next() {
      busy = true;
      const card = root.querySelector('#pkCard');
      await card.animate([{ transform: 'translateX(0) rotate(0)', opacity: 1 }, { transform: 'translateX(-140%) rotate(-12deg)', opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).finished;
      idx++; busy = false;
      if (idx >= cards.length) renderSummary(); else renderReveal();
    }

    // ---------- summary ----------
    function renderSummary() {
      stage = 'summary';
      root.innerHTML = `<div class="pk-back"></div>
        <div class="pk-stage pk-summary">
          <div class="pk-hint">YOUR PULLS</div>
          <div class="pk-grid">${cards.map((t, i) => { const r = RARITY[t.rarity]; return `<div class="pk-cell" style="--rc:${r.color};animation-delay:${i * 90}ms">${tokenSVG(t, 100, { bubble: false })}<div class="pk-cell-name">${esc(t.short)}</div><div class="pk-cell-ed" style="color:${r.color}">${esc(t.edShort || t.edition)}</div>${newIds.includes(t.id) ? '<span class="pk-new">NEW</span>' : ''}</div>`; }).join('')}</div>
          <div class="pk-sub">${newIds.length ? `${newIds.length} NEW FOR YOUR BINDER` : 'ALL DUPLICATES · RECYCLE THEM FOR POINTS'}</div>
          <button class="obtn pk-btn" id="pkDone">COLLECT</button>
        </div>`;
      root.querySelector('#pkDone').addEventListener('click', close);
      sfx('done');
    }

    renderSealed();
  });
}

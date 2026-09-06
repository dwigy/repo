// Designed sound kit. Everything is synthesized with WebAudio so the app stays
// tiny and offline; each sound is paired with a visual pulse in the UI because
// iOS Safari has no haptics.
let ctx = null, master = null, enabled = true;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
export function setEnabled(v) { enabled = !!v; }

function tone({ f = 440, f2 = null, type = 'sine', dur = 0.1, vol = 0.06, at = 0, attack = 0.005, decay = null }) {
  const c = ac(); if (!c || !enabled) return;
  const t0 = c.currentTime + at;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + (decay || dur));
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + (decay || dur) + 0.02);
}
function noise({ dur = 0.12, vol = 0.05, at = 0, hp = 800, lp = 6000 }) {
  const c = ac(); if (!c || !enabled) return;
  const t0 = c.currentTime + at;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource(); src.buffer = buf;
  const h = c.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = hp;
  const l = c.createBiquadFilter(); l.type = 'lowpass'; l.frequency.value = lp;
  const g = c.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(h); h.connect(l); l.connect(g); g.connect(master); src.start(t0);
}
const arp = (notes, step = 0.09, dur = 0.14, type = 'triangle', vol = 0.07) => notes.forEach((f, i) => tone({ f, type, dur, vol, at: i * step }));

const KIT = {
  tap:     () => tone({ f: 520, type: 'square', dur: 0.05, vol: 0.035 }),
  pick:    () => tone({ f: 330, f2: 520, type: 'triangle', dur: 0.09, vol: 0.05 }),
  whoosh:  () => { noise({ dur: 0.35, vol: 0.03, hp: 300, lp: 3000 }); tone({ f: 300, f2: 900, type: 'sine', dur: 0.32, vol: 0.04 }); },
  land:    () => { tone({ f: 130, f2: 70, type: 'square', dur: 0.14, vol: 0.07 }); noise({ dur: 0.08, vol: 0.04, hp: 1500, lp: 8000 }); },
  clink:   () => { tone({ f: 1760, type: 'sine', dur: 0.18, vol: 0.05 }); tone({ f: 2640, type: 'sine', dur: 0.12, vol: 0.025, at: 0.01 }); },
  hitUp:   () => arp([660, 990], 0.06, 0.12),
  hitDown: () => tone({ f: 200, f2: 90, type: 'sawtooth', dur: 0.22, vol: 0.05 }),
  tick:    (v = 0) => tone({ f: 700 + Math.min(1400, v * 18), type: 'sine', dur: 0.045, vol: 0.04 }),
  grab:    () => tone({ f: 220, type: 'triangle', dur: 0.06, vol: 0.04 }),
  tear:    () => noise({ dur: 0.09, vol: 0.06, hp: 1200, lp: 9000 }),
  burst:   () => { tone({ f: 90, f2: 40, type: 'sawtooth', dur: 0.3, vol: 0.08 }); noise({ dur: 0.4, vol: 0.07, hp: 400, lp: 10000 }); arp([700, 1100, 1650], 0.07, 0.2, 'triangle', 0.06); },
  flip:    () => { tone({ f: 600, type: 'square', dur: 0.06, vol: 0.035 }); noise({ dur: 0.05, vol: 0.02, hp: 2000, lp: 9000 }); },
  tension: () => tone({ f: 140, f2: 180, type: 'sine', dur: 0.6, vol: 0.05 }),
  drum:    () => [0, 0.18, 0.36, 0.54].forEach((at, i) => tone({ f: 110 + i * 20, type: 'square', dur: 0.12, vol: 0.06, at })),
  reveal0: () => tone({ f: 520, type: 'triangle', dur: 0.1, vol: 0.05 }),
  reveal1: () => arp([600, 760]),
  reveal2: () => arp([523, 659, 784]),
  reveal3: () => arp([523, 659, 784, 1046], 0.09, 0.16),
  reveal4: () => { arp([392, 523, 659, 784, 1046, 1318], 0.1, 0.22, 'triangle', 0.08); noise({ dur: 0.5, vol: 0.03, hp: 3000, lp: 12000, at: 0.5 }); },
  win:     () => arp([523, 659, 784, 1046, 1318], 0.1, 0.25, 'triangle', 0.08),
  lose:    () => tone({ f: 220, f2: 110, type: 'sawtooth', dur: 0.5, vol: 0.045 }),
  done:    () => arp([660, 880], 0.08, 0.12),
  quip:    () => tone({ f: 880, f2: 1100, type: 'sine', dur: 0.07, vol: 0.03 }),
  good:    () => arp([660, 880], 0.08, 0.12),
  great:   () => arp([523, 659, 784, 1046], 0.09, 0.14),
  bad:     () => tone({ f: 180, f2: 120, type: 'sawtooth', dur: 0.2, vol: 0.04 }),
  set:     () => { arp([392, 523, 659, 784, 1046, 1318, 1568], 0.09, 0.3, 'triangle', 0.08); noise({ dur: 0.6, vol: 0.03, hp: 2500, lp: 12000, at: 0.4 }); },
};
export function play(name, arg) { const f = KIT[name]; if (f) { try { f(arg); } catch { /* audio unavailable */ } } }

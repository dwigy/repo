// Chip art: placeholder sigils rendered inside glossy circular chips.
import { SERIES, COLORS, RARITY, PACK_TINTS } from './data.js';
import { getArt, artEnabled } from './artwork.js';

const O = 'stroke="#111" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
const K = '#151515';
let uid = 0;

// pie-cut eye (black oval with a wedge missing top-right)
const pie = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${K}"/><path d="M${x} ${y} L${x + rx * 1.1} ${y - ry * 0.55} L${x + rx * 0.35} ${y - ry * 1.1} Z" fill="#fff"/>`;
const eye = (x, y, r, pr = r * 0.45, dx = 0.3, dy = 0.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${O}/><circle cx="${x + r * dx}" cy="${y + r * dy}" r="${pr}" fill="${K}"/>`;

// Placeholder chip art: a deterministic sigil per character key (shape, tint,
// initial). Real artwork replaces this map; tokenSVG only needs a 100x100 fragment.
const PAL = [['#2f7ff5', '#0f3a7a'], ['#f5a623', '#8a4b00'], ['#3ec81e', '#1d5c0c'], ['#e8221c', '#6b0a08'], ['#c02fe0', '#4a0f5c'], ['#57d4ff', '#0b4f6b'], ['#f06aa8', '#7a1f4b'], ['#c4ced8', '#3d4b5c']];
const hash = (str) => { let h = 7; for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const poly = (n, r, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return `${(50 + r * Math.cos(a)).toFixed(1)},${(52 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const star = (n, r1, r2) => Array.from({ length: n * 2 }, (_, i) => { const r = i % 2 ? r2 : r1; const a = (-90 + i * 180 / n) * Math.PI / 180; return `${(50 + r * Math.cos(a)).toFixed(1)},${(52 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
export function sigil(key) {
  const h = hash(key); const [c1, c2] = PAL[h % PAL.length]; const shape = (h >> 3) % 6; const letter = String(key || '?')[0].toUpperCase();
  const body = shape === 0 ? `<circle cx="50" cy="52" r="34" fill="${c1}" ${O}/>`
    : shape === 1 ? `<polygon points="${poly(3, 38)}" fill="${c1}" ${O}/>`
    : shape === 2 ? `<rect x="18" y="20" width="64" height="64" rx="12" fill="${c1}" ${O}/>`
    : shape === 3 ? `<polygon points="${poly(6, 36)}" fill="${c1}" ${O}/>`
    : shape === 4 ? `<polygon points="${star(5, 38, 18)}" fill="${c1}" ${O}/>`
    : `<polygon points="${poly(4, 38)}" fill="${c1}" ${O}/>`;
  return `${body}<circle cx="50" cy="52" r="20" fill="${c2}" opacity=".85"/><text x="50" y="60" text-anchor="middle" font-size="24" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="#fff">${letter}</text><ellipse cx="40" cy="34" rx="16" ry="7" fill="#fff" opacity=".28" transform="rotate(-20 40 34)"/>`;
}
const CHARS = {
  one: () => `<polygon points="${poly(4, 40)}" fill="#ffd166" ${O}/><polygon points="${poly(4, 26)}" fill="#fff" opacity=".9"/><polygon points="${poly(4, 12)}" fill="#f5a623"/><text x="50" y="57" text-anchor="middle" font-size="12" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="#5a3a00">1/1</text>`,
  rookie: () => `<circle cx="50" cy="50" r="30" fill="#4f46e5" ${O}/><path d="M50 26 L56 42 L74 44 L60 55 L64 72 L50 63 L36 72 L40 55 L26 44 L44 42 Z" fill="#fff" ${O}/>`,
  comet: () => `<path d="M10 90 C30 70 40 60 62 42" stroke="#ffd166" stroke-width="10" stroke-linecap="round"/><path d="M14 96 C34 78 46 70 66 54" stroke="#ff8a1e" stroke-width="6" stroke-linecap="round"/><circle cx="68" cy="36" r="18" fill="#ffe66d" ${O}/><circle cx="62" cy="32" r="4" fill="#fff"/>`,
  crown: () => `<path d="M22 72 L18 30 L36 48 L50 22 L64 48 L82 30 L78 72 Z" fill="#f5c342" ${O}/><rect x="22" y="70" width="56" height="10" fill="#e0a010" ${O}/><circle cx="50" cy="56" r="5" fill="#d81b60"/><circle cx="32" cy="60" r="4" fill="#2f6fd0"/><circle cx="68" cy="60" r="4" fill="#2f6fd0"/>`,
  titan: () => `<circle cx="50" cy="50" r="30" fill="#c7d2fe" ${O}/><path d="M30 50 L44 50 L40 42 L56 50 L44 58 Z M70 50 L56 50 L60 58 L44 50 L56 42 Z" fill="#312e81"/>`,
  badge: () => `<path d="M50 12 L82 24 C82 60 68 80 50 90 C32 80 18 60 18 24 Z" fill="#e53935" ${O}/><path d="M50 22 L74 30 C74 58 64 72 50 80 Z" fill="#fff" opacity=".3"/><path d="M36 52 L46 62 L66 40" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  champ: () => `<path d="M50 8 L60 36 L90 38 L66 56 L74 86 L50 70 L26 86 L34 56 L10 38 L40 36 Z" fill="#fff" ${O}/><path d="M50 22 L56 40 L74 41 L60 52 L65 70 L50 60 L35 70 L40 52 L26 41 L44 40 Z" fill="#f5c342"/>`,
};

const HOLO = ['#ff5f6d', '#ffc371', '#f9f871', '#7bed9f', '#70a1ff', '#c56cf0'];
// Duotone ramps that turn the whole portrait into a metal (or dark matter).
const METAL = {
  silver:   { bg: ['#f7f9fb', '#c9d3dd', '#8d9aa8', '#e6ecf2'], r: '0.18 0.48 0.80 1', g: '0.20 0.51 0.83 1', b: '0.24 0.56 0.88 1', ring: ['#ffffff', '#b7c3cf', '#6f7f90'] },
  gold:     { bg: ['#fff4c2', '#f2c34a', '#b8780c', '#ffe08a'], r: '0.30 0.62 0.90 1', g: '0.16 0.42 0.72 0.96', b: '0.02 0.08 0.25 0.62', ring: ['#fff2b0', '#f0b429', '#8a5a00'] },
  platinum: { bg: ['#ffffff', '#dbe9f4', '#a9c4d8', '#f2f8fc'], r: '0.34 0.66 0.90 1', g: '0.40 0.72 0.94 1', b: '0.48 0.80 0.97 1', ring: ['#ffffff', '#d5e6f2', '#8fb0c8'] },
  dark:     { bg: ['#05060f'], r: '0.02 0.10 0.32 0.72', g: '0.02 0.07 0.26 0.66', b: '0.10 0.28 0.58 0.98', ring: ['#5b3fb0', '#1a1440', '#7c4dff'] },
};
const TIER_RING = { 0: ['#ffffff', '#c9d2dc', '#7f8a98'], 1: ['#c9ffd9', '#2fbf5a', '#166b33'], 2: ['#bfe0ff', '#1e8fff', '#0b4fa8'], 3: ['#e6d2ff', '#9b4dff', '#4d1a9e'], 4: ['#fff2b0', '#f5a623', '#8a5a00'], 5: ['#ffd3e6', '#f06aa8', '#8a2a5a'] };

function scene(t, id) {
  const [d, l] = SERIES[t.series]?.bg || ['#333', '#777'];
  const v = t.variant || 'classic';
  let deco = '';
  if (v === 'reel') {
    deco = `<rect x="0" y="0" width="100" height="100" fill="url(#sep${id})"/>
      <rect x="0" y="0" width="100" height="13" fill="#111"/><rect x="0" y="87" width="100" height="13" fill="#111"/>
      ${[6, 22, 38, 54, 70, 86].map(x => `<rect x="${x}" y="4" width="8" height="5" rx="1" fill="#e8e0c8"/><rect x="${x}" y="91" width="8" height="5" rx="1" fill="#e8e0c8"/>`).join('')}`;
  } else if (v === 'stage') {
    deco = `<rect x="0" y="0" width="100" height="100" fill="#0b1638"/><path d="M50 -10 L4 96 L96 96 Z" fill="#fff" opacity=".28"/><ellipse cx="50" cy="92" rx="44" ry="10" fill="#fff" opacity=".3"/>`;
  } else if (v === 'holo') {
    deco = HOLO.map((c, i) => `<path d="M50 50 L${(50 + 70 * Math.cos(i * Math.PI / 3)).toFixed(1)} ${(50 + 70 * Math.sin(i * Math.PI / 3)).toFixed(1)} L${(50 + 70 * Math.cos((i + 1) * Math.PI / 3)).toFixed(1)} ${(50 + 70 * Math.sin((i + 1) * Math.PI / 3)).toFixed(1)} Z" fill="${c}"/>`).join('') +
      `<circle cx="50" cy="50" r="46" fill="url(#hl${id})"/>`;
  } else if (v === 'silver' || v === 'gold' || v === 'platinum') {
    deco = `<rect x="0" y="0" width="100" height="100" fill="url(#met${id})"/><rect x="0" y="0" width="100" height="100" fill="url(#sheen${id})"/>
      <path d="M-10 70 L110 20" stroke="#fff" stroke-width="6" opacity=".35"/><path d="M-10 84 L110 34" stroke="#fff" stroke-width="2" opacity=".3"/>`;
  } else if (v === 'dark') {
    const stars = [[14, 22, 1.2], [30, 12, .8], [78, 18, 1.4], [88, 44, .9], [70, 80, 1.1], [22, 76, .8], [50, 8, .7], [92, 70, .7], [8, 50, 1], [60, 92, .9]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".9"/>`).join('');
    deco = `<rect x="0" y="0" width="100" height="100" fill="url(#neb${id})"/>${stars}<path d="M20 30 L22 32 M80 60 L82 62" stroke="#fff" stroke-width="1" opacity=".6"/>`;
  } else {
    deco = `<rect x="0" y="0" width="100" height="100" fill="url(#bg${id})"/><rect x="0" y="0" width="100" height="100" fill="url(#dots${id})"/>`;
  }
  // Only the defs this variant actually uses (the binder renders 126 chips at once).
  const defs = [
    `<clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath>`,
    `<linearGradient id="gl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
  ];
  if (v === 'reel') defs.push(`<radialGradient id="sep${id}" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#f1e2c0"/><stop offset="1" stop-color="#8a6b3f"/></radialGradient>`);
  else if (v === 'stage') defs.push(`<radialGradient id="vig${id}" cx="50%" cy="40%" r="60%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>`);
  else if (v === 'holo') defs.push(`<radialGradient id="hl${id}" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`);
  else if (v === 'dark') defs.push(`<radialGradient id="neb${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#3b1d7a"/><stop offset=".45" stop-color="#151238"/><stop offset="1" stop-color="#05060f"/></radialGradient>`);
  else if (METAL[v]) defs.push(`<linearGradient id="met${id}" x1="0" y1="0" x2="1" y2="1">${METAL[v].bg.map((c, i, a) => `<stop offset="${a.length > 1 ? i / (a.length - 1) : 0}" stop-color="${c}"/>`).join('')}</linearGradient>`,
    `<linearGradient id="sheen${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
  else defs.push(`<radialGradient id="bg${id}" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="${l}"/><stop offset="1" stop-color="${d}"/></radialGradient>`,
    `<pattern id="dots${id}" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#fff" opacity=".18"/></pattern>`);
  if (METAL[v]) defs.push(`<filter id="tone${id}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="${METAL[v].r}"/><feFuncG type="table" tableValues="${METAL[v].g}"/><feFuncB type="table" tableValues="${METAL[v].b}"/></feComponentTransfer></filter>`);
  return `<defs>${defs.join('')}</defs>
    <g clip-path="url(#clip${id})">${deco}</g>`;
}

const sparkles = `<g fill="#fff"><path d="M18 24 L20 30 L26 32 L20 34 L18 40 L16 34 L10 32 L16 30 Z"/><path d="M82 64 L83.5 68 L88 69.5 L83.5 71 L82 75 L80.5 71 L76 69.5 L80.5 68 Z"/><path d="M78 18 L79 21 L82 22 L79 23 L78 26 L77 23 L74 22 L77 21 Z"/></g>`;

function pose(t) {
  switch (t.pose) {
    case 'mirror': return 'translate(100 0) scale(-1 1)';
    case 'zoom':   return 'translate(50 54) scale(1.14) rotate(-5) translate(-50 -54)';
    case 'hero':   return 'translate(50 52) scale(1.06) translate(-50 -52)';
    default:       return '';
  }
}

// Real artwork (custom or Wikimedia Commons) with per-edition treatment.
function photo(t, id) {
  const a = (t.char && artEnabled()) ? getArt(t.char) : null;
  if (!a || !a.src) return '';
  const filt = t.variant === 'reel' ? `filter="url(#sepia${id})"` : t.variant === 'holo' ? `filter="url(#vivid${id})"` : '';
  const tf = t.pose === 'mirror' ? 'translate(100 0) scale(-1 1)' : t.pose === 'zoom' ? 'translate(50 50) scale(1.15) rotate(-4) translate(-50 -50)' : '';
  const over = t.variant === 'stage' ? `<circle cx="50" cy="50" r="46" fill="url(#vig${id})"/>`
    : t.variant === 'dark' ? `<circle cx="50" cy="50" r="46" fill="#05060f" opacity=".35"/>${[[14, 22, 1.2], [78, 18, 1.4], [88, 44, .9], [70, 80, 1.1], [22, 76, .8], [50, 8, .7], [8, 50, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".9"/>`).join('')}`
    : t.variant === 'holo' ? HOLO.map((c, i) => `<path d="M50 50 L${(50 + 70 * Math.cos(i * Math.PI / 3)).toFixed(1)} ${(50 + 70 * Math.sin(i * Math.PI / 3)).toFixed(1)} L${(50 + 70 * Math.cos((i + 1) * Math.PI / 3)).toFixed(1)} ${(50 + 70 * Math.sin((i + 1) * Math.PI / 3)).toFixed(1)} Z" fill="${c}" opacity=".28"/>`).join('')
    : '';
  return `<defs><filter id="sepia${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".393 .769 .189 0 0 .349 .686 .168 0 0 .272 .534 .131 0 0 0 0 0 1 0"/></filter><filter id="vivid${id}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="1.6"/></filter></defs>
    <g transform="${tf}"><image href="${a.src}" x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid slice" ${filt}/></g>${over}`;
}

// The glossy chip: scene + portrait + bevel ring + colour ring + point bubble.
export function tokenSVG(t, size = 100, opts = {}) {
  const id = 'k' + (uid++);
  const col = COLORS[t.color] || COLORS.slv;
  const draw = CHARS[t.char] || (() => sigil(t.char));
  const ring = opts.ring !== false;
  const bubble = opts.bubble !== false;
  const label = opts.label != null ? opts.label : t.pts;
  const ringCols = (METAL[t.variant] && METAL[t.variant].ring) || TIER_RING[t.rarity] || TIER_RING[0];
  const outer = `<defs><linearGradient id="rr${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ringCols[0]}"/><stop offset=".5" stop-color="${ringCols[1]}"/><stop offset="1" stop-color="${ringCols[2]}"/></linearGradient></defs>
    <circle cx="50" cy="50" r="47" fill="none" stroke="url(#rr${id})" stroke-width="4"/>${t.rarity >= 4 ? `<circle cx="50" cy="50" r="47" fill="none" stroke="#fff" stroke-width="1.2" opacity=".85" stroke-dasharray="3 5"/>` : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${t.name}">
    ${scene(t, id)}
    <g clip-path="url(#clip${id})"><g ${METAL[t.variant] ? `filter="url(#tone${id})"` : ''}><g transform="translate(50 50) scale(.8) translate(-50 -50) ${pose(t)}">${draw()}</g>${photo(t, id)}</g>${t.rarity >= 3 || t.variant === 'holo' ? sparkles : ''}</g>
    <g clip-path="url(#clip${id})"><ellipse cx="36" cy="26" rx="28" ry="15" fill="url(#gl${id})" transform="rotate(-18 36 26)"/><path d="M18 74 Q50 96 82 74" fill="none" stroke="#fff" stroke-width="5" opacity=".22"/></g>
    ${outer}${t.series === 'one' ? SPROCKETS : ''}
    ${ring ? `<circle cx="50" cy="50" r="43.5" fill="none" stroke="${col.hex}" stroke-width="3.2"/>` : ''}
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
    ${bubble ? `<circle cx="76" cy="76" r="13" fill="${col.hex}" stroke="#fff" stroke-width="2.5"/><ellipse cx="72" cy="70" rx="7" ry="4" fill="#fff" opacity=".45"/><text x="76" y="81" text-anchor="middle" font-size="15" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="${t.color === 'yel' || t.color === 'slv' ? '#1c2f4a' : '#fff'}">${label}</text>` : ''}
  </svg>`;
}

// Film sprockets around a 1/1 chip chip.
const SPROCKETS = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; const x = 50 + 47 * Math.cos(a), y = 50 + 47 * Math.sin(a);
  return `<rect x="${(x - 2.4).toFixed(1)}" y="${(y - 1.5).toFixed(1)}" width="4.8" height="3" rx=".8" fill="#fff" stroke="#3d5a80" stroke-width=".7" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('');

// Region badge: a numbered frame on a coloured disc.
export function zoneBadgeSVG(z, size = 56, lit = true) {
  const id = 'z' + (uid++);
  const hue = lit ? z.hue : '#8a97a8';
  const holes = [34, 43, 52, 61].map(y => `<rect x="30" y="${y}" width="4" height="5" rx="1" fill="#fff" opacity=".8"/><rect x="66" y="${y}" width="4" height="5" rx="1" fill="#fff" opacity=".8"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${z.name || 'zone'}">
    <defs><radialGradient id="zb${id}" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".22" stop-color="${hue}"/><stop offset="1" stop-color="#0d1a30"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#zb${id})" stroke="#fff" stroke-width="3"/>
    <rect x="27" y="30" width="46" height="40" rx="3" fill="#0d1a30" opacity=".78" stroke="#fff" stroke-width="1.6"/>${holes}
    <text x="50" y="59" text-anchor="middle" font-size="24" font-style="italic" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="#fff">${z.n}</text>
    <ellipse cx="40" cy="26" rx="22" ry="10" fill="#fff" opacity="${lit ? '.35' : '.15'}" transform="rotate(-18 40 26)"/>
    ${lit ? '' : '<circle cx="50" cy="50" r="46" fill="#1c2f4a" opacity=".45"/>'}
  </svg>`;
}

// Just the portrait on a transparent background.
export function characterSVG(t, size = 100) {
  const draw = CHARS[t.char] || (() => sigil(t.char));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${t.name}">${draw()}</svg>`;
}

// Empty board socket: glossy silver sunburst.
export function socketSVG(size = 100) {
  const id = 'k' + (uid++);
  const rays = [];
  for (let i = 0; i < 24; i++) rays.push(`<path d="M50 50 L${(50 + 46 * Math.cos(i * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin(i * Math.PI / 12)).toFixed(2)} L${(50 + 46 * Math.cos((i + .5) * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin((i + .5) * Math.PI / 12)).toFixed(2)} Z" fill="#fff" opacity=".35"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs><linearGradient id="gl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c9d7e5"/><stop offset="1" stop-color="#5b7fa6"/></linearGradient>
    <clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs>
    <circle cx="50" cy="50" r="47" fill="#8ea9c4"/>
    <g clip-path="url(#clip${id})">${rays.join('')}<ellipse cx="36" cy="26" rx="28" ry="15" fill="url(#gl${id})" transform="rotate(-18 36 26)"/></g>
    <circle cx="50" cy="50" r="47" fill="none" stroke="url(#bv${id})" stroke-width="4"/>
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
    <text x="50" y="55" text-anchor="middle" font-size="15" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" fill="#dbe7f2" opacity=".85"></text>
  </svg>`;
}

// Silhouette for chips the player has not collected yet.
export function shadowTokenSVG(t, size = 100) {
  const id = 'k' + (uid++);
  const draw = CHARS[t.char] || (() => sigil(t.char));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs><clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs>
    <circle cx="50" cy="50" r="46" fill="#8ea3ba"/>
    <g clip-path="url(#clip${id})" opacity=".22"><g transform="translate(50 50) scale(.8) translate(-50 -50)">${draw()}</g></g>
    <circle cx="50" cy="50" r="46" fill="#6f87a3" opacity=".45"/>
    <text x="50" y="62" text-anchor="middle" font-size="34" font-weight="800" fill="#dbe7f2" font-family="'Barlow Condensed', sans-serif">?</text>
    <circle cx="50" cy="50" r="47" fill="none" stroke="#c9d7e5" stroke-width="4"/>
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
  </svg>`;
}

// portfolio badge: spiky starburst frame around a chip.
export function badgeSVG(t, size = 100) {
  const pts = [];
  for (let i = 0; i < 32; i++) { const r = i % 2 ? 50 : 44; const ang = i * Math.PI / 16; pts.push(`${(50 + r * Math.cos(ang)).toFixed(2)},${(50 + r * Math.sin(ang)).toFixed(2)}`); }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <polygon points="${pts.join(' ')}" fill="${RARITY[t.rarity]?.color || '#2f6fd0'}" stroke="#1c3f7a" stroke-width="1.5"/>
    <g transform="translate(50 50) scale(.84) translate(-50 -50)">${tokenSVG(t, 100, { bubble: false, ring: false })}</g>
  </svg>`;
}

// Face-down chip used in the pack reveal.
export function chipBackSVG(size = 100, tint = '#1a3d78') {
  const id = 'k' + (uid++);
  const rays = [];
  for (let i = 0; i < 24; i++) rays.push(`<path d="M50 50 L${(50 + 46 * Math.cos(i * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin(i * Math.PI / 12)).toFixed(2)} L${(50 + 46 * Math.cos((i + .5) * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin((i + .5) * Math.PI / 12)).toFixed(2)} Z" fill="#fff" opacity=".12"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs><radialGradient id="bk${id}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#4d7cc8"/><stop offset=".6" stop-color="${tint}"/><stop offset="1" stop-color="#0d1f45"/></radialGradient>
    <linearGradient id="gl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c9d7e5"/><stop offset="1" stop-color="#5b7fa6"/></linearGradient>
    <clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs>
    <circle cx="50" cy="50" r="46" fill="url(#bk${id})"/>
    <g clip-path="url(#clip${id})">${rays.join('')}<circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/><circle cx="50" cy="50" r="22" fill="none" stroke="#fff" stroke-width="1" opacity=".25"/>
      <ellipse cx="36" cy="26" rx="28" ry="15" fill="url(#gl${id})" transform="rotate(-18 36 26)"/></g>
    <text x="50" y="55" text-anchor="middle" font-size="14" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" fill="#fff" opacity=".9"></text>
    <circle cx="50" cy="50" r="47" fill="none" stroke="url(#bv${id})" stroke-width="4"/>
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
  </svg>`;
}

// Foil booster pack. `tear` (0..1) slides the crimped top strip off.
export function packSVG(pack, opts = {}) {
  const id = 'k' + (uid++);
  const w = 220, h = 300;
  const tint = PACK_TINTS[pack.id] || PACK_TINTS.std;
  const crimp = Array.from({ length: 22 }, (_, i) => `${i * 10},${i % 2 ? 0 : 6}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${opts.size || w}" height="${Math.round((opts.size || w) * h / w)}" class="packsvg">
    <defs>
      <linearGradient id="foil${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".18" stop-color="${tint[0]}"/><stop offset=".5" stop-color="${tint[1]}"/><stop offset=".8" stop-color="${tint[0]}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
      <linearGradient id="holo${id}" x1="0" y1="0" x2="1" y2="0">${HOLO.map((c, i) => `<stop offset="${i / (HOLO.length - 1)}" stop-color="${c}" stop-opacity=".35"/>`).join('')}</linearGradient>
      <linearGradient id="shine${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <g class="pack-body">
      <rect x="6" y="30" width="${w - 12}" height="${h - 36}" rx="10" fill="url(#foil${id})" stroke="#1c3f7a" stroke-width="2"/>
      <rect x="6" y="30" width="${w - 12}" height="${h - 36}" rx="10" fill="url(#holo${id})"/>
      <rect x="6" y="30" width="${w - 12}" height="${h - 36}" rx="10" fill="url(#shine${id})"/>
      <polygon points="${crimp}" transform="translate(6 ${h - 12})" fill="#fff" opacity=".7"/>
      <circle cx="${w / 2}" cy="150" r="58" fill="#fff" opacity=".18"/>
      <g transform="translate(${w / 2 - 48} 102)">${chipBackSVG(96, tint[1])}</g>
      <text x="${w / 2}" y="238" text-anchor="middle" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" font-size="15" fill="#fff" letter-spacing="2">PACK</text>
      <text x="${w / 2}" y="262" text-anchor="middle" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" font-style="italic" font-weight="800" font-size="16" fill="#fff" opacity=".9">${(pack.name || '').toUpperCase().replace(' CPACK', '')} · ${pack.size} CHIPS</text>
      <line x1="10" y1="40" x2="${w - 10}" y2="40" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 4" opacity=".8"/>
    </g>
    <g class="pack-top">
      <rect x="6" y="6" width="${w - 12}" height="34" rx="6" fill="url(#foil${id})" stroke="#1c3f7a" stroke-width="2"/>
      <polygon points="${crimp}" transform="translate(6 6)" fill="#fff" opacity=".7"/>
      <text x="${w / 2}" y="29" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-style="italic" font-weight="800" font-size="12" fill="#fff" letter-spacing="3">RIP HERE ›››</text>
    </g>
  </svg>`;
}

export const ctoonSVG = (t, size) => tokenSVG(t, size, { bubble: false });
export const ctoonShadowSVG = shadowTokenSVG;
export const RARITY_NAMES = RARITY.map(r => r.name);

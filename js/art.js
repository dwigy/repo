// Vector portraits of public-domain cartoon stars (original works 1905–1930),
// drawn in the rubber-hose style, rendered inside glossy circular gToon chips.
import { SERIES, COLORS, RARITY } from './data.js';
import { getArt, artEnabled } from './artwork.js';

const O = 'stroke="#111" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
const K = '#151515';
let uid = 0;

// pie-cut eye (black oval with a wedge missing top-right)
const pie = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${K}"/><path d="M${x} ${y} L${x + rx * 1.1} ${y - ry * 0.55} L${x + rx * 0.35} ${y - ry * 1.1} Z" fill="#fff"/>`;
const eye = (x, y, r, pr = r * 0.45, dx = 0.3, dy = 0.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${O}/><circle cx="${x + r * dx}" cy="${y + r * dy}" r="${pr}" fill="${K}"/>`;

const CHARS = {
  felix: () => `
    <path d="M20 100 C24 82 76 82 80 100 Z" fill="${K}"/>
    <path d="M22 42 L26 8 L46 30 Z" fill="${K}" ${O}/><path d="M78 42 L74 8 L54 30 Z" fill="${K}" ${O}/>
    <ellipse cx="50" cy="54" rx="34" ry="30" fill="${K}" ${O}/>
    <ellipse cx="39" cy="46" rx="11" ry="13" fill="#fff" ${O}/><ellipse cx="61" cy="46" rx="11" ry="13" fill="#fff" ${O}/>
    <ellipse cx="41" cy="48" rx="4" ry="6" fill="${K}"/><ellipse cx="59" cy="48" rx="4" ry="6" fill="${K}"/>
    <path d="M27 60 C34 84 66 84 73 60 C66 68 34 68 27 60 Z" fill="#fff" ${O}/>
    <path d="M30 63 C40 74 60 74 70 63" fill="none" ${O}/>
    <ellipse cx="50" cy="60" rx="5" ry="3.5" fill="${K}"/>
    <path d="M14 56 L26 58 M14 64 L26 62 M86 56 L74 58 M86 64 L74 62" ${O}/>`,
  gertie: () => `
    <path d="M8 100 C14 72 34 64 48 40" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M8 100 C14 72 34 64 48 40" stroke="#8fb574" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path d="M14 96 C18 80 30 70 44 52" stroke="#a9cc8d" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="58" cy="36" rx="24" ry="15" fill="#8fb574" ${O}/>
    <path d="M60 22 C74 18 82 26 82 32" fill="none" ${O}/>
    ${eye(64, 32, 5.5, 2.4, 0.3, 0.2)}
    <circle cx="77" cy="39" r="1.8" fill="${K}"/>
    <path d="M44 42 C54 50 70 50 80 44" fill="none" ${O}/>
    <path d="M54 46 L56 50 M62 47 L63 51" ${O} stroke-width="1.8"/>`,
  alfalfa: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#6b4a2b"/>
    <circle cx="50" cy="52" r="24" fill="#f2c9a0" ${O}/>
    <path d="M26 58 C20 66 22 80 30 86 C34 96 46 98 50 92 C54 98 66 96 70 86 C78 80 80 66 74 58 C66 70 34 70 26 58 Z" fill="#fff" ${O}/>
    <path d="M38 62 C42 58 58 58 62 62 C58 66 42 66 38 62 Z" fill="#fff" ${O}/>
    <circle cx="50" cy="56" r="6" fill="#e8a889" ${O}/>
    <circle cx="41" cy="46" r="2.6" fill="${K}"/><circle cx="59" cy="46" r="2.6" fill="${K}"/>
    <path d="M35 40 L46 42 M65 40 L54 42" ${O} stroke-width="3"/>
    <ellipse cx="50" cy="30" rx="36" ry="6" fill="#e5c76b" ${O}/>
    <path d="M34 30 C34 12 66 12 66 30 Z" fill="#e5c76b" ${O}/>
    <path d="M36 25 L64 25" stroke="#8a6d1f" stroke-width="3"/>`,
  koko: () => `
    <path d="M14 100 C18 82 82 82 86 100 Z" fill="${K}"/>
    <circle cx="42" cy="90" r="2.2" fill="#fff"/><circle cx="50" cy="92" r="2.2" fill="#fff"/><circle cx="58" cy="90" r="2.2" fill="#fff"/>
    <path d="M22 80 C28 70 36 82 42 72 C48 82 52 82 58 72 C64 82 72 70 78 80 C72 88 62 84 58 86 C52 90 48 90 42 86 C38 84 28 88 22 80 Z" fill="#fff" ${O}/>
    <path d="M50 6 L32 44 L68 44 Z" fill="${K}" ${O}/><circle cx="50" cy="8" r="4.5" fill="#fff" ${O}/>
    <circle cx="50" cy="54" r="22" fill="#fff" ${O}/>
    <path d="M36 46 C38 40 46 40 48 46 M52 46 C54 40 62 40 64 46" fill="none" ${O}/>
    <ellipse cx="42" cy="49" rx="3.2" ry="4" fill="${K}"/><ellipse cx="58" cy="49" rx="3.2" ry="4" fill="${K}"/>
    <path d="M36 60 C42 74 58 74 64 60 Z" fill="${K}" ${O}/><path d="M40 62 L60 62" stroke="#fff" stroke-width="2"/>
    <path d="M48 54 L52 54" ${O}/>`,
  bimbo: () => `
    <path d="M22 100 C26 84 74 84 78 100 Z" fill="${K}"/>
    <path d="M28 40 C8 42 8 74 28 70 Z" fill="${K}" ${O}/><path d="M72 40 C92 42 92 74 72 70 Z" fill="${K}" ${O}/>
    <circle cx="50" cy="52" r="26" fill="${K}" ${O}/>
    <ellipse cx="50" cy="58" rx="18" ry="20" fill="#fff" ${O}/>
    <circle cx="43" cy="50" r="3.4" fill="${K}"/><circle cx="57" cy="50" r="3.4" fill="${K}"/>
    <ellipse cx="50" cy="63" rx="5.5" ry="4" fill="${K}"/>
    <path d="M40 70 C46 76 54 76 60 70" fill="none" ${O}/>
    <path d="M34 28 C36 16 64 16 66 28 Z" fill="#fff" ${O}/><path d="M32 28 L68 28" ${O} stroke-width="3"/>`,
  betty: () => `
    <path d="M16 100 C20 86 80 86 84 100 Z" fill="#d81b60"/>
    <ellipse cx="25" cy="64" rx="5" ry="14" fill="${K}" transform="rotate(8 25 64)" ${O}/><ellipse cx="75" cy="64" rx="5" ry="14" fill="${K}" transform="rotate(-8 75 64)" ${O}/>
    <circle cx="50" cy="42" r="30" fill="${K}"/>
    <ellipse cx="50" cy="56" rx="20" ry="22" fill="#f8d7c4" ${O}/>
    <path d="M30 38 C30 24 70 24 70 38 C64 30 36 30 30 38 Z" fill="${K}"/>
    <circle cx="26" cy="52" r="5" fill="${K}"/><circle cx="30" cy="64" r="4" fill="${K}"/><circle cx="74" cy="52" r="5" fill="${K}"/><circle cx="70" cy="64" r="4" fill="${K}"/><circle cx="50" cy="34" r="4.5" fill="${K}"/>
    <ellipse cx="43" cy="53" rx="6" ry="8" fill="#fff" ${O}/><ellipse cx="57" cy="53" rx="6" ry="8" fill="#fff" ${O}/>
    <ellipse cx="44" cy="55" rx="3.6" ry="5" fill="${K}"/><ellipse cx="58" cy="55" rx="3.6" ry="5" fill="${K}"/>
    <path d="M38 44 L36 41 M41 43 L40 40 M62 44 L64 41 M59 43 L60 40" ${O} stroke-width="1.8"/>
    <path d="M47 68 C48 65 52 65 53 68 C53 72 50 73 50 73 C50 73 47 72 47 68 Z" fill="#d81b60" ${O} stroke-width="1.6"/>
    <circle cx="28" cy="76" r="3.5" fill="none" stroke="#f5c342" stroke-width="2"/><circle cx="72" cy="76" r="3.5" fill="none" stroke="#f5c342" stroke-width="2"/>`,
  popeye: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#1d1d1d"/><path d="M40 86 L50 96 L60 86 Z" fill="#c62828"/>
    <path d="M28 56 C28 30 72 30 72 56 C72 70 66 84 50 84 C34 84 28 70 28 56 Z" fill="#f2c9a0" ${O}/>
    <path d="M36 70 C40 80 60 80 64 70" fill="none" ${O} stroke-width="1.8"/>
    ${eye(42, 50, 5.5, 2.5, 0.2, 0.2)}
    <path d="M54 50 L66 50" ${O} stroke-width="3"/><path d="M54 45 L66 46" ${O} stroke-width="2"/>
    <circle cx="47" cy="59" r="6" fill="#e8a889" ${O}/>
    <path d="M52 68 L74 78" stroke="#6d4c2f" stroke-width="4" stroke-linecap="round"/><circle cx="77" cy="80" r="5.5" fill="#8d6e4a" ${O}/>
    <circle cx="84" cy="66" r="3" fill="#fff" opacity=".8"/><circle cx="88" cy="58" r="4" fill="#fff" opacity=".6"/>
    <path d="M26 32 C30 18 70 18 74 32 Z" fill="#fff" ${O}/><path d="M22 32 L78 32 L76 38 L24 38 Z" fill="${K}" ${O}/>`,
  olive: () => `
    <path d="M22 100 C26 86 74 86 78 100 Z" fill="#c62828"/>
    <rect x="45" y="72" width="10" height="16" fill="#f2c9a0" ${O}/>
    <path d="M34 40 C34 14 66 14 66 40 Z" fill="${K}"/><circle cx="50" cy="16" r="8" fill="${K}" ${O}/>
    <ellipse cx="50" cy="52" rx="15" ry="24" fill="#f2c9a0" ${O}/>
    <path d="M36 36 C40 30 60 30 64 36 C58 34 42 34 36 36 Z" fill="${K}"/>
    ${eye(44, 48, 4, 2, 0.2, 0.2)}${eye(56, 48, 4, 2, 0.2, 0.2)}
    <path d="M50 50 L58 60 L51 61" fill="none" ${O}/>
    <path d="M45 68 Q50 72 55 68" fill="none" stroke="#c62828" stroke-width="2.4"/>
    <circle cx="34" cy="60" r="2.5" fill="#f5c342"/><circle cx="66" cy="60" r="2.5" fill="#f5c342"/>`,
  oswald: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/><rect x="34" y="88" width="32" height="12" fill="#2f6fd0"/>
    <ellipse cx="38" cy="20" rx="7" ry="22" fill="${K}" transform="rotate(-8 38 20)" ${O}/><ellipse cx="62" cy="20" rx="7" ry="22" fill="${K}" transform="rotate(8 62 20)" ${O}/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    <ellipse cx="50" cy="60" rx="19" ry="18" fill="#fff" ${O}/>
    ${pie(43, 52, 4, 6)}${pie(57, 52, 4, 6)}
    <ellipse cx="50" cy="63" rx="5" ry="3.5" fill="${K}"/>
    <path d="M42 70 C46 75 54 75 58 70" fill="none" ${O}/>`,
  willie: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <circle cx="28" cy="28" r="13" fill="${K}" ${O}/><circle cx="72" cy="28" r="13" fill="${K}" ${O}/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    <ellipse cx="50" cy="60" rx="20" ry="17" fill="#fff" ${O}/>
    ${pie(44, 50, 3.6, 8)}${pie(56, 50, 3.6, 8)}
    <ellipse cx="50" cy="65" rx="6.5" ry="4" fill="${K}"/>
    <path d="M38 70 C44 80 56 80 62 70" fill="none" ${O}/>
    <path d="M34 36 C36 24 64 24 66 36 Z" fill="#fff" ${O}/><path d="M30 36 L70 36 L66 42 L34 42 Z" fill="${K}" ${O}/>`,
  bosko: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M40 86 L50 92 L60 86 L60 96 L50 90 L40 96 Z" fill="#fff" ${O} stroke-width="1.8"/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    ${eye(43, 50, 6.5, 3, 0.15, 0.25)}${eye(57, 50, 6.5, 3, 0.15, 0.25)}
    <path d="M34 62 C40 82 60 82 66 62 Z" fill="#fff" ${O}/><path d="M38 66 L62 66" ${O} stroke-width="1.8"/>
    <ellipse cx="50" cy="30" rx="25" ry="5" fill="${K}" ${O}/><path d="M34 30 C34 12 66 12 66 30 Z" fill="${K}" ${O}/>`,
  flip: () => `
    <path d="M16 100 C20 86 80 86 84 100 Z" fill="${K}"/>
    <path d="M40 84 L50 88 L60 84 L60 94 L50 90 L40 94 Z" fill="#c62828" ${O} stroke-width="1.8"/>
    <ellipse cx="50" cy="58" rx="31" ry="23" fill="#5fbf5a" ${O}/>
    <path d="M26 62 C36 78 64 78 74 62" fill="none" ${O}/>
    ${eye(38, 38, 10, 4.5, 0.2, 0.3)}${eye(62, 38, 10, 4.5, -0.2, 0.3)}
    <circle cx="44" cy="54" r="1.6" fill="${K}"/><circle cx="56" cy="54" r="1.6" fill="${K}"/>`,
  krazy: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M30 82 L50 88 L70 82 L64 96 L50 92 L36 96 Z" fill="#c62828" ${O} stroke-width="1.8"/><circle cx="50" cy="88" r="4" fill="#c62828" ${O} stroke-width="1.8"/>
    <path d="M26 44 L24 16 L46 30 Z" fill="${K}" ${O}/><path d="M74 44 L76 16 L54 30 Z" fill="${K}" ${O}/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    <ellipse cx="50" cy="60" rx="18" ry="17" fill="#fff" ${O}/>
    <ellipse cx="43" cy="52" rx="3.6" ry="5" fill="${K}"/><ellipse cx="57" cy="52" rx="3.6" ry="5" fill="${K}"/>
    <circle cx="50" cy="61" r="3.2" fill="${K}"/>
    <path d="M42 68 C46 74 54 74 58 68" fill="none" ${O}/>`,
  ignatz: () => `
    <path d="M22 100 C26 86 74 86 78 100 Z" fill="#cfd6dc"/>
    <circle cx="27" cy="30" r="13" fill="#cfd6dc" ${O}/><circle cx="27" cy="30" r="7" fill="#e9b8c4"/>
    <circle cx="73" cy="30" r="13" fill="#cfd6dc" ${O}/><circle cx="73" cy="30" r="7" fill="#e9b8c4"/>
    <circle cx="50" cy="56" r="23" fill="#e6ebef" ${O}/>
    <circle cx="43" cy="52" r="3" fill="${K}"/><circle cx="57" cy="52" r="3" fill="${K}"/>
    <circle cx="50" cy="64" r="3.6" fill="${K}"/>
    <path d="M28 62 L42 64 M28 68 L42 66 M72 62 L58 64 M72 68 L58 66" ${O} stroke-width="1.6"/>
    <path d="M42 70 C46 74 54 74 58 70" fill="none" ${O}/>
    <g transform="rotate(-14 70 80)"><rect x="58" y="74" width="24" height="13" fill="#c0392b" ${O} stroke-width="2"/><path d="M58 80 L82 80 M70 74 L70 80 M64 80 L64 87 M76 80 L76 87" stroke="#fff" stroke-width="1.5"/></g>`,
  nemo: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#3b82f6"/><path d="M30 92 L70 92 M26 98 L74 98" stroke="#fff" stroke-width="3"/>
    <path d="M38 84 L50 92 L62 84" fill="none" stroke="#fff" stroke-width="4"/>
    <circle cx="50" cy="56" r="23" fill="#f8d7c4" ${O}/>
    <path d="M28 52 C28 30 72 30 72 52 C66 40 34 40 28 52 Z" fill="#7a4a1e" ${O}/>
    <path d="M26 42 C30 20 60 12 80 24 C70 22 62 26 62 36 L30 40 Z" fill="#c62828" ${O}/><circle cx="82" cy="24" r="5" fill="#fff" ${O}/>
    ${eye(43, 54, 5, 2.4, 0.2, 0.2)}${eye(57, 54, 5, 2.4, 0.2, 0.2)}
    <path d="M44 66 C47 70 53 70 56 66" fill="none" ${O}/>
    <circle cx="36" cy="62" r="3" fill="#f4a3a3" opacity=".7"/><circle cx="64" cy="62" r="3" fill="#f4a3a3" opacity=".7"/>`,
  // ---- prize emblems ----
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
  const draw = CHARS[t.char] || CHARS.rookie;
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
    ${outer}
    ${ring ? `<circle cx="50" cy="50" r="43.5" fill="none" stroke="${col.hex}" stroke-width="3.2"/>` : ''}
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
    ${bubble ? `<circle cx="76" cy="76" r="13" fill="${col.hex}" stroke="#fff" stroke-width="2.5"/><ellipse cx="72" cy="70" rx="7" ry="4" fill="#fff" opacity=".45"/><text x="76" y="81" text-anchor="middle" font-size="15" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="${t.color === 'yel' || t.color === 'slv' ? '#1c2f4a' : '#fff'}">${label}</text>` : ''}
  </svg>`;
}

// Just the portrait on a transparent background.
export function characterSVG(t, size = 100) {
  const draw = CHARS[t.char] || CHARS.rookie;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${t.name}">${draw()}</svg>`;
}

// Empty board socket: glossy silver sunburst with "ORBIT".
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
    <text x="50" y="55" text-anchor="middle" font-size="15" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" fill="#dbe7f2" opacity=".85">ORBIT</text>
  </svg>`;
}

// Silhouette for cToons the player has not collected yet.
export function shadowTokenSVG(t, size = 100) {
  const id = 'k' + (uid++);
  const draw = CHARS[t.char] || CHARS.rookie;
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

// cZone badge: spiky starburst frame around a chip.
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
    <text x="50" y="55" text-anchor="middle" font-size="14" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" fill="#fff" opacity=".9">ORBIT</text>
    <circle cx="50" cy="50" r="47" fill="none" stroke="url(#bv${id})" stroke-width="4"/>
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
  </svg>`;
}

// Foil booster pack. `tear` (0..1) slides the crimped top strip off.
export function packSVG(pack, opts = {}) {
  const id = 'k' + (uid++);
  const w = 220, h = 300;
  const tint = { std: ['#5b8def', '#1a3d78'], prem: ['#b06cff', '#4d1a9e'], mega: ['#ffd76a', '#b8780c'] }[pack.id] || ['#5b8def', '#1a3d78'];
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
      <text x="${w / 2}" y="238" text-anchor="middle" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" font-size="15" fill="#fff" letter-spacing="2">cPACK</text>
      <text x="${w / 2}" y="262" text-anchor="middle" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" font-style="italic" font-weight="800" font-size="16" fill="#fff" opacity=".9">${(pack.name || '').toUpperCase().replace(' CPACK', '')} · ${pack.size} cTOONS</text>
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

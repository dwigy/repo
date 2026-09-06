// Vector portraits of public-domain cartoon stars (original works 1905–1930),
// drawn in the rubber-hose style, rendered inside glossy circular gToon chips.
import { SERIES, COLORS, RARITY, PACK_TINTS } from './data.js';
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
  bobby: () => `
    <ellipse cx="80" cy="72" rx="11" ry="10" fill="#fff" ${O}/><ellipse cx="70" cy="74" rx="4.5" ry="9" fill="${K}" transform="rotate(14 70 74)" ${O}/>
    <ellipse cx="88" cy="76" rx="7" ry="5" fill="#fff" ${O}/><circle cx="92" cy="75" r="2.6" fill="${K}"/><circle cx="82" cy="69" r="2" fill="${K}"/>
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#3b5aa6"/>
    <path d="M38 84 L50 92 L62 84 L64 92 L50 98 L36 92 Z" fill="#fff" ${O} stroke-width="1.8"/>
    <circle cx="28" cy="58" r="5" fill="#f2c9a0" ${O}/><circle cx="72" cy="58" r="5" fill="#f2c9a0" ${O}/>
    <circle cx="50" cy="56" r="23" fill="#f2c9a0" ${O}/>
    ${eye(42, 52, 4.5, 2.2, 0.2, 0.2)}${eye(58, 52, 4.5, 2.2, 0.2, 0.2)}
    <circle cx="50" cy="60" r="3" fill="#e8a889" ${O} stroke-width="1.8"/>
    <path d="M36 65 C42 80 58 80 64 65 Z" fill="#fff" ${O}/><path d="M39 69 L61 69" ${O} stroke-width="1.8"/>
    <circle cx="32" cy="61" r="1.3" fill="#c47a4a"/><circle cx="35" cy="64" r="1.3" fill="#c47a4a"/><circle cx="31" cy="66" r="1.3" fill="#c47a4a"/><circle cx="68" cy="61" r="1.3" fill="#c47a4a"/><circle cx="65" cy="64" r="1.3" fill="#c47a4a"/><circle cx="69" cy="66" r="1.3" fill="#c47a4a"/>
    <path d="M22 40 C22 14 78 14 78 40 Z" fill="#8b5e3c" ${O}/><path d="M50 16 L36 40 M50 16 L64 40" stroke="#5c3a20" stroke-width="1.8"/>
    <path d="M22 40 L84 40 L80 46 L24 44 Z" fill="#5c3a20" ${O}/><circle cx="50" cy="17" r="2.5" fill="#5c3a20" ${O} stroke-width="1.8"/>`,
  heeza: () => `
    <path d="M8 100 C8 76 30 72 50 72 C70 72 92 76 92 100 Z" fill="#b8975a"/>
    <path d="M50 72 L40 84 L50 100 L60 84 Z" fill="#8a6d3a"/>
    <path d="M14 80 L30 78 L32 84 L18 88 Z" fill="#f5c342" ${O} stroke-width="1.8"/><path d="M86 80 L70 78 L68 84 L82 88 Z" fill="#f5c342" ${O} stroke-width="1.8"/>
    <path d="M22 86 L74 100" stroke="#c62828" stroke-width="6"/>
    <circle cx="30" cy="94" r="3.2" fill="#f5c342" ${O} stroke-width="1.4"/><circle cx="36" cy="98" r="3.2" fill="#f5c342" ${O} stroke-width="1.4"/>
    <circle cx="28" cy="54" r="5" fill="#f3bfa4" ${O}/><circle cx="72" cy="54" r="5" fill="#f3bfa4" ${O}/>
    <circle cx="50" cy="52" r="22" fill="#f3bfa4" ${O}/>
    <circle cx="36" cy="60" r="4" fill="#f4a3a3" opacity=".7"/><circle cx="64" cy="60" r="4" fill="#f4a3a3" opacity=".7"/>
    ${eye(41, 48, 4, 2, 0.2, 0.2)}${eye(59, 48, 4, 2, 0.2, 0.2)}
    <circle cx="59" cy="48" r="6.5" fill="none" stroke="#f5c342" stroke-width="2.4"/><path d="M64 53 C69 58 66 66 70 72" fill="none" stroke="#f5c342" stroke-width="1.8"/>
    <path d="M33 41 C37 36 44 37 47 40 M53 40 C56 37 63 36 67 41" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 62 C40 54 22 56 14 74 C26 68 36 78 42 70 C46 66 54 66 58 70 C64 78 74 68 86 74 C78 56 60 54 50 62 Z" fill="#fff" ${O}/>
    <circle cx="50" cy="57" r="6" fill="#e07a6a" ${O}/>
    <ellipse cx="50" cy="33" rx="32" ry="6" fill="#e8dcc0" ${O}/>
    <path d="M28 33 C28 8 72 8 72 33 Z" fill="#e8dcc0" ${O}/><path d="M30 28 L70 28" stroke="#7a6a3a" stroke-width="3"/>`,
  julius: () => `
    <path d="M72 50 C68 34 94 32 94 48 C94 58 84 58 84 68" fill="none" stroke="${K}" stroke-width="6.5" stroke-linecap="round"/><circle cx="85" cy="79" r="3.8" fill="${K}"/>
    <path d="M18 100 C22 70 78 70 82 100 Z" fill="${K}"/>
    <path d="M32 40 L33 2 L48 30 Z" fill="${K}" ${O}/><path d="M68 40 L67 2 L52 30 Z" fill="${K}" ${O}/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    <path d="M28 58 C32 80 68 80 72 58 C66 66 34 66 28 58 Z" fill="#fff" ${O}/>
    <ellipse cx="40" cy="47" rx="9.5" ry="11" fill="#fff" ${O}/><ellipse cx="60" cy="47" rx="9.5" ry="11" fill="#fff" ${O}/>
    ${pie(41, 48, 4.4, 5.6)}${pie(61, 48, 4.4, 5.6)}
    <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="${K}"/>
    <path d="M40 66 C44 72 56 72 60 66" fill="none" ${O}/>
    <path d="M16 60 L28 62 M16 68 L28 66 M84 60 L72 62 M84 68 L72 66" ${O}/>`,
  pete: () => `
    <g transform="rotate(-10 17 90)"><rect x="13" y="76" width="7" height="26" fill="#a0713d" ${O}/><rect x="11" y="94" width="11" height="4" fill="#8a8f96" ${O} stroke-width="1.8"/><path d="M13 82 L20 82" stroke="#5c3a20" stroke-width="2"/></g>
    <path d="M8 100 C12 78 88 78 92 100 Z" fill="${K}"/>
    <circle cx="28" cy="28" r="9" fill="${K}" ${O}/><circle cx="72" cy="28" r="9" fill="${K}" ${O}/>
    <circle cx="50" cy="52" r="27" fill="${K}" ${O}/>
    <path d="M26 64 L31 80 L38 74 L44 88 L50 80 L56 88 L62 74 L69 80 L74 64 Z" fill="#3a3a3a" ${O}/>
    <ellipse cx="50" cy="63" rx="14" ry="10" fill="#fff" ${O}/>
    ${eye(41, 48, 6, 2.6, 0.25, 0.25)}${eye(59, 48, 6, 2.6, -0.25, 0.25)}
    <path d="M32 38 L50 49 L32 48 Z" fill="${K}"/><path d="M68 38 L50 49 L68 48 Z" fill="${K}"/>
    <ellipse cx="50" cy="59" rx="6" ry="4.5" fill="${K}"/>
    <path d="M42 71 C46 67 54 67 58 71" fill="none" ${O}/><path d="M55 70 L57 75 L59 70 Z" fill="#fff" ${O} stroke-width="1.4"/>
    <path d="M38 27 C38 12 62 12 62 27 Z" fill="#3a3a3a" ${O}/><path d="M32 27 L68 27" ${O} stroke-width="3"/>`,
  clara: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M30 84 C38 92 62 92 70 84" fill="none" stroke="#c62828" stroke-width="4" stroke-linecap="round"/>
    <path d="M44 88 L56 88 L59 99 L41 99 Z" fill="#e5c76b" ${O} stroke-width="2"/><circle cx="50" cy="99" r="2.2" fill="${K}"/>
    <ellipse cx="22" cy="48" rx="13" ry="5.5" fill="${K}" transform="rotate(-18 22 48)" ${O}/><ellipse cx="78" cy="48" rx="13" ry="5.5" fill="${K}" transform="rotate(18 78 48)" ${O}/>
    <path d="M32 34 C24 30 24 20 32 18 C31 24 33 28 37 30 Z" fill="#fff" ${O}/><path d="M68 34 C76 30 76 20 68 18 C69 24 67 28 63 30 Z" fill="#fff" ${O}/>
    <circle cx="50" cy="50" r="24" fill="${K}" ${O}/>
    <ellipse cx="50" cy="66" rx="22" ry="13" fill="#f2c9a0" ${O}/>
    <ellipse cx="43" cy="65" rx="3.4" ry="2.4" fill="${K}"/><ellipse cx="57" cy="65" rx="3.4" ry="2.4" fill="${K}"/>
    <path d="M40 73 C46 77 54 77 60 73" fill="none" ${O}/>
    <ellipse cx="42" cy="46" rx="6" ry="7" fill="#fff" ${O}/><ellipse cx="58" cy="46" rx="6" ry="7" fill="#fff" ${O}/>
    <ellipse cx="43" cy="47" rx="3" ry="4" fill="${K}"/><ellipse cx="57" cy="47" rx="3" ry="4" fill="${K}"/>
    <path d="M36 40 L32 36 M38 38 L35 33 M64 40 L68 36 M62 38 L65 33" ${O} stroke-width="1.8"/>
    <ellipse cx="50" cy="28" rx="15" ry="4" fill="#4c9a8f" ${O}/><path d="M40 28 C40 16 60 16 60 28 Z" fill="#4c9a8f" ${O}/>
    <circle cx="56" cy="17" r="4" fill="#e9748f" ${O} stroke-width="1.6"/><circle cx="64" cy="17" r="4" fill="#e9748f" ${O} stroke-width="1.6"/><circle cx="60" cy="12" r="4" fill="#e9748f" ${O} stroke-width="1.6"/><circle cx="60" cy="22" r="4" fill="#e9748f" ${O} stroke-width="1.6"/><circle cx="60" cy="17" r="3" fill="#f5c342" ${O} stroke-width="1.6"/>`,
  horace: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M16 100 C16 76 84 76 84 100 Z" fill="#8d5a2b" ${O}/><path d="M30 100 C30 88 70 88 70 100 Z" fill="${K}" ${O}/>
    <circle cx="23" cy="92" r="2.2" fill="#e5c76b"/><circle cx="77" cy="92" r="2.2" fill="#e5c76b"/>
    <ellipse cx="34" cy="20" rx="5.5" ry="14" fill="${K}" transform="rotate(-10 34 20)" ${O}/><ellipse cx="66" cy="20" rx="5.5" ry="14" fill="${K}" transform="rotate(10 66 20)" ${O}/>
    <ellipse cx="50" cy="52" rx="22" ry="25" fill="${K}" ${O}/>
    <ellipse cx="50" cy="67" rx="17" ry="14" fill="#f2c9a0" ${O}/>
    <circle cx="43" cy="63" r="2.6" fill="${K}"/><circle cx="57" cy="63" r="2.6" fill="${K}"/>
    <path d="M38 74 C44 78 56 78 62 74" fill="none" ${O}/>
    <path d="M44 75 L50 75 L50 84 L44 83 Z" fill="#fff" ${O} stroke-width="1.8"/><path d="M50 75 L56 75 L56 83 L50 84 Z" fill="#fff" ${O} stroke-width="1.8"/>
    <ellipse cx="43" cy="45" rx="5.5" ry="7" fill="#fff" ${O}/><ellipse cx="57" cy="45" rx="5.5" ry="7" fill="#fff" ${O}/>
    <ellipse cx="44" cy="46" rx="2.6" ry="3.6" fill="${K}"/><ellipse cx="56" cy="46" rx="2.6" ry="3.6" fill="${K}"/>
    <ellipse cx="50" cy="28" rx="17" ry="4" fill="#4a4a4a" ${O}/><path d="M38 28 C38 12 62 12 62 28 Z" fill="#4a4a4a" ${O}/><path d="M39 24 L61 24" stroke="#8d5a2b" stroke-width="2.4"/>`,
  minnie: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M34 84 L48 89 L48 97 L34 100 Z M66 84 L52 89 L52 97 L66 100 Z" fill="#e9748f" ${O} stroke-width="2"/><circle cx="50" cy="93" r="3.2" fill="#e9748f" ${O} stroke-width="2"/>
    <circle cx="39" cy="89" r="1.5" fill="#fff"/><circle cx="42" cy="95" r="1.5" fill="#fff"/><circle cx="61" cy="89" r="1.5" fill="#fff"/><circle cx="58" cy="95" r="1.5" fill="#fff"/>
    <circle cx="27" cy="28" r="13" fill="${K}" ${O}/><circle cx="73" cy="28" r="13" fill="${K}" ${O}/>
    <circle cx="50" cy="54" r="25" fill="${K}" ${O}/>
    <ellipse cx="50" cy="60" rx="20" ry="17" fill="#fff" ${O}/>
    ${pie(44, 54, 3.6, 7)}${pie(56, 54, 3.6, 7)}
    <path d="M39 49 L35 47 M41 47 L38 43 M61 49 L65 47 M59 47 L62 43" ${O} stroke-width="1.8"/>
    <ellipse cx="50" cy="66" rx="5.5" ry="3.8" fill="${K}"/>
    <path d="M40 71 C45 78 55 78 60 71" fill="none" ${O}/>
    <path d="M30 40 C30 14 70 14 70 40 C62 34 38 34 30 40 Z" fill="#7fb2d8" ${O}/><path d="M26 42 C36 34 64 34 74 42" fill="none" ${O}/>
    <circle cx="45" cy="18" r="4" fill="#fff" ${O} stroke-width="1.6"/><circle cx="55" cy="18" r="4" fill="#fff" ${O} stroke-width="1.6"/><circle cx="50" cy="12" r="4" fill="#fff" ${O} stroke-width="1.6"/><circle cx="50" cy="24" r="4" fill="#fff" ${O} stroke-width="1.6"/><circle cx="50" cy="18" r="3.2" fill="#f5c342" ${O} stroke-width="1.6"/>`,
  mutt: () => `
    <path d="M20 100 C24 88 76 88 80 100 Z" fill="${K}"/>
    <rect x="44" y="68" width="12" height="20" fill="#f2c9a0" ${O}/>
    <path d="M38 84 L62 84 L60 93 L40 93 Z" fill="#fff" ${O}/><path d="M46 93 L54 93 L52 100 L48 100 Z" fill="#c62828" ${O} stroke-width="2"/>
    <circle cx="35" cy="40" r="4.5" fill="#f2c9a0" ${O}/><circle cx="65" cy="40" r="4.5" fill="#f2c9a0" ${O}/>
    <path d="M36 30 C36 14 64 14 64 30 L64 52 C64 68 58 82 50 84 C42 82 36 68 36 52 Z" fill="#f2c9a0" ${O}/>
    ${eye(44, 38, 3.6, 1.8, 0.2, 0.2)}${eye(56, 38, 3.6, 1.8, 0.2, 0.2)}
    <path d="M39 31 L47 33 M61 31 L53 33" ${O} stroke-width="2.4"/>
    <circle cx="50" cy="48" r="6.5" fill="#e8a889" ${O}/>
    <path d="M43 57 C46 54 49 55 50 57 C51 55 54 54 57 57 C54 60 46 60 43 57 Z" fill="${K}"/>
    <path d="M45 65 C48 66.5 52 66.5 55 65" fill="none" ${O} stroke-width="1.8"/>
    <path d="M46 75 C48 73 52 73 54 75" fill="none" ${O} stroke-width="1.6"/><path d="M36 20 L40 20 C40 28 39 32 36 34 Z M64 20 L60 20 C60 28 61 32 64 34 Z" fill="${K}"/>
    <ellipse cx="50" cy="16" rx="24" ry="5" fill="#4a4a4a" ${O}/><path d="M36 16 C36 -2 64 -2 64 16 Z" fill="#4a4a4a" ${O}/><path d="M37 12 L63 12" stroke="#222" stroke-width="2.4"/>`,
  jeff: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="${K}"/>
    <path d="M40 84 L50 96 L60 84 Z" fill="#fff"/>
    <path d="M43 88 L50 90 L57 88 L57 94 L50 92 L43 94 Z" fill="#c62828" ${O} stroke-width="1.6"/>
    <circle cx="50" cy="56" r="23" fill="#f8d7c4" ${O}/>
    <path d="M30 44 C20 56 22 74 36 80 C43 76 40 60 38 44 Z" fill="#f4f4f4" ${O}/>
    <path d="M70 44 C80 56 78 74 64 80 C57 76 60 60 62 44 Z" fill="#f4f4f4" ${O}/>
    ${eye(43, 52, 5.5, 2.4, 0.1, 0.2)}${eye(57, 52, 5.5, 2.4, -0.1, 0.2)}
    <path d="M37 44 C40 41 44 41 46 44 M54 44 C56 41 60 41 63 44" fill="none" ${O} stroke-width="2"/>
    <circle cx="50" cy="62" r="5.5" fill="#e8a889" ${O}/>
    <path d="M45 72 C48 75 52 75 55 72" fill="none" ${O}/>
    <ellipse cx="50" cy="41" rx="34" ry="5" fill="${K}" ${O}/>
    <path d="M24 41 L21 12 C30 8 42 15 50 10 C58 15 70 8 79 12 L76 41 Z" fill="${K}" ${O}/>
    <path d="M23 34 L77 34" stroke="#555" stroke-width="3"/>`,
  hooligan: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#3f7fd8"/>
    <path d="M42 84 L50 94 L58 84 Z" fill="#fff"/>
    <path d="M42 84 L36 100 M58 84 L64 100" ${O} stroke-width="2"/>
    <g transform="rotate(12 68 92)"><rect x="60" y="86" width="16" height="12" fill="#c9a227" ${O} stroke-width="2"/><path d="M60 89 L63 91 M60 95 L63 93 M76 89 L73 91 M76 95 L73 93" ${O} stroke-width="1.5"/></g>
    <circle cx="27" cy="58" r="6" fill="#f8d7c4" ${O}/><circle cx="73" cy="58" r="6" fill="#f8d7c4" ${O}/>
    <circle cx="50" cy="56" r="24" fill="#f8d7c4" ${O}/>
    ${eye(42, 50, 5, 2.4, 0.2, 0.3)}${eye(58, 50, 5, 2.4, -0.2, 0.3)}
    <path d="M36 43 C39 40 44 40 46 43 M54 43 C56 40 61 40 64 43" fill="none" ${O} stroke-width="2"/>
    <path d="M34 66 C40 82 60 82 66 66 Z" fill="#fff" ${O}/>
    <path d="M38 69 L62 69" ${O} stroke-width="1.8"/>
    <rect x="47" y="69" width="6" height="5" fill="${K}"/>
    <circle cx="50" cy="61" r="7" fill="#e05a4e" ${O}/>
    <g transform="rotate(-14 50 26)"><rect x="41" y="16" width="18" height="16" fill="#b0bec5" ${O}/><rect x="41" y="22" width="18" height="5" fill="#c62828"/><ellipse cx="50" cy="16" rx="9" ry="3" fill="#cfd8dc" ${O}/></g>`,
  buster: () => `
    <path d="M18 100 C22 84 78 84 82 100 Z" fill="#c62828"/>
    <path d="M28 88 C36 80 64 80 72 88 L72 96 C60 90 40 90 28 96 Z" fill="#fff" ${O}/>
    <ellipse cx="34" cy="88" rx="13" ry="7" fill="${K}" transform="rotate(-14 34 88)" ${O}/><ellipse cx="66" cy="88" rx="13" ry="7" fill="${K}" transform="rotate(14 66 88)" ${O}/>
    <circle cx="50" cy="88" r="4" fill="${K}" ${O}/>
    <ellipse cx="50" cy="54" rx="20" ry="22" fill="#f8d7c4" ${O}/>
    <path d="M28 62 C24 30 76 30 72 62 L64 62 L64 44 L36 44 L36 62 Z" fill="#e5c76b" ${O}/>
    <ellipse cx="50" cy="33" rx="36" ry="5" fill="#d9a441" ${O}/>
    <path d="M30 33 C30 14 70 14 70 33 Z" fill="#d9a441" ${O}/>
    <path d="M31 27 L69 27" stroke="#c62828" stroke-width="3.5"/>
    <circle cx="43" cy="53" r="3" fill="${K}"/><circle cx="57" cy="53" r="3" fill="${K}"/>
    <path d="M48 60 C50 64 52 60 52 60" fill="none" ${O} stroke-width="2"/>
    <path d="M42 67 C46 72 54 72 58 67" fill="none" ${O}/>
    <circle cx="82" cy="75" r="13" fill="#a5754c" ${O}/>
    <ellipse cx="70" cy="68" rx="4" ry="5.5" fill="#7a5233" transform="rotate(20 70 68)" ${O} stroke-width="2"/><ellipse cx="94" cy="68" rx="4" ry="5.5" fill="#7a5233" transform="rotate(-20 94 68)" ${O} stroke-width="2"/>
    <path d="M70 80 C70 72 94 72 94 80 C94 88 70 88 70 80 Z" fill="#fff" ${O} stroke-width="2"/>
    <ellipse cx="82" cy="76" rx="4" ry="2.8" fill="${K}"/>
    <path d="M72 82 C76 89 88 89 92 82 Z" fill="${K}"/>
    <path d="M76 83 L76 86 M80 84 L80 87 M84 84 L84 87 M88 83 L88 86" stroke="#fff" stroke-width="1.8"/>
    <circle cx="77" cy="70" r="2" fill="${K}"/><circle cx="87" cy="70" r="2" fill="${K}"/>`,
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
    ${outer}${t.series === 'tour' ? SPROCKETS : ''}
    ${ring ? `<circle cx="50" cy="50" r="43.5" fill="none" stroke="${col.hex}" stroke-width="3.2"/>` : ''}
    <circle cx="50" cy="50" r="49" fill="none" stroke="#3d5a80" stroke-width="1.4"/>
    ${bubble ? `<circle cx="76" cy="76" r="13" fill="${col.hex}" stroke="#fff" stroke-width="2.5"/><ellipse cx="72" cy="70" rx="7" ry="4" fill="#fff" opacity=".45"/><text x="76" y="81" text-anchor="middle" font-size="15" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="${t.color === 'yel' || t.color === 'slv' ? '#1c2f4a' : '#fff'}">${label}</text>` : ''}
  </svg>`;
}

// Film sprockets around a Keeper's Frame chip.
const SPROCKETS = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; const x = 50 + 47 * Math.cos(a), y = 50 + 47 * Math.sin(a);
  return `<rect x="${(x - 2.4).toFixed(1)}" y="${(y - 1.5).toFixed(1)}" width="4.8" height="3" rx=".8" fill="#fff" stroke="#3d5a80" stroke-width=".7" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('');

// Zone badge for the Orbit Tour: a film frame on a coloured disc.
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

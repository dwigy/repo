// Procedural cartoon character renderer. Every cToon is drawn from a small
// set of parameters so the whole catalog stays tiny and fully offline.
// Characters are rendered inside circular "gToon" tokens like the original site.
import { SERIES, COLORS } from './data.js';

const O = 'stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
let uid = 0;

function body(a) {
  const { c1, c2 } = a;
  switch (a.body) {
    case 'square': return `<rect x="22" y="26" width="56" height="56" rx="10" fill="${c1}" ${O}/>`;
    case 'tall':   return `<rect x="29" y="14" width="42" height="72" rx="20" fill="${c1}" ${O}/>`;
    case 'blob':   return `<path d="M50 20 C68 18 82 32 80 50 C84 68 66 86 48 84 C30 86 16 70 20 52 C18 34 32 20 50 20 Z" fill="${c1}" ${O}/>`;
    case 'ghost':  return `<path d="M24 52 C24 28 36 16 50 16 C64 16 76 28 76 52 L76 84 L67 76 L58 86 L50 76 L42 86 L33 76 L24 84 Z" fill="${c1}" ${O}/>`;
    case 'robot':  return `<rect x="24" y="24" width="52" height="52" rx="6" fill="${c1}" ${O}/><rect x="36" y="76" width="28" height="10" rx="3" fill="${c2}" ${O}/><circle cx="30" cy="30" r="2" fill="#111"/><circle cx="70" cy="30" r="2" fill="#111"/><circle cx="30" cy="70" r="2" fill="#111"/><circle cx="70" cy="70" r="2" fill="#111"/>`;
    case 'cactus': return `<rect x="36" y="16" width="28" height="72" rx="14" fill="${c1}" ${O}/><path d="M36 50 L24 50 L24 34" fill="none" ${O} stroke="${c1}" stroke-width="10"/><path d="M36 50 L24 50 L24 34" fill="none" ${O} stroke-width="3"/><path d="M64 44 L76 44 L76 28" fill="none" ${O} stroke="${c1}" stroke-width="10"/><path d="M64 44 L76 44 L76 28" fill="none" ${O}/>`;
    case 'muffin': return `<path d="M30 56 L34 88 L66 88 L70 56 Z" fill="${c2}" ${O}/><path d="M40 60 L42 86 M50 60 L50 86 M60 60 L58 86" stroke="#111" stroke-width="2" opacity=".4"/><ellipse cx="50" cy="44" rx="30" ry="20" fill="${c1}" ${O}/>`;
    case 'star':   return `<path d="M50 8 L61 36 L91 38 L67 56 L75 86 L50 70 L25 86 L33 56 L9 38 L39 36 Z" fill="${c1}" ${O}/>`;
    case 'sun':    return `<g stroke="${c2}" stroke-width="6" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(d=>`<line x1="50" y1="8" x2="50" y2="16" transform="rotate(${d} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="30" fill="${c1}" ${O}/>`;
    case 'cat':    return `<path d="M26 40 L24 14 L44 28 Z" fill="${c1}" ${O}/><path d="M74 40 L76 14 L56 28 Z" fill="${c1}" ${O}/><circle cx="50" cy="52" r="30" fill="${c1}" ${O}/>`;
    case 'owl':    return `<path d="M30 24 L26 10 L42 20 Z" fill="${c1}" ${O}/><path d="M70 24 L74 10 L58 20 Z" fill="${c1}" ${O}/><ellipse cx="50" cy="52" rx="28" ry="34" fill="${c1}" ${O}/><ellipse cx="50" cy="66" rx="16" ry="14" fill="${c2}" opacity=".35"/>`;
    case 'skull':  return `<path d="M22 46 C22 24 36 14 50 14 C64 14 78 24 78 46 C78 58 72 64 68 66 L68 80 L32 80 L32 66 C28 64 22 58 22 46 Z" fill="${c1}" ${O}/><path d="M40 80 L40 70 M50 80 L50 70 M60 80 L60 70" stroke="#111" stroke-width="3"/>`;
    case 'moth':   return `<path d="M50 50 C38 22 10 22 12 44 C10 60 34 66 50 56 Z" fill="${c2}" ${O}/><path d="M50 50 C62 22 90 22 88 44 C90 60 66 66 50 56 Z" fill="${c2}" ${O}/><ellipse cx="50" cy="54" rx="14" ry="24" fill="${c1}" ${O}/><path d="M44 32 L38 18 M56 32 L62 18" stroke="#111" stroke-width="3" fill="none"/>`;
    case 'donut':  return `<circle cx="50" cy="52" r="34" fill="${c1}" ${O}/><circle cx="50" cy="52" r="10" fill="${c2}" ${O}/>`;
    case 'snake':  return `<path d="M20 84 C20 66 44 70 44 56 C44 44 26 44 26 32 C26 18 40 14 50 14 C64 14 76 24 76 40 C76 52 68 56 68 64 C68 78 84 80 84 90" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round"/><path d="M20 84 C20 66 44 70 44 56 C44 44 26 44 26 32 C26 18 40 14 50 14 C64 14 76 24 76 40 C76 52 68 56 68 64 C68 78 84 80 84 90" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="34" r="20" fill="${c1}" ${O}/>`;
    case 'tumble': return `<circle cx="50" cy="54" r="32" fill="${c1}" ${O}/><path d="M28 40 C44 60 60 30 74 60 M24 60 C40 44 62 74 76 44 M40 26 C50 50 56 46 62 80" fill="none" stroke="${c2}" stroke-width="3"/>`;
    case 'lantern':return `<rect x="42" y="8" width="16" height="8" rx="2" fill="${c2}" ${O}/><path d="M30 18 L70 18 L76 80 L24 80 Z" fill="${c1}" ${O}/><rect x="30" y="80" width="40" height="8" rx="2" fill="${c2}" ${O}/><path d="M40 18 L38 80 M60 18 L62 80" stroke="#111" stroke-width="2" opacity=".35"/>`;
    case 'spatula':return `<rect x="46" y="60" width="8" height="34" rx="3" fill="${c2}" ${O}/><path d="M24 16 L76 16 L72 62 L28 62 Z" fill="${c1}" ${O}/><path d="M36 20 L36 58 M50 20 L50 58 M64 20 L64 58" stroke="#111" stroke-width="2" opacity=".3"/>`;
    case 'shield': return `<path d="M50 10 L84 22 C84 60 70 80 50 92 C30 80 16 60 16 22 Z" fill="${c1}" ${O}/><path d="M50 18 L76 27 C76 58 66 74 50 84 Z" fill="${c2}" opacity=".35"/>`;
    case 'oasis':  return `<ellipse cx="50" cy="72" rx="36" ry="16" fill="${c1}" ${O}/><path d="M50 62 L50 26" stroke="${c2}" stroke-width="5" fill="none"/><path d="M50 28 C40 24 30 26 26 34 M50 28 C60 24 70 26 74 34 M50 26 C42 16 34 16 30 22 M50 26 C58 16 66 16 70 22" fill="none" stroke="#166534" stroke-width="5" stroke-linecap="round"/><ellipse cx="50" cy="72" rx="20" ry="8" fill="#fff" opacity=".2"/>`;
    default:       return `<circle cx="50" cy="54" r="32" fill="${c1}" ${O}/>`;
  }
}

function faceY(a) {
  switch (a.body) {
    case 'muffin': return { ey: 42, my: 52 };
    case 'moth':   return { ey: 46, my: 58 };
    case 'snake':  return { ey: 30, my: 40 };
    case 'lantern':return { ey: 40, my: 58 };
    case 'spatula':return { ey: 32, my: 46 };
    case 'skull':  return { ey: 42, my: 62 };
    case 'oasis':  return { ey: 68, my: 76 };
    case 'donut':  return { ey: 36, my: 68 };
    case 'tall':   return { ey: 40, my: 56 };
    case 'cactus': return { ey: 40, my: 54 };
    case 'robot':  return { ey: 44, my: 60 };
    case 'ghost':  return { ey: 42, my: 56 };
    default:       return { ey: 48, my: 64 };
  }
}

function eyes(a, ey) {
  const L = a.body === 'donut' ? 38 : 40, R = a.body === 'donut' ? 62 : 60;
  const one = (x) => {
    switch (a.eyes) {
      case 'dot':   return `<circle cx="${x}" cy="${ey}" r="3" fill="#111"/>`;
      case 'big':   return `<circle cx="${x}" cy="${ey}" r="7" fill="#fff" ${O}/><circle cx="${x+1.5}" cy="${ey+1}" r="3.2" fill="#111"/><circle cx="${x+3}" cy="${ey-1.5}" r="1.2" fill="#fff"/>`;
      case 'sleepy':return `<path d="M${x-6} ${ey} Q${x} ${ey+6} ${x+6} ${ey}" fill="none" ${O}/>`;
      case 'angry': return `<circle cx="${x}" cy="${ey}" r="6" fill="#fff" ${O}/><circle cx="${x}" cy="${ey+1}" r="3" fill="#111"/><line x1="${x-7}" y1="${ey-8}" x2="${x+7}" y2="${ey-6}" ${O} transform="${x<50?'':'scale(-1 1) translate(-'+(2*x)+' 0)'}"/>`;
      case 'happy': return `<path d="M${x-6} ${ey+2} Q${x} ${ey-6} ${x+6} ${ey+2}" fill="none" ${O}/>`;
      case 'x':     return `<path d="M${x-4} ${ey-4} L${x+4} ${ey+4} M${x+4} ${ey-4} L${x-4} ${ey+4}" ${O}/>`;
      default:      return `<circle cx="${x}" cy="${ey}" r="5" fill="#fff" ${O}/><circle cx="${x}" cy="${ey}" r="2.5" fill="#111"/>`;
    }
  };
  if (a.eyes === 'three') return one(38) + one(50) + one(62);
  if (a.eyes === 'one')   return one(50);
  return one(L) + one(R);
}

function mouth(a, my) {
  switch (a.mouth) {
    case 'smile': return `<path d="M42 ${my} Q50 ${my+8} 58 ${my}" fill="none" ${O}/>`;
    case 'grin':  return `<path d="M40 ${my-2} Q50 ${my+12} 60 ${my-2} Z" fill="#fff" ${O}/><path d="M40 ${my-2} L60 ${my-2}" ${O}/>`;
    case 'open':  return `<ellipse cx="50" cy="${my+2}" rx="6" ry="7" fill="#7f1d1d" ${O}/>`;
    case 'flat':  return `<path d="M42 ${my+2} L58 ${my+2}" ${O}/>`;
    case 'fang':  return `<path d="M40 ${my-2} Q50 ${my+12} 60 ${my-2} Z" fill="#7f1d1d" ${O}/><path d="M43 ${my-1} L45 ${my+5} L47 ${my-1} Z M53 ${my-1} L55 ${my+5} L57 ${my-1} Z" fill="#fff"/>`;
    case 'beak':  return `<path d="M44 ${my-4} L56 ${my-4} L50 ${my+6} Z" fill="#f59e0b" ${O}/>`;
    case 'wavy':  return `<path d="M40 ${my} Q45 ${my-5} 50 ${my} T60 ${my}" fill="none" ${O}/>`;
    case 'tongue':return `<path d="M42 ${my} Q50 ${my+8} 58 ${my}" fill="none" ${O}/><path d="M48 ${my+3} Q50 ${my+12} 55 ${my+4}" fill="#f43f5e" ${O}/>`;
    default:      return '';
  }
}

function hat(a) {
  const { c2 } = a;
  const top = a.body === 'tall' || a.body === 'cactus' || a.body === 'lantern' ? 14 : a.body === 'muffin' ? 24 : a.body === 'snake' ? 14 : 22;
  switch (a.hat) {
    case 'helmet':  return `<path d="M24 ${top+16} C24 ${top-4} 76 ${top-4} 76 ${top+16} L76 ${top+22} L24 ${top+22} Z" fill="#e5e7eb" ${O}/><rect x="20" y="${top+18}" width="60" height="7" rx="3" fill="${c2}" ${O}/><circle cx="66" cy="${top+8}" r="3" fill="#fff" opacity=".7"/>`;
    case 'cap':     return `<path d="M28 ${top+14} C28 ${top-2} 72 ${top-2} 72 ${top+14} Z" fill="${c2}" ${O}/><path d="M28 ${top+14} L86 ${top+14} L86 ${top+19} L28 ${top+19} Z" fill="${c2}" ${O}/>`;
    case 'crown':   return `<path d="M30 ${top+16} L30 ${top-4} L40 ${top+6} L50 ${top-8} L60 ${top+6} L70 ${top-4} L70 ${top+16} Z" fill="#fbbf24" ${O}/><circle cx="50" cy="${top+4}" r="2.5" fill="#ef4444"/>`;
    case 'tophat':  return `<rect x="34" y="${top-14}" width="32" height="30" rx="2" fill="#111827" ${O}/><rect x="26" y="${top+12}" width="48" height="6" rx="2" fill="#111827" ${O}/><rect x="34" y="${top+6}" width="32" height="5" fill="#ef4444"/>`;
    case 'chef':    return `<path d="M30 ${top+16} L30 ${top+4} C22 ${top-6} 36 ${top-16} 44 ${top-8} C48 ${top-18} 58 ${top-18} 60 ${top-8} C70 ${top-16} 80 ${top-4} 70 ${top+4} L70 ${top+16} Z" fill="#fff" ${O}/>`;
    case 'cowboy':  return `<path d="M20 ${top+14} C30 ${top+10} 70 ${top+10} 80 ${top+14} C82 ${top+18} 78 ${top+22} 74 ${top+20} C64 ${top+16} 36 ${top+16} 26 ${top+20} C22 ${top+22} 18 ${top+18} 20 ${top+14} Z" fill="#92400e" ${O}/><path d="M34 ${top+14} C34 ${top-4} 66 ${top-4} 66 ${top+14} Z" fill="#92400e" ${O}/>`;
    case 'bow':     return `<path d="M62 ${top+4} L74 ${top-4} L74 ${top+12} Z M62 ${top+4} L50 ${top-4} L50 ${top+12} Z" fill="#f43f5e" ${O}/><circle cx="62" cy="${top+4}" r="3.5" fill="#fb7185" ${O}/>`;
    case 'antenna': return `<line x1="50" y1="${top+8}" x2="50" y2="${top-8}" ${O}/><circle cx="50" cy="${top-10}" r="4" fill="#f43f5e" ${O}/>`;
    case 'horns':   return `<path d="M34 ${top+10} L28 ${top-6} L42 ${top+6} Z M66 ${top+10} L72 ${top-6} L58 ${top+6} Z" fill="${c2}" ${O}/>`;
    case 'leaves':  return `<path d="M50 ${top+10} C50 ${top-4} 60 ${top-10} 70 ${top-6} C68 ${top+4} 58 ${top+8} 50 ${top+10} Z M50 ${top+10} C50 ${top-4} 40 ${top-10} 30 ${top-6} C32 ${top+4} 42 ${top+8} 50 ${top+10} Z" fill="#22c55e" ${O}/>`;
    case 'mushroom':return `<path d="M22 ${top+12} C22 ${top-8} 78 ${top-8} 78 ${top+12} Z" fill="#ef4444" ${O}/><circle cx="36" cy="${top+2}" r="3.5" fill="#fff"/><circle cx="52" cy="${top-2}" r="3" fill="#fff"/><circle cx="66" cy="${top+4}" r="3" fill="#fff"/>`;
    case 'cherry':  return `<circle cx="50" cy="${top+2}" r="6" fill="#dc2626" ${O}/><path d="M50 ${top-4} C50 ${top-12} 58 ${top-12} 60 ${top-16}" fill="none" ${O}/>`;
    default: return '';
  }
}

function extra(a, ey, my) {
  const { c2 } = a;
  switch (a.extra) {
    case 'blush':    return `<circle cx="34" cy="${ey+10}" r="4" fill="#f87171" opacity=".55"/><circle cx="66" cy="${ey+10}" r="4" fill="#f87171" opacity=".55"/>`;
    case 'glasses':  return `<circle cx="40" cy="${ey}" r="9" fill="none" ${O}/><circle cx="60" cy="${ey}" r="9" fill="none" ${O}/><line x1="49" y1="${ey}" x2="51" y2="${ey}" ${O}/>`;
    case 'monocle':  return `<circle cx="60" cy="${ey}" r="9" fill="none" ${O}/><line x1="68" y1="${ey+6}" x2="74" y2="${ey+20}" ${O}/>`;
    case 'mustache': return `<path d="M50 ${my-3} C44 ${my-10} 36 ${my-4} 38 ${my+1} C42 ${my-1} 46 ${my-1} 50 ${my-3} C54 ${my-1} 58 ${my-1} 62 ${my+1} C64 ${my-4} 56 ${my-10} 50 ${my-3} Z" fill="#111"/>`;
    case 'cape':     return `<path d="M22 46 L10 92 L30 80 Z M78 46 L90 92 L70 80 Z" fill="#dc2626" ${O}/>`;
    case 'star':     return `<path d="M50 ${my+10} L52.5 ${my+16} L59 ${my+16.5} L54 ${my+20.5} L55.5 ${my+27} L50 ${my+23.5} L44.5 ${my+27} L46 ${my+20.5} L41 ${my+16.5} L47.5 ${my+16} Z" fill="#fbbf24" ${O}/>`;
    case 'badge':    return `<circle cx="34" cy="${my+12}" r="6" fill="#fbbf24" ${O}/>`;
    case 'scar':     return `<path d="M62 ${ey-12} L68 ${ey-2} M61 ${ey-8} L66 ${ey-9} M63 ${ey-4} L68 ${ey-5}" ${O}/>`;
    case 'spikes':   return `<path d="M22 40 L12 34 L20 46 M22 60 L10 62 L22 68 M78 40 L88 34 L80 46 M78 60 L90 62 L78 68" fill="none" ${O}/>`;
    case 'fuzz':     return `<path d="M20 44 L14 40 M20 54 L12 54 M22 64 L14 68 M80 44 L86 40 M80 54 L88 54 M78 64 L86 68 M40 22 L38 14 M50 20 L50 12 M60 22 L62 14" ${O}/>`;
    case 'spots':    return `<circle cx="34" cy="${ey+18}" r="3" fill="${c2}"/><circle cx="66" cy="${ey+16}" r="2.5" fill="${c2}"/><circle cx="56" cy="${ey-14}" r="2.5" fill="${c2}"/><circle cx="40" cy="${ey-12}" r="2" fill="${c2}"/>`;
    case 'sprinkles':return `<g stroke-width="3" stroke-linecap="round"><line x1="30" y1="${ey-10}" x2="36" y2="${ey-14}" stroke="#f43f5e"/><line x1="62" y1="${ey-14}" x2="68" y2="${ey-10}" stroke="#3b82f6"/><line x1="36" y1="${ey+18}" x2="42" y2="${ey+20}" stroke="#22c55e"/><line x1="60" y1="${ey+20}" x2="66" y2="${ey+16}" stroke="#facc15"/><line x1="48" y1="${ey-18}" x2="54" y2="${ey-18}" stroke="#a855f7"/></g>`;
    case 'sparkle':  return `<g fill="#fff"><path d="M18 22 L20 28 L26 30 L20 32 L18 38 L16 32 L10 30 L16 28 Z"/><path d="M84 66 L85.5 70 L90 71.5 L85.5 73 L84 77 L82.5 73 L78 71.5 L82.5 70 Z"/><path d="M80 20 L81 23 L84 24 L81 25 L80 28 L79 25 L76 24 L79 23 Z"/></g>`;
    case 'grid':     return `<path d="M36 26 L36 82 M50 26 L50 82 M64 26 L64 82 M22 40 L78 40 M22 54 L78 54 M22 68 L78 68" stroke="#111" stroke-width="2" opacity=".25"/>`;
    case 'bubbles':  return `<circle cx="28" cy="20" r="4" fill="none" ${O}/><circle cx="72" cy="16" r="3" fill="none" ${O}/><circle cx="80" cy="30" r="5" fill="none" ${O}/>`;
    case 'swirl':    return `<path d="M50 20 C40 20 36 30 44 34 C50 36 54 30 50 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
    case 'ears':     return `<path d="M32 18 L26 2 L40 14 Z M68 18 L74 2 L60 14 Z" fill="${a.c1}" ${O}/>`;
    default: return '';
  }
}

// Just the character (transparent background), 100x100 viewBox.
export function characterSVG(t, size = 100) {
  const a = t.art;
  const { ey, my } = faceY(a);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${t.name}">
    ${a.extra === 'cape' ? extra(a, ey, my) : ''}${body(a)}${eyes(a, ey)}${mouth(a, my)}${hat(a)}${a.extra !== 'cape' ? extra(a, ey, my) : ''}
  </svg>`;
}

// Scene background for a token: a little cartoon backdrop per series.
function scene(t, id) {
  const [d, l] = SERIES[t.series]?.bg || ['#333', '#777'];
  const deco = {
    rr: `<circle cx="22" cy="24" r="1.6" fill="#fff"/><circle cx="76" cy="18" r="1.2" fill="#fff"/><circle cx="82" cy="60" r="1.8" fill="#fff"/><circle cx="16" cy="70" r="1.2" fill="#fff"/><circle cx="74" cy="82" r="7" fill="#fff" opacity=".25"/>`,
    gw: `<path d="M0 78 Q20 60 40 78 T80 78 T120 78 V100 H0 Z" fill="#0f5a2a"/><path d="M18 80 L24 50 L30 80 Z M70 82 L78 46 L86 82 Z" fill="#1f7a36"/>`,
    rd: `<rect x="0" y="0" width="100" height="100" fill="url(#chk${id})"/>`,
    ss: `<circle cx="74" cy="24" r="12" fill="#fef3c7" opacity=".9"/><path d="M0 84 L14 70 L26 84 L40 66 L54 84 L70 72 L84 84 L100 70 V100 H0 Z" fill="#150a2e"/>`,
    mm: `<rect x="0" y="0" width="100" height="100" fill="url(#str${id})"/>`,
    cc: `<circle cx="72" cy="26" r="11" fill="#fff5b0"/><path d="M0 76 Q30 64 50 76 T100 74 V100 H0 Z" fill="#c9862a"/>`,
    pz: `<path d="M50 6 L56 42 L94 50 L56 58 L50 94 L44 58 L6 50 L44 42 Z" fill="#fff" opacity=".35"/>`,
  }[t.series] || '';
  return `<defs>
      <radialGradient id="bg${id}" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="${l}"/><stop offset="1" stop-color="${d}"/></radialGradient>
      <pattern id="chk${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff" opacity=".18"/><rect x="8" y="8" width="8" height="8" fill="#fff" opacity=".18"/></pattern>
      <pattern id="str${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="14" fill="#fff" opacity=".12"/></pattern>
      <clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#bg${id})"/>
    <g clip-path="url(#clip${id})">${deco}</g>`;
}

// A gToon token: circular scene + character + colour ring + point bubble.
export function tokenSVG(t, size = 100, opts = {}) {
  const id = 'k' + (uid++);
  const a = t.art;
  const { ey, my } = faceY(a);
  const col = COLORS[t.color] || COLORS.slv;
  const ring = opts.ring !== false;
  const bubble = opts.bubble !== false;
  const label = opts.label != null ? opts.label : t.pts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${t.name}">
    ${scene(t, id)}
    <g clip-path="url(#clip${id})" transform="translate(50 50) scale(.78) translate(-50 -47)">
      ${a.extra === 'cape' ? extra(a, ey, my) : ''}${body(a)}${eyes(a, ey)}${mouth(a, my)}${hat(a)}${a.extra !== 'cape' ? extra(a, ey, my) : ''}
    </g>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="5"/>
    ${ring ? `<circle cx="50" cy="50" r="46" fill="none" stroke="${col.hex}" stroke-width="3.5"/>` : ''}
    <circle cx="50" cy="50" r="48.5" fill="none" stroke="#5b7fa6" stroke-width="1.5"/>
    ${bubble ? `<circle cx="76" cy="76" r="13" fill="${col.hex}" stroke="#fff" stroke-width="2.5"/><text x="76" y="81" text-anchor="middle" font-size="15" font-weight="800" font-family="'Barlow Condensed', 'Arial Narrow', sans-serif" fill="${t.color === 'yel' || t.color === 'slv' ? '#1c2f4a' : '#fff'}">${label}</text>` : ''}
  </svg>`;
}

// Empty board socket: silver sunburst with "ORBIT".
export function socketSVG(size = 100) {
  const rays = [];
  for (let i = 0; i < 24; i++) rays.push(`<path d="M50 50 L${(50 + 46 * Math.cos(i * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin(i * Math.PI / 12)).toFixed(2)} L${(50 + 46 * Math.cos((i + .5) * Math.PI / 12)).toFixed(2)} ${(50 + 46 * Math.sin((i + .5) * Math.PI / 12)).toFixed(2)} Z" fill="#fff" opacity=".35"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <circle cx="50" cy="50" r="47" fill="#8ea9c4"/>
    ${rays.join('')}
    <circle cx="50" cy="50" r="47" fill="none" stroke="#dbe7f2" stroke-width="4"/>
    <circle cx="50" cy="50" r="49" fill="none" stroke="#5b7fa6" stroke-width="1.5"/>
    <text x="50" y="55" text-anchor="middle" font-size="15" font-family="Michroma, 'Arial Black', sans-serif" font-style="italic" fill="#dbe7f2" opacity=".85">ORBIT</text>
  </svg>`;
}

// Silhouette used for cToons the player has not collected yet.
export function shadowTokenSVG(t, size = 100) {
  const id = 'k' + (uid++);
  const a = { ...t.art, c1: '#5d7896', c2: '#42536b' };
  const { ey, my } = faceY(a);
  void ey; void my;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs><clipPath id="clip${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs>
    <circle cx="50" cy="50" r="46" fill="#7f97b1"/>
    <g clip-path="url(#clip${id})" opacity=".5" transform="translate(50 50) scale(.78) translate(-50 -47)">${body(a)}</g>
    <text x="50" y="62" text-anchor="middle" font-size="34" font-weight="800" fill="#dbe7f2" font-family="'Barlow Condensed', sans-serif">?</text>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#c9d7e5" stroke-width="5"/>
    <circle cx="50" cy="50" r="48.5" fill="none" stroke="#5b7fa6" stroke-width="1.5"/>
  </svg>`;
}

// cZone badge: spiky starburst frame around a token (like the cZones page).
export function badgeSVG(t, size = 100) {
  const pts = [];
  for (let i = 0; i < 32; i++) { const r = i % 2 ? 50 : 44; const ang = i * Math.PI / 16; pts.push(`${(50 + r * Math.cos(ang)).toFixed(2)},${(50 + r * Math.sin(ang)).toFixed(2)}`); }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <polygon points="${pts.join(' ')}" fill="#2f6fd0" stroke="#1c3f7a" stroke-width="1.5"/>
    <g transform="translate(50 50) scale(.84) translate(-50 -50)">${tokenSVG(t, 100, { bubble: false, ring: false })}</g>
  </svg>`;
}

// Keep old name working for anything that still imports it.
export const ctoonSVG = (t, size) => tokenSVG(t, size, { bubble: false });
export const ctoonShadowSVG = shadowTokenSVG;

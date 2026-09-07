// Vocabulary lint: fails on any banned word in a user-facing string.
// Usage: node scripts/lexicon-lint.mjs [--all]   (exit 1 on hits)
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const FILES = ['js/ui.js', 'js/camp.js', 'js/story.js', 'js/news.js', 'js/data.js', 'js/campaign.js', 'js/lexicon.js', 'js/pack.js', 'js/game.js', 'index.html', 'manifest.webmanifest', 'README.md', 'docs/WORLD.md'];
const GROUPS = {
  ancestors: /\b(ctoons?|czones?|gtoons?|orbit|pok[eé]mon|gyms?|trainers?|professors?|rivals?|badges?|elite four|pok[eé]dex)\b/gi,
  music: /\b(songs?|notes?|scales?|chords?|octaves?|tunes?|melod(?:y|ies)|sing|sings|singing)\b/gi,
  esoteric: /\b(chakras?|sigils?|alchemy|alchemical|archons?|occult|esoteric|initiations?|initiates?|gnosis|sacred geometry|kabbalah|tarot|rituals?|mystics?)\b/gi,
  retired: /\b(chips?|decks?|zones?|heroes|hero|gatekeepers?|series)\b/gi,
  toolverb: /\buse (?:your|a|an|the|my|this|that) (?:companions?|discs?|fragments?)\b|\buse it\b.{0,40}\b(?:companions?|discs?|fragments?)\b|\b(?:companions?|discs?|fragments?)\b.{0,40}\buse it\b/gi,
  resolution: /the split happened because|there are \d+ fragments|\b\d+ fragments in the world/gi,
};
const allow = existsSync(resolve(ROOT, 'scripts/lexicon-allow.txt')) ? readFileSync(resolve(ROOT, 'scripts/lexicon-allow.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const [re, why] = l.split('|'); return { re: new RegExp(re, 'i'), why }; }) : [];

// Pull user-facing text out of a JS file: string and template literal contents, minus ${...} expressions,
// minus HTML tags/attributes, minus comments.
function jsStrings(src) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { const j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
    if (c === '/' && src[i + 1] === '*') { const j = src.indexOf('*/', i); i = j < 0 ? n : j + 2; continue; }
    if (c === "'" || c === '"') { let j = i + 1, s = ''; while (j < n && src[j] !== c) { if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; } s += src[j]; j++; } out.push({ text: s, at: i }); i = j + 1; continue; }
    if (c === '`') { let j = i + 1, depth = 0, s = ''; while (j < n) { if (depth === 0 && src[j] === '`') break; if (src[j] === '$' && src[j + 1] === '{') { depth++; j += 2; s += ' '; continue; } if (depth && src[j] === '}') { depth--; j++; continue; } if (depth) { j++; continue; } if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; } s += src[j]; j++; } out.push({ text: s, at: i }); i = j + 1; continue; }
    i++;
  }
  return out;
}
const stripHtml = (s) => s.replace(/<[^>]*>/g, ' ');
function lineOf(src, at) { return src.slice(0, at).split('\n').length; }
let hits = 0;
for (const f of FILES) {
  const path = resolve(ROOT, f); if (!existsSync(path)) continue;
  const src = readFileSync(path, 'utf8');
  // A document may fence a region it must quote verbatim (a ban list quotes the ban list).
  const fenced = src.replace(/<!-- lint:ignore-start -->[\s\S]*?<!-- lint:ignore-end -->/g, (m) => m.replace(/[^\n]/g, ' '));
  const chunks = f.endsWith('.js') ? jsStrings(fenced).map(x => ({ text: stripHtml(x.text), at: x.at })) : [{ text: stripHtml(fenced), at: 0 }];
  for (const ch of chunks) {
    // Identifiers, class names, ids and urls are not user-facing copy.
    if (f.endsWith('.js') && !/\s/.test(ch.text.trim())) continue;
    // CSS values, SVG markup and animation keyframes are not user-facing copy.
    if (f.endsWith('.js') && /(scale|translate|rotate|cubic-bezier|linear-gradient|radial-gradient)\(|<svg|viewBox=|stroke-width|animation-delay|border-radius|z-index/.test(ch.text)) continue;
    for (const [group, re] of Object.entries(GROUPS)) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(ch.text))) {
        const lineStart = ch.text.lastIndexOf('\n', m.index) + 1; const lineEnd = ch.text.indexOf('\n', m.index);
        const line = ch.text.slice(lineStart, lineEnd < 0 ? undefined : lineEnd).trim();
        // part of a kebab/dot identifier (hero-kicker, region-badge, .series) -> not copy
        const before = ch.text[m.index - 1] || ' ', after = ch.text[m.index + m[0].length] || ' ';
        if (/[-_.]/.test(before) || /[-_]/.test(after)) continue;
        if (allow.some(a => a.re.test(line) || a.re.test(m[0]))) continue;
        const ln = f.endsWith('.js') ? lineOf(src, ch.at) : lineOf(src, m.index);
        console.log(`${f}:${ln} [${group}] "${m[0]}"  …${line.slice(Math.max(0, m.index - lineStart - 40), m.index - lineStart + 50).replace(/\s+/g, ' ')}…`);
        hits++;
      }
    }
  }
}
console.log(hits ? `\n${hits} hit(s). Fix the copy or add a justified exception to scripts/lexicon-allow.txt.` : 'lexicon lint: clean');
process.exit(hits ? 1 : 0);

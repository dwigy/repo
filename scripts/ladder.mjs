// Keeper ladder sweep. For each Keeper, the win rate of that region's road stack
// across a grid of stack tiers and AI difficulty, against a target rate.
//
//   ONLY=4,5 TIERS=-1.5,-1.75 DIFFS=0.55,0.75 node scripts/ladder.mjs 100
//
// A meeting is close to deterministic once both stacks are dealt, so the stack
// roll is the sample: every iteration rolls a fresh road stack.
import * as B from '../js/meeting.js';
import { BY_ID, PACKABLE } from '../js/data.js';
import { trainPool } from '../js/game.js';
import { REGIONS, STARTERS, shiftEditions, padStack } from '../js/campaign.js';
import { readFileSync } from 'node:fs';
const N = +(process.argv[2] || 120);
const rnd = Math.random;
function rollPack(p){const o=[];for(let i=0;i<p.size;i++){let r=0,x=rnd(),a=0;for(let k=0;k<p.odds.length;k++){a+=p.odds[k];if(x<a){r=k;break}r=k}if(i===0&&r<p.minRarity)r=p.minRarity;if(p.maxRarity!=null&&r>p.maxRarity)r=p.maxRarity;let pl=PACKABLE.filter(t=>t.rarity===r);while(!pl.length&&r>0){r--;pl=PACKABLE.filter(t=>t.rarity===r)}o.push(pl[Math.floor(rnd()*pl.length)].id)}return o}
const byPts=(a,b)=>b.pts-a.pts;
function legal(ids){const list=ids.map(i=>BY_ID[i]).sort(byPts);const by={};list.forEach(t=>(by[t.color]=by[t.color]||[]).push(t.pts));let lead=null,sc=0;for(const[c,pts]of Object.entries(by)){if(pts.length<12)continue;const v=pts.slice().sort((a,b)=>b-a).slice(0,12).reduce((a,b)=>a+b,0);if(v>sc){sc=v;lead=c}}const out=[],f={};let w=0;const take=t=>{if(out.length>=20)return;if((f[t.char]||0)>=3)return;if(t.series==='whole'&&w)return;out.push(t.id);f[t.char]=(f[t.char]||0)+1;if(t.series==='whole')w++};if(lead)for(const t of list){if(out.length>=20)break;if(t.color===lead)take(t)}for(const t of list){if(out.length>=20)break;take(t)}return out}
function road(n){let owned=STARTERS[0].chips.slice();for(let k=1;k<=n;k++){for(let j=0;j<6;j++)owned=owned.concat(rollPack(REGIONS[k-1].pack));if(k<n)owned.push(`one${k}`)}return legal(owned)}
function play(pS,aS,rules,opp){const m=B.newMatch(pS,aS,opp,{rules,pAwake:[],heroP:null});
 const mv=(s)=>B.aiChoose({opponent:{diff:1},rules:m.rules,ai:s==='p'?m.p:m.ai,p:s==='p'?m.ai:m.p});
 while(!m.done){if(m.turn==='p'){const x=mv('p');B.place(m,'p',x.handIndex,x.slot)}else{const x=B.aiChoose(m);B.place(m,'ai',x.handIndex,x.slot)}}
 const e=B.evaluate(m.p,m.ai,m.rules);return e.aTotal>e.bTotal?1:0}
function rate(mk,aS,rules,opp,n=N){let w=0,st=mk();for(let i=0;i<n;i++){st=mk();w+=play(st,aS,rules,opp)}return Math.round(100*w/n)}
const src=readFileSync(new URL('../js/campaign.js',import.meta.url),'utf8');
const sigs={};
for(const m of src.matchAll(/gate: KEEPER\((\d), '[a-z0-9]+', [\d.]+, (\[[^\]]+\])/g)) sigs[m[1]]=JSON.parse(m[2].replace(/'/g,'"'));
const TARGET={1:50,2:47,3:44,4:41,5:38,6:34,7:30};
const TIERS=(process.env.TIERS||'0,-0.25,-0.5,-0.75,-1,-1.5').split(',').map(Number);
const DIFFS=(process.env.DIFFS||'0.35,0.55,0.75,0.95').split(',').map(Number);
const ONLY=(process.env.ONLY||'').split(',').filter(Boolean).map(Number);
for(const r of REGIONS){
  if(ONLY.length&&!ONLY.includes(r.n))continue;
  const g=r.gate, tgt=TARGET[r.n]; const mk=()=>road(r.n);
  let best=null; const grid=[];
  for(const tier of TIERS){
    const aS=padStack(shiftEditions(sigs[String(r.n)],tier));
    const row=[];
    for(const diff of DIFFS){
      const v=rate(mk,aS,g.rules,{diff,smart:!!g.smart});
      row.push(v);
      const err=Math.abs(v-tgt);
      if(!best||err<best.err) best={tier,diff,v,err};
    }
    grid.push(`  tier ${String(tier).padStart(5)}: ${row.map(x=>String(x).padStart(3)+'%').join(' ')}`);
  }
  console.log(`g${r.n} target ${tgt}%  (diffs ${DIFFS.join(' ')})`);
  grid.forEach(l=>console.log(l));
  console.log(`  -> tier ${best.tier} diff ${best.diff} = ${best.v}%\n`);
}

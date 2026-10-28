// Merge regression, part 2: each embed loads (one at a time, real frame check),
// and a slow-hold probe for scenes that did not reach their hold in part 1.
// node scripts/regress-merge-embeds.mjs <root> [base]
import {chromium} from 'playwright-core';
import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const ROOT=process.argv[2]||'.',BASE=process.argv[3]||'http://localhost:8765/';
const out=join(ROOT,'experience','evidence','merge');mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const browser=await chromium.launch({channel:'chrome',headless:true}).catch(()=>chromium.launch({headless:true}));
const ctx=await browser.newContext({viewport:{width:1366,height:768}});
await ctx.addInitScript(()=>{try{localStorage.setItem('gtp-auto-speed','2')}catch{}});
const page=await ctx.newPage();
const errs=[];page.on('console',m=>{if(m.type()==='error'&&(m.location()?.url||'').startsWith(new URL(BASE).origin))errs.push(m.text().slice(0,200))});
page.on('pageerror',e=>errs.push('pageerror '+e.message));
await page.goto(BASE,{waitUntil:'load'});await sleep(800);
const sel='.c6-ad__play,.cx-embed__play,.c15-ad__play,.c15-live__load';
const handles=await page.$$(sel);
const embeds=[];
for(let i=0;i<handles.length;i++){
  const btn=handles[i];
  const scene=await btn.evaluate(b=>b.closest('.scene')?.dataset.scene);
  await page.evaluate(id=>{location.hash='#'+id+'-50'},scene);await sleep(500);
  const before=new Set(page.frames());
  await btn.evaluate(b=>b.click());
  let frame=null;const t0=Date.now();
  while(Date.now()-t0<20000){frame=page.frames().find(f=>!before.has(f)&&f.url()&&f.url()!=='about:blank');if(frame)break;await sleep(200)}
  let title='',url=frame?.url()||'',ok=false;
  if(frame){try{await frame.waitForLoadState('domcontentloaded',{timeout:20000});title=(await frame.title()).slice(0,80);ok=true}catch(e){title='ERR '+e.message.slice(0,60)}}
  const shot=`embed-${String(i+1).padStart(2,'0')}-scene${scene}.png`;
  const el=await page.$$('iframe');await el[el.length-1]?.scrollIntoViewIfNeeded().catch(()=>{});await sleep(1500);
  await page.screenshot({path:join(out,shot)});
  embeds.push({scene,url,ok,title,shot});console.log('embed',scene,ok,url.slice(0,70),title);
}
// Slow-hold probe, in a fresh page so no embed click holds the engine.
await page.close();
const page2=await ctx.newPage();page2.on('pageerror',e=>errs.push('pageerror '+e.message));
await page2.goto(BASE,{waitUntil:'load'});await sleep(800);
const probe=[];
for(const id of ['06','08','01','11','15']){
  await page2.evaluate(h=>{location.hash=h},`#${id}-97`);
  const samples=[];const t0=Date.now();
  while(Date.now()-t0<40000){const s=await page2.evaluate(()=>({state:document.getElementById('autoStatus').dataset.state,label:document.getElementById('autoStatusText').textContent,y:Math.round(scrollY),max:document.documentElement.scrollHeight-innerHeight,scene:document.body.dataset.scene}));samples.push(s);if(s.state==='waiting')break;await sleep(2000)}
  probe.push({id,ms:Date.now()-t0,last:samples.at(-1),first:samples[0],n:samples.length});console.log('probe',id,Date.now()-t0,JSON.stringify(samples[0]),JSON.stringify(samples.at(-1)));
}
writeFileSync(join(out,'embeds-and-holds.json'),JSON.stringify({embeds,probe,consoleErrors:errs},null,1));
console.log('consoleErrors',errs.length,errs.slice(0,5));
await browser.close();

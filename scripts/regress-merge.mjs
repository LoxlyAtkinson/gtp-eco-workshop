// Merge regression (2026-10-28): every scene's hold + Next restart, console
// errors, media and embeds, at 1366x768 and 390x844. Own headless browser.
// node scripts/regress-merge.mjs <root> [base]
import {chromium} from 'playwright-core';
import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';

const ROOT=process.argv[2]||'.';
const BASE=process.argv[3]||'http://localhost:8765/';
const out=join(ROOT,'experience','evidence','merge');
mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report={base:BASE,at:new Date().toISOString(),viewports:{}};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']}).catch(()=>chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']}));

for(const [name,vp] of [['desktop',{width:1366,height:768}],['phone',{width:390,height:844}]]){
  const ctx=await browser.newContext({viewport:vp,deviceScaleFactor:1});
  await ctx.addInitScript(()=>{try{localStorage.setItem('gtp-auto-speed','2')}catch{}});
  const page=await ctx.newPage();
  const consoleErrors=[],thirdParty=[],badResponses=[],failed=[];
  const origin=new URL(BASE).origin;
  page.on('console',m=>{if(m.type()!=='error')return;const u=m.location()?.url||'';const e={text:m.text().slice(0,300),url:u};(u&&!u.startsWith(origin)?thirdParty:consoleErrors).push(e)});
  page.on('pageerror',e=>consoleErrors.push({text:'pageerror: '+String(e.message).slice(0,300)}));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
  page.on('requestfailed',r=>{if(r.url().startsWith(origin))failed.push({url:r.url(),err:r.failure()?.errorText})});
  await page.goto(BASE,{waitUntil:'load'});
  await sleep(1200);
  const st=()=>page.evaluate(()=>({state:document.getElementById('autoStatus').dataset.state,y:scrollY,scene:document.body.dataset.scene,label:document.getElementById('autoStatusText').textContent}));
  // Scene 01 arrival on load + Space pause/resume.
  const a0=await st();await sleep(1000);const a1=await st();
  const open={state:a1.state,moved:a1.y-a0.y};
  await page.keyboard.press('Space');await sleep(300);const p1=await st();
  await page.keyboard.press('Space');await sleep(1000);const p2=await st();
  open.spacePause=p1.state;open.spaceResume=p2.state;
  const scenes=[];
  for(let n=1;n<=15;n++){
    const id=String(n).padStart(2,'0');
    const row={scene:id};
    // A fresh load per scene: the deep link lands at 97% of the scene, then the engine runs to the hold.
    // 60 s: landing in scene 12 auto-loads the live oryzo.ai frame (third party), which can hold 'load' past 30 s.
    await page.goto(`${BASE}?s=${id}#${id}-97`,{waitUntil:'load',timeout:60000});
    const t0=Date.now();let s;
    do{await sleep(250);s=await st()}while(s.state!=="waiting"&&Date.now()-t0<20000);
    row.holdState=s.state;row.holdAfterMs=Date.now()-t0;row.holdScene=s.scene;
    // Ambient motion during the hold: count running animations in the scene.
    row.holdAnimations=await page.evaluate(id=>{const sc=document.querySelector(`.scene[data-scene="${id}"]`);return document.getAnimations().filter(a=>a.playState==='running'&&sc.contains(a.effect?.target)).length+(window.gsap?window.gsap.globalTimeline.getChildren(true,true,false).filter(t=>t.isActive()&&t.targets?.().some(x=>x instanceof Element&&sc.contains(x))).length:0)},id);
    await page.screenshot({path:join(out,`${name}-${id}-hold.png`)});
    if(n<15){
      const y0=s.y;
      await page.click('#nextButton');
      const c0=Date.now();let first=null;
      while(Date.now()-c0<1000){const q=await st();if(Math.abs(q.y-y0)>2&&['jumping','running'].includes(q.state)){first=Date.now()-c0;break}await sleep(50)}
      await sleep(Math.max(0,1500-(Date.now()-c0)));
      const b1=await st();await sleep(1000);const b2=await st();
      row.next={motionStartMs:first,landedScene:b2.scene,expected:String(n+1).padStart(2,'0'),state:b2.state,autoScrollPx:Math.round(b2.y-b1.y)};
      row.next.pass=first!==null&&b2.scene===row.next.expected&&b2.state==='running'&&b2.y-b1.y>0;
      await page.screenshot({path:join(out,`${name}-${row.next.expected}-arrival.png`)});
    }
    // Media in this scene.
    row.media=await page.evaluate(id=>{const sc=document.querySelector(`.scene[data-scene="${id}"]`);
      const vids=[...sc.querySelectorAll('video')].map(v=>({src:(v.currentSrc||v.getAttribute('src')||v.querySelector('source')?.getAttribute('src')||'').split('/').pop(),ready:v.readyState,err:v.error?.code||0,paused:v.paused}));
      const imgs=[...sc.querySelectorAll('img[src*="assets/gen/"],image[href*="assets/gen/"]')].map(i=>({src:(i.getAttribute('src')||i.getAttribute('href')).split('/').pop(),ok:i.tagName==='IMG'?(i.complete&&i.naturalWidth>0):true,loading:i.loading||''}));
      return {vids,imgs}},id);
    scenes.push(row);
    console.log(name,id,row.holdState,row.holdAfterMs,row.next?JSON.stringify(row.next):'last');
  }
  // Force every video to load, then check readiness.
  const videos=await page.evaluate(async()=>{const vs=[...document.querySelectorAll('video')].filter(v=>v.getAttribute('src')||v.querySelector('source[src]')||v.currentSrc);
    await Promise.all(vs.map(v=>new Promise(res=>{if(v.readyState>=2)return res();v.preload='auto';v.addEventListener('loadeddata',res,{once:true});v.addEventListener('error',res,{once:true});setTimeout(res,8000);try{v.load()}catch{res()}})));
    return vs.map(v=>({scene:v.closest('.scene')?.dataset.scene,src:(v.currentSrc||'').split('/').pop(),ready:v.readyState,err:v.error?.code||0}))});
  // Lazy images that never entered the viewport: load them now and check.
  const images=await page.evaluate(async()=>{const is=[...document.querySelectorAll('img[src*="assets/gen/"]')];is.forEach(i=>i.loading='eager');
    await Promise.all(is.map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,6000)})));
    return is.map(i=>({scene:i.closest('.scene')?.dataset.scene,src:i.getAttribute('src').split('/').pop(),ok:i.naturalWidth>0}))});
  let embeds=null;
  if(name==='desktop'){
    embeds=await page.evaluate(async()=>{const sel='.c6-ad__play,.cx-embed__play,.c15-ad__play,.c15-live__load';
      const btns=[...document.querySelectorAll(sel)];const before=new Set(document.querySelectorAll('iframe'));
      btns.forEach(b=>b.click());
      const frames=[...document.querySelectorAll('iframe')].filter(f=>!before.has(f));
      const loaded=await Promise.all(frames.map(f=>new Promise(r=>{let done=false;f.addEventListener('load',()=>{done=true;r(true)},{once:true});setTimeout(()=>r(done),12000)})));
      return {buttons:btns.length,frames:frames.map((f,i)=>({src:f.src,loaded:loaded[i],w:f.offsetWidth,h:f.offsetHeight}))}});
    await page.keyboard.press('Escape');
  }
  report.viewports[name]={viewport:vp,open,scenes,videos,images,embeds,consoleErrors,thirdPartyConsole:thirdParty.slice(0,30),thirdPartyCount:thirdParty.length,badResponses,failed};
  await ctx.close();
}
await browser.close();
writeFileSync(join(out,'regression.json'),JSON.stringify(report,null,1));
for(const [k,v] of Object.entries(report.viewports)){
  const passNext=v.scenes.filter(s=>s.next).filter(s=>s.next.pass).length;
  const holds=v.scenes.filter(s=>s.holdState==='waiting').length;
  console.log(`${k}: open=${JSON.stringify(v.open)} holds=${holds}/15 nextPass=${passNext}/14 consoleErrors=${v.consoleErrors.length} 4xx=${v.badResponses.length} failed=${v.failed.length} videosNotReady=${v.videos.filter(x=>x.ready<2).length}/${v.videos.length} imagesBad=${v.images.filter(x=>!x.ok).length}/${v.images.length} embeds=${v.embeds?v.embeds.frames.filter(f=>f.loaded).length+'/'+v.embeds.frames.length+' of '+v.embeds.buttons:'n/a'}`);
}

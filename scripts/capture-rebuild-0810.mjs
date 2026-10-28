import {chromium} from 'playwright-core';
import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';

const ROOT=process.argv[2];
const BASE=process.argv[3]||'http://127.0.0.1:8773/';
const ONLY=process.argv[4]||'all';
const out=join(ROOT,'experience','evidence','rebuild-0810');
mkdirSync(out,{recursive:true});
const beats={
  '08':[['08-1',.03],['08-2',.13],['08-3',.345],['08-4',.455],['08-5',.52],['08-6',.585],['08-7',.72],['08-8',.80],['08-9',.865],['08-10',.93]],
  '09':[['09-1',.03],['09-2',.066],['09-3',.096],['09-4',.127],['09-5',.195],['09-6',.27],['09-7',.338],['09-8',.45],['09-9',.565],['09-10',.63],['09-11',.675],['09-12',.72],['09-13',.78],['09-14',.86],['09-15',.93]],
  '10':[['10-1',.06],['10-2',.26],['10-3',.6],['10-4',.78],['10-5',.93]]
};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report={beats:[],motion:[],errors:[]};
for(const viewport of [{width:1366,height:768,label:'1366'},{width:390,height:844,label:'390'}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'no-preference',deviceScaleFactor:1});
  const page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(`${viewport.label} pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(`${viewport.label} console: ${m.text()}`)});
  const state=()=>page.evaluate(()=>({scene:document.body.dataset.scene,y:Math.round(scrollY),auto:document.getElementById('autoStatus').dataset.state,label:document.getElementById('autoStatusText').textContent}));
  if(ONLY==='all'||ONLY==='beats'){
    await page.goto(BASE+'#08',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.evaluate(()=>{if(document.getElementById('autoStatus').dataset.state==='running')document.getElementById('motionButton').click()});
    for(const [scene,list] of Object.entries(beats)){
      for(const [id,p] of list){
        await page.evaluate(([scene,p])=>{const s=document.querySelector(`.scene[data-scene="${scene}"]`);const top=s.getBoundingClientRect().top+scrollY;scrollTo({top:top+(s.offsetHeight-innerHeight)*p,behavior:'instant'})},[scene,p]);
        await page.waitForTimeout(1600);
        const file=`${viewport.label}-${id}.png`;
        await page.screenshot({path:join(out,file)});
        const st=await state();
        report.beats.push({viewport:viewport.label,beat:id,p,file,scene:st.scene});
      }
    }
  }
  if(ONLY==='all'||ONLY==='motion'){
    // Arrival via Next from 07, the hold with ambient motion, Next restarts motion, for 08, 09 and 10.
    await page.goto(BASE+'#07',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1200);
    for(const [from,to] of [['07','08'],['08','09'],['09','10'],['10','11']]){
      if(from!=='07'){
        // Jump near the end of the scene; the engine keeps running and stops at the hold.
        await page.evaluate(scene=>{const s=document.querySelector(`.scene[data-scene="${scene}"]`);const top=s.getBoundingClientRect().top+scrollY;scrollTo({top:top+(s.offsetHeight-innerHeight)*.985,behavior:'instant'})},from);
        let st=await state();
        for(let i=0;i<40&&st.auto!=='waiting';i++){await page.waitForTimeout(250);st=await state()}
        const amb=async()=>page.evaluate(scene=>{const s=document.querySelector(`.scene[data-scene="${scene}"]`);const el=s.querySelector(scene==='10'?'.cx10-post':'.cx-glow');return getComputedStyle(el).transform},from);
        const a1=await amb();await page.waitForTimeout(1200);const a2=await amb();
        await page.screenshot({path:join(out,`${viewport.label}-hold-${from}.png`)});
        report.motion.push({viewport:viewport.label,check:`hold ${from}`,state:st,ambientMoved:a1!==a2,a1,a2});
      }
      if(to==='11')break;
      const before=await state();
      await page.getByRole('button',{name:/^Next/}).click();
      await page.waitForTimeout(450);
      await page.screenshot({path:join(out,`${viewport.label}-arrive-${to}-a.png`)});
      await page.waitForTimeout(900);
      const s1=await state();
      await page.screenshot({path:join(out,`${viewport.label}-arrive-${to}-b.png`)});
      await page.waitForTimeout(2500);
      const s2=await state();
      report.motion.push({viewport:viewport.label,check:`Next ${from}->${to}`,before,afterLand:s1,after3s:s2,moving:s2.scene===to&&s2.y>s1.y&&s2.auto==='running'});
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(out,ONLY==='all'?'capture-report.json':`capture-report-${ONLY}.json`),JSON.stringify(report,null,2));
console.log(JSON.stringify({beats:report.beats.length,motion:report.motion.map(m=>({v:m.viewport,c:m.check,ok:m.moving??m.ambientMoved,st:(m.after3s||m.state)})),errors:report.errors.slice(0,12)},null,1));

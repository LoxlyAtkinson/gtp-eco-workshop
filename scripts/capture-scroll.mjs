import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root=process.cwd();
const out=join(root,'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-build');
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
const selected=process.env.GTP_SCENES?.split(',').map(Number).filter(Number.isInteger);
const beats=process.env.GTP_BEATS?.split(',').map(Number).filter(value=>Number.isFinite(value)&&value>=0&&value<=1)||[0,.5,.9];
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-features=OverscrollHistoryNavigation']});
const observations=[];
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1,reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.scene-handoff--after-14').waitFor({state:'attached',timeout:10000});
  await page.evaluate(()=>document.fonts.ready);
  // Presenter pause makes each requested scrub beat stable while screenshots render.
  await page.locator('#motionButton').click();
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  for(let n=1;n<=15;n++){
    if(selected?.length&&!selected.includes(n))continue;
    for(const p of beats){
      let aligned=false;
      for(let attempt=0;attempt<8;attempt++){
        await page.evaluate(({n,p})=>{const s=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);const travel=Math.max(0,s.offsetHeight-innerHeight);scrollTo({top:s.getBoundingClientRect().top+scrollY+p*travel,behavior:'instant'});},{n,p});
        await page.waitForTimeout(500);
        const observed=await page.evaluate(n=>Number(document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`).style.getPropertyValue('--p')),n);
        if(Math.abs(observed-p)<=.02){aligned=true;break}
      }
      if(!aligned)throw new Error(`Could not settle ${viewport.label} scene ${n} at beat ${p}`);
      // The presentation writes a shareable beat hash 320 ms after scrolling stops.
      // Wait for that public URL state so the captured frame and route describe the same scene.
      await page.waitForFunction(({n})=>{
        const beat=/^#(\d{2})-(\d{2})$/.exec(location.hash);
        const scene=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);
        const observed=Number(scene.style.getPropertyValue('--p'));
        return beat&&Number(beat[1])===n&&Math.abs(Number(beat[2])-observed*100)<=3;
      },{n},{timeout:3000}).catch(async error=>{
        const state=await page.evaluate(()=>({route:location.hash,scrollY,active:document.body.dataset.scene}));
        throw new Error(`Hash wait failed for ${viewport.label} scene ${n} beat ${p}: ${JSON.stringify(state)}; ${error.message}`);
      });
      const data=await page.evaluate(({n,p})=>{const s=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`),h=s.querySelector('h1,h2'),footer=document.querySelector('.deck-controls');return {scene:n,progress:p,route:location.hash,scrollY,observedProgress:Number(s.style.getPropertyValue('--p')),viewport:{width:innerWidth,height:innerHeight},horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,heading:h.getBoundingClientRect().toJSON(),footer:footer.getBoundingClientRect().toJSON(),stage:s.querySelector('.scene__stage').getBoundingClientRect().toJSON()};},{n,p});
      const file=`${viewport.label}-${String(n).padStart(2,'0')}-${String(Math.round(p*100)).padStart(2,'0')}.png`;
      await page.screenshot({path:join(out,file)});
      observations.push({...data,file,errors:[...errors]});
    }
  }
  await page.close();
}
writeFileSync(join(out,'browser-log.json'),JSON.stringify(observations,null,2));
await browser.close();
console.log(JSON.stringify({captures:observations.length,errors:observations.filter(x=>x.errors.length).length,overflow:observations.filter(x=>x.horizontalOverflow>1).length,output:out}));

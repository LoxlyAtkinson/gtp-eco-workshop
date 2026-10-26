import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-handoffs');
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const records=[];
for(const viewport of [{label:'projector',width:1366,height:768},{label:'phone',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(new URL('#01',base).href,{waitUntil:'networkidle'});
  await page.locator('.scene-handoff--after-14').waitFor({state:'attached',timeout:10000});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  const count=await page.locator('.scene-bridge,.scene-handoff').count();
  if(count!==14)throw new Error(`Expected 14 handoffs at ${viewport.label}, found ${count}`);
  for(let i=0;i<count;i++){
    for(const progress of [0,.5,.9]){
      await page.evaluate(({i,progress})=>{
        const el=document.querySelectorAll('.scene-bridge,.scene-handoff')[i];
        const travel=Math.max(1,el.offsetHeight-innerHeight);
        scrollTo({top:el.getBoundingClientRect().top+scrollY+travel*progress,behavior:'instant'});
      },{i,progress});
      await page.waitForTimeout(90);
      const observed=await page.evaluate(i=>{
        const el=document.querySelectorAll('.scene-bridge,.scene-handoff')[i];
        const stage=el.querySelector('.scene-bridge__stage,.scene-handoff__stage').getBoundingClientRect();
        const visible=[...el.querySelectorAll('.bridge__receipt,.bridge__product,.bridge__result,.handoff-card')].filter(x=>Number(getComputedStyle(x).opacity)>.25).map(x=>({kind:x.className,box:x.getBoundingClientRect().toJSON()}));
        return {label:el.getAttribute('aria-label'),kind:el.className,progress:Number(el.style.getPropertyValue('--p')),stage:stage.toJSON(),visible,horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,viewport:{width:innerWidth,height:innerHeight},route:location.hash};
      },i);
      const file=`${viewport.label}-${String(i+1).padStart(2,'0')}-${String(Math.round(progress*100)).padStart(2,'0')}.png`;
      await page.screenshot({path:join(out,file)});
      records.push({...observed,file,errors:[...errors]});
    }
  }
  await page.close();
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(records,null,2));
const clipped=records.filter(x=>x.visible.some(item=>item.box.x<-1||item.box.x+item.box.width>x.viewport.width+1));
console.log(JSON.stringify({captures:records.length,clipped:clipped.map(x=>x.file),pageErrors:records.filter(x=>x.errors.length).length,horizontalOverflow:records.filter(x=>x.horizontalOverflow>1).length,out}));

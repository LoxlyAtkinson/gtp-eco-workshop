import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'auto-all-scenes-local');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  const page=await browser.newPage({viewport,reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2000);
  for(let n=1;n<=15;n++){
    await page.evaluate(n=>{const s=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);scrollTo({top:s.getBoundingClientRect().top+scrollY,behavior:'instant'})},n);
    await page.waitForTimeout(250);
    const before=await page.evaluate(()=>scrollY);
    await page.waitForTimeout(1450);
    const after=await page.evaluate(()=>({scrollY,scene:document.body.dataset.scene,hash:location.hash}));
    rows.push({viewport:viewport.label,scene:n,before,after,delta:after.scrollY-before,pass:after.scene===String(n).padStart(2,'0')&&after.scrollY-before>1,errors:[...errors]});
  }
  for(let n=1;n<=15;n++){
    const target=await page.evaluate(n=>{
      const scene=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);
      const next=document.querySelector(`.scene[data-scene="${String(n+1).padStart(2,'0')}"]`);
      const top=scene.getBoundingClientRect().top+scrollY;
      const end=top+Math.max(0,scene.offsetHeight-innerHeight)*.92;
      const nextTop=next?next.getBoundingClientRect().top+scrollY:Infinity;
      return next?Math.max(end,nextTop-innerHeight*.88):end;
    },n);
    await page.evaluate(target=>scrollTo({top:target-4,behavior:'instant'}),target);
    await page.waitForTimeout(300);
    const near=await page.evaluate(()=>scrollY);
    await page.waitForTimeout(1800);
    const hold=await page.evaluate(n=>({scrollY,scene:document.body.dataset.scene,nextTop:document.querySelector(`.scene[data-scene="${String(n+1).padStart(2,'0')}"]`)?.getBoundingClientRect().top??null}),n);
    rows.push({viewport:viewport.label,scene:`${String(n).padStart(2,'0')}-handoff-hold`,target,before:near,after:hold,delta:hold.scrollY-near,pass:hold.scene===String(n).padStart(2,'0')&&Math.abs(hold.scrollY-near)<5&&(hold.nextTop===null||hold.nextTop>viewport.height*.84),errors:[...errors]});
  }
  for(const n of [5,12]){
    await page.evaluate(n=>{const scene=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);scrollTo({top:scene.getBoundingClientRect().top+scrollY+Math.max(0,scene.offsetHeight-innerHeight)*.25,behavior:'instant'})},n);
    await page.waitForTimeout(250);
    await page.locator('#motionButton').click();
    const pausedAt=await page.evaluate(()=>scrollY);
    await page.waitForTimeout(1200);
    const pausedEnd=await page.evaluate(()=>scrollY);
    await page.locator('#motionButton').click();
    await page.waitForTimeout(1200);
    const resumed=await page.evaluate(()=>scrollY);
    rows.push({viewport:viewport.label,scene:`${String(n).padStart(2,'0')}-pause-resume`,before:pausedAt,after:{pausedEnd,resumed},pass:Math.abs(pausedEnd-pausedAt)<2&&resumed>pausedEnd+2,errors:[...errors]});
  }
  await page.close();
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await reduced.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
const before=await reduced.evaluate(()=>scrollY);
await reduced.waitForTimeout(2700);
const after=await reduced.evaluate(()=>scrollY);
rows.push({viewport:'phone-reduced',scene:1,before,after,delta:after-before,pass:Math.abs(after-before)<2,errors:[]});
await reduced.close();
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
const failed=rows.filter(row=>!row.pass||row.errors.length);
console.log(JSON.stringify({checks:rows.length,failed,out}));
if(failed.length)process.exitCode=1;

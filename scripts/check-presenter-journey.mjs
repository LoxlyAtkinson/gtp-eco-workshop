import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'presenter-journey-local');
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
async function record(page,label,expected,actual,pass){
  const file=`${label}.png`;
  await page.screenshot({path:join(out,file)});
  rows.push({label,result:pass?'PASS':'FAIL',expected,actual,route:await page.evaluate(()=>location.hash),viewport:page.viewportSize(),file,timestamp:new Date().toISOString()});
}
for(const viewport of [{label:'projector',width:1366,height:768},{label:'phone',width:390,height:844}]){
  const page=await browser.newPage({viewport,hasTouch:viewport.label==='phone'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`${base}#01`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1850);
  if(viewport.label==='phone'){
    const box=await page.locator('#nextButton').boundingBox();
    await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);
  }else await page.locator('#nextButton').click();
  await page.waitForTimeout(1700);
  const next=await page.evaluate(()=>({scene:document.body.dataset.scene,hash:location.hash}));
  await record(page,`${viewport.label}-next`,'Next reaches scene 02',next,next.scene==='02');
  await page.locator('#prevButton').click();
  await page.waitForTimeout(1700);
  const back=await page.evaluate(()=>({scene:document.body.dataset.scene,hash:location.hash}));
  await record(page,`${viewport.label}-back`,'Back reaches scene 01',back,back.scene==='01');

  await page.goto(`${base}#07-20`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1200);
  await page.evaluate(()=>{const scene=document.querySelector('.scene[data-scene="07"]');scrollTo({top:scene.getBoundingClientRect().top+scrollY+Math.max(0,scene.offsetHeight-innerHeight)*.2,behavior:'instant'})});
  await page.waitForTimeout(450);
  await page.evaluate(()=>document.activeElement?.blur());
  const before=await page.evaluate(()=>scrollY);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(950);
  const forward=await page.evaluate(()=>scrollY);
  await record(page,`${viewport.label}-arrow-forward`,'ArrowRight advances native scroll',{before,forward},forward>before+30);
  await page.keyboard.press('PageUp');
  await page.waitForTimeout(950);
  const reverse=await page.evaluate(()=>scrollY);
  await record(page,`${viewport.label}-pageup`,'PageUp reverses native scroll',{forward,reverse},reverse<forward-30);

  await page.goto(`${base}#12-50`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1200);
  const restored=await page.evaluate(()=>({hash:location.hash,scene:document.body.dataset.scene,beat:Number(document.querySelector('.scene[data-scene="12"]').style.getPropertyValue('--p'))}));
  await record(page,`${viewport.label}-beat-reload`,'Direct #12-50 restores the interaction scene near its midpoint',restored,restored.scene==='12'&&Math.abs(restored.beat-.5)<.08);

  await page.goto(`${base}#05-20`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1300);
  await page.mouse.wheel(0,Math.min(300,viewport.height*.35));
  await page.waitForTimeout(900);
  const manualAt=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(1400);
  const manualEnd=await page.evaluate(()=>scrollY);
  await record(page,`${viewport.label}-manual-takeover`,'User scroll defers automatic movement',{manualAt,manualEnd},Math.abs(manualEnd-manualAt)<5);
  rows.push({label:`${viewport.label}-page-errors`,result:errors.length?'FAIL':'PASS',expected:'No page errors',actual:errors,viewport:page.viewportSize(),timestamp:new Date().toISOString()});
  await page.close();

  const blocked=await browser.newPage({viewport});
  await blocked.route('**/assets/*',route=>route.abort());
  await blocked.goto(`${base}#05-50`,{waitUntil:'networkidle'});
  await blocked.waitForTimeout(1300);
  const ad=await blocked.evaluate(()=>({fallback:document.querySelector('.ad-device')?.classList.contains('media-failed'),copy:document.querySelector('[data-ad-panel="vertical"]')?.textContent||''}));
  await record(blocked,`${viewport.label}-ad-media-failed`,'Fallback retains offer, CTA and destination when assets fail',ad,ad.fallback&&/CTA: Get a lunch suggestion/.test(ad.copy)&&/Destination:/.test(ad.copy));
  await blocked.goto(`${base}#12-50`,{waitUntil:'networkidle'});
  await blocked.waitForTimeout(1000);
  const site=await blocked.evaluate(()=>({buttons:[...document.querySelectorAll('.mock-actions button')].map(x=>x.textContent.trim()),title:document.querySelector('.mock-hero h3')?.textContent.trim()}));
  await record(blocked,`${viewport.label}-site-media-failed`,'Website actions remain legible without image assets',site,site.buttons.length===2&&/Feed the team/.test(site.title));
  await blocked.goto(`${base}#13-50`,{waitUntil:'networkidle'});
  await blocked.waitForTimeout(1000);
  const taste=await blocked.evaluate(()=>({draft:document.querySelector('.taste-demo__raw')?.textContent.trim(),final:document.querySelector('.taste-demo__final')?.textContent.trim()}));
  await record(blocked,`${viewport.label}-taste-media-failed`,'Draft failure and checked ad remain explained without video',taste,/WRONG PRODUCT/.test(taste.draft)&&/Ask for a quote/.test(taste.final));
  await blocked.close();

  const reduced=await browser.newPage({viewport,reducedMotion:'reduce'});
  await reduced.goto(`${base}#05`,{waitUntil:'networkidle'});
  await reduced.waitForTimeout(1200);
  const still=await reduced.evaluate(()=>scrollY);
  await reduced.waitForTimeout(1500);
  const later=await reduced.evaluate(()=>({scrollY,copy:document.querySelector('[data-ad-panel="feed"]')?.textContent||''}));
  await record(reduced,`${viewport.label}-reduced-motion`,'Reduced motion stops automatic movement and keeps ad copy',{still,later},Math.abs(later.scrollY-still)<2&&/Ask for a quote/.test(later.copy));
  await reduced.close();
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
const failed=rows.filter(row=>row.result!=='PASS');
console.log(JSON.stringify({checks:rows.length,failed:failed.map(x=>x.label),out}));
if(failed.length)process.exitCode=1;

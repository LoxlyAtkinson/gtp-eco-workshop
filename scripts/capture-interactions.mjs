import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-repair');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const log=[];
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
async function save(page,label){
  await page.waitForTimeout(520);
  const state=await page.evaluate(()=>({route:location.hash,viewport:{width:innerWidth,height:innerHeight},scrollY,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,scene:document.body.dataset.scene,selectedAd:document.querySelector('[data-ad][aria-pressed="true"]')?.getAttribute('data-ad')||null,promptOpen:document.querySelector('.taste-prompt')?.open||false,visibleBridge:[...document.querySelectorAll('.scene-bridge')].map(el=>({name:el.className,rect:el.getBoundingClientRect()})).filter(({rect})=>rect.bottom>70&&rect.top<innerHeight-70).map(({name})=>name),visibleScene:[...document.querySelectorAll('.scene[data-scene]')].map(el=>({name:el.dataset.scene,rect:el.getBoundingClientRect()})).filter(({rect})=>rect.bottom>70&&rect.top<innerHeight-70).map(({name})=>name)}));
  await page.screenshot({path:join(out,`${label}.png`)});
  log.push({label,...state});
}
async function scene(page,n){
  await page.goto(`${base}#${String(n).padStart(2,'0')}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(n=>{document.documentElement.style.scrollBehavior='auto';const target=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);scrollTo({top:target.getBoundingClientRect().top+scrollY,behavior:'instant'})},n);
  await page.waitForTimeout(250);
}
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await scene(page,3);
  await page.locator('#evidenceReveal').click();
  await save(page,`${viewport.label}-03-revealed`);
  if(viewport.label==='projector')await page.evaluate(()=>{const el=document.querySelector('.scene[data-scene="03"]');const travel=Math.max(1,el.offsetHeight-innerHeight);scrollTo({top:el.getBoundingClientRect().top+scrollY+travel*.98,behavior:'instant'})});
  else await page.evaluate(()=>scrollBy({top:Math.min(innerHeight*.5,400),behavior:'instant'}));
  await save(page,`${viewport.label}-03-revealed-hold`);
  await scene(page,5);
  for(const kind of ['feed','vertical','search']){
    await page.locator(`[data-ad="${kind}"]`).click();
    await save(page,`${viewport.label}-05-${kind}`);
    await page.locator(`[data-ad-panel="${kind}"] small`).scrollIntoViewIfNeeded();
    await save(page,`${viewport.label}-05-${kind}-copy`);
  }
  await scene(page,6);
  await page.locator('#voiceRewrite').click();
  await save(page,`${viewport.label}-06-applied`);
  await scene(page,9);
  await page.locator('[data-reply="vague"]').click();
  await save(page,`${viewport.label}-09-vague`);
  await scene(page,12);
  await page.locator('[data-mock="menu"]').first().click();
  await save(page,`${viewport.label}-12-menu`);
  await page.locator('[data-mock="quote"]').first().click();
  await save(page,`${viewport.label}-12-quote`);
  await page.locator('.mock-quote input[name="date"]').fill('2026-11-04');
  await page.locator('.mock-quote input[name="guests"]').fill('20');
  await page.locator('.mock-quote select[name="dietary"]').selectOption('Vegetarian options');
  await page.locator('.mock-quote button[type="submit"]').click();
  await page.locator('#mockQuoteResult').scrollIntoViewIfNeeded();
  await page.evaluate(()=>{const box=document.getElementById('mockQuoteResult').getBoundingClientRect();if(box.bottom>innerHeight-90)scrollBy({top:box.bottom-(innerHeight-110),behavior:'instant'})});
  await save(page,`${viewport.label}-12-preview`);
  await page.locator('#mockReplyJump').click();
  await page.waitForTimeout(1900);
  await save(page,`${viewport.label}-09-reply-handoff`);
  await page.locator('#sampleInquiry').scrollIntoViewIfNeeded();
  await save(page,`${viewport.label}-09-reply-handoff-hold`);
  if(viewport.label==='phone'){
    await scene(page,1);
    await page.locator('#motionButton').click();
    await save(page,'phone-01-paused');
  }
  for(const kind of ['customer','voice','attract']){
    await page.evaluate(kind=>{const el=document.querySelector(`.scene-bridge--${kind}`);const travel=Math.max(1,el.offsetHeight-innerHeight);scrollTo({top:el.getBoundingClientRect().top+scrollY+.55*travel,behavior:'instant'})},kind);
    await save(page,`${viewport.label}-bridge-${kind}`);
  }
  await scene(page,13);
  await page.locator('.taste-prompt summary').click();
  await page.locator('.taste-prompt__body').scrollIntoViewIfNeeded();
  await save(page,`${viewport.label}-13-prompt-open`);
  await page.locator('.taste-prompt li:last-child').scrollIntoViewIfNeeded();
  if(viewport.label==='phone')await page.evaluate(()=>scrollBy({top:150,behavior:'instant'}));
  await save(page,`${viewport.label}-13-checklist-hold`);
  log.push({label:`${viewport.label}-errors`,errors});
  await page.close();
}
const blocked=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
await blocked.route('**/assets/*',route=>route.abort());
await scene(blocked,5);
await save(blocked,'projector-05-media-fallback');
await blocked.close();
const reduced=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
await scene(reduced,5);
await save(reduced,'projector-05-reduced-motion');
await reduced.close();
const printPage=await browser.newPage({viewport:{width:1366,height:768}});
await printPage.goto(base,{waitUntil:'networkidle'});
await printPage.pdf({path:join(out,'print.pdf'),format:'A4',printBackground:true});
await printPage.close();
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(log,null,2));
console.log(JSON.stringify({captures:log.filter(x=>x.viewport).length,errors:log.filter(x=>x.errors?.length),overflow:log.filter(x=>x.overflow>1).length,output:out}));

import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-final-controls');
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
function record(label,pass,details){rows.push({label,result:pass?'PASS':'FAIL',details});if(!pass)console.error(label,details)}
async function scene(page,n){const url=new URL(base);url.searchParams.set('control-scene',String(n));url.hash=String(n).padStart(2,'0');await page.goto(url.href,{waitUntil:'networkidle'});try{await page.waitForFunction(value=>document.body.dataset.scene===value,String(n).padStart(2,'0'),{timeout:2500})}catch{const actual=await page.evaluate(()=>({scene:document.body.dataset.scene,hash:location.hash,scrollY,target:document.querySelector(`.scene[data-scene="${location.hash.slice(1)}"]`)?.getBoundingClientRect().toJSON()}));record(`direct-hash-${n}`,false,actual)}}
for(const viewport of [{label:'projector',width:1366,height:768},{label:'phone',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await scene(page,3);
  let focused=false;
  for(let i=0;i<30;i++){await page.keyboard.press('Tab');if(await page.evaluate(()=>document.activeElement?.id==='evidenceReveal')){focused=true;break}}
  const focus=focused?await page.locator('#evidenceReveal').evaluate(el=>({outline:getComputedStyle(el).outlineWidth,visible:el.matches(':focus-visible')})):null;
  record(`${viewport.label}-icp-focus`,focused&&focus.visible&&parseFloat(focus.outline)>=2,{focused,focus});
  if(focused){await page.keyboard.press('Enter');record(`${viewport.label}-icp-keyboard`,await page.locator('#evidenceReveal').getAttribute('aria-expanded')==='true',{})}
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('#actualOrders')?.scrollIntoView({block:'center',behavior:'instant'})});
  await page.waitForFunction(()=>{const r=document.querySelector('#actualOrders')?.getBoundingClientRect();return r&&r.bottom>70&&r.top<innerHeight-74});
  await page.screenshot({path:join(out,`${viewport.label}-icp-keyboard.png`)});
  await scene(page,10);
  await page.locator('[data-metric="inquiries"]').click();
  const metric=await page.locator('#metricFeedback').innerText();
  record(`${viewport.label}-metric-choice`,metric.includes('qualified inquiries'),{metric});
  await page.screenshot({path:join(out,`${viewport.label}-metric.png`)});
  await page.locator('#overviewButton').click();
  record(`${viewport.label}-overview-open`,await page.locator('#overviewDialog').evaluate(el=>el.open),{});
  await page.keyboard.press('Escape');
  record(`${viewport.label}-overview-escape`,!(await page.locator('#overviewDialog').evaluate(el=>el.open)),{});
  await page.locator('#notesButton').click();
  record(`${viewport.label}-notes`,await page.locator('#notesButton').getAttribute('aria-pressed')==='true',{});
  await page.locator('#motionButton').click();
  record(`${viewport.label}-motion-paused`,await page.locator('#motionButton').getAttribute('aria-pressed')==='true',{});
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange',{bubbles:true}))});
  record(`${viewport.label}-hidden-tab`,await page.locator('body').evaluate(el=>el.classList.contains('is-page-hidden')),{});
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange',{bubbles:true}))});
  record(`${viewport.label}-visible-tab`,!(await page.locator('body').evaluate(el=>el.classList.contains('is-page-hidden'))),{});
  await scene(page,15);
  record(`${viewport.label}-direct-hash`,await page.locator('body').getAttribute('data-scene')==='15',{});
  await page.screenshot({path:join(out,`${viewport.label}-close.png`)});
  record(`${viewport.label}-no-errors`,errors.length===0,{errors});
  await page.close();
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await scene(reduced,3);
const cards=await reduced.locator('.scene-handoff--engage').first().locator('.handoff-card').evaluateAll(els=>els.map(el=>({opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform,hidden:el.getAttribute('aria-hidden')})));
record('phone-reduced-handoff',cards.length===2&&cards.every(card=>card.opacity==='1'&&card.transform==='none'&&card.hidden==='false'),{cards});
await reduced.screenshot({path:join(out,'phone-reduced-handoff.png')});
await reduced.close();
const tool=await browser.newPage({viewport:{width:390,height:844}});
await tool.goto(new URL('tool/',base).href,{waitUntil:'networkidle'});
const toolState=await tool.evaluate(()=>({disabled:document.querySelector('button[type="submit"]')?.disabled,text:document.body.innerText.slice(0,1500)}));
record('tool-preview-disabled',Boolean(toolState.disabled)&&/prepar|preview/i.test(toolState.text),toolState);
await tool.screenshot({path:join(out,'phone-tool-preview.png')});
await tool.close();
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
console.log(JSON.stringify({observations:rows.length,failed:rows.filter(row=>row.result==='FAIL'),out}));

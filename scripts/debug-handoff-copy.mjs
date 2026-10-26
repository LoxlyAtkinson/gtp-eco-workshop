import {chromium} from 'playwright-core';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1366,height:768}});
await page.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
await page.locator('.scene-handoff--after-14').waitFor({state:'attached'});
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
const rows=[];
for(const after of ['03','04','07','08'])for(const progress of [0,.5,.9]){
  const row=await page.evaluate(({after,progress})=>{const el=document.querySelector(`.scene-handoff--after-${after}`);const travel=Math.max(1,el.offsetHeight-innerHeight);scrollTo({top:el.getBoundingClientRect().top+scrollY+travel*progress,behavior:'instant'});const stage=el.querySelector('.scene-handoff__stage');const copy=el.querySelector('.scene-handoff__copy');return {after,progress,scrollY,stage:stage.getBoundingClientRect().toJSON(),copy:copy.getBoundingClientRect().toJSON(),computed:{transform:getComputedStyle(copy).transform,overflow:getComputedStyle(stage).overflow}}},{after,progress});
  await page.waitForTimeout(90);
  rows.push(row);
  if(after==='03'&&progress===.5)await page.screenshot({path:'experience/evidence/scroll-repair/debug-current-handoff-03-50.png'});
}
console.log(JSON.stringify(rows,null,2));
await browser.close();

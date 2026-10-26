import {chromium} from 'playwright-core';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
const rows=[];
for(const target of [...await page.locator('.scene,.scene-handoff,.scene-bridge').all()]){
  for(const p of [0,.25,.5,.75,.95]){
    await target.evaluate((el,p)=>{const travel=Math.max(1,el.offsetHeight-innerHeight);scrollTo({top:el.getBoundingClientRect().top+scrollY+travel*p,behavior:'instant'})},p);
    await page.waitForTimeout(75);
    const row=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scrollY,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+2&&getComputedStyle(el).position!=='fixed'&&r.width>0}).slice(0,12).map(el=>({tag:el.tagName,class:el.className,right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}))}));
    rows.push({target:await target.getAttribute('class'),p,...row});
  }
}
console.log(JSON.stringify(rows.filter(row=>row.scrollWidth>row.clientWidth),null,2));
await browser.close();

import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence','auto-refinement-frames-2026-10-27');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  for(const scene of ['01','08','15']){
    const page=await browser.newPage({viewport,reducedMotion:'no-preference'});
    await page.goto(`http://127.0.0.1:8767/#${scene}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(450);
    const start=await page.evaluate(()=>({scrollY,scene:document.body.dataset.scene,hash:location.hash}));
    await page.screenshot({path:join(out,`${viewport.label}-${scene}-opening.png`)});
    await page.waitForTimeout(1500);
    const moving=await page.evaluate(()=>({scrollY,scene:document.body.dataset.scene,hash:location.hash}));
    await page.screenshot({path:join(out,`${viewport.label}-${scene}-moving.png`)});
    rows.push({viewport,scene,start,moving,delta:moving.scrollY-start.scrollY});
    await page.close();
  }
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
console.log(JSON.stringify({captures:rows.length,deltas:rows.map(({viewport,scene,delta})=>`${viewport.label}-${scene}:${delta}`),out}));

import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'auto-next-arrivals-2026-10-27');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  const page=await browser.newPage({viewport,reducedMotion:'no-preference'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(let n=1;n<=15;n++){
    if(n>1)await page.locator('#nextButton').click();
    await page.waitForFunction(scene=>document.body.dataset.scene===scene,String(n).padStart(2,'0'));
    await page.waitForTimeout(n===1?350:850);
    const before=await page.evaluate(()=>({scrollY,scene:document.body.dataset.scene,hash:location.hash}));
    await page.waitForTimeout(1400);
    const after=await page.evaluate(()=>({scrollY,scene:document.body.dataset.scene,hash:location.hash}));
    const scene=String(n).padStart(2,'0');
    rows.push({viewport:viewport.label,scene,arrival:n===1?'direct opening':'Next',before,after,delta:after.scrollY-before.scrollY,pass:before.scene===scene&&after.scene===scene&&after.scrollY-before.scrollY>=8,errors:[...errors]});
  }
  await page.close();
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
const failed=rows.filter(row=>!row.pass||row.errors.length);
console.log(JSON.stringify({checks:rows.length,failed,out}));
if(failed.length)process.exitCode=1;

import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-beat-hash');
mkdirSync(out,{recursive:true});
const base=process.env.GTP_BASE_URL||'http://127.0.0.1:8767/';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
for(const viewport of [{width:1366,height:768,label:'projector'},{width:390,height:844,label:'phone'}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  let target;
  for(let attempt=0;attempt<8;attempt++){
    target=await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const scene=document.querySelector('.scene[data-scene="05"]');const top=scene.getBoundingClientRect().top+scrollY+Math.max(0,scene.offsetHeight-innerHeight)*.5;scrollTo({top,behavior:'instant'});return {top,scrollY,sceneTop:scene.getBoundingClientRect().top,sceneHeight:scene.offsetHeight}});
    await page.waitForTimeout(500);
    const progress=await page.evaluate(()=>Number(document.querySelector('.scene[data-scene="05"]').style.getPropertyValue('--p')));
    if(Math.abs(progress-.5)<.02)break;
  }
  await page.waitForFunction(()=>/^#05-(4\d|5\d)$/.test(location.hash),null,{timeout:3000});
  const before=await page.evaluate(()=>({hash:location.hash,progress:Number(document.querySelector('.scene[data-scene="05"]').style.getPropertyValue('--p')),scene:document.body.dataset.scene}));
  await page.screenshot({path:join(out,`${viewport.label}-before-reload.png`)});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.dataset.scene==='05'&&/^#05-(4\d|5\d)$/.test(location.hash)&&Math.abs(Number(document.querySelector('.scene[data-scene="05"]').style.getPropertyValue('--p'))-.5)<.03,null,{timeout:5000});
  const after=await page.evaluate(()=>({hash:location.hash,progress:Number(document.querySelector('.scene[data-scene="05"]').style.getPropertyValue('--p')),scene:document.body.dataset.scene}));
  await page.screenshot({path:join(out,`${viewport.label}-after-reload.png`)});
  results.push({viewport,target,before,after,errors,pass:/^#05-\d{2}$/.test(before.hash)&&before.hash===after.hash&&before.scene==='05'&&after.scene==='05'&&Math.abs(before.progress-after.progress)<.03&&errors.length===0});
  await page.close();
}
writeFileSync(join(out,'browser-log.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if(results.some(result=>!result.pass))process.exitCode=1;
await browser.close();

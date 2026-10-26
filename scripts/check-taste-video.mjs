import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'scroll-seventeenth-taste-video');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
for(const config of [
  {name:'projector',width:1366,height:768,motion:'no-preference'},
  {name:'phone',width:390,height:844,motion:'no-preference'},
  {name:'reduced',width:1366,height:768,motion:'reduce'},
]){
  const page=await browser.newPage({viewport:{width:config.width,height:config.height},reducedMotion:config.motion});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:8767/${config.motion==='reduce'?'#13':'#13-55'}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(700);
  const state=await page.evaluate(()=>{
    const scene=document.querySelector('.scene[data-scene="13"]');
    const video=scene.querySelector('video');
    const raw=scene.querySelector('.taste-demo__raw');
    const box=raw.getBoundingClientRect();
    return {hash:location.hash,progress:Number(scene.style.getPropertyValue('--p')),paused:video.paused,readyState:video.readyState,muted:video.muted,currentTime:video.currentTime,overflow:document.documentElement.scrollWidth-innerWidth,rawBox:{x:box.x,y:box.y,width:box.width,height:box.height}};
  });
  await page.screenshot({path:join(out,`${config.name}-comparison.png`)});
  rows.push({...config,...state,errors});
  if(config.name==='projector'){
    await page.locator('#motionButton').click();
    await page.waitForTimeout(100);
    rows.push({name:'paused-control',paused:await page.locator('.taste-demo__draft-video').evaluate(video=>video.paused),errors:[...errors]});
  }
  await page.close();
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
const pass=rows[0].readyState>=2&&!rows[0].paused&&rows[0].muted&&rows[0].overflow<=1&&!rows[0].errors.length&&rows[1].paused&&rows[2].overflow<=1&&!rows[2].errors.length&&rows[3].paused&&!rows[3].errors.length;
console.log(JSON.stringify({pass,rows,out}));
if(!pass)process.exitCode=1;

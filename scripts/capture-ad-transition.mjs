import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out=join(process.cwd(),'experience','evidence','scroll-eighteenth-ad-transition');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.goto('http://127.0.0.1:8767/#05',{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
const rows=[];
for(const progress of [.25,.29,.31,.33,.35,.37,.39,.58,.62,.64,.66,.68,.70,.73]){
  await page.evaluate(progress=>{const scene=document.querySelector('.scene[data-scene="05"]');scrollTo({top:scene.getBoundingClientRect().top+scrollY+progress*Math.max(0,scene.offsetHeight-innerHeight),behavior:'instant'})},progress);
  await page.waitForTimeout(100);
  const data=await page.evaluate(()=>{const stage=document.querySelector('.ad-stage');return {state:stage.dataset.adState,alphas:['--ad-feed','--ad-vertical','--ad-search'].map(name=>Number(stage.style.getPropertyValue(name)||0)),panelOpacity:[...stage.querySelectorAll('[data-ad-panel]')].map(panel=>Number(getComputedStyle(panel).opacity)),overflow:document.documentElement.scrollWidth-innerWidth}});
  const file=`ad-${String(Math.round(progress*100)).padStart(2,'0')}.png`;
  await page.screenshot({path:join(out,file)});
  rows.push({progress,file,...data,errors:[...errors]});
}
await browser.close();
writeFileSync(join(out,'browser-log.json'),JSON.stringify(rows,null,2));
const pass=rows.every(row=>row.overflow<=1&&!row.errors.length&&row.panelOpacity.filter(value=>value>.05).length<=1);
console.log(JSON.stringify({captures:rows.length,pass,errors:errors.length,overflow:rows.filter(row=>row.overflow>1).length,out}));
if(!pass)process.exitCode=1;

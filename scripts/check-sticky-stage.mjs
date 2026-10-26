import {chromium} from 'playwright-core';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const rows=[];
for(const viewport of [{width:1366,height:768},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  await page.goto('http://127.0.0.1:8767/#01',{waitUntil:'networkidle'});
  await page.locator('.scene-handoff--after-14').waitFor({state:'attached'});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  for(const n of [3,8,15]){
    const row=await page.evaluate(n=>{const scene=document.querySelector(`.scene[data-scene="${String(n).padStart(2,'0')}"]`);const distance=Math.max(1,scene.offsetHeight-innerHeight);scrollTo({top:scene.getBoundingClientRect().top+scrollY+distance*.5,behavior:'instant'});const stage=scene.querySelector('.scene__stage');return {scene:n,stageTop:stage.getBoundingClientRect().top,headingTop:scene.querySelector('h1,h2').getBoundingClientRect().top,position:getComputedStyle(stage).position,scrollWidth:document.documentElement.scrollWidth}},n);
    rows.push({viewport,...row});
  }
  await page.close();
}
await browser.close();
console.log(JSON.stringify(rows,null,2));
if(rows.some(row=>row.viewport.width===1366&&(row.stageTop<55||row.stageTop>85)))process.exitCode=1;

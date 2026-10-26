import {chromium} from 'playwright-core';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://127.0.0.1:8767/#03',{waitUntil:'networkidle'});
const results=[];
for(const selector of ['#motionButton','#overviewButton','#notesButton','#prevButton','#nextButton']){
  const item=await page.locator(selector).evaluate(el=>{const box=el.getBoundingClientRect();return {label:el.getAttribute('aria-label')||el.textContent.trim(),width:box.width,height:box.height}});
  results.push({selector,...item,pass:item.width>=44&&item.height>=44});
}
console.log(JSON.stringify({viewport:{width:390,height:844},results,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)},null,2));
if(results.some(result=>!result.pass))process.exitCode=1;
await browser.close();

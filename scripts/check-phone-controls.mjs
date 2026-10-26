import {chromium} from 'playwright-core';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://127.0.0.1:8767/#05',{waitUntil:'networkidle'});
const selectors=['.site-bar__tool','.ad-tabs button','.voice-card--generic button','.chat-demo button','.mock-menu button','.mock-actions button','.taste-prompt summary'];
const items=[];
for(const selector of selectors){
  const matches=await page.locator(selector).evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.trim().slice(0,34),width:Math.round(r.width),height:Math.round(r.height),font:getComputedStyle(el).fontSize}}));
  items.push({selector,matches});
}
console.log(JSON.stringify(items,null,2));
await browser.close();

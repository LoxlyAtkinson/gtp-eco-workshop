import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const out=join(process.cwd(),'experience','evidence','eco-carousel-local');
mkdirSync(out,{recursive:true});
const observations=[];
const order=['engage','convert','optimize'];

try{
  for(const setting of [
    {name:'projector',width:1366,height:768,reducedMotion:'no-preference'},
    {name:'phone',width:390,height:844,reducedMotion:'no-preference'},
    {name:'reduced-phone',width:390,height:844,reducedMotion:'reduce'}
  ]){
    const page=await browser.newPage({viewport:{width:setting.width,height:setting.height},reducedMotion:setting.reducedMotion,hasTouch:setting.name==='phone'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8767/#02-00',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    for(const kind of order){
      const button=page.locator(`[data-eco="${kind}"]`);
      if(setting.name==='phone')await button.tap();
      else if(setting.name==='reduced-phone'){
        await button.focus();
        await page.keyboard.press('Enter');
      }else await button.click();
      await page.waitForTimeout(setting.reducedMotion==='reduce'?100:750);
      const state=await page.evaluate(()=>{
        const scene=document.querySelector('.scene[data-scene="02"]');
        const cards=[...scene.querySelectorAll('[data-eco]')].map(button=>{
          const rect=button.getBoundingClientRect();
          const style=getComputedStyle(button);
          return {kind:button.dataset.eco,position:button.dataset.ecoPosition,pressed:button.getAttribute('aria-pressed'),x:Math.round(rect.x),y:Math.round(rect.y),width:Math.round(rect.width),height:Math.round(rect.height),opacity:style.opacity};
        });
        return {focus:scene.dataset.ecoFocus,scene:document.body.dataset.scene,cards,visibleDetail:scene.querySelector('[data-eco-detail]:not([hidden])')?.dataset.ecoDetail,overflow:document.documentElement.scrollWidth-innerWidth,scrollY};
      });
      const next=order[(order.indexOf(kind)+1)%3];
      const previous=order[(order.indexOf(kind)+2)%3];
      const activeCard=state.cards.find(card=>card.kind===kind);
      const nextCard=state.cards.find(card=>card.kind===next);
      const previousCard=state.cards.find(card=>card.kind===previous);
      if(state.focus!==kind||state.visibleDetail!==kind||activeCard.position!=='active'||activeCard.pressed!=='true'||nextCard.position!=='next'||previousCard.position!=='previous'||state.overflow>1||errors.length)throw Error(`${setting.name}/${kind}: ${JSON.stringify({state,errors})}`);
      if(setting.width>900&&!(nextCard.x<activeCard.x&&activeCard.x<previousCard.x))throw Error(`${setting.name}/${kind}: cards are out of cycle order: ${JSON.stringify(state.cards)}`);
      if(setting.width<=900&&!(nextCard.x<previousCard.x&&activeCard.y<nextCard.y))throw Error(`${setting.name}/${kind}: mobile cards are out of cycle order: ${JSON.stringify(state.cards)}`);
      if(activeCard.width<=nextCard.width)throw Error(`${setting.name}/${kind}: active card is not prominent: ${JSON.stringify(state.cards)}`);
      await page.screenshot({path:join(out,`${setting.name}-${kind}.png`)});
      observations.push({setting:setting.name,kind,state,errors});
    }
    if(setting.name==='projector'){
      const held=observations.at(-1).state.scrollY;
      await page.waitForTimeout(1600);
      const now=await page.evaluate(()=>scrollY);
      if(Math.abs(now-held)>2)throw Error(`manual ECO selection did not hold scroll: ${held} -> ${now}`);
    }
    await page.close();
  }
}finally{await browser.close()}
writeFileSync(join(out,'browser-log.json'),JSON.stringify(observations,null,2));
console.log(`PASS: ${observations.length} ECO carousel states across projector, phone and reduced motion; screenshots and browser log saved to ${out}`);

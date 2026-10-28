import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out=join(process.cwd(),'experience','evidence',process.env.GTP_EVIDENCE_DIR||'media-fallback-local');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const observations=[];
const scenes=[
  {hash:'05-20',number:'05',required:['How much lunch for 20 people?','Ask for a quote']},
  {hash:'05-70',number:'05',required:['One question','Ask for a quote']},
  {hash:'13-00',number:'13',required:['Show AI the standard','Keep your own identity','Lunch for 20?']},
  {hash:'15-70',number:'15',required:['One customer','One channel','One action','One measure']}
];
try{
  for(const viewport of [{name:'projector',width:1366,height:768},{name:'phone',width:390,height:844}])for(const mode of ['normal','reduced']){
    const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/assets/**',route=>route.abort('failed'));
    for(const scene of scenes){
      const hash=mode==='normal'&&scene.number==='13'?'13-90':scene.hash;
      await page.goto(`http://127.0.0.1:8767/#${hash}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(number=>document.body.dataset.scene===number,scene.number,{timeout:5000});
      const state=await page.evaluate(number=>{
        const element=document.querySelector(`.scene[data-scene="${number}"]`);
        const stage=document.querySelector('.ad-stage');
        return {active:document.body.dataset.scene,text:element.innerText,overflow:document.documentElement.scrollWidth-innerWidth,productFallback:document.body.classList.contains('media-product-failed'),adImgDisplay:getComputedStyle(document.querySelector('.ad-device img')).display,adProgress:element.style.getPropertyValue('--p'),adState:stage.dataset.adState,adFeed:stage.style.getPropertyValue('--ad-feed'),adSearch:stage.style.getPropertyValue('--ad-search'),transitTwo:stage.style.getPropertyValue('--ad-transit-two'),transitOpacity:getComputedStyle(document.querySelector('.ad-transit--to-search')).opacity,proofFallback:getComputedStyle(document.querySelector('.taste-proof__image'),'::after').content,proofVisible:getComputedStyle(document.querySelector('.taste-proof')).display!=='none'&&getComputedStyle(document.querySelector('.taste-proof')).visibility!=='hidden',brokenImages:[...element.querySelectorAll('img')].filter(image=>!image.naturalWidth).map(image=>({src:image.getAttribute('src'),alt:image.alt}))};
      },scene.number);
      const missing=scene.required.filter(phrase=>!state.text.toLowerCase().includes(phrase.toLowerCase()));
      if(state.active!==scene.number||missing.length||state.overflow>1||errors.length||!state.productFallback||state.adImgDisplay!=='none'||scene.number==='13'&&(!state.proofVisible||!state.proofFallback.includes('unavailable')))throw Error(`${viewport.name}/${mode}/${scene.number}: ${JSON.stringify({state,missing,errors})}`);
      if(scene.number==='13'){
        await page.locator('.taste-proof').evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-140,behavior:'instant'}));
        await page.waitForTimeout(150);
      }
      await page.screenshot({path:join(out,`${viewport.name}-${mode}-${scene.hash}.png`)});
      observations.push({viewport:viewport.name,mode,scene:scene.number,hash,active:state.active,missing,overflow:state.overflow,adImgDisplay:state.adImgDisplay,adProgress:state.adProgress,adState:state.adState,adFeed:state.adFeed,adSearch:state.adSearch,transitTwo:state.transitTwo,transitOpacity:state.transitOpacity,brokenImages:state.brokenImages,errors});
    }
    await page.close();
  }
}finally{await browser.close()}
writeFileSync(join(out,'browser-log.json'),JSON.stringify(observations,null,2));
console.log(`PASS: ${observations.length} asset-failure states; screenshots and log in ${out}`);

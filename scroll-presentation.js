(() => {
  const scenes=[...document.querySelectorAll('.scene')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const count=document.getElementById('sceneCount'), stage=document.getElementById('stageLabel');
  const fill=document.getElementById('progressFill'), track=document.querySelector('.progress-track');
  const prev=document.getElementById('prevButton'), next=document.getElementById('nextButton');
  const notes=document.getElementById('notesButton'), overview=document.getElementById('overviewDialog');
  const grid=document.getElementById('overviewGrid'), rail=[...document.querySelectorAll('.chapter-rail button')];
  const cinemaButton=document.getElementById('cinemaButton'), motionButton=document.getElementById('motionButton');
  let index=-1, frame=0, beatTimer=0;

  // Each section owns one sticky reading surface. The section itself supplies
  // native scroll distance, so a wheel gesture evolves the scene rather than
  // forcing a jump to the next slide.
  scenes.forEach(scene=>{
    const stageElement=document.createElement('div');
    stageElement.className='scene__stage';
    while(scene.firstChild)stageElement.appendChild(scene.firstChild);
    scene.appendChild(stageElement);
    scene.hidden=false;
    scene.removeAttribute('aria-hidden');
  });
  const mobileContexts=['THE WORKSHOP PROMISE','THE ECO LOOP','FIND YOUR CUSTOMER','CHOOSE ONE CHANNEL','MAKE AN ORIGINAL AD','FIND YOUR VOICE','PLAN YOUR WEBSITE','MAKE THE NEXT STEP CLEAR','ANSWER THE INQUIRY','MEASURE THE RESULT','ATTRACT WITH CLARITY','LET PEOPLE INTERACT','TEACH AI YOUR TASTE','YOUR ECO PLAN','YOUR SEVEN-DAY TEST'];
  scenes.forEach((scene,i)=>scene.querySelector('.scene__eyebrow')?.setAttribute('data-mobile-context',mobileContexts[i]));

  // Three short unnumbered bridges carry the same teaching object into the
  // next chapter. They remain ordinary scroll content and never replace a scene.
  const bridgeConfigs=[
    {after:'02',kind:'customer',label:'FRAMEWORK → CUSTOMER EVIDENCE',title:'The loop starts with one real order.',detail:'Before choosing a channel, turn the last ten orders into a question you can check.',visual:'<div class="bridge__receipt"><b>AMINA’S KITCHEN · ORDER NOTES</b><strong>Who actually ordered?</strong><div class="bridge__marks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span>6 office meetings · 4 family trays</span></div>'},
    {after:'05',kind:'voice',label:'AD → OWN VOICE',title:'The image catches the eye. The words earn the reply.',detail:'Keep the lunch, buyer question and offer together as AI helps draft the message.',visual:'<div class="bridge__product"><div class="bridge__product-image" role="img" aria-label="Original catering lunch visual from the sample ad"></div><div><b>AMINA’S KITCHEN · BRAND BRIEF</b><strong>Warm. Direct. Helpful.</strong><span>“Lunch for 20? Tell us the date and dietary needs.”</span></div></div>'},
    {after:'10',kind:'attract',label:'RESULT → CREATIVE DECISION',title:'What worked becomes the next thing to show.',detail:'The fictional answer page brought three sales. Make the next ad clearer, then measure again.',visual:'<div class="bridge__result"><div><b>ILLUSTRATIVE WEEK</b><strong>3 sales</strong><span>from FAQ / search</span></div><i aria-hidden="true">→</i><div><b>NEXT CREATIVE TEST</b><strong>Show the lunch.</strong><span>Make the quote action obvious.</span></div><div class="bridge__result-food" role="img" aria-label="The original meeting-lunch illustration carried from inquiry results into the next creative test"></div></div>'}
  ];
  const bridges=bridgeConfigs.map(config=>{const el=document.createElement('div');el.className=`scene-bridge scene-bridge--${config.kind}`;el.setAttribute('role','group');el.setAttribute('aria-label',config.label);el.innerHTML=`<div class="scene-bridge__stage"><div class="scene-bridge__copy"><span>${config.label}</span><h2>${config.title}</h2><p>${config.detail}</p><small>KEEP SCROLLING ↓</small></div>${config.visual}</div>`;scenes.find(scene=>scene.dataset.scene===config.after).after(el);return el});

  // The shorter handoffs keep one Amina business artifact in view as its job
  // changes at each of the remaining scene boundaries.
  const handoffConfigs=[
    {after:'01',tone:'opening',label:'PROMISE → METHOD',title:'A clearer next move.',detail:'The compass becomes a three-step decision loop.',from:['COMPASS','ECO','One business question'],to:['WORKSHOP METHOD','E · C · O','Engage → Convert → Optimize']},
    {after:'03',tone:'engage',label:'EVIDENCE → CHANNEL',title:'The order note becomes a channel choice.',detail:'Six office-meeting orders suggest a need. The buyer role is still open.',from:['TEN ORDER NOTES','6 / 10','Office meetings'],to:['CHANNEL SHORTLIST','3 PLACES','Search · visual proof · reply']},
    {after:'04',tone:'engage',label:'CHANNEL → MESSAGE',title:'A place to post needs something useful to say.',detail:'Carry the meeting-lunch question into an original placement.',from:['CHANNEL SHORTLIST','INSTA','Visual discovery'],to:['ORIGINAL FEED POST','20?','Start with one main per guest']},
    {after:'06',tone:'engage',label:'CAPTION → WEBSITE',title:'One useful answer can live longer than a post.',detail:'Turn the checked portion guidance into a searchable FAQ.',from:['HUMAN-EDITED CAPTION','20','Main portions to start'],to:['SERVICE PAGE / FAQ','FAQ','How much lunch for 20?']},
    {after:'07',tone:'convert',label:'PAGE → NEXT ACTION',title:'The answer page earns a clear request.',detail:'A useful explanation leads naturally to a tailored quote.',from:['WEBSITE ANSWER','FAQ','Full lunch or light meeting?'],to:['PAGE ACTION','QUOTE','Date · guests · dietary needs']},
    {after:'08',tone:'convert',label:'CTA → INQUIRY',title:'The button becomes a real question.',detail:'The fictional visitor gives only the details needed for help.',from:['MEETING-LUNCH CTA','ASK','Request a suitable option'],to:['FICTIONAL INQUIRY','20','Lunch for 20; vegetarian options?']},
    {after:'09',tone:'convert',label:'REPLY → MEASURE',title:'A helpful answer creates a trackable next step.',detail:'Record the quote, sale and follow-up before choosing the next campaign.',from:['HELPFUL REPLY','YES','Time and area? We will quote.'],to:['SIMPLE PIPELINE','1 / 3','Sale / qualified inquiries']},
    {after:'11',tone:'attract',label:'VISUAL → INTERACTION',title:'The clearer ad becomes a useful page.',detail:'Carry the same lunch offer into menu and quote paths.',from:['AMINA’S AD','20','Lunch for 20; one next step'],to:['MEETING-LUNCH PAGE','TAP','Menu or tailored quote']},
    {after:'12',tone:'attract',label:'INTERACTION → RULE',title:'A good interaction can be taught.',detail:'Name the design rule before asking AI to make more.',from:['QUOTE PREVIEW','3','Date · guests · dietary need'],to:['BRAND RULE','AI','Clear offer · useful action']},
    {after:'13',tone:'tool',label:'RULE → REPORT',title:'The same questions become an audit.',detail:'The planned tool will show evidence, gaps and a 30/60/90 plan.',from:['HUMAN DESIGN RULE','CHECK','Accuracy · voice · permission'],to:['PLANNED ECO REPORT','4','Customer · presence · inquiry · plan']},
    {after:'14',tone:'close',label:'REPORT → ACTION',title:'End with one move you can make this week.',detail:'Leave with a customer question, a channel and a useful next step.',from:['ECO REPORT PREVIEW','90','A practical planning horizon'],to:['YOUR 7-DAY COMMITMENT','7','One evidence-led action']}
  ];
  const handoffs=handoffConfigs.map(config=>{
    const el=document.createElement('div');
    el.className=`scene-handoff scene-handoff--${config.tone} scene-handoff--after-${config.after}`;
    el.setAttribute('role','group');
    el.setAttribute('aria-label',config.label);
    const artifactDetail=side=>{
      if(config.after==='03'&&side==='from')return '<div class="artifact-receipt-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="artifact-lunch artifact-lunch--mini" aria-hidden="true"></div>';
      if((config.after==='03'&&side==='to')||(config.after==='04'&&side==='from'))return '<div class="artifact-channel-paths" aria-hidden="true"><i>SEARCH</i><i>VISUAL PROOF</i><i>REPLY</i></div><div class="artifact-lunch artifact-lunch--mini" aria-hidden="true"></div>';
      if(config.after==='04'&&side==='to')return '<div class="artifact-lunch" role="img" aria-label="Original illustrated meeting lunch"></div>';
      return '';
    };
    const card=([eyebrow,figure,line],side)=>`<div class="handoff-card handoff-card--${side}" aria-hidden="${side==='to'}"><span>${eyebrow}</span><strong aria-hidden="true">${figure}</strong>${artifactDetail(side)}<p>${line}</p></div>`;
    const carriesProduct=['06','07','08','09','11'].includes(config.after);
    const requestActor=carriesProduct?'<div class="handoff-request-actor" aria-hidden="true"><b>↗</b><small>REQUEST</small></div>':'';
    const productActor=carriesProduct?'<div class="handoff-product-anchor" role="img" aria-label="The same original meeting-lunch illustration follows the customer request"></div>':'';
    const compassActor=config.after==='01'?'<div class="handoff-compass" role="img" aria-label="The original ECO compass carried from the opening into the workshop method"></div>':'';
    const reportActor=config.after==='14'?'<div class="handoff-report-fold" aria-hidden="true"></div>':'';
    el.innerHTML=`<div class="scene-handoff__stage"><div class="scene-handoff__copy"><span>${config.label}</span><h2>${config.title}</h2><p>${config.detail}</p><small>KEEP SCROLLING ↓</small></div><div class="handoff-artifact" aria-label="${config.from[0]} becomes ${config.to[0]}">${card(config.from,'from')}${card(config.to,'to')}${compassActor}${productActor}${requestActor}${reportActor}</div></div>`;
    scenes.find(scene=>scene.dataset.scene===config.after).after(el);
    return el;
  });
  const allBridges=[...bridges,...handoffs];
  const tastePrompt=document.querySelector('.taste-prompt');
  const tasteVideo=document.querySelector('.taste-demo__draft-video');
  let tastePromptWasOpen=false;
  addEventListener('beforeprint',()=>{tastePromptWasOpen=tastePrompt.open;tastePrompt.open=true});
  addEventListener('afterprint',()=>{tastePrompt.open=tastePromptWasOpen});

  const titleOf=scene=>scene.querySelector('h1,h2').innerText.replace(/\s+/g,' ').trim();
  grid.innerHTML=scenes.map((scene,i)=>`<button type="button" data-goto="${i}"><span>${String(i+1).padStart(2,'0')} · ${scene.dataset.stage.toUpperCase()}</span>${titleOf(scene)}</button>`).join('');
  const ecoMessages={engage:'Engage begins with evidence about who buys, where they look and what they need.',convert:'Convert gives that attention a useful next step and a prompt human reply.',optimize:'Optimize checks inquiries and sales, then improves the next round of engagement.'};
  let ecoManualChoice=false;
  let adManualChoice=false;
  const adStage=document.querySelector('.ad-stage');
  adStage.insertAdjacentHTML('beforeend','<div class="ad-transit ad-transit--to-video" aria-hidden="true"><img src="./assets/amina-lunch-3d.webp" alt=""><div><span>ONE CUSTOMER QUESTION</span><strong>Make the answer move.</strong><p>The same useful offer becomes a short video.</p></div></div><div class="ad-transit ad-transit--to-search" aria-hidden="true"><img src="./assets/amina-lunch-3d.webp" alt=""><div><span>ONE CUSTOMER QUESTION</span><strong>Make the answer findable.</strong><p>The same useful offer becomes a search result.</p></div></div>');
  const adPanels=[...document.querySelectorAll('[data-ad-panel]')];
  function syncAd(kind){
    adStage.dataset.adState=kind;
    const scrub=innerWidth>900&&!reduced.matches;
    document.querySelectorAll('[data-ad]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ad===kind)));
    adPanels.forEach(panel=>{const active=panel.dataset.adPanel===kind;panel.hidden=!scrub&&!active;panel.inert=!active;panel.setAttribute('aria-hidden',String(!active))});
  }
  const evidenceButton=document.getElementById('evidenceReveal'),actualOrders=document.getElementById('actualOrders');
  let evidenceOverride=null;
  function syncIcp(open){
    evidenceButton.setAttribute('aria-expanded',String(open));
    evidenceButton.firstChild.textContent=open?'Hide the order evidence ':'Reveal the last ten orders ';
    actualOrders.hidden=!open;
  }
  syncIcp(false);

  function update(){
    frame=0;
    const ease=(start,end,value)=>{const t=Math.max(0,Math.min(1,(value-start)/(end-start)));return t*t*(3-2*t)};
    const cursor=innerHeight*.42;
    let active=0;
    for(let i=0;i<scenes.length;i++){
      const rect=scenes[i].getBoundingClientRect();
      const travel=Math.max(1,rect.height-innerHeight);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      scenes[i].style.setProperty('--p',progress.toFixed(4));
      if(scenes[i].dataset.scene==='06'){
        scenes[i].style.setProperty('--voice-focus',ease(.16,.45,progress).toFixed(4));
        scenes[i].style.setProperty('--voice-week',ease(.61,.79,progress).toFixed(4));
        scenes[i].querySelector('.voice-comparison').inert=progress>.70;
        scenes[i].classList.toggle('is-voice-focus',progress>.3&&progress<=.6);
        scenes[i].classList.toggle('is-late-beat',progress>.70);
      }
      if(scenes[i].dataset.scene==='05'){
        const scrub=innerWidth>900&&!reduced.matches;
        const kind=!adManualChoice&&scrub?(progress>.66?'search':progress>.33?'vertical':'feed'):adStage.dataset.adState;
        syncAd(kind);
        const feed=adManualChoice?(kind==='feed'?1:0):1-ease(.27,.33,progress);
        const vertical=adManualChoice?(kind==='vertical'?1:0):ease(.33,.39,progress)*(1-ease(.60,.66,progress));
        const search=adManualChoice?(kind==='search'?1:0):ease(.66,.72,progress);
        adStage.style.setProperty('--ad-feed',feed.toFixed(4));
        adStage.style.setProperty('--ad-vertical',vertical.toFixed(4));
        adStage.style.setProperty('--ad-search',search.toFixed(4));
        const transit=adManualChoice?0:Math.min(1,Math.max(0,1-feed-vertical-search)*3);
        adStage.style.setProperty('--ad-transit-one',(progress<.5?transit:0).toFixed(4));
        adStage.style.setProperty('--ad-transit-two',(progress>=.5?transit:0).toFixed(4));
      }
      if(scenes[i].dataset.scene==='07')scenes[i].classList.toggle('is-late-beat',progress>.6);
      if(scenes[i].dataset.scene==='03'){
        scenes[i].classList.toggle('is-icp-sorting',progress>.27);
        scenes[i].classList.toggle('is-icp-revealed',progress>.61);
        syncIcp(evidenceOverride===null?progress>.61:evidenceOverride);
      }
      if(scenes[i].dataset.scene==='13'){
        scenes[i].style.setProperty('--taste-compare',ease(.37,.5,progress).toFixed(4));
        scenes[i].style.setProperty('--taste-final',ease(.74,.86,progress).toFixed(4));
        scenes[i].classList.toggle('is-taste-progress',progress>.45);
        scenes[i].classList.toggle('is-taste-final',progress>.78);
        const visible=rect.bottom>0&&rect.top<innerHeight;
        const draftVisible=innerWidth<=900||progress>.37&&progress<.8;
        const playDraft=visible&&draftVisible&&!reduced.matches&&!document.hidden&&!document.body.classList.contains('motion-paused');
        if(playDraft&&tasteVideo.paused)tasteVideo.play().catch(()=>{});
        else if(!playDraft&&!tasteVideo.paused)tasteVideo.pause();
      }
      if(scenes[i].dataset.scene==='14'){
        scenes[i].style.setProperty('--report-finding',ease(.37,.5,progress).toFixed(4));
        scenes[i].style.setProperty('--report-plan',ease(.74,.86,progress).toFixed(4));
        scenes[i].classList.toggle('is-report-finding',progress>.45);
        scenes[i].classList.toggle('is-report-plan',progress>.78);
      }
      if(scenes[i].dataset.scene==='15'){
        scenes[i].classList.toggle('is-close-two',progress>.24);
        scenes[i].classList.toggle('is-close-three',progress>.49);
        scenes[i].classList.toggle('is-close-four',progress>.74);
      }
      if(scenes[i].dataset.scene==='09')scenes[i].classList.toggle('is-reply-visible',progress>.52);
      if(scenes[i].dataset.scene==='10')scenes[i].classList.toggle('is-metric-decision',progress>.62);
      if(scenes[i].dataset.scene==='11'){
        scenes[i].classList.toggle('is-attract-compare',progress>.3);
        scenes[i].classList.toggle('is-attract-after',progress>.7);
      }
      if(scenes[i].dataset.scene==='12')scenes[i].classList.toggle('is-interaction-outcome',progress>.58);
      if(scenes[i].dataset.scene==='02'){
        const beat=progress>.67?'optimize':progress>.33?'convert':'engage';
        scenes[i].dataset.ecoBeat=beat;
        if(!ecoManualChoice){
          scenes[i].querySelectorAll('[data-eco]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.eco===beat)));
          document.getElementById('ecoFeedback').textContent=ecoMessages[beat];
        }
      }
      if(rect.top<=cursor)active=i;
    }
    for(const bridge of allBridges){const rect=bridge.getBoundingClientRect();const travel=Math.max(1,rect.height-innerHeight);const progress=Math.max(0,Math.min(1,-rect.top/travel));bridge.style.setProperty('--p',progress.toFixed(4));if(bridge.classList.contains('scene-handoff')){const switched=progress>=.5;bridge.classList.toggle('is-switched',switched);bridge.querySelector('.handoff-card--from').setAttribute('aria-hidden',String(!reduced.matches&&switched));bridge.querySelector('.handoff-card--to').setAttribute('aria-hidden',String(!reduced.matches&&!switched))}}
    document.body.style.setProperty('--active-p',scenes[active].style.getPropertyValue('--p')||'0');
    if(active===index)return;
    index=active;
    scenes.forEach((scene,i)=>scene.classList.toggle('is-active',i===index));
    const scene=scenes[index];
    document.body.dataset.stage=scene.dataset.stage;
    document.body.dataset.scene=scene.dataset.scene;
    count.textContent=`${String(index+1).padStart(2,'0')} / ${scenes.length}`;
    stage.textContent=scene.dataset.stage.toUpperCase();
    fill.style.width=`${(index+1)/scenes.length*100}%`;
    track.setAttribute('aria-valuenow',String(index+1));
    prev.disabled=index===0;next.disabled=index===scenes.length-1;
    next.innerHTML=index===scenes.length-1?'End':'Next <span aria-hidden="true">→</span>';
    grid.querySelectorAll('button').forEach((button,i)=>i===index?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
    const chapter=[...rail].reverse().find(button=>Number(button.dataset.chapter)<=index);
    rail.forEach(button=>button===chapter?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
  }
  function queueUpdate(){if(!frame)frame=requestAnimationFrame(update)}
  function writeBeatHash(){
    update();
    const scene=scenes[index];
    if(!scene)return;
    const rect=scene.getBoundingClientRect();
    const travel=Math.max(1,rect.height-innerHeight);
    const beat=Math.max(0,Math.min(99,Math.round(-rect.top/travel*100)));
    const hash=`#${scene.dataset.scene}-${String(beat).padStart(2,'0')}`;
    if(location.hash!==hash)history.replaceState(null,'',hash);
  }
  function scheduleBeatHash(){clearTimeout(beatTimer);beatTimer=setTimeout(writeBeatHash,320)}
  function parseSceneHash(){const match=/^#(\d{2})(?:-(\d{1,2}))?$/.exec(location.hash);if(!match)return null;const number=Number(match[1]),beat=Number(match[2]||0);return number>=1&&number<=scenes.length&&beat>=0&&beat<=99?{number,beat}:null}
  function restoreSceneHash(){
    const target=parseSceneHash();if(!target)return;
    const scene=scenes[target.number-1];
    const travel=Math.max(0,scene.offsetHeight-innerHeight);
    const headerOffset=target.beat===0&&(reduced.matches||innerWidth<=900)?(innerWidth<=900?58:70):0;
    scrollTo({top:scene.getBoundingClientRect().top+scrollY+travel*target.beat/100-headerOffset,behavior:'instant'});
    queueUpdate();
  }
  reduced.addEventListener('change',queueUpdate);
  function go(to,focus=false){
    if(to<0||to>=scenes.length)return;
    const requestedHash=`#${scenes[to].dataset.scene}`;
    history.replaceState(null,'',requestedHash);
    const scene=scenes[to];
    const headerOffset=reduced.matches||innerWidth<=900?(innerWidth<=900?58:70):0;
    const top=scene.getBoundingClientRect().top+scrollY-headerOffset;
    scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
    if(focus){const heading=scene.querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true})}
    queueUpdate();
  }
  addEventListener('scroll',()=>{queueUpdate();scheduleBeatHash()},{passive:true});
  addEventListener('resize',queueUpdate,{passive:true});
  addEventListener('visibilitychange',()=>{document.body.classList.toggle('is-page-hidden',document.hidden);queueUpdate()});
  reduced.addEventListener('change',queueUpdate);
  prev.addEventListener('click',()=>go(index-1,true));
  next.addEventListener('click',()=>go(index+1,true));
  notes.addEventListener('click',()=>{const open=document.body.classList.toggle('show-notes');notes.setAttribute('aria-pressed',String(open));queueUpdate()});
  document.getElementById('overviewButton').addEventListener('click',()=>overview.showModal());
  document.getElementById('closeOverview').addEventListener('click',()=>overview.close());
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-goto]');if(!button)return;overview.close();go(Number(button.dataset.goto),true)});
  rail.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.chapter),true)));
  addEventListener('keydown',event=>{
    if(overview.open||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    if(document.activeElement.closest('button,a,[role="button"]'))return;
    if(['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();scrollBy({top:innerHeight*.75,behavior:reduced.matches?'instant':'smooth'})}
    if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();scrollBy({top:-innerHeight*.75,behavior:reduced.matches?'instant':'smooth'})}
  });
  addEventListener('hashchange',restoreSceneHash);
  motionButton.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Resume motion':'Pause motion';motionButton.setAttribute('aria-label',paused?'Resume decorative motion':'Pause decorative motion');queueUpdate()});
  cinemaButton.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{cinemaButton.textContent='Full-screen unavailable'}});
  document.addEventListener('fullscreenchange',()=>{const full=Boolean(document.fullscreenElement);cinemaButton.setAttribute('aria-pressed',String(full));cinemaButton.setAttribute('aria-label',full?'Exit full-screen presentation':'Enter full-screen presentation');cinemaButton.innerHTML=`${full?'Exit cinema':'Cinema'} <span aria-hidden="true">${full?'↙':'⛶'}</span>`});
  addEventListener('pointermove',event=>{
    if(reduced.matches||document.body.classList.contains('motion-paused'))return;
    document.documentElement.style.setProperty('--pointer-x',`${((event.clientX/innerWidth)-.5)*12}px`);
    document.documentElement.style.setProperty('--pointer-y',`${((event.clientY/innerHeight)-.5)*12}px`);
  },{passive:true});

  evidenceButton.addEventListener('click',()=>{evidenceOverride=evidenceButton.getAttribute('aria-expanded')!=='true';syncIcp(evidenceOverride);queueUpdate()});
  document.querySelectorAll('[data-eco]').forEach(button=>button.addEventListener('click',()=>{ecoManualChoice=true;document.querySelectorAll('[data-eco]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.body.dataset.ecoActive=button.dataset.eco;document.getElementById('ecoFeedback').textContent=ecoMessages[button.dataset.eco]}));
  const channelReasons={visual:'Visual discovery earns a place when seeing the product helps someone decide. Pair it with a clear inquiry route.',community:'Local groups help when recommendations shape trust. Show up where real customer questions already appear.',search:'Search and Maps meet existing intent. Make your offer, area, opening details and next action easy to verify.',reply:'WhatsApp is the inquiry route. Reply promptly, record the need and agree on the next step.'};
  document.querySelectorAll('[data-channel]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-channel]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.getElementById('channelFeedback').textContent=channelReasons[button.dataset.channel]}));
  document.querySelectorAll('[data-ad]').forEach(button=>button.addEventListener('click',()=>{adManualChoice=true;syncAd(button.dataset.ad);queueUpdate()}));
  const productImage=document.querySelector('.ad-device img');
  function setProductFallback(){document.querySelector('.ad-device').classList.add('media-failed')}
  productImage.addEventListener('error',setProductFallback);
  if(productImage.complete&&!productImage.naturalWidth)setProductFallback();
  document.querySelectorAll('[data-roadmap]').forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('[data-roadmap]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)))));
  const voiceButton=document.getElementById('voiceRewrite'),voiceGrid=document.querySelector('.voice-grid');
  voiceButton.addEventListener('click',()=>{const active=voiceButton.getAttribute('aria-pressed')!=='true';voiceButton.setAttribute('aria-pressed',String(active));voiceGrid.classList.toggle('is-rewritten',active);voiceButton.firstChild.textContent=active?'Reset comparison ':'Apply the brand brief ';document.getElementById('voiceFeedback').textContent=active?'The edited version names the customer, makes a specific offer and avoids an unsupported delivery promise.':'Apply the brief to compare the generic draft with the edited voice.'});
  const metricChanges={visits:'If useful visits fall, check the page or channel that brought the right person before posting more.',inquiries:'If qualified inquiries fall, inspect the offer, call to action and response time.',sales:'If quotes are not turning into sales, ask where the decision feels unclear or risky.',trust:'If reviews or repeat purchases fall, improve delivery and invite honest feedback.'};
  document.querySelectorAll('[data-metric]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-metric]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.getElementById('metricFeedback').textContent=metricChanges[button.dataset.metric]}));
  let sampleQuote=null;
  const defaultHelpful='“Yes. What time and area? Tell us how many need a vegetarian lunch and we’ll suggest a suitable option.”';
  const vagueReply='“Send us your details.” This gives no answer or clear next step; improve it before automating.';
  function helpfulReply(){
    if(!sampleQuote)return defaultHelpful;
    const dietary=sampleQuote.dietary==='None specified'?'No dietary needs were specified.':`${sampleQuote.dietary} noted.`;
    return `“Thanks—${sampleQuote.guests} guests on ${sampleQuote.dateLabel}. ${dietary} What time and area? We’ll confirm a suitable option, availability and a quote.”`;
  }
  document.querySelectorAll('[data-reply]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.scene[data-scene="09"]').classList.add('has-reply-choice');document.querySelectorAll('[data-reply]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.getElementById('replyFeedback').textContent=button.dataset.reply==='helpful'?helpfulReply():vagueReply}));
  const mockResponses={menu:'Choose an option, then ask for a quote based on the real headcount and dietary needs.',quote:'Enter three useful details to see the local request preview. Nothing is sent.'};
  document.querySelectorAll('[data-mock]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-mock]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.getElementById('mockResponse').textContent=mockResponses[button.dataset.mock];document.querySelector('.mock-hero').classList.add('has-choice');document.querySelectorAll('[data-mock-panel]').forEach(panel=>panel.hidden=panel.dataset.mockPanel!==button.dataset.mock)}));
  const quoteForm=document.querySelector('.mock-quote');
  quoteForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!quoteForm.reportValidity())return;
    const data=new FormData(quoteForm);
    const guests=Number(data.get('guests'));
    const date=String(data.get('date')||'');
    const dietary=String(data.get('dietary')||'None specified');
    if(!Number.isInteger(guests)||guests<1||guests>500||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
    const dateLabel=new Date(`${date}T12:00:00`).toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'});
    sampleQuote={guests,dateLabel,dietary};
    document.getElementById('mockQuoteResult').textContent=`Illustrative request: ${guests} guests on ${dateLabel}; dietary note: ${dietary}. Next: confirm availability, price and response time before sending a real quote.`;
    document.getElementById('sampleInquiry').textContent=`“Lunch for ${guests} on ${dateLabel}. Dietary need: ${dietary}. Could you suggest a suitable option?”`;
    document.getElementById('sampleFollowup').textContent='Next: send the agreed quote, follow up at a suitable time, and invite an honest review after delivery. No message is sent.';
    document.getElementById('mockReplyJump').hidden=false;
  });
  document.getElementById('mockReplyJump').addEventListener('click',()=>{
    document.querySelectorAll('[data-reply]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.reply==='helpful')));
    document.getElementById('replyFeedback').textContent=helpfulReply();
    go(8,true);
  });

  const initial=parseSceneHash();
  if(initial){const restore=()=>document.fonts.ready.then(()=>requestAnimationFrame(restoreSceneHash));if(document.readyState==='complete')restore();else addEventListener('load',restore,{once:true})}
  else queueUpdate();
})();

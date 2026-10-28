(() => {
  const scenes=[...document.querySelectorAll('.scene')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const count=document.getElementById('sceneCount'), stage=document.getElementById('stageLabel');
  const fill=document.getElementById('progressFill'), track=document.querySelector('.progress-track');
  const prev=document.getElementById('prevButton'), next=document.getElementById('nextButton');
  const notes=document.getElementById('notesButton'), overview=document.getElementById('overviewDialog');
  const grid=document.getElementById('overviewGrid'), rail=[...document.querySelectorAll('.chapter-rail button')];
  const cinemaButton=document.getElementById('cinemaButton'), motionButton=document.getElementById('motionButton');
  const notesPanel=document.createElement('aside');
  notesPanel.id='presenterNotesPanel';
  notesPanel.className='presenter-notes-panel';
  notesPanel.setAttribute('aria-label','Presenter notes for the current scene');
  notesPanel.innerHTML='<div class="presenter-notes-panel__top"><strong id="presenterNotesTitle">Presenter notes</strong><button type="button" aria-label="Close presenter notes">×</button></div><p id="presenterNotesText"></p>';
  notesPanel.hidden=true;
  document.body.appendChild(notesPanel);
  let index=-1, frame=0, beatTimer=0, autoHashAt=0;
  // Presenter engine state (G01-T03). running | waiting (held above the next
  // scene, Next pulses) | paused (Space, header button or manual scroll) |
  // held (in-scene click) | jumping (Next/Overview/rail glide).
  const auto={state:'running',reason:'',speed:1,y:scrollY,jump:null};
  const G=window.gsap,ST=window.ScrollTrigger;
  if(G&&ST)G.registerPlugin(ST);

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
  const mobileContexts=['THE WORKSHOP PROMISE','THE ECO LOOP','ENGAGE · WITH WHO?','CHOOSE ONE CHANNEL','MAKE AN ORIGINAL AD','FIND YOUR VOICE','PLAN YOUR WEBSITE','MAKE THE NEXT STEP CLEAR','ANSWER THE INQUIRY','MEASURE THE RESULT','ATTRACT WITH CLARITY','LET PEOPLE INTERACT','TEACH AI YOUR TASTE','YOUR ECO PLAN','YOUR SEVEN-DAY TEST'];
  scenes.forEach((scene,i)=>scene.querySelector('.scene__eyebrow')?.setAttribute('data-mobile-context',mobileContexts[i]));

  // Short unnumbered bridges carry the same teaching object into the next
  // chapter. They remain ordinary scroll content and never replace a scene.
  // Scenes 01-03 (G01 rebuild) hand over directly, so they have no connector.
  const bridgeConfigs=[
    {after:'05',kind:'voice',label:'AD → OWN VOICE',title:'The image catches the eye. The words earn the reply.',detail:'Keep the lunch, buyer question and offer together as AI helps draft the message.',visual:'<div class="bridge__product"><div class="bridge__product-image" role="img" aria-label="Original catering lunch visual from the sample ad"></div><div><b>AMINA’S KITCHEN · BRAND BRIEF</b><strong>Warm. Direct. Helpful.</strong><span>“Lunch for 20? Tell us the date and dietary needs.”</span></div></div>'},
    {after:'10',kind:'attract',label:'RESULT → CREATIVE DECISION',title:'What worked becomes the next thing to show.',detail:'The fictional answer page brought three sales. Make the next ad clearer, then measure again.',visual:'<div class="bridge__result"><div><b>ILLUSTRATIVE WEEK</b><strong>3 sales</strong><span>from FAQ / search</span></div><i aria-hidden="true">→</i><div><b>NEXT CREATIVE TEST</b><strong>Show the lunch.</strong><span>Make the quote action obvious.</span></div><div class="bridge__result-food" role="img" aria-label="The original meeting-lunch illustration carried from inquiry results into the next creative test"></div></div>'}
  ];
  const bridges=bridgeConfigs.map(config=>{const el=document.createElement('div');el.className=`scene-bridge scene-bridge--${config.kind}`;el.setAttribute('role','group');el.setAttribute('aria-label',config.label);el.innerHTML=`<div class="scene-bridge__stage"><div class="scene-bridge__copy"><span>${config.label}</span><h2>${config.title}</h2><p>${config.detail}</p><small>KEEP SCROLLING ↓</small></div>${config.visual}</div>`;scenes.find(scene=>scene.dataset.scene===config.after).after(el);return el});

  // The shorter handoffs keep one Amina business artifact in view as its job
  // changes at each of the remaining scene boundaries.
  // G01 repair: the old Amina 'after 03' connector is gone. Scene 03 holds on its
  // own persona frame and Next goes straight to scene 04 (D-01, D1, D57-D59).
  const handoffConfigs=[
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
  const ecoMessages={engage:'Engage: what makes people respond. Catalysts turn into reactions.',convert:'Convert: while you have their attention, give them a clear next step.',optimize:'Optimize: measure both ends. Failures and successes, and why and to whom.'};
  let ecoManualChoice=false;
  const ecoScene=scenes[1],ecoOrder=['engage','convert','optimize'];
  // Filled by the GSAP scene module (G01) when motion is allowed.
  const g1Hooks={eco:null};
  const motionOn=()=>document.documentElement.classList.contains('g1-motion');
  function syncEco(kind,replay=false){
    const focus=kind||'all';
    if(!replay&&ecoScene.dataset.ecoFocus===focus)return;
    ecoScene.dataset.ecoFocus=focus;
    document.body.dataset.ecoActive=focus;
    ecoScene.querySelectorAll('[data-eco]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.eco===kind)));
    ecoScene.querySelectorAll('[data-eco-detail]').forEach(detail=>{detail.inert=motionOn()&&detail.dataset.ecoDetail!==kind});
    document.getElementById('ecoFeedback').textContent=kind?ecoMessages[kind]:'All three are connected. Select one to bring it into focus.';
    g1Hooks.eco?.(kind);
  }
  syncEco(null,true);
  let adManualChoice=false;
  const adStage=document.querySelector('.ad-stage');
  const adDevice=adStage.querySelector('.ad-device');
  adDevice.insertAdjacentHTML('beforeend','<span class="ad-device__foreground-rim" aria-hidden="true"></span>');
  adStage.insertAdjacentHTML('beforeend','<div class="ad-transit ad-transit--to-video" aria-hidden="true"><img src="./assets/amina-lunch-3d.webp" alt=""><div><span>ONE CUSTOMER QUESTION</span><strong>Make the answer move.</strong><p>The same useful offer becomes a short video.</p></div></div><div class="ad-transit ad-transit--to-search" aria-hidden="true"><img src="./assets/amina-lunch-3d.webp" alt=""><div><span>ONE CUSTOMER QUESTION</span><strong>Make the answer findable.</strong><p>The same useful offer becomes a search result.</p></div></div>');
  const adPanels=[...document.querySelectorAll('[data-ad-panel]')];
  function syncAd(kind){
    adStage.dataset.adState=kind;
    const scrub=innerWidth>900&&!reduced.matches;
    document.querySelectorAll('[data-ad]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ad===kind)));
    adPanels.forEach(panel=>{const active=panel.dataset.adPanel===kind;panel.hidden=!scrub&&!active;panel.inert=!active;panel.setAttribute('aria-hidden',String(!active))});
  }

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
      if(scenes[i].dataset.scene==='04'){
        scenes[i].style.setProperty('--channel-decision',ease(.52,.82,progress).toFixed(4));
        scenes[i].classList.toggle('is-channel-decision',progress>.68);
        scenes[i].querySelector('.channel-decision').setAttribute('aria-hidden',String(progress<=.68&&innerWidth>900));
      }
      if(scenes[i].dataset.scene==='06'){
        scenes[i].style.setProperty('--voice-focus',ease(.16,.45,progress).toFixed(4));
        scenes[i].style.setProperty('--voice-week',ease(.61,.79,progress).toFixed(4));
        scenes[i].querySelector('.voice-comparison').inert=progress>.70;
        scenes[i].classList.toggle('is-voice-focus',progress>.3&&progress<=.6);
        scenes[i].classList.toggle('is-late-beat',progress>.70);
      }
      if(scenes[i].dataset.scene==='05'){
        adDevice.classList.toggle('is-product-emerged',progress>.14);
        const scrub=innerWidth>900&&!reduced.matches;
        const kind=!adManualChoice&&scrub?(progress>.66?'search':progress>.33?'vertical':'feed'):adStage.dataset.adState;
        syncAd(kind);
        const feed=adManualChoice?(kind==='feed'?1:0):1-ease(.27,.33,progress);
        const vertical=adManualChoice?(kind==='vertical'?1:0):ease(.33,.39,progress)*(1-ease(.60,.66,progress));
        const search=adManualChoice?(kind==='search'?1:0):ease(.66,.69,progress);
        adStage.style.setProperty('--ad-feed',feed.toFixed(4));
        adStage.style.setProperty('--ad-vertical',vertical.toFixed(4));
        adStage.style.setProperty('--ad-search',search.toFixed(4));
        const transit=adManualChoice?0:Math.min(1,Math.max(0,1-feed-vertical-search)*3);
        adStage.style.setProperty('--ad-transit-one',(progress<.5?transit:0).toFixed(4));
        adStage.style.setProperty('--ad-transit-two',(progress>=.5?transit:0).toFixed(4));
      }
      if(scenes[i].dataset.scene==='07'){
        scenes[i].classList.toggle('is-late-beat',progress>.6);
        scenes[i].classList.toggle('is-website-transition',progress>.35&&progress<=.76);
        scenes[i].classList.toggle('is-website-final',progress>.76);
        scenes[i].style.setProperty('--website-zoom',ease(.25,.67,progress).toFixed(4));
        scenes[i].querySelector('.website-world').setAttribute('aria-hidden',String(progress<=.76&&innerWidth>900));
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
        // Scroll beats only drive the spotlight when motion is on; the static
        // (reduced-motion and print) layout shows all three and waits for clicks.
        const beat=progress>.71?'optimize':progress>.42?'convert':progress>.15?'engage':null;
        scenes[i].dataset.ecoBeat=beat||'all';
        // After a click hold is resumed, the scroll takes over again once it passes the chosen word.
        if(ecoManualChoice&&auto.state==='running'&&ecoOrder.indexOf(beat)>ecoOrder.indexOf(ecoScene.dataset.ecoFocus))ecoManualChoice=false;
        if(motionOn()&&!ecoManualChoice)syncEco(beat);
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
    document.getElementById('presenterNotesTitle').textContent=`Presenter notes · ${String(index+1).padStart(2,'0')} / ${scenes.length}`;
    document.getElementById('presenterNotesText').textContent=scene.querySelector('.speaker-note')?.textContent.trim()||'No presenter note for this scene.';
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
  let navSerial=0;
  function restoreSceneHash(){
    const target=parseSceneHash();if(!target)return;
    const scene=scenes[target.number-1];
    const land=()=>{const travel=Math.max(0,scene.offsetHeight-innerHeight);const headerOffset=target.beat===0&&(reduced.matches||innerWidth<=900)?(innerWidth<=900?58:70):0;scrollTo({top:scene.getBoundingClientRect().top+scrollY+travel*target.beat/100-headerOffset,behavior:'instant'})};
    land();
    queueUpdate();
    // A late layout shift (fonts, images) must not leave a direct load sitting
    // on the connector above the requested scene: land again if nothing else moved us.
    const serial=navSerial;
    setTimeout(()=>{update();if(serial===navSerial&&index!==target.number-1&&['running','waiting'].includes(auto.state)){land();update();setAuto('running')}},800);
  }
  reduced.addEventListener('change',queueUpdate);
  // Next, Prev, Overview and the chapter rail all land on a NUMBERED scene's top.
  // Connectors between scenes are never a destination: they play inside the
  // outgoing scene's auto-scroll travel, before the hold point.
  function go(to,focus=false){
    if(to<0||to>=scenes.length)return;
    navSerial++;
    const requestedHash=`#${scenes[to].dataset.scene}`;
    history.replaceState(null,'',requestedHash);
    const scene=scenes[to];
    const headerOffset=reduced.matches||innerWidth<=900?(innerWidth<=900?58:70):0;
    const topOf=()=>Math.max(0,scene.getBoundingClientRect().top+scrollY-headerOffset),top=topOf();
    // Every arrival resets the landing scene: no word stays centred, the timer re-arms.
    ecoManualChoice=false;
    if(to===2)timerReset();
    auto.jump?.kill();
    if(reduced.matches||!G){scrollTo({top,behavior:'instant'});restartSceneMotion()}
    else if(g1Hooks.seam?.(index,to,top,focus))return;
    else{
      // A short GSAP glide, then the landing scene starts its own motion at once.
      setAuto('jumping');
      const glide={y:scrollY};
      auto.jump=G.to(glide,{y:top,duration:Math.min(.8,.35+Math.abs(top-scrollY)/12000),ease:'power2.inOut',overwrite:true,
        onUpdate:()=>scrollTo({top:glide.y,behavior:'instant'}),
        // Scenes passed during the glide can change height; land on the real top.
        onComplete:()=>{auto.jump=null;update();const settled=topOf();if(Math.abs(settled-scrollY)>2)scrollTo({top:settled,behavior:'instant'});restartSceneMotion()}});
      // If frames stall on a busy laptop, land anyway so the scene never sits still.
      const jump=auto.jump;setTimeout(()=>{if(auto.jump===jump)jump.progress(1)},1500);
    }
    if(focus){const heading=scene.querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true})}
    queueUpdate();
  }
  // Refresh the active scene first: the ticker can run before the queued update.
  function restartSceneMotion(){update();setAuto('running')}
  addEventListener('scroll',()=>{queueUpdate();scheduleBeatHash()},{passive:true});
  // Manual wheel, touch drag or scroll keys pause until Next or Space. Scrolling
  // inside the notes panel or the overview does not count.
  const manualPause=event=>{
    if(event?.target?.closest?.('.presenter-notes-panel,dialog'))return;
    if(['running','waiting'].includes(auto.state))setAuto('paused','manual');
  };
  addEventListener('wheel',manualPause,{passive:true});
  addEventListener('touchmove',manualPause,{passive:true});
  addEventListener('resize',queueUpdate,{passive:true});
  addEventListener('visibilitychange',()=>{document.body.classList.toggle('is-page-hidden',document.hidden);queueUpdate()});
  reduced.addEventListener('change',queueUpdate);
  prev.addEventListener('click',()=>go(index-1,true));
  next.addEventListener('click',()=>go(index+1,true));
  notes.addEventListener('click',()=>{const open=document.body.classList.toggle('show-notes');notes.setAttribute('aria-pressed',String(open));notesPanel.hidden=!open;queueUpdate()});
  notesPanel.querySelector('button').addEventListener('click',()=>notes.click());
  document.getElementById('overviewButton').addEventListener('click',()=>overview.showModal());
  document.getElementById('closeOverview').addEventListener('click',()=>overview.close());
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-goto]');if(!button)return;overview.close();go(Number(button.dataset.goto),true)});
  rail.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.chapter),true)));
  // Keyboard: Space pauses/resumes; PageDown/ArrowRight = Next and
  // PageUp/ArrowLeft = Prev (presenter clickers); arrow up/down scroll by hand
  // and pause; - and + change the speed. A keyboard user who tabbed onto a
  // control keeps Space for that control; after a mouse click Space still pauses.
  let pointerFocus=true;
  addEventListener('pointerdown',()=>{pointerFocus=true},{capture:true,passive:true});
  addEventListener('keydown',event=>{if(event.key==='Tab')pointerFocus=false},{capture:true});
  addEventListener('keydown',event=>{
    if(overview.open||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    const onControl=document.activeElement.closest('button,a,summary,[role="button"]');
    if(event.key===' '){
      if(onControl&&!pointerFocus)return;
      event.preventDefault();
      if(onControl)document.activeElement.blur();
      togglePause('space');
      return;
    }
    if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();go(index+1,true);return}
    if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(index-1,true);return}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){manualPause();return}
    if(event.key==='-'||event.key==='_')stepSpeed(-1);
    if(event.key==='='||event.key==='+')stepSpeed(1);
  });
  addEventListener('hashchange',restoreSceneHash);
  motionButton.addEventListener('click',()=>togglePause('button'));
  cinemaButton.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{cinemaButton.textContent='Full-screen unavailable'}});
  document.addEventListener('fullscreenchange',()=>{const full=Boolean(document.fullscreenElement);cinemaButton.setAttribute('aria-pressed',String(full));cinemaButton.setAttribute('aria-label',full?'Exit full-screen presentation':'Enter full-screen presentation');cinemaButton.innerHTML=`${full?'Exit cinema':'Cinema'} <span aria-hidden="true">${full?'↙':'⛶'}</span>`});
  addEventListener('pointermove',event=>{
    if(reduced.matches||document.body.classList.contains('motion-paused'))return;
    document.documentElement.style.setProperty('--pointer-x',`${((event.clientX/innerWidth)-.5)*12}px`);
    document.documentElement.style.setProperty('--pointer-y',`${((event.clientY/innerHeight)-.5)*12}px`);
  },{passive:true});

  // Slide 2: a click centres that word from any state and holds the scene on it.
  document.querySelectorAll('[data-eco]').forEach(button=>button.addEventListener('click',()=>{ecoManualChoice=true;if(auto.state!=='jumping')setAuto('held','click');syncEco(button.dataset.eco,true)}));
  // Slide 3 controls. Only the real buttons are bound (the section also carries
  // data-audience, which used to catch every stray click, D-04).
  const whoScene=scenes[2];
  const audienceButtons=[...whoScene.querySelectorAll('.g1-audience button[data-audience]')];
  const groupButtons=[...whoScene.querySelectorAll('.g1-group[data-group]')];
  const personaPics={gift:'Placeholder for a customer picture: a man in his forties at an office desk with a wrapped gift box',self:'Placeholder for a customer picture: a woman in her thirties with a face-oil bottle at home',spa:'Placeholder for a customer picture: a guesthouse owner stocking a guest room',b2b:'Placeholder for a customer picture: a founder packing product boxes for a market date'};
  function syncPersona(){
    const audience=whoScene.dataset.audience,persona=whoScene.dataset.persona;
    audienceButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.audience===audience)));
    groupButtons.forEach(button=>button.setAttribute('aria-pressed',String(audience==='b2c'&&button.dataset.group===persona)));
    whoScene.querySelector('.g1-persona__pic').setAttribute('aria-label',personaPics[audience==='b2b'?'b2b':persona]);
    g1Hooks.persona?.();
  }
  // Seek inside scene 03 (step rail and group taps). Motion: a short glide to that
  // beat, then hold. Static layout: bring the matching block into view.
  const seekTargets={gather:'.g1-panel--gather',group:'.g1-panel--groups',describe:'.g1-persona',test:'.g1-test'};
  function seekWho(p,step){
    if(reduced.matches||!G||!motionOn()){whoScene.querySelector(seekTargets[step]||'.g1-persona')?.scrollIntoView({block:'center'});return}
    const top=whoScene.getBoundingClientRect().top+scrollY,y=top+Math.max(0,whoScene.offsetHeight-innerHeight)*p;
    auto.jump?.kill();setAuto('jumping');
    const glide={y:scrollY};
    auto.jump=G.to(glide,{y,duration:.7,ease:'power2.inOut',overwrite:true,onUpdate:()=>scrollTo({top:glide.y,behavior:'instant'}),onComplete:()=>{auto.jump=null;update();setAuto('held','click')}});
  }
  const whoProgress=()=>{const rect=whoScene.getBoundingClientRect();return Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)))};
  audienceButtons.forEach(button=>button.addEventListener('click',()=>{whoScene.dataset.audience=button.dataset.audience;syncPersona();if(auto.state!=='jumping')setAuto('held','click')}));
  groupButtons.forEach(button=>button.addEventListener('click',()=>{
    whoScene.dataset.persona=button.dataset.group;whoScene.dataset.audience='b2c';whoScene.classList.add('has-pick');syncPersona();
    if(motionOn()&&!reduced.matches&&whoProgress()<.89)seekWho(.9,'describe');
    else{if(!motionOn()||reduced.matches)whoScene.querySelector('.g1-persona').scrollIntoView({block:'center'});if(auto.state!=='jumping')setAuto('held','click')}
  }));
  whoScene.querySelectorAll('.g1-method button[data-seek]').forEach(button=>button.addEventListener('click',()=>seekWho(Number(button.dataset.seek),button.dataset.step)));
  // The 40 s write-down. Motion: it starts by itself when the auto-scroll reaches
  // it and holds the page; at zero it shows done and the scene moves on. Space or a
  // tap on the chip skips it. Static layout: the chip is a plain countdown.
  const whoTimer={el:whoScene.querySelector('.g1-timer'),left:40,id:0,state:'idle'};
  function timerRender(){
    const el=whoTimer.el;el.dataset.state=whoTimer.state;el.setAttribute('aria-pressed',String(whoTimer.state==='running'));
    el.style.setProperty('--t',(whoTimer.left/40).toFixed(3));
    el.querySelector('.g1-timer__num').textContent=whoTimer.state==='done'?'✓':String(Math.ceil(whoTimer.left));
    el.querySelector('.g1-timer__txt').textContent=whoTimer.state==='running'?'Writing… tap to skip':whoTimer.state==='done'?'Done · moving on':'Start timer';
  }
  function timerStart(){
    if(whoTimer.state==='running')return;
    whoTimer.state='running';whoTimer.left=40;const started=performance.now();clearInterval(whoTimer.id);
    whoTimer.id=setInterval(()=>{whoTimer.left=Math.max(0,40-(performance.now()-started)/1000);if(whoTimer.left<=0)timerFinish(false);else timerRender()},250);
    if(!reduced.matches&&['running','paused','held'].includes(auto.state)&&scenes[index]===whoScene)setAuto('held','timer');
    timerRender();
  }
  function timerFinish(skipped){
    if(whoTimer.state!=='running')return;
    clearInterval(whoTimer.id);whoTimer.state='done';whoTimer.left=0;timerRender();
    if(auto.state==='held'&&auto.reason==='timer')setTimeout(()=>{if(auto.state==='held'&&auto.reason==='timer')restartSceneMotion()},skipped?0:1600);
  }
  function timerReset(){clearInterval(whoTimer.id);whoTimer.state='idle';whoTimer.left=40;timerRender()}
  whoTimer.el.addEventListener('click',()=>{if(whoTimer.state==='running')timerFinish(true);else timerStart()});
  timerRender();
  const channelReasons={visual:'Visual discovery earns a place when seeing the product helps someone decide. Pair it with a clear inquiry route.',community:'Local groups help when recommendations shape trust. Show up where real customer questions already appear.',search:'Search and Maps meet existing intent. Make your offer, area, opening details and next action easy to verify.',reply:'WhatsApp is the inquiry route. Reply promptly, record the need and agree on the next step.'};
  document.querySelectorAll('[data-channel]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-channel]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.getElementById('channelFeedback').textContent=channelReasons[button.dataset.channel]}));
  document.querySelectorAll('[data-ad]').forEach(button=>button.addEventListener('click',()=>{adManualChoice=true;syncAd(button.dataset.ad);queueUpdate()}));
  const productImage=document.querySelector('.ad-device img');
  function setProductFallback(){
    document.querySelector('.ad-device').classList.add('media-failed');
    document.body.classList.add('media-product-failed');
    document.querySelector('.taste-proof__image').setAttribute('aria-label','Illustrative catering image unavailable; the offer remains readable beside it.');
    document.querySelector('.taste-proof__copy small').textContent='The illustration is unavailable. The offer and next step remain readable.';
  }
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

  // ---- G01-T03 presenter engine -------------------------------------------
  // Each numbered scene auto-scrolls on the GSAP ticker at a pace set by its
  // talk minutes (data-minutes), stops just above the next numbered scene's
  // top, and waits for Next. A connector after a scene is part of that
  // scene's travel. Opening Notes never holds the motion.
  const statusEl=document.getElementById('autoStatus'),statusText=document.getElementById('autoStatusText'),speedSelect=document.getElementById('speedSelect');
  // Talk time in SECONDS per numbered scene 01-15 (story spine v2 section 11,
  // F-07: sum 4140 s = 69:00 until the owner picks cuts). The one place to retune pace.
  const sceneSeconds=[120,180,330,340,285,435,325,260,340,180,310,325,180,280,250];
  const PACE_SHARE=.85,SCENE_SHARE=.75,MIN_PACE=6,HOLD_GAP=4,SPEEDS=[.5,.75,1,1.25,1.5,2];
  try{const saved=Number(localStorage.getItem('gtp-auto-speed'));if(SPEEDS.includes(saved))auto.speed=saved}catch{}
  speedSelect.value=String(auto.speed);
  function setSpeed(value){
    auto.speed=value;speedSelect.value=String(value);
    try{localStorage.setItem('gtp-auto-speed',String(value))}catch{}
    renderStatus();
  }
  function stepSpeed(direction){setSpeed(SPEEDS[Math.max(0,Math.min(SPEEDS.length-1,SPEEDS.indexOf(auto.speed)+direction))])}
  // Blur after a choice so Space goes back to pause/resume.
  speedSelect.addEventListener('change',()=>{setSpeed(Number(speedSelect.value));speedSelect.blur()});
  function setAuto(state,reason=''){
    auto.state=state;auto.reason=reason;
    if(state==='running')auto.y=scrollY;
    // Resuming (Space, Next, a jump) skips a running write-down timer.
    if(whoTimer.state==='running'&&['running','jumping'].includes(state))timerFinish(true);
    const paused=state==='paused';
    document.body.classList.toggle('motion-paused',paused);
    motionButton.setAttribute('aria-pressed',String(paused||state==='held'));
    motionButton.textContent=paused||state==='held'?'Resume scroll':'Pause scroll';
    motionButton.setAttribute('aria-label',paused||state==='held'?'Resume automatic scroll':'Pause automatic scroll');
    renderStatus();
  }
  function togglePause(reason){
    if(auto.state==='paused'||auto.state==='held'){restartSceneMotion();return}
    if(auto.state==='running')setAuto('paused',reason);
  }
  // Holds that come from outside the engine: the overview grid, a hidden tab,
  // and the scene 13 prompt while it is open on scene 13.
  function blocker(){
    if(overview.open)return 'Overview open';
    if(document.hidden)return 'Tab hidden';
    if(tastePrompt.open&&scenes[index]?.dataset.scene==='13')return 'Prompt open';
    return '';
  }
  let lastStatus='';
  function renderStatus(){
    const block=reduced.matches?'':blocker();
    let state=reduced.matches?'reduced':auto.state,label;
    if(state==='reduced')label='Reduced motion · use Next';
    else if(block&&state==='running'){state='paused';label=`On hold · ${block}`}
    else if(state==='running')label=`Moving · ${auto.speed}×`;
    else if(state==='jumping')label='Moving to the next scene';
    else if(state==='waiting')label='End of scene · press Next';
    else if(state==='held')label=auto.reason==='timer'?`Write-down · ${Math.ceil(whoTimer.left)} s · Space skips`:'Held on your click · Space or Next';
    else label=auto.reason==='manual'?'Paused (you scrolled) · Space resumes':'Paused · Space resumes';
    const ready=state==='waiting'||(state==='held'&&ecoScene.dataset.ecoFocus==='optimize'&&scenes[index]===ecoScene);
    const key=`${state}|${label}|${ready}`;
    if(key===lastStatus)return;
    lastStatus=key;
    statusEl.dataset.state=state;
    statusText.textContent=label;
    next.classList.toggle('is-ready',ready);
  }
  function geometry(i){
    const scene=scenes[i],top=scene.getBoundingClientRect().top+scrollY;
    const maxY=document.documentElement.scrollHeight-innerHeight;
    const sceneEnd=top+Math.max(0,scene.offsetHeight-innerHeight);
    const nextScene=scenes[i+1];
    const nextTop=nextScene?nextScene.getBoundingClientRect().top+scrollY:Infinity;
    const hold=Math.min(maxY,Math.max(sceneEnd,nextTop-innerHeight-HOLD_GAP));
    return {top,sceneEnd:Math.min(sceneEnd,hold),hold,connector:hold-sceneEnd>innerHeight*.25};
  }
  function tick(time,deltaTime){
    renderStatus();
    if(reduced.matches||auto.state!=='running'||index<0||blocker())return;
    const dt=Math.min(1000,Math.max(0,deltaTime))/1000;
    const g=geometry(index);
    if(Math.abs(auto.y-scrollY)>30)auto.y=scrollY;
    if(auto.y>=g.hold-.5){scrollTo({top:g.hold,behavior:'instant'});setAuto('waiting');return}
    const inScene=auto.y<g.sceneEnd-.5;
    const share=g.connector?(inScene?SCENE_SHARE:1-SCENE_SHARE):1;
    const seconds=sceneSeconds[index]*PACE_SHARE*share;
    const travel=inScene?g.sceneEnd-g.top:g.hold-g.sceneEnd;
    const pace=Math.max(MIN_PACE,travel/seconds)*auto.speed;
    auto.y=Math.min(inScene?g.sceneEnd:g.hold,auto.y+pace*dt);
    scrollTo({top:auto.y,behavior:'instant'});
    if(time-autoHashAt>.5){writeBeatHash();autoHashAt=time}
  }
  if(G)G.ticker.add(tick);
  else{let last=0;const loop=now=>{tick(now/1000,last?now-last:0);last=now;requestAnimationFrame(loop)};requestAnimationFrame(loop)}
  addEventListener('visibilitychange',renderStatus);
  overview.addEventListener('close',renderStatus);

  // ---- G01 scenes 01-03: GSAP motion layer ---------------------------------
  // CSS holds every end state, so reduced motion, print and a failed script all
  // read a complete static page. With motion allowed, html.g1-motion turns scenes
  // 01-03 into sticky stages. G01 repair (2026-10-28): every beat has a layer the
  // scroll scrubs plus an ambient loop, so the stage never freezes while the
  // presenter talks; one bottle carries all three scenes; Next from 01 and 02 is a
  // shared-element handoff instead of a cut.
  const s1=scenes[0],s2=scenes[1],s3=scenes[2];
  const q=(root,sel)=>root.querySelector(sel),qa=(root,sel)=>[...root.querySelectorAll(sel)];
  // Replays an entrance: finish the previous one (its end state is the CSS
  // state), then build the new timeline so its from() states apply only now.
  const player=()=>{let current=null;return build=>{current?.progress(1).kill();current=build?build():null;return current}};
  function typeOut(els){
    const t=G.timeline();
    t.call(()=>els.forEach(el=>{el.textContent='';el.classList.add('is-typing')}),null,0);
    els.forEach(el=>{const full=el.dataset.fill||el.textContent,o={n:0};el.dataset.fill=full;t.to(o,{n:full.length,duration:Math.max(.3,full.length*.045),ease:'none',onUpdate:()=>{el.textContent=full.slice(0,Math.round(o.n))},onComplete:()=>el.classList.remove('is-typing')})});
    return t;
  }
  // Layout box relative to a stage, ignoring transforms (offset chain).
  function box(el,stage){let x=0,y=0,n=el;while(n&&n!==stage){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent}return {x,y,w:el.offsetWidth,h:el.offsetHeight}}
  // Where `el` (transform-origin 0 0) must move and scale to sit inside `target`.
  function fitIn(el,target,stage){const a=box(el,stage),b=box(target,stage),s=Math.min(b.w/a.w,b.h/a.h);return {x:b.x+(b.w-a.w*s)/2-a.x,y:b.y+(b.h-a.h*s)/2-a.y,scale:s}}
  const phone=()=>innerWidth<=900;
  if(G&&ST)G.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
    document.documentElement.classList.add('g1-motion');
    const ambient=[],added=[];
    const FlipPlugin=window.Flip;if(FlipPlugin)G.registerPlugin(FlipPlugin);

    // ===== Scene 01: the dimensional open =====
    const st1=q(s1,'.scene__stage'),hero=q(s1,'.g1-hero'),bottle=q(s1,'.g1-hero__bottle'),ink=q(s1,'.g1-hero__ink'),shine=q(s1,'.g1-hero__shine'),plate=q(s1,'.g1-open__plate');
    G.from(qa(s1,'.g1-line'),{yPercent:60,autoAlpha:0,duration:1,stagger:.2,ease:'power3.out',delay:.1});
    G.from(q(s1,'.g1-open__lede'),{y:20,autoAlpha:0,duration:.8,delay:.75});
    // The turntable: the scroll turns the bottle 0-60 degrees across 0.30-0.55; a
    // drag or tap on the bottle adds to it. The label compresses toward the far
    // edge instead of sliding out of its band, so it never clips (D11).
    const turn={scroll:0,drag:0};
    function renderTurn(){
      const v=Math.max(-.5,Math.min(1.5,turn.scroll+turn.drag)),a=Math.sin(Math.max(-1,Math.min(1,v))*Math.PI/3);
      G.set(ink,{x:-a*20,scaleX:1-Math.abs(a)*.32,svgOrigin:'100 300'});
      G.set(shine,{x:a*84});
      G.set(bottle,{scaleX:1-Math.abs(a)*.07});
    }
    const sat=sel=>q(s1,sel);
    G.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:s1,start:'top top',end:'bottom bottom',scrub:.6}})
      .fromTo([hero,plate],{scale:1},{scale:1.15,duration:.67},.08)
      .fromTo(q(s1,'.g1-open__copy'),{scale:1,x:0},{scale:.95,x:-12,duration:.67},.08)
      .fromTo(q(s1,'.g1-open__giant'),{xPercent:26},{xPercent:-50,duration:.62},.08)
      .fromTo(bottle,{rotation:-3},{rotation:3,duration:1},0)
      .fromTo(turn,{scroll:0},{scroll:1,duration:.25,onUpdate:renderTurn},.30)
      .fromTo(q(s1,'.g1-hero__sweep'),{backgroundPosition:'100% 0%'},{backgroundPosition:'0% 0%',duration:.25},.30)
      // Satellites drift in from off-frame on three depth planes (R1 T2/T3), then late arrivals.
      .fromTo(sat('.g1-sat--marula'),{x:-280,y:70,autoAlpha:0,scale:.6},{x:0,y:0,autoAlpha:1,scale:1,duration:.12},.30)
      .fromTo(sat('.g1-sat--rooibos'),{x:260,y:-140,autoAlpha:0,rotation:-30},{x:0,y:0,autoAlpha:1,rotation:0,duration:.12},.34)
      .fromTo(sat('.g1-sat--buchu'),{x:280,y:90,autoAlpha:0},{x:0,y:0,autoAlpha:1,duration:.12},.38)
      .fromTo(sat('.g1-sat--drop2'),{y:-220,autoAlpha:0},{y:0,autoAlpha:.8,duration:.1},.43)
      .fromTo(sat('.g1-sat--marula2'),{x:-140,y:-170,autoAlpha:0},{x:0,y:0,autoAlpha:.8,duration:.1},.46)
      .fromTo(q(s1,'.g1-open__opener'),{y:30,autoAlpha:0},{y:0,autoAlpha:1,duration:.06},.55)
      .fromTo(sat('.g1-sat--vial'),{y:240,autoAlpha:0,rotation:-24},{y:0,autoAlpha:1,rotation:-8,duration:.1},.57)
      .fromTo(sat('.g1-sat--gift'),{x:-300,y:140,autoAlpha:0},{x:0,y:0,autoAlpha:1,duration:.12},.61)
      .fromTo(sat('.g1-sat--sprig'),{x:220,y:-180,autoAlpha:0},{x:0,y:0,autoAlpha:1,duration:.12},.66)
      .fromTo(q(s1,'.g1-hero__orbit'),{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1,duration:.08},.75)
      .fromTo(plate,{'--bridge':0},{'--bridge':1,duration:.2},.78);
    let dragX=null,dragMoved=0;
    const dragEnd=()=>{if(dragX===null)return;dragX=null;
      if(dragMoved<4)G.fromTo(turn,{drag:0},{drag:.85,duration:.45,ease:'power2.out',yoyo:true,repeat:1,onUpdate:renderTurn});
      else G.to(turn,{drag:0,duration:1.3,ease:'elastic.out(1,.45)',onUpdate:renderTurn})};
    const dragDown=event=>{dragX=event.clientX;dragMoved=0;G.killTweensOf(turn,'drag');hero.setPointerCapture?.(event.pointerId)};
    const dragMove=event=>{if(dragX===null)return;dragMoved=Math.max(dragMoved,Math.abs(event.clientX-dragX));turn.drag=Math.max(-1,Math.min(1,(dragX-event.clientX)/170));renderTurn()};
    hero.addEventListener('pointerdown',dragDown);hero.addEventListener('pointermove',dragMove);hero.addEventListener('pointerup',dragEnd);hero.addEventListener('pointercancel',dragEnd);
    const ambientOf=new Map([[s1,[]],[s2,[]],[s3,[]]]);
    const loopOf=(scene,...tweens)=>{ambientOf.get(scene).push(...tweens);ambient.push(...tweens)};
    const dots=qa(s1,'.g1-hero__orbit i'),orbit={a:0,rx:0};
    // Sizes are read once per resize, never inside a per-frame callback (no layout thrash).
    const measure01=()=>{orbit.rx=Math.min(210,hero.clientWidth*.42)};measure01();
    loopOf(s1,
      G.to(bottle,{y:-12,duration:2.6,ease:'sine.inOut',yoyo:true,repeat:-1}),
      G.to(q(s1,'.g1-hero__drop'),{y:12,duration:1.9,ease:'sine.inOut',yoyo:true,repeat:-1}),
      G.to(orbit,{a:Math.PI*2,duration:13,ease:'none',repeat:-1,onUpdate:()=>{
        const rx=orbit.rx,ry=rx*.3;
        dots.forEach((dot,k)=>{const a=orbit.a+k*Math.PI*2/3;G.set(dot,{x:Math.cos(a)*rx,y:Math.sin(a)*ry,scale:.8+.2*(Math.sin(a)+1)/2,opacity:.55+.45*(Math.sin(a)+1)/2})});
      }})
    );

    // ===== Scene 02: the words orbit the bottle; a word takes the centre =====
    const st2=q(s2,'.scene__stage'),words=qa(s2,'.g1-word'),wordsBox=q(s2,'.g1-eco__words'),head=q(s2,'.g1-eco__head'),ring=q(s2,'.g1-eco__ring'),corebox=q(s2,'.g1-eco__corebox'),hint=q(s2,'.g1-eco__hint');
    const details={engage:q(s2,'.g1-detail--engage'),convert:q(s2,'.g1-detail--convert'),optimize:q(s2,'.g1-detail--optimize')};
    wordsBox.style.zIndex='auto';
    G.set(words,{xPercent:-50,yPercent:-50,transformOrigin:'50% 50%'});
    G.set(Object.values(details),{autoAlpha:0});
    const orb={a:-.5,scroll:0,on:true,W:0,H:0,vw:innerWidth,visible:false};
    const measure02=()=>{orb.W=wordsBox.clientWidth;orb.H=wordsBox.clientHeight;orb.vw=innerWidth};measure02();
    // The orbit holds still while a pointer rests on a word, so it is easy to click.
    words.forEach(w=>{w.addEventListener('pointerenter',()=>{orb.hover=true});w.addEventListener('pointerleave',()=>{orb.hover=false})});
    ST.create({trigger:s2,start:'top bottom',end:'bottom top',onToggle:self=>{orb.visible=self.isActive},onRefresh:self=>{orb.visible=self.isActive}});
    function orbitPos(k){
      const W=orb.W,H=orb.H,a=orb.a+orb.scroll+k*Math.PI*2/3,innerWidth=orb.vw;
      let cx=W*.5,cy=H*.6,rx=Math.max(innerWidth*.23,300),ry=rx*.34;
      if(phone()){cy=H*.46;rx=innerWidth*.3;ry=innerWidth*.58}
      const depth=(Math.sin(a)+1)/2;
      return {x:cx+Math.cos(a)*rx,y:cy+Math.sin(a)*ry,scale:(phone()?.8:.92)+depth*.32,opacity:.68+depth*.32,zIndex:depth>.5?6:2};
    }
    function focusTargets(kind){
      const W=wordsBox.clientWidth,H=wordsBox.clientHeight,ai=ecoOrder.indexOf(kind),p=phone();
      return words.map((word,k)=>{
        if(k===ai)return {x:W*.5,y:p?56:H*.17,scale:p?1.75:2.2,land:p?2.3:2.85,opacity:1,zIndex:7};
        const side=ecoOrder.filter(o=>o!==kind).indexOf(word.dataset.eco);
        return p?{x:W*(side?.76:.24),y:114,scale:.62,opacity:.62,zIndex:5}:{x:W*(side?.92:.08),y:H*.17,scale:.6,opacity:.55,zIndex:5};
      });
    }
    let prevFocus=null;
    function coreTarget(kind){return kind?fitIn(corebox,q(details[kind],'[data-core-slot]'),st2):{x:0,y:0,scale:1}}
    function layoutEco(kind,instant){
      words.forEach(w=>G.killTweensOf(w));
      if(!kind){
        const t=words.map((w,k)=>orbitPos(k));
        if(instant){words.forEach((w,k)=>G.set(w,t[k]));orb.on=true}
        else{orb.on=false;words.forEach((w,k)=>G.to(w,{...t[k],duration:.8,ease:'power3.inOut',onComplete:k===2?()=>{orb.on=true}:null}))}
      }else{
        orb.on=false;
        const t=focusTargets(kind);
        words.forEach((w,k)=>{
          const {land,...end}=t[k];
          if(instant){G.set(w,end);return}
          if(w.dataset.eco===kind)G.timeline().to(w,{x:end.x,y:end.y,scale:land,opacity:1,zIndex:7,duration:.7,ease:'power3.inOut',delay:.15}).to(w,{scale:end.scale,duration:.6,ease:'power2.out'},'+=.45');
          // The outgoing word drops to a lower lane, crosses there, and rises only after the crossing (no double exposure).
          else if(w.dataset.eco===prevFocus)G.timeline().to(w,{scale:end.scale*.85,opacity:.22,y:'+=72',zIndex:3,duration:.25,ease:'power2.in'}).to(w,{x:end.x,scale:end.scale,duration:.6,ease:'power3.inOut'}).to(w,{y:end.y,opacity:end.opacity,zIndex:end.zIndex,duration:.35,ease:'power2.out'},'-=.12');
          else G.to(w,{...end,duration:.8,ease:'power3.inOut'});
        });
      }
      const d=instant?0:.7;
      G.to(head,{scale:kind?.36:1,autoAlpha:kind?(phone()?0:.7):1,duration:d,ease:'power3.inOut',overwrite:'auto'});
      G.to(ring,{autoAlpha:kind?.16:1,scale:kind?.7:1,duration:d,overwrite:'auto'});
      G.to(hint,{autoAlpha:kind?0:1,duration:d*.5,overwrite:'auto'});
      G.to(corebox,{...coreTarget(kind),duration:instant?0:.9,delay:instant?0:(kind?.3:0),ease:'power3.inOut',overwrite:'auto'});
      Object.entries(details).forEach(([k,el])=>G.to(el,k===kind?{autoAlpha:1,duration:instant?0:.4,delay:instant?0:.72,overwrite:true}:{autoAlpha:0,duration:instant?0:.2,overwrite:true}));
      prevFocus=kind;
    }
    const orbitTick=(time,deltaTime)=>{
      if(!orb.on||orb.hover||ecoScene.dataset.ecoFocus!=='all'||document.body.classList.contains('motion-paused'))return;
      if(!orb.visible)return;
      orb.a+=Math.min(100,deltaTime)/1000*Math.PI*2/26;
      words.forEach((w,k)=>G.set(w,orbitPos(k)));
    };
    G.ticker.add(orbitTick);
    // Scroll-scrubbed layer inside each focus state (D-06, D6): reactions count up,
    // the catalyst rows fire in turn, the tactics light, the lanes fill.
    const ecoRanges={engage:[.15,.42],convert:[.42,.71],optimize:[.71,1]};
    const counters=qa(s2,'.g1-post__stats b[data-count]'),catalysts=qa(s2,'.g1-catalyst'),tactics=qa(s2,'.g1-tactics li'),lanes=qa(s2,'.g1-lane__fill');
    function applyScrub(kind,t){
      if(kind==='engage'){const e=t*t*(3-2*t);counters.forEach(b=>{b.textContent=String(Math.round(Number(b.dataset.count)*e))});const hot=Math.min(3,Math.floor(t*4.4));catalysts.forEach((c,k)=>c.classList.toggle('is-hot',k===hot))}
      if(kind==='convert')tactics.forEach((li,k)=>li.classList.toggle('is-hot',k===(t<.5?0:1)));
      if(kind==='optimize')lanes.forEach((lane,k)=>lane.style.setProperty('--lane',Math.max(.04,Math.min(1,t*1.7-k*.35)).toFixed(3)));
    }
    const scrubProxy={t:0};
    function ecoScroll(p){
      orb.scroll=p*2.6;
      const kind=ecoScene.dataset.ecoFocus;
      if(kind==='all'||ecoManualChoice)return;
      const [a,b]=ecoRanges[kind];applyScrub(kind,Math.max(0,Math.min(1,(p-a)/(b-a))));
    }
    ST.create({trigger:s2,start:'top top',end:'bottom bottom',onUpdate:self=>ecoScroll(self.progress),onRefresh:self=>ecoScroll(self.progress)});
    const ecoPlay=player();
    const ecoBuild={
      engage:()=>{const el=details.engage;return G.timeline({delay:.6,defaults:{ease:'power3.out',duration:.6}})
        .from(q(el,'.g1-detail__text'),{y:24,autoAlpha:0},0)
        .from(qa(el,'.g1-catalyst b'),{x:-24,autoAlpha:0,stagger:.16},.25)
        .from(qa(el,'.g1-catalyst i'),{autoAlpha:0,stagger:.16},.55)
        .from(qa(el,'.g1-react'),{scale:0,autoAlpha:0,stagger:.2,ease:'back.out(2.2)'},.75)
        .from(q(el,'.g1-post'),{y:40,autoAlpha:0},.5)
        .from(q(el,'.g1-post__comment'),{scale:.6,autoAlpha:0,ease:'back.out(2)'},1.6)},
      convert:()=>{const el=details.convert,chip=q(el,'.g1-thandi'),name=q(el,'.g1-form output');
        const t=G.timeline({delay:.6,defaults:{ease:'power3.out',duration:.6}})
          .from(q(el,'.g1-backlink'),{x:-30,autoAlpha:0},0)
          .from(q(el,'h3'),{y:20,autoAlpha:0},.2)
          .from(q(el,'.g1-know'),{y:16,autoAlpha:0},.55)
          .from(chip,{scale:.6,autoAlpha:0,ease:'back.out(2)'},.8)
          .from(q(el,'.g1-form'),{y:30,autoAlpha:0},.75);
        // The commenter from Engage becomes the first row of the form (F-03): the bubble flies into Name.
        t.to(chip,{x:()=>box(name,st2).x-box(chip,st2).x,y:()=>box(name,st2).y-box(chip,st2).y,scale:.7,autoAlpha:0,duration:.7,ease:'power2.in'},1.6)
         .add(typeOut(qa(el,'.g1-form output')),2.2)
         .set(chip,{x:0,y:0,scale:1,autoAlpha:1},5.2)
         .from(qa(el,'.g1-tactics li'),{x:30,autoAlpha:0,stagger:.3},2.6)
         .from(q(el,'.g1-sample'),{autoAlpha:0,y:20},3.2);
        return t},
      optimize:()=>{const el=details.optimize;return G.timeline({delay:.6,defaults:{ease:'power3.out',duration:.6}})
        .from(q(el,'h3'),{y:20,autoAlpha:0},0)
        .from(qa(el,'.g1-lanes span'),{scaleX:0,transformOrigin:'0 50%',stagger:.2},.25)
        .from(q(el,'.g1-verdict--fail'),{y:50,autoAlpha:0},.75)
        .from(q(el,'.g1-verdict--win'),{y:50,autoAlpha:0},1.25)
        .from(q(el,'.g1-chip--why'),{scale:.5,autoAlpha:0,ease:'back.out(2)'},1.85)
        .from(q(el,'.g1-chip--whom'),{scale:.4,autoAlpha:0,ease:'back.out(2.4)',duration:.8},2.25)
        .from(q(el,'.g1-illustrative'),{autoAlpha:0},2.7)}
    };
    const relayout=()=>{measure01();measure02();const f=ecoScene.dataset.ecoFocus;layoutEco(f==='all'?null:f,true)};
    relayout();
    g1Hooks.eco=kind=>{
      layoutEco(kind,false);
      ecoPlay(kind?ecoBuild[kind]:null);
      if(kind&&ecoManualChoice){G.killTweensOf(scrubProxy);scrubProxy.t=0;G.to(scrubProxy,{t:1,duration:2.6,delay:.8,ease:'none',onUpdate:()=>applyScrub(kind,scrubProxy.t)})}
    };
    loopOf(s2,G.to(q(s2,'.g1-eco__core'),{y:-10,duration:2.8,ease:'sine.inOut',yoyo:true,repeat:-1}));

    // ===== Scene 03: the bottle answers "who" =====
    const st3=q(s3,'.scene__stage'),hero3=q(s3,'.g1-who__hero'),title=q(s3,'.g1-who__title'),qmark=q(s3,'.g1-who__q');
    st3.insertAdjacentHTML('beforeend','<i class="g1-anchor g1-anchor--b1"></i><i class="g1-anchor g1-anchor--b2"></i><i class="g1-anchor g1-anchor--b3"></i><i class="g1-anchor g1-anchor--b4"></i><i class="g1-anchor g1-anchor--assume4"></i>');
    added.push(...qa(st3,'.g1-anchor'));
    // A crowd of customers: grey with question marks until the records sort them.
    const crowdGroups=['gift','self','gift','spa','self','gift','self','spa','gift','self','gift','spa','self','gift','self','gift','spa','self','gift','spa'];
    const crowd=document.createElement('div');crowd.className='g1-crowd';crowd.setAttribute('aria-hidden','true');
    crowd.innerHTML=crowdGroups.map(g=>`<i class="g1-person" data-g="${g}"><b><svg viewBox="0 0 40 52"><use href="#g1-person"/></svg></b></i>`).join('');
    st3.insertBefore(crowd,q(st3,'.g1-panel--doubt'));added.push(crowd);
    const persons=qa(crowd,'.g1-person');
    const assume=q(s3,'.g1-assume'),face=q(assume,'.g1-assume__face');
    const shards=['polygon(0 0,50% 0,46% 28.75%,54% 43.75%,42.7% 70%,48.7% 100%,0 100%)','polygon(50% 0,100% 0,100% 100%,48.7% 100%,42.7% 70%,54% 43.75%,46% 28.75%)'].map(clip=>{const s=face.cloneNode(true);s.className='g1-assume__shard';s.setAttribute('aria-hidden','true');s.style.clipPath=clip;face.after(s);added.push(s);return s});
    const B=el=>box(el,st3);
    const anchor=name=>q(st3,`.g1-anchor--${name}`);
    const heroTo=target=>{const t=()=>fitIn(hero3,typeof target==='string'?anchor(target):target,st3);return {x:()=>t().x,y:()=>t().y,scale:()=>t().scale}};
    const heroFrom=target=>target?heroTo(target):{x:0,y:0,scale:1};
    const doubt=q(s3,'.g1-panel--doubt'),keep=q(s3,'.g1-keep'),method=q(s3,'.g1-method'),gather=q(s3,'.g1-panel--gather'),write=q(s3,'.g1-write'),streams=q(s3,'.g1-panel--streams'),unroll=q(s3,'.g1-unroll'),tableWrap=q(s3,'.g1-table-wrap'),groups=q(s3,'.g1-panel--groups'),personaPanel=q(s3,'.g1-panel--persona'),personaCard=q(s3,'.g1-persona');
    const rows=qa(s3,'.g1-table tbody tr'),order=['gift','self','spa'];
    const sortIdx=rows.map((r,i)=>rows.map((x,j)=>({g:order.indexOf(x.dataset.group),j})).sort((m,n)=>m.g-n.g||m.j-n.j).findIndex(e=>e.j===i));
    const surveyOut=qa(s3,'.g1-survey output').map(el=>{el.dataset.fill=el.dataset.fill||el.textContent;return el});
    const band=()=>{const a=B(anchor('b3'));return {x:a.x+a.w*.11,y:a.y+a.h*.568,w:a.w*.78,h:a.h*.21}};
    const syncUnroll=()=>{const b=B(tableWrap);Object.assign(unroll.style,{left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px'})};
    syncUnroll();ST.addEventListener('refreshInit',syncUnroll);
    const slotFor=person=>{const g=person.dataset.g,i=persons.filter(p=>p.dataset.g===g).indexOf(person);return qa(s3,`.g1-group--${g} .g1-pile i`)[i]};
    G.set([doubt,assume,keep,method,gather,write,streams,unroll,tableWrap,groups,personaPanel,...shards,q(assume,'.g1-assume__crack')],{autoAlpha:0});
    G.set(hero3,{transformOrigin:'0 0'});G.set(personaCard,{transformOrigin:'50% 0'});G.set(tableWrap,{transformOrigin:'50% 0'});
    const verbs=qa(s3,'.g1-keep b');
    const countEls=qa(groups,'.g1-group b'),clamp01=x=>Math.max(0,Math.min(1,x));
    let whoBeat=-1;
    const whoBeats=[.12,.24,.45,.58,.75],methodButtons=qa(s3,'.g1-method button');
    const T=G.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:s3,start:'top top',end:'bottom bottom',scrub:.5,invalidateOnRefresh:true,onUpdate:self=>whoUpdate(self.progress),onRefresh:self=>whoUpdate(self.progress)}});
    const IR={immediateRender:false};
    // 03-1 title (0-0.12): the crowd of unknown customers rises in, the bottle glides on, the guess drifts in.
    T.fromTo(hero3,{x:60},{x:0,duration:.05},0)
     .fromTo(persons,{y:40,autoAlpha:0},{y:0,autoAlpha:1,duration:.02,stagger:.003},.005)
     .fromTo(persons,{'--q':0},{'--q':1,duration:.01,stagger:.002},.045)
     .fromTo(assume,{autoAlpha:0,x:90,rotation:6},{autoAlpha:1,x:0,rotation:0,duration:.03},.088)
     .fromTo(title,{y:0,scale:1},{y:()=>-title.offsetTop+(phone()?2:0),scale:()=>phone()?.36:.2,duration:.028,...IR},.104)
    // 03-2 doubt (0.12-0.24): the headline lands, the guess gets tagged and stamped.
     .fromTo(hero3,heroFrom(),{...heroTo('b1'),duration:.03,...IR},.108)
     .fromTo(doubt,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.02},.122)
     .fromTo(q(doubt,'.g1-doubt__sub'),{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.015},.135)
     .fromTo(q(doubt,'.g1-doubt__icp'),{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.015},.15)
     .fromTo(q(assume,'.g1-assume__tag'),{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1,duration:.012},.16)
     .fromTo(q(assume,'.g1-assume__stamp'),{autoAlpha:0,scale:2.6},{autoAlpha:1,scale:1,duration:.008,ease:'power4.in'},.176)
     .fromTo(persons,{rotation:0},{rotation:(i)=>i%2?6:-6,duration:.03,stagger:.002},.19)
     .fromTo(doubt,{autoAlpha:1,y:0},{autoAlpha:0,y:-24,duration:.014,...IR},.228)
     .fromTo(assume,{autoAlpha:1},{autoAlpha:0,duration:.014,...IR},.228)
     .fromTo(persons,{rotation:(i)=>i%2?6:-6},{rotation:0,duration:.02,...IR},.235)
    // 03-3 GATHER (0.24-0.45), drawn first (owner S3-54): the capture loop around the bottle,
    // the verbs light with each loop label, the survey types, the question marks fade.
     .fromTo(keep,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.015},.238)
     .fromTo(method,{autoAlpha:0},{autoAlpha:1,duration:.01},.24)
     .fromTo(hero3,heroFrom('b1'),{...heroTo('b2'),duration:.03,...IR},.236)
     .fromTo(gather,{autoAlpha:0},{autoAlpha:1,duration:.012},.25)
     .fromTo(q(gather,'.g1-loop__ring'),{scale:.4,autoAlpha:0},{scale:1,autoAlpha:1,duration:.02},.252);
    qa(gather,'.g1-loop b').forEach((label,k)=>T.fromTo(label,{scale:0,autoAlpha:0},{scale:1,autoAlpha:1,duration:.01,ease:'back.out(2)'},.268+k*.03).fromTo(verbs[k],{'--lit':0},{'--lit':1,duration:.012},.268+k*.03));
    T.fromTo(q(gather,'.g1-loop strong'),{scale:.3,autoAlpha:0},{scale:1,autoAlpha:1,duration:.012,ease:'back.out(2.4)'},.345)
     .fromTo(q(gather,'.g1-survey'),{autoAlpha:0,x:40},{autoAlpha:1,x:0,duration:.015},.284);
    T.fromTo(persons,{'--q':1},{'--q':0,duration:.012,stagger:.0055,...IR},.27)
     .fromTo(q(gather,'.g1-guessing'),{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.012},.37)
     .fromTo(q(gather,'.g1-privacy'),{autoAlpha:0},{autoAlpha:1,duration:.01},.382)
     .fromTo(write,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.015},.39)
     .fromTo([gather,write],{autoAlpha:1},{autoAlpha:0,duration:.012,...IR},.448)
    // 03-4 ROWS (0.45-0.58): buy, inquire and come back pour into the bottle's label band,
    // which unrolls into the table (Flip-style rect tween); the survey columns fill.
     .fromTo(hero3,heroFrom('b2'),{...heroTo('b3'),duration:.025,...IR},.446)
     .fromTo(streams,{autoAlpha:0,x:-40},{autoAlpha:1,x:0,duration:.014},.455);
    qa(streams,'.g1-tok').forEach((tok,i)=>{const k=Math.floor(i/3),c=()=>{const a=B(tok),b=band();return {x:b.x+b.w/2-a.x-a.w/2,y:b.y+b.h/2-a.y-a.h/2}};
      T.fromTo(tok,{x:0,y:0,scale:1,autoAlpha:1},{x:()=>c().x,y:()=>c().y,scale:.35,autoAlpha:0,duration:.02,ease:'power2.in',...IR},.47+k*.011+(i%3)*.004);
      if(i%3===0)T.fromTo(verbs[k],{scale:1},{scale:1.14,duration:.005,yoyo:true,repeat:1,...IR},.47+k*.011)});
    T.fromTo(q(hero3,'.g1-who__glow'),{scale:1},{scale:1.5,duration:.03},.47)
     .fromTo(unroll,{autoAlpha:0},{autoAlpha:1,duration:.003},.503)
     .fromTo(unroll,{x:()=>band().x-B(tableWrap).x,y:()=>band().y-B(tableWrap).y,scaleX:()=>band().w/B(tableWrap).w,scaleY:()=>band().h/B(tableWrap).h},{x:0,y:0,scaleX:1,scaleY:1,duration:.024,ease:'power2.inOut',...IR},.503)
     .fromTo(q(hero3,'.g1-who__glow'),{scale:1.5},{scale:1,duration:.02,...IR},.505)
     .fromTo(tableWrap,{autoAlpha:0},{autoAlpha:1,duration:.006},.526)
     .fromTo(unroll,{autoAlpha:1},{autoAlpha:0,duration:.01,...IR},.531)
     .fromTo(rows,{x:-50,autoAlpha:0},{x:0,autoAlpha:1,duration:.01,stagger:.004},.53)
     .fromTo(qa(s3,'.g1-table .g1-fill'),{opacity:0},{opacity:1,duration:.006,stagger:.001},.553)
     .fromTo(streams,{autoAlpha:1},{autoAlpha:0,duration:.012,...IR},.575)
    // 03-5 GROUP (0.58-0.75): the rows sort, the crowd walks into three piles, the counts
    // climb, and the guess comes back and cracks in two.
     .fromTo(hero3,heroFrom('b3'),{...heroTo('b4'),duration:.02,...IR},.58)
     .fromTo(groups,{autoAlpha:0},{autoAlpha:1,duration:.006},.585)
     .fromTo(qa(groups,'.g1-group'),{scaleX:0},{scaleX:1,duration:.015,stagger:.006,ease:'power3.out'},.587)
     .fromTo(rows,{'--tint':0},{'--tint':1,duration:.02},.6);
    rows.forEach((r,i)=>T.fromTo(r,{y:0},{y:()=>(sortIdx[i]-i)*r.offsetHeight,duration:.025,ease:'power2.inOut',...IR},.6));
    persons.forEach((p,i)=>{const fly=()=>fitIn(p,slotFor(p),st3);T.fromTo(p,{x:0,y:0,scale:1},{x:()=>fly().x,y:()=>fly().y,scale:()=>fly().scale,duration:.03,ease:'power2.inOut',...IR},.605+i*.0018)});
    T.fromTo(persons,{color:'#9a9086'},{color:(i,el)=>({gift:'#ffe2c2',self:'#d4f5e4',spa:'#dde3ff'})[el.dataset.g],duration:.02,stagger:.0018},.615)
     .fromTo(assume,{autoAlpha:0,x:0,y:0,rotation:0},{autoAlpha:1,x:()=>B(anchor('assume4')).x-B(assume).x,y:()=>B(anchor('assume4')).y-B(assume).y,rotation:-3,duration:.015,...IR},.64)
     .fromTo(q(assume,'.g1-assume__stamp'),{autoAlpha:1},{autoAlpha:0,duration:.002,...IR},.638)
     .fromTo(assume,{'--crack':0},{'--crack':1,duration:.025},.664)
     .fromTo(face,{autoAlpha:1},{autoAlpha:0,duration:.002,...IR},.69)
     .fromTo(shards,{autoAlpha:0},{autoAlpha:1,duration:.002},.69)
     .fromTo(shards[0],{x:0,y:0,rotation:0},{x:-22,y:10,rotation:-5,duration:.03,...IR},.692)
     .fromTo(shards[1],{x:0,y:0,rotation:0},{x:24,y:-6,rotation:6,duration:.03,...IR},.692)
     .fromTo(q(assume,'.g1-assume__crack'),{autoAlpha:0,scale:2},{autoAlpha:1,scale:1,duration:.01,ease:'power4.in'},.7)
    // 03-6 DESCRIBE + TEST (0.75-1): the table rolls up into the persona card, the bottle
    // lands in the customer's hand, the fields fill, ten orders get checked.
     .fromTo(tableWrap,{scaleY:1,autoAlpha:1},{scaleY:0,autoAlpha:0,duration:.025,ease:'power2.in',...IR},.75)
     .fromTo(assume,{autoAlpha:1},{autoAlpha:0,duration:.012,...IR},.752)
     .fromTo(personaPanel,{autoAlpha:0},{autoAlpha:1,duration:.004},.762)
     .fromTo(personaCard,{scaleY:0},{scaleY:1,duration:.025,ease:'power3.out'},.764)
     .fromTo(hero3,heroFrom('b4'),{...heroTo(q(s3,'.g1-persona__hand')),duration:.03,...IR},.766);
    qa(s3,'.g1-persona__body-copy').forEach(card=>T.fromTo(qa(card,'dl>div'),{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.008,stagger:.004},.79));
    T.fromTo(qa(s3,'.g1-split i'),{scaleX:0},{scaleX:1,duration:.015},.805)
     .fromTo(qa(s3,'.g1-popia'),{autoAlpha:0},{autoAlpha:1,duration:.01},.818)
     .fromTo(q(s3,'.g1-audience'),{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.01},.824)
     .fromTo(q(s3,'.g1-know-them'),{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.012},.832)
     .fromTo(q(s3,'.g1-test'),{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.012},.845)
     .fromTo(qa(s3,'.g1-test__orders i'),{'--ok':0},{'--ok':1,duration:.006,stagger:.008},.862)
     .fromTo(q(s3,'.g1-industries'),{autoAlpha:0,x:60},{autoAlpha:1,x:0,duration:.015},.875)
     // Pin the timeline length to exactly 1 so scroll progress equals beat position.
     .to({},{duration:.001},.999);
    // The title builds in order on arrival: ENGAGE, its highlight, WITH WHO, then the
    // giant "?" (a seam from scene 02 brings the "?" in itself).
    let titleTl=null,seamQ=0;
    function titleIntro(withQ){
      titleTl?.progress(1).kill();
      titleTl=G.timeline({defaults:{ease:'power3.out'}})
        .fromTo(q(s3,'.g1-who__engage'),{y:40,autoAlpha:0,'--hl':0},{y:0,autoAlpha:1,duration:.7})
        .to(q(s3,'.g1-who__engage'),{'--hl':1,duration:.7},'+=.15')
        .fromTo(q(s3,'.g1-who__with'),{x:-40,autoAlpha:0},{x:0,autoAlpha:1,duration:.6},'+=.4');
      if(withQ)titleTl.fromTo(qmark,{scale:3,autoAlpha:0,rotation:-25},{scale:1,autoAlpha:1,rotation:0,duration:.8,ease:'back.out(1.8)'},'+=.4');
    }
    ST.create({trigger:s3,start:'top 75%',onEnter:()=>titleIntro(performance.now()-seamQ>1500),onEnterBack:()=>titleTl?.progress(1)});
    // Text layers follow scroll progress directly: ScrollTrigger renders the scrubbed
    // timeline with callbacks suppressed on a jump (deep link, refresh), so no onUpdate text.
    function whoUpdate(p){
      countEls.forEach(b=>{b.textContent=String(Math.round(Number(b.dataset.count)*clamp01((p-.6)/.05)))});
      surveyOut.forEach((el,k)=>{const f=clamp01((p-(.302+k*.02))/.016);el.textContent=el.dataset.fill.slice(0,Math.round(el.dataset.fill.length*f))});
      const beat=whoBeats.filter(t=>p>=t).length;
      if(beat!==whoBeat){whoBeat=beat;s3.dataset.beat=String(beat)}
      const step=p<.24?'':p<.58?'gather':p<.75?'group':p<.86?'describe':'test';
      methodButtons.forEach(b=>b.classList.toggle('is-on',b.dataset.step===step));
      if(p>=.43&&p<.46&&whoTimer.state==='idle'&&auto.state==='running'&&scenes[index]===s3)timerStart();
      if(p<.36&&whoTimer.state==='done')timerReset();
    }
    // Ambient loops: the stage keeps moving inside every beat and hold (A2.2).
    persons.forEach((p,i)=>loopOf(s3,G.fromTo(q(p,'b'),{y:0},{y:-7,duration:1.3+(i%5)*.21,ease:'sine.inOut',yoyo:true,repeat:-1}).seek(i*.29)));
    loopOf(s3,
      G.to(q(hero3,'.g1-who__bottle'),{y:-12,duration:2.4,ease:'sine.inOut',yoyo:true,repeat:-1}),
      G.to(qmark,{y:-12,duration:2.2,ease:'sine.inOut',yoyo:true,repeat:-1}),
      G.to(qa(s3,'.g1-test__orders i'),{y:-4,duration:.9,ease:'sine.inOut',stagger:{each:.12,repeat:-1,yoyo:true}})
    );
    g1Hooks.persona=()=>{const card=qa(s3,'.g1-persona__body-copy').find(c=>getComputedStyle(c).display!=='none');if(card)G.fromTo(card,{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.45,ease:'power3.out',overwrite:true})};

    // ===== Seams: Next from 01 and 02 hands the protagonist over (D-05, D4, D14) =====
    g1Hooks.seam=(from,to,top,focusHeading)=>{
      if(to!==from+1||from>1||!G)return false;
      const flights=[];
      const layer=document.createElement('div');layer.className='g1-seam';layer.setAttribute('aria-hidden','true');
      Object.assign(layer.style,{position:'fixed',inset:'0',zIndex:'29',pointerEvents:'none',background:from===0?'#1c1712':'#123629'});
      const fly=(el,target,kind)=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(!r.width||r.bottom<0||r.top>innerHeight||cs.visibility==='hidden'||Number(cs.opacity)<.1)return;
        const c=kind==='dot'?Object.assign(document.createElement('i'),{className:'g1-seam__dot',textContent:el.textContent}):el.cloneNode(true);
        c.removeAttribute?.('id');c.setAttribute('aria-hidden','true');
        Object.assign(c.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',margin:'0',transform:'none',translate:'none',rotate:'none',zIndex:'29',pointerEvents:'none',visibility:'visible',opacity:'1'});
        flights.push({c,target,kind})};
      if(from===0){fly(bottle,q(s2,'.g1-eco__core'),'bottle');dots.forEach((dot,k)=>fly(dot,words[k],'dot'))}
      else{fly(q(s2,'.g1-eco__core'),q(s3,'.g1-who__bottle'),'bottle');const whom=q(s2,'.g1-chip--whom');if(details.optimize.style.visibility!=='hidden'&&Number(details.optimize.style.opacity)>.5)fly(whom,qmark,'chip')}
      document.body.append(layer,...flights.map(f=>f.c));
      setAuto('jumping');
      if(from===1)seamQ=performance.now();
      scrollTo({top,behavior:'instant'});update();ST.update();
      if(from===1){if(!titleTl)titleIntro(false);G.set(qmark,{autoAlpha:0})}
      const targets=flights.map(f=>f.target);
      G.set(targets,{visibility:'hidden'});
      const done=()=>{if(!layer.isConnected)return;layer.remove();flights.forEach(f=>f.c.remove());G.set(targets,{clearProps:'visibility'});
        if(from===1){G.fromTo(qmark,{autoAlpha:1,scale:1.6,rotation:-12},{autoAlpha:1,scale:1,rotation:0,duration:.6,ease:'back.out(2)'})}
        if(focusHeading){const heading=scenes[to].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true})}
        restartSceneMotion()};
      requestAnimationFrame(()=>{
        G.to(layer,{autoAlpha:0,duration:.5,ease:'power2.out'});
        flights.forEach(({c,target,kind})=>{
          const r=target.getBoundingClientRect();
          if(kind==='dot'){G.to(c,{left:r.left+r.width/2-22,top:r.top+r.height/2-22,scale:1.5,duration:.5,ease:'power3.inOut'});G.to(c,{autoAlpha:0,duration:.18,delay:.4});G.delayedCall(.4,()=>G.set(target,{clearProps:'visibility'}))}
          else if(FlipPlugin&&kind!=='chip')FlipPlugin.fit(c,target,{duration:.55,ease:'power3.inOut'});
          else G.to(c,{left:r.left,top:r.top,width:r.width,height:r.height,duration:.55,ease:'power3.inOut'});
        });
        G.delayedCall(.56,done);
      });
      setTimeout(done,1200);
      return true;
    };

    // Loops of a scene that is off screen sleep (GSAP and CSS), so only the visible stage pays for motion.
    [s1,s2,s3].forEach(scene=>{const sleep=on=>{scene.classList.toggle('g1-off',!on);ambientOf.get(scene).forEach(t=>on?t.resume():t.pause())};
      ST.create({trigger:scene,start:'top bottom',end:'bottom top',onToggle:self=>sleep(self.isActive),onRefresh:self=>sleep(self.isActive)})});
    addEventListener('resize',relayout);
    ST.refresh();
    if(document.fonts?.ready)document.fonts.ready.then(()=>{ST.refresh();relayout()});
    return ()=>{
      document.documentElement.classList.remove('g1-motion');
      removeEventListener('resize',relayout);
      ST.removeEventListener('refreshInit',syncUnroll);
      hero.removeEventListener('pointerdown',dragDown);hero.removeEventListener('pointermove',dragMove);hero.removeEventListener('pointerup',dragEnd);hero.removeEventListener('pointercancel',dragEnd);
      g1Hooks.eco=null;g1Hooks.persona=null;g1Hooks.seam=null;ecoPlay(null);titleTl?.kill();G.ticker.remove(orbitTick);
      ambient.forEach(t=>t.kill());
      added.forEach(el=>el.remove());
      delete s3.dataset.beat;wordsBox.style.zIndex='';[s1,s2,s3].forEach(scene=>scene.classList.remove('g1-off'));
      qa(document,'.g1 output[data-fill]').forEach(el=>{el.textContent=el.dataset.fill});
      qa(s3,'.g1-group b[data-count]').forEach(b=>{b.textContent=b.dataset.count});
      counters.forEach(b=>{b.textContent=b.dataset.count});
      qa(document,'.g1 .is-hot,.g1 .is-typing').forEach(el=>el.classList.remove('is-hot','is-typing'));
    };
  });

  // Deep links land at once (D18), then again after fonts and images settle.
  const initial=parseSceneHash();
  if(initial){
    restoreSceneHash();update();
    // A late refresh on load (fonts, images, ScrollTrigger) must not leave the deck on scene 01.
    const recheck=()=>{const target=parseSceneHash();if(target&&index!==target.number-1&&['running','waiting'].includes(auto.state))restoreSceneHash()};
    const afterLoad=()=>{requestAnimationFrame(recheck);setTimeout(recheck,400);setTimeout(recheck,1200);document.fonts?.ready.then(()=>requestAnimationFrame(recheck))};
    if(document.readyState==='complete')afterLoad();else addEventListener('load',afterLoad,{once:true});
  }
  else queueUpdate();
})();

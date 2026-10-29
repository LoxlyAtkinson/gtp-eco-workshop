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
  let index=-1, section=-1, frame=0, beatTimer=0, autoHashAt=0;
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
  const mobileContexts=['THE WORKSHOP PROMISE','THE ECO LOOP','ENGAGE · WITH WHO?','ENGAGE · WHERE?','ENGAGE · WHAT?','ENGAGE · MAKE IT YOURS','ENGAGE · BE FOUND','CONVERT · CAPTURE','CONVERT · FOLLOW UP','OPTIMIZE','ATTRACT','INTERACT, THEN TEACH AI','USE AI RESPONSIBLY','YOUR TURN · TOOLS','KEEP LEARNING · 7-DAY TEST'];
  scenes.forEach((scene,i)=>scene.querySelector('.scene__eyebrow')?.setAttribute('data-mobile-context',mobileContexts[i]));
  // Visual sections (owner 2026-10-29): one entry = one distinct screen the presenter
  // calls a slide; the footer shows it as scene.section (5.2) and Next/Prev step through
  // them. `p` is the scene's scroll progress where that section is fully on screen,
  // measured by stepping every scene in Chrome at 1366x768 (survey 2026-10-29). Scenes
  // 04-07 switch plates on chapter beats, so their sections name the BEAT that brings the
  // plate in; the reveal point follows the beat's start in data-beats if beats are retimed.
  const SECTIONS_SPEC={
    '01':[{id:'title',p:0,what:'Be found. Be chosen. Keep learning. The bottle'},{id:'hands',p:.62,what:'Show of hands: who posted and cannot say which post sold'}],
    '02':[{id:'loop',p:0,what:'Growth is a loop: Engage, Convert, Optimize orbit the bottle'},{id:'engage',p:.17,what:'Engage: what makes people respond, the post and its reactions'},{id:'convert',p:.44,what:'Convert: give them a clear next step, the sample form'},{id:'optimize',p:.73,what:'Optimize: failures and successes, why and to whom'}],
    '03':[{id:'title',p:0,what:'ENGAGE, who is making the decision, the crowd'},{id:'doubt',p:.19,what:'Do you really know who buys from you? The guess gets stamped'},{id:'gather',p:.41,what:'Gather: buy, inquire, come back, the checkout survey, your turn'},{id:'rows',p:.565,what:'The records pour into the table'},{id:'group',p:.72,what:'Group: three piles, the guess cracks'},{id:'describe',p:.81,what:'Describe: the persona card'},{id:'test',p:.9,what:'Test it on your next 10 orders, any industry'}],
    '04':[{id:'skills',beat:'04-1',what:'Skills and what to use when: nine skills'},{id:'questionnaire',beat:'04-2',what:'Answers about the business, the runs waiting'},{id:'runs',beat:'04-3',what:'Start the runs: watch the nine demo skills work'},{id:'tools',beat:'04-4',what:'Three tools do the work, the runs done'},{id:'research',beat:'04-5',what:'Where do they spend their time? What the example shows'},{id:'platforms',beat:'04-6',what:'The platform map for the Gift Planner'},{id:'instagram',beat:'04-7',what:'Instagram: to be seen'},{id:'whatsapp',beat:'04-8',what:'WhatsApp: to sell'},{id:'linkedin',beat:'04-9',what:'LinkedIn: the launching founder'},{id:'verdict',beat:'04-10',what:'Verdict for Amberkloof'},{id:'vote',beat:'04-11',what:'Room vote: pick 2 or 3 platforms'}],
    '05':[{id:'ask',beat:'05-1',what:'AI can help put the answer in the ad',title:'AI can help put <em>the answer in the ad.</em>'},{id:'brands',beat:'05-3',what:'AI can help you know your competition',title:'AI can help you know <em>your competition.</em>'},{id:'recipe',beat:'05-4',what:'Study their wins and their weak points',title:'Study their wins <em>and their weak points.</em>'},{id:'gaps',beat:'05-5',what:'AI can help identify the gaps',title:'AI can help identify <em>the gaps.</em>'},{id:'b2b',beat:'05-6',what:'Use the correct AI tools: B2B find in two steps',title:'Use the correct <em>A.I. tools.</em>'},{id:'rule',beat:'05-7',what:'Copy what works. Then fill the gap',title:'Copy what works. <em>Then fill the gap.</em>'}],
    '06':[{id:'drafts',beat:'06-1',what:'AI helps with ideas and drafts: post ideas, caption, product description',title:'AI helps with <em>ideas and drafts.</em>'},{id:'claude',beat:'06-3',what:'Claude: the app and the chat, Claude Code. Free Smart AI Unslop skill',title:'AI drafts fast. <em>You make it yours.</em>'},{id:'same',beat:'06-5',what:'Theirs, yours, everyone’s: the same one-line prompt',title:'AI drafts fast. <em>You make it yours.</em>'},{id:'habits',beat:'06-6',what:'Now, how to prompt: style, references, numbers and the short clip',title:'Now, how <em>to prompt.</em>'},{id:'system',beat:'06-7',what:'A.I. / Claude can help extract your brand identity: one on-brand post',title:'A.I. / Claude can help extract <em>your brand identity.</em>'},{id:'ads',title:'AI drafts fast. <em>You make it yours.</em>',beat:'06-8',what:'Real ads to study'},{id:'slop-caption',beat:'06-9',what:'slopmonster: Instagram caption, without and with',title:'Your voice. <em>No AI filler.</em>'},{id:'slop-product',beat:'06-10',what:'slopmonster: product description',title:'Your voice. <em>No AI filler.</em>'},{id:'slop-whatsapp',beat:'06-11',what:'slopmonster: WhatsApp follow-up',title:'Your voice. <em>No AI filler.</em>'},{id:'trend',beat:'06-13',what:'AI can help identify your buyers pain points: the daily brief',title:'AI can help identify <em>your buyers’ pain points.</em>'},{id:'week',beat:'06-14',what:'One quick loop: a week of posts in minutes',title:'AI can help diversify <em>your marketing direction.</em>'}],
    '07':[{id:'tunnel',beat:'07-1',what:'Be found where people ask: the AI assistants, they trust what they bring back',title:'Be found <em>where people ask.</em>'},{id:'seo-aeo',beat:'07-3',what:'SEO and AEO',title:'SEO, AEO and GEO: <em>be the answer.</em>'},{id:'keywords',beat:'07-4',what:'Check 1: the words to rank for',title:'What matters <em>for SEO.</em>'},{id:'seo-check',beat:'07-5',what:'Check 2: what blocks being found',title:'What matters <em>for SEO.</em>'},{id:'backlinks',beat:'07-6',what:'Check 3: backlinks',title:'What matters <em>for SEO.</em>'},{id:'citations',beat:'07-7',what:'Check 4: citations, 41/100',title:'What matters <em>for SEO.</em>'},{id:'pages',beat:'07-8',what:'Which page gets found? Average and good',title:'AI helps you <em>be relevant.</em>'},{id:'plan',beat:'07-9',what:'90-day website plan, B2B Tumelo',title:'AI can help plan <em>your next 90 days.</em>'},{id:'answer',beat:'07-11',what:'Gift sets for 20 guests: the answer card',title:'Always have a clear CTA.<br><em>Drive your most active channel.</em>'}],
    // 08-10: the plate ranges are the data-in / data-out values in index.html.
    '08':[{id:'title',p:0,what:'While you have their attention, give them a next step: the landing page',title:'AI can help give them <em>a next step.</em>'},{id:'analytics',p:.13,what:'Where do they land? The landing-page numbers',title:'AI can help show you <em>where they land.</em>'},{id:'helper',p:.345,what:'Help first. Then ask: the website helper and the capture',title:'AI can help them <em>before you ask.</em>'},{id:'dwell',p:.39,what:'Still reading? Offer help',title:'AI can spot who is <em>still reading.</em>'},{id:'reel',p:.495,what:'Good vs average, in one real reel',title:'Study a good reel <em>next to an average one.</em>'},{id:'ours',p:.565,what:'Ours: the next step lives inside the ad',title:'Put the next step <em>inside the ad.</em>'},{id:'ads',p:.712,what:'Real ads with the next step built in',title:'Study real ads <em>with a next step.</em>'},{id:'skills',p:.78,what:'The skills behind this',title:'Use the correct <em>A.I. tools.</em>'},{id:'b2b',p:.85,what:'B2B: same idea, different fields',title:'AI can help with <em>B2B leads too.</em>'},{id:'track',p:.92,what:'Lerato is in. Now the follow-up starts',title:'AI can help start <em>the follow-up.</em>'}],
    '09':[{id:'orbit',p:0,what:'Sales / support funnels: where AI answers',title:'Sales / support <em>funnels.</em>'},{id:'clock',p:0.476,what:'Interact with the correct answer, fast: 2 minutes or 2 days',title:'AI can help you <em>answer fast.</em>'},{id:'funnel',p:0.67,what:'The funnel: what happens after they say yes',title:'AI can help map <em>what happens after yes.</em>'},{id:'crm',p:0.933,what:'Ask AI to build it with you: a simple CRM',title:'AI can help build <em>your simple CRM.</em>'}],
    '10':[{id:'optimize',p:0,what:'What worked, and for whom? OPTIMIZE',title:'AI can help show <em>what worked, and for whom.</em>'},{id:'dashboard',p:.27,what:'The website turns into this week’s dashboard',title:'AI can help build <em>your weekly dashboard.</em>'},{id:'sort',p:.47,what:'Failures and successes, why and to whom',title:'AI can help sort <em>wins from failures.</em>'},{id:'compare',p:.535,what:'Average counts likes, good counts inquiries',title:'Count inquiries, <em>not likes.</em>'},{id:'double-down',p:.655,what:'Double down, fix, stop',title:'AI can help you choose: <em>double down, fix, stop.</em>'},{id:'tuesday',p:.86,what:'Tuesday’s post. Let’s fix it',title:'AI can help fix <em>Tuesday’s post.</em>'}],
    // 11-15: plates are the .c15-beat ranges in chapters/ch-1115.js (talk seconds, 0 to 0.92).
    '11':[{id:'ai',p:0,what:'E to Attract, C to Interact'},{id:'flat',p:.2,what:'The flat phone snapshot: average'},{id:'stage',p:.45,what:'The built stage: light, depth, break-out, offer, next step'},{id:'why',p:.6,what:'Whatever you are creating, it needs to be attractive'},{id:'gallery',p:.73,what:'Real ads. What made people stop?'},{id:'ours',p:.85,what:'Our pair: average snapshot, good vertical, B2B'},{id:'pullback',p:.925,what:'What good looks like: the shop window'}],
    '12':[{id:'title',p:0,what:'First attract. Then interact'},{id:'burst',p:.105,what:'Tap a product: the burst'},{id:'select',p:.209,what:'A static product picture versus the gift-box builder'},{id:'teach',p:.398,what:'AI needs to see what good looks like'},{id:'judge',p:.44,what:'1 Judge: three fresh critics'},{id:'recreate',p:.565,what:'2 Recreate the look'},{id:'reinteract',p:.711,what:'3 Recreate an interaction'},{id:'success',p:.836,what:'Show AI what success looks like'},{id:'ask',p:.878,what:'Can you help me choose a gift?'}],
    '13':[{id:'draft',p:0,what:'Before you post: check, be honest, protect. The draft and its claims'},{id:'honest',p:.405,what:'The honest rewrite'},{id:'paste',p:.545,what:'Would you paste this into a public AI tool?'},{id:'answers',p:.665,what:'The answers: paste or do not paste'},{id:'three',p:.82,what:'Check. Be honest. Protect.'},{id:'consent',p:.87,what:'Consent recap'}],
    '14':[{id:'title',p:0,what:'Now for a real business in the room: open the live stage'},{id:'qr',p:.184,what:'Scan now and run your own business'},{id:'gift',p:.429,what:'Giveaway: three of you get Smart AI Social Assistant free'}],
    '15':[{id:'box',p:0,what:'Prominent free skills QR and giveaway'},{id:'still',p:.736,what:'Still here. Still building: final close'}]
  };
  // Beat sections land just past the beat's start (the same p-ranges as chapters/ch-0407.js).
  const beatCache=new Map();
  function resolveSections(scene){
    const spec=SECTIONS_SPEC[scene.dataset.scene];
    if(!spec)return null;
    const beats=scene.dataset.beats||'';
    const hit=beatCache.get(scene);
    if(hit&&hit.beats===beats)return hit.list;
    const parts=beats.split(',').filter(Boolean).map(x=>{const [id,s]=x.split(':');return {id,sec:Number(s)||0}});
    const total=parts.reduce((a,b)=>a+b.sec,0)||1;
    let acc=0;const start={};parts.forEach(b=>{start[b.id]=acc/total*.92;acc+=b.sec});
    // A beat id that is no longer in data-beats drops out instead of breaking the list.
    const list=spec.map(s=>!s.beat?s:s.beat in start?{...s,p:start[s.beat]?Math.min(1,start[s.beat]+.007):0}:null).filter(Boolean).sort((a,b)=>a.p-b.p);
    if(!list.length||list[0].p>0)list.unshift({id:'start',p:0,what:'Scene start'});
    beatCache.set(scene,{beats,list});
    return list;
  }

  // 2026-10-28 merge: the old Amina/lunch connectors are gone. Every numbered
  // scene (04-15 rebuilt as chapters/ch-*.js) hands over directly on Next.

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
  function update(){
    frame=0;
    const ease=(start,end,value)=>{const t=Math.max(0,Math.min(1,(value-start)/(end-start)));return t*t*(3-2*t)};
    const cursor=innerHeight*.42;
    let active=0;
    const progressAll=[];
    for(let i=0;i<scenes.length;i++){
      const rect=scenes[i].getBoundingClientRect();
      const travel=Math.max(1,rect.height-innerHeight);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      progressAll[i]=progress;
      scenes[i].style.setProperty('--p',progress.toFixed(4));
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
    document.body.style.setProperty('--active-p',scenes[active].style.getPropertyValue('--p')||'0');
    // The footer counts visual sections (scene.section); it changes inside a scene too.
    const activeSection=sectionAt(active,progressAll[active]);
    if(active===index&&activeSection===section)return;
    const sceneChanged=active!==index;
    index=active;section=activeSection;
    renderCounter();
    sectionTitle();
    if(!sceneChanged)return;
    scenes.forEach((scene,i)=>scene.classList.toggle('is-active',i===index));
    const scene=scenes[index];
    document.body.dataset.stage=scene.dataset.stage;
    document.body.dataset.scene=scene.dataset.scene;
    stage.textContent=scene.dataset.stage.toUpperCase();
    document.getElementById('presenterNotesTitle').textContent=`Presenter notes · ${String(index+1).padStart(2,'0')} / ${scenes.length}`;
    document.getElementById('presenterNotesText').textContent=scene.querySelector('.speaker-note')?.textContent.trim()||'No presenter note for this scene.';
    fill.style.width=`${(index+1)/scenes.length*100}%`;
    track.setAttribute('aria-valuenow',String(index+1));
    grid.querySelectorAll('button').forEach((button,i)=>i===index?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
    const chapter=[...rail].reverse().find(button=>Number(button.dataset.chapter)<=index);
    rail.forEach(button=>button===chapter?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
  }
  function queueUpdate(){if(!frame)frame=requestAnimationFrame(update)}
  // ---- Visual sections (owner 2026-10-29) ---------------------------------
  // Reduced motion and print show each scene as one static page, so there a scene is one section.
  const sectionsOf=i=>!reduced.matches&&G&&scenes[i]&&resolveSections(scenes[i])||[{id:'scene',p:0}];
  // The section on screen: the last one whose reveal point the scroll has reached.
  // .006 tolerance: a #SS-PP hash keeps whole percents, so a reload must still count as that section.
  function sectionAt(i,p){const list=sectionsOf(i);let k=0;for(let j=1;j<list.length;j++)if(p>=list[j].p-.006)k=j;return k}
  const sectionName=(i,k)=>`${i+1}.${k+1}`;
  // Scenes whose sections carry a title: the pinned heading shows the current section's title.
  // A section without one shows the last titled section before it.
  function sectionTitle(){
    const h=scenes[index].querySelector('h2[id$="-title"]'),list=sectionsOf(index);
    if(!h||!list.some(s=>s.title))return;
    const title=list.slice(0,section+1).reverse().find(s=>s.title)?.title;
    if(title&&h.innerHTML!==title)h.innerHTML=title;
  }
  function stepTarget(dir){
    const from=auto.state==='jumping'&&navTarget?navTarget:{i:index,k:section};
    const list=sectionsOf(from.i);
    if(dir>0)return from.k+1<list.length?{i:from.i,k:from.k+1}:from.i+1<scenes.length?{i:from.i+1,k:0}:null;
    if(from.k>0)return {i:from.i,k:from.k-1};
    return from.i>0?{i:from.i-1,k:sectionsOf(from.i-1).length-1}:null;
  }
  function renderCounter(){
    const list=sectionsOf(index),last=index===scenes.length-1&&section===list.length-1;
    count.textContent=`${sectionName(index,section)} · ${scenes.length}`;
    count.setAttribute('aria-label',`Scene ${index+1} of ${scenes.length}, section ${section+1} of ${list.length}`);
    const ahead=stepTarget(1),back=stepTarget(-1);
    prev.disabled=!back;next.disabled=!ahead;
    prev.setAttribute('aria-label',back?(back.i===index?`Previous section, ${sectionName(back.i,back.k)}`:`Previous scene, ${sectionName(back.i,back.k)}`):'Previous section');
    next.setAttribute('aria-label',ahead?(ahead.i===index?`Next section, ${sectionName(ahead.i,ahead.k)}`:`Next scene, ${sectionName(ahead.i,ahead.k)}`):'End of the presentation');
    next.innerHTML=last?'End':'Next <span aria-hidden="true">→</span>';
  }
  // Next/Prev (button, ArrowRight/PageDown, ArrowLeft/PageUp) step one section. Inside a
  // scene, and back into the previous scene's last section, the scroll GLIDES to the
  // section's reveal point, so every scroll-linked animation on the way plays as if the
  // presenter scrolled. Past a scene's last section, Next uses the scene transition (go).
  let navTarget=null;
  function step(dir){
    if(index<0)update();
    const t=stepTarget(dir);
    if(!t)return;
    if(t.k===0&&t.i!==index)return go(t.i,true);
    glideTo(t.i,t.k);
  }
  // Section .1 is the scene top (with go()'s phone header offset); the rest are reveal points.
  function sectionY(i,k){const scene=scenes[i],p=sectionsOf(i)[k]?.p||0;return scene.getBoundingClientRect().top+scrollY+Math.max(0,scene.offsetHeight-innerHeight)*p-(p===0&&innerWidth<=900?58:0)}
  function glideTo(i,k){
    if(k===0&&i!==index)return go(i,true);
    navSerial++;
    const scene=scenes[i],target=sectionsOf(i)[k];
    history.replaceState(null,'',`#${scene.dataset.scene}-${String(Math.min(99,Math.round(target.p*100))).padStart(2,'0')}`);
    ecoManualChoice=false;
    killJump();
    navTarget={i,k};
    const y=sectionY(i,k);
    if(reduced.matches||!G){scrollTo({top:y,behavior:'instant'});navTarget=null;restartSceneMotion();return}
    setAuto('jumping','section');
    // 1.5-3 s, longer for longer distances: the animations on the way play at a readable pace.
    const duration=Math.min(3,Math.max(1.5,1.1+Math.abs(y-scrollY)/innerHeight*.3));
    const glide={y:scrollY};
    auto.jump=G.to(glide,{y,duration,ease:'sine.inOut',overwrite:true,
      onUpdate:()=>scrollTo({top:glide.y,behavior:'instant'}),
      onComplete:()=>{auto.jump=null;const settled=sectionY(i,k);if(Math.abs(settled-scrollY)>2)scrollTo({top:settled,behavior:'instant'});navTarget=null;restartSceneMotion()}});
    const jump=auto.jump;setTimeout(()=>{if(auto.jump===jump)jump.progress(1)},duration*1000+1500);
  }
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
  // The hash is read once per landing; a load-time recheck passes the original
  // target because auto-scroll keeps rewriting the hash with the live beat.
  function restoreSceneHash(target=parseSceneHash()){
    if(!target)return;
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
    killJump();
    navTarget={i:to,k:0};
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
  // A glide still in flight owns the scroll: a late seam or timer callback must not restart
  // the auto-scroll under it (the glide's own onComplete restarts it).
  function killJump(){auto.jump?.kill();auto.jump=null}
  function restartSceneMotion(){if(auto.jump)return;navTarget=null;update();setAuto('running')}
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
  prev.addEventListener('click',()=>step(-1));
  next.addEventListener('click',()=>step(1));
  // Speaker directions belong on the separate presenter display, never on the audience screen.
  notes.textContent='Presenter view ↗';
  notes.setAttribute('aria-label','Open presenter view in a separate window');
  notes.removeAttribute('aria-pressed');
  if(!['localhost','127.0.0.1'].includes(location.hostname))notes.hidden=true;
  notes.addEventListener('click',()=>{
    window.open('./presenter.html','gtp-presenter-view','width=1100,height=780');
  });
  document.getElementById('overviewButton').addEventListener('click',()=>overview.showModal());
  document.getElementById('closeOverview').addEventListener('click',()=>overview.close());
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-goto]');if(!button)return;overview.close();go(Number(button.dataset.goto),true)});
  rail.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.chapter),true)));
  // Keyboard: Space pauses/resumes; PageDown/ArrowRight = Next section and
  // PageUp/ArrowLeft = Prev section (presenter clickers); arrow up/down scroll by hand
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
    if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();step(1);return}
    if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();step(-1);return}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){manualPause();return}
    if(event.key==='-'||event.key==='_')stepSpeed(-1);
    if(event.key==='='||event.key==='+')stepSpeed(1);
  });
  addEventListener('hashchange',()=>restoreSceneHash());
  // Chapter scripts hold the scroll like scene 02's clicks: scroll stops, ambient motion keeps running.
  window.deckHold=()=>{if(auto.state==='running')setAuto('held','click')};
  // Public navigation (chapters/presenter-link.js, chapters/voice-cues.js, tests). A move
  // to another scene must use goScene: the Next button now steps one section.
  window.deckNav={
    goScene:i=>go(i,true),next:()=>step(1),prev:()=>step(-1),
    get position(){update();const list=sectionsOf(index);return {scene:scenes[index]?.dataset.scene,section:section+1,sections:list.length,label:sectionName(index,section),id:list[section]?.id||''}},
    sections:num=>{const i=scenes.findIndex(s=>s.dataset.scene===num);return i<0?[]:sectionsOf(i).map(({id,p,what})=>({id,p:Number(p.toFixed(4)),what}))}
  };
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
    killJump();setAuto('jumping');
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
    const el=whoTimer.el;if(!el)return;el.dataset.state=whoTimer.state;el.setAttribute('aria-pressed',String(whoTimer.state==='running'));
    el.style.setProperty('--t',(whoTimer.left/40).toFixed(3));
    el.querySelector('.g1-timer__num').textContent=whoTimer.state==='done'?'✓':String(Math.ceil(whoTimer.left));
    el.querySelector('.g1-timer__txt').textContent=whoTimer.state==='running'?'Writing… tap to skip':whoTimer.state==='done'?'Done · moving on':'Start timer';
  }
  function timerStart(){
    if(!whoTimer.el||whoTimer.state==='running')return;
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
  whoTimer.el?.addEventListener('click',()=>{if(whoTimer.state==='running')timerFinish(true);else timerStart()});
  timerRender();

  // ---- G01-T03 presenter engine -------------------------------------------
  // Each numbered scene auto-scrolls on the GSAP ticker at a pace set by its
  // talk minutes (data-minutes), stops just above the next numbered scene's
  // top, and waits for Next. A connector after a scene is part of that
  // scene's travel. Opening Notes never holds the motion.
  const statusEl=document.getElementById('autoStatus'),statusText=document.getElementById('autoStatusText'),speedSelect=document.getElementById('speedSelect');
  // Talk time in SECONDS per numbered scene 01-15, from experience/presentation-script.md
  // (spine v2 cut tiers 1-3 plus two trims: sum 3640 s = 60:40). The one place to retune pace.
  const sceneSeconds=[120,180,305,250,265,375,295,260,140,160,245,220,135,75,100];
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
  // Holds that come from outside the engine: the overview grid and a hidden tab.
  function blocker(){
    if(overview.open)return 'Overview open';
    if(document.hidden)return 'Tab hidden';
    return '';
  }
  let lastStatus='';
  function renderStatus(){
    const block=reduced.matches?'':blocker();
    let state=reduced.matches?'reduced':auto.state,label;
    if(state==='reduced')label='Reduced motion · use Next';
    else if(block&&state==='running'){state='paused';label=`On hold · ${block}`}
    else if(state==='running')label=`Moving · ${auto.speed}×`;
    else if(state==='jumping')label=auto.reason==='section'&&navTarget?`Moving to ${sectionName(navTarget.i,navTarget.k)}`:'Moving to the next scene';
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
    const doubt=q(s3,'.g1-panel--doubt'),keep=q(s3,'.g1-keep'),method=q(s3,'.g1-method'),gather=q(s3,'.g1-panel--gather'),streams=q(s3,'.g1-panel--streams'),unroll=q(s3,'.g1-unroll'),tableWrap=q(s3,'.g1-table-wrap'),groups=q(s3,'.g1-panel--groups'),personaPanel=q(s3,'.g1-panel--persona'),personaCard=q(s3,'.g1-persona');
    const rows=qa(s3,'.g1-table tbody tr'),order=['gift','self','spa'];
    const sortIdx=rows.map((r,i)=>rows.map((x,j)=>({g:order.indexOf(x.dataset.group),j})).sort((m,n)=>m.g-n.g||m.j-n.j).findIndex(e=>e.j===i));
    const surveyOut=qa(s3,'.g1-survey output').map(el=>{el.dataset.fill=el.dataset.fill||el.textContent;return el});
    const band=()=>{const a=B(anchor('b3'));return {x:a.x+a.w*.11,y:a.y+a.h*.568,w:a.w*.78,h:a.h*.21}};
    const syncUnroll=()=>{const b=B(tableWrap);Object.assign(unroll.style,{left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px'})};
    syncUnroll();ST.addEventListener('refreshInit',syncUnroll);
    const slotFor=person=>{const g=person.dataset.g,i=persons.filter(p=>p.dataset.g===g).indexOf(person);return qa(s3,`.g1-group--${g} .g1-pile i`)[i]};
    G.set([doubt,assume,keep,method,gather,streams,unroll,tableWrap,groups,personaPanel,...shards,q(assume,'.g1-assume__crack')],{autoAlpha:0});
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
     .fromTo(gather,{autoAlpha:1},{autoAlpha:0,duration:.012,...IR},.448)
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
    // The chapter scripts (chapters/ch-*.js) run after this file and make their
    // scenes taller, so the first landing can end up far from the requested beat.
    // Land again on the ORIGINAL target if the scene or the position drifted.
    const loadSerial=navSerial;
    const recheck=()=>{if(navSerial!==loadSerial||!['running','waiting'].includes(auto.state))return;update();
      const scene=scenes[initial.number-1],want=scene.getBoundingClientRect().top+scrollY+Math.max(0,scene.offsetHeight-innerHeight)*initial.beat/100;
      // Auto-scroll only moves forward, so sitting more than 10% of a screen BEFORE the
      // target means a scene above grew after the landing (deep link to 05-00 showed 04's foot).
      if(index!==initial.number-1||Math.abs(scrollY-want)>innerHeight*.5||want-scrollY>innerHeight*.1){restoreSceneHash(initial);update();setAuto('running')}};
    const afterLoad=()=>{requestAnimationFrame(recheck);setTimeout(recheck,400);setTimeout(recheck,1200);setTimeout(recheck,2500);document.fonts?.ready.then(()=>requestAnimationFrame(recheck))};
    if(document.readyState==='complete')afterLoad();else addEventListener('load',afterLoad,{once:true});
  }
  else queueUpdate();
})();

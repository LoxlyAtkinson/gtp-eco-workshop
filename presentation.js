(() => {
  const scenes=[...document.querySelectorAll('.scene')];
  const count=document.getElementById('sceneCount'),stage=document.getElementById('stageLabel'),fill=document.getElementById('progressFill'),track=document.querySelector('.progress-track');
  const prev=document.getElementById('prevButton'),next=document.getElementById('nextButton'),notes=document.getElementById('notesButton');
  const overview=document.getElementById('overviewDialog'),grid=document.getElementById('overviewGrid'),rail=[...document.querySelectorAll('.chapter-rail button')];
  const cinemaButton=document.getElementById('cinemaButton');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 901px)');
  let index=Math.max(0,Math.min(scenes.length-1,Number(location.hash.slice(1))-1||0)),transitioning=false,lastWheel=0,pointerFrame=0,pending=null;
  const titleOf=s=>s.querySelector('h1,h2').innerText.replace(/\s+/g,' ').trim();
  grid.innerHTML=scenes.map((s,i)=>`<button type="button" data-goto="${i}"><span>${String(i+1).padStart(2,'0')} · ${s.dataset.stage.toUpperCase()}</span>${titleOf(s)}</button>`).join('');

  function commitScene(to,focus=false){
    index=Math.max(0,Math.min(scenes.length-1,to));
    scenes.forEach((s,i)=>{const active=i===index;s.classList.toggle('is-active',active);s.hidden=!active;s.setAttribute('aria-hidden',String(!active))});
    const current=scenes[index];
    document.body.dataset.stage=current.dataset.stage;document.body.dataset.scene=current.dataset.scene;
    count.textContent=`${String(index+1).padStart(2,'0')} / ${scenes.length}`;stage.textContent=current.dataset.stage.toUpperCase();
    fill.style.width=`${(index+1)/scenes.length*100}%`;track.setAttribute('aria-valuenow',String(index+1));
    prev.disabled=index===0;next.disabled=index===scenes.length-1;next.innerHTML=index===scenes.length-1?'End':'Next <span aria-hidden="true">→</span>';
    grid.querySelectorAll('button').forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
    const chapter=[...rail].reverse().find(b=>Number(b.dataset.chapter)<=index);
    rail.forEach(b=>b===chapter?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
    history.replaceState(null,'',`#${String(index+1).padStart(2,'0')}`);scrollTo({top:0,behavior:'instant'});
    if(focus){const h=current.querySelector('h1,h2');h.tabIndex=-1;h.focus({preventScroll:true})}
    return current;
  }
  function show(to,focus=false){
    if(to<0||to>=scenes.length)return;
    if(transitioning){pending={to,focus};return}
    if(to===index)return;
    if(reducedMotion.matches){commitScene(to,focus);return}
    transitioning=true;document.body.classList.add('is-transitioning');
    setTimeout(()=>{const current=commitScene(to,focus);current.classList.add('is-entering');setTimeout(()=>current.classList.remove('is-entering'),720)},330);
    setTimeout(()=>{document.body.classList.remove('is-transitioning');transitioning=false;if(pending){const nextRequest=pending;pending=null;show(nextRequest.to,nextRequest.focus)}},730);
  }
  prev.addEventListener('click',()=>show(index-1,true));next.addEventListener('click',()=>show(index+1,true));
  notes.addEventListener('click',()=>{const open=document.body.classList.toggle('show-notes');notes.setAttribute('aria-pressed',String(open))});
  document.getElementById('overviewButton').addEventListener('click',()=>overview.showModal());
  document.getElementById('closeOverview').addEventListener('click',()=>overview.close());
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-goto]');if(!b)return;overview.close();show(Number(b.dataset.goto),true)});
  rail.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.chapter),true)));
  addEventListener('keydown',e=>{
    if(overview.open||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    if(document.activeElement.closest('button,a,[role="button"]'))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(index+1,true)}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(index-1,true)}
  });
  addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=scenes.length)show(n-1)});
  addEventListener('wheel',e=>{
    if(!desktop.matches||e.ctrlKey||overview.open||transitioning||Math.abs(e.deltaY)<18||e.target.closest('dialog,textarea,input,select,button,a,[role="button"]'))return;
    const maxScroll=document.documentElement.scrollHeight-innerHeight;
    if(maxScroll>32&&e.deltaY>0&&scrollY<maxScroll-4)return;if(maxScroll>32&&e.deltaY<0&&scrollY>4)return;
    const now=performance.now();if(now-lastWheel<850){e.preventDefault();return}
    const destination=index+Math.sign(e.deltaY);if(destination<0||destination>=scenes.length)return;
    e.preventDefault();lastWheel=now;show(destination);
  },{passive:false});
  addEventListener('pointermove',e=>{
    if(reducedMotion.matches||!desktop.matches||pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{
      document.documentElement.style.setProperty('--pointer-x',`${((e.clientX/innerWidth)-.5)*18}px`);
      document.documentElement.style.setProperty('--pointer-y',`${((e.clientY/innerHeight)-.5)*18}px`);
      pointerFrame=0;
    });
  },{passive:true});
  cinemaButton.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{cinemaButton.textContent='Full-screen unavailable'}});
  document.addEventListener('fullscreenchange',()=>{const full=Boolean(document.fullscreenElement);cinemaButton.setAttribute('aria-pressed',String(full));cinemaButton.setAttribute('aria-label',full?'Exit full-screen presentation':'Enter full-screen presentation');cinemaButton.innerHTML=`${full?'Exit cinema':'Cinema'} <span aria-hidden="true">${full?'↙':'⛶'}</span>`});

  const evidenceButton=document.getElementById('evidenceReveal'),actualOrders=document.getElementById('actualOrders');actualOrders.hidden=true;
  evidenceButton.addEventListener('click',()=>{const open=evidenceButton.getAttribute('aria-expanded')!=='true';evidenceButton.setAttribute('aria-expanded',String(open));evidenceButton.firstChild.textContent=open?'Hide the order evidence ':'Reveal the last ten orders ';actualOrders.hidden=!open});
  const ecoMessages={engage:'Engage begins with evidence about who buys, where they look and what they need.',convert:'Convert gives that attention a useful next step and a prompt human reply.',optimize:'Optimize checks inquiries and sales, then improves the next round of engagement.'};
  document.querySelectorAll('[data-eco]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-eco]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.body.dataset.ecoActive=b.dataset.eco;document.getElementById('ecoFeedback').textContent=ecoMessages[b.dataset.eco]}));
  const channelReasons={visual:'Visual discovery earns a place when seeing the product helps someone decide. Pair it with a clear inquiry route.',community:'Local groups help when recommendations shape trust. Show up where real customer questions already appear.',search:'Search and Maps meet existing intent. Make your offer, area, opening details and next action easy to verify.',reply:'WhatsApp is the inquiry route. Reply promptly, record the need and agree on the next step.'};
  document.querySelectorAll('[data-channel]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-channel]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.getElementById('channelFeedback').textContent=channelReasons[b.dataset.channel]}));
  document.querySelectorAll('[data-roadmap]').forEach(b=>b.addEventListener('click',()=>document.querySelectorAll('[data-roadmap]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)))));
  const voiceButton=document.getElementById('voiceRewrite'),voiceGrid=document.querySelector('.voice-grid');
  voiceButton.addEventListener('click',()=>{const active=voiceButton.getAttribute('aria-pressed')!=='true';voiceButton.setAttribute('aria-pressed',String(active));voiceGrid.classList.toggle('is-rewritten',active);voiceButton.firstChild.textContent=active?'Reset comparison ':'Apply the brand brief ';document.getElementById('voiceFeedback').textContent=active?'The edited version names the customer, makes a specific offer and avoids an unsupported delivery promise.':'Apply the brief to compare the generic draft with the edited voice.'});
  const metricChanges={visits:'If useful visits fall, check the page or channel that brought the right person before posting more.',inquiries:'If qualified inquiries fall, inspect the offer, call to action and response time.',sales:'If quotes are not turning into sales, ask where the decision feels unclear or risky.',trust:'If reviews or repeat purchases fall, improve delivery and invite honest feedback.'};
  document.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-metric]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.getElementById('metricFeedback').textContent=metricChanges[b.dataset.metric]}));
  const mockResponses={menu:'<strong>Menu path</strong> · Show options, portions and dietary labels, then offer a clear quote route.',quote:'<strong>Quote path</strong> · Ask for the date, guest count and dietary needs, then say when you will reply.'};
  document.querySelectorAll('[data-mock]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-mock]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.getElementById('mockResponse').innerHTML=mockResponses[b.dataset.mock]}));
  commitScene(index);
})();

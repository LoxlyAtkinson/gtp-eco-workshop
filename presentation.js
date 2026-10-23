(()=>{
  const scenes=[...document.querySelectorAll('.scene')];
  const count=document.getElementById('sceneCount');
  const stage=document.getElementById('stageLabel');
  const fill=document.getElementById('progressFill');
  const track=document.querySelector('.progress-track');
  const prev=document.getElementById('prevButton');
  const next=document.getElementById('nextButton');
  const notes=document.getElementById('notesButton');
  const overview=document.getElementById('overviewDialog');
  const grid=document.getElementById('overviewGrid');
  let index=Math.max(0,Math.min(scenes.length-1,Number(location.hash.slice(1))-1||0));
  const titleOf=s=>s.querySelector('h1,h2').innerText.replace(/\s+/g,' ').trim();
  grid.innerHTML=scenes.map((s,i)=>`<button type="button" data-goto="${i}"><span>${String(i+1).padStart(2,'0')} · ${s.dataset.stage.toUpperCase()}</span>${titleOf(s)}</button>`).join('');
  function show(to,focus=false){
    index=Math.max(0,Math.min(scenes.length-1,to));
    scenes.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.hidden=i!==index;s.setAttribute('aria-hidden',i===index?'false':'true')});
    const current=scenes[index];
    count.textContent=`${String(index+1).padStart(2,'0')} / ${scenes.length}`;
    stage.textContent=current.dataset.stage.toUpperCase();
    fill.style.width=`${(index+1)/scenes.length*100}%`;
    track.setAttribute('aria-valuenow',String(index+1));
    prev.disabled=index===0;next.disabled=index===scenes.length-1;
    next.innerHTML=index===scenes.length-1?'End':'Next <span aria-hidden="true">→</span>';
    grid.querySelectorAll('button').forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
    history.replaceState(null,'',`#${String(index+1).padStart(2,'0')}`);
    window.scrollTo({top:0,behavior:'instant'});
    if(focus){const h=current.querySelector('h1,h2');h.tabIndex=-1;h.focus({preventScroll:true})}
  }
  prev.addEventListener('click',()=>show(index-1,true));
  next.addEventListener('click',()=>show(index+1,true));
  notes.addEventListener('click',()=>{const on=document.body.classList.toggle('show-notes');notes.setAttribute('aria-pressed',String(on))});
  document.getElementById('overviewButton').addEventListener('click',()=>overview.showModal());
  document.getElementById('closeOverview').addEventListener('click',()=>overview.close());
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-goto]');if(!b)return;overview.close();show(Number(b.dataset.goto),true)});
  window.addEventListener('keydown',e=>{if(overview.open||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(index+1,true)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(index-1,true)}});
  window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=scenes.length)show(n-1)});
  show(index);
})();

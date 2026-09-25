const input=document.getElementById('conciergeInput');
const out=document.getElementById('conciergeOutput');
const form=document.getElementById('conciergeForm');
const history=[];
const WA='6590091649';
let latestLead=null;

document.querySelectorAll('[data-text]').forEach(b=>b.onclick=()=>send(b.dataset.text));
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q)send(q)});

async function send(q){
 addBubble('user',q);history.push({role:'user',content:q});input.value='';
 setBusy(true);const thinking=document.createElement('div');thinking.className='bot-bubble ai-thinking';thinking.textContent='SGRentalBros AI is working on this…';out.appendChild(thinking);
 try{
  const r=await fetch('/api/concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
  const data=await r.json();thinking.remove();
  if(!r.ok)throw new Error(data.error||'AI unavailable');
  const reply=data.reply||'Tell me a little more about what you need.';
  history.push({role:'assistant',content:reply});latestLead=data.lead_summary||latestLead;addBot(reply,data.suggestions||[],data.resources||[],data.journey||null,data.lead_summary||null,!!data.handoff);
  localStorage.setItem('sgrb_ai_history',JSON.stringify(history.slice(-12)));
 }catch(err){
  thinking.remove();addFallback(err.message,q);
 }finally{setBusy(false)}
}
function addBubble(role,text){
 const d=document.createElement('div');d.className=role==='user'?'user-bubble':'bot-bubble';d.textContent=text;out.appendChild(d);scroll();
}
function addBot(text,suggestions,resources,journey,lead,handoff){
 const d=document.createElement('div');d.className='bot-bubble';
 const p=document.createElement('div');p.className='ai-reply';p.textContent=text;d.appendChild(p);
 if(journey&&Array.isArray(journey.items)&&journey.items.length){const j=document.createElement('div');j.className='ai-journey';const head=document.createElement('div');head.className='ai-journey-head';head.innerHTML='<small>YOUR RENTAL JOURNEY</small><b>'+esc(journey.title||'Your action plan')+'</b>'+(journey.target_date?'<span>Target: '+esc(formatDate(journey.target_date))+'</span>':'');j.appendChild(head);const list=document.createElement('div');list.className='ai-journey-list';journey.items.slice(0,7).forEach((x,i)=>{const row=document.createElement('div');row.className='ai-journey-item';row.innerHTML='<span>'+(i+1)+'</span><div><time>'+esc(formatDate(x.date))+'</time><b>'+esc(x.label||'Next step')+'</b><p>'+esc(x.detail||'')+'</p></div>';list.appendChild(row)});j.appendChild(list);d.appendChild(j)} if(resources.length){const r=document.createElement('div');r.className='ai-resources';resources.slice(0,3).forEach(x=>{if(!/^[a-z0-9-]+\.html(?:#[-a-z0-9]+)?$/i.test(x.url||''))return;const a=document.createElement('a');a.href=x.url;a.innerHTML='<small>'+esc((x.type||'resource').toUpperCase())+'</small><b>'+esc(x.label||'View resource')+' →</b>';r.appendChild(a)});d.appendChild(r)} if(suggestions.length){const s=document.createElement('div');s.className='ai-suggestions';suggestions.slice(0,3).forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>send(x);s.appendChild(b)});d.appendChild(s)}
 if(handoff&&lead){const box=document.createElement('div');box.className='ai-handoff-summary';box.innerHTML='<small>READY FOR WANG</small><b>'+esc(lead.need||'Your rental request')+'</b><p>'+esc(lead.help_needed||'Wang can continue from here without you repeating everything.')+'</p>';d.appendChild(box)}
 if(handoff){const a=document.createElement('a');a.className='mini ai-wa';a.target='_blank';a.rel='noopener';a.href=wa();a.textContent='CONTINUE WITH WANG ON WHATSAPP →';d.appendChild(a)}
 out.appendChild(d);scroll();
}
function addFallback(msg,q){
 const d=document.createElement('div');d.className='bot-bubble';
 d.innerHTML='<b>The live AI is not available yet.</b><p>'+esc(msg)+'</p><p>You can still send your request directly to Wang and continue from there.</p><a class="mini ai-wa" target="_blank" rel="noopener" href="'+wa(q)+'">CONTINUE WITH WANG ON WHATSAPP →</a>';
 out.appendChild(d);scroll();
}
function wa(extra=''){
 const l=latestLead;
 let body='Hi Wang! I used the SGRentalBros AI Rental Concierge.\n\n';
 if(l){
  const rows=[['Profile',l.persona],['Need',l.need],['Area',l.area],['Property',l.property],['Budget',l.budget],['Bedrooms',l.bedrooms],['Target date',l.target_date],['Household',l.household],['Services',Array.isArray(l.services)?l.services.join(', '):l.services],['Issue',l.issue],['Help needed',l.help_needed]].filter(x=>x[1]);
  body+='AI LEAD SUMMARY\n'+rows.map(x=>x[0]+': '+x[1]).join('\n');
 }else{
  const visitor=history.filter(m=>m.role==='user').map(m=>m.content).join('\n- ');
  body+='Visitor request:\n- '+visitor;
 }
 if(extra)body+='\n\n'+extra;
 body+='\n\nPlease help me with the next steps.';
 return 'https://wa.me/'+WA+'?text='+encodeURIComponent(body);
}
function formatDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||'')))return s||'';const d=new Date(s+'T12:00:00+08:00');return new Intl.DateTimeFormat('en-SG',{day:'numeric',month:'short',year:'numeric'}).format(d)}
function setBusy(v){const b=form.querySelector('button');b.disabled=v;b.textContent=v?'THINKING…':'SEND →';input.disabled=v}
function scroll(){out.scrollIntoView({behavior:'smooth',block:'nearest'})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

try{const saved=JSON.parse(localStorage.getItem('sgrb_ai_history')||'[]');if(Array.isArray(saved)&&saved.length){saved.slice(-12).forEach(m=>{history.push(m);addBubble(m.role,m.content)})}}catch(e){}

const input=document.getElementById('conciergeInput');
const out=document.getElementById('conciergeOutput');
const form=document.getElementById('conciergeForm');
const history=[];
const WA='6590091649';

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
  history.push({role:'assistant',content:reply});addBot(reply,data.suggestions||[],data.resources||[],!!data.handoff);
  localStorage.setItem('sgrb_ai_history',JSON.stringify(history.slice(-12)));
 }catch(err){
  thinking.remove();addFallback(err.message,q);
 }finally{setBusy(false)}
}
function addBubble(role,text){
 const d=document.createElement('div');d.className=role==='user'?'user-bubble':'bot-bubble';d.textContent=text;out.appendChild(d);scroll();
}
function addBot(text,suggestions,resources,handoff){
 const d=document.createElement('div');d.className='bot-bubble';
 const p=document.createElement('div');p.className='ai-reply';p.textContent=text;d.appendChild(p);
 if(resources.length){const r=document.createElement('div');r.className='ai-resources';resources.slice(0,3).forEach(x=>{if(!/^[a-z0-9-]+\.html(?:#[-a-z0-9]+)?$/i.test(x.url||''))return;const a=document.createElement('a');a.href=x.url;a.innerHTML='<small>'+esc((x.type||'resource').toUpperCase())+'</small><b>'+esc(x.label||'View resource')+' →</b>';r.appendChild(a)});d.appendChild(r)} if(suggestions.length){const s=document.createElement('div');s.className='ai-suggestions';suggestions.slice(0,3).forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>send(x);s.appendChild(b)});d.appendChild(s)}
 if(handoff){const a=document.createElement('a');a.className='mini ai-wa';a.target='_blank';a.rel='noopener';a.href=wa();a.textContent='CONTINUE WITH WANG ON WHATSAPP →';d.appendChild(a)}
 out.appendChild(d);scroll();
}
function addFallback(msg,q){
 const d=document.createElement('div');d.className='bot-bubble';
 d.innerHTML='<b>The live AI is not available yet.</b><p>'+esc(msg)+'</p><p>You can still send your request directly to Wang and continue from there.</p><a class="mini ai-wa" target="_blank" rel="noopener" href="'+wa(q)+'">CONTINUE WITH WANG ON WHATSAPP →</a>';
 out.appendChild(d);scroll();
}
function wa(extra=''){
 const transcript=history.map(m=>(m.role==='user'?'Visitor: ':'Concierge: ')+m.content).join('\n');
 return 'https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Wang! I used the SGRentalBros AI Rental Concierge.\n\n'+transcript+(extra?'\n'+extra:'')+'\n\nPlease help me with the next steps.');
}
function setBusy(v){const b=form.querySelector('button');b.disabled=v;b.textContent=v?'THINKING…':'SEND →';input.disabled=v}
function scroll(){out.scrollIntoView({behavior:'smooth',block:'nearest'})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

try{const saved=JSON.parse(localStorage.getItem('sgrb_ai_history')||'[]');if(Array.isArray(saved)&&saved.length){saved.slice(-12).forEach(m=>{history.push(m);addBubble(m.role,m.content)})}}catch(e){}

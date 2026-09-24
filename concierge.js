const input=document.getElementById('conciergeInput');
const out=document.getElementById('conciergeOutput');
const form=document.getElementById('conciergeForm');
let state={journey:null,answers:{},original:""};

const journeys={
 home:{name:"Find a Home",icon:"🏠",questions:[
  ["area","Which areas or MRT stations do you prefer?","e.g. Novena, Newton, Toa Payoh"],
  ["budget","What's your monthly rental budget?","e.g. $5,000"],
  ["home","What size home do you need?","e.g. 2 bedroom condo"],
  ["movein","When do you need to move in?","e.g. 1 Dec 2026"],
  ["household","Who will be staying in the home?","e.g. Couple + 2 children"],
  ["extras","Anything else you need help with?","e.g. movers, cleaning, furniture"]
 ]},
 move:{name:"Plan My Move",icon:"🚚",questions:[
  ["movein","What is your target move-in date?","e.g. 1 Dec 2026"],
  ["from","Where are you moving from?","e.g. another Singapore condo / overseas"],
  ["to","Where are you moving to?","Property / area if known"],
  ["extras","What help do you need?","e.g. movers, cleaning, aircon, internet, storage"]
 ]},
 tenancy:{name:"Tenancy Help",icon:"📄",questions:[
  ["issue","Briefly describe the tenancy issue.","e.g. repair bill, early termination, deposit"],
  ["role","Are you the tenant or landlord?","Tenant / Landlord"],
  ["lease","What does your tenancy agreement say about this, if you know?","Paste or summarise the relevant clause"],
  ["date","Is there a deadline or important date?","e.g. lease ends 15 Jan"]
 ]},
 service:{name:"Find a Service",icon:"🔧",questions:[
  ["service","What service do you need?","e.g. aircon servicing, mover, cleaner"],
  ["area","Where is the property?","e.g. Novena"],
  ["date","When do you need it?","e.g. before 1 Dec"],
  ["details","Anything the provider should know?","e.g. 4 aircon units, 3-bedroom move"]
 ]},
 landlord:{name:"Landlord Help",icon:"🔑",questions:[
  ["property","What property are you renting out?","e.g. One Bernam, 1 bedroom"],
  ["available","When is it available?","e.g. 15 Jan 2027"],
  ["status","Is it vacant, tenanted or already being marketed?","e.g. tenant moving out"],
  ["needs","What would you like help with?","e.g. rental assessment, marketing, handover, repairs"]
 ]}
};

document.querySelectorAll('[data-text]').forEach(b=>b.onclick=()=>start(detect(b.dataset.text),b.dataset.text));

form.addEventListener('submit',e=>{
 e.preventDefault();
 const q=input.value.trim(); if(!q)return;
 if(!state.journey){start(detect(q),q);return}
 const j=journeys[state.journey], unanswered=j.questions.find(x=>!state.answers[x[0]]);
 if(unanswered){state.answers[unanswered[0]]=q;input.value="";renderConversation();return}
 buildPlan();
});

function detect(q){
 q=q.toLowerCase();
 if(/landlord|rent out|renting out|tenant leaves|tenant moving out/.test(q))return"landlord";
 if(/contractor|service|aircon|clean|mover|plumb|electric|handyman|locksmith|paint|pest/.test(q)&&!/find.*home|bedroom|condo/.test(q))return"service";
 if(/tenancy|lease|deposit|terminate|repair|clause|dispute|landlord wants|tenant wants/.test(q))return"tenancy";
 if(/move|relocat/.test(q)&&!/bedroom|condo|find.*home|rental home/.test(q))return"move";
 return"home";
}
function start(type,q){
 state={journey:type,answers:{},original:q||""};
 input.value="";
 renderConversation();
}
function renderConversation(){
 const j=journeys[state.journey];
 const answered=j.questions.filter(x=>state.answers[x[0]]);
 const next=j.questions.find(x=>!state.answers[x[0]]);
 let html='<div class="user-bubble">'+esc(state.original)+'</div><div class="journey-badge">'+j.icon+' '+j.name+'</div>';
 answered.forEach(x=>html+='<div class="answer-line"><small>'+esc(x[1])+'</small><b>'+esc(state.answers[x[0]])+'</b></div>');
 if(next){
  html+='<div class="bot-bubble"><b>'+esc(next[1])+'</b><small>'+esc(next[2])+'</small></div>';
  input.placeholder=next[2];form.querySelector('button').textContent='ANSWER →';
 }else{
  html+='<div class="bot-bubble"><b>I have enough to build your SGRentalBros plan.</b><button class="mini build-plan" type="button">BUILD MY PLAN →</button></div>';
  input.placeholder="Add anything else (optional)";
  form.querySelector('button').textContent='BUILD MY PLAN →';
 }
 out.innerHTML=html;
 const bp=out.querySelector('.build-plan');if(bp)bp.onclick=buildPlan;
 out.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function buildPlan(){
 const j=journeys[state.journey],a=state.answers;
 let steps=[],links=[];
 if(state.journey==="home"){
  steps=["Confirm your home-search brief and priorities","Shortlist suitable available homes","Arrange viewings and compare options","Negotiate offer and review the tenancy documents","Prepare stamp duty, handover and move-in","Coordinate any movers, cleaning or other services"];
  links=[["Browse current homes","properties.html"],["Rental guides","rental-encyclopedia.html"],["Moving & home services","services.html"]];
 }else if(state.journey==="move"){
  steps=["Work backwards from your target move-in date","Confirm mover / transport requirements","Arrange move-in cleaning and any essential servicing","Prepare utilities, access and building move procedures","Complete inventory and condition checks at handover","Move in and keep key tenancy records together"];
  links=[["Find movers & services","services.html"],["Move-in checklist","move-in-checklist.html"],["Handover & inventory","handover-inventory.html"]];
 }else if(state.journey==="tenancy"){
  steps=["Identify the relevant tenancy agreement clause","Separate the documented facts from assumptions","Check the relevant SGRentalBros guide and official requirements where applicable","Keep messages, receipts, photos and supporting records","Discuss a practical resolution with the other party","Escalate for personal help if negotiation or interpretation is needed"];
  links=[["Rental Encyclopedia","rental-encyclopedia.html"],["Repairs & responsibility","repairs-responsibility.html"],["Rental disputes","rental-disputes.html"]];
 }else if(state.journey==="service"){
  steps=["Confirm the job scope and property details","Match the request to the relevant service category","Compare scope, timing and quotation directly with the provider","Confirm access arrangements and appointment","Keep invoice / service records where relevant to the tenancy"];
  links=[["Service marketplace","services.html"]];
  if(/aircon/i.test(a.service||state.original))links.unshift(["SGRentalBros recommended aircon provider","aircon-services.html"]);
 }else{
  steps=["Review the property, availability and rental objective","Assess positioning and likely tenant profile","Prepare the unit and marketing plan","Launch marketing and qualify enquiries","Negotiate and document the tenancy","Coordinate handover and ongoing rental needs"];
  links=[["Landlord Centre","landlord-centre.html"],["Rental assessment","index.html#landlords"],["Landlord guides","rental-encyclopedia.html"]];
 }
 const summary=j.questions.filter(x=>a[x[0]]).map(x=>'<li><b>'+esc(shortLabel(x[0]))+':</b> '+esc(a[x[0]])+'</li>').join('');
 const timeline=steps.map((s,i)=>'<li><span>'+String(i+1).padStart(2,"0")+'</span><div><b>'+esc(s)+'</b>'+timing(i,steps.length)+'</div></li>').join('');
 const resources=links.map(x=>'<a href="'+x[1]+'">'+esc(x[0])+' →</a>').join('');
 const msg=plainSummary(j,a);
 out.innerHTML='<div class="plan-card"><span class="kicker">YOUR SGRentalBros PLAN</span><h3>'+j.icon+' '+j.name+'</h3><ul class="plan-summary">'+summary+'</ul><h4>Your next-step timeline</h4><ol class="plan-timeline">'+timeline+'</ol><div class="plan-links">'+resources+'</div><div class="human-handoff"><b>Need personal help?</b><p>Wang JC can pick up from here. Your brief will be carried into WhatsApp so you don’t need to explain everything again.</p><a class="btn primary" target="_blank" rel="noopener" href="'+wa(msg)+'">CONTINUE WITH WANG ON WHATSAPP →</a></div><small class="plan-note">This planner provides general guidance. Property availability, provider availability and situation-specific tenancy matters still require confirmation.</small></div>';
 form.querySelector('button').textContent='START ANOTHER PLAN';
 form.onsubmit=e=>{e.preventDefault();location.reload()};
 out.scrollIntoView({behavior:'smooth',block:'start'});
}
function timing(i,n){return '<small>'+(i===0?'Start here':i===n-1?'Final step':'Then')+'</small>'}
function shortLabel(k){return({area:"Area",budget:"Budget",home:"Home",movein:"Move-in",household:"Household",extras:"Extra help",from:"Moving from",to:"Moving to",issue:"Issue",role:"Role",lease:"TA / clause",date:"Important date",service:"Service",details:"Job details",property:"Property",available:"Available",status:"Current status",needs:"Help needed"})[k]||k}
function plainSummary(j,a){return 'SGRentalBros Concierge Lead\nJourney: '+j.name+'\n'+j.questions.filter(x=>a[x[0]]).map(x=>shortLabel(x[0])+': '+a[x[0]]).join('\n')}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function wa(summary){return 'https://wa.me/6590091649?text='+encodeURIComponent('Hi Wang! I used the SGRentalBros Rental Concierge.\n\n'+summary+'\n\nPlease help me with the next steps.')}

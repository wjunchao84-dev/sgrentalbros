const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];const menuBtn=$('#menuBtn'),navLinks=$('#navLinks');if(menuBtn&&navLinks){menuBtn.onclick=()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');};$$('a',navLinks).forEach(a=>a.onclick=()=>{navLinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open navigation menu');});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks.classList.contains('open')){navLinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.focus();}});}$$('.filters button').forEach(b=>b.onclick=()=>{$$('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.property').forEach(c=>c.style.display=b.dataset.filter==='all'||c.dataset.tags.includes(b.dataset.filter)?'block':'none')});function filterLaunches(){const df=$('#districtFilter'),tf=$('#tenureFilter');if(!df||!tf)return;let d=df.value,t=tf.value;$$('.launch').forEach(c=>c.style.display=(d==='all'||c.dataset.district===d)&&(t==='all'||c.dataset.tenure===t)?'block':'none')}const districtFilter=$('#districtFilter'),tenureFilter=$('#tenureFilter');if(districtFilter&&tenureFilter){districtFilter.onchange=filterLaunches;tenureFilter.onchange=filterLaunches;}function openModal(id){$(id).classList.add('open');$(id).setAttribute('aria-hidden','false')}function closeModal(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')}$$('.enquire').forEach(b=>b.onclick=()=>{const interest=$('#interest'),title=$('#modalTitle');if(interest)interest.value=b.dataset.interest||'';if(title)title.textContent=b.dataset.interest?b.dataset.interest:'Tell us what you need.';if($('#modal'))openModal('#modal')});$$('.openMatch').forEach(b=>b.onclick=()=>openModal('#matchModal'));$$('.close').forEach(b=>b.onclick=()=>closeModal(b.closest('.modal')));$$('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)closeModal(m)});const WHATSAPP='6590091649';function buildWhatsApp(type,data){let lines=['Hi SGRentalBros! 👋','',`I am contacting you via www.sgrentalbros.sg.`,`Enquiry: ${type}`];const labels={interest:'Regarding',property:'Property / Development',beds:'Bedrooms',size:'Size (sqft)',budget:'Budget',movein:'Move-in date',pax:'Number of occupants',areas:'Preferred areas',pass:'Pass / residency',name:'Name',contact:'Contact number',message:'Message',propertyType:'Property type',furnishing:'Furnishing',available:'Available from',expectedRent:'Current / expected rent',propertyNotes:'Unit highlights',marketingStatus:'Marketing status'};Object.entries(data).forEach(([k,v])=>{if(v)lines.push(`${labels[k]||k}: ${v}`)});lines.push('','Thank you!');return 'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(lines.join('\n'))}$$('.leadform').forEach(f=>{
 f.noValidate=true;
 const submit=f.querySelector('button[type="submit"],button:not([type])');
 if(submit && !/WHATSAPP/i.test(submit.textContent)) submit.textContent='CONTINUE TO WHATSAPP →';
 if(!f.querySelector('.wa-send-notice')){
  const note=document.createElement('p');
  note.className='wa-send-notice';
  note.textContent='Your details are not submitted automatically. WhatsApp will open with a prepared message — tap Send to contact Wang JC.';
  note.style.cssText='font-size:12px;line-height:1.5;margin:9px 0;color:inherit;opacity:.85';
  if(submit)submit.insertAdjacentElement('afterend',note);
 }
 f.addEventListener('submit',e=>{
  e.preventDefault();
  const invalid=$$('input[required],select[required],textarea[required]',f).find(x=>!x.checkValidity());
  if(invalid){
   const panel=invalid.closest('.funnel-step');
   if(panel){
    $$('.funnel-step',f).forEach(s=>s.classList.toggle('active',s===panel));
    const step=Number(panel.dataset.step);
    $$('.funnel-progress span',f).forEach((bar,i)=>bar.classList.toggle('active',i<step));
   }
   invalid.reportValidity();return;
  }
  const data=Object.fromEntries(new FormData(f));
  // A request is delivered only when the visitor taps Send in WhatsApp.
  // Same-tab navigation avoids popup blockers on mobile.
  window.location.assign(buildWhatsApp(f.dataset.type||'Website enquiry',data));
 });
});
const propertyTabs=document.querySelectorAll('[data-property-tab]');
const rentProperties=document.getElementById('rentProperties'),saleProperties=document.getElementById('saleProperties'),propertyCount=document.getElementById('propertyCount'),propertySort=document.getElementById('propertySort');
if(propertyTabs.length){propertyTabs.forEach(btn=>btn.addEventListener('click',()=>{propertyTabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const rent=btn.dataset.propertyTab==='rent';rentProperties.hidden=!rent;saleProperties.hidden=rent;propertyCount.textContent=rent?rentProperties.querySelectorAll('.portal-card').length+' homes for rent':saleProperties.querySelectorAll('.portal-card').length+' homes for sale';if(propertySort)propertySort.value='default'}));}
if(propertySort){propertySort.addEventListener('change',()=>{const grid=rentProperties.hidden?saleProperties:rentProperties;const cards=[...grid.querySelectorAll('.portal-card')];if(propertySort.value!=='default'){cards.sort((a,b)=>propertySort.value==='price-low'?+a.dataset.price-+b.dataset.price:+b.dataset.price-+a.dataset.price);cards.forEach(c=>grid.appendChild(c));}});}

$$('.landlord-funnel').forEach(form=>{let step=1;const steps=$$('.funnel-step',form),bars=$$('.funnel-progress span',form);function show(n){step=n;steps.forEach(s=>s.classList.toggle('active',+s.dataset.step===n));bars.forEach((b,i)=>b.classList.toggle('active',i<n));}$$('.funnel-next',form).forEach(btn=>btn.onclick=()=>{const panel=btn.closest('.funnel-step');const required=$$('input[required],select[required],textarea[required]',panel);if(required.some(x=>!x.reportValidity()))return;show(Math.min(3,step+1));});$$('.funnel-back',form).forEach(btn=>btn.onclick=()=>show(Math.max(1,step-1)));});
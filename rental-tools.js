/* Validate fixed-rent inputs without changing the existing lease-duty method. */
(()=>{'use strict';
const form=document.getElementById('stampForm'),rent=document.getElementById('sdRent'),months=document.getElementById('sdMonths'),result=document.getElementById('stampResult');
if(form&&rent&&months&&result){
 function clearResult(){rent.removeAttribute('aria-invalid');months.removeAttribute('aria-invalid');result.textContent='Inputs changed. Select Calculate for an updated estimate.'}
 rent.addEventListener('input',clearResult);months.addEventListener('input',clearResult);
 form.addEventListener('submit',e=>{e.preventDefault();
  const r=Number(rent.value),m=Number(months.value);
  rent.removeAttribute('aria-invalid');months.removeAttribute('aria-invalid');
  let invalid=null,message='';
  if(!rent.value.trim()||!Number.isFinite(r)||r<=0||!rent.checkValidity()){invalid=rent;message='Enter a monthly rent greater than S$0, with no more than two decimal places.'}
  else if(!months.value.trim()||!Number.isInteger(m)||m<1||m>48){invalid=months;message='Enter a whole number of months from 1 to 48. For longer or partial-month leases, use the stamp duty guide.'}
  else if(!Number.isFinite(r*m)){invalid=rent;message='The rent entered is too large. Please check the amount.'}
  if(invalid){result.textContent=message;invalid.setAttribute('aria-invalid','true');invalid.focus();return}
  const annual=r*12,total=r*m;
  if(annual<=1000){result.textContent='Estimated lease duty: S$0. Average annual rent does not exceed S$1,000.';return}
  const duty=Math.max(1,Math.floor(total*.004));
  result.textContent='Estimated lease duty: S$'+duty.toLocaleString('en-SG')+'. Based on 0.4% × S$'+total.toLocaleString('en-SG',{maximumFractionDigits:2})+' total rent over '+m+' month'+(m===1?'':'s')+'.';
 });
}
document.querySelectorAll('.toolbox .checklist').forEach((list,index)=>{
 const boxes=[...list.querySelectorAll('input[type="checkbox"]')];if(!boxes.length)return;
 const progress=document.createElement('p');progress.className='sg-tool-progress';progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
 const note=document.createElement('p');note.className='sg-checklist-note';note.textContent='Your ticks reset when this page reloads. Keep supporting records separately.';
 const reset=document.createElement('button');reset.type='button';reset.className='mini';reset.textContent='RESET CHECKLIST';reset.setAttribute('aria-label','Reset '+(list.closest('article').querySelector('h2')?.textContent||'checklist '+(index+1)));
 function update(){const completed=boxes.filter(b=>b.checked).length;progress.textContent=completed+' of '+boxes.length+' tasks completed';reset.disabled=completed===0}
 boxes.forEach(box=>box.addEventListener('change',update));reset.addEventListener('click',()=>{boxes.forEach(box=>box.checked=false);update()});
 list.before(progress);list.after(note,reset);update();
});
})();

/* Progressive enhancement: article navigation and quick access across the site. */
(()=>{'use strict';
const article=document.querySelector('.guide-article');
if(article){
 const headings=[...article.querySelectorAll('h2')];
 if(headings.length>1){
  const toc=document.createElement('details');toc.className='sg-guide-toc';
  const summary=document.createElement('summary');summary.textContent='On this page';toc.append(summary);
  const list=document.createElement('ul');
  headings.forEach((heading,i)=>{if(!heading.id)heading.id='guide-section-'+(i+1);const li=document.createElement('li');const a=document.createElement('a');a.href='#'+heading.id;a.textContent=heading.textContent;li.append(a);list.append(li)});
  toc.append(list);article.prepend(toc);
 }
 const title=document.querySelector('h1')?.textContent.trim()||'Rental question';
 const help=document.createElement('section');help.className='sg-guide-help';
 const h=document.createElement('h2');h.textContent='Discuss your situation with JC';
 const p=document.createElement('p');p.textContent='Have the relevant clause, dates and a short description ready. Share only the details needed to explain your question.';
 const a=document.createElement('a');a.className='btn primary';a.textContent='ASK JC ABOUT THIS TOPIC →';
 a.href='https://wa.me/6590091649?text='+encodeURIComponent('Hi JC, I read your '+title+' guide on SGRentalBros.\n\nMy role (landlord / tenant):\nSituation:\nRelevant dates:\nWhat I would like help with:');a.target='_blank';a.rel='noopener noreferrer';
 const video=document.createElement('a');video.href='rental-encyclopedia.html#jc-video-library';video.textContent='Browse JC’s rental videos →';
 help.append(h,p,a,video);article.append(help);
}
if(document.querySelector('header.nav')){
 const nav=document.createElement('nav');nav.className='sg-mobile-shortcuts';nav.setAttribute('aria-label','Quick page navigation');
 [['rental-encyclopedia.html','Rental guides'],['property-walkthroughs.html','Video tours'],['services.html','Home services'],['rental-tools.html','Property tools']].forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;if(location.pathname.endsWith('/'+href))a.setAttribute('aria-current','page');nav.append(a)});
 document.querySelector('header.nav').after(nav);
}
})();

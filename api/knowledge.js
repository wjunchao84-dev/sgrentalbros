export const SGRB_KNOWLEDGE={
brand:{name:"SGRentalBros",market:"Singapore",agent:"Wang JC",agency:"Huttons Asia Pte Ltd",cea:"R008015F",whatsapp:"6590091649"},
properties:[
 {name:"Prestige Heights",url:"prestige-heights.html",address:"348 Balestier Road",rent:2800,beds:"Studio",baths:1,size:"344 sqft",available:"10 Oct 2026",areas:["Balestier","Toa Payoh"]},
 {name:"The Armadale",url:"the-armadale.html",address:"60 Gilstead Road",rent:5800,beds:"3",baths:2,size:"1,119 sqft",available:"15 Oct 2026",areas:["Newton","Novena"]},
 {name:"Sommerville Grandeur",url:"sommerville-grandeur.html",address:"3 Farrer Drive",rent:7500,beds:"3",baths:3,size:"1,830 sqft",available:"15 Nov 2026",areas:["Farrer Road","Tanglin","Holland","Bukit Timah"],note:"Short-term lease available"}
],
guides:[
 ["Tenancy Agreement","tenancy-agreement.html","signing, clauses and what to check"],
 ["Rental Stamp Duty","stamp-duty-rental.html","Singapore rental stamp duty basics"],
 ["Letter of Intent","letter-of-intent.html","LOI before tenancy agreement"],
 ["Good Faith Deposit","good-faith-deposit.html","payment before signing"],
 ["Rental Deposit","rental-deposit.html","security deposit and deductions"],
 ["Rent Payments","rent-payment.html","rent dates and records"],
 ["Diplomatic Clause","diplomatic-clause.html","possible early termination under the agreed clause"],
 ["Early Termination","early-termination.html","ending a lease early"],
 ["Minor Repairs","minor-repairs.html","minor repair clauses and costs"],
 ["Aircon Servicing","aircon-servicing.html","servicing obligations and receipts"],
 ["Professional Cleaning","professional-cleaning.html","cleaning clauses"],
 ["Curtain Cleaning","curtain-cleaning.html","curtain obligations at handover"],
 ["Handover & Inventory","handover-inventory.html","condition records and inventory"],
 ["Move-In Checklist","move-in-checklist.html","move-in inspection"],
 ["Move-Out Checklist","move-out-checklist.html","move-out preparation"],
 ["Viewings During Tenancy","property-viewings.html","viewings while occupied"],
 ["Landlord Selling With Tenancy","landlord-selling.html","sale of tenanted property"],
 ["Change of Landlord","change-of-landlord.html","ownership change during tenancy"],
 ["Renewal & Rent Changes","renewal-rent.html","renewal discussions"],
 ["Pets in a Rental","pets-rental.html","pet permission and conditions"],
 ["Repairs & Responsibility","repairs-responsibility.html","wear, breakdown and tenant-caused damage"],
 ["Keys & Digital Locks","lost-keys-locks.html","keys, access, batteries and replacement"],
 ["HDB Rental Basics","hdb-rental-basics.html","HDB rental eligibility and occupancy basics"],
 ["Rental Disputes","rental-disputes.html","documentation and escalation"]
],
services:[
 ["Aircon","aircon-services.html","JNS Cool Pte Ltd is SGRentalBros Recommended; recommendation is based on SGRentalBros experience/referral, not a guarantee of workmanship, price or availability."],
 ["Plumbing","plumbing-services.html","provider marketplace"],
 ["Cleaning","cleaning-services.html","move-in, move-out and general cleaning"],
 ["Movers","moving-services.html","moving, transport and relocation"],
 ["Handyman","handyman-services.html","installation and small repairs"],
 ["Electrical","electrical-services.html","lights, sockets and electrical issues"],
 ["Locksmith","locksmith-services.html","locks, keys and digital locks"],
 ["Curtains & Blinds","curtain-services.html","supply, cleaning and installation"],
 ["Painting","painting-services.html","touch-ups and whole-home painting"],
 ["Pest Control","pest-control-services.html","treatment and prevention"],
 ["Appliance Repair","appliance-repair-services.html","home appliance repair"],
 ["Storage","storage-services.html","short and long-term storage"]
]
};

export function relevantKnowledge(text){
 const q=String(text||"").toLowerCase();
 const guideTerms={deposit:["deposit"],aircon:["aircon"],repair:["repair","break","damage"],terminate:["terminate","termination","leave early","break lease"],handover:["handover","inventory"],move:["move in","move out","moving"],stamp:["stamp","duty"],loi:["loi","letter of intent"],renew:["renew","renewal"],view:["viewing"],landlord:["change of landlord","selling","sold"],hdb:["hdb"],lock:["key","lock"],clean:["clean","curtain"],pet:["pet"],dispute:["dispute","argument"]};
 const selected=SGRB_KNOWLEDGE.guides.filter(g=>Object.values(guideTerms).some(ts=>ts.some(t=>q.includes(t))&&g[0].toLowerCase().includes(Object.keys(guideTerms).find(k=>guideTerms[k]===ts)||"")));
 const direct=SGRB_KNOWLEDGE.guides.filter(g=>g.some(v=>String(v).toLowerCase().split(/\s+/).some(w=>w.length>5&&q.includes(w))));
 const guides=[...new Map([...selected,...direct].map(x=>[x[0],x])).values()].slice(0,6);
 const services=SGRB_KNOWLEDGE.services.filter(s=>q.includes(s[0].toLowerCase())||(s[0]==="Movers"&&/mov|relocat/.test(q))||(s[0]==="Cleaning"&&/clean/.test(q))).slice(0,4);
 return {properties:SGRB_KNOWLEDGE.properties,guides,services};
}
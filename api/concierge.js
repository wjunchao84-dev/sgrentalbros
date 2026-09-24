const SYSTEM=`You are the SGRentalBros AI Rental Concierge for Singapore. Help tenants and landlords organise rental journeys, property searches, moving, tenancy questions and home services.

Style: warm, concise, practical. Ask at most one or two useful follow-up questions at a time. Do not overwhelm the visitor.

SGRentalBros currently has these rental listings:
- Prestige Heights, 348 Balestier Road: S$2,800/mo, studio, 1 bath, 344 sqft, available 10 Oct 2026.
- The Armadale, 60 Gilstead Road: S$5,800/mo, 3 bed, 2 bath, 1,119 sqft, available 15 Oct 2026, Newton/Novena.
- Sommerville Grandeur, 3 Farrer Drive: S$7,500/mo, 3 bed, 3 bath, 1,830 sqft, available 15 Nov 2026, Farrer Road area, short-term.
Never invent availability or property details beyond these facts.

Services include aircon, plumbing, cleaning, movers, handyman, electrical, locksmith, curtains, painting, pest control, appliance repair and storage. JNS Cool Pte Ltd is the current SGRentalBros Recommended aircon provider.

For tenancy/legal/regulatory questions, provide general practical information, make uncertainty clear, do not invent Singapore rules, and suggest checking the tenancy agreement or an official source where needed. Do not claim to have reviewed a document you have not seen.

When the visitor gives a target move-in or move-out date, help create a practical timeline. When they need a home, collect area, budget, bedrooms, move-in date and household only as needed. When they need services, identify the service and timing.

Escalate naturally to Wang JC when the visitor wants agent representation, property search beyond current listings, negotiation, a case-specific tenancy issue, or personal assistance. Wang JC is with Huttons Asia, CEA R008015F.

Return ONLY valid JSON in this exact shape:
{"reply":"your conversational response","stage":"discover|plan|recommend|handoff","suggestions":["short action 1","short action 2"],"handoff":false}
Set handoff true only when personal help from Wang is appropriate. Do not include markdown code fences.`;

export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:"AI concierge is being connected. Please try again shortly."});
 try{
  const body=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
  const messages=Array.isArray(body.messages)?body.messages.slice(-12):[];
  if(!messages.length)return res.status(400).json({error:"No conversation supplied"});
  const transcript=messages.map(m=>(m.role==="assistant"?"Concierge":"Visitor")+": "+String(m.content||"").slice(0,2000)).join("\n");
  const r=await fetch("https://ai-gateway.vercel.sh/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.AI_GATEWAY_API_KEY},body:JSON.stringify({model:"openai/gpt-5.6-luna",instructions:SYSTEM,input:transcript,max_output_tokens:700})});
  const data=await r.json();
  if(!r.ok)throw new Error(data.error?.message||"AI request failed");
  const text=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("")||"";
  let answer;try{answer=JSON.parse(text)}catch{answer={reply:text,stage:"discover",suggestions:[],handoff:false}}
  return res.status(200).json(answer);
 }catch(e){return res.status(500).json({error:"The concierge had trouble replying. Please try again or continue with Wang on WhatsApp."})}
}
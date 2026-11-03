// Minimal funnel measurement in Vercel function logs. No enquiry payload is accepted.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const origin = req.headers.origin;
  if (origin !== 'https://www.sgrentalbros.sg' && origin !== 'https://sgrentalbros.sg') return res.status(403).end();
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).end();
  if (Number(req.headers['content-length'] || 0) > 512) return res.status(413).end();
  let body = req.body;
  if (typeof body === 'string') { if (body.length > 512) return res.status(413).end(); try { body = JSON.parse(body); } catch (_) { return res.status(400).end(); } }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).end();
  const allowed = {
    event:['page_view','assessment_start','whatsapp_click'],
    placement:['page','form','hero','floating'],
    source:['openai','chatgpt','google','facebook','instagram','tiktok','other','direct'],
    campaign:['landlord-rental','none']
  };
  if (Object.keys(body).some(key => !Object.hasOwn(allowed, key)) || Object.entries(allowed).some(([key, values]) => !values.includes(body[key]))) return res.status(400).end();
  console.info('sgrb_landlord_funnel', JSON.stringify({event:body.event, placement:body.placement, source:body.source, campaign:body.campaign}));
  return res.status(204).end();
}

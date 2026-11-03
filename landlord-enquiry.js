/* First-party funnel events contain no form data. WhatsApp navigation never waits for logging. */
(() => {
  const params = new URLSearchParams(location.search);
  const known = ['openai', 'chatgpt', 'google', 'facebook', 'instagram', 'tiktok'];
  let source = (params.get('utm_source') || '').toLowerCase();
  if (!known.includes(source)) {
    let host = ''; try { host = new URL(document.referrer).hostname; } catch (_) {}
    source = host === 'chatgpt.com' || host.endsWith('.chatgpt.com') ? 'chatgpt' : (source ? 'other' : 'direct');
  }
  const campaign = params.get('utm_campaign') === 'landlord-rental' ? 'landlord-rental' : 'none';
  const disabled = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  function track(event, placement) {
    if (disabled) return;
    const body = JSON.stringify({event, placement, source, campaign});
    try {
      if (navigator.sendBeacon && navigator.sendBeacon('/api/landlord-events', new Blob([body], {type:'application/json'}))) return;
      fetch('/api/landlord-events', {method:'POST', headers:{'Content-Type':'application/json'}, body, keepalive:true}).catch(() => {});
    } catch (_) { /* Logging must never block an enquiry. */ }
  }
  function withSource(url) {
    const u = new URL(url); const text = u.searchParams.get('text') || '';
    u.searchParams.set('text', text + '\nSource: SGRentalBros landlord page / ' + source + (campaign === 'none' ? '' : ' / ' + campaign));
    return u.href;
  }
  document.querySelectorAll('[data-landlord-whatsapp]').forEach(a => {
    a.href = withSource(a.href);
    a.addEventListener('click', () => track('whatsapp_click', a.dataset.landlordWhatsapp));
  });
  const form = document.getElementById('landlordAssessment');
  if (form) {
    form.addEventListener('input', () => track('assessment_start', 'form'), {once:true});
    // Capture before the shared form handler; keep every other site form unchanged.
    form.addEventListener('submit', e => {
      e.preventDefault(); e.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (!String(data.get('property') || '').trim()) {
        const input = form.elements.property;
        input.setCustomValidity('Please enter your property or HDB block.');
        input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), {once:true}); return;
      }
      const labels = {property:'Property', beds:'Bedrooms', size:'Size (sqft)', available:'Available from', name:'Name'};
      const lines = ['Hi JC, I would like a rental assessment for my property.', ''];
      for (const [key, label] of Object.entries(labels)) {
        const value = String(data.get(key) || '').trim(); if (value) lines.push(label + ': ' + value);
      }
      track('whatsapp_click', 'form');
      location.assign(withSource('https://wa.me/6590091649?text=' + encodeURIComponent(lines.join('\n'))));
    }, true);
  }
  track('page_view', 'page');
})();

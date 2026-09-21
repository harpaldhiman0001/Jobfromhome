<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Create and manage your JobFromHome.in profile, employer request, and plan payment.">
  <title>Dashboard — JobFromHome.in</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    .app-shell{max-width:1120px;margin:0 auto;padding:48px 24px 85px}.app-top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:31px}.app-top h1{font:800 clamp(30px,5vw,48px)/1.07 "Plus Jakarta Sans",sans-serif;letter-spacing:-.065em;margin:8px 0}.app-top p{margin:0;color:var(--muted);line-height:1.6}.dashboard-grid{display:grid;grid-template-columns:250px minmax(0,1fr);gap:22px}.side-card,.app-card{background:#fff;border:1px solid #dce5f0;border-radius:18px;padding:22px}.side-card{height:max-content}.profile-dot{display:grid;place-items:center;width:48px;height:48px;background:#e7edff;color:var(--blue);border-radius:15px;font:800 20px "Plus Jakarta Sans"}.side-name{margin:14px 0 3px;font-weight:800}.side-email{margin:0;color:#708099;font-size:12px;overflow-wrap:anywhere}.dashboard-nav{margin-top:22px;border-top:1px solid #e9eef5;padding-top:12px}.dashboard-nav button{display:block;width:100%;padding:10px 9px;text-align:left;border:0;background:transparent;border-radius:8px;color:#60708a;font-size:13px;font-weight:700}.dashboard-nav button.active,.dashboard-nav button:hover{background:#edf2ff;color:var(--blue)}.app-card h2{font:800 23px "Plus Jakarta Sans";letter-spacing:-.05em;margin:0 0 7px}.app-card>p{color:var(--muted);font-size:13px;line-height:1.55;margin:0 0 22px}.plan-banner{display:flex;gap:16px;align-items:center;justify-content:space-between;background:#f1f5ff;border:1px solid #d3dfff;border-radius:13px;padding:16px;margin-bottom:23px}.plan-banner strong{display:block;font-size:14px}.plan-banner span{display:block;margin-top:3px;color:#637392;font-size:12px}.status-pill{white-space:nowrap;border-radius:999px;background:#fff4d8;color:#966400;padding:7px 9px;font-size:10px;font-weight:800}.app-form{display:grid;grid-template-columns:1fr 1fr;gap:13px}.app-form .field.full{grid-column:1/-1}.app-form .button{grid-column:1/-1;margin-top:6px}.payment-card{border:1px solid #dce5f0;border-radius:14px;padding:18px;margin:17px 0;background:#fbfcff}.payment-card h3{margin:0 0 6px;font-size:16px}.payment-card p{margin:0;color:#67758c;font-size:12px;line-height:1.55}.payment-price{margin:15px 0!important;color:var(--ink)!important;font:800 29px "Plus Jakarta Sans"!important;letter-spacing:-.06em}.notice{padding:13px 14px;border-radius:10px;background:#fff7e8;color:#795315;font-size:12px;line-height:1.55}.hidden{display:none!important}@media(max-width:760px){.dashboard-grid{grid-template-columns:1fr}.side-card{display:none}.app-top{flex-direction:column}.app-form{grid-template-columns:1fr}.app-form .field.full{grid-column:auto}}
  </style>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html"><span class="brand-mark">J</span> JobFrom<span>Home</span><small>.in</small></a>
    <a class="button button-secondary" href="index.html">← Back to website</a>
  </header>

  <main class="app-shell">
    <div class="app-top">
      <div><p class="eyebrow">Account setup</p><h1>Your JobFromHome workspace</h1><p>Create a real professional profile or submit an employer account for review. Paid plans are activated only after verified payment.</p></div>
    </div>

    <div class="dashboard-grid">
      <aside class="side-card"><div class="profile-dot" id="avatar">J</div><p class="side-name" id="sideName">Guest</p><p class="side-email" id="sideEmail">Complete your profile to continue</p><nav class="dashboard-nav"><button class="active" data-view="seeker">Job seeker</button><button data-view="employer">Employer</button><button data-view="safety">Safety</button></nav></aside>
      <section class="app-card">
        <div id="seekerView">
          <h2>Job-seeker profile</h2><p>Complete your professional details. This does not guarantee a job, employer response, interview, or selection.</p>
          <div class="plan-banner"><div><strong>Apply Plan: ₹199 / 30 days</strong><span>Unlimited applications to active listings while your plan is active. GST included.</span></div><span class="status-pill" id="seekerStatus">NOT ACTIVE</span></div>
          <form id="seekerForm" class="app-form" novalidate>
            <div class="field"><label for="sName">Full name *</label><input id="sName" name="fullName" required maxlength="80" autocomplete="name" placeholder="Your full name"></div>
            <div class="field"><label for="sEmail">Email *</label><input id="sEmail" name="email" required type="email" maxlength="120" autocomplete="email" placeholder="you@example.com"></div>
            <div class="field"><label for="sPhone">Mobile / WhatsApp *</label><input id="sPhone" name="phone" required inputmode="tel" maxlength="15" autocomplete="tel" placeholder="10-digit mobile number"></div>
            <div class="field"><label for="sCity">Current city</label><input id="sCity" name="city" maxlength="60" placeholder="e.g., Amritsar"></div>
            <div class="field full"><label for="sHeadline">Professional headline *</label><input id="sHeadline" name="headline" required maxlength="140" placeholder="e.g., Customer support professional with 2 years' experience"></div>
            <div class="field"><label for="sExperience">Experience *</label><select id="sExperience" name="experience" required><option value="">Choose experience</option><option>Fresher</option><option>0–1 years</option><option>1–3 years</option><option>3–5 years</option><option>5+ years</option></select></div>
            <div class="field"><label for="sPreference">Work preference *</label><select id="sPreference" name="workPreference" required><option value="">Choose preference</option><option>Remote full-time</option><option>Remote part-time</option><option>Freelance / contract</option><option>Any remote role</option></select></div>
            <div class="field full"><label for="sSkills">Skills *</label><input id="sSkills" name="skills" required maxlength="250" placeholder="e.g., CRM, Excel, Canva, sales, customer support"></div>
            <div class="field full"><label for="sPortfolio">Portfolio / LinkedIn / GitHub</label><input id="sPortfolio" name="portfolio" type="url" maxlength="255" placeholder="https://"></div>
            <div class="field full"><label for="sSummary">Profile summary</label><textarea id="sSummary" name="summary" maxlength="1200" placeholder="Describe your experience, strengths, and preferred remote role."></textarea></div>
            <label class="consent field full"><input type="checkbox" name="consent" required><span>I agree to the Privacy Notice and Terms, and understand that payment gives platform access only—not a job, interview, or selection guarantee.</span></label>
            <button class="button button-dark" type="submit">Save my profile</button><p class="form-status field full" id="seekerMessage"></p>
          </form>
          <div class="payment-card hidden" id="seekerPayment"><h3>Activate Apply Plan</h3><p>₹199 including applicable GST. Valid for 30 days after a verified Razorpay payment.</p><p class="payment-price">₹199</p><button type="button" class="button button-primary" data-pay="seeker_30">Pay securely with Razorpay</button></div>
        </div>

        <div id="employerView" class="hidden">
          <h2>Employer account request</h2><p>Submit a genuine business and job requirement for review. A listing is not published until review and verified payment are complete.</p>
          <div class="plan-banner"><div><strong>Employer Starter: ₹590 total</strong><span>₹500 + ₹90 GST. One approved live job listing for 30 days.</span></div><span class="status-pill" id="employerStatus">PENDING</span></div>
          <form id="employerForm" class="app-form" novalidate>
            <div class="field"><label for="eName">Your full name *</label><input id="eName" name="contactName" required maxlength="80" placeholder="Hiring contact name"></div>
            <div class="field"><label for="eEmail">Work email *</label><input id="eEmail" name="businessEmail" required type="email" maxlength="120" placeholder="name@company.com"></div>
            <div class="field"><label for="ePhone">Mobile number *</label><input id="ePhone" name="employerPhone" required inputmode="tel" maxlength="15" placeholder="10-digit mobile number"></div>
            <div class="field"><label for="eCompany">Company legal name *</label><input id="eCompany" name="companyName" required maxlength="150" placeholder="Company name"></div>
            <div class="field"><label for="eWebsite">Company website</label><input id="eWebsite" name="companyWebsite" type="url" maxlength="255" placeholder="https://company.com"></div>
            <div class="field"><label for="eGstin">GSTIN (optional)</label><input id="eGstin" name="gstin" maxlength="15" placeholder="15-character GSTIN"></div>
            <div class="field"><label for="eSize">Company size *</label><select id="eSize" name="companySize" required><option value="">Choose size</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select></div>
            <div class="field"><label for="eIndustry">Industry *</label><input id="eIndustry" name="industry" required maxlength="80" placeholder="e.g., SaaS, Agency, E-commerce"></div>
            <div class="field full"><label for="eJob">First job title *</label><input id="eJob" name="firstJobTitle" required maxlength="140" placeholder="e.g., Remote Customer Support Executive"></div>
            <div class="field full"><label for="eNote">Hiring note</label><textarea id="eNote" name="hiringNote" maxlength="1200" placeholder="Describe the genuine role. Never request candidate money, OTP, bank details, deposits, or training fees."></textarea></div>
            <label class="consent field full"><input type="checkbox" name="consent" required><span>I confirm that my organisation will post genuine roles only, will not charge candidates a fee, and agree to review and platform safety rules.</span></label>
            <button class="button button-dark" type="submit">Submit for employer review</button><p class="form-status field full" id="employerMessage"></p>
          </form>
          <div class="payment-card hidden" id="employerPayment"><h3>Employer Starter payment</h3><p>Pay only after your employer account and first job request have been reviewed and approved.</p><p class="payment-price">₹590</p><button type="button" class="button button-primary" data-pay="employer_starter">Pay securely with Razorpay</button></div>
        </div>

        <div id="safetyView" class="hidden"><h2>Keep your job search safe</h2><p>JobFromHome.in is a job discovery and application platform. It does not guarantee employment.</p><div class="notice"><strong>Never:</strong> pay an employer for a job, interview, training, security deposit, equipment, or offer letter; share OTPs, UPI PINs, passwords, credit-card data, or banking credentials.</div><div class="payment-card"><h3>Found a suspicious listing?</h3><p>Use the report form on the public website or email support@jobfromhome.in with a link and details. Do not include secret financial details.</p><a class="button button-secondary" href="index.html#top">Return to report form</a></div></div>
      </section>
    </div>
  </main>

  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    const CONFIG = {
      APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec',
      ENABLE_APPS_SCRIPT: false,
      PAYMENT_API: '/api/razorpay'
    };

    const state = { seekerSaved: false, employerSaved: false, seeker: null, employer: null };
    const views = { seeker: document.getElementById('seekerView'), employer: document.getElementById('employerView'), safety: document.getElementById('safetyView') };
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.view;
      Object.entries(views).forEach(([key, element]) => element.classList.toggle('hidden', key !== view));
      document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button));
    }));

    function toObject(form) {
      const value = Object.fromEntries(new FormData(form).entries());
      Object.keys(value).forEach(k => { if (typeof value[k] === 'string') value[k] = value[k].trim(); });
      if (value.phone) value.phone = value.phone.replace(/\D/g, '').slice(-10);
      if (value.employerPhone) value.employerPhone = value.employerPhone.replace(/\D/g, '').slice(-10);
      value.consent = true;
      return value;
    }
    function validEmail(value) { return /^\S+@\S+\.\S+$/.test(value || ''); }
    function validPhone(value) { return /^[6-9]\d{9}$/.test(value || ''); }
    async function saveLead(type, data) {
      if (!CONFIG.ENABLE_APPS_SCRIPT || CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) return { success: true, preview: true };
      const response = await fetch(CONFIG.APPS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'createLead', leadType: type, ...data }) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Could not save your request.');
      return result;
    }
    function setMessage(id, text, error = false) { const el = document.getElementById(id); el.className = 'form-status field full ' + (error ? 'error' : 'success'); el.textContent = text; }
    function updateIdentity(data, isEmployer) { document.getElementById('sideName').textContent = data.fullName || data.contactName; document.getElementById('sideEmail').textContent = data.email || data.businessEmail; document.getElementById('avatar').textContent = (data.fullName || data.contactName || 'J').charAt(0).toUpperCase(); if (isEmployer) document.getElementById('employerStatus').textContent = 'REVIEW REQUESTED'; }

    document.getElementById('seekerForm').addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget; const data = toObject(form);
      if (!data.fullName || !data.headline || !data.skills || !validEmail(data.email) || !validPhone(data.phone)) return setMessage('seekerMessage', 'Enter all required information, a valid email, and a 10-digit Indian mobile number.', true);
      const button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Saving…';
      try { const result = await saveLead('seeker', data); state.seekerSaved = true; state.seeker = data; updateIdentity(data, false); document.getElementById('seekerPayment').classList.remove('hidden'); setMessage('seekerMessage', result.preview ? 'Preview mode only: profile is not saved. Configure Apps Script before launch.' : 'Profile request saved. You can now activate the 30-day Apply Plan.'); }
      catch (error) { setMessage('seekerMessage', error.message, true); }
      finally { button.disabled = false; button.textContent = 'Save my profile'; }
    });

    document.getElementById('employerForm').addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget; const data = toObject(form);
      if (!data.contactName || !data.companyName || !data.firstJobTitle || !validEmail(data.businessEmail) || !validPhone(data.employerPhone)) return setMessage('employerMessage', 'Enter all required information, a valid work email, and a 10-digit Indian mobile number.', true);
      const button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Saving…';
      try { const result = await saveLead('employer', data); state.employerSaved = true; state.employer = data; updateIdentity(data, true); document.getElementById('employerPayment').classList.remove('hidden'); setMessage('employerMessage', result.preview ? 'Preview mode only: employer request is not saved. Configure Apps Script before launch.' : 'Employer request saved. Pay only after you have completed your verification review.'); }
      catch (error) { setMessage('employerMessage', error.message, true); }
      finally { button.disabled = false; button.textContent = 'Submit for employer review'; }
    });

    async function paymentRequest(payload) {
      const response = await fetch(CONFIG.PAYMENT_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Payment service is unavailable.');
      return data;
    }

    document.querySelectorAll('[data-pay]').forEach(button => button.addEventListener('click', async () => {
      const planCode = button.dataset.pay;
      const isSeeker = planCode === 'seeker_30';
      const customer = isSeeker ? state.seeker : state.employer;
      if (!(isSeeker ? state.seekerSaved : state.employerSaved) || !customer) return alert('Save the form before starting payment.');
      if (isSeeker && !confirm('₹199 gives you 30 days of platform application access. It does not guarantee jobs, employer replies, interviews, or selection. Continue?')) return;
      if (!isSeeker && !confirm('₹590 is ₹500 plus 18% GST for one approved 30-day job listing. It is published only after review and verified payment. Continue?')) return;
      button.disabled = true; button.textContent = 'Preparing secure checkout…';
      try {
        const orderData = await paymentRequest({ action: 'createOrder', planCode, name: customer.fullName || customer.contactName, email: customer.email || customer.businessEmail, phone: customer.phone || customer.employerPhone });
        const options = { key: orderData.keyId, amount: orderData.order.amount, currency: orderData.order.currency, name: 'JobFromHome.in', description: orderData.plan.label, order_id: orderData.order.id, prefill: { name: customer.fullName || customer.contactName, email: customer.email || customer.businessEmail, contact: customer.phone || customer.employerPhone }, notes: { plan_code: planCode }, theme: { color: '#3566f2' }, modal: { ondismiss: () => { button.disabled = false; button.textContent = 'Pay securely with Razorpay'; } }, handler: async response => {
          try {
            button.textContent = 'Verifying payment…';
            const verified = await paymentRequest({ action: 'verifyPayment', planCode, ...response });
            if (!verified.verified) throw new Error('Payment could not be verified.');
            alert('Payment verified. Your payment ID is ' + verified.payment.paymentId + '. Save this in your admin system before enabling access.');
            button.textContent = 'Payment verified ✓';
            if (isSeeker) document.getElementById('seekerStatus').textContent = 'PAYMENT VERIFIED'; else document.getElementById('employerStatus').textContent = 'PAYMENT VERIFIED';
          } catch (error) { alert(error.message); button.disabled = false; button.textContent = 'Pay securely with Razorpay'; }
        }};
        if (!window.Razorpay) throw new Error('Razorpay checkout did not load. Check your internet connection and browser blockers.');
        new Razorpay(options).open();
      } catch (error) { alert(error.message); button.disabled = false; button.textContent = 'Pay securely with Razorpay'; }
    }));
  </script>
</body>
</html>

/*
  JobFromHome.in frontend configuration.
  1. Deploy Code.gs as a Web App.
  2. Paste its /exec URL below.
  3. Keep ENABLE_API false to preview locally without saving data.
*/
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec",
  ENABLE_API: false
};

const modal = document.getElementById("modal");
const formContent = document.getElementById("formContent");
const toast = document.getElementById("toast");

const templates = {
  seeker: () => `
    <h2>Create your job-seeker profile</h2>
    <p class="modal-intro">Build your professional profile for remote roles. Your information is used only to provide JobFromHome.in services according to the privacy notice.</p>
    <div class="form-grid">
      <div class="field"><label for="fullName">Full name *</label><input id="fullName" name="fullName" required maxlength="80" autocomplete="name" placeholder="Your full name"></div>
      <div class="field"><label for="email">Email address *</label><input id="email" name="email" required type="email" maxlength="120" autocomplete="email" placeholder="you@example.com"></div>
      <div class="field"><label for="phone">WhatsApp / phone *</label><input id="phone" name="phone" required inputmode="tel" maxlength="15" autocomplete="tel" placeholder="10-digit mobile number"></div>
      <div class="field"><label for="city">Current city</label><input id="city" name="city" maxlength="60" placeholder="e.g., Amritsar"></div>
      <div class="field full"><label for="headline">Professional headline *</label><input id="headline" name="headline" required maxlength="140" placeholder="e.g., Customer support professional with 2 years' experience"></div>
      <div class="field"><label for="experience">Total experience *</label><select id="experience" name="experience" required><option value="">Choose experience</option><option>Fresher</option><option>0–1 years</option><option>1–3 years</option><option>3–5 years</option><option>5+ years</option></select></div>
      <div class="field"><label for="workPreference">Work preference *</label><select id="workPreference" name="workPreference" required><option value="">Choose preference</option><option>Remote full-time</option><option>Remote part-time</option><option>Freelance / contract</option><option>Any remote role</option></select></div>
      <div class="field full"><label for="skills">Skills *</label><input id="skills" name="skills" required maxlength="250" placeholder="e.g., Customer support, CRM, Excel, English communication"></div>
      <div class="field full"><label for="portfolio">LinkedIn, portfolio, or GitHub URL</label><input id="portfolio" name="portfolio" type="url" maxlength="255" placeholder="https://"></div>
      <div class="field full"><label for="summary">Short professional summary</label><textarea id="summary" name="summary" maxlength="1200" placeholder="Briefly describe your experience, strengths, and the kind of remote work you want."></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required> <span>I agree to the <a href="privacy.html" target="_blank">Privacy Notice</a> and <a href="terms.html" target="_blank">Terms</a>. I understand that creating a profile does not guarantee job interviews or employment.</span></label>
    <button class="button button-primary full" type="submit">Save profile request</button>
    <p class="form-status" aria-live="polite"></p>`,

  employer: () => `
    <h2>Create an employer account</h2>
    <p class="modal-intro">Post genuine remote roles after review. The ₹590 employer starter plan is ₹500 plus 18% GST and includes one active job listing for 30 days after payment confirmation and approval.</p>
    <div class="form-grid">
      <div class="field"><label for="contactName">Your full name *</label><input id="contactName" name="contactName" required maxlength="80" autocomplete="name" placeholder="Hiring contact name"></div>
      <div class="field"><label for="businessEmail">Work email *</label><input id="businessEmail" name="businessEmail" required type="email" maxlength="120" autocomplete="email" placeholder="name@company.com"></div>
      <div class="field"><label for="employerPhone">Phone number *</label><input id="employerPhone" name="employerPhone" required inputmode="tel" maxlength="15" autocomplete="tel" placeholder="10-digit mobile number"></div>
      <div class="field"><label for="companyName">Legal / company name *</label><input id="companyName" name="companyName" required maxlength="150" placeholder="Company name"></div>
      <div class="field"><label for="companyWebsite">Company website</label><input id="companyWebsite" name="companyWebsite" type="url" maxlength="255" placeholder="https://company.com"></div>
      <div class="field"><label for="gstin">GSTIN (optional)</label><input id="gstin" name="gstin" maxlength="15" placeholder="15-character GSTIN"></div>
      <div class="field"><label for="companySize">Company size *</label><select id="companySize" name="companySize" required><option value="">Choose size</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select></div>
      <div class="field"><label for="industry">Industry *</label><input id="industry" name="industry" required maxlength="80" placeholder="e.g., SaaS, Agency, E-commerce"></div>
      <div class="field full"><label for="firstJobTitle">First job title you intend to post *</label><input id="firstJobTitle" name="firstJobTitle" required maxlength="140" placeholder="e.g., Remote Customer Support Executive"></div>
      <div class="field full"><label for="hiringNote">Hiring note</label><textarea id="hiringNote" name="hiringNote" maxlength="1200" placeholder="Briefly describe the role and hiring need. Do not include OTP, bank, upfront-payment, or candidate-fee requests."></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required> <span>I confirm that my organisation will post genuine roles only, will not charge candidates any fee, and agree to the <a href="terms.html" target="_blank">Terms</a>, employer review, and the <a href="privacy.html" target="_blank">Privacy Notice</a>.</span></label>
    <button class="button button-primary full" type="submit">Submit employer account for review</button>
    <p class="form-status" aria-live="polite"></p>`,

  report: () => `
    <h2>Report a concern</h2>
    <p class="modal-intro">Use this form for suspicious listing, employer, applicant, payment, or privacy concerns. For immediate financial fraud, contact your bank and the appropriate authorities first.</p>
    <div class="report-box">Never share OTPs, bank passwords, card CVVs, UPI PINs, or pay an employer to receive a job, interview, training, device, or offer letter.</div>
    <div class="form-divider"></div>
    <div class="form-grid">
      <div class="field"><label for="reporterEmail">Your email *</label><input id="reporterEmail" name="reporterEmail" required type="email" maxlength="120" placeholder="you@example.com"></div>
      <div class="field"><label for="reportType">Concern type *</label><select id="reportType" name="reportType" required><option value="">Choose one</option><option>Suspicious job listing</option><option>Employer asked for money</option><option>Impersonation</option><option>Privacy concern</option><option>Other</option></select></div>
      <div class="field full"><label for="targetUrl">Relevant job / profile URL</label><input id="targetUrl" name="targetUrl" type="url" maxlength="255" placeholder="https://jobfromhome.in/... (if available)"></div>
      <div class="field full"><label for="reportDetails">What happened? *</label><textarea id="reportDetails" name="reportDetails" required maxlength="2000" placeholder="Give clear details. Do not include passwords, OTPs, bank PINs, or card information."></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required> <span>I confirm that the information I provided is accurate to the best of my knowledge.</span></label>
    <button class="button button-dark full" type="submit">Submit report</button>
    <p class="form-status" aria-live="polite"></p>`
};

function openModal(type) {
  formContent.innerHTML = templates[type]();
  modal.dataset.type = type;
  modal.showModal();
}

function closeModal() {
  if (modal.open) modal.close();
}

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.open));
});

document.querySelector("[data-close]").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

function cleanPhone(value) {
  return value.replace(/\D/g, "").slice(-10);
}

function formToObject(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string") data[key] = data[key].trim();
  });
  if (data.phone) data.phone = cleanPhone(data.phone);
  if (data.employerPhone) data.employerPhone = cleanPhone(data.employerPhone);
  data.consent = true;
  return data;
}

function validate(data, type) {
  const email = data.email || data.businessEmail || data.reporterEmail;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
  const phone = data.phone || data.employerPhone;
  if (phone && phone.length !== 10) return "Enter a valid 10-digit Indian mobile number.";
  if (type === "seeker" && (!data.fullName || !data.headline || !data.skills)) return "Complete all required profile fields.";
  if (type === "employer" && (!data.contactName || !data.companyName || !data.firstJobTitle)) return "Complete all required employer fields.";
  if (type === "report" && (!data.reportType || !data.reportDetails)) return "Choose a concern type and provide details.";
  return "";
}

async function postToApi(payload) {
  if (!CONFIG.ENABLE_API || CONFIG.API_URL.includes("PASTE_YOUR")) {
    return { success: true, preview: true };
  }

  const response = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error || "We could not save this request.");
  return result;
}

formContent.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget.closest("form");
  const type = modal.dataset.type;
  const status = form.querySelector(".form-status");
  const submit = form.querySelector("button[type='submit']");
  const data = formToObject(form);
  const error = validate(data, type);

  if (error) {
    status.className = "form-status error";
    status.textContent = error;
    return;
  }

  submit.disabled = true;
  submit.textContent = "Saving…";
  status.className = "form-status";
  status.textContent = "";

  try {
    const result = await postToApi({ action: type === "report" ? "createReport" : "createLead", leadType: type, ...data });
    status.className = "form-status success";
    status.textContent = result.preview
      ? "Preview mode: no data was saved. Add your Apps Script URL and set ENABLE_API to true before launching."
      : type === "employer"
        ? "Employer request saved. Review it in your admin sheet before sending any payment link."
        : type === "report"
          ? "Your report was received. Our team will review it."
          : "Profile request saved. You can now set up account access and payment in your launch flow.";
    submit.textContent = "Saved";
    showToast(result.preview ? "Preview mode: form not connected" : "Request saved successfully");
  } catch (err) {
    status.className = "form-status error";
    status.textContent = err.message || "Could not save your request. Please try again.";
    submit.disabled = false;
    submit.textContent = type === "report" ? "Submit report" : type === "employer" ? "Submit employer account for review" : "Save profile request";
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

/* RemoteIntern employer form — real backend version.
   Replace employer.js with this file after configuring the Apps Script endpoint. */

const REMOTEINTERN_EMPLOYER_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec'
};

function riEmployerMessage(text, type) {
  const element = document.getElementById('employerMessage');
  element.className = 'form-status ' + (type || '');
  element.textContent = text;
}
function riEmployerCleanPhone(value) { return String(value || '').replace(/\D/g, '').slice(-10); }
function riEmployerValidPhone(phone) { return /^[6-9]\d{9}$/.test(phone); }
function riEmployerValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')); }

async function riEmployerPost(payload) {
  const url = REMOTEINTERN_EMPLOYER_CONFIG.APPS_SCRIPT_URL;
  if (!url || url.includes('PASTE_YOUR')) throw new Error('Set REMOTEINTERN_EMPLOYER_CONFIG.APPS_SCRIPT_URL in employer.js first.');
  const response = await fetch(url, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  const raw = await response.text();
  let result;
  try { result = JSON.parse(raw); } catch (error) { throw new Error('Employer server returned an invalid response. Check the Apps Script /exec deployment.'); }
  if (!response.ok || !result.success) throw new Error(result.error || ('Server error: ' + response.status));
  return result;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('employerForm');
  if (!form) return;
  const token = sessionStorage.getItem('jfh_session_token') || '';

  document.getElementById('saveDraftButton').addEventListener('click', function () {
    riEmployerMessage('Draft saving requires your authenticated backend. Complete the form and use Submit for review after backend setup.', 'error');
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const phone = riEmployerCleanPhone(data.get('employerPhone'));
    if (!token) { window.location.href = 'login.html'; return; }
    if (!riEmployerValidEmail(data.get('businessEmail'))) { riEmployerMessage('Enter a valid work email address.', 'error'); return; }
    if (!riEmployerValidPhone(phone)) { riEmployerMessage('Enter a valid 10-digit Indian mobile number.', 'error'); return; }
    if (new Date(String(data.get('deadline')) + 'T23:59:59') <= new Date()) { riEmployerMessage('Choose an application deadline in the future.', 'error'); return; }
    if (data.get('stipendType') === 'Paid' && Number(data.get('stipend') || 0) <= 0) { riEmployerMessage('Enter a valid monthly stipend for a paid internship.', 'error'); return; }
    if (data.get('remoteOnly') !== 'on' || data.get('safetyDeclaration') !== 'on') { riEmployerMessage('Accept the remote-only and candidate safety declarations.', 'error'); return; }

    const button = document.getElementById('saveEmployerButton');
    button.disabled = true;
    button.textContent = 'Submitting…';
    riEmployerMessage('Submitting your employer profile and internship requirement for review.', '');

    try {
      const result = await riEmployerPost({
        action: 'createEmployerProfileAndInternshipRequest',
        token: token,
        contactName: String(data.get('contactName')).trim(),
        businessEmail: String(data.get('businessEmail')).trim().toLowerCase(),
        employerPhone: phone,
        companyName: String(data.get('companyName')).trim(),
        companyWebsite: String(data.get('companyWebsite') || '').trim(),
        industry: String(data.get('industry')).trim(),
        companySize: String(data.get('companySize')).trim(),
        gstin: String(data.get('gstin') || '').trim().toUpperCase(),
        title: String(data.get('title')).trim(),
        category: String(data.get('category')).trim(),
        durationMonths: Number(data.get('duration')),
        deadline: String(data.get('deadline')),
        openings: Number(data.get('openings')),
        hoursPerWeek: Number(data.get('hours')),
        stipendType: String(data.get('stipendType')),
        stipend: Number(data.get('stipend') || 0),
        certificateOffered: data.get('certificate') === 'Yes',
        ppoPossible: data.get('ppo') === 'Yes',
        skills: String(data.get('skills')).split(',').map(function (skill) { return skill.trim(); }).filter(Boolean),
        description: String(data.get('summary')).trim(),
        remoteOnly: true,
        safetyDeclaration: true
      });
      riEmployerMessage('Submitted successfully. Your request ID is ' + (result.internshipId || result.id || 'created') + '. It will remain private until review is complete.', 'success');
      form.reset();
    } catch (error) {
      riEmployerMessage(error.message || 'The request could not be submitted.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Submit for review';
    }
  });
});

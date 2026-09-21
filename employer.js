/* JobFromHome.in employer account form.
   Save as employer.js beside employer.html.
   Paste the SAME deployed Apps Script /exec URL used in app.js. */

const EMPLOYER_CONFIG = {
  APPS_SCRIPT_URL: 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE',
  ENABLE_APPS_SCRIPT: true
};

const employerForm = document.getElementById('employerForm');
const employerMessage = document.getElementById('employerMessage');
const saveEmployerButton = document.getElementById('saveEmployerButton');
const employerPaymentCard = document.getElementById('employerPaymentCard');

function employerShowMessage(text, isError) {
  employerMessage.textContent = text;
  employerMessage.style.color = isError ? '#b42318' : '#15803d';
  employerMessage.style.fontWeight = '600';
}

function employerCleanPhone(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function employerValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function employerValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

async function employerParseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Apps Script returned HTML/non-JSON:', {
      status: response.status,
      url: response.url,
      responseText: text
    });
    throw new Error('Employer server returned HTML instead of JSON. Check your Apps Script /exec URL and deployment access.');
  }
}

async function saveEmployer(data) {
  if (!EMPLOYER_CONFIG.ENABLE_APPS_SCRIPT) {
    throw new Error('Google Sheets saving is disabled. Set ENABLE_APPS_SCRIPT to true.');
  }

  if (!EMPLOYER_CONFIG.APPS_SCRIPT_URL || EMPLOYER_CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) {
    throw new Error('Paste your Apps Script Web App URL ending in /exec into employer.js first.');
  }

  const response = await fetch(EMPLOYER_CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'createLead',
      leadType: 'employer',
      ...data
    })
  });

  const result = await employerParseJson(response);
  if (!response.ok) throw new Error(result.error || ('Employer server returned HTTP ' + response.status));
  if (result.success !== true) throw new Error(result.error || 'Employer account was not saved.');
  return result;
}

if (!employerForm || !employerMessage || !saveEmployerButton || !employerPaymentCard) {
  console.warn('employer.js loaded on a page without the employer form. Load employer.js only from employer.html.');
} else {
  employerForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(employerForm);
    const data = {
      contactName: String(formData.get('contactName') || '').trim(),
      businessEmail: String(formData.get('businessEmail') || '').trim().toLowerCase(),
      employerPhone: employerCleanPhone(formData.get('employerPhone')),
      companyName: String(formData.get('companyName') || '').trim(),
      companyWebsite: String(formData.get('companyWebsite') || '').trim(),
      gstin: String(formData.get('gstin') || '').trim().toUpperCase(),
      companySize: String(formData.get('companySize') || '').trim(),
      industry: String(formData.get('industry') || '').trim(),
      firstJobTitle: String(formData.get('firstJobTitle') || '').trim(),
      hiringNote: String(formData.get('hiringNote') || '').trim(),
      consent: formData.get('consent') === 'on'
    };

    if (!data.contactName || !data.companyName || !data.companySize || !data.industry || !data.firstJobTitle) {
      employerShowMessage('Complete every required employer field.', true);
      return;
    }

    if (!employerValidEmail(data.businessEmail)) {
      employerShowMessage('Enter a valid work email address.', true);
      return;
    }

    if (!employerValidPhone(data.employerPhone)) {
      employerShowMessage('Enter a valid 10-digit Indian mobile number beginning with 6, 7, 8, or 9.', true);
      return;
    }

    if (!data.consent) {
      employerShowMessage('Accept the Terms and employer review conditions before submitting.', true);
      return;
    }

    saveEmployerButton.disabled = true;
    saveEmployerButton.textContent = 'Saving employer request…';
    employerShowMessage('Saving your employer request. Please wait…', false);

    try {
      const result = await saveEmployer(data);
      employerShowMessage('Employer request saved successfully. Your ID is ' + (result.id || 'created') + '.', false);
      employerPaymentCard.hidden = false;
      saveEmployerButton.textContent = 'Employer request saved ✓';
      employerForm.dataset.saved = 'true';
    } catch (error) {
      console.error('Employer account save failed:', error);
      employerShowMessage(error.message || 'Employer account could not be saved. Please try again.', true);
      saveEmployerButton.disabled = false;
      saveEmployerButton.textContent = 'Submit employer account for review';
    }
  });
}

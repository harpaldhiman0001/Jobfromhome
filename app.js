/* JobFromHome.in complete-profile page script.
   Save this file as app.js beside app.html.
   Replace APPS_SCRIPT_URL with your deployed Apps Script Web App URL ending in /exec. */

const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec',
  ENABLE_APPS_SCRIPT: true
};

const form = document.getElementById('seekerForm');
const message = document.getElementById('profileMessage');
const saveButton = document.getElementById('saveProfileButton');
const paymentCard = document.getElementById('paymentCard');

function showMessage(text, isError) {
  message.textContent = text;
  message.style.color = isError ? '#b42318' : '#15803d';
  message.style.fontWeight = '600';
}

function cleanPhone(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function validIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Apps Script returned HTML/non-JSON:', {
      status: response.status,
      url: response.url,
      redirected: response.redirected,
      responseText: text
    });
    throw new Error('Profile server returned HTML instead of JSON. Confirm the Apps Script URL ends in /exec and deployment access is Anyone.');
  }
}

async function saveProfile(data) {
  if (!CONFIG.ENABLE_APPS_SCRIPT) {
    throw new Error('Google Sheets saving is disabled. Set ENABLE_APPS_SCRIPT to true.');
  }

  if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) {
    throw new Error('Paste your Apps Script Web App URL ending in /exec into app.js first.');
  }

  let response;
  try {
    response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'createLead',
        leadType: 'seeker',
        ...data
      })
    });
  } catch (error) {
    console.error('Apps Script network error:', error);
    throw new Error('Could not contact the profile server. Check your Apps Script Web App deployment and URL.');
  }

  const result = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(result.error || ('Profile server returned HTTP ' + response.status));
  }

  if (result.success !== true) {
    throw new Error(result.error || 'Profile was not saved.');
  }

  return result;
}

if (!form || !message || !saveButton || !paymentCard) {
  console.warn('app.js loaded on a page without the profile form. Load app.js only from app.html.');
} else {
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim().toLowerCase(),
      phone: cleanPhone(formData.get('phone')),
      city: String(formData.get('city') || '').trim(),
      headline: String(formData.get('headline') || '').trim(),
      experience: String(formData.get('experience') || '').trim(),
      workPreference: String(formData.get('workPreference') || '').trim(),
      skills: String(formData.get('skills') || '').trim(),
      portfolio: String(formData.get('portfolio') || '').trim(),
      summary: String(formData.get('summary') || '').trim(),
      consent: formData.get('consent') === 'on'
    };

    if (!data.fullName || !data.headline || !data.experience || !data.workPreference || !data.skills) {
      showMessage('Complete every required profile field.', true);
      return;
    }

    if (!validEmail(data.email)) {
      showMessage('Enter a valid email address.', true);
      return;
    }

    if (!validIndianPhone(data.phone)) {
      showMessage('Enter a valid 10-digit Indian mobile number beginning with 6, 7, 8, or 9.', true);
      return;
    }

    if (!data.consent) {
      showMessage('Accept the Terms and Privacy Policy before submitting.', true);
      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Saving profile…';
    showMessage('Saving your profile. Please wait…', false);

    try {
      const result = await saveProfile(data);
      showMessage('Profile saved successfully. Your ID is ' + (result.id || 'created') + '.', false);
      paymentCard.hidden = false;
      saveButton.textContent = 'Profile saved ✓';
      form.dataset.saved = 'true';
    } catch (error) {
      console.error('Seeker profile save failed:', error);
      showMessage(error.message || 'Profile could not be saved. Please try again.', true);
      saveButton.disabled = false;
      saveButton.textContent = 'Complete profile';
    }
  });
}

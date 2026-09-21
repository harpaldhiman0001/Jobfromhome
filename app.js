/*
 JobFromHome.in profile form JavaScript — fixed version

 IMPORTANT:
 1. This is JavaScript only. Do NOT paste HTML into this file.
 2. Save this file as exactly: app.js
 3. Your HTML page must contain: <script src="app.js"></script>
 4. Paste your Apps Script WEB APP URL ending in /exec below.
*/

const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec',
  ENABLE_APPS_SCRIPT: true
};

const form = document.getElementById('seekerForm');
const message = document.getElementById('profileMessage');
const saveButton = document.getElementById('saveProfileButton');
const paymentCard = document.getElementById('paymentCard');

function showMessage(text, isError) {
  if (!message) return;
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

async function parseJsonResponse(response, label) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error(label + ' returned non-JSON response', {
      status: response.status,
      url: response.url,
      redirected: response.redirected,
      contentType: response.headers.get('content-type'),
      responseText: text
    });

    throw new Error(
      label + ' returned HTML instead of JSON. Check Console and confirm the Apps Script URL ends in /exec.'
    );
  }

  return data;
}

async function saveProfile(data) {
  if (!CONFIG.ENABLE_APPS_SCRIPT) {
    throw new Error('Google Sheets is disabled. Set ENABLE_APPS_SCRIPT to true in app.js.');
  }

  if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) {
    throw new Error('Add your Apps Script Web App URL ending in /exec to app.js.');
  }

  let response;

  try {
    response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'createLead',
        leadType: 'seeker',
        ...data
      })
    });
  } catch (error) {
    console.error('Network error when calling Apps Script:', error);
    throw new Error('Could not reach the profile server. Check your Apps Script deployment and URL.');
  }

  const result = await parseJsonResponse(response, 'Google Apps Script');

  if (!response.ok) {
    throw new Error(result.error || ('Profile server returned HTTP ' + response.status));
  }

  if (result.success !== true) {
    throw new Error(result.error || 'Profile was not saved.');
  }

  return result;
}

if (!form || !message || !saveButton || !paymentCard) {
  console.error('Profile page is missing required elements. Confirm app.html contains seekerForm, profileMessage, saveProfileButton, and paymentCard.');
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

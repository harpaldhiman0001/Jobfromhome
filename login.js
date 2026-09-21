const LOGIN_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec'
};

const loginForm = document.getElementById('loginForm');
const codeForm = document.getElementById('codeForm');
const emailInput = document.getElementById('email');
const codeInput = document.getElementById('code');
const sendCodeButton = document.getElementById('sendCodeButton');
const verifyCodeButton = document.getElementById('verifyCodeButton');
const loginMessage = document.getElementById('loginMessage');
const codeMessage = document.getElementById('codeMessage');

function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')); }
function setMessage(element, text, isError) { element.textContent = text; element.style.color = isError ? '#b42318' : '#15803d'; }

async function postApi(payload) {
  if (!LOGIN_CONFIG.APPS_SCRIPT_URL || LOGIN_CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) {
    throw new Error('Paste the Apps Script /exec URL into login.js first.');
  }
  const response = await fetch(LOGIN_CONFIG.APPS_SCRIPT_URL, {
    method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload)
  });
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); }
  catch (error) { console.error('Non-JSON response:', { status: response.status, url: response.url, text }); throw new Error('Login server returned HTML instead of JSON. Check Apps Script URL and deployment access.'); }
  if (!response.ok || !result.success) throw new Error(result.error || ('Server error: ' + response.status));
  return result;
}

loginForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!validEmail(email)) return setMessage(loginMessage, 'Enter a valid email address.', true);
  sendCodeButton.disabled = true;
  sendCodeButton.textContent = 'Sending code…';
  setMessage(loginMessage, 'Sending your login code…', false);
  try {
    const result = await postApi({ action: 'sendLoginCode', email });
    setMessage(loginMessage, result.message, false);
    codeForm.classList.add('show');
    codeInput.focus();
  } catch (error) {
    console.error('Login code request failed:', error);
    setMessage(loginMessage, error.message, true);
  } finally {
    sendCodeButton.disabled = false;
    sendCodeButton.textContent = 'Send login code';
  }
});

codeForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const code = codeInput.value.replace(/\D/g, '');
  if (!/^\d{6}$/.test(code)) return setMessage(codeMessage, 'Enter the 6-digit code from your email.', true);
  verifyCodeButton.disabled = true;
  verifyCodeButton.textContent = 'Verifying…';
  setMessage(codeMessage, 'Verifying your code…', false);
  try {
    const result = await postApi({ action: 'verifyLoginCode', email, code });
    sessionStorage.setItem('jfh_session_token', result.token);
    sessionStorage.setItem('jfh_session_expires', result.expiresAt);
    sessionStorage.setItem('jfh_user_role', result.role);
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Login verification failed:', error);
    setMessage(codeMessage, error.message, true);
  } finally {
    verifyCodeButton.disabled = false;
    verifyCodeButton.textContent = 'Verify and continue';
  }
});

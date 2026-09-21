const DASHBOARD_CONFIG = { APPS_SCRIPT_URL: 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE' };
const token = sessionStorage.getItem('jfh_session_token');
const loading = document.getElementById('loading');
const dashboard = document.getElementById('dashboard');
const logoutButton = document.getElementById('logoutButton');

function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]; }); }
function statusClass(value) { return String(value || '').toLowerCase().replace(/\s+/g, '-'); }
function dateText(value) { if (!value) return '—'; const d = new Date(value); return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }

async function postApi(payload) {
  if (!DASHBOARD_CONFIG.APPS_SCRIPT_URL || DASHBOARD_CONFIG.APPS_SCRIPT_URL.includes('PASTE_YOUR')) throw new Error('Paste the Apps Script /exec URL into dashboard.js first.');
  const response = await fetch(DASHBOARD_CONFIG.APPS_SCRIPT_URL, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); }
  catch (error) { console.error('Dashboard API non-JSON:', { status: response.status, url: response.url, text }); throw new Error('Dashboard server returned HTML instead of JSON.'); }
  if (!response.ok || !result.success) { const err = new Error(result.error || ('Server error: ' + response.status)); err.authExpired = result.authExpired; throw err; }
  return result;
}

function addRow(label, value) { return '<div class="row"><div class="key">' + escapeHtml(label) + '</div><div class="value">' + escapeHtml(value || '—') + '</div></div>'; }

function renderDashboard(data) {
  const user = data.user;
  document.getElementById('welcome').textContent = 'Welcome, ' + (user.fullName || 'Member');
  document.getElementById('dashboardSub').textContent = 'Profile ID: ' + user.id + ' · Created ' + dateText(user.createdAt);
  const rolePill = document.getElementById('rolePill');
  rolePill.textContent = user.role === 'employer' ? 'EMPLOYER' : 'JOB SEEKER';

  const profileRows = document.getElementById('profileRows');
  if (user.role === 'employer') {
    profileRows.innerHTML = addRow('Contact name', user.fullName) + addRow('Work email', user.email) + addRow('Phone', user.phone) + addRow('Company', user.companyName) + addRow('Website', user.website) + addRow('Industry', user.industry) + addRow('Company size', user.companySize) + addRow('First job request', user.firstJobTitle) + addRow('Verification status', user.verificationStatus) + addRow('Payment status', user.paymentStatus);
  } else {
    profileRows.innerHTML = addRow('Full name', user.fullName) + addRow('Email', user.email) + addRow('Phone', user.phone) + addRow('City', user.city) + addRow('Headline', user.headline) + addRow('Experience', user.experience) + addRow('Work preference', user.workPreference) + addRow('Skills', user.skills) + addRow('Portfolio', user.portfolio) + addRow('Account status', user.accountStatus) + addRow('Payment status', user.paymentStatus);
  }

  const paymentList = document.getElementById('paymentList');
  const fallback = document.getElementById('planFallback');
  if (!data.payments || data.payments.length === 0) {
    paymentList.innerHTML = '';
    fallback.hidden = false;
  } else {
    fallback.hidden = true;
    paymentList.innerHTML = data.payments.map(function(payment) {
      return '<article class="payment"><h3>' + escapeHtml(payment.plan || 'Plan') + '</h3><p><span class="pill ' + statusClass(payment.status) + '">' + escapeHtml(payment.status || 'Pending') + '</span></p><p>Amount: ₹' + escapeHtml(payment.amount || '—') + '</p><p>Start: ' + escapeHtml(dateText(payment.startsAt)) + '<br>Expiry: ' + escapeHtml(dateText(payment.endsAt)) + '</p></article>';
    }).join('');
  }

  const applicationList = document.getElementById('applicationList');
  if (user.role === 'employer') {
    applicationList.innerHTML = '<p class="empty">Employer applicant management will appear here after genuine jobs are approved and applications are received.</p>';
  } else if (!data.applications || data.applications.length === 0) {
    applicationList.innerHTML = '<p class="empty">No applications recorded yet. Only real applications to active employer-approved jobs should appear here.</p>';
  } else {
    applicationList.innerHTML = data.applications.map(function(app) {
      return '<article class="application"><h3>' + escapeHtml(app.jobTitle || 'Job application') + '</h3><p>' + escapeHtml(app.companyName || 'Company') + '</p><p>Applied: ' + escapeHtml(dateText(app.appliedAt)) + '</p><p><span class="pill ' + statusClass(app.status) + '">' + escapeHtml(app.status || 'Submitted') + '</span></p>' + (app.employerNote ? '<p>Employer note: ' + escapeHtml(app.employerNote) + '</p>' : '') + '</article>';
    }).join('');
  }

  loading.hidden = true;
  dashboard.hidden = false;
}

async function loadDashboard() {
  if (!token) { window.location.href = 'login.html'; return; }
  try { renderDashboard(await postApi({ action: 'getDashboard', token })); }
  catch (error) { console.error('Dashboard load failed:', error); sessionStorage.removeItem('jfh_session_token'); if (error.authExpired) window.location.href = 'login.html'; else { loading.textContent = error.message; } }
}

logoutButton.addEventListener('click', async function() {
  try { if (token) await postApi({ action: 'logout', token }); } catch (error) { console.warn('Logout request failed:', error); }
  sessionStorage.removeItem('jfh_session_token'); sessionStorage.removeItem('jfh_session_expires'); sessionStorage.removeItem('jfh_user_role'); window.location.href = 'login.html';
});

loadDashboard();

/* RemoteIntern public internship directory — real backend version.
   Paste your deployed Google Apps Script /exec endpoint below.
   This file does not create demo users, demo internships, or localStorage records. */

const REMOTEINTERN_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec'
};

function riEscapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
  });
}

function riDateText(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function riShowToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__riToastTimer);
  window.__riToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
}

async function riPostApi(payload) {
  const url = REMOTEINTERN_CONFIG.APPS_SCRIPT_URL;
  if (!url || url.includes('PASTE_YOUR')) throw new Error('Set REMOTEINTERN_CONFIG.APPS_SCRIPT_URL in app.js before using the live platform.');
  const response = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); } catch (error) { throw new Error('The server returned an invalid response. Check the deployed Apps Script /exec URL.'); }
  if (!response.ok || !result.success) {
    const requestError = new Error(result.error || ('Request failed with status ' + response.status));
    requestError.authExpired = result.authExpired;
    throw requestError;
  }
  return result;
}

function riSessionToken() {
  return sessionStorage.getItem('jfh_session_token') || '';
}

function riInternshipCard(internship) {
  const logo = String(internship.companyName || internship.company || 'RI').split(/\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 2).toUpperCase();
  const color = ['purple', 'orange', 'green'][Math.abs(String(internship.id || internship.title).length) % 3];
  const title = internship.title || 'Remote Internship';
  const company = internship.companyName || internship.company || 'Verified employer';
  const stipend = internship.stipendText || internship.stipend || (internship.stipendType === 'Unpaid' ? 'Unpaid internship' : 'Stipend details available after review');
  const deadline = riDateText(internship.deadline);
  return '<article class="job-card">' +
    '<div class="job-card-head"><span class="company-icon ' + color + '">' + riEscapeHtml(logo) + '</span></div>' +
    '<h3>' + riEscapeHtml(title) + '</h3>' +
    '<p class="company-name">' + riEscapeHtml(company) + ' · Verified employer</p>' +
    '<div class="tags"><span>Remote</span><span>' + riEscapeHtml(internship.category || 'Internship') + '</span><span>' + riEscapeHtml(String(internship.durationMonths || internship.duration || '—')) + ' months</span></div>' +
    '<p class="salary">' + riEscapeHtml(stipend) + '</p>' +
    '<div class="job-card-foot"><span>Apply by ' + deadline + '</span><button class="text-button ri-view-internship" data-id="' + riEscapeHtml(internship.id) + '">View & apply →</button></div>' +
  '</article>';
}

let riInternships = [];
let riSelectedInternshipId = null;

function riRenderInternships() {
  const grid = document.getElementById('internshipGrid');
  const featured = document.getElementById('featuredInternships');
  const search = document.getElementById('searchInput');
  const category = document.getElementById('categoryFilter');
  const stipend = document.getElementById('stipendFilter');
  const duration = document.getElementById('durationFilter');
  const query = search ? search.value.trim().toLowerCase() : '';
  const selectedCategory = category ? category.value : 'All';
  const selectedStipend = stipend ? stipend.value : 'All';
  const selectedDuration = duration ? duration.value : 'All';

  const filtered = riInternships.filter(function (item) {
    const searchable = [item.title, item.companyName, item.company, item.category].concat(item.skills || []).join(' ').toLowerCase();
    const itemStipendType = item.stipendType || '';
    const itemDuration = String(item.durationMonths || item.duration || '');
    return (!query || searchable.includes(query)) &&
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (selectedStipend === 'All' || itemStipendType === selectedStipend) &&
      (selectedDuration === 'All' || itemDuration === selectedDuration);
  });

  if (grid) {
    document.getElementById('internshipCount').textContent = filtered.length + ' internship' + (filtered.length === 1 ? '' : 's') + ' found';
    grid.innerHTML = filtered.length ? filtered.map(riInternshipCard).join('') : '<div class="empty-state directory-empty"><span>⌕</span><div><strong>No internships found</strong><p>Try another search or return later for newly approved opportunities.</p></div></div>';
  }
  if (featured) {
    featured.innerHTML = riInternships.length ? riInternships.slice(0, 3).map(riInternshipCard).join('') : '<div class="empty-state"><span>⌕</span><div><strong>No internships are available yet</strong><p>Please return later for approved remote internship opportunities.</p></div></div>';
  }
}

async function riLoadInternships() {
  try {
    const result = await riPostApi({ action: 'searchApprovedInternships' });
    riInternships = Array.isArray(result.internships) ? result.internships : [];
    const category = document.getElementById('categoryFilter');
    if (category) {
      const categories = ['All'].concat(Array.from(new Set(riInternships.map(function (item) { return item.category; }).filter(Boolean))));
      category.innerHTML = categories.map(function (item) { return '<option value="' + riEscapeHtml(item) + '">' + (item === 'All' ? 'All categories' : riEscapeHtml(item)) + '</option>'; }).join('');
    }
    riRenderInternships();
  } catch (error) {
    const grid = document.getElementById('internshipGrid');
    const featured = document.getElementById('featuredInternships');
    const message = '<div class="empty-state"><span>!</span><div><strong>Internships could not be loaded</strong><p>' + riEscapeHtml(error.message) + '</p></div></div>';
    if (grid) grid.innerHTML = message;
    if (featured) featured.innerHTML = message;
  }
}

function riOpenInternship(id) {
  const internship = riInternships.find(function (item) { return String(item.id) === String(id); });
  const modal = document.getElementById('internshipModal');
  if (!internship || !modal) return;
  riSelectedInternshipId = internship.id;
  document.getElementById('modalTitle').textContent = internship.title || 'Remote Internship';
  document.getElementById('modalCompany').textContent = (internship.companyName || internship.company || 'Verified employer') + ' · Remote internship';
  document.getElementById('modalDetails').innerHTML = '<div class="tags modal-tags"><span>Remote only</span><span>' + riEscapeHtml(internship.category || 'Internship') + '</span><span>' + riEscapeHtml(internship.stipendText || internship.stipend || 'Stipend details available') + '</span></div>' +
    '<p class="detail-copy">' + riEscapeHtml(internship.description || internship.summary || 'Internship information will be provided by the employer.') + '</p>' +
    '<h3 class="detail-heading">Required skills</h3><div class="tags modal-tags">' + (internship.skills || []).map(function (skill) { return '<span>' + riEscapeHtml(skill) + '</span>'; }).join('') + '</div>' +
    '<p class="detail-deadline">Application deadline: ' + riDateText(internship.deadline) + '</p>';
  document.getElementById('applyMessage').textContent = '';
  modal.showModal();
}

async function riApplyToInternship() {
  const message = document.getElementById('applyMessage');
  const token = riSessionToken();
  if (!token) { window.location.href = 'login.html'; return; }
  if (!riSelectedInternshipId) return;
  const button = document.getElementById('applyButton');
  button.disabled = true;
  button.textContent = 'Submitting application…';
  try {
    await riPostApi({ action: 'applyToInternship', token: token, internshipId: riSelectedInternshipId });
    message.className = 'form-status success';
    message.textContent = 'Application submitted successfully. Opening your dashboard…';
    setTimeout(function () { window.location.href = 'dashboard.html'; }, 700);
  } catch (error) {
    message.className = 'form-status error';
    message.textContent = error.message;
    if (error.authExpired) setTimeout(function () { window.location.href = 'login.html'; }, 900);
  } finally {
    button.disabled = false;
    button.textContent = 'Apply to this internship';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  riLoadInternships();
  ['searchInput', 'categoryFilter', 'stipendFilter', 'durationFilter'].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) element.addEventListener(id === 'searchInput' ? 'input' : 'change', riRenderInternships);
  });
  document.addEventListener('click', function (event) {
    const view = event.target.closest('.ri-view-internship');
    if (view) riOpenInternship(view.dataset.id);
    if (event.target.closest('[data-close-modal]')) document.getElementById('internshipModal').close();
  });
  const apply = document.getElementById('applyButton');
  if (apply) apply.addEventListener('click', riApplyToInternship);
});

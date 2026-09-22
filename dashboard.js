/* RemoteIntern authenticated dashboard — real user version.
   Replace dashboard.js with this file after configuring the Apps Script URL below.
   No sample candidates, fake applications, localStorage data, or visible demo labels are used. */

const REMOTEINTERN_DASHBOARD_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwQ-PpxYJtLcPdFPiyWKswD-X0c6tJa6D3HAvrJJnUaf1lxPrEkoEOqmWkKq_6LRbODeg/exec'
};

const riDashboardToken = sessionStorage.getItem('jfh_session_token') || '';
let riDashboardData = null;
let riDashboardRole = null;

function riDashEscape(value) {
  return String(value ?? '').replace(/[&<>'"]/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
  });
}
function riDashDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function riDashStatusClass(status) { return 'status-' + String(status || '').toLowerCase().replace(/\s+/g, '-'); }
function riDashEmpty(title, text) { return '<div class="empty-state"><span>⌕</span><div><strong>' + riDashEscape(title) + '</strong><p>' + riDashEscape(text) + '</p></div></div>'; }

async function riDashPost(payload) {
  const url = REMOTEINTERN_DASHBOARD_CONFIG.APPS_SCRIPT_URL;
  if (!url || url.includes('PASTE_YOUR')) throw new Error('Set REMOTEINTERN_DASHBOARD_CONFIG.APPS_SCRIPT_URL in dashboard.js first.');
  const response = await fetch(url, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  const raw = await response.text();
  let result;
  try { result = JSON.parse(raw); } catch (error) { throw new Error('Dashboard server returned an invalid response. Check your Apps Script /exec deployment.'); }
  if (!response.ok || !result.success) {
    const requestError = new Error(result.error || ('Server error: ' + response.status));
    requestError.authExpired = result.authExpired;
    throw requestError;
  }
  return result;
}

function riDashSidebar(role, name, companyName, active) {
  const candidateLinks = [['overview', 'Overview'], ['applications', 'My applications'], ['saved', 'Saved internships'], ['profile', 'My profile']];
  const employerLinks = [['overview', 'Overview'], ['post', 'Post internship'], ['pipeline', 'Applicant pipeline'], ['candidates', 'Find candidates'], ['company', 'Company profile']];
  const links = role === 'employer' ? employerLinks : candidateLinks;
  const initials = String(role === 'employer' ? companyName : name || 'U').split(/\s+/).map(function (word) { return word.charAt(0); }).join('').slice(0, 2).toUpperCase();
  return '<div class="sidebar-profile"><div class="avatar">' + riDashEscape(initials) + '</div><strong>' + riDashEscape(role === 'employer' ? companyName : name) + '</strong><small>' + (role === 'employer' ? 'Employer workspace' : 'Candidate workspace') + '</small></div>' + links.map(function (link) { return '<button class="side-link ' + (active === link[0] ? 'active' : '') + '" data-ri-tab="' + link[0] + '">' + link[1] + '</button>'; }).join('');
}

function riDashStat(label, value, hint) { return '<article class="stat-card"><small>' + riDashEscape(label) + '</small><strong>' + riDashEscape(value) + '</strong><span>' + riDashEscape(hint) + '</span></article>'; }

function riCandidateApplicationRow(application) {
  return '<div class="dashboard-row"><span class="company-icon purple row-icon">' + riDashEscape(String(application.companyName || 'RI').slice(0, 2).toUpperCase()) + '</span><div class="row-info"><strong>' + riDashEscape(application.title || 'Remote Internship') + '</strong><small>' + riDashEscape(application.companyName || 'Employer') + ' · Applied ' + riDashDate(application.appliedAt) + (application.candidateVisibleNote ? '<br>' + riDashEscape(application.candidateVisibleNote) : '') + '</small></div><span class="status-chip ' + riDashStatusClass(application.status) + '">' + riDashEscape(application.status || 'Applied') + '</span></div>';
}

function riRenderCandidateOverview(data) {
  const profile = data.profile || {};
  const applications = Array.isArray(data.applications) ? data.applications : [];
  const stats = data.metrics || {};
  const percent = Number(profile.profileCompletion || 0);
  return '<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>Welcome, ' + riDashEscape((data.user && data.user.name) || 'Candidate') + '</h1><p>Track your remote internship applications, tasks, interviews and offers.</p></div><a class="button button-primary" href="app.html">Find internships</a></div>' +
    '<section class="kpi-grid">' + riDashStat('Applications submitted', stats.applicationsSubmitted || applications.length, 'All applications') + riDashStat('Under review', stats.underReview || 0, 'Employer reviewing') + riDashStat('Tasks & interviews', stats.pendingActions || 0, 'Action waiting') + riDashStat('Offers received', stats.offersReceived || 0, 'Decision required') + '</section>' +
    '<section class="dashboard-grid-two"><article class="panel"><div class="panel-heading"><h2>Application tracker</h2><button class="text-button" data-ri-tab="applications">View all</button></div>' + (applications.length ? applications.slice(0, 5).map(riCandidateApplicationRow).join('') : riDashEmpty('No applications yet.', 'Find a remote internship and submit your first application.')) + '</article><article class="panel"><div class="panel-heading"><h2>Profile completion</h2><strong>' + percent + '%</strong></div><div class="progress"><b style="width:' + Math.max(0, Math.min(100, percent)) + '%"></b></div><div class="check-item"><b>✓</b>Complete your profile to improve internship matches</div><div class="check-item"><b>✓</b>Keep skills and portfolio links up to date</div></article></section>';
}

function riRenderCandidateApplications(data) {
  const applications = Array.isArray(data.applications) ? data.applications : [];
  return '<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>My applications</h1><p>All visible application updates appear here. Employer-private notes are never shown.</p></div></div><section class="panel">' + (applications.length ? applications.map(riCandidateApplicationRow).join('') : riDashEmpty('No applications yet.', 'Your submitted internship applications will appear here.')) + '</section>';
}

function riRenderCandidateSaved(data) {
  const items = Array.isArray(data.savedInternships) ? data.savedInternships : [];
  return '<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>Saved internships</h1><p>Save opportunities to review them later.</p></div><a class="button button-secondary" href="app.html">Find internships</a></div><section class="job-grid">' + (items.length ? items.map(function (item) { return '<article class="job-card"><h3>' + riDashEscape(item.title || 'Remote Internship') + '</h3><p class="company-name">' + riDashEscape(item.companyName || 'Verified employer') + '</p><p class="salary">' + riDashEscape(item.stipendText || item.stipend || 'Stipend details available') + '</p><div class="job-card-foot"><span>Apply by ' + riDashDate(item.deadline) + '</span><a class="text-button" href="app.html">View opportunity →</a></div></article>'; }).join('') : riDashEmpty('No saved internships.', 'Use the save feature while browsing internships.')) + '</section>';
}

function riRenderCandidateProfile(data) {
  const profile = data.profile || {};
  return '<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>My profile</h1><p>Your contact details remain private. Employers can only view your profile according to your consent settings.</p></div></div><section class="panel"><form id="riCandidateProfileForm"><div class="form-grid"><div class="field"><label>Headline</label><input name="headline" value="' + riDashEscape(profile.headline || '') + '" required /></div><div class="field"><label>City / state</label><input name="location" value="' + riDashEscape(profile.location || '') + '" required /></div><div class="field full"><label>Skills, separated by commas</label><input name="skills" value="' + riDashEscape(Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '')) + '" required /></div><div class="field"><label>Available from</label><input type="date" name="availableFrom" value="' + riDashEscape(profile.availableFrom || '') + '" /></div><div class="field"><label>Weekly availability</label><input name="hours" value="' + riDashEscape(profile.hours || '') + '" /></div><div class="field full"><label>Portfolio URL</label><input type="url" name="portfolio" value="' + riDashEscape(profile.portfolio || '') + '" /></div><label class="consent field full"><input type="checkbox" name="discoverable" ' + (profile.discoverable ? 'checked' : '') + ' /> I am open to internship opportunities from verified employers.</label></div><p id="riProfileMessage" class="form-status"></p><button class="button button-primary" type="submit">Save profile</button></form></section>';
}

function riEmployerApplicantRow(application) {
  return '<div class="dashboard-row"><span class="avatar row-avatar">' + riDashEscape(String(application.candidateName || 'C').split(/\s+/).map(function (word) { return word.charAt(0); }).join('').slice(0, 2)) + '</span><div class="row-info"><strong>' + riDashEscape(application.candidateName || 'Candidate') + '</strong><small>' + riDashEscape(application.headline || application.title || 'Applicant') + '</small></div><span class="status-chip ' + riDashStatusClass(application.status) + '">' + riDashEscape(application.status || 'Applied') + '</span></div>';
}

function riRenderEmployerOverview(data) {
  const metrics = data.metrics || {};
  const applicants = Array.isArray(data.applicants) ? data.applicants : [];
  return '<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Manage your remote internships</h1><p>Post internship requirements, review real applicants, and manage each stage securely.</p></div><button class="button button-primary" data-ri-tab="post">Post remote internship</button></div><section class="kpi-grid">' + riDashStat('Active internships', metrics.activeInternships || 0, 'Live and discoverable') + riDashStat('Total applicants', metrics.totalApplicants || applicants.length, 'Across your internships') + riDashStat('Shortlisted', metrics.shortlisted || 0, 'In progress') + riDashStat('Offers sent', metrics.offersSent || 0, 'Awaiting response') + '</section><section class="dashboard-grid-two"><article class="panel"><div class="panel-heading"><h2>Recent applicants</h2><button class="text-button" data-ri-tab="pipeline">Open pipeline</button></div>' + (applicants.length ? applicants.slice(0, 5).map(riEmployerApplicantRow).join('') : riDashEmpty('No applicants yet.', 'Applicants will appear after an approved internship receives applications.')) + '</article><article class="panel"><div class="panel-heading"><h2>Company verification</h2></div><div class="check-item"><b>✓</b>' + riDashEscape((data.company && data.company.verificationStatus) || 'Verification status pending') + '</div><div class="check-item"><b>•</b>Review candidate applications promptly</div><div class="check-item"><b>•</b>Keep all candidate communication professional and fee-free</div></article></section>';
}

function riRenderEmployerPost() {
  return '<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Post remote internship</h1><p>Every requirement is reviewed before publication. Candidate fees, deposits, OTP requests and banking-information requests are prohibited.</p></div></div><section class="panel"><form id="riInternshipForm"><div class="form-grid"><div class="field"><label>Internship title *</label><input name="title" required /></div><div class="field"><label>Category *</label><input name="category" required /></div><div class="field"><label>Duration in months *</label><input type="number" name="durationMonths" min="1" max="24" required /></div><div class="field"><label>Application deadline *</label><input type="date" name="deadline" required /></div><div class="field"><label>Stipend type *</label><select name="stipendType" required><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Negotiable">Negotiable</option></select></div><div class="field"><label>Monthly stipend in INR</label><input type="number" name="stipend" min="0" /></div><div class="field full"><label>Required skills *</label><input name="skills" placeholder="HTML, CSS, JavaScript" required /></div><div class="field full"><label>Summary, responsibilities and learning outcomes *</label><textarea name="description" required></textarea></div><label class="consent field full"><input type="checkbox" name="remoteOnly" checked required /> This is a remote work-from-home internship only.</label><label class="consent field full"><input type="checkbox" name="safetyDeclaration" required /> I will not charge candidates fees, request deposits/training payment, request OTPs, or ask for banking information.</label></div><p id="riInternshipMessage" class="form-status"></p><button class="button button-primary" type="submit">Submit for review</button></form></section>';
}

function riRenderEmployerPipeline(data) {
  const applicants = Array.isArray(data.applicants) ? data.applicants : [];
  const stages = ['Applied', 'Under review', 'Shortlisted', 'Task sent', 'Interview invited', 'Offer sent'];
  return '<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Applicant pipeline</h1><p>Only applicants to your own internships are shown. Private notes must never be exposed to candidates.</p></div></div><section class="pipeline-board">' + stages.map(function (stage) { const group = applicants.filter(function (item) { return item.status === stage; }); return '<article class="pipeline-column"><h3>' + stage + ' <small>(' + group.length + ')</small></h3>' + (group.length ? group.map(function (item) { return '<div class="candidate-card"><strong>' + riDashEscape(item.candidateName || 'Candidate') + '</strong><p>' + riDashEscape(item.headline || item.internshipTitle || '') + '</p><div class="candidate-actions"><button class="text-button" data-ri-application="' + riDashEscape(item.id) + '" data-ri-action="move">Move →</button><button class="text-button" data-ri-application="' + riDashEscape(item.id) + '" data-ri-action="note">Private note</button></div></div>'; }).join('') : '<p class="pipeline-empty">No candidates</p>') + '</article>'; }).join('') + '</section>';
}

function riRenderEmployerCandidates(data) {
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  return '<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Find candidates</h1><p>Only candidates who have opted in to discoverability are shown. Contact information remains protected.</p></div></div><section class="job-grid">' + (candidates.length ? candidates.map(function (candidate) { return '<article class="job-card"><h3>' + riDashEscape(candidate.displayName || candidate.name || 'Candidate') + '</h3><p class="company-name">' + riDashEscape(candidate.location || candidate.city || '') + '</p><div class="tags">' + (candidate.skills || []).slice(0, 4).map(function (skill) { return '<span>' + riDashEscape(skill) + '</span>'; }).join('') + '</div><p class="salary">Available: ' + riDashEscape(candidate.availability || 'Not specified') + '</p><div class="job-card-foot"><span>Portfolio ' + (candidate.portfolio ? 'available' : 'not provided') + '</span><button class="text-button" data-ri-candidate="' + riDashEscape(candidate.id) + '">Invite to apply →</button></div></article>'; }).join('') : riDashEmpty('No matching candidates.', 'Candidates will appear here after they create profiles and choose to be discoverable.')) + '</section>';
}

function riRenderEmployerCompany(data) {
  const company = data.company || {};
  return '<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Company profile</h1><p>Update company details. Verification status can only be changed by platform administrators.</p></div></div><section class="panel"><form id="riCompanyForm"><div class="form-grid"><div class="field"><label>Company name</label><input name="companyName" value="' + riDashEscape(company.name || company.companyName || '') + '" required /></div><div class="field"><label>Industry</label><input name="industry" value="' + riDashEscape(company.industry || '') + '" required /></div><div class="field"><label>Website</label><input type="url" name="website" value="' + riDashEscape(company.website || '') + '" /></div><div class="field full"><label>About company</label><textarea name="about">' + riDashEscape(company.about || '') + '</textarea></div></div><div class="report-box">Verification status: <strong>' + riDashEscape(company.verificationStatus || 'Pending') + '</strong></div><p id="riCompanyMessage" class="form-status"></p><button class="button button-primary" type="submit">Save company profile</button></form></section>';
}

async function riDashLoad(role) {
  if (!riDashboardToken) { window.location.href = 'login.html'; return; }
  try {
    const result = await riDashPost({ action: role === 'employer' ? 'getEmployerDashboard' : 'getCandidateDashboard', token: riDashboardToken });
    riDashboardData = result;
    riDashboardRole = result.role || role;
    riDashRender('overview');
  } catch (error) {
    if (error.authExpired) { sessionStorage.removeItem('jfh_session_token'); window.location.href = 'login.html'; return; }
    document.getElementById('dashboard').innerHTML = riDashEmpty('Dashboard could not be loaded.', error.message);
  }
}

function riDashRender(tab) {
  if (!riDashboardData) return;
  const role = riDashboardRole === 'employer' ? 'employer' : 'candidate';
  const name = riDashboardData.user && riDashboardData.user.name;
  const companyName = riDashboardData.company && (riDashboardData.company.name || riDashboardData.company.companyName);
  document.getElementById('sidebar').innerHTML = riDashSidebar(role, name, companyName, tab);
  const views = role === 'employer' ? { overview: riRenderEmployerOverview, post: riRenderEmployerPost, pipeline: riRenderEmployerPipeline, candidates: riRenderEmployerCandidates, company: riRenderEmployerCompany } : { overview: riRenderCandidateOverview, applications: riRenderCandidateApplications, saved: riRenderCandidateSaved, profile: riRenderCandidateProfile };
  document.getElementById('dashboard').innerHTML = views[tab](riDashboardData);
  riDashAttachForms();
}

function riDashAttachForms() {
  const profile = document.getElementById('riCandidateProfileForm');
  if (profile) profile.addEventListener('submit', async function (event) { event.preventDefault(); const data = new FormData(profile); const message = document.getElementById('riProfileMessage'); try { await riDashPost({ action: 'updateCandidateProfile', token: riDashboardToken, headline: data.get('headline'), location: data.get('location'), skills: String(data.get('skills')).split(',').map(function (item) { return item.trim(); }).filter(Boolean), availableFrom: data.get('availableFrom'), hours: data.get('hours'), portfolio: data.get('portfolio'), discoverable: data.get('discoverable') === 'on' }); message.className = 'form-status success'; message.textContent = 'Profile saved successfully.'; await riDashLoad('candidate'); } catch (error) { message.className = 'form-status error'; message.textContent = error.message; } });
  const internship = document.getElementById('riInternshipForm');
  if (internship) internship.addEventListener('submit', async function (event) { event.preventDefault(); const data = new FormData(internship); const message = document.getElementById('riInternshipMessage'); try { await riDashPost({ action: 'createInternshipRequest', token: riDashboardToken, title: data.get('title'), category: data.get('category'), durationMonths: Number(data.get('durationMonths')), deadline: data.get('deadline'), stipendType: data.get('stipendType'), stipend: Number(data.get('stipend') || 0), skills: String(data.get('skills')).split(',').map(function (item) { return item.trim(); }).filter(Boolean), description: data.get('description'), remoteOnly: data.get('remoteOnly') === 'on', safetyDeclaration: data.get('safetyDeclaration') === 'on' }); message.className = 'form-status success'; message.textContent = 'Internship submitted for review.'; internship.reset(); } catch (error) { message.className = 'form-status error'; message.textContent = error.message; } });
  const company = document.getElementById('riCompanyForm');
  if (company) company.addEventListener('submit', async function (event) { event.preventDefault(); const data = new FormData(company); const message = document.getElementById('riCompanyMessage'); try { await riDashPost({ action: 'updateEmployerProfile', token: riDashboardToken, companyName: data.get('companyName'), industry: data.get('industry'), website: data.get('website'), about: data.get('about') }); message.className = 'form-status success'; message.textContent = 'Company profile saved successfully.'; } catch (error) { message.className = 'form-status error'; message.textContent = error.message; } });
}

document.addEventListener('click', async function (event) {
  const tab = event.target.closest('[data-ri-tab]');
  if (tab) riDashRender(tab.dataset.riTab);
  const invite = event.target.closest('[data-ri-candidate]');
  if (invite) { try { await riDashPost({ action: 'inviteCandidate', token: riDashboardToken, candidateId: invite.dataset.riCandidate }); alert('Invitation sent successfully.'); } catch (error) { alert(error.message); } }
  const applicationAction = event.target.closest('[data-ri-application]');
  if (applicationAction) {
    const applicationId = applicationAction.dataset.riApplication;
    if (applicationAction.dataset.riAction === 'note') {
      const note = prompt('Private employer note:');
      if (note !== null) { try { await riDashPost({ action: 'addPrivateEmployerNote', token: riDashboardToken, applicationId: applicationId, note: note }); alert('Private note saved.'); } catch (error) { alert(error.message); } }
    }
    if (applicationAction.dataset.riAction === 'move') {
      const nextStatus = prompt('New status: Applied, Under review, Shortlisted, Task sent, Interview invited, Offer sent, Rejected');
      if (nextStatus) { try { await riDashPost({ action: 'updateApplicationStatus', token: riDashboardToken, applicationId: applicationId, newStatus: nextStatus }); await riDashLoad('employer'); } catch (error) { alert(error.message); } }
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  riDashLoad(params.get('role') === 'employer' ? 'employer' : 'candidate');
});

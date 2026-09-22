const dashboardParams = new URLSearchParams(window.location.search);
let dashboardRole = dashboardParams.get('role') === 'employer' ? 'employer' : 'candidate';
let candidateTab = 'overview';
let employerTab = 'overview';
let applicationFilter = 'All';

function sidebarLink(label, tab, active, role) {
  return `<button class="side-link ${active === tab ? 'active' : ''}" data-role="${role}" data-tab="${tab}">${label}</button>`;
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (dashboardRole === 'candidate') {
    sidebar.innerHTML = `<div class="sidebar-profile"><div class="avatar">AS</div><strong>Aarav Sharma</strong><small>Candidate · Demo account</small></div>${sidebarLink('Overview', 'overview', candidateTab, 'candidate')}${sidebarLink('My applications', 'applications', candidateTab, 'candidate')}${sidebarLink('Saved internships', 'saved', candidateTab, 'candidate')}${sidebarLink('My profile', 'profile', candidateTab, 'candidate')}<div class="sidebar-divider"></div><button class="side-link" data-switch-role="employer">Switch to employer workspace</button>`;
  } else {
    sidebar.innerHTML = `<div class="sidebar-profile"><div class="avatar">NE</div><strong>NexaEdge Labs</strong><small>Employer · Demo account</small></div>${sidebarLink('Overview', 'overview', employerTab, 'employer')}${sidebarLink('Post internship', 'post', employerTab, 'employer')}${sidebarLink('Applicant pipeline', 'pipeline', employerTab, 'employer')}${sidebarLink('Find candidates', 'candidates', employerTab, 'employer')}${sidebarLink('Company profile', 'company', employerTab, 'employer')}<div class="sidebar-divider"></div><button class="side-link" data-switch-role="candidate">Switch to candidate workspace</button>`;
  }
}

function statCard(label, value, hint) { return `<article class="stat-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong><span>${escapeHtml(hint)}</span></article>`; }
function candidateAvatar(name) { return `<span class="avatar row-avatar">${escapeHtml(name.split(' ').map(x => x[0]).join(''))}</span>`; }
function checkItem(label, complete) { return `<div class="check-item"><b>${complete ? '✓' : '○'}</b>${escapeHtml(label)}</div>`; }
function empty(title, text) { return `<div class="empty-state"><span>⌕</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div></div>`; }

function applicationRow(app, state) {
  const internship = getInternship(state, app.internshipId) || { title: 'Internship', company: 'Employer', logo: 'RI', color: 'purple' };
  return `<div class="dashboard-row"><span class="company-icon ${escapeHtml(internship.color)} row-icon">${escapeHtml(internship.logo)}</span><div class="row-info"><strong>${escapeHtml(internship.title)}</strong><small>${escapeHtml(internship.company)} · Applied ${dateText(app.appliedAt)}<br>${escapeHtml(app.note)}</small></div><span class="status-chip ${statusClass(app.status)}">${escapeHtml(app.status)}</span></div>`;
}

function candidateOverview(state) {
  const apps = state.applications;
  const taskOrInterview = apps.filter(a => /Task|Interview/.test(a.status)).length;
  const profileFields = [state.candidate.headline, state.candidate.location, state.candidate.skills.length, state.candidate.portfolio, state.candidate.discoverable];
  const complete = Math.round(profileFields.filter(Boolean).length / profileFields.length * 100);
  return `<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>Good afternoon, ${escapeHtml(state.candidate.name.split(' ')[0])}</h1><p>You have ${taskOrInterview || 'no'} task or interview action${taskOrInterview === 1 ? '' : 's'} waiting.</p></div><a class="button button-primary" href="app.html">Find internships</a></div><section class="kpi-grid">${statCard('Applications submitted', apps.length, 'All applications')}${statCard('Under review', apps.filter(a => a.status === 'Under review').length, 'Employer reviewing')}${statCard('Tasks & interviews', taskOrInterview, 'Action waiting')}${statCard('Offers received', apps.filter(a => a.status === 'Offer sent').length, 'Decision required')}</section><section class="dashboard-grid-two"><article class="panel"><div class="panel-heading"><h2>Application tracker</h2><button class="text-button" data-role="candidate" data-tab="applications">View all</button></div>${apps.slice(0, 5).map(app => applicationRow(app, state)).join('') || empty('No applications yet.', 'Find a remote internship and submit your first application.')}</article><article class="panel"><div class="panel-heading"><h2>Profile completion</h2><strong>${complete}%</strong></div><div class="progress"><b style="width:${complete}%"></b></div>${checkItem('Professional headline', !!state.candidate.headline)}${checkItem('Location and availability', !!state.candidate.location && !!state.candidate.availableFrom)}${checkItem('Skills added', state.candidate.skills.length > 0)}${checkItem('Portfolio link', !!state.candidate.portfolio)}${checkItem('Open to internship opportunities', !!state.candidate.discoverable)}</article></section><section class="panel dashboard-bottom-panel"><div class="panel-heading"><h2>Recommended internships</h2><a class="text-button" href="app.html">Explore all</a></div><div class="job-grid compact-grid">${getAllInternships(state).slice(0, 3).map(i => internshipCard(i, state)).join('')}</div></section>`;
}

function candidateApplications(state) {
  const statuses = ['All', 'Applied', 'Under review', 'Shortlisted', 'Task sent', 'Interview invited', 'Offer sent', 'Rejected', 'Withdrawn'];
  const rows = state.applications.filter(a => applicationFilter === 'All' || a.status === applicationFilter);
  return `<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>My applications</h1><p>Employer-private notes are never visible here.</p></div></div><section class="panel"><div class="filter-row">${statuses.map(status => `<button class="filter ${applicationFilter === status ? 'active' : ''}" data-application-filter="${status}">${status}</button>`).join('')}</div>${rows.length ? rows.map(app => applicationRow(app, state)).join('') : empty('No applications in this status.', 'Try another status filter or explore internships.')}</section>`;
}

function candidateSaved(state) {
  const saved = getAllInternships(state).filter(i => state.savedInternshipIds.includes(i.id));
  return `<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>Saved internships</h1><p>Keep opportunities here until you are ready to apply.</p></div><a class="button button-secondary" href="app.html">Find more internships</a></div><section class="job-grid">${saved.length ? saved.map(i => internshipCard(i, state)).join('') : empty('No saved internships.', 'Use the star button on an internship card to save one.')}</section>`;
}

function candidateProfile(state) {
  const c = state.candidate;
  return `<div class="dash-heading"><div><p class="eyebrow">Candidate workspace</p><h1>My profile</h1><p>Your contact details stay private. Employers see your profile only when you opt in.</p></div></div><section class="panel"><form id="candidateProfileForm"><div class="form-grid"><div class="field"><label>Headline</label><input name="headline" value="${escapeHtml(c.headline)}" required /></div><div class="field"><label>City / state</label><input name="location" value="${escapeHtml(c.location)}" required /></div><div class="field full"><label>Skills, separated by commas</label><input name="skills" value="${escapeHtml(c.skills.join(', '))}" required /></div><div class="field"><label>Available from</label><input type="date" name="availableFrom" value="${escapeHtml(c.availableFrom)}" required /></div><div class="field"><label>Weekly availability</label><select name="hours"><option ${c.hours === '10 hours' ? 'selected' : ''}>10 hours</option><option ${c.hours === '20 hours' ? 'selected' : ''}>20 hours</option><option ${c.hours === '30 hours' ? 'selected' : ''}>30 hours</option><option ${c.hours === '40 hours' ? 'selected' : ''}>40 hours</option></select></div><div class="field full"><label>Portfolio URL</label><input type="url" name="portfolio" value="${escapeHtml(c.portfolio)}" /></div><label class="consent field full"><input type="checkbox" name="discoverable" ${c.discoverable ? 'checked' : ''} /> I am open to internship opportunities and allow verified employers to see my profile summary.</label></div><p id="candidateProfileMessage" class="form-status"></p><button class="button button-primary" type="submit">Save candidate profile</button></form></section>`;
}

function employerOverview(state) {
  const active = state.employerInternships.filter(i => i.status === 'Active').length;
  const applicants = state.employerApplications.length;
  const shortlisted = state.employerApplications.filter(a => ['Shortlisted', 'Task sent', 'Interview invited', 'Offer sent'].includes(a.status)).length;
  const offers = state.employerApplications.filter(a => a.status === 'Offer sent').length;
  return `<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Manage your remote internships</h1><p>Review candidates, post internship requirements and track the selection pipeline.</p></div><button class="button button-primary" data-role="employer" data-tab="post">Post remote internship</button></div><section class="kpi-grid">${statCard('Active internships', active, 'Live and discoverable')}${statCard('Total applicants', applicants, 'Across active posts')}${statCard('Shortlisted', shortlisted, 'In progress')}${statCard('Offers sent', offers, 'Awaiting response')}</section><section class="dashboard-grid-two"><article class="panel"><div class="panel-heading"><h2>Recent applicants</h2><button class="text-button" data-role="employer" data-tab="pipeline">Open pipeline</button></div>${state.employerApplications.slice(0, 5).map(app => `<div class="dashboard-row">${candidateAvatar(app.name)}<div class="row-info"><strong>${escapeHtml(app.name)}</strong><small>${escapeHtml(app.headline)}</small></div><span class="status-chip ${statusClass(app.status)}">${escapeHtml(app.status)}</span></div>`).join('')}</article><article class="panel"><div class="panel-heading"><h2>Action center</h2><span class="status-chip status-under-review">2 actions</span></div>${checkItem('Company verification approved', true)}${checkItem('Review new applicants', false)}${checkItem('Send task instructions', false)}${checkItem('Internship closes in 9 days', false)}</article></section>`;
}

function employerPost() {
  return `<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Post remote internship</h1><p>Internships are reviewed before publication. Fees, deposits and unsafe requests are prohibited.</p></div></div><section class="panel"><form id="dashboardInternshipForm"><div class="form-grid"><div class="field"><label>Internship title *</label><input name="title" required /></div><div class="field"><label>Category *</label><select name="category" required><option value="">Select category</option><option>Web Development</option><option>Video Editing</option><option>Digital Marketing</option><option>Content Writing</option><option>UI/UX Design</option><option>Data Analysis</option><option>HR & Recruitment</option><option>Product Operations</option></select></div><div class="field"><label>Duration *</label><select name="duration" required><option value="">Select duration</option><option value="2">2 months</option><option value="3">3 months</option><option value="4">4 months</option><option value="6">6 months</option></select></div><div class="field"><label>Application deadline *</label><input type="date" name="deadline" required /></div><div class="field"><label>Stipend type *</label><select name="stipendType" required><option value="">Select type</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Negotiable">Negotiable</option></select></div><div class="field"><label>Monthly stipend INR</label><input type="number" name="stipend" min="0" /></div><div class="field"><label>Openings *</label><input type="number" name="openings" min="1" value="1" required /></div><div class="field"><label>Hours per week *</label><select name="hours" required><option>10</option><option selected>20</option><option>30</option><option>40</option></select></div><div class="field full"><label>Required skills *</label><input name="skills" placeholder="HTML, CSS, JavaScript" required /></div><div class="field full"><label>Summary, responsibilities and learning outcomes *</label><textarea name="summary" required></textarea></div><div class="field"><label>Certificate offered</label><select name="certificate"><option>Yes</option><option>No</option></select></div><div class="field"><label>PPO possibility</label><select name="ppo"><option>No</option><option>Yes</option></select></div><label class="consent field full"><input type="checkbox" name="remoteOnly" checked required /> This is a remote work-from-home internship only.</label><label class="consent field full"><input type="checkbox" name="safetyDeclaration" required /> I will not ask candidates for fees, deposits, paid training, OTPs or banking information.</label></div><p class="form-status" id="dashboardInternshipMessage"></p><button class="button button-secondary" type="button" id="dashboardSaveDraft">Save draft</button> <button class="button button-primary" type="submit">Submit for review</button></form></section>`;
}

function employerPipeline(state) {
  const stages = ['Applied', 'Under review', 'Shortlisted', 'Task sent', 'Interview invited', 'Offer sent'];
  return `<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Applicant pipeline</h1><p>Private notes are employer-only. Candidate-visible updates should be sent through the backend messaging system in production.</p></div></div><section class="pipeline-board">${stages.map(stage => `<article class="pipeline-column"><h3>${escapeHtml(stage)} <small>(${state.employerApplications.filter(a => a.status === stage).length})</small></h3>${state.employerApplications.filter(a => a.status === stage).map(app => `<div class="candidate-card"><strong>${escapeHtml(app.name)}</strong><p>${escapeHtml(app.headline)}</p><div class="tags">${app.skills.slice(0, 2).map(s => `<span>${escapeHtml(s)}</span>`).join('')}</div><div class="candidate-actions"><button class="text-button" data-move-candidate="${escapeHtml(app.id)}">Move →</button><button class="text-button" data-private-note="${escapeHtml(app.id)}">Private note</button></div></div>`).join('') || '<p class="pipeline-empty">No candidates</p>'}</article>`).join('')}</section>`;
}

function employerCandidates() {
  const candidates = (window.DEMO_PROFILES || []).slice(0, 100);
  return `<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Find candidates</h1><p>Only discoverable profiles are shown. Contact details remain protected unless a candidate applies or consents.</p></div></div><section class="panel"><div class="form-grid"><div class="field"><label>Search skill or category</label><input id="candidateSearchInput" placeholder="JavaScript, video editing, UI/UX" /></div><div class="field"><label>Availability</label><select id="candidateAvailabilityFilter"><option value="All">Any availability</option><option value="Immediate">Available immediately</option><option value="October">Available in October</option></select></div></div></section><section class="job-grid directory-grid" id="candidateDirectoryGrid">${candidateCards(candidates)}</section>`;
}

function candidateCards(candidates) {
  return candidates.map(candidate => `<article class="job-card candidate-directory-card"><span class="sample-label">DEMO PROFILE</span><div class="job-card-head">${candidateAvatar(candidate.display_name)}<span class="status-chip status-shortlisted">Open to internships</span></div><h3>${escapeHtml(candidate.display_name)}</h3><p class="company-name">${escapeHtml(candidate.city)} · ${escapeHtml(candidate.category)}</p><div class="tags">${candidate.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div><p class="salary">Available: ${escapeHtml(candidate.availability)} · Profile ${escapeHtml(candidate.profile_completion)}%</p><div class="job-card-foot"><span>Portfolio available</span><button class="text-button" data-invite-candidate="${escapeHtml(candidate.id)}">Invite to apply →</button></div></article>`).join('');
}

function employerCompany(state) {
  const e = state.employer;
  return `<div class="dash-heading"><div><p class="eyebrow">Employer workspace</p><h1>Company profile</h1><p>Your public company details appear on approved internship listings.</p></div></div><section class="panel"><form id="companyProfileForm"><div class="form-grid"><div class="field"><label>Company name</label><input name="companyName" value="${escapeHtml(e.companyName)}" required /></div><div class="field"><label>Industry</label><input name="industry" value="${escapeHtml(e.industry)}" required /></div><div class="field"><label>Company website</label><input name="website" type="url" value="${escapeHtml(e.website)}" /></div><div class="field"><label>Company size</label><select name="size"><option ${e.size === '1–10' ? 'selected' : ''}>1–10</option><option ${e.size === '11–50' ? 'selected' : ''}>11–50</option><option ${e.size === '51–200' ? 'selected' : ''}>51–200</option><option ${e.size === '201+' ? 'selected' : ''}>201+</option></select></div><div class="field full"><label>About company</label><textarea name="about">${escapeHtml(e.about)}</textarea></div></div><div class="report-box">Verification status: <strong>${escapeHtml(e.verificationStatus)}</strong>. In production, this status must be controlled by an admin-only backend action.</div><p class="form-status" id="companyProfileMessage"></p><button class="button button-primary" type="submit">Save company profile</button></form></section>`;
}

function renderDashboard() {
  const state = getState();
  renderSidebar();
  const root = document.getElementById('dashboard');
  if (dashboardRole === 'candidate') {
    const screens = { overview: candidateOverview, applications: candidateApplications, saved: candidateSaved, profile: candidateProfile };
    root.innerHTML = screens[candidateTab](state);
  } else {
    const screens = { overview: employerOverview, post: employerPost, pipeline: employerPipeline, candidates: employerCandidates, company: employerCompany };
    root.innerHTML = screens[employerTab](state);
  }
  attachDashboardForms();
}

function attachDashboardForms() {
  const profile = document.getElementById('candidateProfileForm');
  if (profile) profile.addEventListener('submit', event => {
    event.preventDefault();
    const state = getState();
    const data = new FormData(profile);
    state.candidate = { ...state.candidate, headline: data.get('headline').trim(), location: data.get('location').trim(), skills: data.get('skills').split(',').map(x => x.trim()).filter(Boolean), availableFrom: data.get('availableFrom'), hours: data.get('hours'), portfolio: data.get('portfolio').trim(), discoverable: data.get('discoverable') === 'on' };
    saveState(state);
    document.getElementById('candidateProfileMessage').className = 'form-status success';
    document.getElementById('candidateProfileMessage').textContent = 'Profile saved locally. Connect to your authenticated backend before production.';
  });

  const post = document.getElementById('dashboardInternshipForm');
  if (post) post.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(post);
    const message = document.getElementById('dashboardInternshipMessage');
    if (new Date(`${data.get('deadline')}T23:59:59`) <= new Date()) { message.className = 'form-status error'; message.textContent = 'Application deadline must be in the future.'; return; }
    if (data.get('stipendType') === 'Paid' && Number(data.get('stipend') || 0) <= 0) { message.className = 'form-status error'; message.textContent = 'Enter a valid monthly stipend for paid internship.'; return; }
    const state = getState();
    state.employerInternships.unshift({ id: `employer-i-${Date.now()}`, title: data.get('title').trim(), company: state.employer.companyName, category: data.get('category'), duration: Number(data.get('duration')), stipendType: data.get('stipendType'), stipend: data.get('stipendType') === 'Paid' ? `₹${Number(data.get('stipend')).toLocaleString('en-IN')} / month` : data.get('stipendType'), skills: data.get('skills').split(',').map(x => x.trim()).filter(Boolean), certificate: data.get('certificate') === 'Yes', ppo: data.get('ppo') === 'Yes', deadline: data.get('deadline'), description: data.get('summary').trim(), logo: state.employer.companyName.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase(), color: 'purple', status: 'Pending review', applicants: 0, views: 0, saves: 0, isDemo: false });
    saveState(state);
    message.className = 'form-status success';
    message.textContent = 'Internship submitted for review. It is private until approved.';
    post.reset();
    showToast('Internship submitted for review.');
  });

  const draft = document.getElementById('dashboardSaveDraft');
  if (draft) draft.addEventListener('click', () => { document.getElementById('dashboardInternshipMessage').className = 'form-status success'; document.getElementById('dashboardInternshipMessage').textContent = 'Draft saved locally in this browser.'; });

  const company = document.getElementById('companyProfileForm');
  if (company) company.addEventListener('submit', event => {
    event.preventDefault();
    const state = getState();
    const data = new FormData(company);
    state.employer = { ...state.employer, companyName: data.get('companyName').trim(), industry: data.get('industry').trim(), website: data.get('website').trim(), size: data.get('size'), about: data.get('about').trim() };
    saveState(state);
    document.getElementById('companyProfileMessage').className = 'form-status success';
    document.getElementById('companyProfileMessage').textContent = 'Company profile saved locally.';
  });

  const search = document.getElementById('candidateSearchInput');
  if (search) search.addEventListener('input', filterCandidateDirectory);
  const availability = document.getElementById('candidateAvailabilityFilter');
  if (availability) availability.addEventListener('change', filterCandidateDirectory);
}

function filterCandidateDirectory() {
  const query = String(document.getElementById('candidateSearchInput').value || '').toLowerCase();
  const availability = document.getElementById('candidateAvailabilityFilter').value;
  const rows = (window.DEMO_PROFILES || []).filter(candidate => {
    const source = [candidate.display_name, candidate.category, ...candidate.skills].join(' ').toLowerCase();
    return (!query || source.includes(query)) && (availability === 'All' || candidate.availability === availability);
  });
  document.getElementById('candidateDirectoryGrid').innerHTML = rows.length ? candidateCards(rows) : empty('No candidates found.', 'Try a different skill or availability filter.');
}

function moveCandidate(applicationId) {
  const stages = ['Applied', 'Under review', 'Shortlisted', 'Task sent', 'Interview invited', 'Offer sent'];
  const state = getState();
  const candidate = state.employerApplications.find(a => a.id === applicationId);
  if (!candidate) return;
  const index = stages.indexOf(candidate.status);
  candidate.status = stages[Math.min(index + 1, stages.length - 1)];
  saveState(state);
  renderDashboard();
  showToast(`${candidate.name} moved to ${candidate.status}.`);
}

document.addEventListener('click', event => {
  const roleTab = event.target.closest('[data-role][data-tab]');
  if (roleTab) { dashboardRole = roleTab.dataset.role; if (dashboardRole === 'candidate') candidateTab = roleTab.dataset.tab; else employerTab = roleTab.dataset.tab; renderDashboard(); }
  const switchRole = event.target.closest('[data-switch-role]');
  if (switchRole) { dashboardRole = switchRole.dataset.switchRole; renderDashboard(); }
  const filter = event.target.closest('[data-application-filter]');
  if (filter) { applicationFilter = filter.dataset.applicationFilter; renderDashboard(); }
  const move = event.target.closest('[data-move-candidate]');
  if (move) moveCandidate(move.dataset.moveCandidate);
  const note = event.target.closest('[data-private-note]');
  if (note) { const state = getState(); const app = state.employerApplications.find(a => a.id === note.dataset.privateNote); const value = window.prompt(`Private note for ${app.name}:`, app.privateNote || ''); if (value !== null) { app.privateNote = value; saveState(state); showToast('Private employer note saved.'); } }
  const invite = event.target.closest('[data-invite-candidate]');
  if (invite) { const candidate = (window.DEMO_PROFILES || []).find(c => c.id === invite.dataset.inviteCandidate); if (candidate) showToast(`Invitation sent to ${candidate.display_name} in this demo.`); }
});

document.getElementById('resetDemoButton').addEventListener('click', () => { if (confirm('Reset all demo changes stored in this browser?')) resetDemoState(); });
document.addEventListener('DOMContentLoaded', renderDashboard);

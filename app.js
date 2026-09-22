const APP_CONFIG = {
  DEMO_MODE: true,
  STORAGE_KEY: 'remoteintern_state_v1'
};

const DEFAULT_STATE = {
  candidate: {
    id: 'candidate-demo-001',
    name: 'Aarav Sharma',
    email: 'candidate-demo@example.invalid',
    headline: 'Frontend learner and video editor',
    location: 'Faridabad, Haryana',
    skills: ['HTML', 'CSS', 'JavaScript', 'Video Editing'],
    availableFrom: '2026-10-01',
    hours: '20 hours',
    portfolio: 'https://example.com/demo-portfolio/aarav',
    discoverable: true
  },
  savedInternshipIds: ['i2'],
  applications: [
    { id: 'app-001', internshipId: 'i1', status: 'Under review', appliedAt: '2026-09-20', note: 'Your profile is being reviewed by the employer.' },
    { id: 'app-002', internshipId: 'i2', status: 'Task sent', appliedAt: '2026-09-17', note: 'Submit a 30-second sample edit before 26 Sep 2026.' },
    { id: 'app-003', internshipId: 'i3', status: 'Interview invited', appliedAt: '2026-09-14', note: 'Confirm your online interview slot.' }
  ],
  internships: [
    { id: 'i1', title: 'Frontend Development Intern', company: 'NexaEdge Labs', category: 'Web Development', duration: 3, stipendType: 'Paid', stipend: '₹6,000–₹9,000 / month', skills: ['HTML', 'CSS', 'JavaScript'], certificate: true, ppo: true, deadline: '2026-10-12', description: 'Build responsive interface components, test layouts and learn practical frontend workflows with a remote product team.', logo: 'NE', color: 'purple', status: 'Active', isDemo: true },
    { id: 'i2', title: 'Video Editing Intern', company: 'StudioTrail', category: 'Video Editing', duration: 2, stipendType: 'Paid', stipend: '₹5,000 / month', skills: ['Premiere Pro', 'Reels', 'Storytelling'], certificate: true, ppo: false, deadline: '2026-10-06', description: 'Edit short-form video, music visuals and social content while building a professional remote editing portfolio.', logo: 'ST', color: 'orange', status: 'Active', isDemo: true },
    { id: 'i3', title: 'Digital Marketing Intern', company: 'GrowthMint', category: 'Digital Marketing', duration: 3, stipendType: 'Paid', stipend: '₹4,000–₹7,000 / month', skills: ['SEO', 'Canva', 'Analytics'], certificate: true, ppo: true, deadline: '2026-10-15', description: 'Support SEO, content planning, social reporting and campaign analysis under a remote marketing mentor.', logo: 'GM', color: 'green', status: 'Active', isDemo: true },
    { id: 'i4', title: 'UI/UX Design Intern', company: 'PixelPeak Studio', category: 'UI/UX Design', duration: 4, stipendType: 'Paid', stipend: '₹7,000 / month', skills: ['Figma', 'Wireframes', 'Design Systems'], certificate: true, ppo: false, deadline: '2026-10-19', description: 'Create interface concepts, wireframes and prototypes for digital products.', logo: 'PP', color: 'purple', status: 'Active', isDemo: true },
    { id: 'i5', title: 'Content Writing Intern', company: 'WordHarbor', category: 'Content Writing', duration: 2, stipendType: 'Unpaid', stipend: 'Certificate + mentorship', skills: ['Writing', 'Research', 'SEO'], certificate: true, ppo: false, deadline: '2026-10-09', description: 'Research and write useful web content while learning editorial and SEO fundamentals.', logo: 'WH', color: 'orange', status: 'Active', isDemo: true },
    { id: 'i6', title: 'Data Analysis Intern', company: 'MetricSpring', category: 'Data Analysis', duration: 3, stipendType: 'Paid', stipend: '₹6,000 / month', skills: ['Excel', 'SQL', 'Data Cleaning'], certificate: true, ppo: true, deadline: '2026-10-22', description: 'Work with business datasets, create clean reports and support analytics projects.', logo: 'MS', color: 'green', status: 'Active', isDemo: true }
  ],
  employer: {
    id: 'employer-demo-001', companyName: 'NexaEdge Labs', industry: 'Software & Technology', website: 'https://example.com/nexaedge', size: '11–50', about: 'NexaEdge Labs builds practical tools for growing teams and works with remote interns on product initiatives.', verificationStatus: 'Approved demo account'
  },
  employerInternships: [{ id: 'employer-i1', title: 'Frontend Development Intern', company: 'NexaEdge Labs', category: 'Web Development', duration: 3, stipendType: 'Paid', stipend: '₹6,000 / month', skills: ['HTML', 'CSS', 'JavaScript'], certificate: true, ppo: true, deadline: '2026-10-12', description: 'Support frontend interface development and responsive testing.', logo: 'NE', color: 'purple', status: 'Active', applicants: 12, views: 186, saves: 34, isDemo: true }],
  employerApplications: [
    { id: 'ea1', name: 'Priya N.', headline: 'UI developer and Figma learner', skills: ['HTML', 'CSS', 'Figma'], availability: 'Immediate', status: 'Applied', privateNote: '' },
    { id: 'ea2', name: 'Rohan K.', headline: 'Frontend learner with React projects', skills: ['JavaScript', 'React', 'Git'], availability: 'October', status: 'Under review', privateNote: '' },
    { id: 'ea3', name: 'Meera S.', headline: 'Student developer and UI builder', skills: ['HTML', 'CSS', 'JavaScript'], availability: 'Immediate', status: 'Shortlisted', privateNote: '' },
    { id: 'ea4', name: 'Kabir R.', headline: 'Portfolio-focused frontend candidate', skills: ['React', 'CSS', 'APIs'], availability: 'October', status: 'Task sent', privateNote: '' },
    { id: 'ea5', name: 'Zoya A.', headline: 'Web developer with project experience', skills: ['JavaScript', 'Figma', 'Git'], availability: 'Immediate', status: 'Interview invited', privateNote: '' },
    { id: 'ea6', name: 'Nikhil P.', headline: 'Remote-ready frontend intern', skills: ['HTML', 'CSS', 'JavaScript'], availability: 'October', status: 'Offer sent', privateNote: '' }
  ]
};

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function getState() {
  try {
    const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
    return saved ? JSON.parse(saved) : clone(DEFAULT_STATE);
  } catch (error) {
    return clone(DEFAULT_STATE);
  }
}
function saveState(state) { localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(state)); }
function resetDemoState() { localStorage.removeItem(APP_CONFIG.STORAGE_KEY); window.location.reload(); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function statusClass(status) { return 'status-' + String(status || '').toLowerCase().replace(/\s+/g, '-'); }
function dateText(value) { const date = new Date(value + 'T00:00:00'); return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function showToast(message) { const toast = document.getElementById('toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }
function getAllInternships(state) { return [...state.internships.filter(i => i.status === 'Active'), ...state.employerInternships.filter(i => i.status === 'Active')]; }
function getInternship(state, id) { return [...state.internships, ...state.employerInternships].find(i => i.id === id); }

function internshipCard(internship, state) {
  const saved = state.savedInternshipIds.includes(internship.id);
  return `<article class="job-card">${internship.isDemo ? '<span class="sample-label">DEMO LISTING</span>' : ''}<div class="job-card-head"><span class="company-icon ${escapeHtml(internship.color || 'purple')}">${escapeHtml(internship.logo || 'RI')}</span><button class="icon-button save-internship" data-id="${escapeHtml(internship.id)}" aria-label="Save internship">${saved ? '★' : '☆'}</button></div><h3>${escapeHtml(internship.title)}</h3><p class="company-name">${escapeHtml(internship.company)} · Verified employer</p><div class="tags"><span>Remote</span><span>${escapeHtml(internship.category)}</span><span>${escapeHtml(internship.duration)} months</span></div><p class="salary">${escapeHtml(internship.stipend)}</p><div class="job-card-foot"><span>Apply by ${dateText(internship.deadline)}</span><button class="text-button view-internship" data-id="${escapeHtml(internship.id)}">View & apply →</button></div></article>`;
}

function setupPublicInternships() {
  const state = getState();
  const featured = document.getElementById('featuredInternships');
  if (featured) featured.innerHTML = getAllInternships(state).slice(0, 3).map(i => internshipCard(i, state)).join('');

  const grid = document.getElementById('internshipGrid');
  if (!grid) return;
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = ['All', ...new Set(getAllInternships(state).map(i => i.category))];
  categoryFilter.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${c === 'All' ? 'All categories' : escapeHtml(c)}</option>`).join('');

  function renderDirectory() {
    const fresh = getState();
    const query = String(document.getElementById('searchInput').value || '').toLowerCase().trim();
    const category = categoryFilter.value;
    const stipend = document.getElementById('stipendFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const rows = getAllInternships(fresh).filter(i => {
      const source = [i.title, i.company, i.category, ...(i.skills || [])].join(' ').toLowerCase();
      return (!query || source.includes(query)) && (category === 'All' || i.category === category) && (stipend === 'All' || i.stipendType === stipend) && (duration === 'All' || String(i.duration) === duration);
    });
    document.getElementById('internshipCount').textContent = `${rows.length} internship${rows.length === 1 ? '' : 's'} found`;
    grid.innerHTML = rows.length ? rows.map(i => internshipCard(i, fresh)).join('') : '<div class="empty-state directory-empty"><span>⌕</span><div><strong>No internships found</strong><p>Try a different skill, category, stipend, or duration.</p></div></div>';
  }
  ['searchInput', 'categoryFilter', 'stipendFilter', 'durationFilter'].forEach(id => document.getElementById(id).addEventListener(id === 'searchInput' ? 'input' : 'change', renderDirectory));
  renderDirectory();
}

function setupInternshipActions() {
  document.addEventListener('click', event => {
    const save = event.target.closest('.save-internship');
    const detail = event.target.closest('.view-internship');
    if (save) {
      const state = getState(); const id = save.dataset.id;
      state.savedInternshipIds = state.savedInternshipIds.includes(id) ? state.savedInternshipIds.filter(x => x !== id) : [...state.savedInternshipIds, id];
      saveState(state); setupPublicInternships(); showToast(state.savedInternshipIds.includes(id) ? 'Internship saved.' : 'Internship removed from saved list.');
    }
    if (detail) openInternshipModal(detail.dataset.id);
  });
}

function openInternshipModal(id) {
  const state = getState(); const internship = getInternship(state, id); const modal = document.getElementById('internshipModal');
  if (!internship || !modal) return;
  document.getElementById('modalTitle').textContent = internship.title;
  document.getElementById('modalCompany').textContent = `${internship.company} · Remote internship · ${internship.duration} months`;
  document.getElementById('modalDetails').innerHTML = `<div class="tags modal-tags"><span>Remote only</span><span>${escapeHtml(internship.category)}</span><span>${escapeHtml(internship.stipend)}</span>${internship.certificate ? '<span>Certificate</span>' : ''}${internship.ppo ? '<span>PPO possible</span>' : ''}</div><p class="detail-copy">${escapeHtml(internship.description)}</p><h3 class="detail-heading">Required skills</h3><div class="tags modal-tags">${(internship.skills || []).map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div><p class="detail-deadline">Application deadline: ${dateText(internship.deadline)}</p>`;
  const button = document.getElementById('applyButton'); button.dataset.id = id;
  document.getElementById('applyMessage').textContent = ''; modal.showModal();
}

function setupModalActions() {
  const modal = document.getElementById('internshipModal');
  if (!modal) return;
  document.addEventListener('click', event => { if (event.target.closest('[data-close-modal]')) modal.close(); });
  document.getElementById('applyButton').addEventListener('click', function () {
    const state = getState(); const internshipId = this.dataset.id;
    const message = document.getElementById('applyMessage');
    if (state.applications.some(a => a.internshipId === internshipId)) { message.textContent = 'You already applied to this internship. Track it in your candidate dashboard.'; message.className = 'form-status error'; return; }
    state.applications.unshift({ id: `app-${Date.now()}`, internshipId, status: 'Applied', appliedAt: new Date().toISOString().slice(0, 10), note: 'Your application was submitted successfully.' });
    saveState(state); message.textContent = 'Application submitted. Opening your candidate dashboard…'; message.className = 'form-status success'; setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
  });
}

document.addEventListener('DOMContentLoaded', () => { setupPublicInternships(); setupInternshipActions(); setupModalActions(); });

function cleanPhone(value) { return String(value || '').replace(/\D/g, '').slice(-10); }
function validPhone(phone) { return /^[6-9]\d{9}$/.test(phone); }
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')); }

function employerMessage(text, type) {
  const target = document.getElementById('employerMessage');
  target.className = `form-status ${type || ''}`;
  target.textContent = text;
}

function formToInternship(form) {
  const data = new FormData(form);
  const stipendType = String(data.get('stipendType') || '');
  const stipendValue = Number(data.get('stipend') || 0);
  return {
    id: `employer-i-${Date.now()}`,
    title: String(data.get('title') || '').trim(),
    company: String(data.get('companyName') || '').trim(),
    category: String(data.get('category') || '').trim(),
    duration: Number(data.get('duration') || 0),
    stipendType,
    stipend: stipendType === 'Paid' ? `₹${stipendValue.toLocaleString('en-IN')} / month` : stipendType,
    skills: String(data.get('skills') || '').split(',').map(s => s.trim()).filter(Boolean),
    certificate: data.get('certificate') === 'Yes',
    ppo: data.get('ppo') === 'Yes',
    deadline: String(data.get('deadline') || ''),
    description: String(data.get('summary') || '').trim(),
    logo: String(data.get('companyName') || 'RI').split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase(),
    color: 'purple',
    status: 'Pending review',
    applicants: 0,
    views: 0,
    saves: 0,
    isDemo: false
  };
}

function validateEmployerForm(form) {
  const data = new FormData(form);
  const required = ['contactName', 'businessEmail', 'employerPhone', 'companyName', 'industry', 'companySize', 'title', 'category', 'duration', 'deadline', 'openings', 'hours', 'stipendType', 'skills', 'summary'];
  for (const field of required) if (!String(data.get(field) || '').trim()) return 'Complete all required fields.';
  const phone = cleanPhone(data.get('employerPhone'));
  if (!validPhone(phone)) return 'Enter a valid 10-digit Indian mobile number.';
  if (!validEmail(data.get('businessEmail'))) return 'Enter a valid work email address.';
  if (new Date(`${data.get('deadline')}T23:59:59`) <= new Date()) return 'Application deadline must be in the future.';
  if (data.get('stipendType') === 'Paid' && Number(data.get('stipend') || 0) <= 0) return 'Enter a valid stipend for a paid internship.';
  if (data.get('remoteOnly') !== 'on') return 'This platform accepts remote work-from-home internships only.';
  if (data.get('safetyDeclaration') !== 'on') return 'Accept the candidate safety declaration before submitting.';
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employerForm');
  if (!form) return;

  document.getElementById('saveDraftButton').addEventListener('click', () => {
    const state = getState();
    const internship = formToInternship(form);
    internship.status = 'Draft';
    state.employerDraft = internship;
    state.employer = {
      ...state.employer,
      companyName: String(new FormData(form).get('companyName') || state.employer.companyName).trim(),
      industry: String(new FormData(form).get('industry') || state.employer.industry).trim(),
      website: String(new FormData(form).get('companyWebsite') || state.employer.website).trim(),
      size: String(new FormData(form).get('companySize') || state.employer.size).trim()
    };
    saveState(state);
    employerMessage('Draft saved in this browser. Submit it when all fields are complete.', 'success');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const error = validateEmployerForm(form);
    if (error) { employerMessage(error, 'error'); return; }
    const state = getState();
    const internship = formToInternship(form);
    const data = new FormData(form);
    state.employer = {
      ...state.employer,
      companyName: String(data.get('companyName')).trim(),
      industry: String(data.get('industry')).trim(),
      website: String(data.get('companyWebsite') || '').trim(),
      size: String(data.get('companySize')).trim(),
      verificationStatus: 'Pending verification'
    };
    state.employerInternships.unshift(internship);
    delete state.employerDraft;
    saveState(state);
    employerMessage('Internship submitted for employer/admin review. It will remain private until approved.', 'success');
    form.reset();
    showToast('Remote internship submitted for review.');
  });
});

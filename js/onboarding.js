document.addEventListener('DOMContentLoaded', async () => {
  if (!window.jobDb) return;
  const loading = document.getElementById('loadingState');
  const form = document.getElementById('onboardingForm');
  const name = document.getElementById('fullName');
  const message = document.getElementById('onboardingMessage');
  const button = document.getElementById('continueButton');
  const setMessage = (text, type = '') => { message.textContent = text; message.className = `form-message ${type}`; };
  const user = await window.JobAuth.requireUser();
  if (!user) return;
  const { data: profile, error } = await window.jobDb.from('job_user_profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) { loading.textContent = error.message; return; }
  if (!profile) { loading.textContent = 'Your account is still being prepared. Please refresh in a few seconds.'; return; }
  if (profile.onboarding_complete) { await window.JobAuth.goToWorkspace(); return; }
  name.value = profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '';
  loading.hidden = true; form.hidden = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const role = new FormData(form).get('role');
    button.disabled = true; button.textContent = 'Saving…'; setMessage('');
    const { error: updateError } = await window.jobDb.from('job_user_profiles').update({ full_name: name.value.trim(), role, onboarding_complete: true }).eq('id', user.id);
    if (updateError) { setMessage(updateError.message, 'error'); button.disabled = false; button.textContent = 'Continue'; return; }
    window.location.href = role === 'employer' ? 'employer.html' : 'dashboard.html';
  });
});

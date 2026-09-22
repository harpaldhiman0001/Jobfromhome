document.addEventListener('DOMContentLoaded', async () => {
  if (!window.jobDb) return;
  const form = document.getElementById('magicLinkForm');
  const email = document.getElementById('email');
  const message = document.getElementById('loginMessage');
  const submit = document.getElementById('sendLinkButton');
  const google = document.getElementById('googleButton');
  const setMessage = (text, type = '') => { message.textContent = text; message.className = `form-message ${type}`; };

  const { data: { session } } = await window.jobDb.auth.getSession();
  if (session) { await window.JobAuth.goToWorkspace(); return; }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = email.value.trim().toLowerCase();
    submit.disabled = true; submit.textContent = 'Sending…'; setMessage('Sending your secure sign-in link…');
    const { error } = await window.jobDb.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: `${window.location.origin}/onboarding.html` }
    });
    if (error) setMessage(error.message, 'error');
    else { setMessage('Check your email and open the secure sign-in link.', 'success'); form.reset(); }
    submit.disabled = false; submit.textContent = 'Email me a sign-in link';
  });

  google.addEventListener('click', async () => {
    google.disabled = true; setMessage('Opening Google sign in…');
    const { error } = await window.jobDb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding.html` }
    });
    if (error) { setMessage(error.message, 'error'); google.disabled = false; }
  });
});

window.JobAuth = (() => {
  async function currentUser() {
    if (!window.jobDb) return null;
    const { data: { user } } = await window.jobDb.auth.getUser();
    return user || null;
  }
  async function currentProfile() {
    const user = await currentUser();
    if (!user) return null;
    const { data, error } = await window.jobDb.from('job_user_profiles').select('*').eq('id', user.id).maybeSingle();
    if (error) throw error;
    return data;
  }
  async function requireUser() {
    const user = await currentUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    return user;
  }
  async function signOut() {
    if (window.jobDb) await window.jobDb.auth.signOut();
    window.location.href = 'index.html';
  }
  async function goToWorkspace() {
    const profile = await currentProfile();
    if (!profile || !profile.onboarding_complete) { window.location.href = 'onboarding.html'; return; }
    window.location.href = profile.role === 'employer' ? 'employer.html' : 'dashboard.html';
  }
  return { currentUser, currentProfile, requireUser, signOut, goToWorkspace };
})();

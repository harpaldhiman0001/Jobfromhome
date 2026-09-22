document.addEventListener('DOMContentLoaded', async () => {
  if (!window.jobDb || !window.JobAuth) return;

  const loading = document.getElementById('loadingState');
  const form = document.getElementById('onboardingForm');
  const name = document.getElementById('fullName');
  const message = document.getElementById('onboardingMessage');
  const button = document.getElementById('continueButton');

  const setMessage = (text, type = '') => {
    if (!message) return;
    message.textContent = text;
    message.className = `form-message ${type}`;
  };

  const showLoadingError = (text) => {
    if (loading) {
      loading.hidden = false;
      loading.textContent = text;
    }
    if (form) form.hidden = true;
  };

  const user = await window.JobAuth.requireUser();
  if (!user) return;

  let profile;
  const { data, error } = await window.jobDb
    .from('job_user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Could not load onboarding profile:', error);
    showLoadingError(`Unable to prepare your account: ${error.message}`);
    return;
  }

  profile = data;

  if (!profile) {
    const defaultName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      '';

    const { data: createdProfile, error: createError } = await window.jobDb
      .from('job_user_profiles')
      .upsert(
        {
          id: user.id,
          full_name: defaultName,
          onboarding_complete: false
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (createError) {
      console.error('Could not create onboarding profile:', createError);
      showLoadingError(
        `Unable to create your account profile: ${createError.message}`
      );
      return;
    }

    profile = createdProfile;
  }

  if (profile.onboarding_complete && profile.role) {
    await window.JobAuth.goToWorkspace();
    return;
  }

  if (name) {
    name.value =
      profile.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      '';
  }

  if (loading) loading.hidden = true;
  if (form) form.hidden = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = String(name?.value || '').trim();
    const role = String(new FormData(form).get('role') || '').trim();

    if (!fullName) {
      setMessage('Enter your full name to continue.', 'error');
      name?.focus();
      return;
    }

    if (role !== 'candidate' && role !== 'employer') {
      setMessage('Choose whether you want to find work or hire talent.', 'error');
      return;
    }

    const consent = form.querySelector(
      'input[name="consent"], input[name="terms"], input[type="checkbox"]'
    );

    if (consent && !consent.checked) {
      setMessage('Please agree to the Terms and Privacy Policy to continue.', 'error');
      consent.focus();
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'Saving…';
    }

    setMessage('Saving your workspace…');

    const { data: savedProfile, error: updateError } = await window.jobDb
      .from('job_user_profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          role,
          onboarding_complete: true
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (updateError) {
      console.error('Could not complete onboarding:', updateError);
      setMessage(updateError.message, 'error');

      if (button) {
        button.disabled = false;
        button.textContent = 'Continue';
      }

      return;
    }

    if (
      !savedProfile ||
      !savedProfile.onboarding_complete ||
      savedProfile.role !== role
    ) {
      setMessage(
        'Your account settings were not saved. Please try again.',
        'error'
      );

      if (button) {
        button.disabled = false;
        button.textContent = 'Continue';
      }

      return;
    }

    window.location.replace(
      role === 'employer'
        ? 'employer.html'
        : 'dashboard.html'
    );
  });
});
(() => {
  const config = window.JOBFROMHOME_CONFIG;
  if (!config || !window.supabase) {
    console.error('JobFromHome configuration or Supabase library is unavailable.');
    return;
  }
  window.jobDb = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
})();

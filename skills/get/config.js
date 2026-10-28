// Skills pack form settings. This file is public: never put a key or secret in it.
// apiUrl empty  -> the form shows the direct download straight away and sends no email.
// apiUrl set    -> the form posts to the skills-request Edge Function, which emails a 7-day link.
// Set it once the function is deployed (see skills/README-setup.md), for example:
//   apiUrl: 'https://<project-ref>.supabase.co/functions/v1/skills-request'
window.GTP_SKILLS_CONFIG = { apiUrl: '' };

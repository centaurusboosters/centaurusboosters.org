// Lets a local dev skip Google sign-in when Google OAuth credentials aren't
// configured. Guarded by NODE_ENV so it can never activate in a deployed
// build even if the env var is set by mistake.
export function isAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.TINA_LOCAL_AUTH_BYPASS === 'true';
}

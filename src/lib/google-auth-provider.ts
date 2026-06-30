import { AbstractAuthProvider } from 'tinacms';

// Talks directly to our standalone NextAuth route via fetch, replicating
// next-auth/react's signIn/getSession/signOut algorithms by hand. We can't
// use next-auth/react's own helpers here: they read a single global
// __NEXTAUTH config set by whichever SessionProvider mounts first in the
// React tree, and tinacms's bundled admin shell unconditionally wraps
// everything in its own SessionProvider hardcoded to basePath "/api/tina/auth"
// (node_modules/tinacms/dist/index.js). That would hijack signIn/getSession
// calls made anywhere in the tree, including from a custom AuthProvider, back
// onto that path. Talking to /api/auth via plain fetch sidesteps it entirely.
const BASE_PATH = '/api/auth';

async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${BASE_PATH}/csrf`);
  const data = await res.json();
  return data.csrfToken;
}

function defaultCallbackUrl(): string {
  return `${window.location.origin}/admin/index.html`;
}

export class GoogleAuthProvider extends AbstractAuthProvider {
  async authenticate(): Promise<void> {
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BASE_PATH}/signin/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl: defaultCallbackUrl(),
        json: 'true',
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  async getToken() {
    return { id_token: '' };
  }

  async getUser() {
    const res = await fetch(`${BASE_PATH}/session`);
    const session = await res.json();
    return session?.user || false;
  }

  async logout(): Promise<void> {
    const csrfToken = await getCsrfToken();
    const callbackUrl = defaultCallbackUrl();
    const res = await fetch(`${BASE_PATH}/signout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ csrfToken, callbackUrl, json: 'true' }),
    });
    const data = await res.json();
    window.location.href = data.url || callbackUrl;
  }

  async authorize() {
    const user = await this.getUser();
    return user || null;
  }
}

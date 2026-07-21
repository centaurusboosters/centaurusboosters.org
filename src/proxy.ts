import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthBypassEnabled } from './lib/tina-auth-bypass';

// /admin is served as static files (public/admin/index.html, the Tina
// admin shell). Tina's own auth gate only kicks in once you click "Enter
// Edit Mode" inside that shell, so the page itself is reachable by anyone.
// Require a valid NextAuth session before the static admin shell is ever
// served.
export async function proxy(req: NextRequest) {
  if (isAuthBypassEnabled()) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    return NextResponse.next();
  }

  const signInUrl = new URL('/api/auth/signin', req.url);
  signInUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

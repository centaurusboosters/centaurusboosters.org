import type { AuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const allowedDomain = (process.env.TINA_ADMIN_DOMAIN || 'centaurusboosters.org').toLowerCase();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Force Google's account chooser on every sign-in. Without this,
      // Google silently re-uses its own SSO session and signs the user
      // back in as whichever account they used last, even right after
      // they hit "logout" in the Tina admin (that only clears our
      // NextAuth session, not Google's).
      authorization: {
        params: { prompt: 'select_account' },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      return !!email && email.endsWith(`@${allowedDomain}`);
    },
    async jwt({ token }) {
      // signIn already enforces the email allowlist, so any token issued
      // here belongs to an authorized Tina admin user.
      token.role = 'user';
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Session['user'] & { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
};

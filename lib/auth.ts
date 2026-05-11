import NextAuth, { type Session } from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedUsers = (process.env.AUTH_ALLOWED_USERS ?? "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const devBypassAuth =
  process.env.NODE_ENV !== "production" &&
  process.env.THYME_DEV_BYPASS_AUTH === "1";

const nextAuth = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    signIn({ profile }) {
      if (allowedUsers.length === 0) return true;
      const username = (profile?.login as string | undefined)?.toLowerCase();
      return username ? allowedUsers.includes(username) : false;
    },
    jwt({ token, profile }) {
      if (profile?.login) {
        token.username = profile.login;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.username) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

const DEV_SESSION: Session = {
  user: { name: "local-dev", email: "dev@local" },
  expires: "9999-12-31T23:59:59.999Z",
};

export const auth: typeof nextAuth.auth = devBypassAuth
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (((..._args: unknown[]) => Promise.resolve(DEV_SESSION)) as any)
  : nextAuth.auth;

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedUsers = (process.env.AUTH_ALLOWED_USERS ?? "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
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

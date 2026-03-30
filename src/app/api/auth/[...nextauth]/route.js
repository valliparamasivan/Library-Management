import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      async authorize(credentials) {
        try {
          if (credentials) {
            return {
              email: credentials.email,
              data: credentials.userData,
              role: credentials.role,
            };
          }
        } catch (error) {
          throw new Error("Session creation failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user.data;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        token: token.user,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

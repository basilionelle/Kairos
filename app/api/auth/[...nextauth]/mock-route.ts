import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a mock version of the NextAuth configuration for development
// It allows you to sign in with any email/password combination

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Development Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In development mode, accept any credentials
        if (!credentials?.email) return null;
        
        // Mock user data - this would normally come from the database
        return {
          id: "dev-user-id",
          name: "Development User",
          email: credentials.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  // For development only - do not use in production
  secret: "dev-secret-key",
  debug: true,
});

export { handler as GET, handler as POST };

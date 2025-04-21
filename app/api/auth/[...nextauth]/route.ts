import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// Note: This is a placeholder. You'll need to install and configure Prisma
// npm install @prisma/client prisma @auth/prisma-adapter
// npx prisma init
// Then configure your schema.prisma file

import prisma from '../../.././../lib/prisma';
import { comparePassword } from '../../.././../lib/auth';

// We're now using the MongoDB database with Prisma
// Password hashing is handled in the lib/auth.ts file

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // Find the user in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          // If user doesn't exist or password doesn't match
          if (!user || !user.password) return null;
          
          const passwordMatch = await comparePassword(credentials.password, user.password);
          
          if (!passwordMatch) return null;
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
});

export { handler as GET, handler as POST };

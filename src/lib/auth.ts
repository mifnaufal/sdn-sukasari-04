import NextAuth, { type NextAuthOptions, type Session, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      nama?: string | null; 
      email?: string | null;
      image?: string | null;
    }
  }

  interface User {
    role: string;
    nama?: string | null; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    nama?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nama,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role;
      token.id = user.id;
      token.nama = user.nama;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      session.user.nama = token.nama as string; // Pakai nama
    }
    return session;
  },
    async redirect({ url, baseUrl }) {
      // Default redirect ke dashboard admin/guru setelah login
      // Redirect ini di-handle di komponen login form
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
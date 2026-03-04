import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                password: { label: 'Admin Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.password) {
                    return null;
                }

                const adminPassword = process.env.ADMIN_PASSWORD;
                if (credentials.password === adminPassword) {
                    return { id: 'admin', name: 'Admin' };
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

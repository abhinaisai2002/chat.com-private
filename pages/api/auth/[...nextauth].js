import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const { email } = credentials;
                const { password } = credentials;
                const user = await prisma.user.findFirst({
                    where: { email },
                    select: {
                        email: true,
                        username: true,
                        createdAt: true,
                        image: true,
                        password: true,
                        verified: true,
                        id:true
                    },
                });
                if (user) {
                    if(bcrypt.compareSync(password,user.password))
                        return user;
                }
                throw new Error(JSON.stringify({ message: 'Invalid Credentials' }));
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

            // // console.log(44,user, account, email, profile, credentials)
            if (account.provider === 'google') {
                let dbUser = await prisma.user.findFirst({
                    where: {
                        email: user.email
                    }
                })
                if (!dbUser) {
                    try {
                        dbUser = await prisma.user.create({
                            data: {
                                email: user.email,
                                username: user.name,
                                image: user.image,
                                verified: true
                            }
                        })
                    }
                    catch (err) {
                        // console.log(err);
                    }
                }
                account.userId = dbUser.id
            }
            else if (account.provider === 'credentials') {
                if (user.verified === false) {
                    throw new Error(JSON.stringify({ message: 'Please verify your email' }));
                }
            }
            return true
        },
        async jwt({ token, user, account, session, }) {

            // // console.log(76,user, account, token, session);
            if (account?.provider === 'google') {
                return {
                    ...token,
                    username: user.name,
                    email: user.email,
                    image: user.image,
                    userId:account.userId
                }
            }
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    image: user.image,
                    userId:user.id
                };
            }
            return token;
        },
        async session({ session, token, user }) {
            
            // // console.log(96,user, token, session);
            return {
                username: token.username,
                email: token.email,
                image: token.picture,
                userId:token.userId
            };
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt', encryption: true,
    },
    debug: false,
    jwt: {
        maxAge: 60 * 60 * 24,

    },

};
export default NextAuth(authOptions);

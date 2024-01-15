import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

// Every Next.js route is known as a serverless route.

// So a function like signIn is a lambda function that opens up only when
// it gets called. 

// Every time it gets called, it needs to spin up the server and make
// a connection to the db which is great bc we don't have to keep our server
// running constantly.

// But we do have to make a connection to our db first.
// Check out next-auth documentation.

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            });
    
            session.user.id = sessionUser._id.toString();
    
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();
                
                // check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });
    
                // if not, create a new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    })
                }
    
                return true;
            } catch (error) {
                console.log("Error checking if user exists: ", error.message);
                return false;
            }
        }
    }
})

// Needed for Next Authentication
export { handler as GET, handler as POST };
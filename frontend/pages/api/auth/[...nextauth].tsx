import NextAuth, { AuthOptions } from 'next-auth';
import FortyTwoProvider from "next-auth/providers/42-school";
import { Pool } from "pg";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import { DataSourceOptions } from 'typeorm';

const dbPool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME,
});


const connection: DataSourceOptions = {
    type: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME,
}


const connectionOption: DataSourceOptions = {
    type: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*.ts'],
}


export const authOptions: AuthOptions = {
    // adapter: TypeORMAdapter(connectionOption),
    providers: [
        FortyTwoProvider({
          clientId: process.env.CLIENT_ID!,
          clientSecret: process.env.CLIENT_SECRET!,
          profile(profile) {
            return {
              id: profile.id,
              name: profile.login,
              image: profile.image_url,
            };
          }
        })
    ],
    callbacks: {
        // try middleware to parse the session id from transport
        async session({ session, token, trigger, user, newSession }) {
            session.user = user;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

export default NextAuth(authOptions);



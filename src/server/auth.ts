import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EVEOnlineProvider from "next-auth/providers/eveonline";

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken: string;
  }

}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
      }

      // sign in
      if (token) return token

      // sign out
      return {}
  },

  async session({ session, token }) {
    session.accessToken = token.accessToken as string;
    session.user.id = token.username as string;
    return session
  }
  },
  providers: [
    EVEOnlineProvider({
      clientId: env.EVE_CLIENT_ID,
      clientSecret: env.EVE_CLIENT_SECRET,
      authorization: "https://login.eveonline.com/v2/oauth/authorize?scope=esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-location.read_online.v1",
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

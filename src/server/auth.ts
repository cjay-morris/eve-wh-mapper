import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type JWT } from "next-auth/jwt";
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
      image: string;
      name: string;
    } & DefaultSession["user"];
    accessToken: string;
    error?: string;
  }
}

const refreshAccessToken = async (token: JWT) => {
  try {
    const response = await fetch('https://login.eveonline.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${env.EVE_CLIENT_ID}:${env.EVE_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });
    if (!response.ok) {
      console.log('Failed to refresh access token', response.status, await response.text());
      throw new Error('Failed to refresh access token');
    }
    const refreshedToken = await response.json() as { access_token: string, expires_in: number, refresh_token: string };

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: (Date.now() / 1000) + refreshedToken.expires_in,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
};

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
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at : Date.now(),
          refreshToken: account.refresh_token,
          id: user.id,
          name: user.name,
          image: user.image,
      }

      // if the token has less than 4 minutes left, refresh it
      if (Date.now() < (token.accessTokenExpires as number - 240) * 1000) {
        console.log('Access token still valid', token.accessTokenExpires);
        return token
      }
      const newToken = await refreshAccessToken(token);
      return newToken
  },

  async session({ session, token }) {
    if (token) {
      const typedToken = token as { accessToken: string; error?: string; id: string; image: string; name: string };
      session.accessToken = typedToken.accessToken;
      session.error = typedToken.error;
      session.user.id = typedToken.id;
      session.user.image = typedToken.image;
      session.user.name = typedToken.name;
    }
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

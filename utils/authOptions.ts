import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  
  callbacks: {
    async signIn({ user }) {
      // Always allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always allow access to the avatars page
      if (url.includes('/avatars')) {
        return url;
      }
      // For OAuthCallback errors, redirect to avatars
      if (url.includes('error=OAuthCallback')) {
        return `${baseUrl}/avatars`;
      }
      // Default behavior for other cases
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
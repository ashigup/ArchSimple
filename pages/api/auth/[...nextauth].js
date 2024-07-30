import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // Add user information from token to session
      session.user = {
        ...session.user,
        login: token.login,  // Ensure this field is populated
      };
      return session;
    },
    
    async jwt({ token, account, profile }) {
      if (account) {
        console.log(token)
        console.log(account)
        console.log(profile)
        
        token.accessToken = account.access_token;
        token.login = profile.login;  // Ensure this field is populated
      }
      return token;
    },
  },
});

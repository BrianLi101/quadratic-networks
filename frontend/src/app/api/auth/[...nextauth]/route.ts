// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// Import your providers, like Google, GitHub, etc.

const handler = NextAuth({
  // Configure your providers here
  providers: [
    // Example: Google provider
    // Providers.Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  // Add other NextAuth.js configuration options here
});

export { handler as GET, handler as POST };

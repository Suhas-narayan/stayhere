import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const user = userCredential.user;
          
          return {
            id: user.uid,
            email: user.email,
          };
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

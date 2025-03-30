// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"

// export default function Login() {
//   const router = useRouter()
//   const { signIn } = useAuth()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)

//   const [formValues, setFormValues] = useState({
//     email: "",
//     password: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormValues((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       await signIn(formValues.email, formValues.password)
//       toast({
//         title: "Success!",
//         description: "You've been logged in successfully.",
//       })
//       router.push("/")
//     } catch (error) {
//       toast({
//         title: "Authentication failed",
//         description: "Please check your credentials and try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="container max-w-md mx-auto py-16 px-4">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
//         <p className="text-muted-foreground">Sign in to your account to continue</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <Label htmlFor="email">Email address</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="john@example.com"
//             value={formValues.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label htmlFor="password">Password</Label>
//             <Link href="/reset-password" className="text-sm text-primary hover:underline">
//               Forgot password?
//             </Link>
//           </div>
//           <Input
//             id="password"
//             name="password"
//             type="password"
//             placeholder="••••••••"
//             value={formValues.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <Button type="submit" className="w-full" disabled={isLoading} size="lg">
//           {isLoading ? "Signing in..." : "Sign in"}
//         </Button>
//       </form>

//       <div className="mt-6">
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-border"></div>
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//           </div>
//         </div>

//         <div className="mt-6 grid grid-cols-1 gap-3">
//           <Button variant="outline" size="lg" type="button">
//             <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
//               <path
//                 d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
//                 fill="#EA4335"
//               />
//               <path
//                 d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
//                 fill="#4285F4"
//               />
//               <path
//                 d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
//                 fill="#FBBC05"
//               />
//               <path
//                 d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
//                 fill="#34A853"
//               />
//             </svg>
//             Sign in with Google
//           </Button>
//         </div>
//       </div>

//       <div className="mt-8 text-center text-sm">
//         Don&apos;t have an account?{" "}
//         <Link href="/signup" className="text-primary hover:underline">
//           Sign up
//         </Link>
//       </div>
//     </div>
//   )
// }






// src/components/Login.jsx (or the relevant page file)
"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
// Import useSearchParams for reading query parameters
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Adjust path if needed
import { Loader2 } from "lucide-react"; // For loading spinner
import { GoogleAuthProvider } from 'firebase/auth';


export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access search parameters
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
  
    try {
      await signIn(formValues.email, formValues.password);
      toast({
        title: "Success!",
        description: "You've been logged in successfully.",
      });
      router.push('/cms'); // Redirect to CMS after login
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formValues.email}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable input when loading
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {/* Disable link interaction when loading */}
            <Link
              href="/reset-password"
              className={`text-sm text-primary hover:underline ${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
              aria-disabled={isLoading}
              tabIndex={isLoading ? -1 : undefined}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable input when loading
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {/* Show loader when loading */}
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Optional: Disable Google Sign-in and Sign-up links when loading */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Add disabled={isLoading} to the Google button if needed */}


<Button 
  variant="outline" 
  size="lg" 
  type="button" 
  disabled={isLoading}
  onClick={async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Success!",
        description: "You've been logged in with Google.",
      });
      router.push('/cms');
    } catch (error: any) {
      toast({
        title: "Google Sign-In failed",
        description: error.message || "Could not authenticate with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }}
>
  <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
    {/* Google SVG paths */}
  </svg>
  Sign in with Google
</Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm">
        Don't have an account?{" "}
        {/* Disable link interaction when loading */}
        <Link
          href="/signup"
          className={`text-primary hover:underline ${
            isLoading ? 'pointer-events-none opacity-50' : ''
          }`}
          aria-disabled={isLoading}
          tabIndex={isLoading ? -1 : undefined}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}


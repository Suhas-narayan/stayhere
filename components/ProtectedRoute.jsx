// // src/components/ProtectedRoute.jsx
// "use client";

// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useAuth } from '@/hooks/use-auth'; // Adjust the import path as needed
// import { Loader2 } from 'lucide-react'; // Or your preferred loading component

// export default function ProtectedRoute({ children }) {
//   const { user, isLoading } = useAuth(); // Assuming useAuth returns { user, isLoading }
//   const router = useRouter();
//   const pathname = usePathname(); // Get the current path

//   useEffect(() => {
//     // Wait until the loading state is resolved
//     if (isLoading) {
//       return;
//     }

//     // If loading is finished and there's no user, redirect to login
//     if (!user) {
//       // Pass the current path as a query parameter for redirection after login
//       router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
//     }

//     // No need for an 'else' block; if the user exists, the component will proceed to render children.
//   }, [user, isLoading, router, pathname]); // Add dependencies

//   // Show a loading indicator while checking authentication
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="h-12 w-12 animate-spin text-primary" />
//       </div>
//     );
//   }

//   // If authenticated (and not loading), render the protected content
//   if (user) {
//     return <>{children}</>;
//   }

//   // If not authenticated (and not loading), redirect is in progress.
//   // Render a loading state or null while redirecting to avoid flashing the protected content.
//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <Loader2 className="h-12 w-12 animate-spin text-primary" />
//     </div>
//   ); // Or simply return null
// }
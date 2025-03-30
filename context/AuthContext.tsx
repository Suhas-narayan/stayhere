"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust path if necessary
import { Loader2 } from "lucide-react";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
  };

  // Render loading indicator until Firebase checks auth state
  if (loading) {
     return (
       <div className="flex justify-center items-center min-h-screen">
         <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
       </div>
     );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
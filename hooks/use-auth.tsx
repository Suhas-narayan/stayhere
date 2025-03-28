"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser
        // Convert Firebase user to our app's user model
        setUser({
          id: uid,
          name: displayName || "User",
          email: email || "",
          photoURL: photoURL || undefined,
          role: "user", // Default role - in a real app you'd fetch this from your database
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


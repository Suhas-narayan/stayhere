"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function SignUp() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { password: "", confirmPassword: "" }

    if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      await signUp(formValues.email, formValues.password, formValues.name);
      toast({
        title: "Account created!",
        description: "You've been registered successfully.",
      });
      router.push('/cms'); // Redirect to CMS after signup
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-muted-foreground">Sign up to start finding your perfect vacation rental</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formValues.name}
            onChange={handleChange}
            required
          />
        </div>

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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formValues.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

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
        description: "Account created with Google.",
      });
      router.push('/cms');
    } catch (error: any) {
      toast({
        title: "Google Sign-Up failed",
        description: error.message || "Could not create account with Google.",
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
  Sign up with Google
</Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

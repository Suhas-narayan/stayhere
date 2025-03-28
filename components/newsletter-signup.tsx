"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })

      setEmail("")
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary/5 rounded-xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-3">Get Travel Inspiration</h3>
      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
        Subscribe to our newsletter for exclusive deals, destination guides, and travel tips.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  )
}


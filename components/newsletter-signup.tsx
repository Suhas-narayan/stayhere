// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/use-toast"

// export default function NewsletterSignup() {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email) return

//     setLoading(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast({
//         title: "Success!",
//         description: "You've been subscribed to our newsletter.",
//       })

//       setEmail("")
//     } catch (error) {
//       toast({
//         title: "Something went wrong.",
//         description: "Please try again later.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="bg-primary/5 rounded-xl p-8 text-center">
//       <h3 className="text-2xl font-bold mb-3">Get Travel Inspiration</h3>
//       <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
//         Subscribe to our newsletter for exclusive deals, destination guides, and travel tips.
//       </p>

//       <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
//         <Input
//           type="email"
//           placeholder="Your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="flex-1"
//         />
//         <Button type="submit" disabled={loading}>
//           {loading ? "Subscribing..." : "Subscribe"}
//         </Button>
//       </form>
//     </div>
//   )
// }

"use client"

import type React from "react"

export default function WhyChooseUs() {
  const features = [
    {
      title: "Centrally Located",
      description: "In the heart of the city",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "High-speed Internet",
      description: "Perfect for streaming and digital nomads",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    },
    {
      title: "Top grade apartment facilities",
      description: "Enjoy fun-filled activities",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Feel right at home",
      description: "Cook, wash and chill in comfort of a home",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-primary/5 rounded-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Us</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-primary mb-4">
              {feature.icon}
            </div>
            <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
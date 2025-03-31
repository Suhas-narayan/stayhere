"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"


export default function Header() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    scrolled || !isHome ? "bg-background border-b shadow-sm" : "bg-transparent"
  }`

  const navLinks = [
    { name: "Home", href: "/" },

    { name: "Destinations", href: "#popular-destinations" },
  
  ]

  return (
    <header className={headerClasses}>
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">StayHere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`font-medium hover:text-primary transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : isHome && !scrolled
                        ? "text-foreground"
                        : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>StayHere</SheetTitle>
                <SheetDescription>Find your perfect getaway</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="text-lg font-medium hover:text-primary">
                    {link.name}
                  </Link>
                ))}
                
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}


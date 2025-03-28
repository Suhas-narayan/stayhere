"use client"

import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">VacayStays</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/properties" className="text-sm font-medium transition-colors hover:text-primary">
              Properties
            </Link>
            <Link href="/dashboard/bookings" className="text-sm font-medium transition-colors hover:text-primary">
              Bookings
            </Link>
            <Link href="/dashboard/calendar" className="text-sm font-medium transition-colors hover:text-primary">
              Calendar
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/">
            <Button variant="ghost" size="sm">
              View Website
            </Button>
          </Link>
          <UserNav />
        </div>
      </div>
    </header>
  )
}


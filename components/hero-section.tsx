import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/heroimg2.jpg?height=1080&width=1920')",
          filter: "brightness(0.7)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Find Your Perfect <span className="text-secondary">Vacation Home</span>
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Discover exceptional vacation rentals worldwide. Book unique homes, cabins, beach houses, and more for your
          next getaway.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#featured-properties">
            <Button size="lg" className="text-lg px-8">
              Explore Rentals
            </Button>
          </Link>
          {/* <Link href="/host">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10"
            >
              Become a Host
            </Button>
          </Link> */}
        </div>
      </div>

      {/* Subtle gradient overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  )
}


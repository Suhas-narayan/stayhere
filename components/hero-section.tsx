import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/hero-video-poster.jpg" 
        >
          <source src="/herovideo.mp4" type="video/mp4" />
          <source src="/herovideo.webm" type="video/webm" /> 
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/heroimg2.jpg')",
              filter: "brightness(0.7)",
            }}
          />
        </video>
       
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          "Your Dream Stay, <br /><span className="text-secondary">Just a Click Away"</span>
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
        </div>
      </div>

    </div>
  )
}
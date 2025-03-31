import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import FeaturedProperties from "@/components/featured-properties"
import PopularDestinations from "@/components/popular-destinations"
import TestimonialsSection from "@/components/testimonials-section"
import WhyChooseUs from "@/components/why-choose-us"
import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroSection />
      <div className="container max-w-7xl mx-auto px-4">
        <SearchBar className="mt-[-3rem] relative z-10" />

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Stay Anywhere, Feel at Home</h2>
          <FeaturedProperties />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Popular Destinations</h2>
          <PopularDestinations />
        </section>

        <section className="mt-16">
          <WhyChooseUs />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">What Guests Are Saying</h2>
          <TestimonialsSection />
        </section>

        
        
      </div>

      <div className="fixed bottom-6 right-6 z-50">
  <Chatbot />
</div>
    </div>
  )
}


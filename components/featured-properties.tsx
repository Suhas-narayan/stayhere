"use client"

import { useState, useEffect } from "react"
import PropertyCard from "@/components/property-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Property } from "@/lib/types"

export default function FeaturedProperties() {
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`) 
        if (!response.ok) throw new Error("Failed to fetch properties")
        
        const data: Property[] = await response.json()
        setProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6" id="featured-properties">
        <p className="text-muted-foreground">Handpicked properties for an unforgettable vacation</p>
      
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
          : properties.map((property, index) => (
              <PropertyCard key={property.id || index} property={property} featured />
            ))}
      </div>

      
    </div>
  )
}



// "use client"

// import { useState, useEffect } from "react"
// import PropertyCard from "@/components/property-card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import type { Property } from "@/lib/types"

// // Mock data - in a real app, this would come from your database
// const mockProperties: Property[] = [
//   {
//     id: "1",
//     title: "Luxury Beach Villa with Ocean View",
//     description: "Beautiful villa overlooking the ocean with private pool and garden.",
//     location: "Malibu, California",
//     price: 350,
//     bedroomCount: 4,
//     bathroomCount: 3,
//     maxGuests: 8,
//     amenities: ["Pool", "Beach Access", "Wi-Fi", "Kitchen", "Air Conditioning"],
//     images: ["/placeholder.svg?height=600&width=800"],
//     rating: 4.9,
//     reviewCount: 124,
//     featured: true,
//     host: {
//       id: "host1",
//       name: "Jessica Wilson",
//       image: "/placeholder.svg?height=200&width=200",
//     },
//   },
//   {
//     id: "2",
//     title: "Modern Mountain Cabin Retreat",
//     description: "Cozy cabin in the mountains with stunning views and hot tub.",
//     location: "Aspen, Colorado",
//     price: 275,
//     bedroomCount: 3,
//     bathroomCount: 2,
//     maxGuests: 6,
//     amenities: ["Hot Tub", "Fireplace", "Wi-Fi", "Kitchen", "Heating"],
//     images: ["/placeholder.svg?height=600&width=800"],
//     rating: 4.8,
//     reviewCount: 97,
//     featured: true,
//     host: {
//       id: "host2",
//       name: "Michael Johnson",
//       image: "/placeholder.svg?height=200&width=200",
//     },
//   },
//   {
//     id: "3",
//     title: "Charming Cottage in the Countryside",
//     description: "Peaceful cottage surrounded by nature with a beautiful garden.",
//     location: "Cotswolds, UK",
//     price: 180,
//     bedroomCount: 2,
//     bathroomCount: 1,
//     maxGuests: 4,
//     amenities: ["Garden", "Fireplace", "Wi-Fi", "Kitchen", "Parking"],
//     images: ["/placeholder.svg?height=600&width=800"],
//     rating: 4.7,
//     reviewCount: 83,
//     featured: true,
//     host: {
//       id: "host3",
//       name: "Emma Thompson",
//       image: "/placeholder.svg?height=200&width=200",
//     },
//   },
//   {
//     id: "4",
//     title: "Urban Loft in Downtown",
//     description: "Stylish loft apartment in the heart of the city with amazing views.",
//     location: "New York City, NY",
//     price: 220,
//     bedroomCount: 1,
//     bathroomCount: 1,
//     maxGuests: 2,
//     amenities: ["City View", "Gym", "Wi-Fi", "Kitchen", "Doorman"],
//     images: ["/placeholder.svg?height=600&width=800"],
//     rating: 4.6,
//     reviewCount: 109,
//     featured: true,
//     host: {
//       id: "host4",
//       name: "David Chen",
//       image: "/placeholder.svg?height=200&width=200",
//     },
//   },
// ]

// export default function FeaturedProperties() {
//   const [loading, setLoading] = useState(true)
//   const [properties, setProperties] = useState<Property[]>([])

//   useEffect(() => {
//     // Simulate loading from database
//     const timer = setTimeout(() => {
//       setProperties(mockProperties)
//       setLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <p className="text-muted-foreground">Handpicked properties for an unforgettable vacation</p>
//         <div className="flex space-x-2">
//           <Button variant="outline" size="icon" className="rounded-full">
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="icon" className="rounded-full">
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {loading
//           ? Array(4)
//               .fill(0)
//               .map((_, index) => (
//                 <div key={index} className="space-y-2">
//                   <Skeleton className="aspect-[4/3] w-full rounded-xl" />
//                   <Skeleton className="h-6 w-2/3" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-1/2" />
//                 </div>
//               ))
//           : properties.map((property) => <PropertyCard key={property.id} property={property} featured />)}
//       </div>

//       <div className="mt-6 text-center">
//         <Button variant="outline" className="px-8">
//           View All Properties
//         </Button>
//       </div>
//     </div>
//   )
// }




        


       "use client"

import { useState, useEffect } from "react"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Property } from "@/lib/types"

export default function FeaturedProperties() {
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`) // Replace with your API endpoint
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
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Handpicked properties for an unforgettable vacation</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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

      <div className="mt-6 text-center">
        <Button variant="outline" className="px-8">
          View All Properties
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PropertyCard } from "@/components/dashboard/property-card"
import { PropertyForm } from "@/components/dashboard/property-form"
import { Plus, Search } from "lucide-react"
import type { Property } from "@/lib/types"

// Mock data
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Beach Villa with Ocean View",
    description: "Beautiful villa overlooking the ocean with private pool and garden.",
    location: "Malibu, California",
    price: 850,
    bedroomCount: 4,
    bathroomCount: 4.5,
    maxGuests: 10,
    amenities: ["Pool", "Beach Access", "Wi-Fi", "Kitchen"],
    images: ["/placeholder.svg?height=600&width=800"],
    rating: 4.97,
    reviewCount: 243,
    host: {
      id: "host123",
      name: "Jennifer Williams",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "2",
    title: "Modern Mountain Cabin Retreat",
    description: "Cozy cabin in the mountains with stunning views and hot tub.",
    location: "Aspen, Colorado",
    price: 275,
    bedroomCount: 3,
    bathroomCount: 2,
    maxGuests: 6,
    amenities: ["Hot Tub", "Fireplace", "Wi-Fi", "Kitchen"],
    images: ["/placeholder.svg?height=600&width=800"],
    rating: 4.85,
    reviewCount: 112,
    host: {
      id: "host123",
      name: "Jennifer Williams",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "3",
    title: "Charming Cottage in the Countryside",
    description: "Peaceful cottage surrounded by nature with a beautiful garden.",
    location: "Cotswolds, UK",
    price: 180,
    bedroomCount: 2,
    bathroomCount: 1,
    maxGuests: 4,
    amenities: ["Garden", "Fireplace", "Wi-Fi", "Kitchen"],
    images: ["/placeholder.svg?height=600&width=800"],
    rating: 4.75,
    reviewCount: 87,
    host: {
      id: "host123",
      name: "Jennifer Williams",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "4",
    title: "Urban Loft in Downtown",
    description: "Stylish loft apartment in the heart of the city with amazing views.",
    location: "New York City, NY",
    price: 220,
    bedroomCount: 1,
    bathroomCount: 1,
    maxGuests: 2,
    amenities: ["City View", "Gym", "Wi-Fi", "Kitchen"],
    images: ["/placeholder.svg?height=600&width=800"],
    rating: 4.6,
    reviewCount: 142,
    host: {
      id: "host123",
      name: "Jennifer Williams",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "5",
    title: "Lakeside Cabin with Private Dock",
    description: "Beautiful cabin right on the lake with private dock and boats.",
    location: "Lake Tahoe, Nevada",
    price: 310,
    bedroomCount: 3,
    bathroomCount: 2,
    maxGuests: 8,
    amenities: ["Lake Access", "Boats", "Wi-Fi", "Kitchen"],
    images: ["/placeholder.svg?height=600&width=800"],
    rating: 4.9,
    reviewCount: 65,
    host: {
      id: "host123",
      name: "Jennifer Williams",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
]

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingProperty, setIsAddingProperty] = useState(false)
  const [properties] = useState<Property[]>(mockProperties)

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch
  })

  return (
    <div className="flex-1 space-y-6 p-0 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Fill in the details below to create a new property listing.</DialogDescription>
            </DialogHeader>
            <PropertyForm onSubmit={() => setIsAddingProperty(false)} onCancel={() => setIsAddingProperty(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All Properties
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
              Active
            </TabsTrigger>
            <TabsTrigger value="draft" onClick={() => setStatusFilter("draft")}>
              Draft
            </TabsTrigger>
          </TabsList>
          <div className="flex w-full items-center space-x-2 sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search properties..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="sort">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active properties would be displayed here */}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Draft properties would be displayed here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Property } from "@/lib/types"

import {
  Bath,
  BedDouble,
  CalendarDays,
  Heart,
  Home,
  MapPin,
  Share2,
  Star,
  Users,
  Wifi,
  Coffee,
  Car,
  Tv,
  Snowflake,
  UtensilsCrossed,
} from "lucide-react"

// Mock data - in a real app, you would fetch this from your database
const mockProperty: Property = {
  id: "123",
  title: "Luxury Beach Villa with Ocean View",
  description:
    "Escape to this stunning beachfront villa overlooking the crystal clear waters of the Pacific Ocean. This luxurious 4-bedroom villa offers panoramic ocean views, a private infinity pool, and direct beach access. Perfect for family gatherings or a relaxing getaway with friends.\n\nThe spacious living area opens to a large terrace with comfortable outdoor furniture, ideal for watching spectacular sunsets. The fully equipped gourmet kitchen includes high-end appliances and everything you need to prepare delicious meals. All bedrooms feature ensuite bathrooms and premium linens for ultimate comfort.\n\nSteps away from the beach, this property offers the perfect blend of luxury, privacy, and convenience. Nearby amenities include fine dining restaurants, shopping, and water activities.",
  location: "Malibu, California",
  price: 850,
  bedroomCount: 4,
  bathroomCount: 4.5,
  maxGuests: 10,
  amenities: [
    "Ocean View",
    "Private Pool",
    "Beach Access",
    "Air Conditioning",
    "Free WiFi",
    "Full Kitchen",
    "Washer & Dryer",
    "Free Parking",
    "TV",
    "Outdoor Dining Area",
    "BBQ Grill",
    "Dishwasher",
  ],
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  rating: 4.97,
  reviewCount: 243,
  host: {
    id: "host123",
    name: "Jennifer Williams",
    image: "/placeholder.svg?height=200&width=200",
  },
  availability: {
    booked: ["2025-03-15", "2025-03-16", "2025-03-17", "2025-03-25", "2025-03-26", "2025-03-27"],
  },
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Ocean View": <Home />,
  "Private Pool": <Bath />,
  "Beach Access": <MapPin />,
  "Air Conditioning": <Snowflake />,
  "Free WiFi": <Wifi />,
  "Full Kitchen": <UtensilsCrossed />,
  "Washer & Dryer": <Home />,
  "Free Parking": <Car />,
  TV: <Tv />,
  "Outdoor Dining Area": <UtensilsCrossed />,
  "BBQ Grill": <UtensilsCrossed />,
  Dishwasher: <UtensilsCrossed />,
  Coffee: <Coffee />,
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [guestCount, setGuestCount] = useState(2)
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [bookingStep, setBookingStep] = useState(1)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Get the number of nights selected
  const nights =
    selectedDates.from && selectedDates.to
      ? Math.round((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  // Calculate the total price
  const totalPrice = property ? property.price * nights : 0
  const taxesAndFees = totalPrice * 0.15 // 15% for taxes and fees
  const grandTotal = totalPrice + taxesAndFees

  useEffect(() => {
    // Simulate fetching property data
    const fetchProperty = async () => {
      try {
        // In a real app, you would fetch data from your API here
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProperty(mockProperty)
      } catch (error) {
        console.error("Error fetching property:", error)
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, toast])

  // Function to disable dates that are already booked
  const disabledDates = (date: Date) => {
    if (!property?.availability?.booked) return false

    const dateString = date.toISOString().split("T")[0]
    return property.availability.booked.includes(dateString)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (bookingStep === 1) {
      setBookingStep(2)
      return
    }

    // Implement payment processing here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Booking confirmed!",
        description: "Your reservation has been successfully processed.",
      })

      // Reset form and close dialog
      setBookingStep(1)
      setIsBookingOpen(false)
      setSelectedDates({ from: undefined, to: undefined })
      setBookingInfo({ name: "", email: "", phone: "" })
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/properties">
          <Button>Browse Other Properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Property Title & Location */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-secondary mr-1" />
              <span className="font-medium">
                {property.rating.toFixed(2)}{" "}
                <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main large image */}
          <div className="md:col-span-1 aspect-[4/3] relative rounded-tl-xl rounded-bl-xl overflow-hidden">
            <Image src={property.images[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
          </div>

          {/* Grid of smaller images */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {property.images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className={`aspect-[4/3] relative overflow-hidden ${
                  index === 0 ? "rounded-tr-xl" : index === 2 ? "rounded-br-xl" : ""
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 2}`}
                  fill
                  className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>

          {/* View all photos button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4"
            onClick={() => setSelectedImage(property.images[0])}
          >
            View all photos
          </Button>
        </div>

        {/* Image gallery dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Photo Gallery</DialogTitle>
              <DialogDescription>
                {property.title} - {property.location}
              </DialogDescription>
            </DialogHeader>
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          {/* Host & Key Features */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Hosted by {property.host.name}</h2>
              <div className="text-muted-foreground">
                <span>{property.bedroomCount} bedrooms</span> • <span>{property.bathroomCount} bathrooms</span> •{" "}
                <span>Up to {property.maxGuests} guests</span>
              </div>
            </div>
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={property.host.image || "/placeholder.svg"}
                alt={property.host.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="py-6 border-b">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <BedDouble className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium">{property.bedroomCount} Bedrooms</div>
                  <div className="text-sm text-muted-foreground">
                    {property.bedroomCount > 1 ? `${property.bedroomCount} kings` : "1 king"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium">{property.bathroomCount} Bathrooms</div>
                  <div className="text-sm text-muted-foreground">All ensuite</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium">Up to {property.maxGuests} guests</div>
                  <div className="text-sm text-muted-foreground">Perfect for families</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b">
            <h3 className="text-xl font-semibold mb-4">About this place</h3>
            <div className="text-muted-foreground whitespace-pre-line">{property.description}</div>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b">
            <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3">
                  <div className="h-6 w-6 text-primary">{amenityIcons[amenity] || <Home />}</div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar - Availability */}
          <div className="py-6 border-b">
            <h3 className="text-xl font-semibold mb-4">Availability</h3>
            <p className="mb-4">Select check-in and check-out dates to see the total price.</p>
            <Button variant="outline" onClick={() => setCalendarOpen(true)} className="mb-4">
              <CalendarDays className="h-4 w-4 mr-2" />
              {selectedDates.from ? (
                selectedDates.to ? (
                  <>
                    {selectedDates.from.toLocaleDateString()} - {selectedDates.to.toLocaleDateString()}
                  </>
                ) : (
                  selectedDates.from.toLocaleDateString()
                )
              ) : (
                "Select dates"
              )}
            </Button>

            {calendarOpen && (
              <div className="my-4 p-4 border rounded-lg">
                <Calendar
                  mode="range"
                  selected={selectedDates}
                  onSelect={(range) => {
                    setSelectedDates(range || { from: undefined, to: undefined })
                  }}
                  numberOfMonths={2}
                  disabled={disabledDates}
                  minDate={new Date()}
                />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setCalendarOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Tab Section */}
          <div className="py-6">
            <Tabs defaultValue="reviews">
              <TabsList className="mb-4">
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-secondary mr-2" />
                      <span className="text-xl font-semibold">{property.rating.toFixed(2)}</span>
                    </div>
                    <span className="text-xl font-semibold">•</span>
                    <span className="text-xl font-semibold">{property.reviewCount} reviews</span>
                  </div>

                  {/* Review categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span>Cleanliness</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-28 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">4.9</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Communication</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-30 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Check-in</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-28 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">4.9</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Accuracy</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-26 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-30 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Value</span>
                      <div className="flex items-center">
                        <div className="w-32 h-1 bg-muted rounded-full">
                          <div className="w-27 h-1 bg-primary rounded-full"></div>
                        </div>
                        <span className="ml-2">4.9</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample reviews */}
                  <div className="space-y-6 mt-8">
                    {/* Review 1 */}
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Reviewer"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">Michael Smith</h4>
                          <p className="text-sm text-muted-foreground">March 2025</p>
                        </div>
                      </div>
                      <p>
                        This place is absolutely stunning! The views are even better than the pictures show. The host
                        was very responsive and accommodating. We had an amazing time and will definitely be back.
                      </p>
                    </div>

                    {/* Review 2 */}
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Reviewer"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">Sarah Johnson</h4>
                          <p className="text-sm text-muted-foreground">February 2025</p>
                        </div>
                      </div>
                      <p>
                        We had a wonderful family vacation at this property. The house is beautifully designed and has
                        everything you need. The beach access was perfect for our kids. Highly recommend!
                      </p>
                    </div>

                    <Button variant="outline">View all {property.reviewCount} reviews</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About the area</h3>
                  <div className="aspect-[16/9] bg-muted rounded-xl relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Map view would appear here</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Getting around</h4>
                    <p className="text-muted-foreground">
                      We recommend having a car for convenience, but rideshare services are readily available in the
                      area. The property is a 10-minute drive from shopping and dining options.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="policies">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">House Rules</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Check-in: 4:00 PM - 10:00 PM</li>
                      <li>Checkout: 11:00 AM</li>
                      <li>No smoking</li>
                      <li>No pets</li>
                      <li>No parties or events</li>
                      <li>Maximum 10 guests</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
                    <p className="text-muted-foreground mb-2">
                      Free cancellation for 48 hours after booking. Cancel before check-in for a partial refund.
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>100% refund if canceled at least 30 days before check-in</li>
                      <li>50% refund if canceled at least 14 days before check-in</li>
                      <li>No refund if canceled less than 14 days before check-in</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Safety & Property</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Carbon monoxide alarm installed</li>
                      <li>Smoke alarm installed</li>
                      <li>Security camera/recording device on property</li>
                      <li>Pool/hot tub without a gate or lock</li>
                      <li>Nearby lake, river, other body of water</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>${property.price}</span>
                <span className="text-base font-normal">night</span>
              </CardTitle>
              <CardDescription className="flex items-center">
                <Star className="h-4 w-4 text-secondary mr-1" />
                <span>
                  {property.rating.toFixed(2)} · {property.reviewCount} reviews
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Date picker */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 divide-x">
                    <Button
                      variant="ghost"
                      className="flex flex-col items-start p-4 h-auto rounded-none"
                      onClick={() => setCalendarOpen(true)}
                    >
                      <span className="text-xs font-medium">CHECK-IN</span>
                      <span className="text-sm">
                        {selectedDates.from ? selectedDates.from.toLocaleDateString() : "Add date"}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex flex-col items-start p-4 h-auto rounded-none"
                      onClick={() => setCalendarOpen(true)}
                    >
                      <span className="text-xs font-medium">CHECKOUT</span>
                      <span className="text-sm">
                        {selectedDates.to ? selectedDates.to.toLocaleDateString() : "Add date"}
                      </span>
                    </Button>
                  </div>
                  <div className="border-t p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium">GUESTS</span>
                        <div className="text-sm">
                          {guestCount} {guestCount === 1 ? "guest" : "guests"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          disabled={guestCount <= 1}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{guestCount}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setGuestCount(Math.min(property.maxGuests, guestCount + 1))}
                          disabled={guestCount >= property.maxGuests}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedDates.from || !selectedDates.to}
                  onClick={() => setIsBookingOpen(true)}
                >
                  {selectedDates.from && selectedDates.to ? "Reserve" : "Check availability"}
                </Button>

                {/* Price breakdown */}
                {selectedDates.from && selectedDates.to && (
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="underline">
                        ${property.price} x {nights} nights
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Taxes & fees</span>
                      <span>${taxesAndFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-semibold">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Property features highlights */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">This property offers:</h4>
                  <div className="space-y-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <div className="h-5 w-5 text-primary mr-2">{amenityIcons[amenity] || <Home />}</div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="text-sm text-primary cursor-pointer hover:underline">
                        +{property.amenities.length - 3} more amenities
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{bookingStep === 1 ? "Confirm your booking" : "Payment details"}</DialogTitle>
            <DialogDescription>
              {bookingStep === 1
                ? "Please review your booking details before proceeding."
                : "Enter your payment information to complete your booking."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit}>
            {bookingStep === 1 ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Booking Summary</h3>
                  </div>

                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </div>
                      <div className="h-16 w-16 relative rounded overflow-hidden">
                        <Image
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Dates</span>
                        <span className="text-sm font-medium">
                          {selectedDates.from?.toLocaleDateString()} - {selectedDates.to?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Guests</span>
                        <span className="text-sm font-medium">
                          {guestCount} {guestCount === 1 ? "guest" : "guests"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Guest Information</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          value={bookingInfo.name}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingInfo.email}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingInfo.phone}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Price Details</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>
                          ${property.price} x {nights} nights
                        </span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & fees</span>
                        <span>${taxesAndFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total (USD)</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Continue to Payment</Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <div className="flex justify-between mb-1">
                      <span>Total Price</span>
                      <span className="font-semibold">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Payment Method</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" placeholder="John Doe" required />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      By selecting the button below, I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setBookingStep(1)}>
                    Back
                  </Button>
                  <Button type="submit">Complete Booking</Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


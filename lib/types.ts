export interface Property {
  id: string
  title: string
  description: string
  location: string
  price: number
  bedroomCount: number
  bathroomCount: number
  maxGuests: number
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  featured?: boolean
  geoLocation?: {
    lat: number
    lng: number
  }
  host: {
    id: string
    name: string
    image: string
  }
  availability?: {
    booked: string[] // Dates in ISO format that are booked
  }
}

export interface Booking {
  id: string
  propertyId: string
  userId: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  guestInfo: {
    name: string
    email: string
    phone?: string
  }
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  photoURL?: string
  role: "user" | "admin"
}


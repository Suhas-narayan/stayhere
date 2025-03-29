export interface Property {
  _id: string
  id: string
  name: string; 
  description: string
  location: string
  price: number
  beds: number;           
  bathrooms: number;       
  guests: number;  
  amenities: string[]
  images: string[]
  ratings: number;         
  totalReviews: number; 
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
    booked: string[] 
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


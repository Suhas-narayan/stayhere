import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Suhas",
    location: "pattaya",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "We had an amazing stay at the mountain cabin. The views were breathtaking and the property was exactly as described. Can't wait to book again!",
    rating: 5,
  },
  {
    id: 2,
    name: "Darshan",
    location: "kota kinabalu",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "The beach house exceeded our expectations. It was spotlessly clean and the host was incredibly responsive. Perfect location for our family vacation.",
    rating: 5,
  },
  {
    id: 3,
    name: "Karthik",
    location: "johor bahru",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "Booking was seamless and the property was even better than the photos showed. The kitchen was well-equipped and the beds were super comfortable.",
    rating: 4,
  },
]

export default function TestimonialsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex mb-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <StarIcon key={i} className={`h-4 w-4 ${i < testimonial.rating ? "text-secondary" : "text-muted"}`} />
                ))}
            </div>

            <p className="text-muted-foreground italic">"{testimonial.testimonial}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


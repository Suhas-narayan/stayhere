import type { Property } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, MoreVertical, Star } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={property.images[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/90 rounded-full h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/properties/${property.id}`} className="w-full">
                  Edit Property
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Manage Calendar</DropdownMenuItem>
              <DropdownMenuItem>View Analytics</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Property</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-1 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {property.location}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-secondary mr-1" />
            <span>
              {property.rating.toFixed(1)}
              <span className="text-muted-foreground ml-1">({property.reviewCount})</span>
            </span>
          </div>
          <Badge variant="outline" className="font-normal">
            Active
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 text-sm mb-2">
          <div className="text-muted-foreground">
            {property.bedroomCount} beds • {property.bathroomCount} baths • {property.maxGuests} guests
          </div>
        </div>

        <div className="font-medium">
          ${property.price} <span className="text-muted-foreground font-normal">night</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/dashboard/properties/${property.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
        <Link href={`/properties/${property.id}`} target="_blank">
          <Button variant="ghost" size="sm">
            View Listing
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


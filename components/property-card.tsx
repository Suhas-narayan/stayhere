// import Link from "next/link"
// import Image from "next/image"
// import { StarIcon } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import type { Property } from "@/lib/types"

// interface PropertyCardProps {
//   property: Property
//   featured?: boolean
// }

// export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
//   const { id, title, location, price, images, rating, reviewCount, bedroomCount, bathroomCount, maxGuests } = property

//   return (
//     <Link
//       href={`/properties/${id}`}
//       className={`group block rounded-xl overflow-hidden transition-all duration-300 ${
//         featured ? "transform hover:-translate-y-1 hover:shadow-xl" : "hover:shadow-md"
//       }`}
//     >
//       {/* Image container */}
//       <div className="relative aspect-[4/3] overflow-hidden">
//         <Image
//           src={images[0] || "/placeholder.svg?height=600&width=800"}
//           alt={title}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//         />

//         {featured && <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">Featured</Badge>}
//       </div>

//       {/* Content */}
//       <div className="p-4 bg-card">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
//           <div className="flex items-center">
//             <StarIcon className="h-4 w-4 text-secondary mr-1" />
//             <span className="font-medium">
//               {rating.toFixed(1)} <span className="text-muted-foreground text-sm">({reviewCount})</span>
//             </span>
//           </div>
//         </div>

//         <p className="text-muted-foreground mb-2 flex items-center text-sm">
//           <span>{location}</span>
//         </p>

//         <div className="flex items-center text-sm text-muted-foreground gap-3 mb-3">
//           <span>
//             {bedroomCount} {bedroomCount === 1 ? "bedroom" : "bedrooms"}
//           </span>
//           <span>•</span>
//           <span>
//             {bathroomCount} {bathroomCount === 1 ? "bathroom" : "bathrooms"}
//           </span>
//           <span>•</span>
//           <span>Up to {maxGuests} guests</span>
//         </div>

//         <div className="font-semibold">
//           ${price} <span className="text-muted-foreground font-normal">night</span>
//         </div>
//       </div>
//     </Link>
//   )
// }


import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const {
    id,
    name = "Untitled Property",
    location = "Unknown Location",
    price,
    images = [],
    ratings,
    reviewCount = 0,
    beds = 0,
    bathrooms = 0,
    maxGuests = 1,
  } = property;

  const formattedPrice = price !== undefined ? `$${price}` : "N/A";
  const formattedRating = ratings !== undefined ? ratings.toFixed(1) : "No rating";

  return (
    <Link
      href={`/properties/${id}`}
      className={`group block rounded-xl overflow-hidden transition-all duration-300 ${
        featured ? "transform hover:-translate-y-1 hover:shadow-xl" : "hover:shadow-md"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={images[0] || "/placeholder.svg?height=600&width=800"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {featured && <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">Featured</Badge>}
      </div>

      {/* Content */}
      <div className="p-4 bg-card">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-secondary mr-1" />
            <span className="font-medium">
              {formattedRating} <span className="text-muted-foreground text-sm">({reviewCount})</span>
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mb-2 flex items-center text-sm">
          <span>{location}</span>
        </p>

        <div className="flex items-center text-sm text-muted-foreground gap-3 mb-3">
          <span>
            {beds} {beds === 1 ? "bed" : "beds"}
          </span>
          <span>•</span>
          <span>
            {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
          </span>
          <span>•</span>
          <span>Up to {maxGuests} guests</span>
        </div>

        <div className="font-semibold">
          {formattedPrice} <span className="text-muted-foreground font-normal">night</span>
        </div>
      </div>
    </Link>
  );
}

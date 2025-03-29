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


// import Link from "next/link";
// import Image from "next/image";
// import { StarIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import type { Property } from "@/lib/types";

// interface PropertyCardProps {
//   property: Property;
//   featured?: boolean;
// }

// export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
//   const {
//     id,
//     name = "Untitled Property",
//     location = "Unknown Location",
//     price,
//     images = [],
//     ratings,
//     reviewCount = 0,
//     beds = 0,
//     bathrooms = 0,
//     maxGuests = 1,
//   } = property;

//   const formattedPrice = price !== undefined ? `$${price}` : "N/A";
//   const formattedRating = ratings !== undefined ? ratings.toFixed(1) : "No rating";

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
//           alt={name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//         />

//         {featured && <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">Featured</Badge>}
//       </div>

//       {/* Content */}
//       <div className="p-4 bg-card">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
//           <div className="flex items-center">
//             <StarIcon className="h-4 w-4 text-secondary mr-1" />
//             <span className="font-medium">
//               {formattedRating} <span className="text-muted-foreground text-sm">({reviewCount})</span>
//             </span>
//           </div>
//         </div>

//         <p className="text-muted-foreground mb-2 flex items-center text-sm">
//           <span>{location}</span>
//         </p>

//         <div className="flex items-center text-sm text-muted-foreground gap-3 mb-3">
//           <span>
//             {beds} {beds === 1 ? "bed" : "beds"}
//           </span>
//           <span>•</span>
//           <span>
//             {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
//           </span>
//           <span>•</span>
//           <span>Up to {maxGuests} guests</span>
//         </div>

//         <div className="font-semibold">
//           {formattedPrice} <span className="text-muted-foreground font-normal">night</span>
//         </div>
//       </div>
//     </Link>
//   );
// }







import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react"; // Ensure lucide-react is installed
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/lib/types"; // Your Property type (needs update too!)

interface PropertyCardProps {
  property: Property;
  featured?: boolean; // Keep featured prop if you use it elsewhere
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  // --- Correctly get the ID ---
  const propertyId = property._id || property.id; // Use _id primarily

  // --- Destructure using ACTUAL field names from API/Model ---
  const {
    name = "Untitled Property",       // Use 'name' from API data
    location = "Unknown Location",
    price,
    images = [],
    ratings,                         // Use 'ratings' (plural) from API data
    totalReviews = 0,                // Use 'totalReviews' from API data
    beds = 0,                        // Use 'beds' from API data
    bathrooms = 0,                   // Use 'bathrooms' from API data
    guests = 1,                      // Use 'guests' from API data
  } = property;

  // --- Defensive Check ---
  if (!propertyId) {
    console.error("PropertyCard: Property is missing an _id or id.", property);
    return <div className="p-4 border rounded-lg text-destructive">Invalid Property Data (Missing ID)</div>; // Render an error indication
  }

  // --- Formatting ---
  const formattedPrice = price !== undefined ? `$${price.toLocaleString()}` : "N/A";
  // Use 'ratings' (plural) for calculation
  const formattedRating = ratings !== undefined ? ratings.toFixed(1) : "N/R";

  return (
    // --- Use the reliable propertyId in the link ---
    <Link
      href={`/properties/${propertyId}`}
      className={`group block rounded-xl overflow-hidden transition-all duration-300 border bg-card ${
        featured ? "transform hover:-translate-y-1 hover:shadow-xl shadow-md" : "hover:shadow-md"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          // Use 'name' for alt text
          src={images?.[0] || "/placeholder.svg"} // Use optional chaining for images[0]
          alt={name || 'Property image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { // Add error handling for images
            console.warn(`Image failed to load: ${images?.[0]}`);
            e.currentTarget.src = "/placeholder.svg"; // Fallback placeholder
          }}
        />

        {featured && <Badge variant="secondary" className="absolute top-3 left-3">Featured</Badge>}

         <Badge variant="default" className="absolute bottom-3 right-3">
           {formattedPrice}/night
         </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2 gap-2">
          {/* Use 'name' for the heading */}
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center flex-shrink-0 pt-1">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            {/* Use 'formattedRating' (derived from 'ratings') and 'totalReviews' */}
            <span className="font-medium text-sm">
              {formattedRating}{" "}
              <span className="text-muted-foreground">({totalReviews})</span>
            </span>
          </div>
        </div>

        {/* Use 'location' */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {location}
        </p>

        {/* Use 'beds', 'bathrooms', 'guests' */}
        <div className="flex items-center text-xs text-muted-foreground gap-2 sm:gap-3 mb-3 flex-wrap">
          <span>
            {beds} {beds === 1 ? "bed" : "beds"}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            {bathrooms} {bathrooms === 1 ? "bath" : "baths"}
          </span>
          <span className="hidden sm:inline">•</span>
           {/* Use 'guests' */}
          <span>{guests} {guests === 1 ? "guest" : "guests"}</span>
        </div>
        {/* Price is on image badge */}
      </div>
    </Link>
  );
}
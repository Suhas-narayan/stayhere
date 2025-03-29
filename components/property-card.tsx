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
  const propertyId = property._id || property.id; 

  const {
    name = "Untitled Property",      
    location = "Unknown Location",
    price,
    images = [],
    ratings,                         
    totalReviews = 0,               
    beds = 0,                       
    bathrooms = 0,                   
    guests = 1,                      
  } = property;


  if (!propertyId) {
    console.error("PropertyCard: Property is missing an _id or id.", property);
    return <div className="p-4 border rounded-lg text-destructive">Invalid Property Data (Missing ID)</div>; 
  }

  const formattedPrice = price !== undefined ? `$${price.toLocaleString()}` : "N/A";
  const formattedRating = ratings !== undefined ? ratings.toFixed(1) : "N/R";

  return (
    <Link
      href={`/properties/${propertyId}`}
      className={`group block rounded-xl overflow-hidden transition-all duration-300 border bg-card ${
        featured ? "transform hover:-translate-y-1 hover:shadow-xl shadow-md" : "hover:shadow-md"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
       
          src={images?.[0] || "/placeholder.svg"} 
          alt={name || 'Property image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { 
            console.warn(`Image failed to load: ${images?.[0]}`);
            e.currentTarget.src = "/placeholder.svg"; 
          }}
        />

        {featured && <Badge variant="secondary" className="absolute top-3 left-3">Featured</Badge>}

         <Badge variant="default" className="absolute bottom-3 right-3">
           {formattedPrice}/night
         </Badge>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2 gap-2">
         
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center flex-shrink-0 pt-1">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-medium text-sm">
              {formattedRating}{" "}
              <span className="text-muted-foreground">({totalReviews})</span>
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {location}
        </p>

        <div className="flex items-center text-xs text-muted-foreground gap-2 sm:gap-3 mb-3 flex-wrap">
          <span>
            {beds} {beds === 1 ? "bed" : "beds"}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            {bathrooms} {bathrooms === 1 ? "bath" : "baths"}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{guests} {guests === 1 ? "guest" : "guests"}</span>
        </div>
      </div>
    </Link>
  );
}
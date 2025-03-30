// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import type { Property } from "@/lib/types";

// import {
//   Bath,
//   BedDouble,
//   CalendarDays,
//   Heart,
//   Home,
//   MapPin,
//   Share2,
//   Star,
//   Users,
//   Wifi,
//   Coffee,
//   Car,
//   Tv,
//   Snowflake,
//   UtensilsCrossed,
// } from "lucide-react";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// const amenityIcons: Record<string, React.ReactNode> = {
//   "Ocean View": <Home />,
//   "Private Pool": <Bath />,
//   "Beach Access": <MapPin />,
//   "Air Conditioning": <Snowflake />,
//   "Free WiFi": <Wifi />,
//   "Full Kitchen": <UtensilsCrossed />,
//   "Washer & Dryer": <Home />,
//   "Free Parking": <Car />,
//   TV: <Tv />,
//   "Outdoor Dining Area": <UtensilsCrossed />,
//   "BBQ Grill": <UtensilsCrossed />,
//   Dishwasher: <UtensilsCrossed />,
//   Coffee: <Coffee />,
// };

// const CheckoutForm = ({ 
//   clientSecret,
//   onSuccess,
//   onBack,
//   bookingInfo,
//   propertyDetails
// }: {
//   clientSecret: string;
//   onSuccess: () => void;
//   onBack: () => void;
//   bookingInfo: {
//     email: string;
//     name: string;
//   };
//   propertyDetails: {
//     name: string;
//     dates: string;
//     amount: string;
//   };
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;
  
//     setLoading(true);
  
//     try {
//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: { return_url: `${window.location.origin}/booking-success` },
//         redirect: 'if_required'
//       });
  
//       if (error) throw error;
      
//       if (paymentIntent?.status === 'succeeded') {
//         // Send confirmation email
//         const emailResponse = await fetch('/api/send-email', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             email: bookingInfo.email,
//             propertyName: propertyDetails.name,
//             dates: propertyDetails.dates,
//             amount: propertyDetails.amount,
//             guestName: bookingInfo.name
//           }),
//         });
  
//         if (!emailResponse.ok) {
//           const errorData = await emailResponse.json();
//           throw new Error(errorData.error || 'Failed to send confirmation email');
//         }
  
//         onSuccess();
//       }
//     } catch (err: any) {
//       console.error('Payment/email error:', err);
//       toast({
//         title: "Payment Processed - Email Issue",
//         description: err.message || "Payment succeeded but email confirmation failed",
//         variant: "default",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <PaymentElement />
//         <div className="flex justify-between items-center mt-6">
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={onBack} 
//             disabled={loading}
//           >
//             Back
//           </Button>
//           <Button type="submit" disabled={!stripe || loading}>
//             {loading ? "Processing..." : "Confirm and Pay"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default function PropertyDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [property, setProperty] = useState<Property | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [calendarOpen, setCalendarOpen] = useState(false);
//   const [selectedDates, setSelectedDates] = useState<{
//     from: Date | undefined;
//     to: Date | undefined;
//   }>({
//     from: undefined,
//     to: undefined,
//   });
//   const [guestCount, setGuestCount] = useState(1);
//   const [bookingInfo, setBookingInfo] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [bookingStep, setBookingStep] = useState(1);
//   const [isBookingOpen, setIsBookingOpen] = useState(false);
//   const [imagesLoading, setImagesLoading] = useState(true);
//   const [clientSecret, setClientSecret] = useState("");

//   const propertyId = params?.id as string;

//   useEffect(() => {
//     if (!propertyId || propertyId === "undefined") {
//       console.error("Invalid property ID in URL:", propertyId);
//       toast({
//         title: "Error",
//         description: "Invalid property ID.",
//         variant: "destructive",
//       });
//       setLoading(false);
//       return;
//     }

//     const fetchProperty = async () => {
//       setLoading(true);
//       try {
//         const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${propertyId}`;
//         const response = await fetch(apiUrl);

//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error("Property not found");
//           }
//           throw new Error(`Failed to fetch property: ${response.statusText}`);
//         }

//         const data = await response.json();

//         if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
//           throw new Error("Received invalid or empty data from API");
//         }

//         setProperty(data as Property);
//         setGuestCount(1);
//       } catch (error: any) {
//         console.error("Error fetching property:", error);
//         const errorMessage = error.message?.includes("Property not found")
//           ? "The property could not be found."
//           : error.message?.includes("invalid or empty data")
//           ? "Received invalid details for this property."
//           : "Failed to load property details. Please try again.";

//         toast({
//           title: "Error Loading Property",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         setProperty(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperty();
//   }, [propertyId, toast]);

//   const nights =
//     property && selectedDates.from && selectedDates.to
//       ? Math.max(0, Math.round((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)))
//       : 0;
//   const basePrice = property?.price ?? 0;
//   const totalPrice = basePrice * nights;
//   const taxesAndFees = totalPrice * 0.15;
//   const grandTotal = totalPrice + taxesAndFees;

//   const disabledDates = (date: Date): boolean => {
//     return false;
//   };

//   const handleCreatePaymentIntent = async () => {
//     if (!property) return;

//     try {
//       const res = await fetch('/api/stripe', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: grandTotal,
//           propertyName: property.name || property.title,
//           customerEmail: bookingInfo.email
//         }),
//       });

//       const { clientSecret } = await res.json();
//       return clientSecret;
//     } catch (err: any) {
//       console.error(err);
//       toast({
//         title: "Payment Setup Failed",
//         description: err.message || "Failed to initialize payment.",
//         variant: "destructive",
//       });
//       throw err;
//     }
//   };

//   if (loading && !property) {
//     return (
//       <div className="container max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <Skeleton className="h-8 w-3/4 rounded" />
//             <Skeleton className="h-6 w-1/2 rounded" />
//             <Skeleton className="aspect-[16/9] w-full rounded-xl" />
//             <div className="grid grid-cols-5 gap-2">
//               {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
//             </div>
//             <Skeleton className="h-24 w-full rounded" />
//             <Skeleton className="h-32 w-full rounded" />
//           </div>
//           <div className="lg:col-span-1">
//             <Skeleton className="h-96 w-full rounded-xl sticky top-24" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!loading && !property) {
//     return (
//       <div className="container max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
//         <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
//         <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
//         <p className="mb-6 text-muted-foreground max-w-md">
//           The property you are looking for might have been removed, or the link is incorrect.
//         </p>
//         <Link href="/properties">
//           <Button>Browse Other Properties</Button>
//         </Link>
//       </div>
//     );
//   }

//   if (property) {
//     const maxGuests = property.guests ?? property.maxGuests ?? 1;
//     const initialImageIndex = selectedImage ? property.images.indexOf(selectedImage) : 0;

//     return (
//       <div className="container max-w-7xl mx-auto px-4 py-8">
//         {/* Property Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold mb-2">{property.name || property.title || 'Property Title'}</h1>
//           <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
//             <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
//               <div className="flex items-center">
//                 <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                 <span className="font-medium">
//                   {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'}{" "}
//                   <span className="text-muted-foreground text-sm">({property.reviewCount ?? property.totalReviews ?? 0} reviews)</span>
//                 </span>
//               </div>
//               <div className="flex items-center text-muted-foreground">
//                 <MapPin className="h-4 w-4 mr-1" />
//                 <span>{property.location}</span>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm"> <Share2 className="h-4 w-4 mr-2" /> Share </Button>
//               <Button variant="outline" size="sm"> <Heart className="h-4 w-4 mr-2" /> Save </Button>
//             </div>
//           </div>
//         </div>

//         {/* Property Images */}
//         {property.images && property.images.length > 0 ? (
//           <div className="relative mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//               <div className="md:col-span-1 aspect-[4/3] relative rounded-lg md:rounded-l-xl md:rounded-r-none overflow-hidden cursor-pointer" 
//                   onClick={() => setSelectedImage(property.images[0])}>
//                 <Image 
//                   src={property.images[0]} 
//                   alt={property.name || 'Main property image'} 
//                   fill 
//                   className="object-cover" 
//                   priority
//                   onLoad={() => setImagesLoading(false)}
//                 />
//               </div>
//               <div className="hidden md:grid grid-cols-2 gap-2 md:gap-4">
//                 {property.images.slice(1, 5).map((image, index) => (
//                   <div 
//                     key={index} 
//                     className={`aspect-[4/3] relative overflow-hidden cursor-pointer ${index === 0 ? "rounded-tr-xl" : ""} ${index === 3 ? "rounded-br-xl" : ""}`} 
//                     onClick={() => setSelectedImage(image)}
//                   >
//                     <Image 
//                       src={image} 
//                       alt={`${property.name || 'Property image'} ${index + 2}`} 
//                       fill 
//                       className="object-cover hover:opacity-90 transition-opacity" 
//                       sizes="(max-width: 768px) 50vw, 25vw" 
//                       priority={index < 2}
//                       onLoad={() => setImagesLoading(false)}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button 
//               variant="secondary" 
//               size="sm" 
//               className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-md" 
//               onClick={() => setSelectedImage(property.images[0])}
//             >
//               View all photos
//             </Button>
//           </div>
//         ) : (
//           <div className="mb-8 aspect-[16/9] bg-muted rounded-xl flex items-center justify-center">
//             <p className="text-muted-foreground">No images available</p>
//           </div>
//         )}

//         {/* Image Gallery Dialog */}
//         <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
//           <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col">
//             <DialogHeader className="px-6 pt-6 pb-2">
//               <DialogTitle>{property.name || 'Property Gallery'}</DialogTitle>
//               <DialogDescription>
//                 {property.images.length} photos available
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="flex-1 min-h-0 relative px-2 pb-6">
//               <Carousel 
//                 className="h-full w-full"
//                 opts={{ 
//                   startIndex: initialImageIndex,
//                   align: "start"
//                 }}
//               >
//                 <CarouselContent className="h-full">
//                   {property.images.map((image, index) => (
//                     <CarouselItem key={index} className="h-full pl-2">
//                       <div className="relative h-full w-full" style={{ minHeight: '500px' }}>
//                         <Image
//                           src={image}
//                           alt={`Property image ${index + 1}`}
//                           fill
//                           className="object-contain"
//                           priority={index < 3}
//                           unoptimized={process.env.NODE_ENV !== 'production'}
//                           onLoad={() => setImagesLoading(false)}
//                           onError={(e) => {
//                             console.error("Image failed to load:", image);
//                             (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
//                           }}
//                         />
//                         {imagesLoading && (
//                           <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
//                             <Skeleton className="w-full h-full" />
//                           </div>
//                         )}
//                       </div>
//                     </CarouselItem>
//                   ))}
//                 </CarouselContent>
                
//                 {property.images.length > 1 && (
//                   <>
//                     <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
//                     <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
//                   </>
//                 )}
//               </Carousel>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
//           {/* Left Column: Details */}
//           <div className="lg:col-span-2">
//              <div className="flex items-center justify-between pb-6 border-b mb-6">
//                <div>
//                  <h2 className="text-xl font-semibold">Hosted by {property.hostedBy || property.host?.name || 'Host'}</h2>
//                  <div className="text-muted-foreground mt-1 text-sm">
//                    <span>{property.beds ?? property.bedroomCount ?? 0} beds</span> •{" "}
//                    <span>{property.bathrooms ?? property.bathroomCount ?? 0} baths</span> •{" "}
//                    <span>Up to {maxGuests} guests</span>
//                  </div>
//                </div>
//                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
//                  {property.host?.image ? ( 
//                    <Image src={property.host.image} alt={property.host.name || 'Host'} fill className="object-cover" /> 
//                  ) : ( 
//                    <Users className="h-6 w-6 text-muted-foreground" /> 
//                  )}
//                </div>
//              </div>

//              <div className="py-6 border-b">
//                <h3 className="text-xl font-semibold mb-4">About this place</h3>
//                <div className="text-muted-foreground whitespace-pre-line prose prose-sm max-w-none"> 
//                  {property.description || "No description provided."} 
//                </div>
//              </div>

//              <div className="py-6 border-b">
//                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
//                {property.amenities && property.amenities.length > 0 ? (
//                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
//                    {property.amenities.map((amenity) => (
//                      <div key={amenity} className="flex items-center gap-3 text-sm"> 
//                        <div className="h-5 w-5 text-primary flex items-center justify-center flex-shrink-0"> 
//                          {amenityIcons[amenity] || <Home size={18}/>} 
//                        </div> 
//                        <span>{amenity}</span> 
//                      </div>
//                    ))}
//                  </div>
//                ) : ( 
//                  <p className="text-muted-foreground text-sm">No specific amenities listed.</p> 
//                )}
//              </div>

//              <div className="py-6 border-b">
//                <h3 className="text-xl font-semibold mb-4">Availability</h3>
//                <p className="mb-4 text-muted-foreground text-sm">Select check-in and check-out dates.</p>
//                <Button 
//                  variant="outline" 
//                  onClick={() => setCalendarOpen(!calendarOpen)} 
//                  className="mb-4 w-full sm:w-auto justify-start text-left font-normal" 
//                >
//                  <CalendarDays className="h-4 w-4 mr-2" />
//                  <span> 
//                    {selectedDates.from ? (
//                      selectedDates.to ? 
//                        `${selectedDates.from.toLocaleDateString()} - ${selectedDates.to.toLocaleDateString()}` 
//                        : selectedDates.from.toLocaleDateString()
//                    ) : "Select your dates"} 
//                  </span>
//                </Button>
//                {calendarOpen && (
//                  <div className="my-4 p-1 border rounded-lg flex justify-center bg-card">
//                    <Calendar 
//                      mode="range" 
//                      selected={selectedDates} 
//                      onSelect={(range) => setSelectedDates(range || { from: undefined, to: undefined })} 
//                      numberOfMonths={1} 
//                      disabled={disabledDates} 
//                      fromDate={new Date()} 
//                    />
//                  </div>
//                )}
//              </div>

//             <div className="py-6">
//               <Tabs defaultValue="reviews" className="w-full">
//                 <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto">
//                   <TabsTrigger value="reviews">Reviews</TabsTrigger>
//                   <TabsTrigger value="location">Location</TabsTrigger>
//                   <TabsTrigger value="policies">Policies</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="reviews">
//                   <div className="space-y-6">
//                     <div className="flex items-center gap-4 flex-wrap">
//                       <div className="flex items-center"> 
//                         <Star className="h-5 w-5 text-yellow-400 mr-2" /> 
//                         <span className="text-xl font-semibold">
//                           {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'}
//                         </span> 
//                       </div>
//                       <span className="text-xl font-semibold">•</span>
//                       <span className="text-xl font-semibold">
//                         {property.reviewCount ?? property.totalReviews ?? 0} reviews
//                       </span>
//                     </div>
//                     <p className="text-muted-foreground text-sm">Detailed reviews are not available in this section.</p>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="location">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Location</h3>
//                     <p className="text-muted-foreground">{property.location}</p>
//                     <div className="aspect-[16/9] bg-muted rounded-xl relative overflow-hidden"> 
//                       <div className="absolute inset-0 flex items-center justify-center"> 
//                         <p className="text-muted-foreground">Map view placeholder</p> 
//                       </div> 
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="policies">
//                   <div className="space-y-6 text-sm">
//                     <div> 
//                       <h3 className="text-lg font-semibold mb-2">House Rules</h3> 
//                       <ul className="list-disc pl-5 text-muted-foreground space-y-1"> 
//                         <li>Check-in: After 4:00 PM (example)</li> 
//                         <li>Checkout: Before 11:00 AM (example)</li> 
//                         <li>No smoking</li> 
//                         <li>No pets (example)</li> 
//                       </ul> 
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>

//           {/* Right Column: Booking Card */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24 shadow-lg border bg-card">
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-baseline"> 
//                   <span className="text-2xl font-bold">${property.price?.toLocaleString() ?? 'N/A'}</span> 
//                   <span className="text-base font-normal text-muted-foreground">/ night</span> 
//                 </CardTitle>
//                 <CardDescription className="flex items-center pt-1"> 
//                   <Star className="h-4 w-4 text-yellow-400 mr-1" /> 
//                   <span> 
//                     {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'} · {property.reviewCount ?? property.totalReviews ?? 0} reviews 
//                   </span> 
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="border rounded-lg overflow-hidden">
//                     <button 
//                       onClick={() => setCalendarOpen(!calendarOpen)} 
//                       className="grid grid-cols-2 divide-x w-full text-left hover:bg-muted/50 transition-colors" 
//                       aria-label="Select check-in and check-out dates"
//                     >
//                       <div className="p-3"> 
//                         <span className="text-xs font-bold tracking-wider text-muted-foreground block mb-1 uppercase">Check-in</span> 
//                         <span className="text-sm">
//                           {selectedDates.from ? selectedDates.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Add date"}
//                         </span> 
//                       </div>
//                       <div className="p-3"> 
//                         <span className="text-xs font-bold tracking-wider text-muted-foreground block mb-1 uppercase">Checkout</span> 
//                         <span className="text-sm">
//                           {selectedDates.to ? selectedDates.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Add date"}
//                         </span> 
//                       </div>
//                     </button>
//                     <div className="border-t p-3">
//                       <Label htmlFor="guest-selector-button-decrease" className="text-xs font-bold tracking-wider text-muted-foreground block mb-2 uppercase">
//                         Guests
//                       </Label>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">{guestCount} {guestCount === 1 ? "guest" : "guests"}</span>
//                         <div className="flex items-center gap-2">
//                           <Button 
//                             id="guest-selector-button-decrease" 
//                             variant="outline" 
//                             size="icon" 
//                             className="h-8 w-8 rounded-full" 
//                             onClick={() => setGuestCount(count => Math.max(1, count - 1))} 
//                             disabled={guestCount <= 1} 
//                             aria-label="Decrease guest count"
//                           > 
//                             - 
//                           </Button>
//                           <span className="w-6 text-center font-medium" aria-live="polite">
//                             {guestCount}
//                           </span>
//                           <Button 
//                             id="guest-selector-button-increase" 
//                             variant="outline" 
//                             size="icon" 
//                             className="h-8 w-8 rounded-full" 
//                             onClick={() => setGuestCount(count => Math.min(maxGuests, count + 1))} 
//                             disabled={guestCount >= maxGuests} 
//                             aria-label="Increase guest count"
//                           > 
//                             + 
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <Button 
//                     className="w-full text-lg h-12 font-semibold" 
//                     size="lg" 
//                     disabled={!selectedDates.from || !selectedDates.to || loading} 
//                     onClick={() => setIsBookingOpen(true)}
//                   > 
//                     {loading ? "Loading..." : (selectedDates.from && selectedDates.to ? "Reserve" : "Check availability")} 
//                   </Button>
//                   {nights > 0 && basePrice > 0 ? (
//                     <div className="space-y-2 text-sm"> 
//                       <p className="text-center text-muted-foreground text-xs">You won't be charged yet</p> 
//                       <div className="flex justify-between"> 
//                         <span className="underline cursor-default">${basePrice.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}</span> 
//                         <span>${totalPrice.toFixed(2)}</span> 
//                       </div> 
//                       <div className="flex justify-between"> 
//                         <span className="underline cursor-default">Taxes & fees (est.)</span> 
//                         <span>${taxesAndFees.toFixed(2)}</span> 
//                       </div> 
//                       <div className="flex justify-between border-t pt-3 mt-2 font-semibold text-base"> 
//                         <span>Total</span> 
//                         <span>${grandTotal.toFixed(2)}</span> 
//                       </div> 
//                     </div>
//                   ) : ( 
//                     <p className="text-center text-sm text-muted-foreground pt-2">Select dates to see price</p> 
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Booking Dialog */}
//         <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
//           <DialogContent className="sm:max-w-[520px]">
//             <DialogHeader>
//               <DialogTitle>
//                 {bookingStep === 1 ? 'Confirm Your Booking' : 'Payment Information'}
//               </DialogTitle>
//               <DialogDescription>
//                 {bookingStep === 1 
//                   ? 'Please review your booking details' 
//                   : 'Enter your payment details to complete your reservation'}
//               </DialogDescription>
//             </DialogHeader>
            
//             {bookingStep === 1 ? (
//               <form onSubmit={async (e) => {
//                 e.preventDefault();
//                 if (!property) return;

//                 // Validate form
//                 if (!bookingInfo.name || !bookingInfo.email) {
//                   toast({ 
//                     title: "Missing Information", 
//                     description: "Please enter your name and email.", 
//                     variant: "destructive" 
//                   });
//                   return;
//                 }
//                 if (!/\S+@\S+\.\S+/.test(bookingInfo.email)) {
//                   toast({ 
//                     title: "Invalid Email", 
//                     description: "Please enter a valid email address.", 
//                     variant: "destructive" 
//                   });
//                   return;
//                 }

//                 try {
//                   const secret = await handleCreatePaymentIntent();
//                   setClientSecret(secret);
//                   setBookingStep(2);
//                 } catch (err) {
//                   console.error("Failed to create payment intent:", err);
//                 }
//               }}>
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-4 rounded-lg border p-4"> 
//                     <div className="relative h-20 w-24 rounded-md overflow-hidden flex-shrink-0"> 
//                       {property.images && property.images.length > 0 && ( 
//                         <Image src={property.images[0]} alt={property.name || 'Property'} fill className="object-cover"/> 
//                       )} 
//                     </div> 
//                     <div> 
//                       <p className="font-semibold">{property.name || property.title}</p> 
//                       <p className="text-sm text-muted-foreground">{property.location}</p> 
//                       <p className="text-sm text-muted-foreground mt-1"> 
//                         {selectedDates.from?.toLocaleDateString()} - {selectedDates.to?.toLocaleDateString()} • {guestCount} {guestCount === 1 ? 'guest' : 'guests'} 
//                       </p> 
//                     </div> 
//                   </div>
//                   <div className="space-y-3">
//                     <h3 className="font-medium text-lg">Your Information</h3>
//                     <div className="space-y-2"> 
//                       <Label htmlFor="booking-name">Full name</Label> 
//                       <Input 
//                         id="booking-name" 
//                         value={bookingInfo.name} 
//                         onChange={(e) => setBookingInfo({ ...bookingInfo, name: e.target.value })} 
//                         required 
//                       /> 
//                     </div> 
//                     <div className="space-y-2"> 
//                       <Label htmlFor="booking-email">Email address</Label> 
//                       <Input 
//                         id="booking-email" 
//                         type="email" 
//                         value={bookingInfo.email} 
//                         onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })} 
//                         required 
//                       /> 
//                     </div> 
//                     <div className="space-y-2"> 
//                       <Label htmlFor="booking-phone">Phone number <span className="text-muted-foreground">(optional)</span></Label> 
//                       <Input 
//                         id="booking-phone" 
//                         type="tel" 
//                         value={bookingInfo.phone} 
//                         onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })} 
//                       /> 
//                     </div>
//                   </div>
//                   <div className="space-y-2 border-t pt-4"> 
//                     <h3 className="font-medium text-lg">Price Details</h3> 
//                     <div className="flex justify-between text-sm">
//                       <span>${basePrice.toLocaleString()} x {nights} nights</span>
//                       <span>${totalPrice.toFixed(2)}</span>
//                     </div> 
//                     <div className="flex justify-between text-sm">
//                       <span>Taxes & fees (est.)</span>
//                       <span>${taxesAndFees.toFixed(2)}</span>
//                     </div> 
//                     <div className="flex justify-between font-semibold pt-2 mt-1 border-t">
//                       <span>Total</span>
//                       <span>${grandTotal.toFixed(2)}</span>
//                     </div> 
//                   </div>
//                   <div className="flex justify-end">
//                     <Button type="submit" disabled={loading}> 
//                       {loading ? "Processing..." : "Continue to Payment"} 
//                     </Button> 
//                   </div>
//                 </div>
//               </form>
//             ) : clientSecret ? (
//               <Elements 
//                 stripe={stripePromise} 
//                 options={{ 
//                   clientSecret,
//                   appearance: {
//                     theme: 'stripe',
//                   }
//                 }}
//               >
//                 {/* <CheckoutForm 
//                   clientSecret={clientSecret}
//                   onSuccess={async () => {
//                     toast({
//                       title: "Booking Confirmed!",
//                       description: `Your reservation for ${property.name || property.title} is confirmed. A confirmation email has been sent to ${bookingInfo.email}.`,
//                       variant: "success",
//                     });
//                     setIsBookingOpen(false);
//                     setBookingStep(1);
//                     setSelectedDates({ from: undefined, to: undefined });
//                     setBookingInfo({ name: "", email: "", phone: "" });
//                     setClientSecret("");
//                     router.push(`/booking-success?property=${encodeURIComponent(property.name || property.title || '')}`);
//                   }}
//                   onBack={() => setBookingStep(1)}
//                   bookingInfo={{
//                     email: bookingInfo.email,
//                     name: bookingInfo.name
//                   }}
//                   propertyDetails={{
//                     name: property?.name || property?.title || 'Property',
//                     dates: `${selectedDates.from?.toLocaleDateString()} - ${selectedDates.to?.toLocaleDateString()}`,
//                     amount: grandTotal.toFixed(2)
//                   }}
//                 /> */}


// <CheckoutForm 
//   clientSecret={clientSecret}
//   onSuccess={async () => {
//     toast({
//       title: "Booking Confirmed!",
//       description: `Your reservation for ${property.name || property.title} is confirmed. A confirmation email has been sent to ${bookingInfo.email}.`,
//       variant: "success",
//     });
//     setIsBookingOpen(false);
//     setBookingStep(1);
//     setSelectedDates({ from: undefined, to: undefined });
//     setBookingInfo({ name: "", email: "", phone: "" });
//     setClientSecret("");
//     router.push(`/booking-success?property=${encodeURIComponent(property.name || property.title || '')}`);
//   }}
//   onBack={() => setBookingStep(1)}
//   bookingInfo={{
//     email: bookingInfo.email,
//     name: bookingInfo.name
//   }}
//   propertyDetails={{
//     name: property?.name || property?.title || 'Property',
//     dates: `${selectedDates.from?.toLocaleDateString()} - ${selectedDates.to?.toLocaleDateString()}`,
//     amount: grandTotal.toFixed(2)
//   }}
// />


//               </Elements>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-8">
//                 <p className="text-muted-foreground mb-4">Loading payment form...</p>
//                 <Button variant="outline" onClick={() => setBookingStep(1)}>
//                   Back to Booking Details
//                 </Button>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     );
//   }

//   return (
//     <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
//       <p>Something went wrong loading the property.</p>
//       <Link href="/properties">
//         <Button variant="link">Go back</Button>
//       </Link>
//     </div>
//   );
// }






"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Property } from "@/lib/types";

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
} from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
};

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    date: "March 2024",
    rating: 5,
    comment: "Absolutely stunning property! The ocean view was breathtaking and the amenities were top-notch. Would definitely stay here again.",
    avatar: "/avatars/sarah.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    date: "February 2024",
    rating: 4,
    comment: "Great location and very comfortable stay. The host was extremely responsive and helpful. Only minor issue was the wifi was a bit slow at times.",
    avatar: "/avatars/michael.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    date: "January 2024",
    rating: 5,
    comment: "Perfect vacation rental! The property was even better than the photos. Everything was clean and well-maintained. Loved the private pool!",
    avatar: "/avatars/emily.jpg"
  }
];

const CheckoutForm = ({ 
  clientSecret,
  onSuccess,
  onBack,
  bookingInfo,
  propertyDetails
}: {
  clientSecret: string;
  onSuccess: () => void;
  onBack: () => void;
  bookingInfo: {
    email: string;
    name: string;
  };
  propertyDetails: {
    name: string;
    dates: string;
    amount: string;
  };
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
  
    setLoading(true);
  
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/booking-success` },
        redirect: 'if_required'
      });
  
      if (error) throw error;
      
      if (paymentIntent?.status === 'succeeded') {
        // Send confirmation email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: bookingInfo.email,
            propertyName: propertyDetails.name,
            dates: propertyDetails.dates,
            amount: propertyDetails.amount,
            guestName: bookingInfo.name
          }),
        });
  
        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          throw new Error(errorData.error || 'Failed to send confirmation email');
        }
  
        onSuccess();
      }
    } catch (err: any) {
      console.error('Payment/email error:', err);
      toast({
        title: "Payment Processed - Email Issue",
        description: err.message || "Payment succeeded but email confirmation failed",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement />
        <div className="flex justify-between items-center mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            disabled={loading}
          >
            Back
          </Button>
          <Button type="submit" disabled={!stripe || loading}>
            {loading ? "Processing..." : "Confirm and Pay"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guestCount, setGuestCount] = useState(1);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingStep, setBookingStep] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const propertyId = params?.id as string;

  useEffect(() => {
    if (!propertyId || propertyId === "undefined") {
      console.error("Invalid property ID in URL:", propertyId);
      toast({
        title: "Error",
        description: "Invalid property ID.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${propertyId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Property not found");
          }
          throw new Error(`Failed to fetch property: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
          throw new Error("Received invalid or empty data from API");
        }

        // Ensure amenities exist in the data
        const propertyWithAmenities = {
          ...data,
          amenities: data.amenities || [
            "Air Conditioning",
            "Free WiFi",
            "Full Kitchen",
            "Washer & Dryer",
            "Free Parking",
            "TV"
          ]
        };

        setProperty(propertyWithAmenities as Property);
        setGuestCount(1);
      } catch (error: any) {
        console.error("Error fetching property:", error);
        const errorMessage = error.message?.includes("Property not found")
          ? "The property could not be found."
          : error.message?.includes("invalid or empty data")
          ? "Received invalid details for this property."
          : "Failed to load property details. Please try again.";

        toast({
          title: "Error Loading Property",
          description: errorMessage,
          variant: "destructive",
        });
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, toast]);

  const nights =
    property && selectedDates.from && selectedDates.to
      ? Math.max(0, Math.round((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
  const basePrice = property?.price ?? 0;
  const totalPrice = basePrice * nights;
  const taxesAndFees = totalPrice * 0.15;
  const grandTotal = totalPrice + taxesAndFees;

  const disabledDates = (date: Date): boolean => {
    return false;
  };

  const handleCreatePaymentIntent = async () => {
    if (!property) return;

    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          propertyName: property.name || property.title,
          customerEmail: bookingInfo.email
        }),
      });

      const { clientSecret } = await res.json();
      return clientSecret;
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Payment Setup Failed",
        description: err.message || "Failed to initialize payment.",
        variant: "destructive",
      });
      throw err;
    }
  };

  if (loading && !property) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="aspect-[16/9] w-full rounded-xl" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-32 w-full rounded" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-xl sticky top-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !property) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-6 text-muted-foreground max-w-md">
          The property you are looking for might have been removed, or the link is incorrect.
        </p>
        <Link href="/properties">
          <Button>Browse Other Properties</Button>
        </Link>
      </div>
    );
  }

  if (property) {
    const maxGuests = property.guests ?? property.maxGuests ?? 1;
    const initialImageIndex = selectedImage ? property.images.indexOf(selectedImage) : 0;

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Property Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name || property.title || 'Property Title'}</h1>
          <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">
                  {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'}{" "}
                  <span className="text-muted-foreground text-sm">({property.reviewCount ?? property.totalReviews ?? 0} reviews)</span>
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"> <Share2 className="h-4 w-4 mr-2" /> Share </Button>
              <Button variant="outline" size="sm"> <Heart className="h-4 w-4 mr-2" /> Save </Button>
            </div>
          </div>
        </div>

        {/* Property Images */}
        {property.images && property.images.length > 0 ? (
          <div className="relative mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="md:col-span-1 aspect-[4/3] relative rounded-lg md:rounded-l-xl md:rounded-r-none overflow-hidden cursor-pointer" 
                  onClick={() => setSelectedImage(property.images[0])}>
                <Image 
                  src={property.images[0]} 
                  alt={property.name || 'Main property image'} 
                  fill 
                  className="object-cover" 
                  priority
                  onLoad={() => setImagesLoading(false)}
                />
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2 md:gap-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className={`aspect-[4/3] relative overflow-hidden cursor-pointer ${index === 0 ? "rounded-tr-xl" : ""} ${index === 3 ? "rounded-br-xl" : ""}`} 
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image 
                      src={image} 
                      alt={`${property.name || 'Property image'} ${index + 2}`} 
                      fill 
                      className="object-cover hover:opacity-90 transition-opacity" 
                      sizes="(max-width: 768px) 50vw, 25vw" 
                      priority={index < 2}
                      onLoad={() => setImagesLoading(false)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-md" 
              onClick={() => setSelectedImage(property.images[0])}
            >
              View all photos
            </Button>
          </div>
        ) : (
          <div className="mb-8 aspect-[16/9] bg-muted rounded-xl flex items-center justify-center">
            <p className="text-muted-foreground">No images available</p>
          </div>
        )}

        {/* Image Gallery Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle>{property.name || 'Property Gallery'}</DialogTitle>
              <DialogDescription>
                {property.images.length} photos available
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 min-h-0 relative px-2 pb-6">
              <Carousel 
                className="h-full w-full"
                opts={{ 
                  startIndex: initialImageIndex,
                  align: "start"
                }}
              >
                <CarouselContent className="h-full">
                  {property.images.map((image, index) => (
                    <CarouselItem key={index} className="h-full pl-2">
                      <div className="relative h-full w-full" style={{ minHeight: '500px' }}>
                        <Image
                          src={image}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index < 3}
                          unoptimized={process.env.NODE_ENV !== 'production'}
                          onLoad={() => setImagesLoading(false)}
                          onError={(e) => {
                            console.error("Image failed to load:", image);
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                        {imagesLoading && (
                          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                            <Skeleton className="w-full h-full" />
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {property.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                  </>
                )}
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
             <div className="flex items-center justify-between pb-6 border-b mb-6">
               <div>
                 <h2 className="text-xl font-semibold">Hosted by {property.hostedBy || property.host?.name || 'Host'}</h2>
                 <div className="text-muted-foreground mt-1 text-sm">
                   <span>{property.beds ?? property.bedroomCount ?? 0} beds</span> •{" "}
                   <span>{property.bathrooms ?? property.bathroomCount ?? 0} baths</span> •{" "}
                   <span>Up to {maxGuests} guests</span>
                 </div>
               </div>
               <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                 {property.host?.image ? ( 
                   <Image src={property.host.image} alt={property.host.name || 'Host'} fill className="object-cover" /> 
                 ) : ( 
                   <Users className="h-6 w-6 text-muted-foreground" /> 
                 )}
               </div>
             </div>

             <div className="py-6 border-b">
               <h3 className="text-xl font-semibold mb-4">About this place</h3>
               <div className="text-muted-foreground whitespace-pre-line prose prose-sm max-w-none"> 
                 {property.description || "No description provided."} 
               </div>
             </div>

             <div className="py-6 border-b">
               <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
               {property.amenities && property.amenities.length > 0 ? (
                 <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                   {property.amenities.map((amenity) => (
                     <div key={amenity} className="flex items-center gap-3 text-sm"> 
                       <div className="h-5 w-5 text-primary flex items-center justify-center flex-shrink-0"> 
                         {amenityIcons[amenity] || <Home size={18}/>} 
                       </div> 
                       <span>{amenity}</span> 
                     </div>
                   ))}
                 </div>
               ) : ( 
                 <p className="text-muted-foreground text-sm">No specific amenities listed.</p> 
               )}
             </div>

             <div className="py-6 border-b">
               <h3 className="text-xl font-semibold mb-4">Availability</h3>
               <p className="mb-4 text-muted-foreground text-sm">Select check-in and check-out dates.</p>
               <Button 
                 variant="outline" 
                 onClick={() => setCalendarOpen(!calendarOpen)} 
                 className="mb-4 w-full sm:w-auto justify-start text-left font-normal" 
               >
                 <CalendarDays className="h-4 w-4 mr-2" />
                 <span> 
                   {selectedDates.from ? (
                     selectedDates.to ? 
                       `${selectedDates.from.toLocaleDateString()} - ${selectedDates.to.toLocaleDateString()}` 
                       : selectedDates.from.toLocaleDateString()
                   ) : "Select your dates"} 
                 </span>
               </Button>
               {calendarOpen && (
                 <div className="my-4 p-1 border rounded-lg flex justify-center bg-card">
                   <Calendar 
                     mode="range" 
                     selected={selectedDates} 
                     onSelect={(range) => setSelectedDates(range || { from: undefined, to: undefined })} 
                     numberOfMonths={1} 
                     disabled={disabledDates} 
                     fromDate={new Date()} 
                   />
                 </div>
               )}
             </div>

            <div className="py-6">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center"> 
                        <Star className="h-5 w-5 text-yellow-400 mr-2" /> 
                        <span className="text-xl font-semibold">
                          {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'}
                        </span> 
                      </div>
                      <span className="text-xl font-semibold">•</span>
                      <span className="text-xl font-semibold">
                        {property.reviewCount ?? property.totalReviews ?? 0} reviews
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                              {review.avatar ? (
                                <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                              ) : (
                                <Users className="h-5 w-5 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{review.name}</h4>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="location">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <p className="text-muted-foreground">{property.location}</p>
                    <div className="aspect-[16/9] bg-muted rounded-xl relative overflow-hidden"> 
                      <div className="absolute inset-0 flex items-center justify-center"> 
                        <p className="text-muted-foreground">Map view placeholder</p> 
                      </div> 
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="policies">
                  <div className="space-y-6 text-sm">
                    <div> 
                      <h3 className="text-lg font-semibold mb-2">House Rules</h3> 
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1"> 
                        <li>Check-in: After 4:00 PM (example)</li> 
                        <li>Checkout: Before 11:00 AM (example)</li> 
                        <li>No smoking</li> 
                        <li>No pets (example)</li> 
                      </ul> 
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border bg-card">
              <CardHeader>
                <CardTitle className="flex justify-between items-baseline"> 
                  <span className="text-2xl font-bold">${property.price?.toLocaleString() ?? 'N/A'}</span> 
                  <span className="text-base font-normal text-muted-foreground">/ night</span> 
                </CardTitle>
                <CardDescription className="flex items-center pt-1"> 
                  <Star className="h-4 w-4 text-yellow-400 mr-1" /> 
                  <span> 
                    {(property.rating ?? property.ratings)?.toFixed(1) ?? 'N/R'} · {property.reviewCount ?? property.totalReviews ?? 0} reviews 
                  </span> 
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setCalendarOpen(!calendarOpen)} 
                      className="grid grid-cols-2 divide-x w-full text-left hover:bg-muted/50 transition-colors" 
                      aria-label="Select check-in and check-out dates"
                    >
                      <div className="p-3"> 
                        <span className="text-xs font-bold tracking-wider text-muted-foreground block mb-1 uppercase">Check-in</span> 
                        <span className="text-sm">
                          {selectedDates.from ? selectedDates.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Add date"}
                        </span> 
                      </div>
                      <div className="p-3"> 
                        <span className="text-xs font-bold tracking-wider text-muted-foreground block mb-1 uppercase">Checkout</span> 
                        <span className="text-sm">
                          {selectedDates.to ? selectedDates.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Add date"}
                        </span> 
                      </div>
                    </button>
                    <div className="border-t p-3">
                      <Label htmlFor="guest-selector-button-decrease" className="text-xs font-bold tracking-wider text-muted-foreground block mb-2 uppercase">
                        Guests
                      </Label>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{guestCount} {guestCount === 1 ? "guest" : "guests"}</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            id="guest-selector-button-decrease" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full" 
                            onClick={() => setGuestCount(count => Math.max(1, count - 1))} 
                            disabled={guestCount <= 1} 
                            aria-label="Decrease guest count"
                          > 
                            - 
                          </Button>
                          <span className="w-6 text-center font-medium" aria-live="polite">
                            {guestCount}
                          </span>
                          <Button 
                            id="guest-selector-button-increase" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full" 
                            onClick={() => setGuestCount(count => Math.min(maxGuests, count + 1))} 
                            disabled={guestCount >= maxGuests} 
                            aria-label="Increase guest count"
                          > 
                            + 
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full text-lg h-12 font-semibold" 
                    size="lg" 
                    disabled={!selectedDates.from || !selectedDates.to || loading} 
                    onClick={() => setIsBookingOpen(true)}
                  > 
                    {loading ? "Loading..." : (selectedDates.from && selectedDates.to ? "Reserve" : "Check availability")} 
                  </Button>
                  {nights > 0 && basePrice > 0 ? (
                    <div className="space-y-2 text-sm"> 
                      <p className="text-center text-muted-foreground text-xs">You won't be charged yet</p> 
                      <div className="flex justify-between"> 
                        <span className="underline cursor-default">${basePrice.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}</span> 
                        <span>${totalPrice.toFixed(2)}</span> 
                      </div> 
                      <div className="flex justify-between"> 
                        <span className="underline cursor-default">Taxes & fees (est.)</span> 
                        <span>${taxesAndFees.toFixed(2)}</span> 
                      </div> 
                      <div className="flex justify-between border-t pt-3 mt-2 font-semibold text-base"> 
                        <span>Total</span> 
                        <span>${grandTotal.toFixed(2)}</span> 
                      </div> 
                    </div>
                  ) : ( 
                    <p className="text-center text-sm text-muted-foreground pt-2">Select dates to see price</p> 
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>
                {bookingStep === 1 ? 'Confirm Your Booking' : 'Payment Information'}
              </DialogTitle>
              <DialogDescription>
                {bookingStep === 1 
                  ? 'Please review your booking details' 
                  : 'Enter your payment details to complete your reservation'}
              </DialogDescription>
            </DialogHeader>
            
            {bookingStep === 1 ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!property) return;

                // Validate form
                if (!bookingInfo.name || !bookingInfo.email) {
                  toast({ 
                    title: "Missing Information", 
                    description: "Please enter your name and email.", 
                    variant: "destructive" 
                  });
                  return;
                }
                if (!/\S+@\S+\.\S+/.test(bookingInfo.email)) {
                  toast({ 
                    title: "Invalid Email", 
                    description: "Please enter a valid email address.", 
                    variant: "destructive" 
                  });
                  return;
                }

                try {
                  const secret = await handleCreatePaymentIntent();
                  setClientSecret(secret);
                  setBookingStep(2);
                } catch (err) {
                  console.error("Failed to create payment intent:", err);
                }
              }}>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4"> 
                    <div className="relative h-20 w-24 rounded-md overflow-hidden flex-shrink-0"> 
                      {property.images && property.images.length > 0 && ( 
                        <Image src={property.images[0]} alt={property.name || 'Property'} fill className="object-cover"/> 
                      )} 
                    </div> 
                    <div> 
                      <p className="font-semibold">{property.name || property.title}</p> 
                      <p className="text-sm text-muted-foreground">{property.location}</p> 
                      <p className="text-sm text-muted-foreground mt-1"> 
                        {selectedDates.from?.toLocaleDateString()} - {selectedDates.to?.toLocaleDateString()} • {guestCount} {guestCount === 1 ? 'guest' : 'guests'} 
                      </p> 
                    </div> 
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">Your Information</h3>
                    <div className="space-y-2"> 
                      <Label htmlFor="booking-name">Full name</Label> 
                      <Input 
                        id="booking-name" 
                        value={bookingInfo.name} 
                        onChange={(e) => setBookingInfo({ ...bookingInfo, name: e.target.value })} 
                        required 
                      /> 
                    </div> 
                    <div className="space-y-2"> 
                      <Label htmlFor="booking-email">Email address</Label> 
                      <Input 
                        id="booking-email" 
                        type="email" 
                        value={bookingInfo.email} 
                        onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })} 
                        required 
                      /> 
                    </div> 
                    <div className="space-y-2"> 
                      <Label htmlFor="booking-phone">Phone number <span className="text-muted-foreground">(optional)</span></Label> 
                      <Input 
                        id="booking-phone" 
                        type="tel" 
                        value={bookingInfo.phone} 
                        onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })} 
                      /> 
                    </div>
                  </div>
                  <div className="space-y-2 border-t pt-4"> 
                    <h3 className="font-medium text-lg">Price Details</h3> 
                    <div className="flex justify-between text-sm">
                      <span>${basePrice.toLocaleString()} x {nights} nights</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div> 
                    <div className="flex justify-between text-sm">
                      <span>Taxes & fees (est.)</span>
                      <span>${taxesAndFees.toFixed(2)}</span>
                    </div> 
                    <div className="flex justify-between font-semibold pt-2 mt-1 border-t">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div> 
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}> 
                      {loading ? "Processing..." : "Continue to Payment"} 
                    </Button> 
                  </div>
                </div>
              </form>
            ) : clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  }
                }}
              >
                <CheckoutForm 
                  clientSecret={clientSecret}
                  onSuccess={async () => {
                    toast({
                      title: "Booking Confirmed!",
                      description: `Your reservation for ${property.name || property.title} is confirmed. A confirmation email has been sent to ${bookingInfo.email}.`,
                      variant: "success",
                    });
                    setIsBookingOpen(false);
                    setBookingStep(1);
                    setSelectedDates({ from: undefined, to: undefined });
                    setBookingInfo({ name: "", email: "", phone: "" });
                    setClientSecret("");
                    router.push(`/booking-success?property=${encodeURIComponent(property.name || property.title || '')}`);
                  }}
                  onBack={() => setBookingStep(1)}
                  bookingInfo={{
                    email: bookingInfo.email,
                    name: bookingInfo.name
                  }}
                  propertyDetails={{
                    name: property?.name || property?.title || 'Property',
                    dates: `${selectedDates.from?.toLocaleDateString()} - ${selectedDates.to?.toLocaleDateString()}`,
                    amount: grandTotal.toFixed(2)
                  }}
                />
              </Elements>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">Loading payment form...</p>
                <Button variant="outline" onClick={() => setBookingStep(1)}>
                  Back to Booking Details
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
      <p>Something went wrong loading the property.</p>
      <Link href="/properties">
        <Button variant="link">Go back</Button>
      </Link>
    </div>
  );
}
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { AlertCircle, Loader2 } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// export default function PropertyManager() {
//   const [properties, setProperties] = useState([]);
//   const [editingProperty, setEditingProperty] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const fileInputRef = useRef(null);
  
//   const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   async function fetchProperties() {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const res = await axios.get(`${API_URL}/api/products`);
//       const cleanedProperties = res.data.map(property => ({
//         ...property,
//         amenities: Array.isArray(property.amenities) 
//           ? property.amenities.map(amenity => amenity.replace(/["\[\]]/g, '').trim())
//           : []
//       }));
//       setProperties(cleanedProperties);
//     } catch (error) {
//       console.error("Error fetching properties", error);
//       setError("Failed to load properties. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const filesArray = Array.from(e.target.files);
//       setSelectedFiles(filesArray);
//     }
//   };

//   async function onSubmit(data) {
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     const formData = new FormData();

//     // Append all basic fields
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("price", data.price);
//     formData.append("location", data.location);
//     formData.append("beds", data.beds);
//     formData.append("bathrooms", data.bathrooms);
//     formData.append("guests", data.guests);
//     formData.append("hostedBy", data.hostedBy);
//     formData.append("ratings", data.ratings);
//     formData.append("totalReviews", data.totalReviews);

//     // Handle amenities - convert to JSON string
//     if (data.amenities) {
//         const amenitiesArray = data.amenities
//           .split(',')
//           .map(item => item.trim())
//           .filter(item => item)
//           .map(item => item.replace(/"/g, '')); // Clean any quotes
//         formData.append("amenities", JSON.stringify(amenitiesArray));
//       }

//     // Handle availableDates - convert to JSON string
//     if (data.availableDates) {
//       const datesArray = data.availableDates.split(',').map(item => item.trim()).filter(item => item);
//       formData.append("availableDates", JSON.stringify(datesArray));
//     }

//     // Append files
//     if (selectedFiles.length > 0) {
//       selectedFiles.forEach(file => {
//         formData.append("images", file);
//       });
//     }

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       if (editingProperty) {
//         await axios.put(
//           `${API_URL}/api/products/${editingProperty._id}`, 
//           formData, 
//           config
//         );
//         setSuccess("Property updated successfully!");
//       } else {
//         await axios.post(
//           `${API_URL}/api/products`, 
//           formData, 
//           config
//         );
//         setSuccess("Property added successfully!");
//       }
      
//       // Reset form and state
//       reset();
//       setEditingProperty(null);
//       setSelectedFiles([]);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//       fetchProperties();
//     } catch (error) {
//       console.error("Error saving property", error);
//       setError(error.response?.data?.error || "Failed to save property. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function deleteProperty(id) {
//     if (!confirm("Are you sure you want to delete this property?")) {
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       await axios.delete(`${API_URL}/api/products/${id}`);
//       setSuccess("Property deleted successfully!");
//       fetchProperties();
//     } catch (error) {
//       console.error("Error deleting property", error);
//       setError("Failed to delete property. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function startEdit(property) {
//     setEditingProperty(property);
//     setSelectedFiles([]);
    
//     // Set form values
//     setValue("name", property.name);
//     setValue("description", property.description);
//     setValue("location", property.location);
//     setValue("price", property.price);
//     setValue("beds", property.beds);
//     setValue("bathrooms", property.bathrooms);
//     setValue("guests", property.guests);
//     setValue("hostedBy", property.hostedBy);
//     setValue("ratings", property.ratings);
//     setValue("totalReviews", property.totalReviews);
    
//     // Handle amenities - join array with commas for display
//     const cleanAmenities = Array.isArray(property.amenities)
//     ? property.amenities.map(a => a.replace(/["\[\]]/g, '').trim()).join(", ")
//     : "";
//   setValue("amenities", cleanAmenities);
    
//     // Format dates for display in the form
//     const formattedDates = property.availableDates.map(date => {
//       const dateObj = typeof date === 'string' ? new Date(date) : date;
//       return dateObj.toISOString().split('T')[0];
//     });
//     setValue("availableDates", formattedDates.join(", "));
    
//     // Reset file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
    
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   async function deleteImage(imageUrl, propertyId) {
//     if (!confirm("Are you sure you want to delete this image?")) {
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       await axios.put(
//         `${API_URL}/api/products/${propertyId}/delete-image`, 
//         { imageUrl }
//       );
//       setSuccess("Image deleted successfully!");
//       fetchProperties();
//     } catch (error) {
//       console.error("Error deleting image", error);
//       setError("Failed to delete image. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function cancelEdit() {
//     setEditingProperty(null);
//     setSelectedFiles([]);
//     reset();
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   }

//   return (
   
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
      
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
      
//       {success && (
//         <Alert className="bg-green-50 border-green-600 text-green-800">
//           <AlertDescription>{success}</AlertDescription>
//         </Alert>
//       )}
      
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md">
//         <h2 className="text-xl font-semibold">
//           {editingProperty ? "Edit Property" : "Add New Property"}
//         </h2>
        
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Name</Label>
//             <Input 
//               id="name"
//               {...register("name", { required: "Name is required" })} 
//               placeholder="Property name"
//             />
//             {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="location">Location</Label>
//             <Input 
//               id="location"
//               {...register("location", { required: "Location is required" })} 
//               placeholder="City, Country"
//             />
//             {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
//           </div>
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea 
//             id="description"
//             {...register("description", { required: "Description is required" })} 
//             placeholder="Describe the property..."
//             rows={4}
//           />
//           {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
//         </div>
        
//         <div className="grid md:grid-cols-4 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="price">Price (per night)</Label>
//             <Input 
//               id="price"
//               type="number" 
//               step="0.01"
//               {...register("price", { 
//                 required: "Price is required",
//                 min: { value: 0, message: "Price must be positive" }
//               })} 
//               placeholder="0.00"
//             />
//             {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="beds">Beds</Label>
//             <Input 
//               id="beds"
//               type="number" 
//               {...register("beds", { 
//                 required: "Number of beds is required",
//                 min: { value: 1, message: "At least 1 bed required" }
//               })} 
//               placeholder="1"
//             />
//             {errors.beds && <p className="text-red-600 text-sm">{errors.beds.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="bathrooms">Bathrooms</Label>
//             <Input 
//               id="bathrooms"
//               type="number" 
//               step="0.5"
//               {...register("bathrooms", { 
//                 required: "Number of bathrooms is required",
//                 min: { value: 0.5, message: "At least 0.5 bathrooms required" }
//               })} 
//               placeholder="1"
//             />
//             {errors.bathrooms && <p className="text-red-600 text-sm">{errors.bathrooms.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="guests">Max Guests</Label>
//             <Input 
//               id="guests"
//               type="number" 
//               {...register("guests", { 
//                 required: "Max guests is required",
//                 min: { value: 1, message: "At least 1 guest required" }
//               })} 
//               placeholder="2"
//             />
//             {errors.guests && <p className="text-red-600 text-sm">{errors.guests.message}</p>}
//           </div>
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="amenities">Amenities (comma-separated)</Label>
//           <Input 
//             id="amenities"
//             {...register("amenities", { required: "Amenities are required" })} 
//             placeholder="WiFi, Pool, Kitchen, etc."
//           />
//           {errors.amenities && <p className="text-red-600 text-sm">{errors.amenities.message}</p>}
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="availableDates">Available Dates (comma-separated)</Label>
//           <Input 
//             id="availableDates"
//             {...register("availableDates", { required: "Available dates are required" })} 
//             placeholder="2025-04-01, 2025-04-02, etc."
//           />
//           <p className="text-sm text-gray-500">Format: YYYY-MM-DD, comma-separated</p>
//           {errors.availableDates && <p className="text-red-600 text-sm">{errors.availableDates.message}</p>}
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="hostedBy">Hosted By</Label>
//             <Input 
//               id="hostedBy"
//               {...register("hostedBy", { required: "Host name is required" })} 
//               placeholder="Host name"
//             />
//             {errors.hostedBy && <p className="text-red-600 text-sm">{errors.hostedBy.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="ratings">Ratings (0-5)</Label>
//             <Input 
//               id="ratings"
//               type="number" 
//               step="0.1" 
//               min="0" 
//               max="5"
//               {...register("ratings", { 
//                 required: "Rating is required",
//                 min: { value: 0, message: "Min rating is 0" },
//                 max: { value: 5, message: "Max rating is 5" }
//               })} 
//               placeholder="4.5"
//             />
//             {errors.ratings && <p className="text-red-600 text-sm">{errors.ratings.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="totalReviews">Total Reviews</Label>
//             <Input 
//               id="totalReviews"
//               type="number" 
//               min="0"
//               {...register("totalReviews", { 
//                 required: "Number of reviews is required",
//                 min: { value: 0, message: "Cannot be negative" }
//               })} 
//               placeholder="0"
//             />
//             {errors.totalReviews && <p className="text-red-600 text-sm">{errors.totalReviews.message}</p>}
//           </div>
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="images">Images</Label>
//           <Input 
//             id="images"
//             type="file" 
//             multiple 
//             ref={fileInputRef}
//             onChange={handleFileChange}
//           />
//           {selectedFiles.length > 0 && (
//             <div className="mt-2">
//               <p className="text-sm text-green-600 font-medium">
//                 {selectedFiles.length} file(s) selected
//               </p>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {selectedFiles.map((file, index) => (
//                   <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1">
//                     {file.name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="flex space-x-2">
//           <Button 
//             type="submit" 
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {editingProperty ? "Update Property" : "Add Property"}
//           </Button>
          
//           {editingProperty && (
//             <Button 
//               type="button" 
//               variant="outline"
//               onClick={cancelEdit}
//             >
//               Cancel
//             </Button>
//           )}
//         </div>
//       </form>
      
//       <h2 className="text-xl font-semibold mt-8">Property Listings</h2>
      
//       {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {properties.map((property) => (
//           <Card key={property._id} className="overflow-hidden">
//             <CardContent className="p-0">
//               <div className="grid grid-cols-2 gap-1 p-1">
//                 {property.images && property.images.length > 0 ? (
//                   property.images.map((image, index) => (
//                     <div key={index} className="relative aspect-video">
//                       <img 
//                         src={image} 
//                         alt={`${property.name} - Image ${index+1}`} 
//                         className="w-full h-full object-cover rounded"
//                       />
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
//                         onClick={() => deleteImage(image, property._id)}
//                       >
//                         ✕
//                       </Button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="col-span-2 aspect-video bg-gray-200 flex items-center justify-center">
//                     <p className="text-gray-500">No images</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="p-4 space-y-2">
//                 <h2 className="text-lg font-semibold">{property.name}</h2>
//                 <p className="text-sm text-gray-500">{property.location}</p>
//                 <p className="font-bold text-lg">${property.price}/night</p>
                
//                 <div className="text-sm">
//                   <p>
//                     <span className="font-semibold">Details:</span> {property.beds} bed{property.beds !== 1 ? 's' : ''}, 
//                     {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}, 
//                     up to {property.guests} guest{property.guests !== 1 ? 's' : ''}
//                   </p>
//                   <p><span className="font-semibold">Amenities:</span> {property.amenities.join(", ")}</p>
//                   <p><span className="font-semibold">Rating:</span> {property.ratings} ({property.totalReviews} reviews)</p>
//                   <p><span className="font-semibold">Host:</span> {property.hostedBy}</p>
//                 </div>
                
//                 <div className="pt-2 flex space-x-2">
//                   <Button 
//                     onClick={() => startEdit(property)}
//                     size="sm"
//                     variant="outline"
//                   >
//                     Edit
//                   </Button>
//                   <Button 
//                     variant="destructive" 
//                     size="sm"
//                     onClick={() => deleteProperty(property._id)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
        
//         {properties.length === 0 && !isLoading && (
//           <div className="col-span-full text-center p-8">
//             <p className="text-gray-500">No properties found. Add your first property above.</p>
//           </div>
//         )}
//       </div>
//     </div>
//    );
// }




// working


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation"; // Use next/navigation
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { AlertCircle, Loader2 } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext"; // Import useAuth
// import { auth } from "@/lib/firebase"; // Import auth for logout
// import { signOut } from "firebase/auth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// export default function PropertyManager() {
//   const [properties, setProperties] = useState<any[]>([]); // Add type if possible
//   const [editingProperty, setEditingProperty] = useState<any | null>(null); // Add type if possible
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
//   const { currentUser, loading: authLoading } = useAuth(); // Get auth state
//   const router = useRouter(); // Get router for redirection

//   // --- Authentication Check ---
//   useEffect(() => {
//     // Wait for Firebase auth check to complete
//     if (!authLoading) {
//       if (!currentUser) {
//         // If not logged in after check, redirect to login
//         router.push("/auth/login");
//       } else {
//         // If logged in, fetch properties
//         fetchProperties();
//       }
//     }
//   }, [currentUser, authLoading, router]); // Dependencies for the effect

//   // --- Fetch Properties Function ---
//   async function fetchProperties() {
//     if (!currentUser) return; // Don't fetch if not logged in

//     setIsLoading(true);
//     setError(null);
//     setSuccess(null); // Clear success message on fetch

//     try {
//       const res = await axios.get(`${API_URL}/api/products`);
//       const cleanedProperties = res.data.map((property: any) => ({ // Add type
//         ...property,
//         amenities: Array.isArray(property.amenities)
//           ? property.amenities.map((amenity: string) => amenity.replace(/["\[\]]/g, '').trim())
//           : [],
//         // Ensure availableDates is always an array, handle potential string dates
//         availableDates: Array.isArray(property.availableDates)
//             ? property.availableDates.map((dateStr: string) => new Date(dateStr).toISOString().split('T')[0]) // Standardize format
//             : [],
//       }));
//       setProperties(cleanedProperties);
//     } catch (error) {
//       console.error("Error fetching properties", error);
//       setError("Failed to load properties. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // --- File Change Handler ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const filesArray = Array.from(e.target.files);
//       setSelectedFiles(filesArray);
//     } else {
//       setSelectedFiles([]); // Clear if no files selected
//     }
//   };

//   // --- Form Submit Handler ---
//   async function onSubmit(data: any) { // Add type if possible
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     const formData = new FormData();

//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("price", data.price);
//     formData.append("location", data.location);
//     formData.append("beds", data.beds);
//     formData.append("bathrooms", data.bathrooms);
//     formData.append("guests", data.guests);
//     formData.append("hostedBy", data.hostedBy);
//     formData.append("ratings", data.ratings);
//     formData.append("totalReviews", data.totalReviews);

//     if (data.amenities) {
//       const amenitiesArray = data.amenities
//         .split(',')
//         .map((item: string) => item.trim())
//         .filter((item: string) => item)
//         .map((item: string) => item.replace(/"/g, ''));
//       formData.append("amenities", JSON.stringify(amenitiesArray));
//     } else {
//       formData.append("amenities", JSON.stringify([])); // Send empty array if field is empty
//     }

//     if (data.availableDates) {
//       const datesArray = data.availableDates
//         .split(',')
//         .map((item: string) => item.trim())
//         .filter((item: string) => item); // Basic validation, more robust date validation might be needed
//       formData.append("availableDates", JSON.stringify(datesArray));
//     } else {
//       formData.append("availableDates", JSON.stringify([])); // Send empty array if field is empty
//     }

//     if (selectedFiles.length > 0) {
//       selectedFiles.forEach(file => {
//         formData.append("images", file);
//       });
//     }

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       if (editingProperty) {
//         await axios.put(
//           `${API_URL}/api/products/${editingProperty._id}`,
//           formData,
//           config
//         );
//         setSuccess("Property updated successfully!");
//       } else {
//         await axios.post(
//           `${API_URL}/api/products`,
//           formData,
//           config
//         );
//         setSuccess("Property added successfully!");
//       }

//       reset();
//       setEditingProperty(null);
//       setSelectedFiles([]);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//       fetchProperties(); // Refetch after successful save
//     } catch (error: any) {
//       console.error("Error saving property", error);
//       setError(error.response?.data?.error || "Failed to save property. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // --- Delete Property Handler ---
//   async function deleteProperty(id: string) {
//     if (!confirm("Are you sure you want to delete this property?")) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       await axios.delete(`${API_URL}/api/products/${id}`);
//       setSuccess("Property deleted successfully!");
//       fetchProperties(); // Refetch after delete
//     } catch (error) {
//       console.error("Error deleting property", error);
//       setError("Failed to delete property. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // --- Start Edit Handler ---
//   function startEdit(property: any) { // Add type
//     setEditingProperty(property);
//     setSelectedFiles([]);

//     setValue("name", property.name);
//     setValue("description", property.description);
//     setValue("location", property.location);
//     setValue("price", property.price);
//     setValue("beds", property.beds);
//     setValue("bathrooms", property.bathrooms);
//     setValue("guests", property.guests);
//     setValue("hostedBy", property.hostedBy);
//     setValue("ratings", property.ratings);
//     setValue("totalReviews", property.totalReviews);

//     const cleanAmenities = Array.isArray(property.amenities)
//       ? property.amenities.map((a: string) => a.replace(/["\[\]]/g, '').trim()).join(", ")
//       : "";
//     setValue("amenities", cleanAmenities);

//     // Ensure dates are correctly formatted strings from fetchProperties
//      const formattedDates = Array.isArray(property.availableDates)
//         ? property.availableDates.join(", ")
//         : "";
//     setValue("availableDates", formattedDates);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   // --- Delete Image Handler ---
//   async function deleteImage(imageUrl: string, propertyId: string) {
//     if (!confirm("Are you sure you want to delete this image?")) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       await axios.put(
//         `${API_URL}/api/products/${propertyId}/delete-image`,
//         { imageUrl }
//       );
//       setSuccess("Image deleted successfully!");
//        // Find the property being edited or the one in the list and update its state
//        // Or simply refetch all properties for simplicity
//        fetchProperties(); // Easiest way to update UI
//        // If editing, update the editingProperty state as well
//        if (editingProperty?._id === propertyId) {
//            setEditingProperty((prev: any) => ({
//                ...prev,
//                images: prev.images.filter((img: string) => img !== imageUrl)
//            }))
//        }
//     } catch (error) {
//       console.error("Error deleting image", error);
//       setError("Failed to delete image. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // --- Cancel Edit Handler ---
//   function cancelEdit() {
//     setEditingProperty(null);
//     setSelectedFiles([]);
//     reset();
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//     setError(null); // Clear errors on cancel
//     setSuccess(null); // Clear success messages on cancel
//   }

//    // --- Logout Handler ---
//   const handleLogout = async () => {
//     setError(null);
//     setSuccess(null);
//     try {
//       await signOut(auth);
//       // AuthProvider's onAuthStateChanged will detect this
//       // The useEffect hook will then redirect to login
//       // No need for router.push('/auth/login') here if useEffect handles it
//       console.log("User logged out");
//     } catch (error) {
//         console.error("Logout failed:", error);
//         setError("Failed to log out. Please try again.");
//     }
//   };

//   // --- Render Loading or Null if not Authenticated ---
//   // Show loading spinner while auth is checking OR if data is loading
//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   // If auth check is done and user is not logged in, render nothing (or redirect)
//   // The useEffect above handles the redirect, so rendering null is fine here
//   // to prevent flashing the page content before redirect.
//   if (!currentUser) {
//      return null;
//   }

//   // --- Render CMS Content if Authenticated ---
//   return (
//     <div className="p-6 space-y-6">
//         <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
//              {currentUser && (
//                  <Button variant="outline" onClick={handleLogout}>
//                     Logout ({currentUser.email})
//                  </Button>
//              )}
//         </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert className="bg-green-50 border-green-600 text-green-800">
//           <AlertDescription>{success}</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md">
//         <h2 className="text-xl font-semibold">
//           {editingProperty ? "Edit Property" : "Add New Property"}
//         </h2>

//         {/* Name and Location */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               {...register("name", { required: "Name is required" })}
//               placeholder="Property name"
//             />
//             {errors.name && <p className="text-red-600 text-sm">{errors.name.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="location">Location</Label>
//             <Input
//               id="location"
//               {...register("location", { required: "Location is required" })}
//               placeholder="City, Country"
//             />
//             {errors.location && <p className="text-red-600 text-sm">{errors.location.message as string}</p>}
//           </div>
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             {...register("description", { required: "Description is required" })}
//             placeholder="Describe the property..."
//             rows={4}
//           />
//           {errors.description && <p className="text-red-600 text-sm">{errors.description.message as string}</p>}
//         </div>

//         {/* Price, Beds, Bathrooms, Guests */}
//         <div className="grid md:grid-cols-4 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="price">Price (per night)</Label>
//             <Input
//               id="price"
//               type="number"
//               step="0.01"
//               {...register("price", {
//                 required: "Price is required",
//                 valueAsNumber: true, // Ensure value is treated as number
//                 min: { value: 0, message: "Price must be positive" }
//               })}
//               placeholder="0.00"
//             />
//             {errors.price && <p className="text-red-600 text-sm">{errors.price.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="beds">Beds</Label>
//             <Input
//               id="beds"
//               type="number"
//               {...register("beds", {
//                 required: "Number of beds is required",
//                 valueAsNumber: true,
//                 min: { value: 1, message: "At least 1 bed required" }
//               })}
//               placeholder="1"
//             />
//             {errors.beds && <p className="text-red-600 text-sm">{errors.beds.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="bathrooms">Bathrooms</Label>
//             <Input
//               id="bathrooms"
//               type="number"
//               step="0.5"
//               {...register("bathrooms", {
//                 required: "Number of bathrooms is required",
//                  valueAsNumber: true,
//                 min: { value: 0.5, message: "At least 0.5 bathrooms required" }
//               })}
//               placeholder="1"
//             />
//             {errors.bathrooms && <p className="text-red-600 text-sm">{errors.bathrooms.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="guests">Max Guests</Label>
//             <Input
//               id="guests"
//               type="number"
//               {...register("guests", {
//                 required: "Max guests is required",
//                  valueAsNumber: true,
//                 min: { value: 1, message: "At least 1 guest required" }
//               })}
//               placeholder="2"
//             />
//             {errors.guests && <p className="text-red-600 text-sm">{errors.guests.message as string}</p>}
//           </div>
//         </div>

//         {/* Amenities */}
//         <div className="space-y-2">
//           <Label htmlFor="amenities">Amenities (comma-separated)</Label>
//           <Input
//             id="amenities"
//             {...register("amenities")} // Removed required here, handled in onSubmit
//             placeholder="WiFi, Pool, Kitchen, etc."
//           />
//           {errors.amenities && <p className="text-red-600 text-sm">{errors.amenities.message as string}</p>}
//         </div>

//         {/* Available Dates */}
//          <div className="space-y-2">
//             <Label htmlFor="availableDates">Available Dates (comma-separated YYYY-MM-DD)</Label>
//             <Input
//                 id="availableDates"
//                 {...register("availableDates", {
//                     pattern: {
//                         value: /^(\d{4}-\d{2}-\d{2})(,\s*\d{4}-\d{2}-\d{2})*$/,
//                         message: "Use YYYY-MM-DD format, separated by commas"
//                     }
//                 })}
//                 placeholder="2025-04-01, 2025-04-02"
//             />
//             <p className="text-sm text-gray-500">Format: YYYY-MM-DD, comma-separated. Example: 2024-12-25, 2024-12-26</p>
//             {errors.availableDates && <p className="text-red-600 text-sm">{errors.availableDates.message as string}</p>}
//         </div>

//         {/* Hosted By, Ratings, Reviews */}
//         <div className="grid md:grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="hostedBy">Hosted By</Label>
//             <Input
//               id="hostedBy"
//               {...register("hostedBy", { required: "Host name is required" })}
//               placeholder="Host name"
//             />
//             {errors.hostedBy && <p className="text-red-600 text-sm">{errors.hostedBy.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="ratings">Ratings (0-5)</Label>
//             <Input
//               id="ratings"
//               type="number"
//               step="0.1"
//               min="0"
//               max="5"
//               {...register("ratings", {
//                 required: "Rating is required",
//                 valueAsNumber: true,
//                 min: { value: 0, message: "Min rating is 0" },
//                 max: { value: 5, message: "Max rating is 5" }
//               })}
//               placeholder="4.5"
//             />
//             {errors.ratings && <p className="text-red-600 text-sm">{errors.ratings.message as string}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="totalReviews">Total Reviews</Label>
//             <Input
//               id="totalReviews"
//               type="number"
//               min="0"
//               {...register("totalReviews", {
//                 required: "Number of reviews is required",
//                 valueAsNumber: true,
//                 min: { value: 0, message: "Cannot be negative" }
//               })}
//               placeholder="0"
//             />
//             {errors.totalReviews && <p className="text-red-600 text-sm">{errors.totalReviews.message as string}</p>}
//           </div>
//         </div>

//         {/* Images */}
//         <div className="space-y-2">
//           <Label htmlFor="images">Images (Add new or replace existing)</Label>
//           <Input
//             id="images"
//             type="file"
//             multiple
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="image/*" // Suggest image files
//           />
//            {editingProperty && (!selectedFiles || selectedFiles.length === 0) && (
//               <p className="text-sm text-gray-500 mt-1">Leave empty to keep existing images. Uploading new files will replace all current images for this property on update.</p>
//             )}
//           {selectedFiles.length > 0 && (
//             <div className="mt-2">
//               <p className="text-sm text-green-600 font-medium">
//                 {selectedFiles.length} file(s) selected for upload:
//               </p>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {selectedFiles.map((file, index) => (
//                   <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1 truncate max-w-xs">
//                     {file.name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Form Actions */}
//         <div className="flex space-x-2 pt-2">
//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {editingProperty ? "Update Property" : "Add Property"}
//           </Button>

//           {editingProperty && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={cancelEdit}
//               disabled={isLoading}
//             >
//               Cancel Edit
//             </Button>
//           )}
//         </div>
//       </form>

//       {/* Property Listings */}
//       <h2 className="text-xl font-semibold mt-8">Property Listings</h2>

//       {isLoading && !properties.length && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {properties.map((property) => (
//           <Card key={property._id} className="overflow-hidden flex flex-col">
//              {/* Image Section */}
//             <div className="grid grid-cols-2 gap-1 p-1">
//                 {property.images && property.images.length > 0 ? (
//                   property.images.slice(0, 4).map((image: string, index: number) => ( // Limit displayed images if many
//                     <div key={index} className="relative aspect-video group">
//                       <img
//                         src={image}
//                         alt={`${property.name} - Image ${index + 1}`}
//                         className="w-full h-full object-cover rounded"
//                         loading="lazy" // Add lazy loading
//                       />
//                       <Button
//                         variant="destructive"
//                         size="icon" // Use icon size
//                         className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                         onClick={(e) => {
//                             e.stopPropagation(); // Prevent triggering other card events
//                             deleteImage(image, property._id)}
//                         }
//                         disabled={isLoading}
//                         title="Delete Image"
//                       >
//                         ✕
//                       </Button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="col-span-2 aspect-video bg-gray-200 flex items-center justify-center rounded m-1">
//                     <p className="text-gray-500 text-sm">No images</p>
//                   </div>
//                 )}
//                  {property.images && property.images.length > 4 && (
//                      <div className="col-span-2 text-center text-xs text-gray-500 p-1">
//                         +{property.images.length - 4} more images
//                      </div>
//                  )}
//             </div>

//              {/* Content Section */}
//             <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
//                 <div>
//                     <h3 className="text-lg font-semibold leading-tight">{property.name}</h3>
//                     <p className="text-sm text-gray-500 mb-1">{property.location}</p>
//                     <p className="font-bold text-lg mb-2">${property.price?.toFixed(2)}/night</p>

//                     <div className="text-sm space-y-1 text-gray-700">
//                         <p>
//                             <span className="font-semibold">Details:</span> {property.beds} bed{property.beds !== 1 ? 's' : ''},
//                             {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''},
//                             up to {property.guests} guest{property.guests !== 1 ? 's' : ''}
//                         </p>
//                         {property.amenities && property.amenities.length > 0 && (
//                             <p><span className="font-semibold">Amenities:</span> {property.amenities.join(", ")}</p>
//                         )}
//                          <p><span className="font-semibold">Rating:</span> {property.ratings}★ ({property.totalReviews} reviews)</p>
//                          <p><span className="font-semibold">Host:</span> {property.hostedBy}</p>
//                          {/* Optionally display available dates */}
//                          {/* <p><span className="font-semibold">Available:</span> {property.availableDates.join(', ')}</p> */}
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="pt-3 flex space-x-2">
//                     <Button
//                     onClick={() => startEdit(property)}
//                     size="sm"
//                     variant="outline"
//                     disabled={isLoading}
//                     >
//                     Edit
//                     </Button>
//                     <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => deleteProperty(property._id)}
//                     disabled={isLoading}
//                     >
//                     Delete
//                     </Button>
//                 </div>
//             </CardContent>
//           </Card>
//         ))}

//         {properties.length === 0 && !isLoading && (
//           <div className="col-span-full text-center p-8">
//             <p className="text-gray-500">No properties found. Add your first property using the form above.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Define a basic type for Property - adjust as needed based on your actual data structure
interface Property {
    _id: string;
    name: string;
    description: string;
    location: string;
    price: number;
    beds: number;
    bathrooms: number;
    guests: number;
    amenities: string[];
    availableDates: string[]; // Assuming dates are stored/fetched as formatted strings 'YYYY-MM-DD'
    hostedBy: string;
    ratings: number;
    totalReviews: number;
    images: string[];
}

export default function PropertyManager() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false); // General loading state for API calls
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Property>>(); // Use Partial<Property> for form data type
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  // Authentication Check and Initial Data Fetch
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        fetchProperties();
      }
    }
  }, [currentUser, authLoading, router]);

  // Fetch Properties Function
  async function fetchProperties() {
    if (!currentUser) return;

    // Use the general isLoading state for fetching too
    setIsLoading(true);
    setError(null);
    // Don't clear success message here, let it persist until next action
    // setSuccess(null);

    try {
      const res = await axios.get<{ data: any[] }>(`${API_URL}/api/products`); // Assuming API returns { data: [...] }
      const fetchedProperties = res.data.data || res.data; // Adapt based on actual API response structure

      if (!Array.isArray(fetchedProperties)) {
        console.error("Fetched data is not an array:", fetchedProperties);
        throw new Error("Invalid data format received from API.");
      }


      const cleanedProperties: Property[] = fetchedProperties.map((property: any): Property => ({
          _id: property._id,
          name: property.name || "",
          description: property.description || "",
          location: property.location || "",
          price: typeof property.price === 'number' ? property.price : 0,
          beds: typeof property.beds === 'number' ? property.beds : 0,
          bathrooms: typeof property.bathrooms === 'number' ? property.bathrooms : 0,
          guests: typeof property.guests === 'number' ? property.guests : 0,
          amenities: Array.isArray(property.amenities)
            ? property.amenities.map((amenity: any) => String(amenity).replace(/["\[\]]/g, '').trim())
            : typeof property.amenities === 'string'
            ? property.amenities.split(',').map(a => a.trim()).filter(a => a) // Handle comma-separated string if needed
            : [],
          // Ensure availableDates is an array of 'YYYY-MM-DD' strings
          availableDates: Array.isArray(property.availableDates)
              ? property.availableDates.map((date: any) => {
                  try {
                      // Try to parse and format, handle invalid dates
                      const d = new Date(date);
                      if (!isNaN(d.getTime())) {
                          return d.toISOString().split('T')[0];
                      }
                      return ''; // Or skip invalid dates
                  } catch {
                      return '';
                  }
              }).filter(date => date) // Remove empty strings from invalid dates
              : [],
          hostedBy: property.hostedBy || "Unknown Host",
          ratings: typeof property.ratings === 'number' ? property.ratings : 0,
          totalReviews: typeof property.totalReviews === 'number' ? property.totalReviews : 0,
          images: Array.isArray(property.images) ? property.images.map(String) : [], // Ensure images is an array of strings
      }));
      setProperties(cleanedProperties);
    } catch (error: any) {
      console.error("Error fetching properties", error);
      setError(`Failed to load properties: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  }

  // File Change Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    } else {
      setSelectedFiles([]);
    }
  };

  // Form Submit Handler (Add/Edit)
  async function onSubmit(data: Partial<Property>) {
    // Add validation here if needed before sending
    if (!data.name || !data.location || !data.price || !data.beds || !data.bathrooms || !data.guests || !data.hostedBy || data.ratings === undefined || data.totalReviews === undefined) {
        setError("Please fill in all required fields.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();

    // Append mandatory fields confidently (validated above or relying on 'required' in register)
    formData.append("name", data.name);
    formData.append("description", data.description || ""); // Handle potentially undefined description
    formData.append("price", String(data.price));
    formData.append("location", data.location);
    formData.append("beds", String(data.beds));
    formData.append("bathrooms", String(data.bathrooms));
    formData.append("guests", String(data.guests));
    formData.append("hostedBy", data.hostedBy);
    formData.append("ratings", String(data.ratings));
    formData.append("totalReviews", String(data.totalReviews));

    // Handle optional amenities (string from form -> JSON array string)
    if (data.amenities && typeof data.amenities === 'string') {
      const amenitiesArray = data.amenities
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item) // Remove empty strings
        .map((item: string) => item.replace(/"/g, '')); // Clean quotes just in case
      formData.append("amenities", JSON.stringify(amenitiesArray));
    } else {
      formData.append("amenities", JSON.stringify([])); // Send empty array if no input
    }

    // Handle optional availableDates (string from form -> JSON array string)
    if (data.availableDates && typeof data.availableDates === 'string') {
        const datesArray = data.availableDates
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => /^\d{4}-\d{2}-\d{2}$/.test(item)); // Basic date format check
        formData.append("availableDates", JSON.stringify(datesArray));
    } else {
      formData.append("availableDates", JSON.stringify([])); // Send empty array if no input
    }


    // Append new files ONLY if selected
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append("images", file); // API expects 'images' field name
      });
    }
    // Note: When editing, if no new files are selected, the existing images are typically preserved
    // by the backend unless the API explicitly requires sending the existing image URLs too.
    // If your PUT endpoint *replaces* images entirely, you might need to send existing image URLs
    // if no new files are selected. Check your API documentation.


    try {
      const config = {
        headers: {
          // Let browser set Content-Type for FormData
          // "Content-Type": "multipart/form-data", // Usually not needed with FormData
        },
      };

      let response;
      if (editingProperty) {
        // PUT request for updating
        response = await axios.put(
          `${API_URL}/api/products/${editingProperty._id}`,
          formData,
          config
        );
        setSuccess("Property updated successfully!");
      } else {
        // POST request for creating
        response = await axios.post(
          `${API_URL}/api/products`,
          formData,
          config
        );
        setSuccess("Property added successfully!");
      }

      reset(); // Reset form fields
      setEditingProperty(null); // Exit editing mode
      setSelectedFiles([]); // Clear selected files state
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input visually
      }
      await fetchProperties(); // Refetch properties to show changes/new property
    } catch (error: any) {
      console.error("Error saving property", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to save property. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete Property Handler
  async function deleteProperty(id: string) {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setSuccess("Property deleted successfully!");
      // Refresh the list *after* successful deletion
      // Remove the deleted property from state immediately for faster UI update
      setProperties(prev => prev.filter(p => p._id !== id));
      if(editingProperty?._id === id) {
        cancelEdit(); // If deleting the property currently being edited, cancel edit mode
      }
    } catch (error: any) {
      console.error("Error deleting property", error);
       const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete property. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Start Edit Handler
  function startEdit(property: Property) {
    setEditingProperty(property);
    setSelectedFiles([]); // Clear any previously selected files when starting edit
    setError(null);
    setSuccess(null);


    // Populate form fields
    setValue("name", property.name);
    setValue("description", property.description);
    setValue("location", property.location);
    setValue("price", property.price);
    setValue("beds", property.beds);
    setValue("bathrooms", property.bathrooms);
    setValue("guests", property.guests);
    setValue("hostedBy", property.hostedBy);
    setValue("ratings", property.ratings);
    setValue("totalReviews", property.totalReviews);

    // Join arrays into comma-separated strings for input fields
    const amenitiesString = Array.isArray(property.amenities) ? property.amenities.join(", ") : "";
    setValue("amenities", amenitiesString);

    const availableDatesString = Array.isArray(property.availableDates) ? property.availableDates.join(", ") : "";
    setValue("availableDates", availableDatesString);


    // Reset file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  }

   // Delete Image Handler
   async function deleteImage(imageUrlToDelete: string, propertyId: string) {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    // Prevent action if another operation is in progress
    if (isLoading) return;

    setIsLoading(true); // Indicate loading specifically for this action might be better, but using global for now
    setError(null);
    setSuccess(null);

    try {
      // Send request to backend to delete the specific image URL
      await axios.put(
        `${API_URL}/api/products/${propertyId}/delete-image`,
        { imageUrl: imageUrlToDelete } // Send the URL of the image to delete
      );

      setSuccess("Image deleted successfully!");

      // Update local state immediately for better UX
      setProperties(prevProperties =>
        prevProperties.map(p =>
          p._id === propertyId
            ? { ...p, images: p.images.filter(imgUrl => imgUrl !== imageUrlToDelete) }
            : p
        )
      );

      // If the currently edited property is the one affected, update its state too
      if (editingProperty?._id === propertyId) {
        setEditingProperty(prev =>
          prev ? { ...prev, images: prev.images.filter(imgUrl => imgUrl !== imageUrlToDelete) } : null
        );
      }

    } catch (error: any) {
      console.error("Error deleting image", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete image. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Cancel Edit Handler
  function cancelEdit() {
    setEditingProperty(null);
    setSelectedFiles([]);
    reset(); // Reset form to default values
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    setSuccess(null);
  }

   // Logout Handler
  const handleLogout = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true); // Show loading during logout process
    try {
      await signOut(auth);
      // onAuthStateChanged in AuthContext handles state update & redirection via useEffect
      console.log("User logged out");
       // Optionally clear local state if needed, though redirect handles it
       setProperties([]);
       setEditingProperty(null);
    } catch (error) {
        console.error("Logout failed:", error);
        setError("Failed to log out. Please try again.");
    } finally {
       setIsLoading(false);
    }
  };

  // --- Render Loading or Null/Redirect if not Authenticated ---
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
     // The useEffect hook handles the redirect, so rendering null prevents
     // the CMS page from briefly flashing before the redirect occurs.
     return null;
  }

  // --- Render CMS Content if Authenticated ---
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
             {currentUser && (
                 <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Logout ({currentUser.email?.split('@')[0]}) {/* Show part of email */}
                 </Button>
             )}
        </div>

      {/* Global Messages */}
      <div className="space-y-2">
        {error && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {success && (
            <Alert className="bg-green-100 border-green-400 text-green-800">
            {/* <CheckCircle className="h-4 w-4" /> Optional success icon */}
            <AlertDescription>{success}</AlertDescription>
            </Alert>
        )}
      </div>


      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md shadow-sm bg-card">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {editingProperty ? `Edit Property: ${editingProperty.name}` : "Add New Property"}
        </h2>

        {/* Name and Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., Beachfront Paradise Villa"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              {...register("location", { required: "Location is required" })}
              placeholder="e.g., Malibu, California"
               className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe the property's key features, atmosphere, and nearby attractions..."
            rows={3}
          />
          {/* No error message needed if not required */}
        </div>

        {/* Price, Beds, Bathrooms, Guests */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price/night ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price must be non-negative" }
              })}
              placeholder="150.00"
               className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="beds">Beds *</Label>
            <Input
              id="beds"
              type="number"
              min="1"
              step="1"
              {...register("beds", {
                required: "Beds count is required",
                valueAsNumber: true,
                min: { value: 1, message: "Min 1 bed" }
              })}
              placeholder="3"
               className={errors.beds ? "border-red-500" : ""}
            />
            {errors.beds && <p className="text-xs text-red-600">{errors.beds.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Bathrooms *</Label>
            <Input
              id="bathrooms"
              type="number"
              step="0.5"
              min="0.5"
              {...register("bathrooms", {
                required: "Bathrooms count is required",
                 valueAsNumber: true,
                min: { value: 0.5, message: "Min 0.5 baths" }
              })}
              placeholder="2.5"
               className={errors.bathrooms ? "border-red-500" : ""}
            />
            {errors.bathrooms && <p className="text-xs text-red-600">{errors.bathrooms.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guests">Max Guests *</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              step="1"
              {...register("guests", {
                required: "Max guests is required",
                 valueAsNumber: true,
                min: { value: 1, message: "Min 1 guest" }
              })}
              placeholder="6"
               className={errors.guests ? "border-red-500" : ""}
            />
            {errors.guests && <p className="text-xs text-red-600">{errors.guests.message}</p>}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-1.5">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input
            id="amenities"
            {...register("amenities")}
            placeholder="WiFi, Pool, Kitchen, Air Conditioning, Free Parking"
          />
          {/* No error message needed if optional */}
        </div>

        {/* Available Dates */}
         <div className="space-y-1.5">
            <Label htmlFor="availableDates">Available Dates (YYYY-MM-DD, comma-separated)</Label>
            <Input
                id="availableDates"
                {...register("availableDates", {
                     // Relaxed pattern: allows optional spaces, trailing comma ok
                    pattern: {
                        // value: /^(\d{4}-\d{2}-\d{2})(,\s*\d{4}-\d{2}-\d{2})*$/, // Stricter
                         value: /^(\s*\d{4}-\d{2}-\d{2}\s*,?)+$/, // More lenient
                        message: "Use YYYY-MM-DD format, comma-separated"
                    }
                })}
                placeholder="2024-12-20, 2024-12-21, 2025-01-05"
                className={errors.availableDates ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">Example: 2024-12-25, 2024-12-26</p>
            {errors.availableDates && <p className="text-xs text-red-600">{errors.availableDates.message}</p>}
        </div>

        {/* Hosted By, Ratings, Reviews */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="hostedBy">Hosted By *</Label>
            <Input
              id="hostedBy"
              {...register("hostedBy", { required: "Host name is required" })}
              placeholder="e.g., John Doe"
               className={errors.hostedBy ? "border-red-500" : ""}
            />
            {errors.hostedBy && <p className="text-xs text-red-600">{errors.hostedBy.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ratings">Rating (0-5) *</Label>
            <Input
              id="ratings"
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("ratings", {
                required: "Rating is required",
                valueAsNumber: true,
                min: { value: 0, message: "Min 0" },
                max: { value: 5, message: "Max 5" }
              })}
              placeholder="4.8"
               className={errors.ratings ? "border-red-500" : ""}
            />
            {errors.ratings && <p className="text-xs text-red-600">{errors.ratings.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="totalReviews">Total Reviews *</Label>
            <Input
              id="totalReviews"
              type="number"
              min="0"
              step="1"
              {...register("totalReviews", {
                required: "Review count is required",
                valueAsNumber: true,
                min: { value: 0, message: "Min 0" }
              })}
              placeholder="125"
               className={errors.totalReviews ? "border-red-500" : ""}
            />
            {errors.totalReviews && <p className="text-xs text-red-600">{errors.totalReviews.message}</p>}
          </div>
        </div>

        {/* Images Upload */}
        <div className="space-y-1.5 pt-2">
          <Label htmlFor="images">
            {editingProperty ? "Upload New Images (replaces all existing)" : "Upload Images"}
            </Label>
          <Input
            id="images"
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp, image/gif" // Be specific about accepted types
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
           {editingProperty && (!selectedFiles || selectedFiles.length === 0) && (
              <p className="text-xs text-muted-foreground mt-1">Leave empty to keep the current images. Uploading new files will replace all existing ones upon update.</p>
            )}
           {editingProperty && editingProperty.images.length > 0 && (!selectedFiles || selectedFiles.length === 0) && (
                <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Current Images:</p>
                     <div className="flex flex-wrap gap-2">
                        {editingProperty.images.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16">
                                <img src={img} alt={`Current ${idx+1}`} className="w-full h-full object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>
           )}
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">
                {selectedFiles.length} file(s) ready for upload:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs bg-muted rounded px-2 py-1 truncate max-w-[150px]" title={file.name}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingProperty ? "Update Property" : "Add Property"}
          </Button>

          {editingProperty && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      {/* Property Listings Section */}
      <div className="pt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Property Listings ({properties.length})</h2>

          {/* Loading Indicator for Listings */}
          {isLoading && properties.length === 0 && ( // Show only initial loading or when refetching empty list
          <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          )}

          {/* Grid for Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property) => (
              <Card key={property._id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
                 {/* Image Section - Displays ALL images */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-muted/40">
                    {property.images && property.images.length > 0 ? (
                      // REMOVED .slice(0, 4) to show all images
                      property.images.map((image: string, index: number) => (
                        <div key={index} className="relative aspect-video group bg-gray-200"> {/* Added bg color */}
                          <img
                            src={image}
                            alt={`${property.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                            loading="lazy" // Lazy load images below the fold
                            onError={(e) => (e.currentTarget.src = '/placeholder-image.png')} // Fallback image
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-black/50 hover:bg-red-600/80"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteImage(image, property._id);
                            }}
                            disabled={isLoading}
                            title="Delete Image"
                          >
                            <span className="text-xs">✕</span>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 aspect-video bg-gray-200 flex items-center justify-center rounded m-1">
                        <p className="text-muted-foreground text-sm">No images</p>
                      </div>
                    )}
                    {/* REMOVED the "+X more images" text block */}
                </div>

                 {/* Content Section */}
                <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    {/* Top part of content */}
                    <div>
                        <h3 className="text-lg font-semibold leading-tight hover:text-blue-700 transition-colors">{property.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{property.location}</p>
                        <p className="font-bold text-lg mb-2">${property.price?.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/night</span></p>

                        <div className="text-sm space-y-1 text-foreground/90">
                            <p>
                                <span className="font-medium">Details:</span> {property.beds} bed{property.beds !== 1 ? 's' : ''}, {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}, {property.guests} guest{property.guests !== 1 ? 's' : ''} max
                            </p>
                            {property.amenities && property.amenities.length > 0 && (
                                <p className="line-clamp-2" title={property.amenities.join(", ")}>
                                    <span className="font-medium">Amenities:</span> {property.amenities.join(", ")}
                                </p>
                            )}
                            <p><span className="font-medium">Rating:</span> {property.ratings?.toFixed(1)}★ <span className="text-muted-foreground">({property.totalReviews} reviews)</span></p>
                            <p><span className="font-medium">Host:</span> {property.hostedBy}</p>
                            {/* Display Available Dates (optional, can get long) */}
                             {/* {property.availableDates && property.availableDates.length > 0 && (
                                <p className="text-xs text-muted-foreground line-clamp-1" title={property.availableDates.join(', ')}><span className="font-medium">Dates:</span> {property.availableDates.join(', ')}</p>
                             )} */}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-auto flex space-x-2">
                        <Button
                            onClick={() => startEdit(property)}
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProperty(property._id)}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Delete
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}

            {/* No Properties Message */}
            {properties.length === 0 && !isLoading && (
              <div className="col-span-full text-center p-8 bg-card rounded-md shadow-sm">
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">Use the form above to add your first property.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
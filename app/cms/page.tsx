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
    availableDates: string[]; 
    hostedBy: string;
    ratings: number;
    totalReviews: number;
    images: string[];
}

export default function PropertyManager() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Property>>(); 
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

 
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        fetchProperties();
      }
    }
  }, [currentUser, authLoading, router]);


  async function fetchProperties() {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);
  

    try {
      const res = await axios.get<{ data: any[] }>(`${API_URL}/api/products`); 
      const fetchedProperties = res.data.data || res.data; 

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
            ? property.amenities.split(',').map(a => a.trim()).filter(a => a) 
            : [],
       
          availableDates: Array.isArray(property.availableDates)
              ? property.availableDates.map((date: any) => {
                  try {
                  
                      const d = new Date(date);
                      if (!isNaN(d.getTime())) {
                          return d.toISOString().split('T')[0];
                      }
                      return ''; 
                  } catch {
                      return '';
                  }
              }).filter(date => date) 
              : [],
          hostedBy: property.hostedBy || "Unknown Host",
          ratings: typeof property.ratings === 'number' ? property.ratings : 0,
          totalReviews: typeof property.totalReviews === 'number' ? property.totalReviews : 0,
          images: Array.isArray(property.images) ? property.images.map(String) : [], 
      }));
      setProperties(cleanedProperties);
    } catch (error: any) {
      console.error("Error fetching properties", error);
      setError(`Failed to load properties: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    } else {
      setSelectedFiles([]);
    }
  };

  
  async function onSubmit(data: Partial<Property>) {
   
    if (!data.name || !data.location || !data.price || !data.beds || !data.bathrooms || !data.guests || !data.hostedBy || data.ratings === undefined || data.totalReviews === undefined) {
        setError("Please fill in all required fields.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();

  
    formData.append("name", data.name);
    formData.append("description", data.description || ""); 
    formData.append("price", String(data.price));
    formData.append("location", data.location);
    formData.append("beds", String(data.beds));
    formData.append("bathrooms", String(data.bathrooms));
    formData.append("guests", String(data.guests));
    formData.append("hostedBy", data.hostedBy);
    formData.append("ratings", String(data.ratings));
    formData.append("totalReviews", String(data.totalReviews));

   
    if (data.amenities && typeof data.amenities === 'string') {
      const amenitiesArray = data.amenities
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item) 
        .map((item: string) => item.replace(/"/g, '')); 
      formData.append("amenities", JSON.stringify(amenitiesArray));
    } else {
      formData.append("amenities", JSON.stringify([])); 
    }

   
    if (data.availableDates && typeof data.availableDates === 'string') {
        const datesArray = data.availableDates
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => /^\d{4}-\d{2}-\d{2}$/.test(item)); 
        formData.append("availableDates", JSON.stringify(datesArray));
    } else {
      formData.append("availableDates", JSON.stringify([])); 
    }


    
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append("images", file); 
      });
    }
   
    try {
      const config = {
        headers: {
        
        },
      };

      let response;
      if (editingProperty) {
   
        response = await axios.put(
          `${API_URL}/api/products/${editingProperty._id}`,
          formData,
          config
        );
        setSuccess("Property updated successfully!");
      } else {
     
        response = await axios.post(
          `${API_URL}/api/products`,
          formData,
          config
        );
        setSuccess("Property added successfully!");
      }

      reset(); 
      setEditingProperty(null); 
      setSelectedFiles([]); 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      await fetchProperties(); 
    } catch (error: any) {
      console.error("Error saving property", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to save property. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }


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
    
      setProperties(prev => prev.filter(p => p._id !== id));
      if(editingProperty?._id === id) {
        cancelEdit(); 
      }
    } catch (error: any) {
      console.error("Error deleting property", error);
       const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete property. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }


  function startEdit(property: Property) {
    setEditingProperty(property);
    setSelectedFiles([]); 
    setError(null);
    setSuccess(null);



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

   
    const amenitiesString = Array.isArray(property.amenities) ? property.amenities.join(", ") : "";
    setValue("amenities", amenitiesString);

    const availableDatesString = Array.isArray(property.availableDates) ? property.availableDates.join(", ") : "";
    setValue("availableDates", availableDatesString);


   
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  
   async function deleteImage(imageUrlToDelete: string, propertyId: string) {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    
    if (isLoading) return;

    setIsLoading(true); 
    setError(null);
    setSuccess(null);

    try {
   
      await axios.put(
        `${API_URL}/api/products/${propertyId}/delete-image`,
        { imageUrl: imageUrlToDelete } 
      );

      setSuccess("Image deleted successfully!");

      setProperties(prevProperties =>
        prevProperties.map(p =>
          p._id === propertyId
            ? { ...p, images: p.images.filter(imgUrl => imgUrl !== imageUrlToDelete) }
            : p
        )
      );

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

  function cancelEdit() {
    setEditingProperty(null);
    setSelectedFiles([]);
    reset(); 
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    setSuccess(null);
  }

  const handleLogout = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true); 
    try {
      await signOut(auth);
      console.log("User logged out");
       setProperties([]);
       setEditingProperty(null);
    } catch (error) {
        console.error("Logout failed:", error);
        setError("Failed to log out. Please try again.");
    } finally {
       setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
  
     return null;
  }

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

     
      <div className="space-y-2">
        {error && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {success && (
            <Alert className="bg-green-100 border-green-400 text-green-800">
            <AlertDescription>{success}</AlertDescription>
            </Alert>
        )}
      </div>


     
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md shadow-sm bg-card">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {editingProperty ? `Edit Property: ${editingProperty.name}` : "Add New Property"}
        </h2>

      
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

      
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe the property's key features, atmosphere, and nearby attractions..."
            rows={3}
          />
         
        </div>

  
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

     
        <div className="space-y-1.5">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input
            id="amenities"
            {...register("amenities")}
            placeholder="WiFi, Pool, Kitchen, Air Conditioning, Free Parking"
          />
         
        </div>

       
         <div className="space-y-1.5">
            <Label htmlFor="availableDates">Available Dates (YYYY-MM-DD, comma-separated)</Label>
            <Input
                id="availableDates"
                {...register("availableDates", {
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

      
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="hostedBy">Hosted By *</Label>
            <Input
              id="hostedBy"
              {...register("hostedBy", { required: "Host name is required" })}
              placeholder="e.g., StayHere"
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
            accept="image/jpeg, image/png, image/webp, image/gif" 
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

     
      <div className="pt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Property Listings ({properties.length})</h2>

         
          {isLoading && properties.length === 0 && ( 
          <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          )}

         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property) => (
              <Card key={property._id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="grid grid-cols-2 gap-1 p-1 bg-muted/40">
                    {property.images && property.images.length > 0 ? (
                      property.images.map((image: string, index: number) => (
                        <div key={index} className="relative aspect-video group bg-gray-200"> 
                          <img
                            src={image}
                            alt={`${property.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                            loading="lazy" 
                            onError={(e) => (e.currentTarget.src = '/placeholder-image.png')} 
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
                  
                </div>

               
                <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                   
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
                           
                        </div>
                    </div>

                 
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
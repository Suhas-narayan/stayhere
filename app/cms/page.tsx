"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function PropertyManager() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties", error);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();

    // Append fields to formData
    Object.keys(data).forEach((key) => {
      if (key !== "images") {
        formData.append(key, data[key]);
      }
    });

    // Parse amenities from comma-separated string to array
    if (data.amenities) {
      const amenitiesArray = data.amenities.split(',').map(item => item.trim());
      // Clear any previous amenities entries
      formData.delete("amenities");
      // Add each amenity individually to maintain array structure
      amenitiesArray.forEach(amenity => {
        formData.append("amenities[]", amenity);
      });
    }

    // Parse availableDates from comma-separated string to array
    if (data.availableDates) {
      const datesArray = data.availableDates.split(',').map(item => item.trim());
      // Clear any previous dates entries
      formData.delete("availableDates");
      // Add each date individually to maintain array structure
      datesArray.forEach(date => {
        formData.append("availableDates[]", date);
      });
    }

    // Append files from our managed state rather than from form data
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append("images", file);
      });
    }

    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      if (editingProperty) {
        await axios.put(
          `${API_URL}/api/products/${editingProperty._id}`, 
          formData, 
          { 
            headers: { 
              "Content-Type": "multipart/form-data" 
            }
          }
        );
        setSuccess("Property updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/products`, 
          formData, 
          { 
            headers: { 
              "Content-Type": "multipart/form-data" 
            }
          }
        );
        setSuccess("Property added successfully!");
      }
      
      // Reset form and state
      reset();
      setEditingProperty(null);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchProperties();
    } catch (error) {
      console.error("Error saving property", error);
      setError(error.response?.data?.error || "Failed to save property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setSuccess("Property deleted successfully!");
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property", error);
      setError("Failed to delete property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(property) {
    setEditingProperty(property);
    setSelectedFiles([]);
    
    // Set form values
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
    
    // Handle arrays: convert to comma-separated strings
    setValue("amenities", property.amenities.join(", "));
    
    // Format dates for display in the form
    const formattedDates = property.availableDates.map(date => {
      // Handle both string dates and Date objects
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    });
    setValue("availableDates", formattedDates.join(", "));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteImage(imageUrl, propertyId) {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.put(
        `${API_URL}/api/products/${propertyId}/delete-image`, 
        { imageUrl }
      );
      setSuccess("Image deleted successfully!");
      fetchProperties();
    } catch (error) {
      console.error("Error deleting image", error);
      setError("Failed to delete image. Please try again.");
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
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 border-green-600 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md">
        <h2 className="text-xl font-semibold">
          {editingProperty ? "Edit Property" : "Add New Property"}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              {...register("name", { required: "Name is required" })} 
              placeholder="Property name"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              {...register("location", { required: "Location is required" })} 
              placeholder="City, Country"
            />
            {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            {...register("description", { required: "Description is required" })} 
            placeholder="Describe the property..."
            rows={4}
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (per night)</Label>
            <Input 
              id="price"
              type="number" 
              step="0.01"
              {...register("price", { 
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" }
              })} 
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beds">Beds</Label>
            <Input 
              id="beds"
              type="number" 
              {...register("beds", { 
                required: "Number of beds is required",
                min: { value: 1, message: "At least 1 bed required" }
              })} 
              placeholder="1"
            />
            {errors.beds && <p className="text-red-600 text-sm">{errors.beds.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input 
              id="bathrooms"
              type="number" 
              step="0.5"
              {...register("bathrooms", { 
                required: "Number of bathrooms is required",
                min: { value: 0.5, message: "At least 0.5 bathrooms required" }
              })} 
              placeholder="1"
            />
            {errors.bathrooms && <p className="text-red-600 text-sm">{errors.bathrooms.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guests">Max Guests</Label>
            <Input 
              id="guests"
              type="number" 
              {...register("guests", { 
                required: "Max guests is required",
                min: { value: 1, message: "At least 1 guest required" }
              })} 
              placeholder="2"
            />
            {errors.guests && <p className="text-red-600 text-sm">{errors.guests.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input 
            id="amenities"
            {...register("amenities", { required: "Amenities are required" })} 
            placeholder="WiFi, Pool, Kitchen, etc."
          />
          {errors.amenities && <p className="text-red-600 text-sm">{errors.amenities.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="availableDates">Available Dates (comma-separated)</Label>
          <Input 
            id="availableDates"
            {...register("availableDates", { required: "Available dates are required" })} 
            placeholder="2025-04-01, 2025-04-02, etc."
          />
          <p className="text-sm text-gray-500">Format: YYYY-MM-DD, comma-separated</p>
          {errors.availableDates && <p className="text-red-600 text-sm">{errors.availableDates.message}</p>}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hostedBy">Hosted By</Label>
            <Input 
              id="hostedBy"
              {...register("hostedBy", { required: "Host name is required" })} 
              placeholder="Host name"
            />
            {errors.hostedBy && <p className="text-red-600 text-sm">{errors.hostedBy.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ratings">Ratings (0-5)</Label>
            <Input 
              id="ratings"
              type="number" 
              step="0.1" 
              min="0" 
              max="5"
              {...register("ratings", { 
                required: "Rating is required",
                min: { value: 0, message: "Min rating is 0" },
                max: { value: 5, message: "Max rating is 5" }
              })} 
              placeholder="4.5"
            />
            {errors.ratings && <p className="text-red-600 text-sm">{errors.ratings.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalReviews">Total Reviews</Label>
            <Input 
              id="totalReviews"
              type="number" 
              min="0"
              {...register("totalReviews", { 
                required: "Number of reviews is required",
                min: { value: 0, message: "Cannot be negative" }
              })} 
              placeholder="0"
            />
            {errors.totalReviews && <p className="text-red-600 text-sm">{errors.totalReviews.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>
          <Input 
            id="images"
            type="file" 
            multiple 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-green-600 font-medium">
                {selectedFiles.length} file(s) selected
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingProperty ? "Update Property" : "Add Property"}
          </Button>
          
          {editingProperty && (
            <Button 
              type="button" 
              variant="outline"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      
      <h2 className="text-xl font-semibold mt-8">Property Listings</h2>
      
      {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Property Images Gallery */}
              <div className="grid grid-cols-2 gap-1 p-1">
                {property.images && property.images.length > 0 ? (
                  property.images.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <img 
                        src={image} 
                        alt={`${property.name} - Image ${index+1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                        onClick={() => deleteImage(image, property._id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No images</p>
                  </div>
                )}
              </div>
              
              {/* Property Details */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{property.name}</h2>
                <p className="text-sm text-gray-500">{property.location}</p>
                <p className="font-bold text-lg">${property.price}/night</p>
                
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">Details:</span> {property.beds} bed{property.beds !== 1 ? 's' : ''}, 
                    {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}, 
                    up to {property.guests} guest{property.guests !== 1 ? 's' : ''}
                  </p>
                  <p><span className="font-semibold">Amenities:</span> {property.amenities.join(", ")}</p>
                  <p><span className="font-semibold">Rating:</span> {property.ratings} ({property.totalReviews} reviews)</p>
                  <p><span className="font-semibold">Host:</span> {property.hostedBy}</p>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <Button 
                    onClick={() => startEdit(property)}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteProperty(property._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {properties.length === 0 && !isLoading && (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-500">No properties found. Add your first property above.</p>
          </div>
        )}
      </div>
    </div>
  );
}









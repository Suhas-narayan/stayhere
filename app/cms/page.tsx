// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useRouter } from "next/navigation"; // Updated import
// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function PropertyManager() {
//   const [properties, setProperties] = useState([]);
//   const [editingProperty, setEditingProperty] = useState(null);
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const router = useRouter();

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   async function fetchProperties() {
//     try {
//       const res = await axios.get(`${API_URL}/api/products`);
//       setProperties(res.data);
//     } catch (error) {
//       console.error("Error fetching properties", error);
//     }
//   }

//   async function onSubmit(data) {
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => formData.append(key, data[key]));
//     if (data.image.length > 0) formData.append("image", data.image[0]);

//     try {
//       if (editingProperty) {
//         await axios.put(`${API_URL}/api/products/${editingProperty._id}`, formData);
//       } else {
//         await axios.post(`${API_URL}/api/products`, formData);
//       }
//       reset();
//       setEditingProperty(null);
//       fetchProperties();
//     } catch (error) {
//       console.error("Error saving property", error);
//     }
//   }

//   async function deleteProperty(id) {
//     try {
//       await axios.delete(`${API_URL}/api/products/${id}`);
//       fetchProperties();
//     } catch (error) {
//       console.error("Error deleting property", error);
//     }
//   }

//   function startEdit(property) {
//     setEditingProperty(property);
//     Object.keys(property).forEach((key) => setValue(key, property[key]));
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <Label>Name</Label>
//         <Input {...register("name")} required />
//         <Label>Description</Label>
//         <Textarea {...register("description")} required />
//         <Label>Price</Label>
//         <Input type="number" {...register("price")} required />
//         <Label>Images</Label>
//         <Input type="file" {...register("image")} />
//         <Button type="submit">{editingProperty ? "Update" : "Add"} Property</Button>
//       </form>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {properties.map((property) => (
//           <Card key={property._id}>
//             <CardContent className="p-4 space-y-2">
//               <h2 className="text-lg font-semibold">{property.name}</h2>
//               <p>{property.description}</p>
//               <p className="font-bold">${property.price}</p>
//               <div className="flex space-x-2">
//                 <Button onClick={() => startEdit(property)}>Edit</Button>
//                 <Button variant="destructive" onClick={() => deleteProperty(property._id)}>Delete</Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PropertyManager() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  }

  async function onSubmit(data) {
    const formData = new FormData();

    // Append images
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => formData.append("images", file));
    }

    // Append other fields
    Object.keys(data).forEach((key) => {
      if (key !== "images") {
        if (key === "availableDates") {
          formData.append(
            "availableDates",
            JSON.stringify(data.availableDates.split(",").map(date => date.trim()))
          );
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    try {
      if (editingProperty) {
        await axios.put(`${API_URL}/api/products/${editingProperty._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      reset();
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error("Error saving property", error.response?.data || error.message);
    }
  }

  async function deleteProperty(id) {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property", error);
    }
  }

  function startEdit(property) {
    setEditingProperty(property);
    Object.keys(property).forEach((key) => setValue(key, property[key]));
  }

  async function deleteImage(imageUrl, propertyId) {
    try {
      await axios.put(`${API_URL}/api/products/${propertyId}/delete-image`, { imageUrl });
      fetchProperties();
    } catch (error) {
      console.error("Error deleting image", error);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Vacation Rentals</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Label>Name</Label>
        <Input {...register("name", { required: true })} />

        <Label>Description</Label>
        <Textarea {...register("description", { required: true })} />

        <Label>Location</Label>
        <Input {...register("location", { required: true })} />

        <Label>Price</Label>
        <Input type="number" {...register("price", { required: true })} />

        <Label>Beds</Label>
        <Input type="number" {...register("beds", { required: true })} />

        <Label>Bathrooms</Label>
        <Input type="number" {...register("bathrooms", { required: true })} />

        <Label>Guests</Label>
        <Input type="number" {...register("guests", { required: true })} />

        <Label>Amenities (comma-separated)</Label>
        <Input {...register("amenities", { required: true })} />

        <Label>Ratings</Label>
        <Input type="number" step="0.1" {...register("ratings", { required: true })} />

        <Label>Total Reviews</Label>
        <Input type="number" {...register("totalReviews", { required: true })} />

        <Label>Hosted By</Label>
        <Input {...register("hostedBy", { required: true })} />

        <Label>Available Dates (comma-separated)</Label>
        <Input {...register("availableDates", { required: true })} />

        <Label>Images</Label>
        <Input type="file" multiple {...register("images", { required: true })} />

        <Button type="submit">{editingProperty ? "Update" : "Add"} Property</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property._id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{property.name}</h2>
              <p>{property.description}</p>
              <p>{property.location}</p>
              <p className="font-bold">${property.price}</p>
              <p>Beds: {property.beds}, Bathrooms: {property.bathrooms}, Guests: {property.guests}</p>
              <p>Amenities: {property.amenities.join(", ")}</p>
              <p>Ratings: {property.ratings} ({property.totalReviews} reviews)</p>
              <p>Hosted By: {property.hostedBy}</p>
              <p>Available Dates: {property.availableDates.join(", ")}</p>
              <div className="grid grid-cols-2 gap-2">
                {property.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt="Property Image" className="w-full h-24 object-cover rounded" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => deleteImage(image, property._id)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => startEdit(property)}>Edit</Button>
                <Button variant="destructive" onClick={() => deleteProperty(property._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
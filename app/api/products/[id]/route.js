// import { connectDB } from "@/lib/db";
// import ProductModel from "../../../../models/product";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// export async function PUT(req, { params }) {
//     await connectDB();
//     const { id } = await params;
//     try {
//         const formData = await req.formData();
//         const name = formData.get("name")?.trim();
//         const description = formData.get("description")?.trim();
//         const price = parseFloat(formData.get("price"));
//         const hostedBy = formData.get("hostedBy")?.trim();
//         const beds = parseInt(formData.get("beds"));
//         const bathrooms = parseInt(formData.get("bathrooms"));
//         const totalGuests = parseInt(formData.get("totalGuests"));
//         const amenities = formData.get("amenities") ? JSON.parse(formData.get("amenities")) : null;
//         const location = formData.get("location")?.trim();
//         const availableDates = formData.get("availableDates") ? JSON.parse(formData.get("availableDates")) : null;
//         const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings")) : null;
//         const totalReviews = formData.get("totalReviews") ? parseInt(formData.get("totalReviews")) : null;
//         const imageFiles = formData.getAll("image");

//         const product = await ProductModel.findById(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }

//         if (name) product.name = name;
//         if (description) product.description = description;
//         if (price) product.price = price;
//         if (hostedBy) product.hostedBy = hostedBy;
//         if (beds) product.beds = beds;
//         if (bathrooms) product.bathrooms = bathrooms;
//         if (totalGuests) product.totalGuests = totalGuests;
//         if (amenities) product.amenities = amenities;
//         if (location) product.location = location;
//         if (availableDates) product.availableDates = availableDates;
//         if (ratings) product.ratings = ratings;
//         if (totalReviews) product.totalReviews = totalReviews;


//         if (imageFiles.length > 0 && imageFiles[0].name !== '') {
//             const imageUploadPromises = imageFiles.map(async (imageFile) => {
//                 const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
//                 return new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream(
//                         { folder: "vacation_rentals" },
//                         (error, result) => {
//                             if (error) reject(error);
//                             else resolve(result.secure_url);
//                         }
//                     );
//                     uploadStream.end(imageBuffer);
//                 });
//             });
//             const imageUrls = await Promise.all(imageUploadPromises);
//             product.images = imageUrls;
//         }

//         await product.save();
//         return NextResponse.json({ message: "Product updated successfully!", product });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }






// export async function DELETE(req,{ params }) {
//     await connectDB();
//     const { id } = await params;
//     try {
//         const product = await ProductModel.findByIdAndDelete(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }
//         return NextResponse.json({ message: "Product deleted successfully!" });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// export async function GET(req,{ params }) {
//     await connectDB();
//     const { id } = await params;

//     try {
//         console.log("🔍 Fetching product:", id);

//         const product = await ProductModel.findById(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }

//         return NextResponse.json({ product }, { status: 200 });
//     } catch (error) {
//         console.error("❌ Fetch Product Error:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }



// import { connectDB } from "@/lib/db";
// import ProductModel from "../../../../models/product";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function PUT(req, { params }) {
//     await connectDB();
//     const { id } = params;
//     try {
//         const formData = await req.formData();
//         const name = formData.get("name")?.trim();
//         const description = formData.get("description")?.trim();
//         const price = parseFloat(formData.get("price"));
//         const hostedBy = formData.get("hostedBy")?.trim();
//         const beds = parseInt(formData.get("beds"));
//         const bathrooms = parseInt(formData.get("bathrooms"));
//         const totalGuests = parseInt(formData.get("totalGuests"));
//         const location = formData.get("location")?.trim();
//         const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings")) : null;
//         const totalReviews = formData.get("totalReviews") ? parseInt(formData.get("totalReviews")) : null;

//         let amenities = [];
//         if (formData.get("amenities")) {
//             try {
//                 amenities = JSON.parse(formData.get("amenities"));
//             } catch (error) {
//                 return NextResponse.json({ error: "Invalid JSON format for amenities" }, { status: 400 });
//             }
//         }

//         let availableDates = [];
//         if (formData.get("availableDates")) {
//             try {
//                 availableDates = JSON.parse(formData.get("availableDates"));
//             } catch (error) {
//                 return NextResponse.json({ error: "Invalid JSON format for availableDates" }, { status: 400 });
//             }
//         }

//         const imageFiles = formData.getAll("image");
//         const product = await ProductModel.findById(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }

//         if (name) product.name = name;
//         if (description) product.description = description;
//         if (price) product.price = price;
//         if (hostedBy) product.hostedBy = hostedBy;
//         if (beds) product.beds = beds;
//         if (bathrooms) product.bathrooms = bathrooms;
//         if (totalGuests) product.totalGuests = totalGuests;
//         if (amenities.length > 0) product.amenities = amenities;
//         if (location) product.location = location;
//         if (availableDates.length > 0) product.availableDates = availableDates;
//         if (ratings) product.ratings = ratings;
//         if (totalReviews) product.totalReviews = totalReviews;

//         if (imageFiles.length > 0 && imageFiles[0].name !== "") {
//             const imageUploadPromises = imageFiles.map(async (imageFile) => {
//                 const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
//                 return new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream(
//                         { folder: "vacation_rentals" },
//                         (error, result) => {
//                             if (error) reject(error);
//                             else resolve(result.secure_url);
//                         }
//                     );
//                     uploadStream.end(imageBuffer);
//                 });
//             });
//             const imageUrls = await Promise.all(imageUploadPromises);
//             product.images = [...product.images, ...imageUrls];
//         }

//         await product.save();
//         return NextResponse.json({ message: "Product updated successfully!", product });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// export async function DELETE(req, { params }) {
//     await connectDB();
//     const { id } = params;
//     try {
//         const product = await ProductModel.findByIdAndDelete(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }
//         return NextResponse.json({ message: "Product deleted successfully!" });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// export async function GET(req, { params }) {
//     await connectDB();
//     const { id } = params;
//     try {
//         console.log("🔍 Fetching product:", id);
//         const product = await ProductModel.findById(id);
//         if (!product) {
//             return NextResponse.json({ error: "Product not found" }, { status: 404 });
//         }
//         return NextResponse.json({ product }, { status: 200 });
//     } catch (error) {
//         console.error("❌ Fetch Product Error:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }






import { connectDB } from "@/lib/db";
import ProductModel from "../../../../models/product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function for cloudinary upload
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "vacation_rentals" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export async function PUT(req, { params }) {
    console.log("PUT /api/products/[id] - Request received");
    
    try {
        await connectDB();
        const { id } =await params;
        
        // Find the product first to make sure it exists
        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        
        const formData = await req.formData();
        console.log("FormData keys:", [...formData.keys()]);
        
        // Extract all fields from the form data
        const name = formData.get("name")?.trim();
        const description = formData.get("description")?.trim();
        const priceStr = formData.get("price")?.trim();
        const price = priceStr ? parseFloat(priceStr) : null;
        const location = formData.get("location")?.trim();
        const bedsStr = formData.get("beds")?.trim();
        const beds = bedsStr ? parseInt(bedsStr) : null;
        const bathroomsStr = formData.get("bathrooms")?.trim();
        const bathrooms = bathroomsStr ? parseInt(bathroomsStr) : null;
        const guestsStr = formData.get("guests")?.trim();
        const guests = guestsStr ? parseInt(guestsStr) : null;
        const hostedBy = formData.get("hostedBy")?.trim();
        const ratingsStr = formData.get("ratings")?.trim();
        const ratings = ratingsStr ? parseFloat(ratingsStr) : null;
        const totalReviewsStr = formData.get("totalReviews")?.trim();
        const totalReviews = totalReviewsStr ? parseInt(totalReviewsStr) : null;
        
        // Handle amenities (comma-separated string from frontend)
        const amenitiesStr = formData.get("amenities")?.trim();
        const amenities = amenitiesStr 
            ? amenitiesStr.split(',').map(a => a.trim()).filter(a => a !== "") 
            : [];
            
        // Handle availableDates (comma-separated string from frontend)
        const availableDatesStr = formData.get("availableDates")?.trim();
        let availableDates = [];
        
        if (availableDatesStr) {
            availableDates = availableDatesStr
                .split(',')
                .map(d => d.trim())
                .filter(d => d !== "")
                .map(dateString => {
                    const dateObj = new Date(dateString);
                    if (isNaN(dateObj.getTime())) {
                        console.warn(`Invalid date string: "${dateString}"`);
                        return null;
                    }
                    return dateObj;
                })
                .filter(date => date !== null);
        }
        
        // Handle image files
        const imageFiles = formData.getAll("images");
        const validImageFiles = imageFiles.filter(file => 
            file instanceof File && file.size > 0 && file.name
        );
        
        console.log(`Found ${validImageFiles.length} valid image files`);
        
        // Upload new images if any
        let newImageUrls = [];
        if (validImageFiles.length > 0) {
            const uploadPromises = validImageFiles.map(async (file) => {
                console.log(`Uploading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                const buffer = Buffer.from(await file.arrayBuffer());
                return await uploadToCloudinary(buffer);
            });
            newImageUrls = await Promise.all(uploadPromises);
            console.log("Uploaded new images:", newImageUrls);
        }
        
        // Update the product with new values
        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== null) product.price = price;
        if (location) product.location = location;
        if (beds !== null) product.beds = beds;
        if (bathrooms !== null) product.bathrooms = bathrooms;
        if (guests !== null) product.guests = guests;
        if (hostedBy) product.hostedBy = hostedBy;
        if (ratings !== null) product.ratings = ratings;
        if (totalReviews !== null) product.totalReviews = totalReviews;
        
        // Always update arrays even if empty (user might want to clear them)
        product.amenities = amenities;
        product.availableDates = availableDates;
        
        // Add new images to existing ones
        if (newImageUrls.length > 0) {
            product.images = [...product.images, ...newImageUrls];
        }
        
        await product.save();
        console.log("Product updated successfully!");
        
        return NextResponse.json({ 
            message: "Product updated successfully!", 
            product 
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ 
            error: error.message || "Failed to update product" 
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await connectDB();
    const { id } =await params;
    try {
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Product deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    await connectDB();
    const { id } =await params;
    try {
        console.log("🔍 Fetching product:", id);
        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error("❌ Fetch Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
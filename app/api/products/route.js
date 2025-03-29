// import { connectDB } from "@/lib/db";
// import ProductModel from '../../../models/product'
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// export async function POST(req) {

//   await connectDB();

//   try {
//     const formData = await req.formData();

//     const name = formData.get("name")?.trim();
//     const description = formData.get("description")?.trim();
//     const price = formData.get("price") ? parseFloat(formData.get("price")) : null;
//     const availableDates = formData.get("availableDates") ? JSON.parse(formData.get("availableDates")) : [];
//     const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings")) : null;
//     const totalReviews = formData.get("totalReviews") ? parseInt(formData.get("totalReviews")) : null;
//     const hostedBy = formData.get("hostedBy")?.trim();
//     const beds = formData.get("beds") ? parseInt(formData.get("beds")) : null;
//     const bathrooms = formData.get("bathrooms") ? parseInt(formData.get("bathrooms")) : null;
//     const guests = formData.get("guests") ? parseInt(formData.get("guests")) : null;
//     const amenities = formData.get("amenities") ? JSON.parse(formData.get("amenities")) : [];
//     const location = formData.get("location")?.trim();


//     if (!name || !description || price === null || availableDates.length === 0 || ratings === null || totalReviews === null || !hostedBy || beds === null || bathrooms === null || guests === null || amenities.length === 0 || !location) {
//       return NextResponse.json({ error: "All fields (including images) are required!" }, { status: 400 });
//     }

//     const imageFiles = formData.getAll("image");
//     if (imageFiles.length === 0) {
//       return NextResponse.json({ error: "At least one image is required!" }, { status: 400 });
//     }

//     let imageUrls = [];
//     for (const file of imageFiles) {

//       const buffer = await file.arrayBuffer();
//       const base64Image = Buffer.from(buffer).toString("base64");

//       const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`);

//       imageUrls.push(uploadResponse.secure_url);
//     }

//     const newProduct = new ProductModel({
//       name,
//       description,
//       price,
//       availableDates,
//       ratings,
//       totalReviews,
//       hostedBy,
//       beds,
//       bathrooms,
//       guests,
//       amenities,
//       location,
//       images: imageUrls,  
//     });

//     await newProduct.save();

//     return NextResponse.json({ message: "Product created successfully!", product: newProduct }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// export async function GET() {
//   await connectDB();
//   try {
//     const products = await ProductModel.find();
//     return NextResponse.json(products);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };



// C:\Users\suhas\OneDrive\Desktop\v0\app\api\products\route.js
import { connectDB } from "@/lib/db"; 
import ProductModel from '../../../models/product'; 
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Optional: Ensure secure URLs are always generated
});

// --- Helper Function for Cloudinary Stream Upload ---
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "vacation_rentals" }, // Optional: Organize uploads
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Stream Error:", error);
                    reject(new Error("Image upload failed. " + error.message)); // Provide more context
                } else if (result?.secure_url) {
                    resolve(result); // Resolve with the full result object
                } else {
                     reject(new Error("Image upload failed to return a secure URL."));
                }
            }
        );
        // Pipe the buffer into the upload stream
        uploadStream.end(buffer);
    });
};

// --- POST Handler (Create Product) ---
export async function POST(req) {
    console.log("POST /api/products - Request received"); // Log request start

    try {
        // 1. Connect to Database
        await connectDB();
        console.log("Database connected.");

        // 2. Parse FormData
        const formData = await req.formData();
        console.log("FormData received. Parsing fields...");

        // 3. Extract and Validate Image Files
        const imageFiles = formData.getAll("images"); // *** CORRECTED KEY: "images" ***
        console.log(`Found ${imageFiles?.length ?? 0} file entries with key 'images'.`);

        // Robust check for actual files
        const validImageFiles = imageFiles.filter(file => file instanceof File && file.size > 0 && file.name);

        if (!validImageFiles || validImageFiles.length === 0) {
            console.log("Validation Error: No valid image files found.");
            return NextResponse.json({ error: "At least one valid image file is required!" }, { status: 400 });
        }
        console.log(`${validImageFiles.length} valid image files identified.`);

        // 4. Extract and Parse Other Fields (with defaults/validation)
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

        // Parse comma-separated strings (matching second frontend example)
        const amenitiesStr = formData.get("amenities")?.trim();
        const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()).filter(a => a !== "") : []; // Handle empty strings

        // --- Corrected Date Parsing ---
        const availableDatesStr = formData.get("availableDates")?.trim();
        let availableDates = []; // Initialize as empty array

        if (availableDatesStr) {
            const dateStrings = availableDatesStr.split(',')
                                      .map(d => d.trim())
                                      .filter(d => d !== ""); // Get clean date strings

            console.log("Parsed date strings:", dateStrings); // Log the strings

            availableDates = dateStrings.map(dateString => {
                const dateObj = new Date(dateString); // Attempt to create a Date object
                // Basic validation: Check if the date object is valid
                // Assumes dates are sent in a format JS Date constructor understands (like YYYY-MM-DD)
                if (isNaN(dateObj.getTime())) {
                    console.warn(`Invalid date string encountered: "${dateString}". Skipping.`);
                    return null; // Return null for invalid dates
                }
                return dateObj; // Return the valid Date object
            }).filter(dateObj => dateObj !== null); // Filter out any nulls from invalid dates
        }
        console.log("Converted Date objects:", availableDates); // Log the actual Date objects
        // --- End Corrected Date Parsing ---


        // Optional fields with defaults
        const ratingsStr = formData.get("ratings")?.trim();
        const ratings = ratingsStr ? parseFloat(ratingsStr) : 0; // Default to 0 if not provided/invalid
        const totalReviewsStr = formData.get("totalReviews")?.trim();
        const totalReviews = totalReviewsStr ? parseInt(totalReviewsStr) : 0; // Default to 0

        console.log("Parsed Fields:", { name, description, price, location, beds, bathrooms, guests, hostedBy, amenities, /* availableDates logged above */ ratings, totalReviews });

        // 5. Server-Side Validation
        // Add more specific checks as needed
        if (!name || !description || price === null || !location || beds === null || bathrooms === null || guests === null || !hostedBy) {
             console.log("Validation Error: Missing required text/numeric fields.");
             // Construct a more helpful error message
             const missingFields = [];
             if (!name) missingFields.push('name');
             if (!description) missingFields.push('description');
             if (price === null) missingFields.push('price');
             if (!location) missingFields.push('location');
             if (beds === null) missingFields.push('beds');
             if (bathrooms === null) missingFields.push('bathrooms');
             if (guests === null) missingFields.push('guests');
             if (!hostedBy) missingFields.push('hostedBy');
             return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
        }
        // Optional: Validate if dates were successfully parsed if required and input was provided
        if (availableDates.length === 0 && availableDatesStr) { // Check if input was given but all failed parsing
           console.log("Validation Error: Invalid format for available dates provided.");
           return NextResponse.json({ error: "Invalid format for available dates provided. Use YYYY-MM-DD or another standard format, comma-separated." }, { status: 400 });
        }


        // 6. Upload Images to Cloudinary
        console.log("Starting image uploads to Cloudinary...");
        let imageUrls = [];
        try {
            const uploadPromises = validImageFiles.map(async (file) => {
                console.log(`Uploading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                const buffer = Buffer.from(await file.arrayBuffer());
                const result = await uploadToCloudinary(buffer); // Use helper function
                console.log(`Uploaded ${file.name} successfully to ${result.secure_url}`);
                return result.secure_url;
            });
            imageUrls = await Promise.all(uploadPromises);
             console.log("All images uploaded successfully:", imageUrls);
        } catch (uploadError) {
            // This catch block handles errors within the upload process itself (e.g., from uploadToCloudinary helper)
            console.error("Error during Cloudinary upload process:", uploadError);
            // Clean up potentially uploaded images if needed (more advanced)
            return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
        }

        // Final check if somehow image URLs array is empty after successful uploads were expected
        if (imageUrls.length === 0) {
             console.error("Upload process completed but no image URLs were generated.");
             return NextResponse.json({ error: "Image processing failed unexpectedly." }, { status: 500 });
        }


        // 7. Create New Product Document
        console.log("Creating new ProductModel instance with Date objects...");
        const newProduct = new ProductModel({
            name,
            description,
            price,
            availableDates: availableDates, // *** Pass the array of Date objects ***
            ratings,
            totalReviews,
            hostedBy,
            beds,
            bathrooms,
            guests,
            amenities, // Use parsed array
            location,
            images: imageUrls, // Use URLs from Cloudinary
        });
        console.log("Product instance created (preview):", { ...newProduct.toObject(), images: `${imageUrls.length} images` }); // Log before save, shorten images

        // 8. Save to Database
        console.log("Saving product to database...");
        await newProduct.save();
        console.log("Product saved successfully with ID:", newProduct._id);

        // 9. Return Success Response
        return NextResponse.json({ message: "Product created successfully!", product: newProduct }, { status: 201 });

    } catch (error) {
        // --- Comprehensive Error Handling ---
        console.error("!!! TOP LEVEL CATCH BLOCK /api/products POST Error:", error);

        let statusCode = 500;
        let errorMessage = "An unexpected error occurred while creating the product.";

        // Handle specific error types if possible
        if (error.name === 'ValidationError') { // Mongoose validation error
            statusCode = 400;
            errorMessage = "Validation failed: " + Object.values(error.errors).map(e => e.message).join(', ');
        } else if (error.code === 11000) { // MongoDB duplicate key error
            statusCode = 409; // Conflict
            errorMessage = "A product with similar unique details already exists.";
        } else if (error.message?.includes("Image upload failed")) { // Capture errors from our helper
             statusCode = 500; // Or maybe 400 if client sent bad file? Decide based on error context.
             errorMessage = error.message;
        }
         else if (error.name === 'CastError') { // Handle potential CastErrors not caught by validation (less likely now)
             statusCode = 400;
             errorMessage = `Invalid data format for field ${error.path}: ${error.value}. Expected ${error.kind}.`;
         } else {
             errorMessage = error.message || errorMessage; // Use error message if available
        }
        console.log(`Responding with status ${statusCode}: ${errorMessage}`);
        return NextResponse.json({ error: errorMessage, details: error.stack }, { status: statusCode }); // Include stack in dev?
    }
}

// --- GET Handler (Fetch All Products) ---
export async function GET() {
    console.log("GET /api/products - Request received");
    try {
        await connectDB();
        console.log("Database connected for GET.");
        const products = await ProductModel.find().sort({ createdAt: -1 }); // Optional: sort newest first
        console.log(`Found ${products.length} products.`);
        return NextResponse.json(products); // Directly return the array
    } catch (error) {
        console.error("!!! /api/products GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch products due to an internal server error.", details: error.message }, { status: 500 });
    }
}


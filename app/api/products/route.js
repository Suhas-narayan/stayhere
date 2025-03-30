import { connectDB } from "@/lib/db"; 
import ProductModel from '../../../models/product'; 
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Helper function to clean string fields
const cleanString = (str) => {
    if (!str) return str;
    return str.replace(/["\\]/g, '').trim();
};

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "vacation_rentals" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Stream Error:", error);
                    reject(new Error("Image upload failed. " + error.message));
                } else if (result?.secure_url) {
                    resolve(result);
                } else {
                    reject(new Error("Image upload failed to return a secure URL."));
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export async function POST(req) {
    console.log("POST /api/products - Request received");

    try {
        await connectDB();
        console.log("Database connected.");

        const formData = await req.formData();
        console.log("FormData received. Parsing fields...");
        
        // Debug logging
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value}`);
        }

        // Handle image files
        const imageFiles = formData.getAll("images");
        const validImageFiles = imageFiles.filter(file => file instanceof File && file.size > 0 && file.name);

        if (validImageFiles.length === 0) {
            console.log("Validation Error: No valid image files found.");
            return NextResponse.json({ error: "At least one valid image file is required!" }, { status: 400 });
        }
        console.log(`${validImageFiles.length} valid image files identified.`);

        // Extract and clean all fields
        const name = cleanString(formData.get("name"));
        const description = cleanString(formData.get("description"));
        const priceStr = cleanString(formData.get("price"));
        const price = priceStr ? parseFloat(priceStr) : null;
        const location = cleanString(formData.get("location"));
        const bedsStr = cleanString(formData.get("beds"));
        const beds = bedsStr ? parseInt(bedsStr) : null;
        const bathroomsStr = cleanString(formData.get("bathrooms"));
        const bathrooms = bathroomsStr ? parseInt(bathroomsStr) : null;
        const guestsStr = cleanString(formData.get("guests"));
        const guests = guestsStr ? parseInt(guestsStr) : null;
        const hostedBy = cleanString(formData.get("hostedBy"));
        const ratingsStr = cleanString(formData.get("ratings"));
        const ratings = ratingsStr ? parseFloat(ratingsStr) : 0;
        const totalReviewsStr = cleanString(formData.get("totalReviews"));
        const totalReviews = totalReviewsStr ? parseInt(totalReviewsStr) : 0;

        // Handle amenities
        let amenities = [];
        const rawAmenities = formData.get("amenities");
        if (rawAmenities) {
            try {
                if (rawAmenities.startsWith('[')) {
                    // Parse as JSON array and clean each item
                    amenities = JSON.parse(rawAmenities)
                        .map(item => cleanString(item))
                        .filter(item => item);
                } else {
                    // Handle comma-separated string
                    amenities = rawAmenities.split(',')
                        .map(item => cleanString(item))
                        .filter(item => item);
                }
            } catch (error) {
                console.error("Error parsing amenities:", error);
                amenities = [];
            }
        }
        console.log("Parsed amenities:", amenities);

        // Handle availableDates
        let availableDates = [];
        const rawAvailableDates = formData.get("availableDates");
        if (rawAvailableDates) {
            try {
                if (rawAvailableDates.startsWith('[')) {
                    availableDates = JSON.parse(rawAvailableDates)
                        .map(dateStr => {
                            const dateObj = new Date(dateStr);
                            return isNaN(dateObj.getTime()) ? null : dateObj;
                        })
                        .filter(date => date !== null);
                } else {
                    availableDates = rawAvailableDates.split(',')
                        .map(d => d.trim())
                        .filter(d => d !== "")
                        .map(dateStr => {
                            const dateObj = new Date(dateStr);
                            return isNaN(dateObj.getTime()) ? null : dateObj;
                        })
                        .filter(date => date !== null);
                }
            } catch (error) {
                console.error("Error parsing availableDates:", error);
            }
        }
        console.log("Parsed availableDates:", availableDates.map(d => d.toISOString()));

        // Validation
        if (!name || !description || price === null || !location || beds === null || bathrooms === null || guests === null || !hostedBy) {
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

        // Upload images
        let imageUrls = [];
        try {
            imageUrls = await Promise.all(
                validImageFiles.map(async (file) => {
                    console.log(`Uploading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const result = await uploadToCloudinary(buffer);
                    console.log(`Uploaded ${file.name} successfully to ${result.secure_url}`);
                    return result.secure_url;
                })
            );
        } catch (uploadError) {
            console.error("Error during Cloudinary upload process:", uploadError);
            return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
        }

        if (imageUrls.length === 0) {
            console.error("Upload process completed but no image URLs were generated.");
            return NextResponse.json({ error: "Image processing failed unexpectedly." }, { status: 500 });
        }

        // Create and save product
        const newProduct = new ProductModel({
            name,
            description,
            price,
            availableDates,
            ratings,
            totalReviews,
            hostedBy,
            beds,
            bathrooms,
            guests,
            amenities,
            location,
            images: imageUrls,
        });

        await newProduct.save();
        console.log("Product saved successfully with ID:", newProduct._id);

        return NextResponse.json({ 
            message: "Product created successfully!", 
            product: {
                ...newProduct.toObject(),
                availableDates: newProduct.availableDates.map(d => d.toISOString())
            }
        }, { status: 201 });

    } catch (error) {
        console.error("!!! TOP LEVEL CATCH BLOCK /api/products POST Error:", error);

        let statusCode = 500;
        let errorMessage = "An unexpected error occurred while creating the product.";

        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = "Validation failed: " + Object.values(error.errors).map(e => e.message).join(', ');
        } else if (error.code === 11000) {
            statusCode = 409;
            errorMessage = "A product with similar unique details already exists.";
        } else if (error.message?.includes("Image upload failed")) {
            statusCode = 500;
            errorMessage = error.message;
        } else if (error.name === 'CastError') {
            statusCode = 400;
            errorMessage = `Invalid data format for field ${error.path}: ${error.value}. Expected ${error.kind}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}

export async function GET() {
    console.log("GET /api/products - Request received");
    try {
        await connectDB();
        console.log("Database connected for GET.");
        
        const products = await ProductModel.find().sort({ createdAt: -1 });
        console.log(`Found ${products.length} products.`);
        
        // Clean the products data before returning
        const cleanedProducts = products.map(product => ({
            ...product.toObject(),
            name: cleanString(product.name),
            description: cleanString(product.description),
            location: cleanString(product.location),
            hostedBy: cleanString(product.hostedBy),
            amenities: product.amenities.map(amenity => cleanString(amenity)),
            availableDates: product.availableDates
        }));
        
        return NextResponse.json(cleanedProducts);
    } catch (error) {
        console.error("!!! /api/products GET Error:", error);
        return NextResponse.json({ 
            error: "Failed to fetch products due to an internal server error.",
            details: error.message 
        }, { status: 500 });
    }
}
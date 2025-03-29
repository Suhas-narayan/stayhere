import { connectDB } from "@/lib/db";
import ProductModel from "../../../../../models/product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
    console.log("PUT /api/products/[id]/delete-image - Request received");
    try {
        await connectDB();
        const { id } = params;
        
        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        
        const { imageUrl } = await req.json();
        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }
        
        console.log(`Deleting image ${imageUrl} from product ${id}`);
        
        // Remove the image from the product's images array
        product.images = product.images.filter(img => img !== imageUrl);
        
        // Optional: Delete from Cloudinary too
        try {
            // Extract public_id from the URL
            const urlParts = imageUrl.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1];
            const publicId = 'vacation_rentals/' + filenameWithExt.split('.')[0];
            
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
            console.error("Error deleting image from Cloudinary:", cloudinaryError);
            // Continue even if Cloudinary delete fails
        }
        
        await product.save();
        
        return NextResponse.json({ 
            message: "Image deleted successfully", 
            product 
        });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
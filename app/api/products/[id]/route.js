import { connectDB } from "@/lib/db";
import ProductModel from "../../../../models/product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function PUT(req, { params }) {
    await connectDB();
    const { id } = params;

    try {
        const formData = await req.formData();
        const name = formData.get("name")?.trim();
        const description = formData.get("description")?.trim();
        const price = parseFloat(formData.get("price"));
        const hostedBy = formData.get("hostedBy")?.trim();
        const beds = parseInt(formData.get("beds"));
        const bathrooms = parseInt(formData.get("bathrooms"));
        const totalGuests = parseInt(formData.get("totalGuests"));
        const amenities = formData.get("amenities") ? JSON.parse(formData.get("amenities")) : null;
        const location = formData.get("location")?.trim();
        const availableDates = formData.get("availableDates") ? JSON.parse(formData.get("availableDates")) : null;
        const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings")) : null;
        const totalReviews = formData.get("totalReviews") ? parseInt(formData.get("totalReviews")) : null;
        const imageFiles = formData.getAll("image");

        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (hostedBy) product.hostedBy = hostedBy;
        if (beds) product.beds = beds;
        if (bathrooms) product.bathrooms = bathrooms;
        if (totalGuests) product.totalGuests = totalGuests;
        if (amenities) product.amenities = amenities;
        if (location) product.location = location;
        if (availableDates) product.availableDates = availableDates;
        if (ratings) product.ratings = ratings;
        if (totalReviews) product.totalReviews = totalReviews;


        if (imageFiles.length > 0 && imageFiles[0].name !== '') {
            const imageUploadPromises = imageFiles.map(async (imageFile) => {
                const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "vacation_rentals" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(imageBuffer);
                });
            });
            const imageUrls = await Promise.all(imageUploadPromises);
            product.images = imageUrls;
        }

        await product.save();
        return NextResponse.json({ message: "Product updated successfully!", product });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    await connectDB();
    const { id } = params;
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
    const { id } = params;

    try {
        console.log("🔍 Fetching product:", id);

        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("❌ Fetch Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


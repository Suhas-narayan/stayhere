import { connectDB } from "@/lib/db";
import ProductModel from '../../../models/product'
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req) {

  await connectDB();

  try {
    const formData = await req.formData();

    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const price = formData.get("price") ? parseFloat(formData.get("price")) : null;
    const availableDates = formData.get("availableDates") ? JSON.parse(formData.get("availableDates")) : [];
    const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings")) : null;
    const totalReviews = formData.get("totalReviews") ? parseInt(formData.get("totalReviews")) : null;
    const hostedBy = formData.get("hostedBy")?.trim();
    const beds = formData.get("beds") ? parseInt(formData.get("beds")) : null;
    const bathrooms = formData.get("bathrooms") ? parseInt(formData.get("bathrooms")) : null;
    const guests = formData.get("guests") ? parseInt(formData.get("guests")) : null;
    const amenities = formData.get("amenities") ? JSON.parse(formData.get("amenities")) : [];
    const location = formData.get("location")?.trim();


    if (!name || !description || price === null || availableDates.length === 0 || ratings === null || totalReviews === null || !hostedBy || beds === null || bathrooms === null || guests === null || amenities.length === 0 || !location) {
      return NextResponse.json({ error: "All fields (including images) are required!" }, { status: 400 });
    }

    const imageFiles = formData.getAll("image");
    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "At least one image is required!" }, { status: 400 });
    }

    let imageUrls = [];
    for (const file of imageFiles) {

      const buffer = await file.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");

      const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`);

      imageUrls.push(uploadResponse.secure_url);
    }

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

    return NextResponse.json({ message: "Product created successfully!", product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
  await connectDB();
  try {
    const products = await ProductModel.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export const config = {
  api: {
    bodyParser: false,
  },
};



import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availableDates: { type: [Date], required: true },
  ratings: { type: Number, required: true },
  totalReviews: { type: Number, required: true },
  hostedBy: { type: String, required: true },
  beds: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  amenities: { type: [String], required: true },
  location: { type: String, required: true },
  images: { type: [String], required: true },
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default ProductModel;


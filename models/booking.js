import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { email: String, name: String },
  checkIn: String,
  checkOut: String,
  status: { type: String, default: "pending" },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

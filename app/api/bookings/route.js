import { connectDB } from "@/lib/db";
import Booking from "@/models/booking";

export async function POST(req) {
  await connectDB();
  const { productId, user, checkIn, checkOut } = await req.json();
  const booking = await Booking.create({ productId, user, checkIn, checkOut });
  return Response.json(booking, { status: 201 });
}

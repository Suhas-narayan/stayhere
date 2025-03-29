import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email, propertyName, dates, amount } = await request.json();

  // Create a test account (only for development)
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Vacation Rentals" <bookings@vacationrentals.com>',
      to: email,
      subject: `Booking Confirmation for ${propertyName}`,
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for booking ${propertyName}!</p>
        <p><strong>Dates:</strong> ${dates}</p>
        <p><strong>Total Paid:</strong> $${amount}</p>
        <p>We look forward to hosting you!</p>
      `,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
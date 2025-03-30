import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, propertyName, dates, amount, guestName } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your StayHere Booking Confirmation: ${propertyName}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background: #2563eb; padding: 20px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Booking Confirmation</h1>
          </div>
          
          <div style="padding: 20px; color: #333;">
            <p style="font-size: 18px;">Dear <strong>${guestName}</strong>,</p>
            <p>We are pleased to confirm your booking at <strong>${propertyName}</strong>. Below are your booking details:</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>📅 Dates:</strong> ${dates}</p>
              <p style="margin: 8px 0;"><strong>💰 Total Amount:</strong> $${amount}</p>
            </div>

            <p>If you have any questions regarding your stay, feel free to reply to this email. Our team is here to assist you.</p>

            <p style="text-align: center; font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 30px;">
              Thank you for booking with StayHere! 🌟
            </p>
          </div>

          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">StayHere Team | Need help? Contact us at support@stayhere.com</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ 
      success: true,
      messageId: info.messageId 
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

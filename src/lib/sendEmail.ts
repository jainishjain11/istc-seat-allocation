// src/lib/sendEmail.ts
import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ISTC Portal" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your OTP for ISTC Login',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  });
}

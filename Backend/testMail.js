import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load Gmail credentials

console.log("Testing Gmail login with:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP error:", error);
  } else {
    console.log("✅ SMTP is ready to send mail!");
  }
});

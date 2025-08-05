import express from "express";
import sendOfferLetterEmail from "../utils/mailer.js";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/send-offer-letter", async (req, res) => {
  console.log("📩 Incoming request body:", req.body);

  try {
    const {
      name,
      registerNo,
      phone,
      email,
      domain,
      fromDate,
      toDate,
      company,
      department,
      college,
      companyWebsite,
    } = req.body;

    if (!name || !registerNo || !phone || !email || !domain || !fromDate || !toDate || !company || !department || !college) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const isSent = await sendOfferLetterEmail({
      name,
      registerNo,
      phone,
      email,
      domain,
      fromDate,
      toDate,
      company,
      department,
      college,
      companyWebsite,
    });

    await Student.create({
      name,
      registerNo,
      phone,
      email,
      domain,
      fromDate,
      toDate,
      company,
      department,
      college,
      companyWebsite,
      status: isSent ? "Sent" : "Failed",
    });

    res.json({
      success: true,
      message: isSent
        ? "✅ Offer letter sent successfully & saved in database!"
        : "⚠️ Email failed but student record saved.",
    });

  } catch (error) {
    console.error("❌ Backend Email Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

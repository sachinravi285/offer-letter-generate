import express from "express";
import sendOfferLetterEmail from "../utils/mailer.js";

const router = express.Router();

router.post("/send-offer-letter", async (req, res) => {
  console.log("📩 Incoming request body:", req.body);

  try {
    const { name, registerNo, phone, email, domain, fromDate, toDate, company, department, college, companyWebsite } = req.body;

    // ✅ Validation
    if (!name || !registerNo || !phone || !email || !domain || !fromDate || !toDate || !company) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    console.log(`✅ Preparing to send email to ${email} for ${company}`);

    await sendOfferLetterEmail({
      name,
      registerNo,
      phone,
      email,
      domain,
      fromDate,
      toDate,
      company,
      department,        // ✅ Now passing department
      college,           // ✅ Now passing college
      companyWebsite 
    });

    console.log("✅ Email sent successfully!");
    res.json({ success: true, message: "Offer letter sent successfully!" });
  } catch (error) {
    console.error("❌ Backend Email Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
});

export default router;

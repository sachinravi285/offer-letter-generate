import express from "express";
import Student from "../models/Student.js";
import sendOfferLetterEmail from "../utils/mailer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const sent = await Student.countDocuments({ status: "Sent" });
    const failed = await Student.countDocuments({ status: "Failed" });
    const pending = total - (sent + failed);
    res.json({ total, sent, failed, pending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: "❌ Student not found!" });

    res.json({ message: "✅ Student updated successfully!", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/resend-offer-letter", async (req, res) => {
  try {
    const {
      _id,
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

    if (!_id || !email) {
      return res.status(400).json({ message: "❌ Missing student ID or email!" });
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

    const updated = await Student.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        status: isSent ? "Sent" : "Failed",
      },
      { new: true }
    );

    res.json({
      success: true,
      message: isSent
        ? `✅ Resent offer letter successfully to ${email}`
        : `⚠️ Resend failed for ${email}`,
      student: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

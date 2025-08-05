import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNo: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  college: { type: String, required: true },
  domain: { type: String, required: true },
  company: { type: String, required: true },
  companyWebsite: String,
  fromDate: String,
  toDate: String,
  status: { type: String, default: "Pending" }, // Pending / Sent / Failed
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);

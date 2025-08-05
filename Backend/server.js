import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import offerLetterRoute from "./routes/offerLetter.js";
import studentRoutes from "./routes/student.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/offerletterdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

app.use("/api", offerLetterRoute);
app.use("/api/students", studentRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));

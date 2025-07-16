import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env before anything else

console.log("DEBUG ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "PASS OK" : "PASS MISSING");

import express from "express";
import cors from "cors";
import offerLetterRoute from "./routes/offerLetter.js";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API route for sending offer letters
app.use("/api", offerLetterRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

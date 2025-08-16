import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

import patientRoutes from "./routes/patientRoutes.js";
import detailsRoutes from "./routes/detailsRoutes.js";
import BackupRoutes from "./routes/BackupRouter.js";
import authRouter from "./routes/authRouter.js";

// For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "frontend/dist")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serve static files from Cloudinary uploads if any local storage is used

// Routes
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/details", detailsRoutes);
app.use("/api/v1/backup", BackupRoutes);
app.use("/api/v1/auth", authRouter);

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist", "index.html"));
});
// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

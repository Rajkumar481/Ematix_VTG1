import express from "express";
import {
  backupAllImages,
  backupImagesByDate,
  deleteAllImages,
  deleteImagesByDate,
} from "../utils/BacupImagesByDate.js";

const router = express.Router();

// 1. Backup images by date range
router.get("/by-date", backupImagesByDate);

// 2. Backup all images
router.get("/all", backupAllImages);

// 3. Delete images by date range
router.delete("/delete/by-date", deleteImagesByDate);

// 4. Delete all images
router.delete("/delete/all", deleteAllImages);

export default router;

import express from "express";
import upload from "../middleware/upload.js";
import {
  createPatientDetails,
  getAllPatientDetails,
  getPatientDetailsById,
  updatePatientDetails,
  deletePatientDetails,
  uploadImages,
  backupImages,
  getPatientDetailsByPatientId,
} from "../controllers/detailsController.js";

const router = express.Router();

router.post("/", upload.array("images", 10), createPatientDetails);
router.get("/", getAllPatientDetails);
router.get("/:id", getPatientDetailsById);
router.patch("/:id", upload.any(), updatePatientDetails);

router.delete("/:id", deletePatientDetails);
router.get("/bypatient/:id", getPatientDetailsByPatientId);

// Image upload route — uses multer middleware
router.post("/upload/:id", upload.array("images", 10), uploadImages);

// Download ZIP
router.get("/backup/:id", backupImages);

export default router;

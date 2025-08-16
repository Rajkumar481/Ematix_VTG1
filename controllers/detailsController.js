import PatientDetails from "../models/details.js";
import Patient from "../models/patient.js";
import path from "path";
import { downloadAndZipImages } from "../utils/zipImages.js";
import cloudinary from "../config/cloudinary.js";
import DatauriParser from "datauri/parser.js";
import pathLib from "path";

const parser = new DatauriParser();

function formatBufferToBase64(file) {
  return parser.format(
    pathLib.extname(file.originalname).toString(),
    file.buffer
  );
}

export const createPatientDetails = async (req, res) => {
  try {
    const {
      patient,
      medicineTakenPatient,
      mode,
      nextVisitMode,
      medicineName,
      SGPT,
      SGOT,
      totalBilirubin,
    } = req.body;

    // Validate required fields
    if (!patient || !medicineTakenPatient) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("📩 Incoming Data:", req.body);

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const file64 = formatBufferToBase64(file);
        const uploaded = await cloudinary.uploader.upload(file64.content, {
          folder: "patients",
        });
        imageUrls.push(uploaded.secure_url);
      }
    }

    // Fetch Patient document
    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Use today as the start date
    const start = new Date();
    const medDays = parseInt(medicineTakenPatient, 10);

    // Next visit = today + medDays
    const nextVisit = new Date(start);
    nextVisit.setDate(start.getDate() + medDays);

    // Calculate total already taken (from PatientDetails)
    const pastDetails = await PatientDetails.find({ patient });
    const totalTaken = pastDetails.reduce(
      (acc, detail) => acc + parseInt(detail.medicineTakenPatient || "0", 10),
      0
    );

    const prescribedDays = parseInt(patientDoc.daysTakenMedicine || "0", 10);
    const alreadyAssigned = totalTaken;
    const remainingBefore = prescribedDays - alreadyAssigned;

    console.log("🧮 Already taken (from entries):", totalTaken);
    console.log("📆 Prescribed (from Patient model):", prescribedDays);
    console.log("➕ Current to give:", medDays);
    console.log("🔁 Remaining before add:", remainingBefore);

    if (medDays > remainingBefore) {
      return res.status(400).json({
        message: `Cannot assign ${medDays} days. Only ${remainingBefore} days left.`,
      });
    }

    const remainingAfter = remainingBefore - medDays;

    // Determine progress
    const progress =
      req.body.progress || (new Date() > nextVisit ? "pending" : "done");

    // Create patient detail entry
    const newDetails = new PatientDetails({
      patient,
      startDate: start,
      medicineTakenPatient: medDays,
      nextVisit,
      progress,
      medicineName,
      SGPT,
      SGOT,
      totalBilirubin,
      mode,
      nextVisitMode,
      images: imageUrls,
    });

    await newDetails.save();

    // 🔁 Reduce pending days in Patient model (updated logic)
    patientDoc.pendingDays = remainingAfter.toString();
    await patientDoc.save();

    console.log("✅ New patient detail saved:", newDetails._id);

    return res.status(201).json(newDetails);
  } catch (err) {
    console.error("❌ Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

/**
 * @desc Get all patient details
 * @route GET /api/details
 */
export const getAllPatientDetails = async (req, res) => {
  try {
    const allDetails = await PatientDetails.find().populate("patient");

    // Filter out entries where patient is null (e.g., deleted or not found)
    const filteredDetails = allDetails.filter(
      (detail) => detail.patient !== null
    );

    res.json(filteredDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Get patient details by ID
 * @route GET /api/details/:id
 */
export const getPatientDetailsById = async (req, res) => {
  try {
    const detail = await PatientDetails.findById(req.params.id).populate(
      "patient"
    );
    if (!detail) {
      return res.status(404).json({ message: "Patient details not found" });
    }
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getPatientDetailsByPatientId = async (req, res) => {
  try {
    const details = await PatientDetails.find({
      patient: req.params.id,
    }).populate("patient");

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "No patient details found" });
    }

    res.json(details); // return array of matching details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Update patient details
 * @route PUT /api/details/:id
 */
export const updatePatientDetails = async (req, res) => {
  console.log(req.body);

  try {
    const { id } = req.params;
    const {
      patient,
      startDate,
      medicineTakenPatient,
      mode,
      nextVisitMode,
      medicineName,
      SGPT,
      SGOT,
      totalBilirubin,
    } = req.body;

    if (!patient || !startDate || !medicineTakenPatient) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingDetails = await PatientDetails.findById(id);
    if (!existingDetails) {
      return res.status(404).json({ message: "Patient details not found" });
    }

    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const file64 = formatBufferToBase64(file);
        const uploaded = await cloudinary.uploader.upload(file64.content, {
          folder: "patients",
        });
        imageUrls.push(uploaded.secure_url);
      }
    }

    const start = new Date(startDate);
    const medDays = parseInt(medicineTakenPatient, 10);

    // Calculate the difference in medicine days (new - old)
    const previousMedDays = parseInt(
      existingDetails.medicineTakenPatient || "0",
      10
    );
    const difference = medDays - previousMedDays;

    // Update pending days by subtracting this difference
    const newPendingDays =
      parseInt(patientDoc.pendingDays || "0", 10) - difference;

    // Prevent going below 0 (optional)
    if (newPendingDays < 0) {
      return res.status(400).json({
        message: `Cannot assign ${medDays} days. Only ${parseInt(
          patientDoc.pendingDays
        )} days left.`,
      });
    }

    patientDoc.pendingDays = newPendingDays.toString();
    await patientDoc.save();

    const nextVisit = new Date(start);
    nextVisit.setDate(start.getDate() + medDays + 1);

    const progress = new Date() > nextVisit ? "pending" : "done";

    existingDetails.startDate = start;
    existingDetails.medicineTakenPatient = medDays;
    existingDetails.nextVisit = nextVisit;
    existingDetails.progress = progress;
    existingDetails.mode = mode || existingDetails.mode;
    existingDetails.nextVisitMode =
      nextVisitMode || existingDetails.nextVisitMode;
    existingDetails.medicineName = medicineName || existingDetails.medicineName;
    existingDetails.SGPT = SGPT || existingDetails.SGPT;
    existingDetails.SGOT = SGOT || existingDetails.SGOT;
    existingDetails.totalBilirubin =
      totalBilirubin || existingDetails.totalBilirubin;

    if (imageUrls.length > 0) {
      existingDetails.images = [...existingDetails.images, ...imageUrls];
    }

    await existingDetails.save();

    return res.status(200).json(existingDetails);
  } catch (err) {
    console.error("❌ Error updating patient details:", err);
    return res.status(500).json({
      message: "Error updating patient details",
      error: err.message,
    });
  }
};

/**
 * @desc Delete patient details
 * @route DELETE /api/details/:id
 */
export const deletePatientDetails = async (req, res) => {
  try {
    const deleted = await PatientDetails.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Patient details not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Upload images
 * @route POST /api/details/upload/:id
 */
export const uploadImages = async (req, res) => {
  try {
    const { id } = req.params;
    const urls = req.files.map((file) => file.path); // or file.filename if using local

    const updatedPatient = await PatientDetails.findByIdAndUpdate(
      id,
      { $push: { images: { $each: urls } } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Images uploaded", patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Backup patient images as ZIP
 * @route GET /api/details/backup/:id
 */
export const backupImages = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await PatientDetails.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const zipPath = path.resolve("backups", `${id}_backup.zip`);
    await downloadAndZipImages(patient.images, zipPath);

    res.download(zipPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

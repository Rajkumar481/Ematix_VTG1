import Patient from "../models/patient.js";
export const createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      gender,
      address,
      diagnosis,
      symptoms,
      daysTakenMedicine,
    } = req.body;

    const existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    const newPatient = new Patient({
      name,
      age,
      phone,
      gender,
      address,
      diagnosis,
      symptoms,
      daysTakenMedicine,
      pendingDays: daysTakenMedicine,
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Phone number must be unique" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patient by ID
export const updatePatient = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      gender,
      address,
      diagnosis,
      symptoms,
      daysTakenMedicine,
      additionalDays,
    } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.name = name ?? patient.name;
    patient.age = age ?? patient.age;
    patient.phone = phone ?? patient.phone;
    patient.gender = gender ?? patient.gender;
    patient.address = address ?? patient.address;
    patient.symptoms = symptoms ?? patient.symptoms;

    patient.diagnosis =
      Array.isArray(diagnosis)
        ? diagnosis
        : typeof diagnosis === "string"
          ? diagnosis.split(",").map((d) => d.trim())
          : patient.diagnosis;

    if (daysTakenMedicine !== undefined && (!additionalDays || additionalDays === "0")) {
      patient.daysTakenMedicine = daysTakenMedicine;
    }

    if (additionalDays && additionalDays !== "0") {
      const prevDays = parseInt(patient.daysTakenMedicine || "0", 10);
      const extraDays = parseInt(additionalDays, 10);
      const newDays = prevDays + extraDays;

      const prevPending = parseInt(patient.pendingDays || "0", 10);
      const newPending = prevPending + extraDays;

      patient.daysTakenMedicine = newDays.toString();
      patient.pendingDays = newPending.toString();
      patient.additionalDays = additionalDays;
    }
    //  const existingPatient = await Patient.findOne({ phone });
    // if (existingPatient) {
    //   return res.status(400).json({ error: "Phone number already exists" });
    // }

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

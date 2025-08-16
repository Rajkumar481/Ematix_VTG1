import mongoose from "mongoose";

const patientDetailsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    startDate: {
      type: String,
    },
    medicineTakenPatient: {
      type: String,
    },
    nextVisit: {
      type: String,
      // validate: {
      //   validator: function (value) {
      //     return !value || value >= new Date();
      //   },
      //   message: "Next visit must be today or in the future",
      // },
    },
    progress: {
      type: String,
      enum: ["done", "pending", "clear"],
      default: "pending",
    },
    images: {
      type: [String],
      default: [],
    },
    mode: {
      type: String,
      enum: ["clinic", "courier", "branch"],
      default: "branch",
    },
    nextVisitMode: {
      type: String,
      enum: ["clinic", "courier", "branch"],
      default: "clinic",
    },
    medicineName: {
      type: String,
    },
    totalBilirubin: {
      type: String,
    },
    SGPT: {
      type: String,
    },
    SGOT: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PatientDetails", patientDetailsSchema);

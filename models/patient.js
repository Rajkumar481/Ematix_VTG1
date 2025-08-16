import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    phone: {
      type: String,
      unique: true, 
      required: true, 
      trim: true,
    },
    gender: String,
    address: String,
    diagnosis: [String],
    symptoms: String,
    daysTakenMedicine: String,
    pendingDays: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);
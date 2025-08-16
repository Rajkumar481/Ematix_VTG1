import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaVenusMars,
  FaHome,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaHeartbeat,
  FaPlus,
} from "react-icons/fa";
import { TextField, Autocomplete } from "@mui/material";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const iconMap = {
  name: <FaUserAlt />,
  age: <FaCalendarAlt />,
  phone: <FaPhoneAlt />,
  gender: <FaVenusMars />,
  address: <FaHome />,
  diagnosis: <FaNotesMedical />,
  daysTakenMedicine: <FaPrescriptionBottle />,
  symptoms: <FaHeartbeat />,
  additionalDays: <FaPlus />,
};

const EditPatient = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const patient = state?.patient;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
    address: "",
    diagnosis: [],
    daysTakenMedicine: "",
    symptoms: "",
    additionalDays: "", // optional
  });

  const [diagnosisInput, setDiagnosisInput] = useState("");

  useEffect(() => {
    if (patient) {
      setFormData((prev) => ({
        ...prev,
        name: patient.name || "",
        age: patient.age || "",
        phone: patient.phone || "",
        gender: patient.gender || "",
        address: patient.address || "",
        diagnosis: Array.isArray(patient.diagnosis)
          ? patient.diagnosis
          : typeof patient.diagnosis === "string"
          ? patient.diagnosis.split(",").map((d) => d.trim())
          : [],
        daysTakenMedicine: patient.daysTakenMedicine || "",
        symptoms: patient.symptoms || "",
        additionalDays: "",
      }));
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.daysTakenMedicine) {
      toast.error("Days Taken Medicine is required.");
      return;
    }

    const payload = {
      ...formData,
      diagnosis: formData.diagnosis.map((d) => d.trim()),
    };

    try {
      await customFetch.put(`patients/${patient._id}`, payload);
      toast.success("Patient updated successfully!");
      navigate("/patientlist");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
      // toast.error(err.response.data.error || "Failed to update patient.");
    }
  };

  if (!patient) {
    return <div className="text-center py-10">No patient data provided.</div>;
  }

  const formFields = [
    "name",
    "age",
    "phone",
    "gender",
    "address",
    "diagnosis",
    "symptoms",
    "daysTakenMedicine",
    "additionalDays",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-100 p-6 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide">
          Edit Patient
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {formFields.map((key) => {
            const value = formData[key] || "";

            if (key === "diagnosis") {
              return (
                <div key={key} className="flex flex-col">
                  <label className="flex items-center gap-3 mb-2 font-semibold text-gray-700">
                    <span className="text-indigo-500 text-lg">
                      {iconMap[key]}
                    </span>
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[
                      "jaundice",
                      "liver problem",
                      "PCOD",
                      "B-virus",
                      "stone problem",
                    ]}
                    value={value}
                    inputValue={diagnosisInput}
                    onInputChange={(e, newInputValue) => {
                      setDiagnosisInput(newInputValue);
                    }}
                    onChange={(e, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        diagnosis: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Type or select diagnosis"
                      />
                    )}
                  />
                </div>
              );
            }

            if (key === "address") {
              return (
                <div key={key} className="flex flex-col">
                  <label className="flex items-center gap-3 mb-2 font-semibold text-gray-700">
                    <span className="text-indigo-500 text-lg">
                      {iconMap[key]}
                    </span>
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                  <Autocomplete
                    freeSolo
                    options={[
                      "tharamangalam",
                      "elampillai",
                      "mecheri",
                      "valapadi",
                      "attur",
                      "andalur gate",
                      "namakkal",
                      "arur",
                      "tharumapuri",
                    ]}
                    value={value}
                    onChange={(e, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: newValue || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Type or select address"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        required
                      />
                    )}
                  />
                </div>
              );
            }

            return (
              <div key={key} className="flex flex-col">
                <label className="flex items-center gap-3 mb-2 font-semibold text-gray-700">
                  <span className="text-indigo-500 text-lg">
                    {iconMap[key]}
                  </span>
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
                {key === "gender" ? (
                  <select
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type={
                      key === "age" ||
                      key === "daysTakenMedicine" ||
                      key === "additionalDays"
                        ? "number"
                        : "text"
                    }
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required={
                      key === "daysTakenMedicine" ||
                      ["name", "age", "phone", "gender", "address"].includes(
                        key
                      )
                    }
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
                    min={
                      key === "age" ||
                      key === "daysTakenMedicine" ||
                      key === "additionalDays"
                        ? 0
                        : undefined
                    }
                    disabled={key === "daysTakenMedicine"}
                  />
                )}
              </div>
            );
          })}

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white text-lg font-bold px-10 py-3 rounded-xl shadow-lg hover:bg-yellow-600 transition-transform transform hover:-translate-y-1"
            >
              Update Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;

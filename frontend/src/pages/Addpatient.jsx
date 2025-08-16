import React, { useState } from "react";
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
} from "react-icons/fa";
import { TextField, Autocomplete } from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  age: "",
  phone: "",
  gender: "",
  address: "",
  diagnosis: "",
  daysTakenMedicine: "",
  symptoms: "",
};

const iconMap = {
  name: <FaUserAlt />,
  age: <FaCalendarAlt />,
  phone: <FaPhoneAlt />,
  gender: <FaVenusMars />,
  address: <FaHome />,
  diagnosis: <FaNotesMedical />,
  daysTakenMedicine: <FaPrescriptionBottle />,
  symptoms: <FaHeartbeat />,
};

const Addpatient = () => {
  const [formData, setFormData] = useState(initialState);
  const [diagnosisInput, setDiagnosisInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Ensure input in diagnosisInput is also included
  //   const existing = formData.diagnosis
  //     ? formData.diagnosis.split(",").map((d) => d.trim())
  //     : [];

  //   const trimmed = diagnosisInput.trim();
  //   if (trimmed && !existing.includes(trimmed)) {
  //     existing.push(trimmed);
  //   }

  //   const finalDiagnosis = existing.join(", ");

  //   try {
  //     await customFetch.post("/patients", {
  //       ...formData,
  //       diagnosis: finalDiagnosis,
  //     });
  //     toast.success("Patient added successfully!");
  //     setFormData(initialState);
  //     setDiagnosisInput("");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to add patient.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // toast.success("Patient added successfully!");
    const phone = formData.phone.trim();
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    const existing = formData.diagnosis
      ? formData.diagnosis.split(",").map((d) => d.trim())
      : [];

    const trimmed = diagnosisInput.trim();
    if (trimmed && !existing.includes(trimmed)) {
      existing.push(trimmed);
    }

    const finalDiagnosis = existing.join(", ");

    try {
      await customFetch.post("/patients", {
        ...formData,
        diagnosis: finalDiagnosis,
      });
      console.log("reached here ✅");
      toast.success("Patient added successfully!");
      setFormData(initialState);
      setDiagnosisInput("");
    } catch (err) {
      toast.error(err.response.data.error || "Failed to add patient.");
      console.error(err);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-100 p-6">
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-100 p-6 mt-4 sm:mt-12 md:mt-12 lg:mt-1">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full border border-gray-200">
        <h2
          className="text-3xl font-extrabold mb-8 text-center tracking-wide"
          style={{
            color: "#137570",
          }}
        >
          Add New Patient
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {Object.entries(initialState).map(([key]) => {
            if (key === "diagnosis") {
              return (
                <div key={key} className="flex flex-col">
                  <label
                    htmlFor={key}
                    className="flex items-center gap-3 mb-2 font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    <span className="text-lg" style={{ color: "#137570" }}>
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
                    value={
                      formData.diagnosis
                        ? formData.diagnosis
                            .split(",")
                            .map((item) => item.trim())
                        : []
                    }
                    inputValue={diagnosisInput}
                    onInputChange={(event, newInputValue) => {
                      setDiagnosisInput(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        diagnosis: newValue.join(", "),
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const trimmed = diagnosisInput.trim();
                        if (!trimmed) return;

                        const current = formData.diagnosis
                          ? formData.diagnosis.split(",").map((d) => d.trim())
                          : [];

                        if (!current.includes(trimmed)) {
                          const updated = [...current, trimmed];
                          setFormData((prev) => ({
                            ...prev,
                            diagnosis: updated.join(", "),
                          }));
                        }

                        setDiagnosisInput("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        name="diagnosis"
                        placeholder="Type or select diagnosis"
                        // required
                      />
                    )}
                  />
                </div>
              );
            }

            if (key === "address") {
              return (
                <div key={key} className="flex flex-col">
                  <label
                    htmlFor={key}
                    className="flex items-center gap-3 mb-2 font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    <span className=" text-lg" style={{ color: "#137570" }}>
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
                    value={formData.address}
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: newValue || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        name="address"
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
            if (key === "phone") {
              return (
                <div key={key} className="flex flex-col">
                  <label
                    htmlFor={key}
                    className="flex items-center gap-3 mb-2 font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    <span className=" text-lg" style={{ color: "#137570" }}>
                      {iconMap[key]}
                    </span>
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                  {/* <input
                    id={key}
                    // type="tel"
                    type="number"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputMode="numeric"
                    pattern="\d*"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow duration-300 hover:shadow-lg"
                    minLength={10}
                    maxLength={10}
                    required
                  /> */}

                  <input
                    id={key}
                    type="number"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                      // Prevent entering more than 10 digits
                      if (
                        formData[key] &&
                        formData[key].toString().length >= 10 &&
                        // Allow Backspace, Delete, Arrow keys
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    inputMode="numeric"
                    pattern="\d*"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow duration-300 hover:shadow-lg"
                    minLength={10}
                    maxLength={10}
                    required
                  />
                </div>
              );
            }

            return (
              <div key={key} className="flex flex-col">
                <label
                  htmlFor={key}
                  className="flex items-center gap-3 mb-2 font-semibold text-gray-700 cursor-pointer select-none"
                >
                  <span className=" text-lg" style={{ color: "#137570" }}>
                    {iconMap[key]}
                  </span>
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>

                {key === "gender" ? (
                  <select
                    id={key}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    id={key}
                    // onKeyDown={(e) => {
                    //   if (["e", "E", "+", "-"].includes(e.key)) {
                    //     e.preventDefault();
                    //   }
                    // }}
                    type={
                      key === "age" || key === "daysTakenMedicine"
                        ? "number"
                        : "text"
                    }
                    inputMode={
                      key === "age" || key === "daysTakenMedicine"
                        ? "numeric"
                        : undefined
                    }
                    pattern={
                      key === "age" || key === "daysTakenMedicine"
                        ? "\\d*"
                        : undefined
                    }
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow duration-300 hover:shadow-lg"
                    min={
                      key === "age" || key === "daysTakenMedicine"
                        ? 0
                        : undefined
                    }
                  />
                )}
              </div>
            );
          })}

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className=" text-white text-lg font-bold px-10 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
              }}
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addpatient;
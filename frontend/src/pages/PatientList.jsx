// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const initialState = {
//   name: "",
//   age: "",
//   phone: "",
//   gender: "",
//   address: "",
//   diagnosis: "",
//   symptoms: "",
//   daysTakenMedicine: "",
//   additionalDays: "",
// };

// const initialTreatmentState = {
//   treatmentName: "",
//   startDate: "",
//   endDate: "",
//   notes: "",
//   createdAt: "",
//   medicineTaken: "",
//   nextVisitDate: "",
//   progress: "Pending",
//   image: null,
//   mode: "clinic",
// };

// const PatientList = () => {
//   const navigate = useNavigate();
//   const [patients, setPatients] = useState([]);
//   const [formData, setFormData] = useState(initialState);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [showTreatmentModal, setShowTreatmentModal] = useState(false);
//   const [currentPatientId, setCurrentPatientId] = useState(null);
//   const [treatmentData, setTreatmentData] = useState(initialTreatmentState);

//   const [filters, setFilters] = useState({
//     name: "",
//     address: "",
//     diagnosis: "",
//     phone: "",
//   });

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   useEffect(() => {
//     if (showTreatmentModal) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showTreatmentModal]);

//   const fetchPatients = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/patients");
//       setPatients(res.data);
//       console.log(res.data);
//     } catch (err) {
//       console.error("Error fetching patients:", err);
//     }
//   };

//   const handleEdit = (patient) => {
//     setFormData(patient);
//     setIsEditing(true);
//     setEditId(patient._id);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(http://localhost:5000/api/patients/${editId}, formData);
//       alert("Patient updated!");
//       setFormData(initialState);
//       setIsEditing(false);
//       setEditId(null);
//       fetchPatients();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (_id) => {
//     if (window.confirm("Are you sure to delete?")) {
//       await axios.delete(http://localhost:5000/api/patients/${_id});
//       fetchPatients();
//     }
//   };

//   const openTreatmentModal = (patientId) => {
//     setCurrentPatientId(patientId);
//     setShowTreatmentModal(true);
//   };

//   const closeTreatmentModal = () => {
//     setShowTreatmentModal(false);
//     setTreatmentData(initialTreatmentState);
//     setCurrentPatientId(null);
//   };

//   const handleTreatmentChange = (e) => {
//     const { name, value, files, type } = e.target;
//     if (type === "file") {
//       setTreatmentData((prev) => ({ ...prev, [name]: files[0] || null }));
//     } else {
//       setTreatmentData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleTreatmentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formPayload = new FormData();
//       Object.entries(treatmentData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           formPayload.append(key, value);
//         }
//       });
//       await axios.post(
//         ` http://localhost:5000/api/patients/${currentPatientId}/treatments`,
//         formPayload,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       alert("Treatment added!");
//       closeTreatmentModal();
//       fetchPatients();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filteredPatients = patients.filter((p) => {
//     const diagnosisText = Array.isArray(p.diagnosis)
//       ? p.diagnosis.join(" ").toLowerCase()
//       : (p.diagnosis || "").toLowerCase();

//     return (
//       p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//       p.address.toLowerCase().includes(filters.address.toLowerCase()) &&
//       diagnosisText.includes(filters.diagnosis.toLowerCase()) &&
//       p.phone.toLowerCase().includes(filters.phone.toLowerCase())
//     );
//   });

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Filter Inputs */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         <input
//           type="text"
//           name="name"
//           value={filters.name}
//           onChange={handleFilterChange}
//           placeholder="Filter by name"
//           className="border px-3 py-2 rounded w-full"
//         />
//         <input
//           type="text"
//           name="address"
//           value={filters.address}
//           onChange={handleFilterChange}
//           placeholder="Filter by address"
//           className="border px-3 py-2 rounded w-full"
//         />
//         <input
//           type="text"
//           name="diagnosis"
//           value={filters.diagnosis}
//           onChange={handleFilterChange}
//           placeholder="Filter by diagnosis"
//           className="border px-3 py-2 rounded w-full"
//         />
//         <input
//           type="text"
//           name="phone"
//           value={filters.phone}
//           onChange={handleFilterChange}
//           placeholder="Filter by phone"
//           className="border px-3 py-2 rounded w-full"
//         />
//       </div>

//       {/* Patient List Table */}
//       <h3 className="text-xl font-bold mb-2">Patient List</h3>
//       <div className="overflow-x-auto w-full">
//         <table className="min-w-full table-auto border text-center text-sm md:text-base">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border px-3 py-2">S.No</th>
//               <th className="border px-3 py-2">Name</th>
//               <th className="border px-3 py-2">Age</th>
//               <th className="border px-3 py-2">Phone</th>
//               <th className="border px-3 py-2">Gender</th>
//               <th className="border px-3 py-2">Address</th>
//               <th className="border px-3 py-2">Diagnosis</th>
//               <th className="border px-3 py-2">Days Taken</th>
//               <th className="border px-3 py-2">Pending Days</th>
//               <th className="border px-3 py-2">Symptoms</th>
//               <th className="border px-3 py-2">Treatment</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPatients.map((p, index) => (
//               <tr
//                 key={p._id}
//                 className="bg-white even:bg-gray-50 hover:bg-blue-50 transition cursor-pointer"
//                 onClick={() =>
//                   navigate("/details", { state: { patientId: p._id } })
//                 }
//               >
//                 <td className="border px-3 py-2">{index + 1}</td>
//                 <td className="border px-3 py-2">{p.name}</td>
//                 <td className="border px-3 py-2">{p.age}</td>
//                 <td className="border px-3 py-2">{p.phone}</td>
//                 <td className="border px-3 py-2">{p.gender}</td>
//                 <td className="border px-3 py-2">{p.address}</td>
//                 <td className="border px-3 py-2">
//                   {Array.isArray(p.diagnosis)
//                     ? p.diagnosis.join(", ")
//                     : p.diagnosis}
//                 </td>
//                 <td className="border px-3 py-2">{p.daysTakenMedicine}</td>
//                 <td className="border px-3 py-2">{p.pendingDays}</td>
//                 <td className="border px-3 py-2">{p.symptoms}</td>
//                 <td
//                   className="border px-3 py-2"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() =>
//                       navigate("/upload", { state: { patient: p } })
//                     }
//                     className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold cursor-pointer"
//                   >
//                     Add Treatment
//                   </button>
//                 </td>
//                 <td
//                   className="border px-3 py-2 space-x-2"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() => navigate("/edit", { state: { patient: p } })}
//                     className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm font-semibold cursor-pointer"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold cursor-pointer"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredPatients.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="12"
//                   className="text-center py-4 text-gray-500 bg-white"
//                 >
//                   No patients found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Treatment Modal */}
//       {showTreatmentModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative m-4">
//             <button
//               onClick={closeTreatmentModal}
//               aria-label="Close modal"
//               className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-3xl font-bold"
//             >
//               &times;
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-center">
//               Add Treatment
//             </h3>
//             <form
//               onSubmit={handleTreatmentSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//               encType="multipart/form-data"
//             >
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="createdAt"
//                     className="block mb-1 font-semibold"
//                   >
//                     Date
//                   </label>
//                   <input
//                     required
//                     type="date"
//                     id="createdAt"
//                     name="createdAt"
//                     value={treatmentData.createdAt}
//                     onChange={handleTreatmentChange}
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="medicineTaken"
//                     className="block mb-1 font-semibold"
//                   >
//                     Medicine Taken
//                   </label>
//                   <input
//                     type="text"
//                     id="medicineTaken"
//                     name="medicineTaken"
//                     value={treatmentData.medicineTaken}
//                     onChange={handleTreatmentChange}
//                     placeholder="Enter medicine details"
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="nextVisitDate"
//                     className="block mb-1 font-semibold"
//                   >
//                     Next Visit Date
//                   </label>
//                   <input
//                     type="date"
//                     id="nextVisitDate"
//                     name="nextVisitDate"
//                     value={treatmentData.nextVisitDate}
//                     onChange={handleTreatmentChange}
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="progress"
//                     className="block mb-1 font-semibold"
//                   >
//                     Progress
//                   </label>
//                   <select
//                     id="progress"
//                     name="progress"
//                     value={treatmentData.progress}
//                     onChange={handleTreatmentChange}
//                     className="w-full border rounded px-3 py-2"
//                   >
//                     <option value="Done">Done</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Clear">Clear</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="image" className="block mb-1 font-semibold">
//                     Image
//                   </label>
//                   <div className="border-2 border-gray-400 rounded px-3 py-3 bg-gray-50">
//                     <input
//                       type="file"
//                       id="image"
//                       name="image"
//                       accept="image/*"
//                       onChange={handleTreatmentChange}
//                       className="w-full"
//                     />
//                     {treatmentData.image && (
//                       <div className="mt-2 flex items-center justify-center">
//                         <span className="text-sm text-gray-600">
//                           {treatmentData.image.name}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="mode" className="block mb-1 font-semibold">
//                     Mode
//                   </label>
//                   <select
//                     id="mode"
//                     name="mode"
//                     value={treatmentData.mode}
//                     onChange={handleTreatmentChange}
//                     className="w-full border rounded px-3 py-2"
//                   >
//                     <option value="clinic">Clinic</option>
//                     <option value="courier">Courier</option>
//                     <option value="branch">Branch</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
//                 <button
//                   type="button"
//                   onClick={closeTreatmentModal}
//                   className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientList;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Using react-router-dom for navigation

// MUI Components
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import customFetch from "../utils/customFetch";

const initialTreatmentState = {
  treatmentName: "",
  startDate: "",
  endDate: "",
  notes: "",
  createdAt: "",
  medicineTaken: "",
  nextVisitDate: "",
  progress: "Pending",
  image: null,
  mode: "clinic",
};

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [treatmentData, setTreatmentData] = useState(initialTreatmentState);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    diagnosis: "",
    phone: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (showTreatmentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTreatmentModal]);

  const fetchPatients = async () => {
    try {
      const res = await customFetch.get("/patients");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPatients(sorted);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await customFetch.delete(`/patients/${_id}`);
        fetchPatients();
      } catch (err) {
        console.error("Error deleting patient:", err);
      }
    }
  };

  const openTreatmentModal = (patientId) => {
    setCurrentPatientId(patientId);
    setTreatmentData(initialTreatmentState); // Reset treatment data when opening modal
    setShowTreatmentModal(true);
  };

  const closeTreatmentModal = () => {
    setShowTreatmentModal(false);
    setTreatmentData(initialTreatmentState);
    setCurrentPatientId(null);
  };

  const handleTreatmentChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setTreatmentData((prev) => ({ ...prev, [name]: files?.[0] || null }));
    } else {
      setTreatmentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name) => (e) => {
    setTreatmentData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleTreatmentSubmit = async (e) => {
    e.preventDefault();
    if (!currentPatientId) return;

    try {
      const formPayload = new FormData();
      Object.entries(treatmentData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formPayload.append(key, value);
        }
      });
      await customFetch.post(
        `/patients/${currentPatientId}/treatments`,
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Treatment added!");
      closeTreatmentModal();
      fetchPatients();
    } catch (err) {
      console.error("Error adding treatment:", err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const diagnosisText = Array.isArray(p.diagnosis)
      ? p.diagnosis.join(" ").toLowerCase()
      : (p.diagnosis || "").toLowerCase();
    return (
      p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      p.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      diagnosisText.includes(filters.diagnosis.toLowerCase()) &&
      p.phone.toLowerCase().includes(filters.phone.toLowerCase())
    );
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 0,
        mt: { xs: 8, sm: 10, md: 6, lg: 2 },
        px: { xs: 2, sm: 4, md: 6, lg: 2 },

        // background:
        //   "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)",
      }}
    >
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color: "#0F7871",
        }}
      >
        Patient List
      </Typography>
      <Paper
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          p: 3,
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        {/* Filter Inputs */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            label="Filter by name"
            variant="outlined"
            size="small"
          />
          <TextField
            type="text"
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            label="Filter by address"
            variant="outlined"
            size="small"
          />
          <TextField
            type="text"
            name="diagnosis"
            value={filters.diagnosis}
            onChange={handleFilterChange}
            label="Filter by diagnosis"
            variant="outlined"
            size="small"
          />
          <TextField
            type="text"
            name="phone"
            value={filters.phone}
            onChange={handleFilterChange}
            label="Filter by phone"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Patient List Table */}

        <TableContainer
          component={Paper}
          sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="patient list table">
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                  color: "white",
                }}
              >
                <TableCell
                  sx={{ width: "50px", fontWeight: "bold", color: "white" }}
                >
                  S.No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Age
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Phone
                </TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell> */}
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Address
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Diagnosis
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Days Taken
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Pending Days
                </TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Symptoms</TableCell> */}
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  Treatment
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p, index) => (
                  <TableRow
                    key={p._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      "&:hover": {
                        // backgroundColor: "#e3f2fd",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(13,148,136,0.2) 50%, transparent 100%)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() =>
                      navigate("/details", { state: { patientId: p._id } })
                    }
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    {/* <TableCell>{p.gender}</TableCell> */}
                    <TableCell>{p.address}</TableCell>
                    <TableCell>
                      {Array.isArray(p.diagnosis)
                        ? p.diagnosis.join(", ")
                        : p.diagnosis}
                    </TableCell>
                    <TableCell>{p.daysTakenMedicine}</TableCell>
                    <TableCell>{p.pendingDays}</TableCell>
                    {/* <TableCell>{p.symptoms}</TableCell> */}
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#0d9488",
                          "&:hover": { backgroundColor: "#0f766e" },
                          color: "white",
                        }}
                        onClick={() =>
                          navigate("/upload", { state: { patient: p } })
                        }
                      >
                        Add Treatment
                      </Button>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#fbc02d",
                            "&:hover": { backgroundColor: "#f9a825" },
                            color: "white",
                          }}
                          onClick={() =>
                            navigate("/edit", { state: { patient: p } })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    sx={{ py: 4, color: "gray.500" }}
                  >
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Treatment Modal */}
        <Dialog
          open={showTreatmentModal}
          onClose={closeTreatmentModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Treatment</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fill in the details for the new treatment.
            </Typography>
            <Box
              component="form"
              onSubmit={handleTreatmentSubmit}
              sx={{ display: "grid", gap: 2 }}
            >
              <TextField
                type="text"
                name="treatmentName"
                value={treatmentData.treatmentName}
                onChange={handleTreatmentChange}
                label="Treatment Name"
                placeholder="e.g., Physiotherapy"
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                type="date"
                name="startDate"
                value={treatmentData.startDate}
                onChange={handleTreatmentChange}
                label="Start Date"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                name="endDate"
                value={treatmentData.endDate}
                onChange={handleTreatmentChange}
                label="End Date"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                name="notes"
                value={treatmentData.notes}
                onChange={handleTreatmentChange}
                label="Notes"
                placeholder="Any additional notes"
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                required
                type="date"
                name="createdAt"
                value={treatmentData.createdAt}
                onChange={handleTreatmentChange}
                label="Date"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                name="medicineTaken"
                value={treatmentData.medicineTaken}
                onChange={handleTreatmentChange}
                label="Medicine Taken"
                placeholder="Enter medicine details"
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                type="date"
                name="nextVisitDate"
                value={treatmentData.nextVisitDate}
                onChange={handleTreatmentChange}
                label="Next Visit Date"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="progress-label">Progress</InputLabel>
                <Select
                  labelId="progress-label"
                  id="progress"
                  name="progress"
                  value={treatmentData.progress}
                  onChange={handleSelectChange("progress")}
                  label="Progress"
                >
                  <MenuItem value="Done">Done</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Clear">Clear</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="mode-label">Mode</InputLabel>
                <Select
                  labelId="mode-label"
                  id="mode"
                  name="mode"
                  value={treatmentData.mode}
                  onChange={handleSelectChange("mode")}
                  label="Mode"
                >
                  <MenuItem value="clinic">Clinic</MenuItem>
                  <MenuItem value="courier">Courier</MenuItem>
                  <MenuItem value="branch">Branch</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel shrink htmlFor="image-upload">
                  Image
                </InputLabel>
                <TextField
                  type="file"
                  id="image-upload"
                  name="image"
                  accept="image/*"
                  onChange={handleTreatmentChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                {treatmentData.image && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    {treatmentData.image.name}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeTreatmentModal}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTreatmentSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#0d9488",
                "&:hover": { backgroundColor: "#0f766e" },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

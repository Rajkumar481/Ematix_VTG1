import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// ...inside a useEffect or button click...
const AddPatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (!patient) {
  //     toast.error("No patient selected. Returning to list.");
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1000); // 1 second delay
  //   }
  // }, [patient, navigate]);

  const [formData, setFormData] = useState({
    patient: patient?._id || "",
    medicineName: "", // ✅ ADDED to fix Autocomplete warning
    medicineTakenPatient: "",
    progress: "pending",
    mode: "clinic",
    nextVisitMode: "clinic",
    startDate: new Date().toISOString().split("T")[0],
    totalBilirubin: "", // ✅ ADDED missing lab fields
    SGPT: "",
    SGOT: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 10) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }

    try {
      setIsLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      images.forEach((img) => {
        data.append("images", img);
      });

      const res = await customFetch.post("/details", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // await delay(2000);

      toast.success("Submitted successfully!");
      console.log(res.data);

      setFormData({
        patient: patient?._id || "",
        medicineName: "", // ✅ Reset it
        medicineTakenPatient: "",
        progress: "pending",
        mode: "clinic",
        nextVisitMode: "clinic",
        startDate: new Date().toISOString().split("T")[0],
        totalBilirubin: "",
        SGPT: "",
        SGOT: "",
      });
      setImages([]);
    } catch (error) {
      toast.error("Submission failed.");
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: { xs: 10, sm: 10, md: 6, lg: 8 },
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add Patient Details - {patient?.name}
      </Typography>
      {/* <Button onClick={() => toast.success("Manual toast!")}>Test Toast</Button> */}
      <Autocomplete
        freeSolo
        options={[
          "Liverall",
          "Liverall (PowerPlus)",
          "Lipocure",
          "Cyclowin",
          "Slim Light",
          "Dia down",
        ]}
        value={formData.medicineName || ""}
        onChange={(event, newValue) => {
          setFormData((prev) => ({
            ...prev,
            medicineName: newValue ?? "",
          }));
        }}
        onInputChange={(event, newInputValue) => {
          setFormData((prev) => ({
            ...prev,
            medicineName: newInputValue ?? "",
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Medicine Name"
            margin="normal"
            name="medicineName"
          />
        )}
      />

      <TextField
        fullWidth
        label="Medicine Taken"
        name="medicineTakenPatient"
        type="number"
        value={formData.medicineTakenPatient}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Start Date"
        name="startDate"
        value={formData.startDate}
        InputProps={{ readOnly: true }}
        margin="normal"
        disabled
      />

      <TextField
        select
        fullWidth
        label="Progress"
        name="progress"
        value={formData.progress}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="done">Done</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="clear">Clear</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Mode"
        name="mode"
        value={formData.mode}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="clinic">Clinic</MenuItem>
        <MenuItem value="courier">Courier</MenuItem>
        <MenuItem value="branch">Branch</MenuItem>
      </TextField>

      <InputLabel sx={{ mt: 2 }}>Upload Images</InputLabel>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginTop: 8 }}
      />

      {images.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {images.map((file, idx) => (
            <Typography key={idx} variant="caption" display="block">
              {file.name}
            </Typography>
          ))}
        </Box>
      )}

      <TextField
        select
        fullWidth
        label="Next Visit Mode"
        name="nextVisitMode"
        value={formData.nextVisitMode}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="clinic">Clinic</MenuItem>
        <MenuItem value="courier">Courier</MenuItem>
        <MenuItem value="branch">Branch</MenuItem>
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Total Bilirubin"
        name="totalBilirubin"
        value={formData.totalBilirubin}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
         type="number"
        label="SGPT"
        name="SGPT"
        value={formData.SGPT}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
         type="number"
        label="SGOT"
        name="SGOT"
        value={formData.SGOT}
        onChange={handleChange}
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Submit"
        )}
      </Button>
    </Box>
  );
};

export default AddPatientDetails;

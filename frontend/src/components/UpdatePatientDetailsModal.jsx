"use client";

import React from "react";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Fade,
  Slide,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  Delete,
  Image as ImageIcon,
  LocalHospital,
  CalendarToday,
  Medication,
  Person,
  Save,
  PhotoCamera,
  Biotech,
  Assignment,
} from "@mui/icons-material";
import customFetch from "../utils/customFetch";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdatePatientDetailsModal = ({ open, handleClose, detail, refresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    startDate: "",
    medicineTakenPatient: "",
    mode: "",
    nextVisitMode: "",
    medicineName: "",
    SGPT: "",
    SGOT: "",
    totalBilirubin: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (detail && open) {
      setFormData({
        startDate: new Date(detail.startDate).toISOString().split("T")[0],
        medicineTakenPatient: detail.medicineTakenPatient || "",
        mode: detail.mode || "",
        nextVisitMode: detail.nextVisitMode || "",
        medicineName: detail.medicineName || "",
        SGPT: detail.SGPT || "",
        SGOT: detail.SGOT || "",
        totalBilirubin: detail.totalBilirubin || "",
      });
      setNewImages([]);
      setImagePreviews([]);
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [detail, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const createImagePreviews = useCallback((files) => {
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          previews.push(e.target.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleImageUpload = (files) => {
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );

      if (validFiles.length !== fileArray.length) {
        setError("Some files were not images and were excluded.");
      }

      setNewImages(validFiles);
      createImagePreviews(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.medicineTakenPatient.trim()) {
      errors.medicineTakenPatient = "Medicine taken by patient is required";
    }

    if (!formData.mode.trim()) {
      errors.mode = "Mode is required";
    }

    if (
      formData.SGPT &&
      (isNaN(Number(formData.SGPT)) || Number(formData.SGPT) < 0)
    ) {
      errors.SGPT = "SGPT must be a valid positive number";
    }

    if (
      formData.SGOT &&
      (isNaN(Number(formData.SGOT)) || Number(formData.SGOT) < 0)
    ) {
      errors.SGOT = "SGOT must be a valid positive number";
    }

    if (
      formData.totalBilirubin &&
      (isNaN(Number(formData.totalBilirubin)) ||
        Number(formData.totalBilirubin) < 0)
    ) {
      errors.totalBilirubin = "Total Bilirubin must be a valid positive number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
  const formDataToSend = new FormData();
  formDataToSend.append("patient", detail.patient._id);

  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });

  newImages.forEach((file) => {
    formDataToSend.append("images", file);
  });

  const response = await customFetch.patch(
    `/details/${detail._id}`,
    formDataToSend,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  setSuccess(true);
  setTimeout(() => {
    refresh();
    handleClose();
  }, 1500);
} 
catch (err) {
      console.error(err);
      setError("Failed to update patient details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth={isMobile ? false : "xl"}
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
          margin: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '95vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
            opacity: 0.3,
          }}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          zIndex={1}
          flexDirection={{ xs: 'row', sm: 'row' }}
          gap={{ xs: 1, sm: 2 }}
        >
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flex={1}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 },
                backdropFilter: "blur(10px)",
              }}
            >
              <LocalHospital sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                sx={{ 
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  lineHeight: { xs: 1.2, sm: 1.3 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'nowrap', sm: 'normal' }
                }}
              >
                Edit Patient Details
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9, 
                  mt: 0.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Update medical information and records
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseModal}
            disabled={isLoading}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
            }}
          >
            <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "#f8fafc", overflow: 'auto' }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Patient Information Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      color: "white",
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      <Person sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        Patient Information
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        Basic details and visit information
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Start Date"
                          name="startDate"
                          type="date"
                          fullWidth
                          value={formData.startDate}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          error={!!fieldErrors.startDate}
                          helperText={fieldErrors.startDate}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday
                                  color="primary"
                                  fontSize="small"
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Visit Mode"
                          name="mode"
                          fullWidth
                          value={formData.mode}
                          onChange={handleChange}
                          error={!!fieldErrors.mode}
                          helperText={fieldErrors.mode}
                          placeholder="Online, In-person, Telemedicine"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Assignment color="primary" fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Next Visit Mode"
                          name="nextVisitMode"
                          fullWidth
                          value={formData.nextVisitMode}
                          onChange={handleChange}
                          placeholder="Follow-up, Consultation, Emergency"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Medication Information Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                      color: "white",
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      <Medication sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        Medication Details
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        Current medications and prescriptions
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Medicine Taken by Patient"
                          name="medicineTakenPatient"
                          fullWidth
                          multiline
                          rows={3}
                          value={formData.medicineTakenPatient}
                          onChange={handleChange}
                          error={!!fieldErrors.medicineTakenPatient}
                          helperText={fieldErrors.medicineTakenPatient}
                          placeholder="List all current medications with dosage"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Primary Medicine Name"
                          name="medicineName"
                          fullWidth
                          value={formData.medicineName}
                          onChange={handleChange}
                          placeholder="Main prescribed medication"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Laboratory Results Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                      color: "white",
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      <Biotech sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        Laboratory Results
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        Blood test results and liver function tests
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="SGPT (ALT)"
                          name="SGPT"
                          type="number"
                          fullWidth
                          value={formData.SGPT}
                          onChange={handleChange}
                          error={!!fieldErrors.SGPT}
                          helperText={
                            fieldErrors.SGPT || "Normal range: 7-56 U/L"
                          }
                          InputProps={{
                            inputProps: { min: 0, step: 0.1 },
                            endAdornment: (
                              <InputAdornment position="end">
                                U/L
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          label="SGOT (AST)"
                          name="SGOT"
                          type="number"
                          fullWidth
                          value={formData.SGOT}
                          onChange={handleChange}
                          error={!!fieldErrors.SGOT}
                          helperText={
                            fieldErrors.SGOT || "Normal range: 10-40 U/L"
                          }
                          InputProps={{
                            inputProps: { min: 0, step: 0.1 },
                            endAdornment: (
                              <InputAdornment position="end">
                                U/L
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Total Bilirubin"
                          name="totalBilirubin"
                          type="number"
                          fullWidth
                          value={formData.totalBilirubin}
                          onChange={handleChange}
                          error={!!fieldErrors.totalBilirubin}
                          helperText={
                            fieldErrors.totalBilirubin ||
                            "Normal range: 0.3-1.2 mg/dL"
                          }
                          InputProps={{
                            inputProps: { min: 0, step: 0.1 },
                            endAdornment: (
                              <InputAdornment position="end">
                                mg/dL
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Image Upload Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                      color: "white",
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        Medical Images
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        Upload X-rays, reports, and other medical documents
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: { xs: 3, sm: 4, md: 6 },
                        textAlign: "center",
                        border: isDragOver
                          ? "3px dashed #7c3aed"
                          : "3px dashed #d1d5db",
                        borderRadius: 3,
                        background: isDragOver
                          ? "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
                          : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isDragOver ? "scale(1.02)" : "scale(1)",
                        "&:hover": {
                          borderColor: "#7c3aed",
                          background:
                            "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
                          transform: "scale(1.01)",
                          boxShadow: "0 12px 24px rgba(124, 58, 237, 0.15)",
                        },
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      <CloudUpload
                        sx={{
                          fontSize: { xs: 48, sm: 56, md: 64 },
                          color: isDragOver ? "#7c3aed" : "#9ca3af",
                          mb: 2,
                          transition: "all 0.3s ease",
                        }}
                      />
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight="bold"
                        gutterBottom
                        color={isDragOver ? "primary" : "textPrimary"}
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
                      >
                        {isDragOver ? "Drop files here!" : "Drag & Drop Images"}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        gutterBottom
                        sx={{ 
                          mb: 3,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          px: { xs: 1, sm: 2 }
                        }}
                      >
                        or click to browse and select files from your device
                      </Typography>
                      <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        startIcon={<PhotoCamera />}
                        sx={{
                          borderRadius: 3,
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1, sm: 1.5 },
                          background:
                            "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                          boxShadow: "0 8px 16px rgba(124, 58, 237, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                            boxShadow: "0 12px 24px rgba(124, 58, 237, 0.4)",
                          },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        Choose Files
                      </Button>
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        style={{ display: "none" }}
                      />
                    </Paper>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <Fade in={imagePreviews.length > 0}>
                        <Box sx={{ mt: { xs: 3, sm: 4 } }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                          >
                            <ImageIcon color="primary" />
                            Selected Images ({imagePreviews.length})
                          </Typography>
                          <Grid container spacing={{ xs: 2, sm: 3 }}>
                            {imagePreviews.map((preview, index) => (
                              <Grid
                                item
                                xs={6}
                                sm={4}
                                md={3}
                                lg={3}
                                key={index}
                              >
                                <Card
                                  elevation={0}
                                  sx={{
                                    position: "relative",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      aspectRatio: "1",
                                      position: "relative",
                                    }}
                                  >
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() => removeImage(index)}
                                      sx={{
                                        position: "absolute",
                                        top: { xs: 4, sm: 8 },
                                        right: { xs: 4, sm: 8 },
                                        bgcolor: "rgba(239, 68, 68, 0.9)",
                                        color: "white",
                                        backdropFilter: "blur(10px)",
                                        width: { xs: 24, sm: 32 },
                                        height: { xs: 24, sm: 32 },
                                        "&:hover": {
                                          bgcolor: "rgba(220, 38, 38, 0.9)",
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <Delete sx={{ fontSize: { xs: 16, sm: 20 } }} />
                                    </IconButton>
                                  </Box>
                                  <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: "white" }}>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      }}
                                    >
                                      {newImages[index]?.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                    >
                                      {(
                                        newImages[index]?.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </Typography>
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Alerts */}
          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{
                  mt: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  border: "1px solid #fecaca",
                  bgcolor: "#fef2f2",
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={success}>
              <Alert
                severity="success"
                sx={{
                  mt: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  border: "1px solid #bbf7d0",
                  bgcolor: "#f0fdf4",
                }}
              >
                Patient details updated successfully! 🎉
              </Alert>
            </Fade>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ 
            width: "100%", 
            justifyContent: "flex-end",
            alignItems: { xs: "stretch", sm: "center" }
          }}
        >
          <Button
            onClick={handleCloseModal}
            disabled={isLoading}
            size={isMobile ? "medium" : "large"}
            sx={{
              borderRadius: 3,
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              color: "#64748b",
              borderColor: "#cbd5e1",
              "&:hover": {
                borderColor: "#94a3b8",
                bgcolor: "#f1f5f9",
              },
              order: { xs: 2, sm: 1 },
            }}
            variant="outlined"
            startIcon={<Close />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            size={isMobile ? "medium" : "large"}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: { xs: 4, sm: 6 },
              py: { xs: 1, sm: 1.5 },
              background: isLoading
                ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                : "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
              boxShadow: "0 8px 16px rgba(5, 150, 105, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #047857 0%, #0f766e 100%)",
                boxShadow: "0 12px 24px rgba(5, 150, 105, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                color: "white",
              },
              order: { xs: 1, sm: 2 },
            }}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
          >
            {isLoading ? "Updating..." : isMobile ? "Update" : "Update Patient Details"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePatientDetailsModal;
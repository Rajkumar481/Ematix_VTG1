"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Divider,
  Avatar,
  Stack,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  LocalHospital,
  CalendarToday,
  MedicalServices,
  TrendingUp,
  PhotoLibrary,
  Close,
  ZoomIn,
  Timelapse,
  DoorBackTwoTone,
} from "@mui/icons-material";
import customFetch from "../utils/customFetch";

const PatientImageDetails = () => {
  const { id: patientId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        const res = await customFetch.get(`/details/${patientId}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setDetails(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to fetch patient details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressColor = (progress) => {
    switch (progress?.toLowerCase()) {
      case "done":
        return "success";
      case "in progress":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  const getModeColor = (mode) => {
    return mode === "op"
      ? "primary"
      : mode === "courier"
      ? "secondary"
      : "default";
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          px: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
          Loading patient details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 3 }}>
        <Alert severity="info">No patient details found.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 2,
        py: 3,
        mt: { xs: 5, sm: 6, md: 6, lg: 1 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: "bold",
          fontSize: { xs: 22, sm: 28, md: 34 },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Patient Medical Record
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ width: "100%", height: "100%" }}>
            <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <Person />
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: 18, sm: 20 } }}
                >
                  Patient Information
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Person sx={{ color: "text.secondary" }} />
                  <Typography variant="body1">
                    <strong>Name:</strong> {details.patient?.name || "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Timelapse sx={{ color: "text.secondary" }} />
                  <Typography variant="body1">
                    <strong>Age:</strong> {details.patient?.age || "N/A"} years
                  </Typography>
                  <Chip
                    label={details.patient?.gender || "N/A"}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Phone sx={{ color: "text.secondary" }} />
                  <Typography variant="body1">
                    <strong>Phone:</strong> {details.patient?.phone || "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Home sx={{ color: "text.secondary" }} />
                  <Typography variant="body1">
                    <strong>Address:</strong>{" "}
                    {details.patient?.address || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ width: "100%", height: "100%" }}>
            <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "error.main",
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <LocalHospital />
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: 18, sm: 20 } }}
                >
                  Medical Details
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body1">
                    <strong>Diagnosis:</strong>
                  </Typography>
                  <Chip
                    label={details.patient?.diagnosis || "N/A"}
                    color="error"
                    sx={{ mt: 1, textTransform: "capitalize" }}
                  />
                </Box>

                <Box>
                  {/* <DoorBackTwoTone sx={{ color: "text.secondary" }} /> */}
                  <Typography variant="body1">
                    <strong>Symptoms:</strong>{" "}
                    {details.patient?.symptoms || "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <MedicalServices sx={{ color: "text.secondary" }} />
                  <Typography variant="body1">
                    <strong>Days on Medicine:</strong>{" "}
                    {details.patient?.daysTakenMedicine || "N/A"} days
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* </Grid> */}

        {/* Visit Information Card */}
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 920,
              mx: "auto",
              px: { xs: 2, sm: 3 },
            }}
          >
            <CardContent
              sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Visit Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {details.startDate
                        ? formatDate(details.startDate)
                        : "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Next Visit
                    </Typography>
                    <Typography variant="body1">
                      {details.nextVisit
                        ? formatDate(details.nextVisit)
                        : "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Progress Status
                    </Typography>
                    <Chip
                      label={details.progress || "N/A"}
                      color={getProgressColor(details.progress)}
                      icon={<TrendingUp />}
                      sx={{ mt: 1, textTransform: "capitalize" }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Visit Mode
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}
                    >
                      <Chip
                        label={details.mode?.toUpperCase() || "N/A"}
                        color={getModeColor(details.mode)}
                        size="small"
                      />
                      <Chip
                        label={details.nextVistMode || "N/A"}
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Medicine Compliance
                </Typography>
                <Typography variant="body1">
                  Patient has taken{" "}
                  <strong>{details.medicineTakenPatient || "0"}</strong> dose(s)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Images Preview Card */}
        <Grid item xs={12} sx={{ width: "100vw" }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "info.main",
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <PhotoLibrary />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                >
                  Medical Images ({details.images?.length || 0})
                </Typography>
              </Box>

              {details.images && details.images.length > 0 ? (
                <ImageList
                  sx={{
                    width: "100%",
                    height: { xs: "auto", sm: 400 },
                  }}
                  cols={{ xs: 1, sm: 2, md: 3 }}
                  rowHeight={200}
                >
                  {details.images.map((image, index) => (
                    <ImageListItem key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          "&:hover .zoom-overlay": {
                            opacity: 1,
                          },
                        }}
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Medical image ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "/placeholder.svg?height=200&width=200&text=Image+Not+Found";
                          }}
                        />
                        <Box
                          className="zoom-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.3s",
                            borderRadius: "8px",
                          }}
                        >
                          <ZoomIn sx={{ color: "white", fontSize: 40 }} />
                        </Box>
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: { xs: 150, sm: 200 },
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    border: "2px dashed",
                    borderColor: "grey.300",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <PhotoLibrary
                    sx={{
                      fontSize: { xs: 40, sm: 60 },
                      color: "grey.400",
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    No medical images available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={handleCloseImageDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              zIndex: 1,
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Medical image preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src =
                  "/placeholder.svg?height=400&width=400&text=Image+Not+Found";
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientImageDetails;

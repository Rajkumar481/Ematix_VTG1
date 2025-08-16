import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person,
  Phone,
  CalendarToday,
  LocalPharmacy,
  Search,
  FilterList,
  ExpandMore,
  AccessTime,
  LocationOn,
  LocalShipping,
  Business,
  EventAvailable,
  Schedule,
  CheckCircle,
  Pending,
  Clear,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import UpdatePatientDetailsModal from "../components/UpdatePatientDetailsModal";
import customFetch from "../utils/customFetch";

const PatientDetailsDashboard = () => {
  const location = useLocation();
  const patientId = location.state?.patientId;
  console.log("Patient ID from state:", patientId);

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editOpen, setEditOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [progressFilter, setProgressFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const handleEditClick = (detail) => {
    setSelectedDetail(detail);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedDetail(null);
  };

  const refreshDetails = async () => {
    try {
      setLoading(true);
      const res = await customFetch.get(`/details/bypatient/${patientId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDetails(res.data);
    } catch (err) {
      console.error("Error refreshing patient details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await customFetch.get(`/details/bypatient/${patientId}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setDetails(res.data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressColor = (progress) => {
    switch (progress) {
      case "done":
        return "success";
      case "pending":
        return "warning";
      case "clear":
        return "error";
      default:
        return "default";
    }
  };

  const getProgressIcon = (progress) => {
    switch (progress) {
      case "done":
        return <CheckCircle />;
      case "pending":
        return <Pending />;
      case "clear":
        return <Clear />;
      default:
        return <Schedule />;
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "clinic":
        return <Person />;
      case "courier":
        return <LocalShipping />;
      case "branch":
        return <Business />;
      default:
        return <LocationOn />;
    }
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case "clinic":
        return "Clinic Visit";
      case "courier":
        return "Courier";
      case "branch":
        return "Branch Visit";
      default:
        return mode;
    }
  };

  const getProgressCount = (progress) => {
    return details.filter((detail) => detail.progress === progress).length;
  };

  const filteredDetails = useMemo(() => {
    return details.filter((detail) => {
      const matchesSearch =
        detail?.patient?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        detail?.medicineTakenPatient
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesProgress =
        progressFilter === "all" || detail.progress === progressFilter;

      const matchesMode = modeFilter === "all" || detail.mode === modeFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const visitDate = new Date(detail.nextVisit);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        switch (dateFilter) {
          case "today":
            matchesDate = visitDate.toDateString() === today.toDateString();
            break;
          case "tomorrow":
            matchesDate = visitDate.toDateString() === tomorrow.toDateString();
            break;
          case "thisWeek":
            matchesDate = visitDate >= today && visitDate <= nextWeek;
            break;
          case "overdue":
            matchesDate = visitDate < today;
            break;
          case "custom":
            matchesDate =
              selectedDate &&
              visitDate.toDateString() ===
                new Date(selectedDate).toDateString();
            break;
        }
      }

      return matchesSearch && matchesProgress && matchesDate && matchesMode;
    });
  }, [
    details,
    searchTerm,
    progressFilter,
    dateFilter,
    modeFilter,
    selectedDate,
  ]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        p: { xs: 1, md: 3 },
        mt: { xs: 4, sm: 10, md: 3 },
        px: { xs: 2, sm: 4, md: 6, lg: 2 },
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "white" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Patient Details Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Comprehensive view of patient treatments and appointment schedules
          </Typography>

          {/* Patient Info */}
          {filteredDetails.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Patient Information
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {filteredDetails[0]?.patient?.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {filteredDetails[0]?.patient?.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Progress Stats */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Badge badgeContent={getProgressCount("pending")} color="warning">
              <Chip
                icon={<Pending />}
                label="Pending"
                color="warning"
                variant="outlined"
                size="medium"
              />
            </Badge>
            <Badge badgeContent={getProgressCount("done")} color="success">
              <Chip
                icon={<CheckCircle />}
                label="Done"
                color="success"
                variant="outlined"
                size="medium"
              />
            </Badge>
            <Badge badgeContent={getProgressCount("clear")} color="error">
              <Chip
                icon={<Clear />}
                label="Clear"
                color="error"
                variant="outlined"
                size="medium"
              />
            </Badge>
          </Box>
        </Paper>

        {/* Filters */}
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterList />
              <Typography variant="h6">Search & Filters</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  label="Search Medicine"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by medicine..."
                />
              </Grid>

              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <InputLabel>Progress Status</InputLabel>
                  <Select
                    value={progressFilter}
                    label="Progress Status"
                    onChange={(e) => setProgressFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                    <MenuItem value="clear">Clear</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <InputLabel>Consultation Mode</InputLabel>
                  <Select
                    value={modeFilter}
                    label="Consultation Mode"
                    onChange={(e) => setModeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Modes</MenuItem>
                    <MenuItem value="clinic">Clinic Visit</MenuItem>
                    <MenuItem value="courier">Courier</MenuItem>
                    <MenuItem value="branch">Branch Visit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <InputLabel>Next Visit</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Next Visit"
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      if (e.target.value !== "custom") {
                        setSelectedDate("");
                      }
                    }}
                  >
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="tomorrow">Tomorrow</MenuItem>
                    <MenuItem value="thisWeek">This Week</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                    <MenuItem value="custom">Custom Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  label="Select Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  disabled={dateFilter !== "custom"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredDetails.length} of {details.length} records
        </Typography>

        {/* Patient Cards */}
        {filteredDetails.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Person sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No records found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredDetails.map((detail) => (
              <Grid item xs={12} sm={6} lg={4} key={detail._id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      gap={3}
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Next Visit:</strong>{" "}
                          {formatDate(detail.nextVisit)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getProgressIcon(detail.progress)}
                        label={detail.progress.toUpperCase()}
                        color={getProgressColor(detail.progress)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ space: 2 }}>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <EventAvailable fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Start Date:</strong>{" "}
                          {formatDate(detail.startDate)}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="flex-start"
                        gap={1.5}
                        mb={2}
                      >
                        <LocalPharmacy
                          fontSize="small"
                          color="action"
                          sx={{ mt: 0.5 }}
                        />
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          <strong>Medicine:</strong>{" "}
                          {detail.medicineTakenPatient}
                        </Typography>
                      </Box>

                      {(detail.totalBilirubin ||
                        detail.SGOT ||
                        detail.SGPT) && (
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          gap={1.5}
                          mb={2}
                        >
                          <LocalPharmacy
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.5 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.5,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <strong>
                              totalBilirubin: {detail.totalBilirubin || "-"}
                            </strong>
                            <strong>SGOT : {detail.SGOT || "-"}</strong>
                            <strong>SGPT : {detail.SGPT || "-"}</strong>
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Consultation Modes:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            icon={getModeIcon(detail.mode)}
                            label={`Current: ${getModeLabel(detail.mode)}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          <Chip
                            icon={getModeIcon(detail.nextVisitMode)}
                            label={`Next: ${getModeLabel(
                              detail.nextVisitMode
                            )}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      backgroundColor: "grey.50",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box display="flex" alignItems="left" gap={0.5}>
                      <AccessTime fontSize="small" color="action" />
                      {/* <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(detail.createdAt)}
                      </Typography> */}
                      <Typography
                        variant="body2"
                        color="secondary"
                        sx={{
                          cursor: "pointer",
                          fontWeight: 500,
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => handleEditClick(detail)}
                      >
                        Edit
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => navigate(`/details/${detail._id}`)}
                    >
                      View Details
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <UpdatePatientDetailsModal
        open={editOpen}
        detail={selectedDetail}
        handleClose={() => setEditOpen(false)}
      />
    </Box>
  );
};

export default PatientDetailsDashboard;

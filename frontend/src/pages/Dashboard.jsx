import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Modal,
  List,
  ListItem,
  ListItemText,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CalendarToday,
  People,
  LocationOn,
  Phone,
  Schedule,
  LocalPharmacy,
  DirectionsRun,
  LocalShipping,
  Dashboard as DashboardIcon,
  FilterList,
  Clear,
  Search,
  DateRange,
  Filter,
  CalendarViewDaySharp,
  X,
  Person,
  PhoneAndroid,
  Map,
  CalendarTodaySharp,
  ClearAll,
  Delete,
  MedicationOutlined,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [patientData, setPatientData] = useState([]);
  const [allPatientData, setAllPatientData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    address: "",
    nextVisitDate: null,
    startDate: null,
    endDate: null,
  });

  const fetchData = async (date) => {
    try {
      const response = await customFetch.get("/details");
      console.log(response.data);

      // Filter based on nextVisit date (not time)
      const filtered = response.data.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return visitDate.isSame(date, "day") && !isCleared(entry);
      });

      setAllPatientData(response.data);
      applyFilters(filtered, filters);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const applyFilters = (data, currentFilters) => {
    let filtered = [...data];

    // Apply name filter
    if (currentFilters.name) {
      filtered = filtered.filter((entry) =>
        entry.patient?.name
          ?.toLowerCase()
          .includes(currentFilters.name.toLowerCase())
      );
    }

    // Apply phone filter
    if (currentFilters.phone) {
      filtered = filtered.filter((entry) =>
        entry.patient?.phone?.includes(currentFilters.phone)
      );
    }

    // Apply address filter
    if (currentFilters.address) {
      filtered = filtered.filter((entry) =>
        entry.patient?.address
          ?.toLowerCase()
          .includes(currentFilters.address.toLowerCase())
      );
    }

    // Apply diagnosis filter
    if (currentFilters.diagnosis) {
      filtered = filtered.filter((entry) =>
        entry.patient?.diagnosis?.some((d) =>
          d.toLowerCase().includes(currentFilters.diagnosis.toLowerCase())
        )
      );
    }

    // Apply next visit date filter
    if (currentFilters.nextVisitDate) {
      filtered = filtered.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return visitDate.isSame(currentFilters.nextVisitDate, "day");
      });
    }

    // Apply date range filter
    if (currentFilters.startDate && currentFilters.endDate) {
      filtered = filtered.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return (
          visitDate.isAfter(currentFilters.startDate.subtract(1, "day")) &&
          visitDate.isBefore(currentFilters.endDate.add(1, "day"))
        );
      });
    }

    setPatientData(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Get base data for selected date
    const baseData = allPatientData.filter((entry) => {
      const visitDate = dayjs(entry.nextVisit);
      return visitDate.isSame(selectedDate, "day") && !isCleared(entry);
    });

    applyFilters(baseData, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      name: "",
      phone: "",
      address: "",
      nextVisitDate: null,
      startDate: null,
      endDate: null,
      diagnosis:"",
    };
    setFilters(clearedFilters);

    // Reset to base data for selected date
    const baseData = allPatientData.filter((entry) => {
      const visitDate = dayjs(entry.nextVisit);
      return visitDate.isSame(selectedDate, "day");
    });

    setPatientData(baseData);
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  // Group data by mode
  const groupedByMode = {
    branch: [],
    clinic: [],
    courier: [],
  };

  patientData.forEach((entry) => {
    const mode = entry.nextVisitMode;
    if (groupedByMode[mode]) {
      groupedByMode[mode].push(entry);
    }
  });

  const isCleared = (entry) => {
    const progress = (entry.progress || "").toLowerCase().trim();
    const medsRemaining = Number(entry.medicineTakenPatient) || 0;
    return progress === "clear" || medsRemaining === 0;
  };

  // Count and dynamically sort columns by how many entries each mode has
  const modeCounts = {
    branch: groupedByMode.branch.length,
    clinic: groupedByMode.clinic.length,
    courier: groupedByMode.courier.length,
  };

  const sortedModes = Object.entries(modeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([mode]) => mode);

  const maxRows = Math.max(...Object.values(modeCounts));

  const getModeIcon = (mode) => {
    switch (mode) {
      case "branch":
        return <People />;
      case "clinic":
        return <DirectionsRun />;
      case "courier":
        return <LocalShipping />;
      default:
        return <People />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case "branch":
        return theme.palette.primary.main;
      case "clinic":
        return theme.palette.success.main;
      case "courier":
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getModeColorVariant = (mode) => {
    switch (mode) {
      case "branch":
        return "primary";
      case "clinic":
        return "success";
      case "courier":
        return "secondary";
      default:
        return "default";
    }
  };

  const scheduleData = {
    Monday: ["Tharamangalam", "Elampillai", "Mecheri"],
    Wednesday: ["Valapadi", "Attur"],
    Friday: ["Andalur Gate", "Namakkal"],
    Sunday: ["Arur", "Tharumapuri"],
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  // Add this function to your Dashboard.jsx or a relevant file

  const fetchDetailsByPatientId = async (patientId) => {
    try {
      // Assuming your backend supports filtering by patientId as a query param
      const res = await customFetch.get(`/details?patientId=${patientId}`);
      // res.data will be an array of details documents for that patient
      // If you expect only one, you can use res.data[0]
      return res.data;
    } catch (err) {
      console.error("Error fetching details for patient:", err);
      return null;
    }
  };

  // To fetch details for a specific patientId
  const handleViewDetails = async (patientId) => {
    const details = await fetchDetailsByPatientId(patientId);
    if (details && details.length > 0) {
      // Navigate with the detailsId (assuming you want the first one)
      navigate("/details", { state: { detailsId: details[0]._id } });
    } else {
      // Handle case where no details found
     toast.error("No details found for this patient.");
    }
  };
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "grey.50",
          minHeight: "100vh",
          mt: { xs: 8, sm: 10, md: 0 },
          ml: { xs: 0, sm: 1, md: -2 },
          mr: { xs: 0, sm: 2, md: 0 },
          pt: { xs: 2, sm: 1, md: 0 },
          px: { xs: 2, sm: 1, md: 2 },
          pb: { xs: 2, sm: 1, md: 0 },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            pl: { xs: 0, sm: 2, md: 4 },
            mt: { xs: 2, sm: 3, md: 5 },
          }}
        >
          <Card
            elevation={2}
            sx={(theme) => ({
              // background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
              background: "linear-gradient(135deg, #b2e8e3 0%, #a8e5dd 100%)",

              border: `1px solid ${theme.palette.primary.main}33`, // or use alpha utility explicitly
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            })}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                Selected Date
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {selectedDate.format("dddd, MMMM D, YYYY")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <People color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {patientData.length} Total Patients
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            mt: 5,
            pl: { xs: 0, sm: 3, md: 4 },
            pr: { xs: 0, sm: 3, md: 4 },
            justifyContent: "center",
          }}
        >
          {sortedModes.map((mode) => (
            <Grid item xs={12} md={4} key={mode}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: 267,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getModeColor(mode),
                        width: 56,
                        height: 56,
                      }}
                    >
                      {getModeIcon(mode)}
                    </Avatar>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {modeCounts[mode]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patients
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {mode}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={maxRows > 0 ? (modeCounts[mode] / maxRows) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(getModeColor(mode), 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getModeColor(mode),
                        borderRadius: 4,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },

            mt: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Calendar Section */}
          <Card
            elevation={3}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "white",
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => setOpen(true)}
              >
                <CalendarToday />
                Select Date
              </Typography>

              <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                  {/* Close button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      Place Visit Schedule
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {Object.entries(scheduleData).map(([day, places]) => (
                      <ListItem
                        key={day}
                        alignItems="flex-start"
                        disableGutters
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {day}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" fontWeight="medium">
                              {places.join(", ")}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Modal>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Grid
                container
                spacing={4}
                alignItems="center"
                style={{ justifyContent: "space-around" }}
              >
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        "& .MuiDateCalendar-root": {
                          width: "100%",
                          maxWidth: "none",
                        },
                      }}
                    >
                      <DateCalendar
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        sx={{
                          "& .MuiPickersDay-root": {
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          },
                          "& .Mui-selected": {
                            background:
                              "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)!important",
                            color: "white !important",
                          },
                        }}
                      />
                    </Paper>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={2}
                    sx={{
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      border: ` 1px solid ${alpha(
                        theme.palette.grey[300],
                        0.5
                      )}`,
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2, sm: 3 },
                        width: "100%",
                        maxWidth: 500,
                        mx: "auto",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              bgcolor: "white",
                              borderRadius: 2,
                              boxShadow: 1,
                              border: "1px solid #e0e0e0",
                              p: { xs: 2, sm: 3 },
                            }}
                          >
                            {/* Header */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Filter fontSize="small" />
                                Filters
                              </Typography>
                              <Button
                                size="small"
                                onClick={clearFilters}
                                startIcon={<Delete fontSize="small" />}
                                sx={{
                                  color: "error.main",
                                  textTransform: "none",
                                }}
                              >
                                Clear
                              </Button>
                            </Box>

                            {/* Filters */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                              }}
                            >
                              {/* Patient Name */}
                              <Box>
                                <Typography variant="body2" mb={1}>
                                  Patient Name
                                </Typography>
                                <Box sx={{ position: "relative" }}>
                                  <Person
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: 12,
                                      transform: "translateY(-50%)",
                                      color: "primary.main",
                                      fontSize: 20,
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) =>
                                      handleFilterChange("name", e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="patient name"
                                  />
                                </Box>
                              </Box>

                              {/* Phone Number */}
                              <Box>
                                <Typography variant="body2" mb={1}>
                                  Phone Number
                                </Typography>
                                <Box sx={{ position: "relative" }}>
                                  <PhoneAndroid
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: 12,
                                      transform: "translateY(-50%)",
                                      color: "green",
                                      fontSize: 20,
                                    }}
                                  />
                                  <input
                                    type="number"
                                    value={filters.phone}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "phone",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="phone number"
                                  />
                                </Box>
                              </Box>

                              {/* Diagnosis */}
                              <Box>
                                <Typography variant="body2" mb={1}>
                                  Diagnosis
                                </Typography>
                                <Box sx={{ position: "relative" }}>
                                  <MedicationOutlined
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: 12,
                                      transform: "translateY(-50%)",
                                      color: "primary.main",
                                      fontSize: 20,
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={filters.diagnosis}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "diagnosis",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="diagnosis"
                                  />
                                </Box>
                              </Box>

                              {/* Address */}
                              <Box>
                                <Typography variant="body2" mb={1}>
                                  Address
                                </Typography>
                                <Box sx={{ position: "relative" }}>
                                  <Map
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: 12,
                                      transform: "translateY(-50%)",
                                      color: "primary.main",
                                      fontSize: 20,
                                    }}
                                  />
                                  <input
                                    list="address-options"
                                    type="text"
                                    value={filters.address}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "address",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="address"
                                  />
                                  <datalist id="address-options">
                                    {[
                                      "Tharamangalam",
                                      "Elampillai",
                                      "Mecheri",
                                      "Valapadi",
                                      "Attur",
                                      "Andalur gate",
                                      "Namakkal",
                                      "Arur",
                                      "Tharumapuri",
                                    ].map((option) => (
                                      <option key={option} value={option} />
                                    ))}
                                  </datalist>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Table Section */}
          <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              sx={{
                // bgcolor: "grey.50",
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                borderBottom: ` 1px solid ${theme.palette.divider}`,
                p: 2,
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <People />
                Patient Details
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        letterSpacing: 1,
                      }}
                    >
                      S.No
                    </TableCell>
                    {sortedModes.map((mode) => (
                      <TableCell
                        key={mode}
                        sx={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          letterSpacing: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {getModeIcon(mode)}
                          <Typography
                            variant="inherit"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {mode}
                          </Typography>
                          <Chip
                            label={modeCounts[mode]}
                            size="small"
                            color={getModeColorVariant(mode)}
                            sx={{ minWidth: 24, height: 20 }}
                          />
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: maxRows }).map((_, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },

                        "&:nth-of-type(even)": {
                          bgcolor: alpha(theme.palette.grey[50], 0.5),
                        },
                      }}
                    >
                      <TableCell sx={{ bgcolor: "grey.50" }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 32,
                            height: 32,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </TableCell>
                      {sortedModes.map((mode) => {
                        const patient = groupedByMode[mode][index];
                        return (
                          <TableCell key={mode}>
                            {patient ? (
                              <Card
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  width: 300,
                                  bgcolor: alpha(theme.palette.grey[50], 0.8),
                                  border: `1px solid ${alpha(
                                    getModeColor(mode),
                                    0.2
                                  )}`,
                                  borderRadius: 2,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: alpha(getModeColor(mode), 0.05),
                                    borderColor: alpha(getModeColor(mode), 0.3),
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <People
                                    sx={{ color: "primary.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {patient.patient?.name || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Phone
                                    sx={{ color: "success.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {patient.patient?.phone || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <LocationOn
                                    sx={{ color: "success.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {patient.patient?.address || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocalPharmacy
                                    sx={{
                                      color: "secondary.main",
                                      fontSize: 16,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Remain:{" "}
                                    {patient.patient?.pendingDays || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocalPharmacy
                                    sx={{
                                      color: "secondary.main",
                                      fontSize: 16,
                                    }}
                                  />
                                  {/* <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Remain:{" "}
                                    {patient.patient?.pendingDays || "N/A"}
                                  </Typography> */}
                                  {/* <Button
                                    onClick={() =>
                                      handleViewDetails(patient._id)
                                    }
                                    sx={{ width: 100 }}
                                  >
                                    View
                                  </Button> */}
                                  <Button
                                    onClick={() =>
                                      navigate("/dashboard/details", {
                                        state: {
                                          patientId: patient?.patient?._id,
                                        },
                                      })
                                    }
                                  >
                                    View
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      navigate("/dashboard/upload", {
                                        state: { patient: patient?.patient },
                                      })
                                    }
                                  >
                                    Add
                                  </Button>
                                </Box>
                              </Card>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: 80,
                                  color: "text.disabled",
                                }}
                              >
                                <Typography variant="h4">-</Typography>
                              </Box>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {maxRows === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={sortedModes.length + 1}
                        sx={{ py: 8, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                          >
                            <People sx={{ fontSize: 32, color: "grey.400" }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              gutterBottom
                            >
                              No patients scheduled
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                              No patient data available for the selected date.
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;

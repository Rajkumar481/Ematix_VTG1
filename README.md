"use client";

import { useEffect, useState } from "react";
import {
Box,
Typography,
Paper,
Grid,
Card,
CardContent,
CardHeader,
Button,
Chip,
Tabs,
Tab,
Accordion,
AccordionSummary,
AccordionDetails,
CircularProgress,
Alert,
AlertTitle,
Divider,
Avatar,
IconButton,
Tooltip,
} from "@mui/material";
import {
Calendar,
Clock,
CheckCircle,
Warning,
People,
ChevronRight,
CalendarToday,
ExpandMore,
Update,
} from "@mui/icons-material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import { useNavigate } from "react-router-dom"; // ✅ correct
import { Hourglass } from "lucide-react";

dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

const Status = () => {
const [loading, setLoading] = useState(true);
const [pending, setPending] = useState([]);
const [cleared, setCleared] = useState([]);
const [tabValue, setTabValue] = useState(0);
const router = useNavigate();
// navigate("/some-route");

useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
try {
// Mock API call - replace with actual API
const mockData = [
{
_id: "1",
patient: {
_id: "p1",
name: "John Doe",
age: 45,
phone: "+1234567890",
},
nextVisit: "2024-01-20",
progress: "pending",
medicineName: "Metformin",
medicineTakenPatient: 7,
startDate: "2024-01-15",
mode: "In-person",
},
{
_id: "2",
patient: {
_id: "p2",
name: "Jane Smith",
age: 32,
phone: "+1234567891",
},
nextVisit: "2024-02-05",
progress: "clear",
medicineName: "Lisinopril",
medicineTakenPatient: 14,
startDate: "2024-01-20",
mode: "Telemedicine",
},
{
_id: "3",
patient: {
_id: "p3",
name: "Bob Johnson",
age: 58,
phone: "+1234567892",
},
nextVisit: dayjs().format("YYYY-MM-DD"),
progress: "pending",
medicineName: "Atorvastatin",
medicineTakenPatient: 10,
startDate: "2024-01-10",
mode: "In-person",
},
{
_id: "4",
patient: {
_id: "p4",
name: "Alice Brown",
age: 28,
phone: "+1234567893",
},
nextVisit: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
progress: "pending",
medicineName: "Omeprazole",
medicineTakenPatient: 5,
startDate: "2024-01-18",
mode: "Telemedicine",
},
];

      const clearedList = [];
      const pendingList = [];

      mockData.forEach((detail) => {
        const patient = detail.patient;
        if (!patient) return;

        const progress = detail.progress;
        if (progress === "clear") {
          clearedList.push(detail);
        } else {
          pendingList.push(detail);
        }
      });

      // Sort pending by date (oldest to newest)
      pendingList.sort((a, b) => {
        const aDate = dayjs(a.nextVisit);
        const bDate = dayjs(b.nextVisit);
        return aDate.valueOf() - bDate.valueOf();
      });

      setPending(pendingList);
      setCleared(clearedList);
    } catch (err) {
      console.error("Failed to fetch patient details", err);
    } finally {
      setLoading(false);
    }

};

const groupPendingByDate = (data) => {
const past = [];
const today = [];
const future = [];
const todayDate = dayjs().startOf("day");

    data.forEach((item) => {
      const visitDate = dayjs(item.nextVisit);
      if (!visitDate.isValid()) return;

      if (visitDate.isBefore(todayDate)) {
        past.push(item);
      } else if (visitDate.isToday()) {
        today.push(item);
      } else {
        future.push(item);
      }
    });

    return { past, today, future };

};

const getDateStatus = (date) => {
const visitDate = dayjs(date);
const today = dayjs().startOf("day");
const diffDays = visitDate.diff(today, "day");

    if (diffDays < 0) {
      return {
        status: "overdue",
        color: "error",
        text: `${Math.abs(diffDays)} days overdue`,
        icon: <Warning />,
      };
    }
    if (diffDays === 0) {
      return {
        status: "today",
        color: "primary",
        text: "Today",
        icon: <Calendar />,
      };
    }
    if (diffDays <= 3) {
      return {
        status: "soon",
        color: "warning",
        text: `In ${diffDays} days`,
        icon: <Clock />,
      };
    }
    return {
      status: "scheduled",
      color: "default",
      text: `In ${diffDays} days`,
      icon: <CalendarToday />,
    };

};

const handleUpdate = (item) => {
router.push(`/upload?patientId=${item.patient._id}`);
};

const renderPatientCard = (item, index) => {
const dateStatus = getDateStatus(item.nextVisit);

    return (
      <Card key={item._id} sx={{ mb: 2, "&:hover": { boxShadow: 3 } }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                {index + 1}
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {item.patient?.name || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {item.patient?.age} • {item.mode}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={dateStatus.text}
              color={dateStatus.color}
              icon={dateStatus.icon}
              size="small"
            />
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Medicine:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {item.medicineName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Duration:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {item.medicineTakenPatient} days
              </Typography>
            </Grid>
          </Grid>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                Next Visit:{" "}
              </Typography>
              <Typography variant="body2" fontWeight="medium" component="span">
                {item.nextVisit
                  ? dayjs(item.nextVisit).format("DD MMM YYYY")
                  : "-"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleUpdate(item)}
              endIcon={<ChevronRight />}
            >
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
    );

};

const renderTableSection = (title, data, icon) => {
if (data.length === 0) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="subtitle1">{title}</Typography>
            <Chip label={data.length} size="small" color="primary" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>{data.map((item, idx) => renderPatientCard(item, idx))}</Box>
        </AccordionDetails>
      </Accordion>
    );

};

const renderPendingSection = () => {
const { past, today, future } = groupPendingByDate(pending);

    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Clock color="warning" />
          <Typography variant="h6">Pending Patients</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Patients with upcoming or overdue visits
        </Typography>

        {pending.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Hourglass sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">No pending patients</Typography>
          </Box>
        ) : (
          <Box>
            {renderTableSection(
              "Overdue Visits",
              past,
              <Warning color="error" />
            )}
            {renderTableSection(
              "Today's Visits",
              today,
              <Calendar color="primary" />
            )}
            {renderTableSection(
              "Upcoming Visits",
              future,
              <CalendarToday color="success" />
            )}
          </Box>
        )}
      </Paper>
    );

};

const renderClearedSection = () => (
<Paper sx={{ p: 3 }}>
<Box display="flex" alignItems="center" gap={1} mb={2}>
<CheckCircle color="success" />
<Typography variant="h6">Cleared Patients</Typography>
</Box>
<Typography variant="body2" color="text.secondary" mb={3}>
Patients who have completed their treatment
</Typography>

      {cleared.length === 0 ? (
        <Box textAlign="center" py={4}>
          <CheckCircle sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography color="text.secondary">No cleared patients</Typography>
        </Box>
      ) : (
        <Box>
          {cleared.map((item, idx) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                bgcolor: "success.light",
                borderColor: "success.main",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {item.patient?.name || "-"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed on{" "}
                        {item.nextVisit
                          ? dayjs(item.nextVisit).format("DD MMM YYYY")
                          : "-"}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="Cleared" color="success" />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>

);

const stats = {
total: pending.length + cleared.length,
pending: pending.length,
cleared: cleared.length,
overdue: groupPendingByDate(pending).past.length,
today: groupPendingByDate(pending).today.length,
};

if (loading) {
return (
<Box sx={{ p: 3 }}>
<Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
        >
<Box textAlign="center">
<CircularProgress size={48} sx={{ mb: 2 }} />
<Typography color="text.secondary">
Loading patient data...
</Typography>
</Box>
</Box>
</Box>
);
}

return (
<Box sx={{ p: 3 }}>
{/_ Header _/}
<Box mb={4}>
<Typography variant="h4" component="h1" gutterBottom>
Patient Status Summary
</Typography>
<Typography variant="body1" color="text.secondary">
Overview of patient visits and treatment status
</Typography>
</Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <People color="primary" />
            </Box>
            <Typography variant="h4" component="div">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Patients
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <Clock color="warning" />
            </Box>
            <Typography variant="h4" component="div" color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <CheckCircle color="success" />
            </Box>
            <Typography variant="h4" component="div" color="success.main">
              {stats.cleared}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cleared
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <Warning color="error" />
            </Box>
            <Typography variant="h4" component="div" color="error.main">
              {stats.overdue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <Calendar color="primary" />
            </Box>
            <Typography variant="h4" component="div" color="primary.main">
              {stats.today}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Today
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Alerts */}
      {stats.overdue > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Attention Required</AlertTitle>
          You have {stats.overdue} overdue patient{stats.overdue > 1 ? "s" : ""}{" "}
          that need immediate attention.
        </Alert>
      )}

      {stats.today > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Today's Schedule</AlertTitle>
          You have {stats.today} patient visit{stats.today > 1 ? "s" : ""}{" "}
          scheduled for today.
        </Alert>
      )}

      {/* Main Content */}
      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Clock />
                Pending ({stats.pending})
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle />
                Cleared ({stats.cleared})
              </Box>
            }
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && renderPendingSection()}
          {tabValue === 1 && renderClearedSection()}
        </Box>
      </Paper>
    </Box>

);
};

export default Status;

import React, { useEffect, useState } from "react";
import {
Box,
Typography,
Paper,
Table,
TableHead,
TableRow,
TableCell,
TableBody,
CircularProgress,
Grid,
Button,
} from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PatientStatusSummary = () => {
const [loading, setLoading] = useState(true);
const [pending, setPending] = useState([]);
const [cleared, setCleared] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
try {
const res = await axios.get("http://localhost:5000/api/details");
const data = res.data;
console.log(data);

      const clearedList = [];
      const pendingList = [];

      data.forEach((detail) => {
        const patient = detail.patient;
        if (!patient) return;

        const progress = detail.progress;

        if (progress === "clear") {
          clearedList.push(detail);
        } else {
          pendingList.push(detail); // add all other statuses
        }
      });

      // Sort pending by date (oldest to newest)
      pendingList.sort((a, b) => {
        const aDate = dayjs(a.nextVisit);
        const bDate = dayjs(b.nextVisit);
        return aDate - bDate;
      });

      setPending(pendingList);
      setCleared(clearedList);
    } catch (err) {
      console.error("Failed to fetch patient details", err);
    } finally {
      setLoading(false);
    }

};

const groupPendingByDate = (data) => {
const past = [];
const today = [];
const future = [];

    const todayDate = dayjs().startOf("day");

    data.forEach((item) => {
      const visitDate = dayjs(item.nextVisit);
      if (!visitDate.isValid()) return;

      if (visitDate.isBefore(todayDate)) {
        past.push(item);
      } else if (visitDate.isToday()) {
        today.push(item);
      } else {
        future.push(item);
      }
    });

    return { past, today, future };

};

// const handleUpdate = (item) => {
// // 🔄 Replace with actual navigation or modal
// alert(`Update form for: ${item.patient?.name}`);
// };

const renderTableSection = (title, data) => (
<Accordion>
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
<Typography variant="subtitle1">{title}</Typography>
</AccordionSummary>
<AccordionDetails>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>S.No</TableCell>
<TableCell>Patient Name</TableCell>
<TableCell>Next Visit</TableCell>
<TableCell>Action</TableCell>
</TableRow>
</TableHead>
<TableBody>
{data.length === 0 ? (
<TableRow>
<TableCell colSpan={4} align="center">
<Typography color="text.secondary">
No records available.
</Typography>
</TableCell>
</TableRow>
) : (
data.map((item, idx) => (
<TableRow key={item._id}>
<TableCell>{idx + 1}</TableCell>
<TableCell>{item.patient?.name || "-"}</TableCell>
<TableCell>
{item.nextVisit
? dayjs(item.nextVisit).format("DD-MM-YYYY")
: "-"}
</TableCell>
<TableCell>
<Button
variant="outlined"
size="small"
onClick={() =>
navigate("/upload", {
state: { patient: item.patient },
})
} >
Update Form
</Button>
</TableCell>
</TableRow>
))
)}
</TableBody>
</Table>
</AccordionDetails>
</Accordion>
);

const renderPendingTable = () => {
const { past, today, future } = groupPendingByDate(pending);

    return (
      <Box component={Paper} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🟡 Pending Patients
        </Typography>
        {pending.length === 0 ? (
          <Typography color="text.secondary">No pending records.</Typography>
        ) : (
          <>
            {renderTableSection("📍 Past Dates", past)}
            {renderTableSection("📍 Today", today)}
            {renderTableSection("📍 Upcoming", future)}
          </>
        )}
      </Box>
    );

};

const renderClearedTable = () => (
<Accordion>
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
<Typography variant="subtitle1">✅ Cleared Patients</Typography>
</AccordionSummary>
<AccordionDetails>
<Table size="small">
<TableHead>
<TableRow>
<TableCell>S.No</TableCell>
<TableCell>Patient Name</TableCell>
<TableCell>Next Visit</TableCell>
</TableRow>
</TableHead>
<TableBody>
{cleared.length === 0 ? (
<TableRow>
<TableCell colSpan={3} align="center">
<Typography color="text.secondary">
No cleared records.
</Typography>
</TableCell>
</TableRow>
) : (
cleared.map((item, idx) => (
<TableRow key={item._id}>
<TableCell>{idx + 1}</TableCell>
<TableCell>{item.patient?.name || "-"}</TableCell>
<TableCell>
{item.nextVisit
? dayjs(item.nextVisit).format("DD-MM-YYYY")
: "-"}
</TableCell>
</TableRow>
))
)}
</TableBody>
</Table>
</AccordionDetails>
</Accordion>
);

return (
<Box sx={{ p: 3 }}>
<Typography variant="h4" gutterBottom>
Patient Status Summary
</Typography>
{loading ? (
<CircularProgress />
) : (
<Grid container spacing={2}>
<Grid item xs={12} md={6}>
{renderPendingTable()}
</Grid>
<Grid item xs={12} md={6}>
{renderClearedTable()}
</Grid>
</Grid>
)}
</Box>
);
};

export default PatientStatusSummary;










<!-- eidt form -->

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   IconButton,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Alert,
//   CircularProgress,
//   Paper,
//   InputAdornment,
//   useTheme,
//   useMediaQuery,
//   Fade,
//   Slide,
// } from "@mui/material";
// import {
//   Close,
//   CalendarToday,
//   LocalPharmacy,
//   Biotech,
//   Assignment,
//   CloudUpload,
//   Person,
//   CheckCircle,
//   Error,
//   Delete,
// } from "@mui/icons-material";

// const UpdatePatientDetailsModal = ({ open, handleClose, detail, refresh }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));
//   const [modalInitialized, setModalInitialized] = useState(false);

//   const [formData, setFormData] = useState({
//     startDate: "",
//     medicineTakenPatient: "",
//     mode: "",
//     nextVisitMode: "",
//     medicineName: "",
//     SGPT: "",
//     SGOT: "",
//     totalBilirubin: "",
//   });
//   const [newImages, setNewImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // useEffect(() => {
//   //   if (detail) {
//   //     setFormData({
//   //       startDate: new Date(detail.startDate).toISOString().split("T")[0],
//   //       medicineTakenPatient: detail.medicineTakenPatient,
//   //       mode: detail.mode,
//   //       nextVisitMode: detail.nextVisitMode || "",
//   //       medicineName: detail.medicineName || "",
//   //       SGPT: detail.SGPT || "",
//   //       SGOT: detail.SGOT || "",
//   //       totalBilirubin: detail.totalBilirubin || "",
//   //     });
//   //     setNewImages([]);
//   //     setError(null);
//   //     setSuccess(false);
//   //   }
//   // }, [detail]);
//   useEffect(() => {
//     if (detail) {
//       setFormData({
//         startDate: detail.startDate
//           ? new Date(detail.startDate).toISOString().split("T")[0]
//           : "",
//         medicineTakenPatient: detail.medicineTakenPatient || "",
//         mode: detail.mode || "",
//         nextVisitMode: detail.nextVisitMode || "",
//         medicineName: detail.medicineName || "",
//         SGPT: detail.SGPT || "",
//         SGOT: detail.SGOT || "",
//         totalBilirubin: detail.totalBilirubin || "",
//       });
//       setNewImages([]);
//       setError(null);
//       setSuccess(false);
//     }
//   }, [detail?._id]); //

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setError(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files) {
//       setNewImages(Array.from(e.target.files));
//     }
//   };

//   const removeImage = (indexToRemove) => {
//     setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
//   };

//   const validateForm = () => {
//     if (!formData.startDate) return "Start date is required";
//     if (!formData.medicineTakenPatient) return "Medicine days is required";
//     if (!formData.mode) return "Mode is required";
//     return null;
//   };

//   const handleUpdate = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("patient", detail.patient._id);

//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       newImages.forEach((file) => {
//         formDataToSend.append("images", file);
//       });

//       const response = await fetch(
//         `http://localhost:5000/api/details/${detail._id}`,
//         {
//           method: "PATCH",
//           body: formDataToSend,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Update failed");
//       }

//       setSuccess(true);
//       setTimeout(() => {
//         refresh();
//         handleClose();
//       }, 1500);
//     } catch (error) {
//       setError("Failed to update patient details. Please try again.");
//       console.error("Update failed", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const modeOptions = [
//     { value: "clinic", label: "Clinic" },
//     { value: "courier", label: "Courier" },
//     { value: "branch", label: "Branch" },
//   ];

//   const SectionCard = ({ icon, title, color, children }) => (
//     <Card
//       elevation={2}
//       sx={{
//         mb: 3,
//         borderLeft: `4px solid ${color}`,
//         "&:hover": {
//           elevation: 4,
//           transform: "translateY(-2px)",
//           transition: "all 0.3s ease-in-out",
//         },
//       }}
//     >
//       <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//         <Box display="flex" alignItems="center" mb={2}>
//           {icon}
//           <Typography
//             variant={isMobile ? "h6" : "h5"}
//             fontWeight="600"
//             ml={1}
//             color={color}
//           >
//             {title}
//           </Typography>
//         </Box>
//         {children}
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="lg"
//       fullWidth
//       fullScreen={isMobile}
//       TransitionComponent={isMobile ? Slide : Fade}
//       TransitionProps={isMobile ? { direction: "up" } : {}}
//       PaperProps={{
//         sx: {
//           borderRadius: isMobile ? 0 : 2,
//           maxHeight: isMobile ? "100vh" : "95vh",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           p: { xs: 2, sm: 3 },
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//           // position: "sticky",
//           // top: 0,
//           // zIndex: 1,
//           position: "relative", // or remove entirely
//         }}
//       >
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Box display="flex" alignItems="center">
//             <Person sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
//             <Typography variant={isMobile ? "h6" : "h5"} fontWeight="600">
//               Update Patient Details
//             </Typography>
//           </Box>
//           <IconButton
//             onClick={handleClose}
//             sx={{
//               color: "white",
//               "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
//             }}
//           >
//             <Close />
//           </IconButton>
//         </Box>

//         {detail?.patient && (
//           <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//             {/* <Chip
//               label={`ID: ${detail.patient._id}`}
//               size="small"
//               sx={{
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 color: "white",
//                 fontSize: { xs: "0.7rem", sm: "0.75rem" },
//               }}
//             /> */}
//             {detail.patient.name && (
//               <Chip
//                 label={detail.patient.name}
//                 size="small"
//                 variant="outlined"
//                 sx={{
//                   borderColor: "white",
//                   color: "white",
//                   fontSize: { xs: "0.7rem", sm: "0.75rem" },
//                 }}
//               />
//             )}
//           </Box>
//         )}
//       </DialogTitle>

//       <DialogContent
//         dividers
//         sx={{
//           p: { xs: 1, sm: 2, md: 3 },
//           backgroundColor: "#f8fafc",
//           maxHeight: isMobile ? "calc(100vh - 64px)" : "auto", // prevent overflow on mobile
//           overflowY: "auto",
//         }}
//       >
//         <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 3, borderRadius: 2 }}
//               icon={<Error />}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 3, borderRadius: 2 }}
//               icon={<CheckCircle />}
//             >
//               Patient details updated successfully!
//             </Alert>
//           )}

//           {/* Basic Information */}
//           <SectionCard
//             icon={
//               <CalendarToday
//                 sx={{ color: "#3b82f6", fontSize: { xs: 20, sm: 24 } }}
//               />
//             }
//             title="Basic Information"
//             color="#3b82f6"
//           >
//             <Grid container spacing={{ xs: 2, sm: 3 }}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="Start Date"
//                   value={formData.startDate}
//                   onChange={(e) =>
//                     handleInputChange("startDate", e.target.value)
//                   }
//                   InputLabelProps={{ shrink: true }}
//                   required
//                   size={isMobile ? "small" : "medium"}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": { borderColor: "#3b82f6" },
//                       "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Medicine Days"
//                   placeholder="Enter number of days"
//                   value={formData.medicineTakenPatient}
//                   onChange={(e) =>
//                     handleInputChange("medicineTakenPatient", e.target.value)
//                   }
//                   required
//                   size={isMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">days</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": { borderColor: "#3b82f6" },
//                       "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
//                     },
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </SectionCard>

//           {/* Medicine Information */}
//           <SectionCard
//             icon={
//               <LocalPharmacy
//                 sx={{ color: "#10b981", fontSize: { xs: 20, sm: 24 } }}
//               />
//             }
//             title="Medicine Information"
//             color="#10b981"
//           >
//             <TextField
//               fullWidth
//               label="Medicine Name"
//               placeholder="Enter medicine name"
//               value={formData.medicineName}
//               onChange={(e) =>
//                 handleInputChange("medicineName", e.target.value)
//               }
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "&:hover fieldset": { borderColor: "#10b981" },
//                   "&.Mui-focused fieldset": { borderColor: "#10b981" },
//                 },
//               }}
//             />
//           </SectionCard>

//           {/* Lab Results */}
//           <SectionCard
//             icon={
//               <Biotech
//                 sx={{ color: "#ef4444", fontSize: { xs: 20, sm: 24 } }}
//               />
//             }
//             title="Lab Results"
//             color="#ef4444"
//           >
//             <Grid container spacing={{ xs: 2, sm: 3 }}>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="SGPT (ALT)"
//                   placeholder="Enter value"
//                   value={formData.SGPT}
//                   onChange={(e) => handleInputChange("SGPT", e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="SGOT (AST)"
//                   placeholder="Enter value"
//                   value={formData.SGOT}
//                   onChange={(e) => handleInputChange("SGOT", e.target.value)}
//                   size={isMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">U/L</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": { borderColor: "#ef4444" },
//                       "&.Mui-focused fieldset": { borderColor: "#ef4444" },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Total Bilirubin"
//                   placeholder="Enter value"
//                   value={formData.totalBilirubin}
//                   onChange={(e) =>
//                     handleInputChange("totalBilirubin", e.target.value)
//                   }
//                   size={isMobile ? "small" : "medium"}
//                   inputProps={{ step: "0.1" }}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">mg/dL</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": { borderColor: "#ef4444" },
//                       "&.Mui-focused fieldset": { borderColor: "#ef4444" },
//                     },
//                   }}
//                 />
//               </Grid>
//             </Grid>

//             <Paper
//               elevation={0}
//               sx={{
//                 mt: 2,
//                 p: 2,
//                 backgroundColor: "#dbeafe",
//                 borderRadius: 2,
//                 border: "1px solid #93c5fd",
//               }}
//             >
//               <Typography variant="body2" color="#1e40af" fontWeight="500">
//                 <strong>Normal Ranges:</strong> SGPT: 7-56 U/L • SGOT: 10-40 U/L
//                 • Total Bilirubin: 0.3-1.2 mg/dL
//               </Typography>
//             </Paper>
//           </SectionCard>

//           {/* Visit Information */}
//           <SectionCard
//             icon={
//               <Assignment
//                 sx={{ color: "#8b5cf6", fontSize: { xs: 20, sm: 24 } }}
//               />
//             }
//             title="Visit Information"
//             color="#8b5cf6"
//           >
//             <Grid container spacing={{ xs: 2, sm: 3 }}>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//                   <InputLabel>Current Mode *</InputLabel>
//                   <Select
//                     value={formData.mode}
//                     onChange={(e) => handleInputChange("mode", e.target.value)}
//                     label="Current Mode *"
//                     sx={{
//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#8b5cf6",
//                       },
//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#8b5cf6",
//                       },
//                     }}
//                   >
//                     {modeOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//                   <InputLabel>Next Visit Mode</InputLabel>
//                   <Select
//                     value={formData.nextVisitMode}
//                     onChange={(e) =>
//                       handleInputChange("nextVisitMode", e.target.value)
//                     }
//                     label="Next Visit Mode"
//                     sx={{
//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#8b5cf6",
//                       },
//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#8b5cf6",
//                       },
//                     }}
//                   >
//                     {modeOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </SectionCard>

//           {/* File Upload */}
//           <SectionCard
//             icon={
//               <CloudUpload
//                 sx={{ color: "#f59e0b", fontSize: { xs: 20, sm: 24 } }}
//               />
//             }
//             title="Upload Images"
//             color="#f59e0b"
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 border: "2px dashed #d1d5db",
//                 borderRadius: 2,
//                 p: { xs: 2, sm: 4 },
//                 textAlign: "center",
//                 backgroundColor: "#fafafa",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   borderColor: "#f59e0b",
//                   backgroundColor: "#fef3c7",
//                 },
//               }}
//               component="label"
//             >
//               <CloudUpload
//                 sx={{ fontSize: { xs: 32, sm: 48 }, color: "#9ca3af", mb: 1 }}
//               />
//               <Typography
//                 variant="body1"
//                 fontWeight="500"
//                 color="#f59e0b"
//                 gutterBottom
//               >
//                 Click to upload images
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Support: JPG, PNG, GIF (Max 5MB each)
//               </Typography>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />
//             </Paper>

//             {newImages.length > 0 && (
//               <Box mt={3}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={2}
//                 >
//                   <Chip
//                     label={`${newImages.length} image(s) selected`}
//                     color="primary"
//                     size="small"
//                   />
//                   <Button
//                     size="small"
//                     color="error"
//                     onClick={() => setNewImages([])}
//                     startIcon={<Delete />}
//                   >
//                     Clear All
//                   </Button>
//                 </Box>
//                 <Grid container spacing={1}>
//                   {newImages.map((file, index) => (
//                     <Grid item xs={12} sm={6} md={4} key={index}>
//                       <Paper
//                         elevation={1}
//                         sx={{
//                           p: 1.5,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           backgroundColor: "#f8fafc",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           noWrap
//                           sx={{ flex: 1, mr: 1 }}
//                         >
//                           {file.name}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => removeImage(index)}
//                         >
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Paper>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
//             )}
//           </SectionCard>
//         </Box>
//       </DialogContent>

//       <Divider />

//       <DialogActions
//         sx={{
//           p: { xs: 2, sm: 3 },
//           backgroundColor: "#ffffff",
//           position: "sticky",
//           bottom: 0,
//           zIndex: 1,
//         }}
//       >
//         <Box
//           display="flex"
//           gap={2}
//           width="100%"
//           flexDirection={{ xs: "column", sm: "row" }}
//           justifyContent="flex-end"
//         >
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             disabled={isLoading}
//             size={isMobile ? "large" : "medium"}
//             sx={{
//               minWidth: { xs: "100%", sm: 120 },
//               order: { xs: 2, sm: 1 },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpdate}
//             disabled={isLoading || success}
//             size={isMobile ? "large" : "medium"}
//             sx={{
//               minWidth: { xs: "100%", sm: 140 },
//               background: success
//                 ? "linear-gradient(45deg, #10b981, #059669)"
//                 : "linear-gradient(45deg, #667eea, #764ba2)",
//               "&:hover": {
//                 background: success
//                   ? "linear-gradient(45deg, #059669, #047857)"
//                   : "linear-gradient(45deg, #5a67d8, #6b46c1)",
//               },
//               order: { xs: 1, sm: 2 },
//             }}
//             startIcon={
//               isLoading ? (
//                 <CircularProgress size={20} color="inherit" />
//               ) : success ? (
//                 <CheckCircle />
//               ) : null
//             }
//           >
//             {isLoading ? "Updating..." : success ? "Updated" : "Update Details"}
//           </Button>
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdatePatientDetailsModal;

import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const UpdatePatientDetailsModal = ({ open, handleClose, detail, refresh }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      setError(null);
      setSuccess(false);
    }
  }, [detail?._id, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    setNewImages([...e.target.files]);
  };

  const validateForm = () => {
    if (
      !formData.startDate ||
      !formData.medicineTakenPatient ||
      !formData.mode
    ) {
      return "Please fill in all required fields.";
    }
    return null;
  };

  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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

      const response = await fetch(
        `http://localhost:5000/api/details/${detail._id}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setSuccess(true);
      setTimeout(() => {
        refresh();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to update patient details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Patient Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Medicine Taken by Patient"
              name="medicineTakenPatient"
              fullWidth
              value={formData.medicineTakenPatient}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mode"
              name="mode"
              fullWidth
              value={formData.mode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Next Visit Mode"
              name="nextVisitMode"
              fullWidth
              value={formData.nextVisitMode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Medicine Name"
              name="medicineName"
              fullWidth
              value={formData.medicineName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="SGPT"
              name="SGPT"
              fullWidth
              value={formData.SGPT}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="SGOT"
              name="SGOT"
              fullWidth
              value={formData.SGOT}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Total Bilirubin"
              name="totalBilirubin"
              fullWidth
              value={formData.totalBilirubin}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Images (optional)
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Updated successfully!
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePatientDetailsModal;

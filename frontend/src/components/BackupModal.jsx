import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Download,
  Delete,
  CloudDownload,
  Warning,
  DateRange,
  DeleteSweep,
  Close,
} from "@mui/icons-material";
import dayjs from "dayjs";
import customFetch from "../utils/customFetch";

const BackupModal = ({ open, onClose }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    title: "",
    message: "",
  });

  const validateDates = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isAfter(end)) {
      setError("Start date cannot be after end date");
      return false;
    }

    if (end.isAfter(dayjs())) {
      setError("End date cannot be in the future");
      return false;
    }

    setError("");
    return true;
  };

  const showMessage = (message, isSuccess = false) => {
    if (isSuccess) {
      setSuccess(message);
      setError("");
    } else {
      setError(message);
      setSuccess("");
    }

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

const handleDownload = async (url, filename) => {
  try {
    setLoading(true);

    const response = await customFetch.get(url, {
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];
    if (!contentType.includes("application/zip")) {
      throw new Error("Invalid file type received");
    }

    const blob = response.data;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    showMessage("Backup downloaded successfully!", true);
  } catch (error) {
    console.error("Download error:", error);
    showMessage(`Download failed: ${error?.message || "Unknown error"}`);
  } finally {
    setLoading(false);
  }
};


const handleBackup = async () => {
  if (!validateDates()) return;

  const url = `/backup/by-date?start=${startDate}&end=${endDate}`;
  await handleDownload(url, `patient_backup_${startDate}_to_${endDate}.zip`);
};

const handleFullBackup = async () => {
  const url = `/backup/all`;
  await handleDownload(url, `full_backup_${dayjs().format("YYYY-MM-DD")}.zip`);
};


 const handleDeleteByDate = async () => {
  if (!validateDates()) return;

  try {
    setLoading(true);

    const response = await customFetch.delete(
      `/backup/delete/by-date?start=${startDate}&end=${endDate}`
    );

    showMessage(response.data.message || "Images deleted successfully.", true);
  } catch (error) {
    console.error("Delete error:", error);
    showMessage(
      `Delete failed: ${error?.response?.data?.message || error.message}`
    );
  } finally {
    setLoading(false);
  }
};


const handleFullDelete = async () => {
  try {
    setLoading(true);

    const response = await customFetch.delete(`/backup/delete/all`);

    showMessage(response.data.message || "All images deleted successfully.", true);
  } catch (error) {
    console.error("Delete error:", error);
    showMessage(
      `Delete failed: ${error?.response?.data?.message || error.message}`
    );
  } finally {
    setLoading(false);
  }
};


  const openConfirmDialog = (type, title, message) => {
    setConfirmDialog({ open: true, type, title, message });
  };

  const handleConfirm = async () => {
    setConfirmDialog({ open: false, type: null, title: "", message: "" });

    switch (confirmDialog.type) {
      case "deleteByDate":
        await handleDeleteByDate();
        break;
      case "deleteAll":
        await handleFullDelete();
        break;
      case "backupAll":
        await handleFullBackup();
        break;
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: null, title: "", message: "" });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CloudDownload color="primary" />
            <Typography variant="h5" component="h2" fontWeight={600}>
              Backup Management
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

       <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Date Range Section */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DateRange color="primary" />
                    Date Range Selection
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        disabled={loading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        disabled={loading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >

                  <Button
                    variant="contained"
                    onClick={() => setOpenConfirm(true)} // show modal
                    disabled={loading}
                    startIcon={<Download />}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Download Backup by Date
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      openConfirmDialog(
                        "deleteByDate",
                        "Delete Images by Date",
                        `Are you sure you want to delete images from ${startDate} to ${endDate}? This action cannot be undone.`
                      )
                    }
                    disabled={loading}
                    startIcon={<Delete />}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Delete Images by Date
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Full Operations Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <CloudDownload color="secondary" />
                    Full Operations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Perform operations on all data in the system.
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >

                  <Tooltip title="Download all images from the system">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        openConfirmDialog(
                          "backupAll",
                          "Full Backup",
                          "Download all images from the system? This may take some time for large datasets."
                        )
                      }
                      disabled={loading}
                      startIcon={<CloudDownload />}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Full Backup (All Images)
                    </Button>
                  </Tooltip>

                  <Tooltip title="Permanently delete all images">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        openConfirmDialog(
                          "deleteAll",
                          "Delete All Images",
                          "Are you sure you want to delete ALL images from the system? This action is IRREVERSIBLE and will permanently remove all data."
                        )
                      }
                      disabled={loading}
                      startIcon={<DeleteSweep />}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Delete All Images
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="warning" />
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {confirmDialog.message}
          </Typography>
          {confirmDialog.type?.includes("delete") && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Warning: This action cannot be undone!
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={closeConfirmDialog}
            variant="outlined"
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={confirmDialog.type?.includes("delete") ? "error" : "primary"}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600 }}
          >
            {confirmDialog.type?.includes("delete") ? "Delete" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Backup</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to download the backup by date?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleBackup(); // perform the backup
              setOpenConfirm(false); // close modal
            }}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BackupModal;

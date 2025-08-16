import React, { useState } from "react";
import BackupModal from "../components/BackupModal";
import {
  Button,
  Container,
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

const BackupDeleteCards = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={6} mt={{ xs: 4, md: 6 }}>
          <Typography
            variant={isSmDown ? "h4" : "h3"}
            component="h1"
            fontWeight={700}
            color="#137570"
            gutterBottom
          >
            Data Management Center
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={600}
            mx="auto"
            sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }}
          >
            Securely backup, download, and manage your image data with our
            comprehensive management system
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            width: "100%",
            maxWidth: 420,
            mx: "auto",
          }}
        >
          <CloudDownload
            sx={{
              fontSize: { xs: 48, sm: 64 },
              mb: 2,
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Ready to Manage Your Data?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              opacity: 0.9,
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            Access all backup and deletion tools in one convenient interface
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpen(true)}
            fullWidth
            sx={{
              bgcolor: "white",
              color: "#137570",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              "&:hover": {
                bgcolor: "grey.100",
                transform: "scale(1.02)",
              },
              transition: "transform 0.2s ease",
            }}
          >
            Open Backup Manager
          </Button>
        </Paper>

        {/* Modal */}
        <BackupModal open={open} onClose={() => setOpen(false)} />
      </Box>
    </Container>
  );
};

export default BackupDeleteCards;

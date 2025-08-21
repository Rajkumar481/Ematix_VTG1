import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/vtg1.png";
import background from "../assets/images/herbalbg.avif";
import customFetch from "../utils/customFetch";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  bgcolor: "white",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPin, setResetPin] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle login with backend
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      toast.error("Both fields are required");
      return;
    }
    try {
      const res = await customFetch.post("/auth/login", { name, password });
      toast.success("Login successful");
      if (onLogin) onLogin();
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.msg ||
          "Login failed. Please check your credentials."
      );
    }
  };

  // Handle password reset with backend
  const handleResetPassword = async () => {
    if (!resetPin || !newPassword || !confirmPassword || userName.trim() === "") {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await customFetch.post("/auth/change-password", {
        pin: resetPin,
        newPassword,
        name: userName,
      });
      toast.success("Password updated successfully");
      setShowResetModal(false);
      setResetPin("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Failed to reset password. Invalid PIN?"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      {/* ❌ Removed <ToastContainer /> from here */}

      <Paper
        elevation={6}
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(134, 239, 172, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          position: "relative",
          textAlign: "center",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: 120, height: 120, objectFit: "contain" }}
          />
        </Box>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          VTG HERBALS
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                borderRadius: 1,
                backgroundColor: "transparent",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4ade80",
                },
              },
            }}
            inputProps={{ style: { color: "white" } }}
          />

          <TextField
            fullWidth
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                borderRadius: 1,
                backgroundColor: "transparent",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4ade80",
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{ style: { color: "white" } }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              backgroundColor: "#86efac",
              color: "black",
              fontSize: "1rem",
              py: 1.5,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#86efac",
              },
            }}
          >
            Login
          </Button>
        </form>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            onClick={() => setShowResetModal(true)}
            sx={{ color: "white", fontSize: "0.9rem" }}
          >
            Forgot Password?
          </Button>
        </Box>

        {/* Forgot Password Modal */}
        <Modal open={showResetModal} onClose={() => setShowResetModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Reset Password (Admin Only)
            </Typography>

            <TextField
              fullWidth
              label="User Name"
              type="text"
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Admin PIN"
              type="password"
              margin="normal"
              value={resetPin}
              onChange={(e) => setResetPin(e.target.value)}
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              sx={{ mt: 2 }}
            >
              Update Password
            </Button>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default Login;


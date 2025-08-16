"use client";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import logo from "../assets/images/vtg1.png";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const drawerWidth = 300;

const navigationItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: DashboardIcon,
  },
  {
    title: "Add Patient",
    path: "/addpatient",
    icon: PersonAddIcon,
  },
  {
    title: "Patient List",
    path: "/patientlist",
    icon: PeopleIcon,
  },
  {
    title: "Status",
    path: "/status",
    icon: AssessmentIcon,
  },
  {
    title: "Settings",
    path: "/backup",
    icon: SettingsIcon,
  },
];

export default function MedicalSidebar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await customFetch.get("/auth/logout");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0f766e 0%, #134e4a 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Header Section - Enhanced Gradient */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)",
          color: "white",
          p: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          },
        }}
      >
        {/* <Box
          sx={{
            position: "relative",
            p: 1,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        > */}
        <img
          src={logo || "/placeholder.svg"}
          alt="VTG Logo"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
        {/* </Box> */}
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="800"
            lineHeight={1.1}
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            VTG
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="600"
            lineHeight={1.1}
            sx={{
              color: "#ccfbf1",
              letterSpacing: "0.5px",
            }}
          >
            Herbals
          </Typography>
        </Box>
      </Box>

      {/* Navigation Section - Enhanced Background */}
      <Box
        sx={{
          flex: 1,
          background:
            "linear-gradient(180deg, #f0fdfa 0%, #e6fffa 50%, #ccfbf1 100%)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(13,148,136,0.2) 50%, transparent 100%)",
          },
        }}
      >
        <List sx={{ flex: 1, p: 3, pt: 4 }}>
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <ListItem key={item.title} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleNavClick}
                  sx={{
                    borderRadius: 3,
                    py: 2,
                    px: 3,
                    minHeight: 56,
                    position: "relative",
                    overflow: "hidden",
                    background: isActive
                      ? "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"
                      : "transparent",
                    color: isActive ? "white" : "#134e4a",
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive
                      ? "0 8px 25px rgba(13,148,136,0.3), 0 3px 10px rgba(13,148,136,0.2)"
                      : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
                    "&::before": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                          pointerEvents: "none",
                        }
                      : {},
                    "&:hover": {
                      background: isActive
                        ? "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)"
                        : "linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(15,118,110,0.12) 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: isActive
                        ? "0 12px 35px rgba(13,148,136,0.4), 0 5px 15px rgba(13,148,136,0.3)"
                        : "0 6px 20px rgba(13,148,136,0.15)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 48,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.4rem",
                        filter: isActive
                          ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                          : "none",
                      },
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: "inherit",
                      fontSize: "1rem",
                      letterSpacing: "0.3px",
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 12,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.8)",
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Enhanced Divider */}
        <Divider
          sx={{
            mx: 3,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(13,148,136,0.3) 50%, transparent 100%)",
            height: "2px",
          }}
        />

        {/* Logout Section - Enhanced */}
        <Box sx={{ p: 3 }}>
          <ListItemButton
            onClick={() => {
              handleLogout();
              handleNavClick();
            }}
            sx={{
              borderRadius: 3,
              py: 2,
              px: 3,
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              color: "white",
              fontWeight: 600,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(220,38,38,0.3)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                pointerEvents: "none",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                transform: "translateY(-2px)",
                boxShadow:
                  "0 8px 25px rgba(220,38,38,0.4), 0 3px 10px rgba(220,38,38,0.3)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 48 }}>
              <LogoutIcon sx={{ fontSize: "1.4rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: "0.3px",
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Enhanced Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            color: "#134e4a",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(13,148,136,0.1)",
          }}
        >
          <Toolbar sx={{ px: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={logo || "/placeholder.svg"}
                alt="VTG Logo"
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                VTG Herbals
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Enhanced Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          pt: { xs: 8, md: 0 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: { xs: 0, md: drawerWidth },
            right: 0,
            height: "100vh",
            background:
              "radial-gradient(circle at 70% 30%, rgba(13,148,136,0.03) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(15,118,110,0.02) 0%, transparent 50%)",
            pointerEvents: "none",
            zIndex: -1,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

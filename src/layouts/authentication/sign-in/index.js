import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  InputAdornment,
  IconButton,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { loginAdmin } from "api/auth";

import NasiiiLogo from "assets/images/Logo.png"; // ✅ replace with your actual path

function SignIn() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin({ email: adminId, password });

      if (res?.statusCode === 200 && res?.status === true && res?.message === "Login successfully") {
        Cookies.set("token", res?.data?.Token);
        toast.success(res.message || "Login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <MDBox
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
background: `linear-gradient(
  135deg,
  rgba(108, 202, 240, 1),    // light blue
  rgba(247, 198, 91, 1),     // yellow
  rgba(123, 184, 142, 1),    // greenish
  rgba(244, 67, 54, 1)       // red (material red 500)
)`,
      }}
    >
      <Card
        sx={{
          width: 420,
          px: 4,
          py: 5,
          borderRadius: 3,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Box
            component="img"
            src={NasiiiLogo}
            alt="Nasiii Logo"
            sx={{ height: 50, objectFit: "contain" }}
          />
        </Box>

        {/* Headings */}
        <MDBox textAlign="center" mb={3}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Welcome to RideXtra Admin Panel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please login to continue
          </Typography>
        </MDBox>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <MDBox mb={3}>
            <MDInput
              type="email"
              label="Email"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>

          <MDBox mb={3}>
            <MDInput
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>

          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            fullWidth
            sx={{ py: 1, fontWeight: "bold", fontSize: "15px" }}
          >
            Login to Panel
          </MDButton>
        </form>

        {/* Optional footer message */}
        <MDBox mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} RideXtra. All rights reserved.
          </Typography>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default SignIn;

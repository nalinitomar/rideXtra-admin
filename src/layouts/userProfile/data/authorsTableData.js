import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { userData, changeStatus } from "../../../api/data";
import { toast } from "react-toastify";
// Replace DeleteIcon with Eye Icon
import { Visibility as EyeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // for navigation
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function useAuthorsData() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);

  // status change popup
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusUserId, setStatusUserId] = useState(null);
  const [newStatus, setNewStatus] = useState(null); // true = active, false = inactive

  const navigate = useNavigate(); // Initialize navigation

  const columns = [
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Mobile", accessor: "mobile", align: "left" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "View", accessor: "view", align: "center" }, // changed column name
  ];

  // confirm status change
  const handleConfirmStatusChange = async () => {
    try {
      const data = await changeStatus({
        id: statusUserId,
        block: newStatus ? false : true,
      });

      if (data.statusCode === 200 && data.status === true) {
        toast.success(`User ${newStatus ? "activated" : "deactivated"} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setStatusDialog(false);
      setStatusUserId(null);
      setNewStatus(null);
    }
  };

  const fetchData = async () => {
    try {
      const res = await userData(page, limit);
      const users = res.data?.data || [];

      const formattedRows = users.map((user) => ({
        name: (
          <MDTypography variant="caption" fontWeight="medium">
            {user.name}
          </MDTypography>
        ),
        mobile: user.phone,
        email: user.email,
        status: (
          <MDBox>
            <select
              value={user.isBlocked ? "false" : "true"}
              onChange={(e) => {
                const selected = e.target.value === "true"; // true = Active
                setStatusUserId(user._id);
                setNewStatus(selected);
                setStatusDialog(true);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: user.isBlocked ? "#f44336" : "#4caf50",
                color: "#fff",
                border: "none",
              }}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </MDBox>
        ),
        view: (
          <MDBox
            onClick={() => navigate(`/admin/user/${user._id}`)}
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#e0f7fa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#00acc1",
                transform: "scale(1.1)",
              },
            }}
          >
            <EyeIcon sx={{ color: "#007c91", fontSize: "20px" }} />
          </MDBox>
        ),

      }));

      setRows(formattedRows);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return {
    columns,
    rows,
    page,
    setPage,
    totalPages,

    // status popup
    statusDialog,
    setStatusDialog,
    handleConfirmStatusChange,
  };
}
<Card
        sx={{
          p: 2,
          mb: 3,
          height: 170,
          backgroundColor: "#b9b7b7ff",
          position: "relative", // needed for absolute corner
        }}
      >
        {/* Top Right Corner Fill */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderTop: "100px solid",
            borderLeft: "100px solid transparent",
            borderTopColor: user.isBlocked ? "#d32f2f" : "#2e7d32",
          }}
        />
        {/* Corner Text */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 100,     // same as triangle size
            height: 80,    // same as triangle size
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(45deg) translate(10px, -10px)", // adjust for perfect centering
            transformOrigin: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            textTransform: "uppercase",
            pointerEvents: "none", // so it doesn’t block clicks
          }}
        >
          {user.isBlocked ? "Inactive" : "Active"}
        </Box>


        <Grid container alignItems="center" height="100%">
          {/* Left - Avatar */}
          <Grid item xs={3} display="flex" justifyContent="left">
            <Avatar
              src={user.image}
              alt={user.name}
              variant="square"
              sx={{ width: 140, height: 140, borderRadius: 2 }}
            />
          </Grid>

          {/* Right - Info */}
          <Grid item xs={9}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Name - {user.name}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email - {user.email}{" "}
                    {user.emailVerified ? (
                      <CheckCircle sx={{ fontSize: 16, color: "green", ml: 1 }} />
                    ) : (
                      <Cancel sx={{ fontSize: 16, color: "red", ml: 1 }} />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{user.phone}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          
        </Grid>
      </Card>

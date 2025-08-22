import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { GetAllDriver, changeDriverStatus } from "../../../api/data";
import { toast } from "react-toastify";
// Replace DeleteIcon with Eye Icon
import { Visibility as EyeIcon, History as HistoryIcon } from "@mui/icons-material";
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
  const [limit, setLimit] = useState(20); // Make limit a state variable
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // status change popup
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusUserId, setStatusUserId] = useState(null);
  const [newStatus, setNewStatus] = useState(null); // true = active, false = inactive

  const navigate = useNavigate(); // Initialize navigation

  const columns = [
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Mobile", accessor: "mobile", align: "left" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Admin Verified", accessor: "verified", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Profile", accessor: "Profle", align: "center" }, // changed column name
    { Header: "Ride History", accessor: "history", align: "center" }, // changed column name
  ];

  // confirm status change
  const handleConfirmStatusChange = async () => {
    try {
      const data = await changeDriverStatus({
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
      const res = await GetAllDriver(page, limit); // Use the limit state
      const users = res.data?.data || [];
      console.log("driver", users, "limit:", limit);
      
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
        verified: (
          <MDBox>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: user.isadminVerified ? "#4caf50" : "#f44336",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {user.isadminVerified ? "Verified" : "Unverified"}
            </span>
          </MDBox>
        ),

        Profle: (
          <MDBox
            onClick={() => navigate(`/drivers/profile/${user._id}`)}
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
        history: (
          <MDBox
            onClick={() => navigate(`/drivers/history/${user._id}`)}
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
            <HistoryIcon sx={{ color: "#007c91", fontSize: "20px" }} />
          </MDBox>
        ),
      }));

      setRows(formattedRows);
      setTotalPages(res.data?.totalPages || 1);
      setTotalItems(res.data?.totalDocuments || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]); // Add limit as a dependency

  return {
    columns,
    rows,
    page,
    setPage,
    limit,
    setLimit, // Export setLimit
    totalPages,
    totalItems,
    statusDialog,
    setStatusDialog,
    handleConfirmStatusChange,
  };
}
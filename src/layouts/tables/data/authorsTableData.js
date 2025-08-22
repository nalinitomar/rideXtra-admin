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
            onClick={() => navigate(`/users/profile/${user._id}`)}
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

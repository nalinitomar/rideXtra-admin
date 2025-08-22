import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  
} from "@mui/material";
import { Button as MuiButton } from "@mui/material"; // alias to avoid conflict
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDTypography  from "components/MDTypography"
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useAuthorsData from "layouts/driverHistory/data/authorsTableData";

function Tables() {
  const {
    columns,
    rows,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    openDialog,
    setOpenDialog,
    statusDialog,
    setStatusDialog,
    handleConfirmStatusChange,
    handleDelete,
  } = useAuthorsData();

  const buttonStyle = {
    borderRadius: "12px",
    minWidth: "42px",
    height: "36px",
    fontWeight: "bold",
    fontSize: "14px",
    textTransform: "none",
    color: "#1A237E",
    borderColor: "#1A237E",
    "&:hover": {
      borderColor: "#0D47A1",
      color: "#0D47A1",
    },
  };

  // Handle limit change
  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Pagination renderer
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    // Always show first page
    pages.push(
      <Button
        key={1}
        variant={page === 1 ? "contained" : "outlined"}
        color="primary"
        onClick={() => setPage(1)}
        sx={buttonStyle}
      >
        1
      </Button>
    );

    // Show dots if needed
    if (page > 3) {
      pages.push(
        <Button key="start-dots" disabled sx={{ opacity: 1, color: "#9E9E9E", fontWeight: "bold" }}>
          ...
        </Button>
      );
    }

    // Show pages around current page
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(
        <Button
          key={p}
          variant={page === p ? "contained" : "outlined"}
          color="primary"
          onClick={() => setPage(p)}
          sx={buttonStyle}
        >
          {p}
        </Button>
      );
    }

    // Show dots if needed
    if (page < totalPages - 2) {
      pages.push(
        <Button key="end-dots" disabled sx={{ opacity: 1, color: "#9E9E9E", fontWeight: "bold" }}>
          ...
        </Button>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={page === totalPages ? "contained" : "outlined"}
          color="primary"
          onClick={() => setPage(totalPages)}
          sx={buttonStyle}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* Add limit selector */}
              <MDBox display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Drivers ({totalItems})
                </MDTypography>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="limit-select-label">Items per page</InputLabel>
                  <Select
                    labelId="limit-select-label"
                    value={limit}
                    onChange={handleLimitChange}
                    label="Items per page"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
              
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false} // Disable internal pagination
                  showTotalEntries={false} // We'll show our own total
                  noEndBorder
                />
              </MDBox>

              {totalPages > 1 && (
                <MDBox display="flex" justifyContent="center" pb={2}>
                  <Stack direction="row" spacing={1}>
                    {renderPagination()}
                  </Stack>
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleDelete} color="error" autoFocus>
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this user&rsquo;s status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmStatusChange} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
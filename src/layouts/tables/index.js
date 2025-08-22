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
import { Button as MuiButton } from "@mui/material"; // to avoid conflict with MUI Button

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useAuthorsData from "layouts/tables/data/authorsTableData";

function Tables() {
  const {
    columns,
    rows,
    page,
    setPage,
    totalPages,
    openDialog,
    setOpenDialog,

    statusDialog,
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

  const renderPagination = () => {
    const pages = [];

    // Always show page 1
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

    // Show dots after 1
    if (page > 3) {
      pages.push(
        <Button key="start-dots" disabled sx={{ opacity: 1, color: "#9E9E9E", fontWeight: "bold" }}>
          ...
        </Button>
      );
    }

    // Show nearby pages
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

    // Show dots before last page
    if (page < totalPages - 2) {
      pages.push(
        <Button key="end-dots" disabled sx={{ opacity: 1, color: "#9E9E9E", fontWeight: "bold" }}>
          ...
        </Button>
      );
    }

    // Show last page
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
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>

              <MDBox display="flex" justifyContent="center" pb={2}>
                <Stack direction="row" spacing={1}>
                  {renderPagination()}
                </Stack>
              </MDBox>
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
            Are you sure you want to change this user’s status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmStatusChange} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;

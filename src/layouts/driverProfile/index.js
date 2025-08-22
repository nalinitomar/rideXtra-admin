import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  Button,
  Chip,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import { ArrowBack, CheckCircle, Cancel } from "@mui/icons-material";
import {
  GetDriverById,
  VerifyBank,
  VerifyVehicle,
  VerifyLicense,
  VerifyByAdmin,
} from "../../api/data";
import { toast } from "react-toastify";

export default function DriverProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // driverId from URL params

  const [driver, setDriver] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ✅ Fetch driver
  const fetchDriver = async () => {
    try {
      const response = await GetDriverById(id);
      if (
        response.statusCode === 200 &&
        response.status === true &&
        response.message === "data get successfully"
      ) {
        setDriver(response?.data || response);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching driver");
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [id]);

  if (!driver) return <p>Loading...</p>;

  // ✅ Open confirmation popup
  const handleVerifyClick = (section, status) => {
    setPendingAction({ section, status });
    setOpenDialog(true);
  };

  // ✅ Execute API after confirm
  const confirmVerifyAction = async () => {
    if (!pendingAction) return;

    const { section, status } = pendingAction;
    try {
      let response;

      switch (section) {
        case "bank":
          response = await VerifyBank(id, status);
          break;
        case "vehicle":
          response = await VerifyVehicle(id, status);
          break;
        case "license":
          response = await VerifyLicense(id, status);
          break;
        case "profile":
          response = await VerifyByAdmin(id, status);
          break;
        default:
          break;
      }

      if (response?.statusCode === 200 && response?.status === true) {
        toast.success(response?.message || "Verification updated");
      } else {
        toast.error(response?.message || "Failed to verify");
      }

      // 🔄 Refresh driver data after any action
      await fetchDriver();
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Error verifying driver");
    }

    setOpenDialog(false);
    setPendingAction(null);
  };

  const cancelVerifyAction = () => {
    setOpenDialog(false);
    setPendingAction(null);
  };

  // ✅ Card styling
  const cardStyles = (isVerified) => ({
    position: "relative",
    border: isVerified ? "2px solid #2e7d32" : "2px solid #f30101",
    backgroundColor: isVerified ? "#f1f8f4" : "#fff",
    borderRadius: "16px", // ✅ fully rounded corners
    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",   // ✅ ensures no cut edges
  });

  const renderRow = (label1, value1, label2, value2) => (
    <Grid container spacing={2} mb={1}>
      <Grid item xs={6}>
        <Typography>
          <strong>{label1}:</strong> {value1}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          <strong>{label2}:</strong> {value2}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderVerifyButtons = (section) => (
    <Box mt={2} display="flex" justifyContent="space-between">
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckCircle />}
        sx={{ borderRadius: 20, px: 3 }}
        onClick={() => handleVerifyClick(section, true)}
      >
        Verified
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<Cancel />}
        sx={{ borderRadius: 20, px: 3 }}
        onClick={() => handleVerifyClick(section, false)}
      >
        Unverified
      </Button>
    </Box>
  );

  return (
    <Box p={3} sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Back Button */}
      <IconButton sx={{ color: "black", mb: 2 }} onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12}>
          <Card sx={cardStyles(driver?.isadminVerified)}>
            <CardHeader
              title="👤 Profile Details"
              action={
                <Chip
                  label={driver?.isBlocked ? "Inactive" : "Active"}
                  color={driver?.isBlocked ? "error" : "success"}
                  sx={{ fontWeight: "bold", px: 2 }}
                />
              }
              sx={{ borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  sx={{ display: "flex", justifyContent: "left" }}
                >
                  <Avatar
                    src={driver.driverPhoto || undefined}
                    alt={driver.name}
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: 2,
                      fontSize: 128,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  >
                    {!driver.image && driver.name
                      ? driver.name.charAt(0).toUpperCase()
                      : ""}
                  </Avatar>
                </Grid>
                <Grid item xs={9}>
                  {renderRow(
                    "Name",
                    driver?.name,
                    "Email",
                    <>
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {driver?.email}
                        {driver?.isEmailVerified ? (
                          <CheckCircle
                            sx={{
                              fontSize: 16,
                              color: "green",
                              marginLeft: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : (
                          <Cancel
                            sx={{
                              fontSize: 16,
                              color: "red",
                              marginLeft: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                      </span>
                    </>
                  )}

                  {renderRow("Phone", driver?.phone, "Country", driver?.country)}
                  {renderRow(
                    "Currency",
                    driver?.currency,
                    "Vehicle",
                    driver?.VehicalDetails?.brand
                  )}
                  {renderRow(
                    "Wallet",
                    `${getSymbolFromCurrency(driver?.currency || "USD")} ${driver?.Wallet || 0}`,
                    "Daily Wallet",
                    `${getSymbolFromCurrency(driver?.currency || "USD")} ${driver?.DailyWallet || 0}`

                  )}
                  {renderRow(
                    "Status",
                    driver?.status,
                    "Admin Approved",
                    driver?.isadminVerified ? "✅ Yes" : "❌ No"
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyles(driver?.isvehicleVerified)}>
            <CardHeader
              title="🚘 Vehicle Details"
              sx={{ borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}
            />
            <CardContent>
              {renderRow(
                "Brand",
                driver?.VehicalDetails?.brand,
                "Model",
                driver?.VehicalDetails?.model
              )}
              {renderRow(
                "Year",
                driver?.VehicalDetails?.year,
                "Color",
                driver?.VehicalDetails?.color
              )}
              {renderRow(
                "Plate",
                driver?.VehicalDetails?.plateNumber,
                "Capacity",
                `${driver?.VehicalDetails?.seatingCapacity ?driver?.VehicalDetails?.seatingCapacity :"Seat Not Mention" }`
              )}
              {renderRow("Electric", driver?.VehicalDetails?.electric, "", "")}
              {renderVerifyButtons("vehicle")}
            </CardContent>
          </Card>
        </Grid>

        {/* Bank Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyles(driver?.isbankVerified)}>
            <CardHeader
              title="🏦 Bank Details"
              sx={{ borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}
            />
            <CardContent>
              {renderRow(
                "Beneficiary",
                driver?.bankDetails?.BeneficiaryName,
                "Account No",
                driver?.bankDetails?.bankAccount
              )}
              {renderRow(
                "Bank",
                driver?.bankDetails?.bankName,
                "Branch",
                driver?.bankDetails?.branch
              )}
              {renderRow(
                "City",
                driver?.bankDetails?.city,
                "Type",
                driver?.bankDetails?.AccountType
              )}
              {renderRow(
                "IFSC/Code",
                driver?.bankDetails?.Code,
                "Effective Date",
                driver?.bankDetails?.effectiveDate ? new Date(driver?.bankDetails?.effectiveDate)
                  .toISOString() 
                  .split("T")[0] :""
              )}
              {renderVerifyButtons("bank")}
            </CardContent>
          </Card>
        </Grid>

        {/* License Card */}
        <Grid item xs={12}>
          <Card sx={cardStyles(driver?.islicenseVerified)}>
            <CardHeader
              title="🪪 Driver License"
              sx={{ borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}
            />
            <CardContent>
              {driver?.drivinglicense ? (
                <Box
                  component="img"
                  src={driver?.drivinglicense}
                  alt="License"
                  sx={{
                    width: 300,
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <Typography>No license uploaded</Typography>
              )}
              {renderVerifyButtons("license")}
            </CardContent>
          </Card>
        </Grid>

        {/* ✅ Final Master Verification Button at Bottom */}
        <Grid item xs={12}>
          <Box mt={4} display="flex" justifyContent="center" gap={3}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              sx={{ borderRadius: 20, px: 4 }}
              onClick={() => handleVerifyClick("profile", true)}
            >
              Verify Driver
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Cancel />}
              sx={{ borderRadius: 20, px: 4 }}
              onClick={() => handleVerifyClick("profile", false)}
            >
              Unverify Driver
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* ✅ Confirmation Popup */}
      <Dialog open={openDialog} onClose={cancelVerifyAction}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <b>{pendingAction?.status ? "Verify" : "Unverify"}</b> this{" "}
            <b>{pendingAction?.section}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelVerifyAction} color="error">
            Cancel
          </Button>
          <Button onClick={confirmVerifyAction} color="success" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ArrowBack,
  Visibility,
  LocationOn,
  Person,
  DirectionsCar,
  Payment,
} from "@mui/icons-material";
import { GetUserById, GetUserTrips } from "../../api/data";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRide, setSelectedRide] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetUserById(id);
        if (
          response.statusCode === 200 &&
          response.status === true &&
          response.message === "data get successfully"
        ) {
          toast.success(response.message);
          setUser(response?.data || response);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error(error);
      }
    };

    const fetchTrips = async () => {
      try {
        const response = await GetUserTrips(id);
        if (response.statusCode === 200 && response.status === true) {
          toast.success(response.message);
          const rideData = response?.data?.data || [];
          setHistory(rideData);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error(error);
      }
    };

    fetchUser();
    fetchTrips();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return timeString;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (ride) => {
    setSelectedRide(ride);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Accepted":
        return "primary";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      case "In Progress":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box p={3}>
      {/* Back Arrow */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ color: "black", p: 0, mb: 2 }}
      >
        <ArrowBack />
      </IconButton>

      {/* Profile Card */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#b9b7b7ff",
          position: "relative",
          minHeight: "200px",
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
            borderTop: "80px solid",
            borderLeft: "80px solid transparent",
            borderTopColor: user.isBlocked ? "#d32f2f" : "#2e7d32",
          }}
        />
        {/* Corner Text */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 80,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(45deg) translate(8px, -8px)",
            transformOrigin: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {user.isBlocked ? "Inactive" : "Active"}
        </Box>

        <Grid container alignItems="center" spacing={2}>
          {/* Left - Avatar */}
          <Grid item xs={12} sm={3} sx={{ display: "flex", justifyContent: "left" }}>
            <Avatar
              src={user.image || undefined}
              alt={user.name}
              sx={{
                width: 200,
                height: 200,
                borderRadius: 2,
                fontSize: 128,
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
            >
              {!user.image && user.name
                ? user.name.charAt(0).toUpperCase()
                : ""}
            </Avatar>
          </Grid>

          {/* Middle - Basic Info */}
          <Grid item xs={12} sm={5}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="subtitle1">{user.name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="subtitle1">{user.phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  Email:
                </Typography>

                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" sx={{ mr: 0.5 }}>
                    {user.email}
                  </Typography>
                  {user.isEmailVerified ? (
                    <CheckCircle sx={{ fontSize: 16, color: "green" }} />
                  ) : (
                    <Cancel sx={{ fontSize: 16, color: "red" }} />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right - Wallet and Additional Info */}
          <Grid item xs={12} sm={4}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Wallet
                </Typography>
                <Typography variant="subtitle1">
                  {user.walletBalance || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  XtraCoin
                </Typography>
                <Typography variant="subtitle1">{user.coin || 0} </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Due Pay
                </Typography>
                <Typography variant="subtitle1">
                  {user.duePay || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Payment Mode
                </Typography>
                <Typography variant="subtitle1">{user.paymentmode}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="subtitle1">{user.country}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Currency
                </Typography>
                <Typography variant="subtitle1">{user.currency}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* History Table with Pagination */}
      <Paper sx={{ p: 2, overflow: 'hidden', width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Ride History
        </Typography>

        {(() => {
          const rows = Array.isArray(history) ? history : [];
          const start = page * rowsPerPage;
          const end = start + rowsPerPage;
          const pageRows = rows.slice(start, end);

          return (
            <>
              <TableContainer sx={{ maxHeight: 440, borderRadius: 1, width: '100%' }}>
                <Table
                  stickyHeader
                  aria-label="ride history table"
                  sx={{
                    width: '100%',
                    tableLayout: 'fixed',
                    '& .MuiTableCell-root': {
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    '& .MuiTableCell-head': {
                      fontWeight: 600,
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      fontSize: '0.875rem',
                    },
                  }}
                >
                  <TableHead sx={{ maxHeight: 440, borderRadius: 1, width: '100%' }}>
                    <TableRow sx={{ maxHeight: 440, borderRadius: 1, width: '100%' }}>
                      <TableCell align="left" sx={{ width: '9%' }}>Date</TableCell>
                      <TableCell align="left" sx={{ width: '9%' }}>Time</TableCell>
                      <TableCell align="left" sx={{ width: '22%' }}>Pickup Location</TableCell>
                      <TableCell align="left" sx={{ width: '22%' }}>Dropoff Location</TableCell>
                      <TableCell align="right" sx={{ width: '9%' }}>Fare</TableCell>
                      <TableCell align="right" sx={{ width: '9%' }}>Status</TableCell>
                      <TableCell align="right" sx={{ width: '10%' }}>Ride Type</TableCell>
                      <TableCell align="right" sx={{ width: '10%' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pageRows.length > 0 ? (
                      pageRows.map((ride, index) => (
                        <TableRow
                          key={ride._id || index}
                          hover
                          sx={{
                            '&:last-child td': { borderBottom: 0 },
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                          }}
                        >
                          <TableCell align="left" sx={{ width: '9%', whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap title={formatDate(ride.travelDate)}>
                              {formatDate(ride.travelDate)}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" sx={{ width: '9%', whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" noWrap title={formatTime(ride.travelTime)}>
                              {formatTime(ride.travelTime)}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" sx={{ width: '22%', maxWidth: '22%' }}>
                            <Typography
                              variant="body2"
                              noWrap
                              title={ride.pickupLocation?.address}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'text.secondary',
                                display: 'block'
                              }}
                            >
                              {ride.pickupLocation?.address || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" sx={{ width: '22%', maxWidth: '22%' }}>
                            <Typography
                              variant="body2"
                              noWrap
                              title={ride.dropLocation?.address}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'text.secondary',
                                display: 'block'
                              }}
                            >
                              {ride.dropLocation?.address || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ width: '9%', whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              ₹{ride.fareDetails?.totalFare || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ width: '9%' }}>
                            <Chip
                              label={ride.status || "-"}
                              size="small"
                              color={getStatusColor(ride.status)}
                              variant="filled"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize'
                              }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ width: '10%' }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }} noWrap title={ride.rideType || "-"}>
                              {ride.rideType || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ width: '10%' }}>
                            <IconButton
                              onClick={() => handleOpen(ride)}
                              title="View ride details"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 172, 193, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'primary.main',
                                  color: 'white'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            No ride history found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  width: '100%',
                  borderTop: '1px solid rgba(224, 224, 224, 1)',
                  '.MuiTablePagination-toolbar': {
                    padding: '16px 8px',
                    minHeight: '52px'
                  },
                  '.MuiTablePagination-selectLabel': {
                    margin: 0
                  },
                  '.MuiTablePagination-displayedRows': {
                    margin: 0
                  }
                }}
              />
            </>
          );
        })()}
      </Paper>

      {/* Popup for Ride Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCar sx={{ mr: 1 }} />
          Ride Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedRide ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Ride Information
                  </Typography>
                  <Chip
                    label={selectedRide.status}
                    color={getStatusColor(selectedRide.status)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" noWrap>
                    {formatDate(selectedRide.travelDate)} at {formatTime(selectedRide.travelTime)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} /> Pickup Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedRide.pickupLocation?.address || "Not available"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} /> Dropoff Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedRide.dropLocation?.address || "Not available"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vehicle Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedRide.vehicleType || "-"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Booking Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedRide.bookingType || "-"}
                  </Typography>
                </Box>

                {selectedRide.cancelreason && (
                  <Box sx={{ mt: 2, p: 1, backgroundColor: '#ffeeee', borderRadius: 1 }}>
                    <Typography variant="body2" color="error">
                      <strong>Cancellation Reason:</strong> {selectedRide.cancelreason}
                    </Typography>
                    <Typography variant="body2" color="error">
                      <strong>Cancelled By:</strong> {selectedRide.cancelby}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6">
                    Fare Details
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base Fare
                    </Typography>
                    <Typography variant="body1">
                      ₹{selectedRide.fareDetails?.baseFare || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Distance Fare
                    </Typography>
                    <Typography variant="body1">
                      ₹{selectedRide.fareDetails?.distanceFare || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time Fare
                    </Typography>
                    <Typography variant="body1">
                      ₹{selectedRide.fareDetails?.timeFare || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Toll Fees
                    </Typography>
                    <Typography variant="body1">
                      ₹{selectedRide.fareDetails?.tollFees || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Fare
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ₹{selectedRide.fareDetails?.totalFare || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Distance
                    </Typography>
                    <Typography variant="body1">
                      {selectedRide.fareDetails?.distanceKm || 0} km
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedRide.fareDetails?.timeMin || 0} mins
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Payment sx={{ mr: 1 }} /> Payment Details
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1">
                      {selectedRide.payment?.method || "-"}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body1">
                      ₹{selectedRide.payment?.amount || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Typography variant="body1">
                      {selectedRide.payment?.isPaid ? "Paid" : "Pending"}
                    </Typography>
                  </Box>

                  {selectedRide.payment?.paymentDetails?.transactionId && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Transaction ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedRide.payment.paymentDetails.transactionId}
                      </Typography>
                    </Box>
                  )}

                  {selectedRide.payment?.paymentDetails?.paymentTime && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Time
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedRide.payment.paymentDetails.paymentTime)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography>No ride details found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

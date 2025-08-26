'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getdriverById, getAllUserTripById } from '@/services/driverManagement';
import {
    FiArrowLeft,
    FiMapPin,
    FiPhone,
    FiMail,
    FiDollarSign,
    FiCreditCard,
    FiShield,
    FiUser,
    FiCalendar,
    FiGlobe,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiNavigation,
    FiTruck,
    FiCreditCard as FiCard,
    FiDollarSign as FiCash,
    FiAlertCircle,
    FiMap,
    FiTrendingUp,
    FiLock,
} from 'react-icons/fi';
import Snackbar from '@/components/layout/Snackbar';

export default function UserProfilePage() {
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'trips'
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const resUser = await getdriverById(id);

                if (resUser?.statusCode === 200 && resUser?.status) {
                    setUser(resUser.data);
                } else {
                    throw new Error(resUser?.message || 'Failed to fetch user data');
                }

                // fetch trips
                const resTrips = await getAllUserTripById(id);
                if (resTrips?.statusCode === 200 && resTrips?.status) {
                    // Check if data is nested in a data property
                    const tripsData = resTrips.data.data || resTrips.data;
                    setTrips(tripsData);
                } else {
                    setTrips([]); // fallback
                }

            } catch (err) {
                console.error('Failed to fetch user:', err);
                showSnackbar(err.message || 'Failed to load user data', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        } else {
            showSnackbar('User ID is required', 'error');
            setLoading(false);
        }
    }, [id]);

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ visible: true, message, type });
    };

    const hideSnackbar = () => {
        setSnackbar({ ...snackbar, visible: false });
    };

    // Format date for better readability
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Format time for better readability
    const formatTime = (timeString) => {
        if (!timeString) return '';

        try {
            // Handle both "06:45 PM" format and ISO time format
            if (timeString.includes('PM') || timeString.includes('AM')) {
                return timeString;
            }

            // If it's in ISO format, extract the time part
            const timeParts = timeString.split('T')[1]?.split(':');
            if (timeParts) {
                let hours = parseInt(timeParts[0]);
                const minutes = timeParts[1];
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                return `${hours}:${minutes} ${ampm}`;
            }

            return timeString;
        } catch (error) {
            return timeString;
        }
    };

    // Get status badge with appropriate colors
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>;
            case 'Cancelled':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Cancelled</span>;
            case 'Accepted':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Accepted</span>;
            case 'Pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>;
        }
    };

    // Get payment method icon
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'CASH':
                return <FiCash className="text-green-500" />;
            case 'CARD':
                return <FiCard className="text-blue-500" />;
            case 'PAYPAL':
                return <FiDollarSign className="text-blue-400" />;
            default:
                return <FiCreditCard className="text-gray-500" />;
        }
    };

    // Get vehicle type icon
    const getVehicleIcon = (type) => {
        switch (type) {
            case 'Bike':
                return <FiNavigation className="text-indigo-500" />;
            case 'Sedan':
            case 'SUV':
            case 'Hatchback':
                return <FiTruck className="text-indigo-500" />;
            default:
                return <FiTruck className="text-gray-500" />;
        }
    };

    // Safely get nested properties
    const getSafeValue = (value, fallback = 'Not provided') => {
        return value !== null && value !== undefined ? value : fallback;
    };

    // Calculate trip statistics
    const calculateTripStats = () => {
        const completedTrips = trips.filter(trip => trip.status === 'Completed').length;
        const cancelledTrips = trips.filter(trip => trip.status === 'Cancelled').length;
        const totalSpent = trips
            .filter(trip => trip.status === 'Completed' && trip.fareDetails?.totalFare)
            .reduce((sum, trip) => sum + trip.fareDetails.totalFare, 0);
        
        return {
            total: trips.length,
            completed: completedTrips,
            cancelled: cancelledTrips,
            totalSpent: totalSpent
        };
    };

    const tripStats = calculateTripStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto h-16 w-16 text-red-400 mb-4">
                        <FiXCircle className="w-full h-full" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or couldn't be loaded.</p>
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Tabs for Profile and Trip History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="border-b border-gray-200 flex items-center">
                        {/* Back button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-500 hover:text-gray-700 font-medium py-4 px-6 transition-colors border-b-2 border-transparent"
                        >
                            <FiArrowLeft className="mr-1" /> Back
                        </button>

                        {/* Tabs */}
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab('trips')}
                                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'trips' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Trip History ({trips.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'profile' ? (
                            <>
                                {/* User Stats Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                                <FiTrendingUp className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-indigo-700">Total Trips</p>
                                                <p className="text-xl font-bold text-indigo-900">{tripStats.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                                <FiCheckCircle className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">Completed</p>
                                                <p className="text-xl font-bold text-green-900">{tripStats.completed}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                                                <FiXCircle className="text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-red-700">Cancelled</p>
                                                <p className="text-xl font-bold text-red-900">{tripStats.cancelled}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                                <FiDollarSign className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-700">Total Spent</p>
                                                <p className="text-xl font-bold text-purple-900">₹{tripStats.totalSpent}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile details */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Personal Information */}
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <FiUser className="mr-2 text-indigo-600" /> Personal Information
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                                    <p className="font-medium text-gray-900">{getSafeValue(user.name)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">User ID</p>
                                                    <p className="font-medium text-gray-900 text-sm">{getSafeValue(user._id, 'N/A')}</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FiMail className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{getSafeValue(user.email)}</p>
                                                    </div>
                                                    {user.isEmailVerified ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                                                            <FiCheckCircle className="mr-1" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                                                            <FiXCircle className="mr-1" /> Unverified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FiPhone className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{getSafeValue(user.phone)}</p>
                                                    </div>
                                                    {user.isPhoneVerified ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                                                            <FiCheckCircle className="mr-1" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                                                            <FiXCircle className="mr-1" /> Unverified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Account Created</p>
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900 text-sm">{formatDate(user.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900 text-sm">{formatDate(user.updatedAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location & Preferences */}
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <FiMapPin className="mr-2 text-indigo-600" /> Location & Preferences
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Country</p>
                                                    <div className="flex items-center">
                                                        <FiGlobe className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{getSafeValue(user.country)}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Currency</p>
                                                    <div className="flex items-center">
                                                        <FiDollarSign className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{getSafeValue(user.currency)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Location Coordinates</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FiMap className="mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            {user.location?.coordinates ?
                                                                `${user.location.coordinates[0]}, ${user.location.coordinates[1]}` :
                                                                'Not set'
                                                            }
                                                        </p>
                                                    </div>
                                                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                                                        View Map
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-sm text-gray-500 mb-1">Preferred Payment Method</p>
                                                <div className="flex items-center">
                                                    <FiCreditCard className="mr-2 text-gray-400" />
                                                    <p className="font-medium text-gray-900">{getSafeValue(user.paymentmode)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <FiDollarSign className="mr-2 text-indigo-600" /> Financial Information
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                                <p className="text-sm text-indigo-700 mb-1">Wallet Balance</p>
                                                <p className="text-2xl font-bold text-indigo-900">₹{getSafeValue(user.WalletBalance, 0)}</p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                <p className="text-sm text-amber-700 mb-1">Due Payments</p>
                                                <p className="text-2xl font-bold text-amber-900">₹{getSafeValue(user.duePay, 0)}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <p className="text-sm text-purple-700 mb-1">Xtra Coins</p>
                                                <p className="text-2xl font-bold text-purple-900">{getSafeValue(user.xtracoin, 0)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-700 mb-1">Avg. Trip Cost</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ₹{tripStats.completed > 0 ? Math.round(tripStats.totalSpent / tripStats.completed) : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <FiShield className="mr-2 text-indigo-600" /> Account Status
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-500 mb-1">Account Status</span>
                                                {user.isBlocked ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full self-start flex items-center">
                                                        <FiLock className="mr-1" /> Blocked
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full self-start flex items-center">
                                                        <FiCheckCircle className="mr-1" /> Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-500 mb-1">Deletion Status</span>
                                                {user.isDeleted ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full self-start flex items-center">
                                                        <FiXCircle className="mr-1" /> Deleted
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full self-start flex items-center">
                                                        <FiCheckCircle className="mr-1" /> Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-500 mb-1">Email Verification</span>
                                                {user.isEmailVerified ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full self-start flex items-center">
                                                        <FiCheckCircle className="mr-1" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full self-start flex items-center">
                                                        <FiXCircle className="mr-1" /> Pending
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-500 mb-1">Phone Verification</span>
                                                {user.isPhoneVerified ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full self-start flex items-center">
                                                        <FiCheckCircle className="mr-1" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full self-start flex items-center">
                                                        <FiXCircle className="mr-1" /> Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Trip History Content */
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Trip History</h2>

                                {trips.length === 0 ? (
                                    <div className="text-center py-10">
                                        <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
                                        <p className="mt-1 text-sm text-gray-500">This user hasn't taken any trips yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {trips.map((trip) => (
                                                    <tr key={trip._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{formatDate(trip.travelDate)}</div>
                                                            <div className="text-sm text-gray-500 flex items-center">
                                                                <FiClock className="mr-1" /> {formatTime(trip.travelTime)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {trip.pickupLocation?.address || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                to {trip.dropLocation?.address || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {getVehicleIcon(trip.vehicleType)}
                                                                <span className="ml-2 text-sm text-gray-900">{trip.vehicleType}</span>
                                                            </div>
                                                            {trip.bookingType === 'PoolRide' && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                                                    Shared Ride
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ₹{trip.fareDetails?.totalFare || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {getPaymentMethodIcon(trip.payment?.method)}
                                                                <span className="ml-2 text-sm text-gray-900">{trip.payment?.method}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {trip.payment?.isPaid ? 'Paid' : 'Not Paid'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(trip.status)}
                                                            {trip.status === 'Cancelled' && trip.cancelreason && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Reason: {trip.cancelreason}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Snackbar for notifications */}
            <Snackbar
                visible={snackbar.visible}
                message={snackbar.message}
                type={snackbar.type}
                onClose={hideSnackbar}
                position="bottom-right"
            />
        </div>
    );
}
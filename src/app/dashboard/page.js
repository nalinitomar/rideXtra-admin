'use client'
import { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiTruck, 
  FiUsers, 
  FiDollarSign, 
  FiMap, 
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiSearch
} from 'react-icons/fi';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function RiderAdminDashboard() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [ridersData, setRidersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  // Dummy data for demonstration
  useEffect(() => {
    // Simulate API call for riders
    const riders = [
      { id: 1, name: 'Rajesh Kumar', status: 'active', deliveries: 42, rating: 4.8, vehicle: 'BASIC', earnings: 12500 },
      { id: 2, name: 'Suresh Patel', status: 'active', deliveries: 38, rating: 4.7, vehicle: 'LEXURUY', earnings: 11200 },
      { id: 3, name: 'Amit Sharma', status: 'inactive', deliveries: 25, rating: 4.5, vehicle: 'Bike', earnings: 8500 },
      { id: 4, name: 'Vijay Singh', status: 'active', deliveries: 31, rating: 4.6, vehicle: 'Scooter', earnings: 9800 },
      { id: 5, name: 'Deepak Yadav', status: 'busy', deliveries: 29, rating: 4.4, vehicle: 'Bike', earnings: 9200 },
    ];

    // Simulate API call for orders
    const orders = [
      { id: 1001, customer: 'Aarav Mehta', rider: 'Rajesh Kumar', status: 'delivered', time: '15 mins', amount: 450 },
      { id: 1002, customer: 'Neha Gupta', rider: 'Suresh Patel', status: 'in-progress', time: '25 mins', amount: 320 },
      { id: 1003, customer: 'Priya Singh', rider: null, status: 'pending', time: 'Waiting', amount: 610 },
      { id: 1004, customer: 'Rahul Verma', rider: 'Vijay Singh', status: 'delivered', time: '18 mins', amount: 290 },
      { id: 1005, customer: 'Sanjay Malhotra', rider: 'Deepak Yadav', status: 'in-progress', time: '32 mins', amount: 540 },
    ];

    setRidersData(riders);
    setOrdersData(orders);
  }, []);

  // Stats data
  const stats = [
    {
      title: 'Total Rides',
      value: '7680',
      change: '+5%',
      icon: <FiTruck className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Rides',
      value: '27',
      change: '+12%',
      icon: <FiPackage className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Today',
      value: '132',
      change: '+8%',
      icon: <FiTruck className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: '42,580',
      change: '+15%',
      icon: <FiDollarSign className="h-6 w-6" />,
      color: 'bg-amber-500'
    }
  ];

  // Chart data for deliveries
  const deliveryChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed Deliveries',
        data: [120, 150, 180, 90, 130, 200, 170],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Failed Deliveries',
        data: [10, 15, 8, 20, 12, 5, 8],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Chart data for rider performance
  const performanceChartData = {
    labels: ['Michael', 'James', 'William', 'David', 'John'],
    datasets: [
      {
        label: 'Deliveries',
        data: [42, 38, 25, 31, 29],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rider Management Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your delivery fleet performance</p>
      </div>

      {/* Time Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search riders, orders..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-sm text-green-500 mt-1 flex items-center">
                  <FiTrendingUp className="mr-1" /> {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Delivery Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Trends</h2>
          <div className="h-80">
            <Line data={deliveryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Rider Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Rider Performance</h2>
          <div className="h-80">
            <Bar data={performanceChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Riders and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Riders Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Riders</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ridersData.map((rider) => (
                  <tr key={rider.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {rider.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                          <div className="text-sm text-gray-500">{rider.vehicle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${rider.status === 'active' ? 'bg-green-100 text-green-800' : 
                          rider.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {rider.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rider.deliveries}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span>{rider.rating}</span>
                        <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordersData.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
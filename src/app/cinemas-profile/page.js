'use client';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CinemaProfilePage() {
    const router = useRouter();
    const foodItems = [
        { id: 1, name: "Premium Popcorn", price: "$8.99", category: "Snacks" },
        { id: 2, name: "Gourmet Burger", price: "$12.50", category: "Meals" },
        { id: 3, name: "Artisan Ice Cream", price: "$6.75", category: "Desserts" },
        { id: 4, name: "Specialty Coffee", price: "$4.50", category: "Beverages" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
           
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-96 bg-gradient-to-r from-[#342B9A] to-[#4a3fd3]"
            >
                <div className="absolute inset-0 bg-opacity-60 bg-black" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.h1 
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="text-5xl font-bold text-white mb-4"
                    >
                        Grand Paramount Cinemas
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl text-gray-200 mb-8"
                    >
                        The Ultimate Movie Experience
                    </motion.p>
                </div>
            </motion.div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Info Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Contact Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-[#342B9A] bg-opacity-10 p-2 rounded-lg">
                                <FaPhone className="text-[#342B9A] text-lg" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#342B9A] ml-3">Contact Us</h2>
                        </div>
                        <div className="space-y-4">
                            <ContactItem icon={<FaPhone />} title="Phone" value="+1 (555) 123-4567" />
                            <ContactItem icon={<FaEnvelope />} title="Email" value="info@grandparamount.com" />
                            <ContactItem icon={<FaMapMarkerAlt />} title="Location" value="123 Cinema Avenue, Hollywood, CA 90210" />
                            <ContactItem icon={<FaClock />} title="Hours" value="Mon-Sun: 10:00 AM - 11:00 PM" />
                        </div>
                    </motion.div>

                    {/* About Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-[#342B9A] bg-opacity-10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-[#342B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#342B9A] ml-3">About Us</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Grand Paramount Cinemas offers a premium movie-going experience with state-of-the-art 
                            projection and sound systems, luxurious seating, and exceptional service.
                        </p>
                        <p className="text-gray-600 mb-6">
                            Our theaters feature the latest in 4K laser projection, Dolby Atmos sound, and 
                            comfortable recliner seating in all auditoriums.
                        </p>
                        <motion.button
                            whileHover={{ x: 5 }}
                            className="flex items-center text-[#342B9A] font-medium group"
                        >
                            <span>Learn more</span>
                            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                    </motion.div>

                    {/* Showtimes Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-[#342B9A] bg-opacity-10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-[#342B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#342B9A] ml-3">Now Showing</h2>
                        </div>
                        <div className="space-y-4 mb-6">
                            <MovieItem title="The New Blockbuster" genre="Action/Adventure | PG-13" />
                            <MovieItem title="Award-Winning Drama" genre="Drama | R" />
                            <MovieItem title="Family Animation" genre="Animation | G" />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#342B9A] text-white py-3 rounded-lg font-semibold shadow-md"
                        >
                            View All Showtimes
                        </motion.button>
                    </motion.div>
                </div>

                {/* Food Menu Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    <div className="bg-[#342B9A] text-white px-8 py-5 flex items-center">
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                            <FaUtensils className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Concession Stand</h2>
                            <p className="text-gray-300">Order your favorites before the show</p>
                        </div>
                    </div>
                    
                    {/* Enhanced Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-[#342B9A] uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#342B9A] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#342B9A] uppercase tracking-wider">
                                        Price
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {foodItems.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ type: 'spring', stiffness: 100 }}
                                        whileHover={{ backgroundColor: '#f8f9fa' }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${item.category === 'Snacks' ? 'bg-blue-100 text-blue-800' : 
                                                  item.category === 'Meals' ? 'bg-green-100 text-green-800' : 
                                                  item.category === 'Desserts' ? 'bg-purple-100 text-purple-800' : 
                                                  'bg-amber-100 text-amber-800'}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                            {item.price}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 text-right border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center bg-[#342B9A] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
                        >
                            View Full Menu
                            <FiArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Reusable Components
function ContactItem({ icon, title, value }) {
    return (
        <div className="flex items-start">
            <div className="text-[#342B9A] mt-1 mr-3">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-gray-700">{title}</h3>
                <p className="text-gray-600">{value}</p>
            </div>
        </div>
    );
}

function MovieItem({ title, genre }) {
    return (
        <motion.div 
            whileHover={{ x: 5 }}
            className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
        >
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500">{genre}</p>
        </motion.div>
    );
}


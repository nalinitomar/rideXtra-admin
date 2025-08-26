"use client";
import { useState } from 'react';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Navbar({ onMenuClick }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleProfile = () => {
    router.push('/profile')
  }

  return (
    <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        {/* Hamburger */}
        <div className="lg:hidden mr-4">
          <button className="text-gray-600 hover:text-gray-800" onClick={onMenuClick}>
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

      </div>

      <div className="flex items-center space-x-5">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-3"
          >
            <div className="text-right hidden md:block">
              <div className="font-medium text-gray-900">{user?.profile?.BankData?.name_at_bank ?? 'Guest'}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <FiUser className="h-5 w-5" />
            </div>
            <FiChevronDown className={`text-gray-400 transition ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
              >
                <div className="py-1">
                  <button onClick={handleProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

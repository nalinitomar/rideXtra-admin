"use client";
import { FiBarChart2, FiUsers  , FiClock  ,FiMessageSquare   ,FiLogOut, FiX, } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FaCar } from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { href: "/user-management", label: "User Management", icon: FiUsers  },
    { href: "/driver-management", label: "Driver Management", icon: FaCar },
    { href: "/ride-management", label: "Ride History Management", icon: FiClock  },
    { href: "/help-support", label: "Help Support", icon: FiMessageSquare   },
  ];

  const handleLogout = async () => {
    try {
      await logout(); // from AuthContext
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const renderNav = () => (
    <div className="flex flex-col w-68 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full">
      <div className="flex items-center h-20 px-6 border-b border-indigo-700 justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 flex items-center justify-center  text-white font-bold rounded-lg backdrop-blur-sm">
            <Image
              src="/Nas-Logo.svg"
              alt="Company Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="ml-3 text-xl font-semibold tracking-tight">RideXtra Admin</span>
        </div>
        {/* Mobile close button */}
        <button className="lg:hidden text-white" onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {links.map(({ href, label, icon: Icon, highlight }) => (
          <a
            key={href}
            href={href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition ${pathname === href
              ? "bg-white/10 text-white shadow-md"
              : highlight
                ? "bg-amber-500/90 text-white hover:bg-amber-500"
                : "text-indigo-200 hover:bg-white/5"
              }`}
          >
            <Icon className={`mr-3 text-lg ${highlight ? 'animate-pulse' : ''}`} />
            {label}
            {highlight && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                PENDING
              </span>
            )}
          </a>
        ))}
      </div>

      <div className="px-4 pb-6 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg 
               border border-white/20 bg-white/10 text-indigo-100 
               hover:bg-white/20 hover:text-white transition font-medium shadow-sm"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isOpen ? "block" : "hidden"
          }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {renderNav()}
      </div>
    </>
  );
}
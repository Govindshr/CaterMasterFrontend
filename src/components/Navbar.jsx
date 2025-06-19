import { Bell, UserCircle, Moon, Sun, Menu, LogOut, ChevronDown, Mail, Phone } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { toast } from 'react-toastify';
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function Navbar({ toggleSidebar }) {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoadingProfile(true);
    try {
      const response = await protectedGetApi(config.GetUserProfile, token);
      if (response.success) {
        setUserProfile(response.user);
      } else {
        // Fallback to localStorage data if API fails
        const localUser = localStorage.getItem("user");
        if (localUser) {
          setUserProfile(JSON.parse(localUser));
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to localStorage data if API fails
      const localUser = localStorage.getItem("user");
      if (localUser) {
        setUserProfile(JSON.parse(localUser));
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleLogout = () => {
  localStorage.clear();
  toast.success('Logout successful!');
  setIsProfileDropdownOpen(false);

  setTimeout(() => {
    window.location.href = '/login';
  }, 1000); // Wait 1.5 seconds so the toast is visible
};

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile?.fullName) return "U";
    return userProfile.fullName
      .split(" ")
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md flex justify-between items-center px-4 md:px-6 py-3 transition-all sticky top-0 z-30">
      {/* Left - Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-800 dark:text-gray-300" />
        </button>

        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-200 hidden md:block">
          {t('appTitle')}
        </h1>
        
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Right - Notifications, Dark Mode & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            3
          </span>
        </button>

        {/* Mobile Language Switcher */}
        <div className="md:hidden">
          <LanguageSwitcher />
        </div>

        {/* Profile Avatar with Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-1 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-200 dark:border-gray-700">
              <AvatarImage src={userProfile?.profilePhoto || "https://via.placeholder.com/40"} alt="User" />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
                {isLoadingProfile ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  getUserInitials()
                )}
              </AvatarFallback>
            </Avatar>
            <ChevronDown 
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                isProfileDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700">
                    <AvatarImage src={userProfile?.profilePhoto || "https://via.placeholder.com/48"} alt="User" />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                      {userProfile?.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userProfile?.userType || "User"}
                    </p>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="space-y-2">
                  {userProfile?.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile?.mobile && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span>{userProfile.mobile}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Logout Option */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

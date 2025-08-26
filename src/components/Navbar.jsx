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
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const dropdownRef = useRef(null);

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
  }, [i18n.language]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoadingProfile(true);
    try {
      const response = await protectedGetApi(config.GetUserProfile, token);
      if (response.success) {
        setUserProfile(response.user);
      } else {
        const localUser = localStorage.getItem("user");
        if (localUser) {
          setUserProfile(JSON.parse(localUser));
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      const localUser = localStorage.getItem("user");
      if (localUser) {
        setUserProfile(JSON.parse(localUser));
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
    }, 1000);
  };

  const getUserInitials = () => {
    if (!userProfile?.fullName?.[i18n.language]) return "U";
    return userProfile.fullName?.[i18n.language]
      .split(" ")
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-gradient-to-r from-white via-sky-50 to-indigo-50 dark:bg-gray-900/90 border-b border-sky-100 dark:border-gray-800 shadow-sm flex justify-between items-center px-4 md:px-6 py-2 sticky top-0 z-30">
      {/* Left - Sidebar Toggle + Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-sky-700 dark:text-gray-300" />
        </button>

        <h1 className="text-lg font-bold text-sky-900 dark:text-gray-200 hidden md:block">
          {t('appTitle')}
        </h1>
        
        <div className="hidden md:block">
          <div className="rounded-md border border-sky-200 dark:border-gray-700 px-2 py-1 bg-white">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Right - Utilities */}
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="p-2 rounded-md hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-sky-700" />
          )}
        </button>

        <button className="relative p-2 rounded-md hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-sky-700 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full shadow-sm">
            3
          </span>
        </button>

        <div className="md:hidden">
          <LanguageSwitcher />
        </div>

        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-1 p-1 rounded-md hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-haspopup="menu"
            aria-expanded={isProfileDropdownOpen}
          >
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-sky-100 dark:border-gray-700">
              <AvatarImage src={userProfile?.profilePhoto || "https://via.placeholder.com/40"} alt="User" />
              <AvatarFallback className="bg-sky-100 dark:bg-blue-900 text-sky-700 dark:text-blue-300 font-medium">
                {isLoadingProfile ? (
                  <div className="w-4 h-4 border-2 border-sky-600 border-top-transparent rounded-full animate-spin" />
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

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-sky-100 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-3 border-b border-sky-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 border-2 border-sky-100 dark:border-gray-700">
                    <AvatarImage src={userProfile?.profilePhoto || "https://via.placeholder.com/48"} alt="User" />
                    <AvatarFallback className="bg-sky-100 dark:bg-blue-900 text-sky-700 dark:text-blue-300 font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                      {userProfile?.fullName?.[i18n.language] || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userProfile?.userType || "User"}
                    </p>
                  </div>
                </div>
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
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors"
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

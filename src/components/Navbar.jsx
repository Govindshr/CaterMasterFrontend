import { Bell, UserCircle, Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ toggleSidebar }) {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

        {/* Profile Avatar */}
        <div className="ml-2">
          <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src="https://via.placeholder.com/40" alt="User" />
            <AvatarFallback>
              <UserCircle className="w-6 h-6 text-gray-800 dark:text-gray-300" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}

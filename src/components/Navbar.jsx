import { Bell, UserCircle, Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ toggleSidebar }) {
  const { t } = useTranslation()
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md flex justify-between items-center px-6 py-3 transition-all">
      {/* Left - Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button onClick={toggleSidebar} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
          <Menu className="w-6 h-6 text-gray-800 dark:text-gray-300" />
        </button>

        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-200">{t('appTitle')}</h1>
        

        <LanguageSwitcher />
      </div>


      {/* Right - Notifications, Dark Mode & Profile */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
          {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-800" />}
        </button>

        {/* Notifications */}
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-800 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
        </button>

        {/* Profile Avatar */}
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/40" alt="User" />
          <AvatarFallback>
            <UserCircle className="w-6 h-6 text-gray-800 dark:text-gray-300" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

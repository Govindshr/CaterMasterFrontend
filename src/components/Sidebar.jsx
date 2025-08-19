import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import { LayoutDashboard, Calendar, ChevronDown, Settings, X, Users } from "lucide-react";
// import './../../src/index.css'
export default function Sidebar({ isOpen, onClose }) {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get user profile from localStorage
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUserProfile(JSON.parse(localUser));
    }
  }, []);

  // Check if user is admin
  const isAdmin = userProfile?.userType === "super admin" || userProfile?.userType === "admin";

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:relative h-screen shadow-lg transition-all duration-300 z-50
          ${isOpen ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}
          bg-gradient-to-b from-blue-600 to-blue-800 text-white
          dark:from-gray-900 dark:to-gray-800 dark:text-gray-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold transition-all duration-300 text-white">
            {isOpen ? "CaterMaster" : "CM"}
          </h1>
          {isMobile && (
            <button onClick={onClose} className="lg:hidden">
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Sidebar Menu - Now Scrollable */}
        <nav className="mt-2 overflow-y-auto h-[calc(100vh-60px)] custom-scrollbar">
          <ul className="space-y-2 px-2">
            {/* Dashboard */}
            <li>
              <div className="flex items-center hover:bg-blue-500/50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Link to="/" className="flex items-center p-4 rounded-md w-full">
                  <LayoutDashboard className={`w-5 h-5 text-white ${isOpen ? "mr-3" : ""}`} />
                  <span className={`${!isOpen ? "hidden" : "inline"} transition-all duration-300 text-white`}>
                    Dashboard
                  </span>
                </Link>
              </div>
            </li>

            {/* Bookings */}
            <li>
              <div className="flex items-center hover:bg-blue-500/50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Link to="/bookings" className="flex items-center p-4 rounded-md w-full">
                  <Calendar className={`w-5 h-5 text-white ${isOpen ? "mr-3" : ""}`} />
                  <span className={`${!isOpen ? "hidden" : "inline"} transition-all duration-300 text-white`}>
                    Bookings
                  </span>
                </Link>
              </div>
            </li>

            {/* User Management - Admin Only */}
            {isAdmin && (
              <>
                <li className={`${!isOpen && "hidden"} px-4 py-2 text-sm font-semibold uppercase text-gray-300`}>
                  Administration
                </li>
                <li>
                  <div className="flex items-center hover:bg-blue-500/50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Link to="/user-management" className="flex items-center p-4 rounded-md w-full">
                      <Users className={`w-5 h-5 text-white ${isOpen ? "mr-3" : ""}`} />
                      <span className={`${!isOpen ? "hidden" : "inline"} transition-all duration-300 text-white`}>
                        User Management
                      </span>
                    </Link>
                  </div>
                </li>
              </>
            )}

            {/* Master Section */}
            <li className={`${!isOpen && "hidden"} px-4 py-2 text-sm font-semibold uppercase text-gray-300`}>
              Master
            </li>
            <li>
              <button 
                onClick={() => setIsMasterOpen(!isMasterOpen)}
                className="flex justify-between items-center w-full p-4 rounded-md transition hover:bg-blue-500/50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <Settings className={`w-5 h-5 text-white ${isOpen ? "mr-3" : ""}`} />
                  <span className={`${!isOpen ? "hidden" : "inline"} transition-all duration-300 text-white`}>
                    Master
                  </span>
                </div>
                {isOpen && (
                  <span className={`transform transition-transform duration-300 ${isMasterOpen ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                )}
              </button>

              {/* Dropdown Submenu */}
              <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isMasterOpen ? "max-h-100" : "max-h-0"}`}>
                <ul className={`pl-2 space-y-2 transition-all duration-300 ${!isOpen && "hidden"}`}>
                  <li><Link to="/events" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Events</Link></li>
                  {/* <li><Link to="/occasion-types" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Occasion-Types</Link></li> */}
                  <li><Link to="/serving-types" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Serving-Types</Link></li>
                  <li><Link to="/facilities" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Facilities</Link></li>
                  <li><Link to="/booking-types" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Bookings Types</Link></li>
                  <li><Link to="/dish-categories" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Dish-Categories</Link></li>
                  <li><Link to="/dish-subcategories" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Dish-Sub-Categories</Link></li>
                  <li><Link to="/ingredient-types" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Ingredient Types</Link></li>
                  <li><Link to="/unit-types" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Unit Types</Link></li>
                  <li><Link to="/add-ingredient" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Add Ingredient </Link></li>
                  <li><Link to="/all-ingredients" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">All Ingredient </Link></li>
                  <li><Link to="/items-list" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Items-List</Link></li>
                  <li><Link to="/add-item" className="block p-3 rounded-md transition hover:bg-blue-400/50 dark:hover:bg-gray-600">Add-Items</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

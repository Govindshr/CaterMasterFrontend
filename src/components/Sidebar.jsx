import { useState } from "react"; 
import { Link } from "react-router-dom";
import { LayoutDashboard, Calendar, ChevronDown, Settings } from "lucide-react";
// import './../../src/index.css'
export default function Sidebar({ isOpen }) {
  const [isMasterOpen, setIsMasterOpen] = useState(false);

  return (
    <div className={`h-screen shadow-lg transition-all duration-300 
      ${isOpen ? "w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white" : "w-16 bg-blue-700"}
      dark:from-gray-900 dark:to-gray-800 dark:text-gray-300`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center p-4">
        <h1 className="text-lg font-bold transition-all duration-300 text-white">
          {isOpen ? "CaterMaster" : "CM"}
        </h1>
      </div>

      {/* Sidebar Menu - Now Scrollable */}
      <nav className="mt-2 overflow-y-auto h-[calc(100vh-60px)] custom-scrollbar">
        <ul className="space-y-2 px-2">
          {/* Dashboard */}
          <li>
          <div className="flex items-center hover:bg-blue-500 dark:hover:bg-gray-700">
            <Link to="/" className="flex items-center p-4 rounded-md transition ">
              <LayoutDashboard className="w-5 h-5 mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} transition-all duration-300 text-white`}>Dashboard</span>
            </Link>
            </div>
          </li>

          {/* Bookings */}
          <li>
          <div className="flex items-center hover:bg-blue-500 dark:hover:bg-gray-700">
            <Link to="/bookings" className="flex items-center p-4 rounded-md transition ">
              <Calendar className="w-5 h-5 mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} transition-all duration-300 text-white`}>Bookings</span>
            </Link>
            </div>
          </li>

          {/* Master Section */}
          <li className={`${!isOpen && "hidden"} px-4 py-2 text-sm font-semibold uppercase text-gray-300`}>Master</li>
          <li>
            <button 
              onClick={() => setIsMasterOpen(!isMasterOpen)}
              className="flex justify-between items-center w-full p-4 rounded-md transition hover:bg-blue-500 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-3 text-white" />
                <span className={`${!isOpen && "hidden"} transition-all duration-300 text-white`}>Master</span>
              </div>
              {isOpen && (
                <span className={`transform transition-transform duration-300 ${isMasterOpen ? "rotate-180" : "rotate-0"}`}>
                  <ChevronDown className="w-5 h-5" />
                </span>
              )}
            </button>

            {/* Dropdown Submenu */}
            <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isMasterOpen ? "max-h-80" : "max-h-0"}`}>
              <ul className={`pl-8 space-y-2 transition-all duration-300 ${!isOpen && "hidden"}`}>
                <li><Link to="/events" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Events</Link></li>
                <li><Link to="/facilities" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Facilities</Link></li>
                <li><Link to="/ingredients" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Ingredients</Link></li>
                <li><Link to="/item-categories" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Item-Categories</Link></li>
                <li><Link to="/item-subcategories" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Item-Sub-Categories</Link></li>
                <li><Link to="/items-list" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Items-List</Link></li>
                <li><Link to="/add-item" className="block p-3 rounded-md transition hover:bg-blue-400 dark:hover:bg-gray-600">Add-Items</Link></li>
                
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

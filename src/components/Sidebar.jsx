import { useState, useEffect } from "react"; 
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, ChevronDown, Settings, X, Users } from "lucide-react";
// import './../../src/index.css'
export default function Sidebar({ isOpen, onClose }) {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUserProfile(JSON.parse(localUser));
    }
  }, []);

  const isAdmin = userProfile?.userType === "super admin" || userProfile?.userType === "admin";

  const isActive = (path) => location.pathname === path;
  const navItemBase = "flex items-center p-3 rounded-md transition-colors border-l-4 border-transparent";
  const hoverClass = "hover:bg-white/10";
  const activeClass = "bg-white/15";
  const linkText = (active) => `${!isOpen ? "hidden" : "inline"} transition-all duration-300 ${active ? 'text-white font-semibold' : 'text-white/90'}`;
  const iconClass = (active) => `w-5 h-5 text-white ${isOpen ? "mr-3" : "mx-auto"}`;

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div 
        className={`fixed lg:relative h-screen shadow-md transition-all duration-300 z-50
          ${isOpen ? "w-60 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-18"}
          bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-lg font-bold transition-all duration-300">
            {isOpen ? "Cater Master" : "CM"}
          </h1>
          {isMobile && (
            <button onClick={onClose} className="lg:hidden">
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        <nav className="mt-2 overflow-y-auto h-[calc(100vh-60px)] custom-scrollbar">
          <ul className="space-y-1 px-2">
            <li>
              <div className={`${navItemBase} ${isActive('/') ? activeClass : hoverClass}`}>
                <Link to="/" className="flex items-center rounded-md w-full">
                  <LayoutDashboard className={iconClass(isActive('/'))} />
                  <span className={linkText(isActive('/'))}>Dashboard</span>
                </Link>
              </div>
            </li>

            <li>
              <div className={`${navItemBase} ${isActive('/bookings') ? activeClass : hoverClass}`}>
                <Link to="/bookings" className="flex items-center rounded-md w-full">
                  <Calendar className={iconClass(isActive('/bookings'))} />
                  <span className={linkText(isActive('/bookings'))}>Bookings</span>
                </Link>
              </div>
            </li>

            {isAdmin && (
              <>
                <li className={`${!isOpen && "hidden"} px-4 py-2 text-xs tracking-wide font-semibold uppercase text-white/70`}>
                  Administration
                </li>
                <li>
                  <div className={`${navItemBase} ${isActive('/user-management') ? activeClass : hoverClass}`}>
                    <Link to="/user-management" className="flex items-center rounded-md w-full">
                      <Users className={iconClass(isActive('/user-management'))} />
                      <span className={linkText(isActive('/user-management'))}>User Management</span>
                    </Link>
                  </div>
                </li>
              </>
            )}

            <li className={`${!isOpen && "hidden"} px-4 pt-3 text-xs tracking-wide font-semibold uppercase text-white/70`}>Master</li>
            <li>
              <button 
                onClick={() => setIsMasterOpen(!isMasterOpen)}
                className={`flex justify-between items-center w-full p-3 rounded-md transition ${hoverClass}`}
              >
                <div className="flex items-center">
                  <Settings className={iconClass(false)} />
                  <span className={linkText(false)}>Master</span>
                </div>
                {isOpen && (
                  <span className={`transform transition-transform duration-300 ${isMasterOpen ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown className="w-5 h-5 text-white/80" />
                  </span>
                )}
              </button>

              <div className={`overflow-hidden transition-[max-height] min-h-fit duration-300 ease-in-out ${isMasterOpen ? "max-h-96" : "max-h-0"}`}>
                <ul className={`pl-2 space-y-1 mb-5 transition-all duration-300 ${!isOpen && "hidden"}`}>
                  <li><Link to="/events" className={`block p-3 rounded-md transition ${isActive('/events') ? activeClass : hoverClass}`}>Events</Link></li>
                  <li><Link to="/serving-types" className={`block p-3 rounded-md transition ${isActive('/serving-types') ? activeClass : hoverClass}`}>Serving-Types</Link></li>
                  <li><Link to="/facilities" className={`block p-3 rounded-md transition ${isActive('/facilities') ? activeClass : hoverClass}`}>Facilities</Link></li>
                  <li><Link to="/booking-types" className={`block p-3 rounded-md transition ${isActive('/booking-types') ? activeClass : hoverClass}`}>Bookings Types</Link></li>
                  <li><Link to="/dish-categories" className={`block p-3 rounded-md transition ${isActive('/dish-categories') ? activeClass : hoverClass}`}>Dish-Categories</Link></li>
                  <li><Link to="/dish-subcategories" className={`block p-3 rounded-md transition ${isActive('/dish-subcategories') ? activeClass : hoverClass}`}>Dish-Sub-Categories</Link></li>
                  <li><Link to="/ingredient-types" className={`block p-3 rounded-md transition ${isActive('/ingredient-types') ? activeClass : hoverClass}`}>Ingredient Types</Link></li>
                  <li><Link to="/unit-types" className={`block p-3 rounded-md transition ${isActive('/unit-types') ? activeClass : hoverClass}`}>Unit Types</Link></li>
                  <li><Link to="/add-ingredient" className={`block p-3 rounded-md transition ${isActive('/add-ingredient') ? activeClass : hoverClass}`}>Add Ingredient </Link></li>
                  <li><Link to="/all-ingredients" className={`block p-3 rounded-md transition ${isActive('/all-ingredients') ? activeClass : hoverClass}`}>All Ingredient </Link></li>
                  <li><Link to="/items-list" className={`block p-3 rounded-md transition ${isActive('/items-list') ? activeClass : hoverClass}`}>Items-List</Link></li>
                  <li><Link to="/add-item" className={`block p-3 rounded-md transition ${isActive('/add-item') ? activeClass : hoverClass}`}>Add-Items</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

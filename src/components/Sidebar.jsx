// src/components/Sidebar.jsx
import { useState, useEffect,useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, ChevronDown, Settings, X, Users ,Cake ,SquareMenu,ShoppingBasket} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({}); // why: split long Master into smaller toggles
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
const activeDirectLink = "bg-white/20 border-l-4 border-yellow-400 text-white font-semibold";
const activeAccordion = "bg-white/10 border-l-4 border-blue-300 text-white";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) setUserProfile(JSON.parse(localUser));
  }, []);

  const isAdmin = userProfile?.userType === "super admin" || userProfile?.userType === "admin";

  const isActive = (path) => location.pathname === path;
  const navItemBase = "flex items-center p-3 rounded-md transition-colors border-l-4 border-transparent";
  const hoverClass = "hover:bg-white/10";
  const activeClass = "bg-white/15";
  const linkText = (active) => `${!isOpen ? "hidden" : "inline"} transition-all duration-300 ${active ? 'text-white font-semibold' : 'text-white/90'}`;

  const iconClass = (active) => `w-5 h-5 text-white ${isOpen ? "mr-3" : " "}`;

  // --- Master split into multiple compact sections ---
  const categories = [
    {
      key: 'events',
      title: 'Events',
      icon: Cake,
      links: [
        { to: '/events', label: 'Events' },
      ],
    },
    {
      key: 'setup',
      title: 'Setup',
      icon: Settings,
      links: [
        { to: '/serving-types', label: 'Serving-Types' },
        { to: '/facilities', label: 'Facilities' },
        { to: '/booking-types', label: 'Bookings Types' },
        { to: '/unit-types', label: 'Unit Types' },
      ],
    },
    {
      key: 'menu',
      title: 'Menu',
      icon: SquareMenu,
      links: [
        { to: '/dish-categories', label: 'Dish-Categories' },
        { to: '/dish-subcategories', label: 'Dish-Sub-Categories' },
        { to: '/items-list', label: 'Items-List' },
        { to: '/add-item', label: 'Add-Items' },
      ],
    },
    {
      key: 'ingredients',
      title: 'Ingredients',
      icon: ShoppingBasket,
      links: [
        { to: '/ingredient-types', label: 'Ingredient Types' },
        { to: '/add-ingredient', label: 'Add Ingredient' },
        { to: '/all-ingredients', label: 'All Ingredient' },
      ],
    },
  ];

  // Auto-open section containing active route without overriding user's other toggles.
  useEffect(() => {
    const updates = {};
    categories.forEach((c) => {
      if (c.links.some((l) => isActive(l.to))) updates[c.key] = true;
    });
    if (Object.keys(updates).length) {
      setOpenSections((prev) => ({ ...prev, ...updates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

const toggleSection = (key) =>
  setOpenSections((s) => {
    // if the clicked one is already open → close all
    if (s[key]) {
      return {};
    }
    // otherwise close all others and open only this one
    return { [key]: true };
  });

// inside your file, keep everything else the same
// REPLACE the whole Section component with this version
const Section = ({ title, icon: Icon, links, open, onToggle }) => {
  const contentRef = useRef(null);

  return (
    <li className="mb-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`group relative flex items-center w-full p-3 pr-9 rounded-md transition-colors ${
  open ? activeAccordion : hoverClass
}`}

      >
        <Icon className={iconClass(false)} />
        <span className={linkText(false)}>{title}</span>

        {/* keep chevron from moving: absolutely position it */}
        {isOpen && (
          <ChevronDown
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        )}
      </button>

      {/* Smooth, measurement-free animation using CSS grid trick */}
     <div
  className={`overflow-hidden transition-all duration-300 ease-in-out ${
    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <ul
    ref={contentRef}
    className={`pl-6 space-y-1 py-2`}
  >
    {links.map(({ to, label }) => (
      <li key={to}>
      <Link
  to={to}
  className={`block rounded-md mt-1 p-2 pl-3 text-sm border-l-2 ${
    isActive(to) ? activeDirectLink : 'border-transparent ' + hoverClass
  }`}
>
  {label}
</Link>

      </li>
    ))}
  </ul>
</div>

    </li>
  );
};


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
    ${isOpen ? "w-60 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}
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
          <ul className="space-y-1 px-2 mb-5">
            <li>
             <div className={`${navItemBase} ${isActive('/') ? activeDirectLink : hoverClass}`}>

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

           
            {/* Split Master into multiple compact sections */}
            {categories.map(({ key, title, icon, links }) => (
              <Section
                key={key}
                title={title}
                icon={icon}
                links={links}
                open={!!openSections[key]}
                onToggle={() => toggleSection(key)}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings/Bookings";
import AddBooking from "./pages/Bookings/AddBookings";
import ViewBooking from "./pages/Bookings/ViewBookings";
import EditBooking from "./pages/Bookings/EditBookings";
import Events from "./pages/Master/Events/Events";
import Facilities from "./pages/Master/Facility/Facility";
import AddMenu from "./pages/Bookings/Addmenu";
import ItemCategory from "./pages/Master/Item-Category/ItemCategory";
import Ingredients from "./pages/Master/Ingredients/Ingredients";
import AddNewItem from "./pages/Master/Item-Category/AddNewItem";
import AddFacilities from "./pages/Bookings/AddFacilities";
import MenuSummary from "./pages/List/GenerateList";
import FinalIngredientList from "./pages/List/FinalIngredientList";
import ItemSubCategory from "./pages/Master/Item-Category/itemSubcategory";
import ItemList from "./pages/Master/Item-Category/ItemsList";
import UserRegistration from "./pages/User-Management/userRegistration";
import UserLogin from "./pages/User-Management/userLogin";

function AppWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hideLayoutFor = ["/register", "/login"];
  const isLayoutHidden = hideLayoutFor.includes(location.pathname.toLowerCase());

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {!isLayoutHidden && (
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        {!isLayoutHidden && <Navbar toggleSidebar={toggleSidebar} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/add-bookings" element={<AddBooking />} />
            <Route path="/view-booking" element={<ViewBooking />} />
            <Route path="/edit-booking" element={<EditBooking />} />
            <Route path="/add-menu" element={<AddMenu />} />
            <Route path="/add-facilities" element={<AddFacilities />} />
            <Route path="/generate-list" element={<MenuSummary />} />
            <Route path="/final-ingredient-list" element={<FinalIngredientList />} />
            <Route path="/events" element={<Events />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/item-categories" element={<ItemCategory />} />
            <Route path="/item-subcategories" element={<ItemSubCategory />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/items-list" element={<ItemList />} />
            <Route path="/add-item" element={<AddNewItem />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

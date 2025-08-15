import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import AddNewItem from "./pages/Master/Dish-Management/AddNewDish";
import AddFacilities from "./pages/Bookings/AddFacilities";
import MenuSummary from "./pages/List/GenerateList";
import FinalIngredientList from "./pages/List/FinalIngredientList";
import ItemList from "./pages/Master/Dish-Management/DishList";
import UserRegistration from "./pages/User-Management/userRegistration";
import UserLogin from "./pages/User-Management/userLogin";
import UserManagement from "./pages/User-Management/UserManagement";
import OccasionTypes from "./pages/Master/OccasionTypes/OccasionType";
import ServingTypes from "./pages/Master/ServingTypes/ServingTypes";
import BookingTypes from "./pages/Master/BookingsTypes/BookingTypes";
import DishCategory from "./pages/Master/Dish-Management/DishCategory";
import DishSubCategory from "./pages/Master/Dish-Management/DishSubcategory";
import IngredientTypes from "./pages/Master/Ingredients/IngredientsTypes";
import UnitTypes from "./pages/Master/UnitTypes/UnitTypes";
import AddIngredient from "./pages/Master/Ingredients/AddIngredients";
import IngredientList from "./pages/Master/Ingredients/IngredientsList";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (for login and register)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hideLayoutFor = ["/register", "/login"];
  const isLayoutHidden = hideLayoutFor.includes(location.pathname.toLowerCase());

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => isMobile && setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {!isLayoutHidden && (
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        {!isLayoutHidden && <Navbar toggleSidebar={toggleSidebar} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <UserLogin />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <UserRegistration />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/add-bookings" element={
              <ProtectedRoute>
                <AddBooking />
              </ProtectedRoute>
            } />
            <Route path="/view-booking/:id" element={
              <ProtectedRoute>
                <ViewBooking />
              </ProtectedRoute>
            } />
            <Route path="/edit-booking" element={
              <ProtectedRoute>
                <EditBooking />
              </ProtectedRoute>
            } />
            <Route path="/add-menu/:id" element={
              <ProtectedRoute>
                <AddMenu />
              </ProtectedRoute>
            } />
            <Route path="/add-facilities" element={
              <ProtectedRoute>
                <AddFacilities />
              </ProtectedRoute>
            } />
            <Route path="/generate-list/:id" element={
              <ProtectedRoute>
                <MenuSummary />
              </ProtectedRoute>
            } />
            <Route path="/final-ingredient-list/:id" element={
              <ProtectedRoute>
                <FinalIngredientList />
              </ProtectedRoute>
            } />
            <Route path="/final-ingredient-list/event/:eventId" element={
              <ProtectedRoute>
                <FinalIngredientList />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/occasion-types" element={
              <ProtectedRoute>
                <OccasionTypes />
              </ProtectedRoute>
            } />
             <Route path="/serving-types" element={
              <ProtectedRoute>
                <ServingTypes />
              </ProtectedRoute>
            } />
            <Route path="/facilities" element={
              <ProtectedRoute>
                <Facilities />
              </ProtectedRoute>
            } />
             <Route path="/booking-types" element={
              <ProtectedRoute>
                <BookingTypes />
              </ProtectedRoute>
            } />
            
            <Route path="/dish-categories" element={
              <ProtectedRoute>
                <DishCategory />
              </ProtectedRoute>
            } />
            <Route path="/dish-subcategories" element={
              <ProtectedRoute>
                <DishSubCategory />
              </ProtectedRoute>
            } />
            <Route path="/ingredient-types" element={
              <ProtectedRoute>
                <IngredientTypes />
              </ProtectedRoute>
            } />
            <Route path="/add-ingredient" element={
              <ProtectedRoute>
                <AddIngredient />
              </ProtectedRoute>
            } />
             <Route path="/all-ingredients" element={
              <ProtectedRoute>
                <IngredientList />
              </ProtectedRoute>
            } />
             <Route path="/unit-types" element={
              <ProtectedRoute>
                <UnitTypes />
              </ProtectedRoute>
            } />
            <Route path="/items-list" element={
              <ProtectedRoute>
                <ItemList />
              </ProtectedRoute>
            } />
            <Route path="/add-item" element={
              <ProtectedRoute>
                <AddNewItem />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      <ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>

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

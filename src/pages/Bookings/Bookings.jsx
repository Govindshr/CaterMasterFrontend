import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  ListChecks,
  Zap,
  Save 

} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { protectedGetApi, protectedDeleteApi,protectedUpdateApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function Bookings() {
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dropdownIdx, setDropdownIdx] = useState(null);
  const [dropdownMobileIdx, setDropdownMobileIdx] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedBookingIdForGenerate, setSelectedBookingIdForGenerate] =
    useState(null);
      const [selectedBookingID, setSelectedBookingId] =
    useState(null);
// State for facilities modal
const [allFacilities, setAllFacilities] = useState([]);
const [selectedFacilities, setSelectedFacilities] = useState([]);

const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);


  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

 useEffect(() => {
  const fetchFacilities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetFacilities, token);

      // ✅ Only keep facilities with scope = booking
      const bookingFacilities = (res.data || []).filter(
        (f) => f.scope === "booking"
      );

      setAllFacilities(bookingFacilities);
    } catch (err) {
      console.error("Failed to load facilities:", err);
    }
  };

  if (showFacilitiesModal) {
    fetchFacilities();
  }
}, [showFacilitiesModal]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIdx(null);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setDropdownMobileIdx(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await protectedDeleteApi(`${config.AddBooking}/${bookingId}`, token);
        Swal.fire("Deleted!", "Booking has been deleted.", "success");
        fetchBookings(currentPage); // Refresh list
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to delete",
          "error"
        );
      }
    }
  };

  // Fetch bookings from API
  const fetchBookings = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const endpoint = `${config.AddBooking}?page=${page}&limit=${itemsPerPage}`;
      const response = await protectedGetApi(endpoint, token);

      console.log("Bookings API Response:", response);

      // Assuming the API returns { bookings: [], totalPages: number, total: number }
      setBookingsData(response.data.bookings || response.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
      setTotalBookings(response.data.pagination.totalItems || 0);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch bookings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on component mount and when page changes
  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, i18n.language]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get customer name (handle both string and object formats)
  const getCustomerName = (customerName) => {
    if (typeof customerName === "object" && customerName.en) {
      return customerName.en;
    }
    return customerName || "N/A";
  };

  const openGenerateModalFor = (bookingId) => {
    setDropdownIdx(null);
    setDropdownMobileIdx(null);
    setSelectedBookingIdForGenerate(bookingId);
    setShowGenerateModal(true);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Card Header with Title & Button */}

            <CardHeader className="flex-row justify-between items-center border-b p-4 gap-3">
              <h2 className="text-2xl font-bold">Bookings</h2>
              <div className="ml-auto">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/add-bookings")}
                >
                  <Plus className="w-5 h-5 " />
                  Add Booking
                </Button>
              </div>
            </CardHeader>

            {/* Card Content - Responsive */}
            <CardContent className="p-0">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
  <div className="p-8 text-center flex flex-col items-center justify-center">
    <span className="loader"></span>
    <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg font-medium">
      Loading bookings...
    </p>
  </div>
)}

              {/* Desktop Table */}
              {!isLoading && !error && (
                <div className="hidden md:block">
                  <div className="overflow-x-auto hidden md:block">
                    <Table className="bg-white dark:bg-gray-800 ">
                      <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
                        <TableRow className="border-b border-gray-300">
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                            #
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                            Customer Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                            Mobile
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                            Dates
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {bookingsData?.map((booking, index) => (
                          <TableRow
                            key={index}
                            className={`border-b border-gray-200 dark:border-gray-700 
             ${
               index % 2 === 0
                 ? "bg-gray-50 dark:bg-gray-900"
                 : "bg-white dark:bg-gray-800"
             } 
             hover:bg-blue-50 dark:hover:bg-gray-700 transition`}
                          >
                            <TableCell>
                              {index+1}
                            </TableCell>
                            <TableCell>
                              {getCustomerName(
                                booking.customerName?.[i18n.language]
                              )}
                            </TableCell>
                            <TableCell>
                              {booking.mobileNumber || booking.mobile || "N/A"}
                            </TableCell>
                            {/* <TableCell>{booking.event}</TableCell> */}
                            <TableCell>
                              {booking.noOfDays === 1
                                ? formatDate(booking.startDate)
                                : `${formatDate(
                                    booking.startDate
                                  )} to ${formatDate(booking.endDate)}`}
                            </TableCell>
                         <TableCell className="flex justify-center space-x-2">
  {/* View Booking */}
  <Button
    className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
   onClick={() => {
   setSelectedBookingId(booking._id);
   setSelectedFacilities(booking.facilities || []); // ✅ preload assigned
   setShowFacilitiesModal(true);
 }}
    title="View Booking"
  >
    <Eye className="w-5 h-5" />
  </Button>

  {/* Add Menu */}
  <Button
    className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
    onClick={() => navigate(`/add-menu/${booking._id}`)}
    title="Add Menu"
  >
    <Plus className="w-5 h-5" />
  </Button>

{/* Assign Facilities */}
<Button
  className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
  onClick={() => {setShowFacilitiesModal(true),setSelectedBookingId(booking._id)}}
  title="Assign Facilities"
>
  <ListChecks className="w-5 h-5" />
</Button>

  {/* Generate List */}
  <Button
   className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
    onClick={() => openGenerateModalFor(booking._id)}
    title="Generate List"
  >
    <Settings className="w-5 h-5" />
  </Button>

  {/* Delete Booking */}
  <Button
   className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
    onClick={() => handleDeleteBooking(booking._id)}
    title="Delete Booking"
  >
    <Trash2 className="w-5 h-5" />
  </Button>
</TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Mobile Cards */}
              {!isLoading && !error && (
                <div className="md:hidden space-y-4">
                  {bookingsData?.map((booking, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-400">
                          Booking ID
                        </span>
                        <span className="text-sm font-bold text-blue-700">
                          {booking._id || booking.id || "N/A"}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {getCustomerName(booking.customerName)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mobile:{" "}
                        {booking.mobileNumber || booking.mobile || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Event: {booking.eventTypeId || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Dates:{" "}
                        {booking.noOfDays === 1
                          ? formatDate(booking.startDate)
                          : `${formatDate(booking.startDate)} to ${formatDate(
                              booking.endDate
                            )}`}
                      </div>
                      <div className="flex justify-end mt-2 gap-2 relative">
                        <Button
                          className="text-blue-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
                          onClick={() =>
                            navigate(`/view-booking/${booking._id}`)
                          }
                          title="View Booking"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>

                        {/* Add Menu */}
                        <Button
                          className="text-blue-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
                          onClick={() => navigate(`/add-menu/${booking._id}`)}
                          title="Add Menu"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>

                        {/* Assign Facilities */}
<Button
  className="text-gray-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
  onClick={() => {
   setSelectedBookingId(booking._id);
   setSelectedFacilities(booking.facilities || []); // ✅ preload assigned
   setShowFacilitiesModal(true);
 }}
  title="Assign Facilities"
>
  <ListChecks className="w-5 h-5" />
</Button>


                        {/* Generate List */}
                        <Button
                          className="text-blue-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
                          onClick={() => openGenerateModalFor(booking._id)}
                          title="Generate List"
                        >
                          <Settings className="w-5 h-5" />
                        </Button>

                        {/* Delete Booking */}
                        <Button
                          className="text-blue-800 hover:text-blue-700 hover:bg-white bg-transparent p-2"
                          onClick={() => handleDeleteBooking(booking._id)}
                          title="Delete Booking"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Component - Now Numbered & Right Aligned */}

              <div className="flex justify-end mt-5 px-4 pb-4 mb-5">
                <Pagination>
                  <PaginationContent className="flex items-center space-x-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </PaginationPrevious>
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <button
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* No bookings message */}
              {!isLoading && !error && bookingsData?.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Details Modal */}
          <Dialog open={showModal} onOpenChange={closeModal}>
            <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Booking Details
                </DialogTitle>
              </DialogHeader>
              {selectedBooking && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Customer Name:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {getCustomerName(selectedBooking.customerName)}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Mobile:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.mobileNumber || selectedBooking.mobile}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Event:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.eventTypeId || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        No. of Days:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.noOfDays || "N/A"}
                      </div>
                    </div>
                    {selectedBooking.noOfDays === 1 ? (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Date:
                        </span>
                        <div className="text-gray-900 dark:text-gray-100">
                          {formatDate(selectedBooking.startDate)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Start Date:
                          </span>
                          <div className="text-gray-900 dark:text-gray-100">
                            {formatDate(selectedBooking.startDate)}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            End Date:
                          </span>
                          <div className="text-gray-900 dark:text-gray-100">
                            {formatDate(selectedBooking.endDate)}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Venue Address:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.venueAddress || "N/A"}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Venue Location:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        N/A
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        User Address:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.customerAddress || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Advance/Booking Amount:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.advanceAmount || "N/A"}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Extra Facilities:
                      </span>
                      <div className="text-gray-900 dark:text-gray-100">
                        {selectedBooking.facilities &&
                        selectedBooking.facilities.length > 0 ? (
                          <ul className="list-disc ml-5">
                            {selectedBooking.facilities.map((f, i) => (
                              <li key={i}>{f.facilityId || f}</li>
                            ))}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* //  -------------------------Modal ----------------------------------- */}
     <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
  <DialogContent className="w-[90vw] max-w-md sm:max-w-lg bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl font-bold text-center text-gray-900 dark:text-gray-100">
        Select List Generation Type
      </DialogTitle>
    </DialogHeader>

    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Manual */}
      <button
        onClick={() => {
          setShowGenerateModal(false);
          navigate(`/generate-list/${selectedBookingIdForGenerate}?type=manual`);
        }}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg sm:rounded-xl border bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 shadow-sm transition-all"
      >
        <ListChecks className="h-6 w-6 sm:h-8 sm:w-8" />
        <span className="font-medium sm:font-semibold text-sm sm:text-base">Manual</span>
        <p className="text-[11px] sm:text-xs text-blue-600 text-center">
          Customize everything
        </p>
      </button>

      {/* Semi Auto */}
      <button
        onClick={() => {
          setShowGenerateModal(false);
          navigate(`/generate-list/${selectedBookingIdForGenerate}?type=semi`);
        }}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg sm:rounded-xl border bg-yellow-50 hover:bg-yellow-100 text-yellow-700 hover:text-yellow-800 shadow-sm transition-all"
      >
        <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
        <span className="font-medium sm:font-semibold text-sm sm:text-base">Semi Auto</span>
        <p className="text-[11px] sm:text-xs text-yellow-600 text-center">
          Guided smart setup
        </p>
      </button>

      {/* Fully Auto */}
      <button
        onClick={() => {
          setShowGenerateModal(false);
          navigate(`/generate-list/${selectedBookingIdForGenerate}?type=auto`);
        }}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg sm:rounded-xl border bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 shadow-sm transition-all"
      >
        <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
        <span className="font-medium sm:font-semibold text-sm sm:text-base">Fully Auto</span>
        <p className="text-[11px] sm:text-xs text-green-600 text-center">
          System generated
        </p>
      </button>
    </div>
  </DialogContent>
</Dialog>


{/* Facilities Modal */}
{/* Facilities Modal */}
<Dialog open={showFacilitiesModal} onOpenChange={setShowFacilitiesModal}>
  <DialogContent className="w-[80vw] h-[90vh] max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Assign Facilities
      </DialogTitle>
    </DialogHeader>

    {/* Select/Deselect All */}
    <div className="flex justify-start gap-4 items-center mb-4">
      <Button
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        onClick={() => setSelectedFacilities(allFacilities)}
      >
        ✅ Select All
      </Button>
      <Button
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        onClick={() => setSelectedFacilities([])}
      >
        ❌ Deselect All
      </Button>
    </div>

    {/* Facilities List - scrollable */}
 <div className="max-h-[400px] overflow-y-auto pr-2">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {allFacilities.map((facility) => (
      <label
        key={facility._id}
      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer shadow-sm border text-sm transition-all
   ${
     selectedFacilities.some(
   (f) => (f.facilityId || f._id) === facility._id
 )
       ? "bg-blue-50 border-blue-400 text-blue-800 font-medium"
       : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600"
   }`}
      >
        <input
          type="checkbox"
          checked={selectedFacilities.some((f) => (f.facilityId || f._id) === facility._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedFacilities((prev) => [...prev, { ...facility, facilityId: facility._id }]);
            } else {
              setSelectedFacilities((prev) =>
                prev.filter((f) => f.facilityId !== facility._id && f._id !== facility._id)
              );
            }
          }}
        />
        <span className="text-gray-800 dark:text-gray-200">
          {facility.name?.[i18n.language] || facility.name?.en}
        </span>
      </label>
    ))}
  </div>
</div>



    {/* Save Button */}
    <div className="mt-6 flex justify-end">
     <Button
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
       facilities: selectedFacilities.map((f) => ({
    facilityId: f.facilityId || f._id, // ✅ handle both cases
    quantity: f.quantity || 1,
  })),
      };

      await protectedUpdateApi(
        `${config.AddBooking}/${selectedBookingID}`,
        payload,
        token
      );

      Swal.fire("Success!", "Facilities updated successfully!", "success");
      setShowFacilitiesModal(false);
      fetchBookings(currentPage);
    } catch (error) {
      Swal.fire("Error!", "Failed to update facilities", "error");
    }
  }}
>
  <Save/> Save Facilities
</Button>


    </div>
  </DialogContent>
</Dialog>



    </>
  );
}

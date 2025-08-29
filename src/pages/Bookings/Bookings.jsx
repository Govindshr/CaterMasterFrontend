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
import { protectedGetApi, protectedDeleteApi } from "@/services/nodeapi";
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

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    onClick={() => navigate(`/view-booking/${booking._id}`)}
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
        <DialogContent className="max-w-md bg-white p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Select List Generation Type
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <Button
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => {
                setShowGenerateModal(false);
                navigate(
                  `/generate-list/${selectedBookingIdForGenerate}?type=manual`
                );
              }}
            >
              Manual List
            </Button>
            <Button
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={() => {
                setShowGenerateModal(false);
                navigate(
                  `/generate-list/${selectedBookingIdForGenerate}?type=semi`
                );
              }}
            >
              Semi Auto List
            </Button>
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                setShowGenerateModal(false);
                navigate(
                  `/generate-list/${selectedBookingIdForGenerate}?type=auto`
                );
              }}
            >
              Fully Auto List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

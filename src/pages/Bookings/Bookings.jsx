import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dropdownIdx, setDropdownIdx] = useState(null);
  const [dropdownMobileIdx, setDropdownMobileIdx] = useState(null);

  const navigate = useNavigate();

  // Dummy data for bookings with new fields
  const bookingsData = [
    {
      id: "B001",
      customerName: "John Doe",
      mobile: "9876543210",
      event: "Wedding",
      noOfDays: "2",
      date: "",
      startDate: "2025-06-10",
      endDate: "2025-06-11",
      venueAddress: "123 Main Street, City, Country",
      venueLocation: "https://maps.google.com/?q=123+Main+Street",
      userAddress: "456 User Lane, City, Country",
      amount: "5000",
      facilities: ["Dairy", "Vegetables"],
    },
    {
      id: "B002",
      customerName: "Alice Smith",
      mobile: "9123456789",
      event: "Anniversary",
      noOfDays: "1",
      date: "2025-07-15",
      startDate: "",
      endDate: "",
      venueAddress: "Sunset Garden, City",
      venueLocation: "",
      userAddress: "789 User Ave, City, Country",
      amount: "3200",
      facilities: ["Rashan"],
    },
    {
      id: "B003",
      customerName: "Michael Brown",
      mobile: "9988776655",
      event: "Corporate Event",
      noOfDays: "3",
      date: "",
      startDate: "2025-08-01",
      endDate: "2025-08-03",
      venueAddress: "Royal Palace, City",
      venueLocation: "https://maps.google.com/?q=Royal+Palace",
      userAddress: "321 User Blvd, City, Country",
      amount: "4500",
      facilities: ["Dairy", "Snacks", "Drinks"],
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(bookingsData.length / itemsPerPage);

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedBookings = bookingsData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  return (
    <div className="max-w-8xl mx-auto  w-full">
      <Card className="shadow-lg rounded-lg mb-5">
        {/* Card Header with Title & Button */}
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center border-b p-4 gap-4 md:gap-0 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-2xl font-bold text-white tracking-tight">Bookings</h2>
          <Button
            className="flex items-center bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-md px-4 py-2 rounded-lg transition-all"
            onClick={() => navigate("/add-bookings")}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Booking
          </Button>
        </CardHeader>

        {/* Card Content - Responsive */}
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table className="bg-white dark:bg-gray-800">
                <TableHeader className="bg-gray-100 bg-white dark:bg-gray-800">
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    {/* <TableHead>Event</TableHead> */}
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBookings.map((booking, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.mobile}</TableCell>
                      {/* <TableCell>{booking.event}</TableCell> */}
                      <TableCell>
                        {booking.noOfDays === "1"
                          ? booking.date
                          : `${booking.startDate} to ${booking.endDate}`}
                      </TableCell>
                      <TableCell className="flex flex-wrap justify-center space-x-2 relative">
                        <Button
                          className="text-blue-500 hover:text-blue-700 hover:bg-white bg-transparent p-2"
                          onClick={() => navigate("/view-booking")}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                          className="text-gray-600 hover:text-blue-700 bg-transparent p-2 ml-2"
                          onClick={() => setDropdownIdx(dropdownIdx === index ? null : index)}
                          variant="ghost"
                          size="icon"
                        >
                          <Settings className="w-5 h-5" />
                        </Button>
                        {/* Dropdown menu */}
                        {dropdownIdx === index && (
                          <div className="absolute z-20 right-0 mt-10 w-40 bg-white border rounded-lg shadow-lg flex flex-col text-left animate-fade-in">
                            <button
                              className="px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm text-left"
                              onClick={() => { setDropdownIdx(null); navigate("/add-menu"); }}
                            >
                              Add Menu
                            </button>
                            <button
                              className="px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm text-left"
                              onClick={() => { setDropdownIdx(null); navigate("/generate-list"); }}
                            >
                              Generate List
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {selectedBookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-400">Booking ID</span>
                  <span className="text-sm font-bold text-blue-700">{booking.id}</span>
                </div>
                <div className="text-lg font-semibold text-gray-800">{booking.customerName}</div>
                <div className="text-sm text-gray-500">Mobile: {booking.mobile}</div>
                <div className="text-sm text-gray-500">Event: {booking.event}</div>
                <div className="text-sm text-gray-500">
                  Dates: {booking.noOfDays === "1" ? booking.date : `${booking.startDate} to ${booking.endDate}`}
                </div>
                <div className="flex justify-end mt-2 gap-2 relative">
                  <Button
                    className="text-blue-500 hover:text-blue-700 bg-transparent p-2"
                    onClick={() => navigate("/view-booking")}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                  <Button
                    className="text-gray-600 hover:text-blue-700 bg-transparent p-2"
                    onClick={() => setDropdownMobileIdx(dropdownMobileIdx === index ? null : index)}
                    variant="ghost"
                    size="icon"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  {/* Dropdown menu for mobile */}
                  {dropdownMobileIdx === index && (
                    <div className="absolute z-20 right-0 mt-10 w-40 bg-white border rounded-lg shadow-lg flex flex-col text-left animate-fade-in">
                      <button
                        className="px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm text-left"
                        onClick={() => { setDropdownMobileIdx(null); navigate("/add-menu"); }}
                      >
                        Add Menu
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm text-left"
                        onClick={() => { setDropdownMobileIdx(null); navigate("/generate-list"); }}
                      >
                        Generate List
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

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
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Customer Name:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.customerName}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Mobile:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.mobile}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Event:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.event}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">No. of Days:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.noOfDays}</div>
                </div>
                {selectedBooking.noOfDays === "1" ? (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
                    <div className="text-gray-900 dark:text-gray-100">{selectedBooking.date}</div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Start Date:</span>
                      <div className="text-gray-900 dark:text-gray-100">{selectedBooking.startDate}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">End Date:</span>
                      <div className="text-gray-900 dark:text-gray-100">{selectedBooking.endDate}</div>
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Venue Address:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.venueAddress || <span className="italic text-gray-400">N/A</span>}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Venue Location:</span>
                  <div className="text-gray-900 dark:text-gray-100">
                    {selectedBooking.venueLocation ? (
                      <a href={selectedBooking.venueLocation} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on Google Maps</a>
                    ) : <span className="italic text-gray-400">N/A</span>}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">User Address:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.userAddress}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Advance/Booking Amount:</span>
                  <div className="text-gray-900 dark:text-gray-100">{selectedBooking.amount || <span className="italic text-gray-400">N/A</span>}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Extra Facilities:</span>
                  <div className="text-gray-900 dark:text-gray-100">
                    {selectedBooking.facilities && selectedBooking.facilities.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {selectedBooking.facilities.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    ) : <span className="italic text-gray-400">N/A</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

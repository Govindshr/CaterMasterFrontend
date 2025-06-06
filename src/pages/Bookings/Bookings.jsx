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
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Dummy data for bookings
  const bookingsData = [
    { id: "B001", name: "John Doe", venue: "Grand Hall", amount: "$5000" },
    {
      id: "B002",
      name: "Alice Smith",
      venue: "Sunset Garden",
      amount: "$3200",
    },
    {
      id: "B003",
      name: "Michael Brown",
      venue: "Royal Palace",
      amount: "$4500",
    },
    {
      id: "B004",
      name: "Emma Johnson",
      venue: "Beach Resort",
      amount: "$6000",
    },
    { id: "B005", name: "David Wilson", venue: "Luxury Club", amount: "$5500" },
    {
      id: "B006",
      name: "Sophia White",
      venue: "Skyline Hall",
      amount: "$4200",
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

  return (
    <>
      <div className="max-w-8xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          {/* Card Header with Title & Button */}
          <CardHeader className="flex justify-between  border-b p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bookings</h2>
              <Button
                className="flex items-center bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/add-bookings")}
              >
                <Plus className="w-5 h-5 mr-2" /> Add Booking
              </Button>
            </div>
          </CardHeader>

          {/* Card Content - Table */}
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Amount</TableHead>
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
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{booking.venue}</TableCell>
                      <TableCell>{booking.amount}</TableCell>
                      <TableCell className="flex flex-wrap justify-center space-x-2">
                        {/* Add Facility Button */}
                        <button
                          className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-all"
                          onClick={() => navigate("/add-facilities")}
                        >
                          <Plus className="w-5 h-5 " /> Facility
                        </button>

                        {/* Add Menu Button */}
                        <button
                          className="flex items-center bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600 transition-all"
                          onClick={() => navigate("/add-menu")}
                        >
                          <Plus className="w-5 h-5" />
                          Menu
                        </button>

                        <button
                          className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 transition-all"
                          onClick={() => setShowModal(true)}
                        >
                          <Plus className="w-5 h-5" /> List
                        </button>

                        {/* Action Buttons */}
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => navigate("/view-booking")}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => navigate("/edit-booking")}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Component - Now Numbered & Right Aligned */}
            <div className="flex justify-end mt-5">
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

                  {/* Page Numbers */}
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
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
            <h2 className="text-xl font-bold mb-4">Choose Option</h2>
            <div className="space-y-2">
              <Button  onClick={() => navigate("/generate-list")} className="w-full bg-blue-500 hover:bg-blue-600">
                Auto Generated List 
              </Button>
              <Button  onClick={() => navigate("/generate-list")} className="w-full bg-green-500 hover:bg-green-600">
                Semi Auto Generated List
              </Button>
              <Button onClick={() => navigate("/generate-list")} className="w-full bg-purple-500 hover:bg-purple-600">
               Manual List 
              </Button>
            </div>
            <Button
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

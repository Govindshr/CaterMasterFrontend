import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

// Dummy booking details
const bookingData = {
  bookingId: "B001",
  bookingDateFrom: "2025-03-10",
  bookingDateTo: "2025-03-12",
  noOfDays: "3",
  customerName: "John Doe",
  contactNo: "9876543210",
  email: "john.doe@example.com",
  address: "123 Main Street, City, Country",
  venue: "Grand Hall",
  eventName: "Wedding Anniversary",
  amount: "$5000",
  advance: "$2000",
};

export default function ViewBooking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6">
      <Card className="w-full max-w-4xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Gradient Header */}
        <CardHeader className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 sm:p-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight text-center w-full">Booking Details</h2>
            <Button
              variant="outline"
              className="flex items-center bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all absolute right-4 top-4 sm:static sm:right-auto sm:top-auto"
              onClick={() => navigate("/bookings")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> <span className="hidden sm:inline">Back to Bookings</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-white dark:bg-gray-950">
          {/* Responsive Table Layout */}
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableBody>
                {Object.entries(bookingData).map(([key, value], idx) => (
                  <TableRow
                    key={key}
                    className={`flex flex-col md:table-row ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-950'}`}
                  >
                    <TableCell className="font-semibold text-sm bg-gray-100 dark:bg-gray-800 capitalize px-4 py-3 md:w-1/3 md:whitespace-nowrap rounded-t-lg md:rounded-none">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3 break-words">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

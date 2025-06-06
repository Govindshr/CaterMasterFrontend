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
    <div className="p-4 max-w-5xl mx-auto">
      {/* Back Button */}
     

      {/* Booking Details Card */}
      <Card className="shadow-lg rounded-lg">

      <div className="flex justify-end mb-4 p-4">
        <Button variant="outline" className="flex items-center" onClick={() => navigate("/bookings")}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Bookings
        </Button>
      </div>
        <CardHeader>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 text-center">Booking Details</h2>
        </CardHeader>

        <CardContent>
          {/* Responsive Table Layout */}
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableBody>
                {Object.entries(bookingData).map(([key, value]) => (
                  <TableRow key={key} className="border-b flex flex-col md:table-row">
                    <TableCell className="font-semibold bg-gray-100 dark:bg-gray-800 capitalize px-4 py-3 md:w-1/3 md:whitespace-nowrap">
                      {key.replace(/([A-Z])/g, " $1")}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3">{value}</TableCell>
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

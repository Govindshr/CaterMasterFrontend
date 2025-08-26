import { useNavigate ,useParams} from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { useTranslation } from "react-i18next";



export default function ViewBooking() {
  const navigate = useNavigate();
   const { i18n } = useTranslation();
const { id } = useParams();
const [bookingData, setBookingData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(`${config.AddBooking}/${id}`, token);
      setBookingData(response.data);
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      setError(err.response?.data?.message || "Error loading booking");
    } finally {
      setLoading(false);
    }
  };
  fetchBooking();
}, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6">
      <Card className="w-full max-w-7xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
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
          {/* Responsive Details Layout */}
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Customer Name:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.customerName?.en}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Mobile:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.mobileNumber}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Event:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.bookingTypeId.name?.[i18n.language] || bookingData?.bookingTypeId.name?.en}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">No. of Days:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.noOfDays}</div>
              </div>
              {bookingData?.noOfDays === "1" ? (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
                  <div className="text-gray-900 dark:text-gray-100">{bookingData?.startDate}</div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Start Date:</span>
                    <div className="text-gray-900 dark:text-gray-100">{bookingData?.startDate}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">End Date:</span>
                    <div className="text-gray-900 dark:text-gray-100">{bookingData?.endDate}</div>
                  </div>
                </>
              )}
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Venue Address:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.venueAddress || <span className="italic text-gray-400">N/A</span>}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Venue Location:</span>
                <div className="text-gray-900 dark:text-gray-100">
                  {bookingData?.googleVenueLocation ? (
                    <a href={bookingData?.googleVenueLocation} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on Google Maps</a>
                  ) : <span className="italic text-gray-400">N/A</span>}
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">User Address:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.customerAddress}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Advance/Booking Amount:</span>
                <div className="text-gray-900 dark:text-gray-100">{bookingData?.advanceAmount || <span className="italic text-gray-400">N/A</span>}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Extra Facilities:</span>
                <div className="text-gray-900 dark:text-gray-100">
                  {bookingData?.facilities && bookingData?.facilities.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {bookingData?.facilities.map((f, i) => (
                        <li key={i}>{f.facilityId.name?.[i18n.language] || f.facilityId.name?.en}</li>
                        
                      ))}
                    </ul>
                  ) : <span className="italic text-gray-400">N/A</span>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6">
    <Card className="w-full max-w-7xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Booking Details
        </h2>
        <Button
          variant="outline"
          className="flex items-center text-sm sm:text-base"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
        </Button>
      </div>

      {/* Booking Info */}
      <CardContent className="p-6 bg-white dark:bg-gray-950 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">Customer Name</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {bookingData?.customerName?.[i18n.language] || bookingData?.customerName?.en}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Mobile</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {bookingData?.mobileNumber}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Event</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {bookingData?.bookingTypeId?.name?.[i18n.language] || bookingData?.bookingTypeId?.name?.en}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">No. of Days</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {bookingData?.noOfDays}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Start Date</span>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              {formatDate(bookingData?.startDate)}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">End Date</span>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              {formatDate(bookingData?.endDate)}
            </p>
          </div>
        </div>

        {/* Venue Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Venue Information</h3>
          <p><span className="font-medium">Address:</span> {bookingData?.venueAddress || "N/A"}</p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            {bookingData?.googleVenueLocation ? (
              <a href={bookingData.googleVenueLocation} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                View on Google Maps
              </a>
            ) : "N/A"}
          </p>
        </div>

        {/* User Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">User Information</h3>
          <p><span className="font-medium">User Address:</span> {bookingData?.customerAddress}</p>
          <p><span className="font-medium">Advance Amount:</span> ₹{bookingData?.advanceAmount}</p>
          {bookingData?.alternateContact && (
            <p><span className="font-medium">Alternate Contact:</span> {bookingData.alternateContact.name} ({bookingData.alternateContact.number})</p>
          )}
        </div>

        {/* Facilities */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Extra Facilities</h3>
          {bookingData?.facilities?.length > 0 ? (
            <ul className="list-disc ml-6 space-y-1">
              {bookingData.facilities.map((f, i) => (
                <li key={i} className="text-gray-800 dark:text-gray-200">
                  {f.facilityId.name?.[i18n.language] || f.facilityId.name?.en} – ₹{f.facilityId.cost}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-400">N/A</p>
          )}
        </div>

        {/* Occasions */}
<div className="border-t pt-4">
  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Occasions</h3>
  {bookingData?.occasions?.length > 0 ? (
    <ul className="space-y-2">
      {bookingData.occasions.map((occ, i) => (
        <li
          key={i}
          className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
        >
          <span className="font-medium text-gray-800 dark:text-gray-200">{occ.occasionName}</span>
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(occ.date)}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="italic text-gray-400">No occasions added</p>
  )}
</div>

      </CardContent>
    </Card>
  </div>
);

}

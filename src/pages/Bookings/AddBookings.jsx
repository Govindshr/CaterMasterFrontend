import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { protectedPostApi ,protectedGetApi} from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";





export default function AddBooking() {
  const navigate = useNavigate();
   const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
const [bookingTypeOptions, setBookingTypeOptions] = useState([]);
const [facilityOptions,setFacilityOptions] = useState([])
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    alternateName: "",           // ✅ New
    alternateMobile: "",         // ✅ New
    bookingTypeId: "",
    noOfDays: "1",
    date: "",
    startDate: "",
    endDate: "",
    venueAddress: "",
    venueLocation: "",
    userAddress: "",
    amount: "",
    facilities: [],
  });

  const [errors, setErrors] = useState({});
  const [showLocationInput, setShowLocationInput] = useState(false);

   
useEffect(() => {
  fetchBookingTypes();
  fetchFacilities();
}, [i18n.language]);
   const fetchBookingTypes = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetBookingType, token);
    if (res.success === true) {
      setBookingTypeOptions(res.data || []);
    }
  } catch (error) {
    console.error("Error fetching booking types:", error);
    setBookingTypeOptions([]);
  }
};

    const fetchFacilities = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetFacilities, token);

    const bookingFacilities = (res?.data || []).filter(
      (facility) => facility.scope === "booking"
    );

    setFacilityOptions(bookingFacilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        facilities: checked
          ? [...prev.facilities, value]
          : prev.facilities.filter((f) => f !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    let validationErrors = {};
    if (!formData.customerName.trim()) validationErrors.customerName = "Required";
    if (!formData.mobile.match(/^\d{10}$/)) validationErrors.mobile = "10-digit number";
  if (!formData.bookingTypeId) validationErrors.bookingTypeId = "Select a booking type";
    if (!formData.noOfDays.match(/^\d+$/) || Number(formData.noOfDays) < 1) validationErrors.noOfDays = "Enter valid number";
    if (formData.noOfDays === "1") {
      if (!formData.date) validationErrors.date = "Required";
    } else {
      if (!formData.startDate) validationErrors.startDate = "Required";
      if (!formData.endDate) validationErrors.endDate = "Required";
    }
    if (!formData.venueAddress && !formData.venueLocation) {
      validationErrors.venueAddress = "At least one venue field required";
      validationErrors.venueLocation = "At least one venue field required";
    }
    if (!formData.userAddress.trim()) validationErrors.userAddress = "Required";
    return validationErrors;
  };

const formatDataForAPI = () => {
 const formattedFacilities = formData.facilities.map(id => ({
  facilityId: id,
  quantity: 1,
  customCost: 0,
}));


  const payload = {
    customerName: {
      en: formData.customerName,
      hi: formData.customerName,
    },
    mobileNumber: formData.mobile,
    bookingTypeId: formData.bookingTypeId,
    noOfDays: parseInt(formData.noOfDays),
    startDate: formData.noOfDays === "1" ? formData.date : formData.startDate,
    venueAddress: formData.venueAddress || "",
    googleVenueLocation: formData.venueLocation || "",
    customerAddress: formData.userAddress,
    advanceAmount: formData.amount ? parseFloat(formData.amount) : 0,
    alternateContact: {
      name: formData.alternateName,
      number: formData.alternateMobile,
    },
    facilities: formattedFacilities,
  };

  if (formData.noOfDays !== "1") {
    payload.endDate = formData.endDate;
  }

  return payload;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setApiError("");

  const apiData = formatDataForAPI();
  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await protectedPostApi(config.AddBooking, apiData, token);

      if (response.success && response.data?._id) {
        // ✅ Call generate occasions API after successful booking
        const generateUrl = `${config.AddBooking}/${response.data._id}/generate-occasions`;
        await protectedPostApi(generateUrl, {}, token);
      }

      alert("Booking Added Successfully! ✅");
      navigate("/bookings");
    } catch (error) {
      console.error("Error adding booking or generating occasions:", error);
      setApiError(
        error.response?.data?.message || error.message || "Failed to add booking"
      );
    } finally {
      setIsLoading(false);
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-7xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-5">
        <CardHeader className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 sm:p-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Add Booking</h2>
            <Button
              variant="outline"
              className="flex items-center bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all"
              onClick={() => navigate("/bookings")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> <span className="hidden sm:inline">Back to Bookings</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-white dark:bg-gray-950">
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Customer Name</Label>
                <Input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Mobile Number</Label>
                <Input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Alternate Contact Name</Label>
                <Input
                  type="text"
                  name="alternateName"
                  value={formData.alternateName}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Enter alternate contact name"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Alternate Contact Number</Label>
                <Input
                  type="text"
                  name="alternateMobile"
                  value={formData.alternateMobile}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Enter 10-digit number"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Booking for </Label>
               <Select
  value={formData.bookingTypeId}
  onValueChange={(value) =>
    setFormData((prev) => ({ ...prev, bookingTypeId: value }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select booking type" />
  </SelectTrigger>
  <SelectContent>
    {bookingTypeOptions.map((type) => (
      <SelectItem key={type._id} value={type._id}>
        {type.name?.[i18n.language] || type.name?.en}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

               {errors.bookingTypeId && <p>{errors.bookingTypeId}</p>}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">No. of Days</Label>
                <Input
                  type="number"
                  name="noOfDays"
                  min="1"
                  value={formData.noOfDays}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                />
                {errors.noOfDays && <p className="text-red-500 text-sm mt-1">{errors.noOfDays}</p>}
              </div>
              {/* Date fields conditional */}
              {formData.noOfDays === "1" ? (
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Venue Address</Label>
                <Textarea
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Enter venue address (optional)"
                />
                {errors.venueAddress && <p className="text-red-500 text-sm mt-1">{errors.venueAddress}</p>}
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Venue Location (Google)</Label>
                <Input
                  type="text"
                  name="venueLocation"
                  value={formData.venueLocation}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Paste Google Maps location link (optional)"
                />
                {errors.venueLocation && <p className="text-red-500 text-sm mt-1">{errors.venueLocation}</p>}
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">User Address</Label>
                <Textarea
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Enter user address"
                />
                {errors.userAddress && <p className="text-red-500 text-sm mt-1">{errors.userAddress}</p>}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Advance/Booking Amount</Label>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900"
                  placeholder="Enter amount (optional)"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Extra Facilities</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {facilityOptions.map((facility, idx) => (
                    <label key={facility._id} className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg cursor-pointer">
                     <input
  type="checkbox"
  name="facilities"
  value={facility._id}
  checked={formData.facilities.includes(facility._id)}
  onChange={handleChange}
/>

                      {facility.name?.[i18n.language] || facility.name?.en}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all text-base md:text-lg"
              >
                {isLoading ? "Adding Booking..." : "Add Booking"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

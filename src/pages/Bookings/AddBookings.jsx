import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const eventOptions = [
  "Anniversary",
  "Wedding",
  "Corporate Event",
];

const facilityOptions = [
  "Dairy",
  "Vegetables",
  "Rashan",
  "Coal",
  "Tables",
];

export default function AddBooking() {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  customerName: "",
  mobile: "",
  alternateName: "",           // ✅ New
  alternateMobile: "",         // ✅ New
  event: "",
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
    if (!formData.event) validationErrors.event = "Select an event";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      alert("Booking Added Successfully! ✅");
      navigate("/bookings");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-6xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-5">
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
               <Label className="text-sm font-semibold text-gray-700">Booking for Event</Label>
<Select
  value={formData.event}
  onValueChange={(value) =>
    setFormData((prev) => ({ ...prev, event: value }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select event" />
  </SelectTrigger>
  <SelectContent>
    {eventOptions.map((event) => (
      <SelectItem key={event} value={event}>
        {event}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{errors.event && (
  <p className="text-red-500 text-sm mt-1">{errors.event}</p>
)}

                {errors.event && <p className="text-red-500 text-sm mt-1">{errors.event}</p>}
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
                    <label key={idx} className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="facilities"
                        value={facility}
                        checked={formData.facilities.includes(facility)}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />
                      {facility}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all text-base md:text-lg"
              >
                Add Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

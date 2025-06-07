import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AddBooking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingDateFrom: "",
    bookingDateTo: "",
    noOfDays: "",
    customerName: "",
    contactNo: "",
    email: "",
    address: "",
    venue: "",
    eventName: "",
    amount: "",
    advance: "",
  });

  const [errors, setErrors] = useState({});

  const eventOptions = [
    "Birth",
    "BirthDay",
    "Mundan",
    "Engagement",
    "Lagan & Vinayak",
    "Basan",
    "Nikasi",
    "Mahila – Sangeet",
    "Reception",
    "Wedding Anniversary",
    "Chudiyo ki Rasoi",
    "Retirement",
    "Death",
    "Inauguration",
    "Grah Pravesh",
    "Religious Programme",
    "Caste Programme",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!formData.bookingDateFrom)
      validationErrors.bookingDateFrom = "Required";
    if (!formData.bookingDateTo) validationErrors.bookingDateTo = "Required";
    if (!formData.noOfDays.match(/^\d+$/))
      validationErrors.noOfDays = "Only numbers";
    if (!formData.customerName.match(/^[A-Za-z\s]+$/))
      validationErrors.customerName = "Only alphabets";
    if (!formData.contactNo.match(/^\d{10}$/))
      validationErrors.contactNo = "10-digit number";
    if (!formData.email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/))
      validationErrors.email = "Invalid email";
    if (!formData.venue.match(/^[A-Za-z\s]+$/))
      validationErrors.venue = "Only alphabets";
    if (!formData.amount.match(/^\d+$/))
      validationErrors.amount = "Only numbers";
    if (!formData.advance.match(/^\d+$/))
      validationErrors.advance = "Only numbers";
    if (!formData.eventName) validationErrors.eventName = "Select an event";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Booking Added Successfully! ✅");
      navigate("/bookings");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-4xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-5">
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
                <Label className="text-sm font-semibold text-gray-700">Booking Date From</Label>
                <div className="relative mt-1">
                  <Input
                    type="date"
                    name="bookingDateFrom"
                    value={formData.bookingDateFrom}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.bookingDateFrom && (
                  <p className="text-red-500 text-sm mt-1">{errors.bookingDateFrom}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Booking Date To</Label>
                <div className="relative mt-1">
                  <Input
                    type="date"
                    name="bookingDateTo"
                    value={formData.bookingDateTo}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.bookingDateTo && (
                  <p className="text-red-500 text-sm mt-1">{errors.bookingDateTo}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">No of Days</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="noOfDays"
                    placeholder="Enter No. Of Days"
                    value={formData.noOfDays}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.noOfDays && (
                  <p className="text-red-500 text-sm mt-1">{errors.noOfDays}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Customer Name</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Contact No</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.contactNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Email</Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Address</Label>
                <div className="relative mt-1">
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Venue</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.venue && (
                  <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Event Name</Label>
                <div className="relative mt-1">
                  <Select
                    name="eventName"
                    value={formData.eventName}
                    onValueChange={(value) => setFormData({ ...formData, eventName: value })}
                  >
                    <SelectTrigger className="rounded-lg border border-gray-300 mt-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventOptions.map((event, index) => (
                        <SelectItem key={index} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.eventName && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Amount</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Advance</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="advance"
                    value={formData.advance}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm w-full pl-3 pr-3 py-2 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                {errors.advance && (
                  <p className="text-red-500 text-sm mt-1">{errors.advance}</p>
                )}
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

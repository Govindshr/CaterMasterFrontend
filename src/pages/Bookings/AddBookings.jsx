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
    <div className="max-w-6xl mx-auto">
      
      <Card className="shadow-xl rounded-lg p-6">

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Bookings
        </Button>
      </div>
        <CardHeader>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Add New Booking
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Booking Date From</Label>
                <Input
                  type="date"
                  name="bookingDateFrom"
                  value={formData.bookingDateFrom}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
                {errors.bookingDateFrom && (
                  <p className="text-red-500 text-sm">
                    {errors.bookingDateFrom}
                  </p>
                )}
              </div>

              <div>
                <Label>Booking Date To</Label>
                <Input
                  type="date"
                  name="bookingDateTo"
                  value={formData.bookingDateTo}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
                {errors.bookingDateTo && (
                  <p className="text-red-500 text-sm">{errors.bookingDateTo}</p>
                )}
              </div>

              <div>
                <Label>No of Days</Label>
                <Input
                  type="text"
                  name="noOfDays"
                  value={formData.noOfDays}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div>
                <Label>Customer Name</Label>
                <Input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div>
                <Label>Contact No</Label>
                <Input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div>
                <Label>Venue</Label>
                <Input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>
              <div>
  <Label>Event Name</Label>
  <Select onValueChange={(value) => setFormData({ ...formData, eventName: value })}>
    <SelectTrigger className="rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-blue-500">
      <SelectValue placeholder="Select Event" />
    </SelectTrigger>
    <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md max-h-60 overflow-auto">
      {eventOptions.map((event, index) => (
        <SelectItem
          key={index}
          value={event}
          className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-200 cursor-pointer transition-all duration-150 rounded-md"
        >
          {event}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


              <div>
                <Label>Amount</Label>
                <Input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div>
                <Label>Advance</Label>
                <Input
                  type="text"
                  name="advance"
                  value={formData.advance}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-green-600 hover:bg-blue-700 w-half text-lg rounded-lg"
            >
              Submit Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

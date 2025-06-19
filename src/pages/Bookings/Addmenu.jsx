import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, ArrowLeft, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // ensures autoTable is attached
// Dummy data for categories, subcategories, dishes, facilities, occasions, meal types, serving types
const categories = [
  { id: "1", name: "Sweets" },
  { id: "2", name: "Namkeen" },
  { id: "3", name: "Beverages" },
  { id: "4", name: "Main Course" },
];
const subcategories = [
  { id: "1-1", categoryId: "1", name: "Milk" },
  { id: "1-2", categoryId: "1", name: "Dry Fruit" },
  { id: "2-1", categoryId: "2", name: "Fried" },
  { id: "3-1", categoryId: "3", name: "Hot" },
  { id: "3-2", categoryId: "3", name: "Cold" },
  { id: "4-1", categoryId: "4", name: "Paneer" },
];
const dishes = [
  { id: "101", categoryId: "1", subcategoryId: "1-1", name: "Rasmalai" },
  { id: "102", categoryId: "1", subcategoryId: "1-1", name: "Gulab Jamun" },
  { id: "103", categoryId: "1", subcategoryId: "1-2", name: "Kaju Katli" },
  { id: "201", categoryId: "2", subcategoryId: "2-1", name: "Samosa" },
  { id: "202", categoryId: "2", subcategoryId: "2-1", name: "Pakora" },
  { id: "301", categoryId: "3", subcategoryId: "3-1", name: "Tea" },
  { id: "302", categoryId: "3", subcategoryId: "3-2", name: "Cold Coffee" },
  { id: "401", categoryId: "4", subcategoryId: "4-1", name: "Paneer Butter Masala" },
];
const facilities = ["LED Counter", "Pan Counter", "Live Chaat", "DJ", "Flower Decor"];
const occasionNames = [
  "Normal Breakfast",
  "Mehendi",
  "Haldi",
  "Sagai",
  "Main Event",
  "Reception",
  "Lunch",
  "Dinner",
];
const mealTypes = [
  "Breakfast",
  "Lunch",
  "High Tea",
  "Dinner",
  "Packing",
  "Full Day Servings",
];
const servingTypes = ["Buffet", "Table Chair", "Plated", "Family Style"];

// Dummy booking dates
const bookingDates = ["2025-06-10", "2025-06-11"];

function generateMenuPDF({occasions, bookingDetails}) {
  const doc = new jsPDF();

  // Company Header
  doc.setFontSize(18);
  doc.text('SFS', 15, 18);
  doc.setFontSize(14);
  doc.text('Shrigni Food Services', 30, 18);
  doc.setFontSize(10);
  doc.text('Menu Plan', 15, 28);
  doc.setLineWidth(0.5);
  doc.line(15, 30, 195, 30);

  let y = 36;
  // Dummy booking details
  const customer = bookingDetails?.customerName || 'John Doe';
  const event = bookingDetails?.eventName || 'Wedding Reception';
  const venue = bookingDetails?.venue || 'Grand Hall, City Center';
  doc.text(`Customer: ${customer}`, 15, y);
  doc.text(`Event: ${event}`, 100, y);
  y += 6;
  doc.text(`Venue: ${venue}`, 15, y);
  y += 8;

  Object.keys(occasions).forEach(date => {
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 15, y);
    y += 6;
    occasions[date].forEach((occ, idx) => {
      doc.setFontSize(11);
      doc.text(`Occasion ${idx + 1}: ${occ.occasionName || 'Lunch'}`, 20, y);
      y += 5;
      const tableBody = [
        [
          'Meal Type',
          occ.mealType || 'Buffet',
          'Time',
          occ.time || '12:00 PM',
        ],
        [
          'Guests',
          occ.guests || '100',
          'Serving Type',
          occ.servingType || 'Plated',
        ],
        [
          'Venue',
          occ.venue || venue,
          'Facilities',
          (occ.facilities && occ.facilities.join(', ')) || 'Standard',
        ],
      ];
       console.log(typeof doc.autoTable); 
      doc.autoTable({
    startY: y,
    head: [['', '', '', '']],
    body: tableBody,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    margin: { left: 20, right: 15 },
    didDrawCell: () => {},
  });
  
      y = doc.lastAutoTable.finalY + 2;
      // Menu Items
      doc.setFontSize(10);
      doc.text('Menu:', 25, y);
      y += 4;
      const menuItems = (occ.menu && occ.menu.length > 0) ? occ.menu : ['Paneer Tikka', 'Dal Makhani', 'Naan', 'Gulab Jamun'];
      menuItems.forEach(item => {
        doc.text(`- ${item}`, 30, y);
        y += 4;
      });
      y += 2;
      if (y > 260) { doc.addPage(); y = 20; }
    });
    y += 2;
    if (y > 260) { doc.addPage(); y = 20; }
  });

  // Notes and Footer
  y += 6;
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setFontSize(10);
  doc.text('Notes:', 15, y);
  y += 5;
  doc.text('• Please confirm the menu and guest count 2 days prior to the event.', 18, y);
  y += 5;
  doc.text('• For any changes, contact us at 9876543210 or info@shrignifood.com', 18, y);
  y += 8;
  doc.setFontSize(11);
  doc.text('Thank you for choosing Shrigni Food Services!', 15, y);

  doc.save('Menu_ShrigniFoodServices.pdf');
}

export default function AddMenu() {
  const navigate = useNavigate();
  // Occasions state: { [date]: [occasion, ...] }
  const [occasions, setOccasions] = useState(
    bookingDates.reduce((acc, date) => {
      acc[date] = [
        {
          occasionName: "",
          date,
          mealType: "",
          startTime: "",
          endTime: "",
          guests: "",
          menu: [],
          servingType: "",
          exactVenue: "",
          facilities: [],
        },
      ];
      return acc;
    }, {})
  );
  // Menu filter state (per occasion)
  const [menuFilter, setMenuFilter] = useState({ category: "", subcategory: "", search: "" });
  // Accordion state
  const [openDate, setOpenDate] = useState(bookingDates[0]);
  const [openOccasion, setOpenOccasion] = useState({ [bookingDates[0]]: 0 });

  // Add new occasion for a date
  const addOccasion = (date) => {
    setOccasions((prev) => {
      const newOccasions = {
        ...prev,
        [date]: [
          ...prev[date],
          {
            occasionName: "",
            date,
            mealType: "",
            startTime: "",
            endTime: "",
            guests: "",
            menu: [],
            servingType: "",
            exactVenue: "",
            facilities: [],
          },
        ],
      };
      return newOccasions;
    });
    setOpenOccasion((prev) => ({ ...prev, [date]: occasions[date] ? occasions[date].length : 0 }));
  };
  // Remove occasion
  const removeOccasion = (date, idx) => {
    setOccasions((prev) => {
      const updated = prev[date].filter((_, i) => i !== idx);
      return { ...prev, [date]: updated };
    });
    setOpenOccasion((prev) => {
      const occs = occasions[date].filter((_, i) => i !== idx);
      let newIdx = 0;
      if (occs.length > 1 && prev[date] === idx && idx > 0) newIdx = idx - 1;
      return { ...prev, [date]: occs.length ? newIdx : null };
    });
  };
  // When switching dates, always open the first occasion if none is selected
  const handleDateAccordion = (date) => {
    setOpenDate(date === openDate ? null : date);
    setOpenOccasion((prev) => ({ ...prev, [date]: 0 }));
  };
  // Handle occasion field change
  const handleOccasionChange = (date, idx, field, value) => {
    setOccasions((prev) => {
      const updated = [...prev[date]];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, [date]: updated };
    });
  };
  // Handle menu selection
  const handleMenuChange = (date, idx, dishId) => {
    setOccasions((prev) => {
      const updated = [...prev[date]];
      const menu = updated[idx].menu.includes(dishId)
        ? updated[idx].menu.filter((id) => id !== dishId)
        : [...updated[idx].menu, dishId];
      updated[idx] = { ...updated[idx], menu };
      return { ...prev, [date]: updated };
    });
  };
  // Handle facilities selection
  const handleFacilitiesChange = (date, idx, facility) => {
    setOccasions((prev) => {
      const updated = [...prev[date]];
      const facilitiesArr = updated[idx].facilities.includes(facility)
        ? updated[idx].facilities.filter((f) => f !== facility)
        : [...updated[idx].facilities, facility];
      updated[idx] = { ...updated[idx], facilities: facilitiesArr };
      return { ...prev, [date]: updated };
    });
  };

  // Filtered dishes for menu selection
  const filteredDishes = dishes.filter((d) => {
    const catMatch = !menuFilter.category || d.categoryId === menuFilter.category;
    const subcatMatch = !menuFilter.subcategory || d.subcategoryId === menuFilter.subcategory;
    const searchMatch = !menuFilter.search || d.name.toLowerCase().includes(menuFilter.search.toLowerCase());
    return catMatch && subcatMatch && searchMatch;
  });

  // Save handler
  const handleSave = () => {
    alert("Menu saved! (Check console for data)");
    console.log("Occasions:", occasions);
  };

  const bookingDetails = { customerName: 'John Doe', eventName: 'Wedding Reception', venue: 'Grand Hall, City Center' };

  return (

        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
    
       
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-bold">Add Menu</h2>
              
                 <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => navigate("/bookings")}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Bookings
              </Button>
            </div>
            {/* Date Accordions */}
            <div className="space-y-4">
              {bookingDates.map((date, dIdx) => (
                <div key={date} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-blue-700 dark:text-blue-300 focus:outline-none"
                    onClick={() => handleDateAccordion(date)}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {openDate === date ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openDate === date && (
                    <div className="p-4 pt-0">
                      {/* Occasion Tabs/Accordions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {occasions[date].map((occ, idx) => (
                          <div key={idx} className="flex items-center">
                            <button
                              type="button"
                              className={`flex items-center px-4 py-2 rounded-t-lg border-b-2 font-medium transition-colors ${openOccasion[date] === idx ? 'bg-blue-100 dark:bg-blue-800 border-blue-600 text-blue-700 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-700 dark:text-gray-300'}`}
                              onClick={() => setOpenOccasion((prev) => ({ ...prev, [date]: idx }))}
                            >
                              <span>Occasion {idx + 1}</span>
                              {occasions[date].length > 1 && (
                                <button
                                  type="button"
                                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                  onClick={e => { e.stopPropagation(); removeOccasion(date, idx); }}
                                  tabIndex={-1}
                                  aria-label="Delete Occasion"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              )}
                            </button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          onClick={() => addOccasion(date)}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Occasion
                        </Button>
                      </div>
                      {/* Occasion Accordion/Form */}
                      {occasions[date].map((occ, idx) => (
                        <div key={idx} className={`transition-all duration-300 ${openOccasion[date] === idx ? 'block' : 'hidden'}`}>
                          <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-blue-700 dark:text-blue-300">Occasion {idx + 1}</span>
                              {occasions[date].length > 1 && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeOccasion(date, idx)}
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label>Occasion Name</Label>
                                <select
                                  className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white dark:bg-gray-800 mt-1"
                                  value={occ.occasionName}
                                  onChange={e => handleOccasionChange(date, idx, "occasionName", e.target.value)}
                                >
                                  <option value="">Select Occasion</option>
                                  {occasionNames.map((o, i) => (
                                    <option key={i} value={o}>{o}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Meal Type</Label>
                                <select
                                  className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white dark:bg-gray-800 mt-1"
                                  value={occ.mealType}
                                  onChange={e => handleOccasionChange(date, idx, "mealType", e.target.value)}
                                >
                                  <option value="">Select Meal Type</option>
                                  {mealTypes.map((m, i) => (
                                    <option key={i} value={m}>{m}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={occ.startTime}
                                  onChange={e => handleOccasionChange(date, idx, "startTime", e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={occ.endTime}
                                  onChange={e => handleOccasionChange(date, idx, "endTime", e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <Label>No. of Guests</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={occ.guests}
                                  onChange={e => handleOccasionChange(date, idx, "guests", e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <Label>Serving Type</Label>
                                <select
                                  className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white dark:bg-gray-800 mt-1"
                                  value={occ.servingType}
                                  onChange={e => handleOccasionChange(date, idx, "servingType", e.target.value)}
                                >
                                  <option value="">Select Serving Type</option>
                                  {servingTypes.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <Label>Exact Venue</Label>
                                <Input
                                  type="text"
                                  value={occ.exactVenue}
                                  onChange={e => handleOccasionChange(date, idx, "exactVenue", e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <Label>Facilities</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {facilities.map((f, i) => (
                                    <label key={i} className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={occ.facilities.includes(f)}
                                        onChange={() => handleFacilitiesChange(date, idx, f)}
                                        className="accent-blue-600"
                                      />
                                      {f}
                                    </label>
                                  ))}
                                </div>
                              </div>
                              {/* Menu Selection */}
                              <div className="sm:col-span-2">
                                <Label>Menu (Dishes)</Label>
                                <div className="flex flex-wrap gap-2 mb-2 mt-1">
                                  <select
                                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white dark:bg-gray-800"
                                    value={menuFilter.category}
                                    onChange={e => setMenuFilter(f => ({ ...f, category: e.target.value, subcategory: "" }))}
                                  >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                      <option key={cat.id} value={cat.categoryId || cat.id}>{cat.name}</option>
                                    ))}
                                  </select>
                                  <select
                                    className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white dark:bg-gray-800"
                                    value={menuFilter.subcategory}
                                    onChange={e => setMenuFilter(f => ({ ...f, subcategory: e.target.value }))}
                                    disabled={!menuFilter.category}
                                  >
                                    <option value="">All Subcategories</option>
                                    {subcategories.filter(sc => !menuFilter.category || sc.categoryId === menuFilter.category).map((sc) => (
                                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                                    ))}
                                  </select>
                                  <Input
                                    type="text"
                                    placeholder="Search dish..."
                                    value={menuFilter.search}
                                    onChange={e => setMenuFilter(f => ({ ...f, search: e.target.value }))}
                                    className="w-40"
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                  {filteredDishes.length === 0 && (
                                    <span className="text-gray-400 italic">No dishes found.</span>
                                  )}
                                  {filteredDishes.map((dish) => (
                                    <label key={dish.id} className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={occ.menu.includes(dish.id)}
                                        onChange={() => handleMenuChange(date, idx, dish.id)}
                                        className="accent-blue-600"
                                      />
                                      {dish.name}
                                    </label>
                                  ))}
                                </div>
                                {occ.menu.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Selected: {occ.menu.length} dish{occ.menu.length > 1 ? "es" : ""}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
             
              <Button
                className="bg-green-600 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all text-base md:text-lg mr-2"
                onClick={() => generateMenuPDF({ 
                  occasions, 
                  bookingDetails: {
                    customerName: 'John Doe',
                    eventName: 'Wedding Reception',
                    venue: 'Grand Hall, City Center'
                  }
                })}
              >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8m12 4V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z" /></svg>
                Print Menu
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all text-base md:text-lg"
                onClick={handleSave}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      
  );
}

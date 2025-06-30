import { useState ,useEffect} from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate ,useParams } from "react-router-dom";
import { protectedGetApi } from "@/services/nodeapi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/services/nodeconfig";
import { Plus, Trash, ArrowLeft, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from 'jspdf';



import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DateTabContent } from "./DateTabContent";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
function drawDetailsTable(doc, y, rows) {
  const colX = [20, 60, 110, 150];
  rows.forEach((row, i) => {
    colX.forEach((x, j) => {
      doc.setFontSize(9);
      doc.text(row[j] || '-', x, y);
    });
    y += 6;
  });
  return y;
}

function generateMenuPDF({ occasions, bookingDetails }) {
  const doc = new jsPDF('p', 'mm', 'a4');

  const customer = bookingDetails?.customerName || 'श्रीमान अशोक जी टंडन केसव जी';
  const venue = bookingDetails?.venue || 'अनन्ता रिसोर्ट';
  const mobile1 = bookingDetails?.mobile1 || '9252490297';
  const mobile2 = bookingDetails?.mobile2 || '8871076396';

  let y = 15;

  // Header: Title + tagline
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  doc.text('A Complete Food Solution', 105, y, { align: 'center' });

  y += 7;
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('Shringi Food Services', 105, y, { align: 'center' });

  y += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Impressive Selection For Any Occasion', 105, y, { align: 'center' });

  y += 10;
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277); // outer border

  // Customer Info Table
  y += 4;
  doc.setFontSize(10);
  doc.text(`Name Of Customer :-`, 12, y);
  doc.text(customer, 60, y);
  doc.text(`M.N.:`, 150, y);
  doc.text(mobile1, 160, y);
  y += 6;
  doc.text(`Venue :-`, 12, y);
  doc.text(venue, 60, y);
  doc.text(mobile2, 160, y);

  // Divider
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text('Menu:', 105, y, { align: 'center' });

  y += 5;

  // Loop Dates & Occasions
  Object.keys(occasions).forEach(date => {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(formatDateHindi(date), 105, y, { align: 'center' });
    y += 4;

    occasions[date].forEach((occ) => {
      const occLabel = `${occ.occasionName || '-'} ${occ.guests || ''}आदमी ${formatTimeHindi(occ.startTime)}`;
      doc.setFont(undefined, 'normal');
      doc.text(`• ${occLabel}`, 12, y);
      y += 4;

      const dishList = (occ.menu.length ? occ.menu : ['राजभोग', 'गुलाब जामुन', 'पनीर']).join(' , ');
      const lines = doc.splitTextToSize(dishList, 180);
      lines.forEach(line => {
        doc.text(`- ${line}`, 16, y);
        y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
      });

      y += 2;
    });

    y += 4;
  });

  // Footer
  y = 270;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Om Prakash Shringi', 20, y);
  doc.text('Chandra Shekhar Shringi', 85, y);
  doc.text('Naval Shringi', 160, y);
  y += 5;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('94143-94181', 25, y);
  doc.text('96944-87748', 95, y);
  doc.text('98282-89454', 165, y);

  y += 8;
  doc.setFont(undefined, 'bolditalic');
  doc.setFontSize(11);
  doc.text('Batak Bheru Para , Nahar Ka Chottha Bundi(Raj.)', 105, y, { align: 'center' });

  doc.save('Shringi_Menu.pdf');
}
function formatDateHindi(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('hi-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTimeHindi(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  return `${h}:${m} बजे`;
}


export default function AddMenu() {
  
  const navigate = useNavigate();
  const { id } = useParams();
 const [bookingDates, setBookingDates] = useState([]);
const [occasions, setOccasions] = useState({});
const [selectedDate, setSelectedDate] = useState("");


 useEffect(() => {
  const fetchOccasionsOfBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(`${config.AddBooking}/${id}/occasions`, token);
      const occasionList = response.data || [];

      const grouped = {};

      occasionList.forEach((item) => {
        const date = item.date.split("T")[0]; // extract YYYY-MM-DD
        if (!grouped[date]) grouped[date] = [];

        grouped[date].push({
          ...item,
          menu: [],
          mealType: "",
          startTime: "",
          endTime: "",
          guests: "",
          servingType: "",
          exactVenue: "",
          facilities: [],
        });
      });

      const dates = Object.keys(grouped);
      setBookingDates(dates);
      setOccasions(grouped);
      if (dates.length > 0) setSelectedDate(dates[0]); // 🔥 auto-select first date
    } catch (err) {
      console.error("Failed to fetch booking occasions:", err);
    }
  };

  fetchOccasionsOfBooking();
}, [id]);


  const addOccasion = (date) => {
    setOccasions((prev) => ({
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
    }));
  };

  const removeOccasion = (date, idx) => {
    setOccasions((prev) => {
      const updated = prev[date].filter((_, i) => i !== idx);
      if(updated.length === 0) {
        return {
             ...prev, 
             [date]: [{
                occasionName: "", date, mealType: "", startTime: "", endTime: "",
                guests: "", menu: [], servingType: "", exactVenue: "", facilities: [],
             }]
        };
      }
      return { ...prev, [date]: updated };
    });
  };

  const handleOccasionChange = (date, idx, field, value) => {
    setOccasions((prev) => {
      const updated = [...prev[date]];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, [date]: updated };
    });
  };

  const handleMenuChange = (date, idx, dishName) => {
    setOccasions((prev) => {
      const updated = [...prev[date]];
      const menu = updated[idx].menu.includes(dishName)
        ? updated[idx].menu.filter((name) => name !== dishName)
        : [...updated[idx].menu, dishName];
      updated[idx] = { ...updated[idx], menu };
      return { ...prev, [date]: updated };
    });
  };

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

  const handleSave = () => {
    console.log("Saving data:", occasions);
    generateMenuPDF({ occasions, bookingDetails: {} });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric'
    });
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen pb-24 sm:pb-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Add Menu</h1>
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
            </Button>
        </div>

        {/* Desktop Tabs (sm and up) */}
        <div className="hidden sm:block">
       <Tabs value={selectedDate} onValueChange={setSelectedDate} className="w-full">
              <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsList className="flex flex-nowrap w-max rounded-none border-b bg-transparent p-0">
                      {bookingDates.map(date => (
                          <TabsTrigger 
                              key={date} 
                              value={date} 
                              className="relative flex-shrink-0 h-11 rounded-none border-b-2 border-transparent bg-transparent px-3 sm:px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none hover:text-blue-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
                          >
                              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{formatDate(date)}</span>
                          </TabsTrigger>
                      ))}
                  </TabsList>
              </div>
              {bookingDates.map(date => (
                  <TabsContent 
                      key={date} 
                      value={date} 
                      className="bg-gray-50/60 p-2 sm:p-4 rounded-b-lg mt-0 border-x border-b"
                  >
                      <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 px-2 sm:px-0">
                          Editing Menu for: <span className="text-blue-700">{formatDate(date)}</span>
                      </h2>
                      <DateTabContent
                          date={date}
                          occasionsForDate={occasions[date]}
                          addOccasion={addOccasion}
                          removeOccasion={removeOccasion}
                          handleOccasionChange={handleOccasionChange}
                          handleFacilitiesChange={handleFacilitiesChange}
                          handleMenuChange={handleMenuChange}
                          occasionNames={occasionNames}
                          mealTypes={mealTypes}
                          servingTypes={servingTypes}
                          facilities={facilities}
                          categories={categories}
                          subcategories={subcategories}
                          dishes={dishes}
                      />
                  </TabsContent>
              ))}
          </Tabs>
        </div>

        {/* Mobile Accordion (below sm) */}
        <div className="block sm:hidden">
          <Accordion type="single" collapsible className="w-full">
            {bookingDates.map((date, idx) => (
              <AccordionItem value={`date-${date}`} key={date} className="border-t">
                <AccordionTrigger className="p-3 bg-white hover:bg-gray-50 rounded-md text-base font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{formatDate(date)}</span>
                </AccordionTrigger>
                <AccordionContent className="p-2 bg-gray-50/60">
                  <DateTabContent
                    date={date}
                    occasionsForDate={occasions[date]}
                    addOccasion={addOccasion}
                    removeOccasion={removeOccasion}
                    handleOccasionChange={handleOccasionChange}
                    handleFacilitiesChange={handleFacilitiesChange}
                    handleMenuChange={handleMenuChange}
                    occasionNames={occasionNames}
                    mealTypes={mealTypes}
                    servingTypes={servingTypes}
                    facilities={facilities}
                    categories={categories}
                    subcategories={subcategories}
                    dishes={dishes}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Save Button: sticky on mobile, normal on desktop */}
       <div className="flex flex-col sm:flex-row justify-end gap-2 mt-8">
  <Button
    onClick={() => generateMenuPDF({ occasions, bookingDetails: {
      customerName: 'John Doe',
      eventName: 'Wedding Reception',
      venue: 'Lawn B'
    }})}
    variant="outline"
    size="lg"
    className="text-blue-600 border-blue-600 hover:bg-blue-50"
  >
    Print Menu
  </Button>

  <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
    Save Menu
  </Button>
</div>

    </div>
  );
}

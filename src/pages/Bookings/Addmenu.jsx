import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Trash, ArrowLeft } from "lucide-react";

export default function AddMenu() {
  const navigate = useNavigate();
  const bookingData = {
    bookingDateFrom: "2025-03-10",
    bookingDateTo: "2025-03-11",
    noOfDays: "2",
  };

  // Generate dates dynamically
  const generateDates = (from, to) => {
    const startDate = new Date(from);
    const endDate = new Date(to);
    let dates = [];
    while (startDate <= endDate) {
      dates.push(new Date(startDate).toISOString().split("T")[0]); // Format YYYY-MM-DD
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  };

  const mealTypes = ["Breakfast", "Lunch", "HighTea", "Dinner", "Packing"];
  const bookingDays = generateDates(
    bookingData.bookingDateFrom,
    bookingData.bookingDateTo
  );

  const [peopleCount, setPeopleCount] = useState(
    bookingDays.reduce((acc, date) => {
      acc[date] = mealTypes.reduce((meals, meal) => {
        meals[meal] = 0; // default value
        return meals;
      }, {});
      return acc;
    }, {})
  );

  // Categories Array
  const categories = [
    { id: "1", name: "Sweets" },
    { id: "2", name: "Namkeen" },
    { id: "3", name: "Beverages" },
    { id: "4", name: "Main Course" },
  ];

  // Items Array
  const items = [
    { id: "101", categoryId: "1", name: "Gulab Jamun" },
    { id: "102", categoryId: "1", name: "Rasgulla" },
    { id: "103", categoryId: "1", name: "Kaju Katli" },

    { id: "201", categoryId: "2", name: "Samosa" },
    { id: "202", categoryId: "2", name: "Pakora" },

    { id: "301", categoryId: "3", name: "Tea" },
    { id: "302", categoryId: "3", name: "Coffee" },

    { id: "401", categoryId: "4", name: "Paneer Butter Masala" },
    { id: "402", categoryId: "4", name: "Dal Makhani" },
  ];

  //   const categories = Object.keys(categoryItems);
  const defaultItemsByDate = {
    "2025-03-10": {
      Breakfast: [{ category: "Beverages", item: "Tea" }],
      Lunch: [{ category: "MainCourse", item: "Dal Makhani" }],
      HighTea: [{ category: "Beverages", item: "Coffee" }],
      Dinner: [{ category: "MainCourse", item: "Paneer Butter Masala" }],
      Packing: [{ category: "Namkeen", item: "Mathri" }],
    },
    "2025-03-11": {
      Breakfast: [{ category: "Beverages", item: "Milk" }],
      Lunch: [{ category: "MainCourse", item: "Chole Bhature" }],
      HighTea: [{ category: "Beverages", item: "Green Tea" }],
      Dinner: [{ category: "MainCourse", item: "Butter Chicken" }],
      Packing: [{ category: "Namkeen", item: "Mathri" }],
    },
  };

  // Initialize menu with different defaults per date
  const [menu, setMenu] = useState(
    bookingDays.reduce((acc, date) => {
      acc[date] = mealTypes.reduce((meals, meal) => {
        meals[meal] = defaultItemsByDate[date]?.[meal] || [];
        return meals;
      }, {});
      return acc;
    }, {})
  );

  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedItem, setSelectedItem] = useState({});

  // Add Menu Item
  const addMenuItem = (date, meal) => {
    if (selectedCategory[date]?.[meal] && selectedItem[date]?.[meal]) {
      setMenu((prevMenu) => ({
        ...prevMenu,
        [date]: {
          ...prevMenu[date],
          [meal]: [
            ...prevMenu[date][meal],
            {
              category: selectedCategory[date][meal],
              item: selectedItem[date][meal],
            },
          ],
        },
      }));
    }
  };

  // Remove Menu Item
  const removeMenuItem = (date, meal, index) => {
    setMenu((prevMenu) => {
      const updatedMenu = { ...prevMenu };
      updatedMenu[date][meal] = updatedMenu[date][meal].filter(
        (_, i) => i !== index
      );
      return updatedMenu;
    });
  };

  // Save Menu Function
  const handleSubmit = () => {
    console.log("Final Menu:", menu);
    console.log("People Count:", peopleCount);
    alert("Menu Saved Successfully! ✅");
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              Add Menu for Booking
            </h1>
            <Button
              className="flex items-center bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/bookings")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {bookingDays.map((date, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              {/* Date Label */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-2">
                {date}
              </h3>

              {/* Meal Types Inside Date */}
              <div className="p-3 space-y-3">
                {mealTypes.map((meal, mealIndex) => (
                  <div key={mealIndex}>
                    {/* Meal Type Header - Collapsible */}

                    <div
                      className="flex justify-between items-center cursor-pointer bg-blue-100 dark:bg-gray-700 p-2 rounded-md transition-all duration-300 ease-in-out"
                      onClick={() =>
                        setExpandedMeal((prev) => ({
                          ...prev,
                          [date]: prev[date] === meal ? null : meal,
                        }))
                      }
                    >
                      <h4 className="text-md font-semibold text-gray-900 dark:text-gray-200">
                        {meal}
                      </h4>
                      <div >
                       
                        <Input
                          type="number"
                          // min={0}
                          placeholder={"Enter No. OF People"}
                          value={peopleCount[date][meal] }
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setPeopleCount((prev) => ({
                              ...prev,
                              [date]: {
                                ...prev[date],
                                [meal]: value,
                              },
                            }));
                          }}
                          className="w-full rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {expandedMeal[date] === meal ? (
                        <Minus className="w-5 h-5 transition-transform transform rotate-180 duration-300" />
                      ) : (
                        <Plus className="w-5 h-5 transition-transform transform rotate-0 duration-300" />
                      )}
                    </div>

                    {/* Category & Item Inputs (Smooth Opening) */}
                    <div
                      className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                        expandedMeal[date] === meal
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-3 space-y-3">
                        {/* Dropdowns & Add Button in a Row */}
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                          <div className="flex w-full md:w-4/5 gap-4">
                            {/* Category Dropdown */}
                            <div className="w-1/2">
                              <Label>Category</Label>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedCategory((prev) => ({
                                    ...prev,
                                    [date]: { ...prev[date], [meal]: value },
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-blue-500">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md max-h-60 overflow-auto">
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id} // Store ID instead of name
                                      className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-200 cursor-pointer transition-all duration-150 rounded-md"
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Item Name Dropdown */}
                            <div className="w-1/2">
                              <Label>Item Name</Label>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedItem((prev) => ({
                                    ...prev,
                                    [date]: { ...prev[date], [meal]: value },
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-blue-500">
                                  <SelectValue placeholder="Select Item" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md max-h-60 overflow-auto">
                                  {items
                                    .filter(
                                      (item) =>
                                        item.categoryId ===
                                        selectedCategory[date]?.[meal]
                                    )
                                    .map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.id} // Store ID instead of name
                                        className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-200 cursor-pointer transition-all duration-150 rounded-md"
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Add Button (20% width) */}
                          <div className="w-full md:w-1/5 flex items-end">
                            <Button
                              className="w-full flex items-center justify-center bg-red-300 hover:bg-red-500 rounded-lg py-2"
                              onClick={() => addMenuItem(date, meal)}
                            >
                              <Plus className="w-5 h-5 mr-2" />
                              Add Item
                            </Button>
                          </div>
                        </div>

                        {/* Display Added Items */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {menu[date][meal].map((entry, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-400 text-black font-bold px-2 py-1 rounded-md flex items-center gap-1"
                            >
                              {entry.item}
                              <button
                                onClick={() => removeMenuItem(date, meal, idx)}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 w-full mt-4"
          >
            Save Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

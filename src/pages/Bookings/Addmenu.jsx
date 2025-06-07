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
import { Plus, Minus, Trash, ArrowLeft, Calendar, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Add Menu for Booking
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Customize your menu for each day and meal
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => navigate("/bookings")}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Bookings
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {bookingDays.map((date, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                </div>

                <div className="space-y-4">
                  {mealTypes.map((meal, mealIndex) => (
                    <div key={mealIndex} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                        onClick={() =>
                          setExpandedMeal((prev) => ({
                            ...prev,
                            [date]: prev[date] === meal ? null : meal,
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {meal}
                          </h4>
                          {expandedMeal[date] === meal ? (
                            <Minus className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-500" />
                          )}
                        </div>

                        <div className="w-full sm:w-48">
                          <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                            Number of People
                          </Label>
                          <div className="relative">
                            <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              min="0"
                              placeholder="Enter count"
                              value={peopleCount[date][meal]}
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
                              className="pl-10 w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedMeal[date] === meal
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                                  Category
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    setSelectedCategory((prev) => ({
                                      ...prev,
                                      [date]: { ...prev[date], [meal]: value },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                                  Item Name
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    setSelectedItem((prev) => ({
                                      ...prev,
                                      [date]: { ...prev[date], [meal]: value },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="Select Item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {items
                                      .filter(
                                        (item) =>
                                          item.categoryId ===
                                          selectedCategory[date]?.[meal]
                                      )
                                      .map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={item.id}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="flex items-end">
                              <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
                                onClick={() => addMenuItem(date, meal)}
                              >
                                <Plus className="w-4 h-4" />
                                Add Item
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {menu[date][meal].map((entry, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                              >
                                {entry.item}
                                <button
                                  onClick={() => removeMenuItem(date, meal, idx)}
                                  className="hover:text-red-500 transition-colors"
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

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                Save Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

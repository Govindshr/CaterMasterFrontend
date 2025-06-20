import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Trash } from "lucide-react";

// Assuming these are passed as props from the main component
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
const facilities = [
  "LED Counter",
  "Pan Counter",
  "Live Chaat",
  "DJ",
  "Flower Decor",
];
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

export function OccasionCard({
  occasion,
  idx,
  date,
  handleOccasionChange,
  handleFacilitiesChange,
  handleMenuChange,
  removeOccasion,
  menuFilter,
  setMenuFilter,
}) {
  const filteredSubcategories = subcategories.filter(
    (sc) => sc.categoryId === menuFilter.category
  );

  const filteredDishes = dishes.filter(
    (dish) =>
      (!menuFilter.category || dish.categoryId === menuFilter.category) &&
      (!menuFilter.subcategory || dish.subcategoryId === menuFilter.subcategory) &&
      dish.name.toLowerCase().includes(menuFilter.search.toLowerCase())
  );

  const inputStyle = "bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50";
  const selectItemStyle = "focus:bg-green-100/50 focus:text-green-900";

  return (
    <Card className="border-l-4 border-green-600 bg-transparent shadow-none">
      <CardContent className="pt-0 pl-2 sm:pl-4 md:pl-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div className="space-y-1 mt-3">
            <Label htmlFor={`occasionName-${date}-${idx}`}>Occasion Name</Label>
            <Select
              onValueChange={(value) =>
                handleOccasionChange(date, idx, "occasionName", value)
              }
              value={occasion.occasionName}
            >
              <SelectTrigger id={`occasionName-${date}-${idx}`} className={inputStyle}>
                <SelectValue placeholder="Select Occasion" />
              </SelectTrigger>
              <SelectContent>
                {occasionNames.map((name) => (
                  <SelectItem key={name} value={name} className={selectItemStyle}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 mt-3">
            <Label htmlFor={`mealType-${date}-${idx}`}>Meal Type</Label>
            <Select
              onValueChange={(value) =>
                handleOccasionChange(date, idx, "mealType", value)
              }
              value={occasion.mealType}
            >
              <SelectTrigger id={`mealType-${date}-${idx}`} className={inputStyle}>
                <SelectValue placeholder="Select Meal Type" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map((type) => (
                  <SelectItem key={type} value={type} className={selectItemStyle}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`startTime-${date}-${idx}`}>Start Time</Label>
            <div className="relative">
                <Input
                id={`startTime-${date}-${idx}`}
                type="time"
                className={`${inputStyle} pr-10`}
                value={occasion.startTime}
                onChange={(e) =>
                    handleOccasionChange(date, idx, "startTime", e.target.value)
                }
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`endTime-${date}-${idx}`}>End Time</Label>
            <div className="relative">
                <Input
                id={`endTime-${date}-${idx}`}
                type="time"
                className={`${inputStyle} pr-10`}
                value={occasion.endTime}
                onChange={(e) =>
                    handleOccasionChange(date, idx, "endTime", e.target.value)
                }
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`guests-${date}-${idx}`}>No. of Guests</Label>
            <Input
              id={`guests-${date}-${idx}`}
              type="number"
              className={inputStyle}
              value={occasion.guests}
              onChange={(e) =>
                handleOccasionChange(date, idx, "guests", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`servingType-${date}-${idx}`}>Serving Type</Label>
            <Select
              onValueChange={(value) =>
                handleOccasionChange(date, idx, "servingType", value)
              }
              value={occasion.servingType}
            >
              <SelectTrigger id={`servingType-${date}-${idx}`} className={inputStyle}>
                <SelectValue placeholder="Select Serving Type" />
              </SelectTrigger>
              <SelectContent>
                {servingTypes.map((type) => (
                  <SelectItem key={type} value={type} className={selectItemStyle}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2 space-y-1">
            <Label htmlFor={`exactVenue-${date}-${idx}`}>Exact Venue</Label>
            <Input
              id={`exactVenue-${date}-${idx}`}
              className={inputStyle}
              value={occasion.exactVenue}
              onChange={(e) =>
                handleOccasionChange(date, idx, "exactVenue", e.target.value)
              }
            />
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-6">
          <Label className="font-semibold text-base">Facilities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
            {facilities.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={`${date}-${idx}-${facility}`}
                  checked={occasion.facilities.includes(facility)}
                  onCheckedChange={() =>
                    handleFacilitiesChange(date, idx, facility)
                  }
                />
                <Label
                  htmlFor={`${date}-${idx}-${facility}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {facility}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Menu (Dishes) */}
        <div>
          <Label className="font-semibold text-base">Menu (Dishes)</Label>
          <div className="mt-2 p-4 border rounded-lg bg-slate-50/70">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <Select
                onValueChange={(value) =>
                  setMenuFilter({ ...menuFilter, category: value, subcategory: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setMenuFilter({ ...menuFilter, subcategory: value })
                }
                disabled={!menuFilter.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search dish..."
                value={menuFilter.search}
                onChange={(e) =>
                  setMenuFilter({ ...menuFilter, search: e.target.value })
                }
              />
            </div>
            <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pr-2">
              {filteredDishes.map((dish) => (
                <div key={dish.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${date}-${idx}-${dish.id}`}
                    checked={occasion.menu.includes(dish.name)}
                    onCheckedChange={() =>
                      handleMenuChange(date, idx, dish.name)
                    }
                  />
                  <Label
                    htmlFor={`${date}-${idx}-${dish.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dish.name}
                  </Label>
                </div>
              ))}
              {filteredDishes.length === 0 && (
                <p className="text-sm text-gray-500 sm:col-span-3 lg:col-span-4 text-center">
                  No dishes found.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
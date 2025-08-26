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
import { useEffect, useState } from "react";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { useTranslation } from "react-i18next"; // for i18n support

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
  const { i18n } = useTranslation();
  const [eventOptions, setEventOptions] = useState([]);
  const [servingOptions, setServingOptions] = useState([]);
  const [occasionFacilities, setOccasionFacilities] = useState([]);
  const [dishes, setDishes] = useState([]);

  const filteredSubcategories = subcategories.filter((sc) => sc.categoryId === menuFilter.category);
  const filteredDishes = dishes;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await protectedGetApi(config.GetEvents, token);
        if (res.success) {
          setEventOptions(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, [i18n.language]);

  useEffect(() => {
    const fetchServingTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await protectedGetApi(config.ServingTypes, token);
        if (res.success) setServingOptions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch serving types", err);
      }
    };

    fetchServingTypes();
  }, [i18n.language]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await protectedGetApi(config.GetFacilities, token);
        const filtered = (res?.data || []).filter(
          (facility) => facility.scope === "event" || facility.scope === "both"
        );
        setOccasionFacilities(filtered);
      } catch (error) {
        console.error("Error fetching occasion facilities:", error);
      }
    };

    fetchFacilities();
  }, [i18n.language]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await protectedGetApi(`${config.GetDishes}?limit=500`, token);
        if (res.success) {
          setDishes(res.data?.dishes || []);
        }
      } catch (err) {
        console.error("Failed to fetch dishes", err);
      }
    };

    fetchDishes();
  }, [i18n.language]);

  const inputStyle = "bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50";
  const selectItemStyle = "focus:bg-green-100/50 focus:text-green-900";

  return (
    <Card className="border-l-4 border-green-600 bg-transparent shadow-none">
      <CardContent className="pt-0 pl-2 sm:pl-4 md:pl-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div className="space-y-1 mt-3">
            <Label htmlFor={`occasionName-${date}-${idx}`}>Event Name</Label>
            <Select
              onValueChange={(value) => {
                const label = eventOptions.find((e) => e._id === value)?.name?.[i18n.language] || eventOptions.find((e) => e._id === value)?.name?.en || '';
                handleOccasionChange(date, idx, "occasionName", value);
                handleOccasionChange(date, idx, "occasionNameLabel", label);
              }}
              value={occasion.occasionName}
            >
              <SelectTrigger id={`occasionName-${date}-${idx}`} className={inputStyle}>
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {console.log("eventOptions",eventOptions)}
                {eventOptions.map((event) => (
                  <SelectItem key={event._id} value={event._id} className={selectItemStyle}>
                    {event.name?.[i18n.language] || event.name?.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 mt-3">
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
                {servingOptions.map((type) => (
                  <SelectItem key={type._id} value={type._id} className={selectItemStyle}>
                    {type.name?.[i18n.language] || type.name?.en}
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
        <div className="space-y-1 mt-4">
          <Label>Extra Facilities</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {occasionFacilities.map((facility) => (
              <label
                key={facility._id}
                className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={`facilities-${idx}`}
                  value={facility._id}
                  checked={occasion.facilities?.includes(facility._id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleOccasionChange(date, idx, "facilities", checked
                      ? [...(occasion.facilities || []), facility._id]
                      : (occasion.facilities || []).filter((id) => id !== facility._id));
                  }}
                />
                {facility.name?.[i18n.language] || facility.name?.en}
              </label>
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
                    <SelectItem key={cat._id} value={cat._id}>
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
                    id={`${date}-${idx}-${dish._id}`}
                    checked={occasion.menu.includes(dish._id)}
                    onCheckedChange={() =>
                      handleMenuChange(date, idx, dish._id)
                    }
                  />
                  <Label htmlFor={`${date}-${idx}-${dish._id}`}>
                    {dish.name?.[i18n.language] || dish.name?.en}
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
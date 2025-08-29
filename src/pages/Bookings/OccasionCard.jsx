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
import { Clock, Trash ,Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { useTranslation } from "react-i18next"; // for i18n support
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const filteredSubcategories = subcategories.filter((sc) => sc.categoryId === menuFilter.category);
  const filteredDishes = dishes;
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

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
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishCategories, token);
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishSubCategories, token);
      if (res.success) setSubcategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  fetchCategories();
  fetchSubCategories();
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

  const clearFilters = () => {
  setMenuFilter({ category: "", subcategory: "", search: "" });
};

  useEffect(() => {
   const fetchDishes = async () => {
     try {
       const token = localStorage.getItem("token");
       const params = new URLSearchParams({
         limit: 500, // or smaller if you want
         search: menuFilter.search || "",
         categoryId: menuFilter.category || "",
         subCategoryId: menuFilter.subcategory || "",
       });
       const res = await protectedGetApi(`${config.GetDishes}?${params}`, token);
       if (res.success) {
         setDishes(res.data?.dishes || []);
       }
     } catch (err) {
       console.error("Failed to fetch dishes", err);
     }
   };
   fetchDishes();
 }, [i18n.language, menuFilter]);

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
               handleOccasionChange(date, idx, "occasionName", value)
              }}
              value={occasion.occasionName}
            >
              <SelectTrigger id={`occasionName-${date}-${idx}`} className={inputStyle}>
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
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

       

        {/* Menu (Dishes) */}
        <div className="mt-4">
  <Label className="font-semibold text-base">Menu (Dishes)</Label>
  <div className="mt-2 p-4 border rounded-lg bg-slate-50/70">

    {/* Mobile: Filters in bottom sheet */}
    <div className="md:hidden mb-3">
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-center gap-2">
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl p-4">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Category</Label>
              <Select
                value={menuFilter.category}
                onValueChange={(val) =>
                  setMenuFilter({ ...menuFilter, category: val, subcategory: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name?.[i18n.language] || cat.name?.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select
                value={menuFilter.subcategory}
                onValueChange={(val) =>
                  setMenuFilter({ ...menuFilter, subcategory: val })
                }
                disabled={!menuFilter.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories
                    .filter(
                      (s) => !menuFilter.category || s.categoryId === menuFilter.category
                    )
                    .map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name?.[i18n.language] || sub.name?.en}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search dish..."
                value={menuFilter.search}
                onChange={(e) =>
                  setMenuFilter({ ...menuFilter, search: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
            <SheetClose asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>

    {/* Desktop filters inline */}
    <div className="hidden md:grid md:grid-cols-3 gap-2 mb-4">
      <Select
        value={menuFilter.category}
        onValueChange={(val) =>
          setMenuFilter({ ...menuFilter, category: val, subcategory: "" })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name?.[i18n.language] || cat.name?.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={menuFilter.subcategory}
        onValueChange={(val) =>
          setMenuFilter({ ...menuFilter, subcategory: val })
        }
        disabled={!menuFilter.category}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Subcategories" />
        </SelectTrigger>
        <SelectContent>
          {subcategories
            .filter(
              (s) => !menuFilter.category || s.categoryId === menuFilter.category
            )
            .map((sub) => (
              <SelectItem key={sub._id} value={sub._id}>
                {sub.name?.[i18n.language] || sub.name?.en}
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

    {/* Active filters chips */}
    {(menuFilter.search || menuFilter.category || menuFilter.subcategory) && (
      <div className="flex flex-wrap items-center gap-2 justify-between mt-2">
        <div className="flex flex-wrap gap-2">
          {menuFilter.search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
              Name: {menuFilter.search}
              <button
                aria-label="clear search"
                onClick={() => setMenuFilter({ ...menuFilter, search: "" })}
              >
                ✕
              </button>
            </span>
          )}
          {menuFilter.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
              {categories.find((c) => c._id === menuFilter.category)?.name?.[
                i18n.language
              ] || "Category"}
              <button
                aria-label="clear category"
                onClick={() =>
                  setMenuFilter({ ...menuFilter, category: "", subcategory: "" })
                }
              >
                ✕
              </button>
            </span>
          )}
          {menuFilter.subcategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
              {subcategories.find((s) => s._id === menuFilter.subcategory)?.name?.[
                i18n.language
              ] || "Subcategory"}
              <button
                aria-label="clear subcategory"
                onClick={() =>
                  setMenuFilter({ ...menuFilter, subcategory: "" })
                }
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear all
        </Button>
      </div>
    )}

    {/* Dish List */}
    <div className="mt-4 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
 gap-4 pr-2">
      {filteredDishes.map((dish) => (
        <div key={dish._id} className="flex items-center space-x-2">
          <Checkbox
            id={`${date}-${idx}-${dish._id}`}
            checked={occasion.menu.includes(dish._id)}
            onCheckedChange={() => handleMenuChange(date, idx, dish._id)}
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


         {/* Facilities */}
      <div className="space-y-1 mt-4">
  <Label>Extra Facilities</Label>
  <div className="flex flex-col gap-2 mt-3 sm:flex-row sm:flex-wrap sm:gap-3">
    {occasionFacilities.map((facility) => (
      <label
        key={facility._id}
        className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer"
      >
        <input
          type="checkbox"
          name={`facilities-${idx}`}
          value={facility._id}
          checked={occasion.facilities?.includes(facility._id)}
          onChange={(e) => {
            const checked = e.target.checked;
            handleOccasionChange(
              date,
              idx,
              "facilities",
              checked
                ? [...(occasion.facilities || []), facility._id]
                : (occasion.facilities || []).filter((id) => id !== facility._id)
            );
          }}
        />
        {facility.name?.[i18n.language] || facility.name?.en}
      </label>
    ))}
  </div>
</div>

      </CardContent>
    </Card>
  );
}
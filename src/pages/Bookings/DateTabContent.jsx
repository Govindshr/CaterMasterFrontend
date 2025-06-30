import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OccasionCard } from "./OccasionCard";
import { Plus, Trash, Utensils } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export function DateTabContent({
  date,
  occasionsForDate,
  addOccasion,
  removeOccasion,
  handleOccasionChange,
  handleFacilitiesChange,
  handleMenuChange,
  occasionNames,
  mealTypes,
  servingTypes,
  facilities,
  categories,
  subcategories,
  dishes,
}) {
  const [activeOccasion, setActiveOccasion] = useState(`item-0`);
  const [menuFilters, setMenuFilters] = useState({});


  const handleAddOccasion = () => {
    addOccasion(date);
    setActiveOccasion(`item-${occasionsForDate.length}`);
  };

  const setMenuFilterForOccasion = (index, filter) => {
    setMenuFilters(prev => ({...prev, [index]: filter}));
  }

  return (
    <div>
      <div className="flex justify-end mb-4 px-1 sm:px-0">
          <Button onClick={handleAddOccasion} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
      </div>

      <Accordion type="single" collapsible className="w-full" value={activeOccasion} onValueChange={setActiveOccasion}>
        {occasionsForDate.map((occasion, idx) => (
            <AccordionItem value={`item-${idx}`} key={idx} className="border-t">
                <div className="flex justify-between items-center w-full gap-2 p-3 sm:p-4 bg-white rounded-md">
                  <AccordionTrigger className="flex-1 text-left hover:no-underline bg-transparent shadow-none">
                    <div className="flex items-center min-w-0">
                        <Utensils className="mr-3 h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-semibold text-base sm:text-lg text-left truncate mr-5">{`Event ${idx + 1}`}{occasion.occasionName && `: ${occasion.occasionName}`} </span>
                    </div>
                  </AccordionTrigger>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                          e.stopPropagation(); 
                          if(occasionsForDate.length > 1) {
                              removeOccasion(date, idx);
                          }
                      }}
                      className="hover:bg-red-100 rounded-full flex-shrink-0"
                      disabled={occasionsForDate.length <= 1}
                  >
                      <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <AccordionContent className="p-2 sm:p-4 border-t bg-white">
                    <OccasionCard
                        occasion={occasion}
                        idx={idx}
                        date={date}
                        handleOccasionChange={handleOccasionChange}
                        handleFacilitiesChange={handleFacilitiesChange}
                        handleMenuChange={handleMenuChange}
                        removeOccasion={removeOccasion}
                        menuFilter={menuFilters[idx] || { category: "", subcategory: "", search: "" }}
                        setMenuFilter={(filter) => setMenuFilterForOccasion(idx, filter)}
                        isOnlyOccasion={occasionsForDate.length === 1}
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
  );
} 
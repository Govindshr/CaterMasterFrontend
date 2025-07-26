import { useState ,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OccasionCard } from "./OccasionCard";
import { protectedPostApi ,protectedGetApi ,protectedDeleteApi ,protectedUpdateApi} from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import Swal from 'sweetalert2';
import { Plus, Trash, Utensils } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// ✅ Patch DateTabContent.js to allow adding new Event only after saving previous one

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
  const [activeOccasion, setActiveOccasion] = useState("item-0");
  const [menuFilters, setMenuFilters] = useState({});
  const [savedOccasionIndex, setSavedOccasionIndex] = useState(null);
const [savedEvents, setSavedEvents] = useState([]);
const [mergedOccasions, setMergedOccasions] = useState([]);
const [unsavedOccasions, setUnsavedOccasions] = useState([]);


const handleAddOccasion = () => {
  setUnsavedOccasions((prev) => [
    ...prev,
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
  ]);
  setSavedOccasionIndex(null);
  setActiveOccasion(`item-${mergedOccasions.length + unsavedOccasions.length}`);
};

 const handleSaveOccasion = async (idx, occasion) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      eventTypeId: occasion.occasionName, // already holds _id
      startTime: occasion.startTime,
      endTime: occasion.endTime,
      noOfGuests: Number(occasion.guests),
      servingTypeId: occasion.servingType,
      exactVenue: occasion.exactVenue,
      menu: occasion.menu.map((dishId) => ({
        dishId , // already assumed dishId here
        customGuestCount: Number(occasion.guests),
        notes: "Extra sweet", // optional: use dynamic notes if available
      })),
      facilities: occasion.facilities.map((facilityId) => ({
        facilityId,
        quantity: 2,           // placeholder: use actual input if needed
        customCost: 3000.0     // placeholder: use actual input if needed
      })),
      notes: occasion.notes || "Default Notes",
    };

// Find the matching Occasion ID based on the current date tab
const matchedOccasion = occasionsForDate[idx - mergedOccasions.length]; // might vary if structure changes
const occasionId = matchedOccasion?._id;

if (!occasionId) {
  alert("Cannot save event: missing occasionId");
  return;
}

const res = await protectedPostApi(
  `${config.CreateEvent(occasionId)}`,
  payload,
  token
);


    if (res.success) {
      setSavedOccasionIndex(idx);
      alert("Event saved successfully");
    } else {
      alert("Failed to save event");
    }
  } catch (err) {
    console.error(err);
    alert("Error while saving event");
  }
};

useEffect(() => {
  const fetchSavedEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      let mergedOccasions = [];

      for (const occasion of occasionsForDate) {
        if (!occasion._id) continue;

        const res = await protectedGetApi(
          `${config.GetOccasionsEvent(occasion._id)}`,
          token
        );

        if (res.success && Array.isArray(res.data)) {
          const transformed = res.data.map((event) => ({
            _id: event.occasionId, // same as occasion._id
            occasionName: event.eventTypeId?._id,
            startTime: event.startTime,
            endTime: event.endTime,
            guests: event.noOfGuests,
            servingType: event.servingTypeId?._id,
            exactVenue: event.exactVenue,
            menu: event.menu?.map((m) => m.dishId?._id) || [],
            facilities: event.facilities?.map((f) => f.facilityId?._id) || [],
            notes: event.notes,
            delete_id: event._id
          }));

          mergedOccasions = [...mergedOccasions, ...transformed];
        }
      }

      setMergedOccasions(mergedOccasions); // new state, see below
      setSavedOccasionIndex(mergedOccasions.length - 1);
    } catch (err) {
      console.error("Error fetching saved events:", err);
    }
  };

  fetchSavedEvents();
}, [date, savedOccasionIndex]);


  const setMenuFilterForOccasion = (index, filter) => {
    setMenuFilters((prev) => ({ ...prev, [index]: filter }));
  };

  const updateOccasionField = (index, field, value) => {
  if (index < mergedOccasions.length) {
    const updated = [...mergedOccasions];
    updated[index] = { ...updated[index], [field]: value };
    setMergedOccasions(updated);
  } else {
    const unsavedIndex = index - mergedOccasions.length;
    const updated = [...unsavedOccasions];
    updated[unsavedIndex] = { ...updated[unsavedIndex], [field]: value };
    setUnsavedOccasions(updated);
  }
};

const updateOccasionMenu = (index, dishId) => {
  const isMerged = index < mergedOccasions.length;
  const updated = isMerged ? [...mergedOccasions] : [...unsavedOccasions];
  const actualIdx = isMerged ? index : index - mergedOccasions.length;

  const menu = updated[actualIdx].menu.includes(dishId)
    ? updated[actualIdx].menu.filter((id) => id !== dishId)
    : [...updated[actualIdx].menu, dishId];

  updated[actualIdx] = { ...updated[actualIdx], menu };

  isMerged ? setMergedOccasions(updated) : setUnsavedOccasions(updated);
};

const updateOccasionFacilities = (index, facilityId) => {
  const isMerged = index < mergedOccasions.length;
  const updated = isMerged ? [...mergedOccasions] : [...unsavedOccasions];
  const actualIdx = isMerged ? index : index - mergedOccasions.length;

  const facilities = updated[actualIdx].facilities.includes(facilityId)
    ? updated[actualIdx].facilities.filter((id) => id !== facilityId)
    : [...updated[actualIdx].facilities, facilityId];

  updated[actualIdx] = { ...updated[actualIdx], facilities };

  isMerged ? setMergedOccasions(updated) : setUnsavedOccasions(updated);
};

const handleUpdateOccasion = async (idx, occasion) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      eventTypeId: occasion.occasionName,
      startTime: occasion.startTime,
      endTime: occasion.endTime,
      noOfGuests: Number(occasion.guests),
      servingTypeId: occasion.servingType,
      exactVenue: occasion.exactVenue,
      menu: occasion.menu.map((dishId) => ({
        dishId,
        customGuestCount: Number(occasion.guests),
        notes: occasion.notes || "",
      })),
      facilities: occasion.facilities.map((facilityId) => ({
        facilityId,
        quantity: 2,
        customCost: 3000.0,
      })),
      notes: occasion.notes || "Updated via UI",
    };

    const res = await protectedUpdateApi(
      `${config.DeleteEventFromOccasion(occasion.delete_id)}`,
      payload,
      token
    );

    if (res.success) {
      alert("Event updated successfully");
    } else {
      alert("Failed to update event");
    }
  } catch (err) {
    console.error(err);
    alert("Error while updating event");
  }
};


const handleDeleteOccasion = async (idx) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this event?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (!confirm.isConfirmed) return;

  const isMerged = idx < mergedOccasions.length;

  {console.log("alloccasions",mergedOccasions)}
  if (isMerged) {
    const event = mergedOccasions[idx];
    const token = localStorage.getItem("token");
    try {
      const res = await protectedDeleteApi(
        `${config.DeleteEventFromOccasion(event.delete_id)}`,  // Ensure this endpoint is correct
        token
      );
      console.log("delete api Response",res)
      if (res.success) {
        Swal.fire('Deleted!', 'The event has been deleted.', 'success');
        const updated = mergedOccasions.filter((_, i) => i !== idx);
        setMergedOccasions(updated);
      } else {
        Swal.fire('Error', 'Failed to delete event.', 'error');
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  } else {
    const newUnsaved = unsavedOccasions.filter((_, i) => i !== idx - mergedOccasions.length);
    setUnsavedOccasions(newUnsaved);
    Swal.fire('Removed', 'Unsaved event removed.', 'info');
  }
};



  const allOccasions = [...mergedOccasions, ...unsavedOccasions];
  return (
    <div>
      <div className="flex justify-end mb-4 px-1 sm:px-0">
     <Button
onClick={handleAddOccasion}
  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
 
>


          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={activeOccasion}
        onValueChange={setActiveOccasion}
      >
        
        
        
            {allOccasions.map((occasion, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx} className="border-t">
            <div className="flex justify-between items-center w-full gap-2 p-3 sm:p-4 bg-white rounded-md">
              <AccordionTrigger className="flex-1 text-left hover:no-underline bg-transparent shadow-none">
                <div className="flex items-center min-w-0">
                  <Utensils className="mr-3 h-5 w-5 text-green-600 flex-shrink-0" />
                  
                  <span className="font-semibold text-base sm:text-lg text-left truncate mr-5">{`Event ${idx + 1}`} {occasion.occasionName && `: ${occasion.occasionName}`}</span>
                </div>
              </AccordionTrigger>
             <Button
  variant="ghost"
  size="icon"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteOccasion(idx);
  }}
  className="hover:bg-red-100 rounded-full flex-shrink-0"
>
  <Trash className="h-4 w-4 text-red-500" />
</Button>

            </div>
            <AccordionContent className="p-2 sm:p-4 border-t bg-white">
              <OccasionCard
                occasion={occasion}
                idx={idx}
                date={date}
                handleOccasionChange={(date, idx, field, value) => updateOccasionField(idx, field, value)}
  handleFacilitiesChange={(date, idx, facilityId) => updateOccasionFacilities(idx, facilityId)}
  handleMenuChange={(date, idx, dishId) => updateOccasionMenu(idx, dishId)}
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
                 isSavedEvent={!!occasion.delete_id}
              />
             <div className="flex justify-end mt-4">
  <Button
    onClick={() =>
      occasion.delete_id
        ? handleUpdateOccasion(idx, occasion)
        : handleSaveOccasion(idx, occasion)
    }
    className={`${
      occasion.delete_id
        ? 'bg-yellow-600 hover:bg-yellow-700'
        : 'bg-blue-600 hover:bg-blue-700'
    } text-white`}
  >
    {occasion.delete_id ? "Update Event" : "Save Event"}
  </Button>
</div>

            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

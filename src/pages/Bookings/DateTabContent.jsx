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
import { useTranslation } from "react-i18next";


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
  const { i18n } = useTranslation();
  const [eventMap, setEventMap] = useState({}); // id -> localized name

  // Build a map of event id -> localized name for readable headers
  useEffect(() => {
    const fetchEventMap = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await protectedGetApi(config.GetEvents, token);
        if (res?.success) {
          const map = {};
          (res.data || []).forEach((ev) => {
            const name = ev.name?.[i18n.language] || ev.name?.en || "";
            map[ev._id] = name;
          });
          setEventMap(map);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchEventMap();
  }, [i18n.language]);


  const handleAddOccasion = () => {
   setUnsavedOccasions((prev) => {
       const newOccasion = {
      occasionName: "",
      occasionNameLabel: "",
      date,
      mealType: "",
      startTime: "",
      endTime: "",
      guests: "",
      menu: [],
      servingType: "",
      exactVenue: "",
      facilities: [],
    };
    const updated = [...prev, newOccasion];
    const newIndex = mergedOccasions.length + updated.length - 1;
    setActiveOccasion(`item-${newIndex}`); // ✅ open the newly added accordion
    return updated;
  });
  setSavedOccasionIndex(null);
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
        // alert("Cannot save event: missing occasionId");
        Swal.fire("Error", "Cannot save event: missing occasionId", "error");

        return;
      }

      const res = await protectedPostApi(
        `${config.CreateEvent(occasionId)}`,
        payload,
        token
      );

   if (res.success) {
  setUnsavedOccasions(prev =>
    prev.filter((_, i) => i !== (idx - mergedOccasions.length))
  );
  setSavedOccasionIndex(idx);
  setActiveOccasion(`item-${idx}`);
  Swal.fire("Success", "Event saved successfully!", "success");
} else {
  Swal.fire("Error", "Failed to save event", "error");
}

    } catch (err) {
      console.error(err);
     Swal.fire("Error", "Something went wrong while saving the event", "error");

    }
  };

useEffect(() => {
  const fetchSavedEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      let merged = [];

      for (const occasion of occasionsForDate) {
        if (!occasion._id) continue;

        const res = await protectedGetApi(
          `${config.GetOccasionsEvent(occasion._id)}`,
          token
        );

        if (res.success && Array.isArray(res.data)) {
          const transformed = res.data.map((event) => ({
            _id: event.occasionId,
            occasionName: event.eventTypeId?._id,
            occasionNameLabel: event.eventTypeId?.name?.[i18n.language] || event.eventTypeId?.name?.en || "",
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

          merged = [...merged, ...transformed];
        }
      }

     if (merged.length === 0) {
  // No events in backend → ensure at least one empty unsaved
  setUnsavedOccasions(prev =>
    prev.length > 0 ? prev : [{
      occasionName: "",
      occasionNameLabel: "",
      date,
      mealType: "",
      startTime: "",
      endTime: "",
      guests: "",
      menu: [],
      servingType: "",
      exactVenue: "",
      facilities: [],
    }]
  );
  setMergedOccasions([]);
  if (!activeOccasion) setActiveOccasion("item-0"); // ✅ only first time
} else {
  setMergedOccasions(merged);
setUnsavedOccasions(prev => prev);  // ✅ preserve any newly added unsaved
  setSavedOccasionIndex(merged.length - 1);
if (!activeOccasion) setActiveOccasion("item-0"); // ✅ only first time
}

    } catch (err) {
      console.error("Error fetching saved events:", err);
    }
  };

  fetchSavedEvents();
}, [date, savedOccasionIndex, i18n.language]);

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
  Swal.fire("Updated!", "Event updated successfully!", "success");
} else {
  Swal.fire("Error", "Failed to update event", "error");
}

    } catch (err) {
      console.error(err);
    Swal.fire("Error", "Something went wrong while updating the event", "error");

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
       
        
          Swal.fire('Deleted!', 'The event has been deleted.', 'success');
          const updated = mergedOccasions.filter((_, i) => i !== idx);
          setMergedOccasions(updated);
       
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
      

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={activeOccasion}
        onValueChange={setActiveOccasion}
      >
        {allOccasions.map((occasion, idx) => {
          const readableName = occasion.occasionNameLabel || eventMap[occasion.occasionName] || "";
          return (
            <AccordionItem value={`item-${idx}`} key={idx} className="border rounded-md mb-2">
              <div className="flex justify-between items-center w-full gap-2 p-3 sm:p-4 bg-white rounded-t-md">
                <AccordionTrigger className="flex-1 text-left hover:no-underline bg-transparent shadow-none">
                  <div className="min-w-0">
                    <div className="flex items-center min-w-0">
                      <Utensils className="mr-3 h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="font-semibold text-base sm:text-lg truncate">{`Event ${idx + 1}`} {readableName && `· ${readableName}`}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                      {occasion.startTime && occasion.endTime && (
                        <span>{occasion.startTime} - {occasion.endTime}</span>
                      )}
                      {occasion.guests && (
                        <span>{occasion.guests} guests</span>
                      )}
                      {occasion.exactVenue && (
                        <span className="truncate max-w-[220px]">Venue: {occasion.exactVenue}</span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                
                
              <Button
                type="submit"
                size='icon'
               onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOccasion(idx);
                  }}
                className=" bg-red-600 hover:bg-red-700 text-white font-normal py-3 px-6 rounded-lg shadow-md transition-all "
              >
             <Trash className="h-4 w-4 " /> 
              </Button>
           
              </div>
             <AccordionContent className="p-2 sm:p-4 bg-white rounded-b-md transition-all duration-300 ease-in-out">
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
          )
        })}
      </Accordion>
      <div className="flex justify-end mb-4 px-1 sm:px-0">
        <Button
          onClick={handleAddOccasion}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
    </div>
  );
}

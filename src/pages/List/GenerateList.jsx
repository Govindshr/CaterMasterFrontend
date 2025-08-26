import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "@/services/nodeconfig";
import { protectedGetApi,protectedPostApi } from "@/services/nodeapi";
import { useLocation } from "react-router-dom";

export default function MenuSummary() {
  const { id } = useParams();
  const inputRefs = useRef({});
  const [baseQuantities, setBaseQuantities] = useState({});
  const [savedQuantities, setSavedQuantities] = useState({});
  const [savedIngredientDetails, setSavedIngredientDetails] = useState({});
  const [dishCompletion, setDishCompletion] = useState({}); // key: `${eventId}:${dishId}` -> true/false

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const generationType = queryParams.get("type"); // 'manual' | 'semi' | 'auto'

  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [occasions, setOccasions] = useState([]);
  const [dishStats, setDishStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSavedIngredients, setLoadingSavedIngredients] = useState(false);
  const [baseServingPeople, setBaseServingPeople] = useState(null);
  const [savingIngredient, setSavingIngredient] = useState(null);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loadingAllIngredients, setLoadingAllIngredients] = useState(false);
  const [addingRows, setAddingRows] = useState([]); // rows user is adding in modal

  // Sweet Alert function
  const showSweetAlert = (title, message, type = 'success') => {
    // Create a simple sweet alert-like notification
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`;
    alertDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          ${type === 'success' 
            ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
            : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>'
          }
        </svg>
        <div>
          <h3 class="font-semibold">${title}</h3>
          <p class="text-sm opacity-90">${message}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Animate in
    setTimeout(() => {
      alertDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alertDiv.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 300);
    }, 3000);
  };

  // Helper to mark completion
  const setDishCompletionFlag = (eventId, dishMongoId, completed) => {
    const key = `${eventId}:${dishMongoId}`;
    setDishCompletion((prev) => ({ ...prev, [key]: completed }));
  };

  // Prefetch completion status for all dishes in all events
  const prefetchDishCompletion = useCallback(async (occasionsData) => {
    try {
      const token = localStorage.getItem("token");
      const events = occasionsData.flatMap((o) => o.events || []);
      const requests = [];
      events.forEach((e) => {
        (e.menu || []).forEach((item) => {
          const dishMongoId = item.dishId?._id;
          if (!dishMongoId) return;
          const url = config.SaveEventDishIngredient(e._id, dishMongoId);
          requests.push(
            protectedGetApi(url, token).then((resp) => {
              if (resp?.success && resp?.data?.ingredients) {
                const allSaved = resp.data.ingredients.length > 0 && resp.data.ingredients.every((ing) => ing.customQuantity !== null && ing.customQuantity !== undefined);
                setDishCompletionFlag(e._id, dishMongoId, allSaved);
              }
            }).catch(() => {})
          );
        });
      });
      await Promise.all(requests);
    } catch (err) {
      // ignore prefetch errors
    }
  }, []);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await protectedGetApi(
          `${config.AddBooking}/${id}/occasions-with-events`,
          token
        );
        if (response.success && response.data.occasions) {
          setOccasions(response.data.occasions);
          // prefetch completion flags
          prefetchDishCompletion(response.data.occasions);
        }
      } catch (err) {
        console.error("Failed to fetch booking occasions:", err);
      }
    };

    fetchBookingDetails();
    
  }, [id, prefetchDishCompletion]);

  // Function to fetch saved ingredient quantities
  const fetchSavedIngredients = async (eventId, dishId) => {
    setLoadingSavedIngredients(true);
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(
        `${config.SaveEventDishIngredient(eventId, dishId)}`,
        token
      );

      if (response.success && response.data && response.data.ingredients) {
        const savedQtyMap = {};
        const savedDetailsMap = {};
        
        response.data.ingredients.forEach((item) => {
          if (item.ingredientId && item.effectiveQuantity !== undefined) {
            // Use effectiveQuantity which shows the final quantity (custom or base)
            savedQtyMap[item.ingredientId] = item.effectiveQuantity;
            
            // Store additional details like unit information
            savedDetailsMap[item.ingredientId] = {
              unit: item.unit?.symbol || "g",
              baseQuantity: item.baseQuantity,
              customQuantity: item.customQuantity,
              effectiveQuantity: item.effectiveQuantity,
              isMainIngredient: item.isMainIngredient
            };
          }
        });
        
        // Determine if all ingredients are saved (custom quantities present)
        const allSaved = response.data.ingredients.length > 0 && response.data.ingredients.every((ing) => ing.customQuantity !== null && ing.customQuantity !== undefined);
        setDishCompletionFlag(eventId, dishId, allSaved);

        setSavedQuantities(savedQtyMap);
        setSavedIngredientDetails(savedDetailsMap);

                          // Also augment base quantities map for newly merged items (used for semi mode)
         const extraBase = {};
         response.data.ingredients.forEach((it) => {
           const nameKey = it.name?.en || it.name || "Unknown";
           if (nameKey && (it.baseQuantity || it.baseQuantity === 0)) {
             extraBase[nameKey] = it.baseQuantity;
           }
         });
         setBaseQuantities((prev) => ({ ...prev, ...extraBase }));
      } else {
        setSavedQuantities({});
        setSavedIngredientDetails({});
        setDishCompletionFlag(eventId, dishId, false);
      }
    } catch (err) {
      console.error("Failed to fetch saved ingredients:", err);
      setSavedQuantities({});
      setSavedIngredientDetails({});
      setDishCompletionFlag(eventId, dishId, false);
    } finally {
      setLoadingSavedIngredients(false);
    }
  };

  const handleItemClick = async (dishName, id,guestno) => {
    setSelectedItem(dishName);
    setShowModal(true);
    // setLoadingStats(true);
    setDishStats({}); // clear previous
    setSavedQuantities({}); // clear previous saved quantities
    setAddingRows([]);
  setBaseServingPeople(guestno);
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(
        `${config.GetDishes}/${id}`,
        token
      );

      
      if (response.success && Array.isArray(response.data.ingredients)) {
       
        const ingredients = response.data.ingredients.map((ing) => ({
          name: ing.ingredientId?.name?.en || "Unknown",
          quantity: ing.quantity || 0,
          id: ing.ingredientId?.id || '',
          unit: ing.ingredientId?.unitTypeId?.symbol || "g",
          isMainIngredient: ing.isMainIngredient || false,
        }));

        const sortedIngredients = ingredients.sort(
          (a, b) =>
            (b.isMainIngredient === true) - (a.isMainIngredient === true)
        );

        const baseQtyMap = {};
        ingredients.forEach((ing) => {
          baseQtyMap[ing.name] = ing.quantity;
        });
        setBaseQuantities(baseQtyMap);

        setDishStats({ [dishName]: sortedIngredients });
      

        // Find the event and dish to fetch saved ingredients
        const event = occasions
          .flatMap((o) => o.events)
          .find((e) =>
            e.menu?.some((d) => d.dishId?.name?.en === dishName)
          );

        const dishObj = event?.menu?.find(
          (d) => d.dishId?.name?.en === dishName
        );

        if (event && dishObj) {
          await fetchSavedIngredients(event._id, dishObj.dishId._id);
          
          // After fetching saved ingredients, merge any additional ingredients
          const savedResponse = await protectedGetApi(
            `${config.SaveEventDishIngredient(event._id, dishObj.dishId._id)}`,
            localStorage.getItem("token")
          );
          
          if (savedResponse.success && savedResponse.data && savedResponse.data.ingredients) {
            console.log("Saved ingredients response:", savedResponse.data.ingredients);
            
            setDishStats((prev) => {
              const currentList = prev[dishName] || [];
              const existingIds = new Set(currentList.map((x) => x.id));
              
              const extras = savedResponse.data.ingredients
                .filter((it) => it.ingredientId && !existingIds.has(it.ingredientId))
                .map((it) => {
                  console.log("Processing extra ingredient:", it);
                  return {
                    name: it.name?.en || it.name || "Unknown",
                    quantity: it.baseQuantity || 0,
                    id: it.ingredientId,
                    unit: it.unit?.symbol || "g",
                    isMainIngredient: !!it.isMainIngredient,
                  };
                });

              if (extras.length === 0) return prev;

              console.log("Adding extras:", extras);
              const merged = [...currentList, ...extras];
              // Keep main ingredients first
              merged.sort((a, b) => (b.isMainIngredient === true) - (a.isMainIngredient === true));
              console.log("Final merged list:", merged);
              return { ...prev, [dishName]: merged };
            });
          }
        }
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (err) {
      console.error("Failed to fetch dish stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch all ingredients for the dropdown (paged; we request a large page size)
  const ensureAllIngredientsLoaded = async () => {
    if (allIngredients.length > 0 || loadingAllIngredients) return;
    try {
      setLoadingAllIngredients(true);
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(`${config.GetIngredients}?page=1&limit=1000`, token);
      const list = res?.data?.ingredients || [];
      setAllIngredients(list);
    } catch (e) {
      console.error("Failed to load ingredients list", e);
    } finally {
      setLoadingAllIngredients(false);
    }
  };

  // Add a new editable row for adding a custom ingredient
  const addNewIngredientRow = async () => {
    await ensureAllIngredientsLoaded();
    setAddingRows((prev) => [
      ...prev,
      { tempId: `${Date.now()}-${Math.random()}`, ingredientId: "", quantity: "", isSaving: false }
    ]);
  };

  const updateAddingRow = (tempId, field, value) => {
    setAddingRows((prev) => prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r)));
  };

  // Save or update a custom ingredient row
  const handleSaveCustomRow = async (row) => {
    const { tempId, ingredientId, quantity } = row;
    if (!ingredientId || !quantity) {
      showSweetAlert("Missing data", "Please select an ingredient and enter a quantity", "error");
      return;
    }

    // Find current event/dish
    const event = occasions
      .flatMap((o) => o.events)
      .find((e) => e.menu?.some((d) => d.dishId?.name?.en === selectedItem));
    const dishObj = event?.menu?.find((d) => d.dishId?.name?.en === selectedItem);
    if (!event || !dishObj) {
      showSweetAlert("Error", "Event/Dish not found for save.", "error");
      return;
    }

    // Determine whether to add or modify
    const alreadyInDish = (dishStats[selectedItem] || []).some((ing) => ing.id === ingredientId);
    const alreadySaved = !!savedIngredientDetails[ingredientId];
    const action = alreadyInDish || alreadySaved ? "modify" : "add";

    // Mark row saving
    updateAddingRow(tempId, "isSaving", true);

    const payload = {
      ingredientId,
      quantity: parseFloat(quantity),
      action,
      notes: action === "add" ? "Ingredient added from frontend" : "Quantity updated from frontend",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await protectedPostApi(
        config.SaveEventDishIngredient(event._id, dishObj.dishId._id),
        payload,
        token
      );

      if (!response?.success) {
        showSweetAlert("Error", response?.message || "Failed to save ingredient", "error");
      } else {
        // Update local maps
        const ingMeta = allIngredients.find((it) => it._id === ingredientId || it.id === ingredientId);
        const unitSymbol = ingMeta?.unitTypeId?.symbol || "g";
        const nameEn = ingMeta?.name?.en || ingMeta?.name || "Ingredient";

        setSavedQuantities((prev) => ({ ...prev, [ingredientId]: parseFloat(quantity) }));
        setSavedIngredientDetails((prev) => ({
          ...prev,
          [ingredientId]: {
            ...(prev[ingredientId] || {}),
            unit: unitSymbol,
            baseQuantity: 0,
            customQuantity: parseFloat(quantity),
            effectiveQuantity: parseFloat(quantity),
            isMainIngredient: false,
          },
        }));

        // If not in dishStats yet, append so it appears as a normal row with Update state
        if (!alreadyInDish) {
          setDishStats((prev) => {
            const current = prev[selectedItem] || [];
            const next = [
              ...current,
              {
                name: nameEn,
                quantity: 0,
                id: ingredientId,
                unit: unitSymbol,
                isMainIngredient: false,
              },
            ];
            return { ...prev, [selectedItem]: next };
          });
        }

        // Recompute completion for dish
        const allIds = (dishStats[selectedItem] || []).map((x) => x.id);
        const includesNew = alreadyInDish ? allIds : [...allIds, ingredientId];
        const completed = includesNew.length > 0 && includesNew.every((iid) => {
          const det = iid === ingredientId
            ? { customQuantity: parseFloat(quantity) }
            : savedIngredientDetails[iid];
          return det && det.customQuantity !== null && det.customQuantity !== undefined;
        });
        setDishCompletionFlag(event._id, dishObj.dishId._id, completed);

        // Remove the temp row and show success
        setAddingRows((prev) => prev.filter((r) => r.tempId !== tempId));
        showSweetAlert(action === "add" ? "Added!" : "Updated!", `${nameEn} ${action === 'add' ? 'added' : 'updated'} successfully`, "success");
      }
    } catch (err) {
      console.error("Failed to save custom row", err);
      showSweetAlert("Error", "Failed to save ingredient", "error");
    } finally {
      updateAddingRow(tempId, "isSaving", false);
    }
  };

     // Delete ingredient function
   const handleDeleteIngredient = async (ingredientName, ingredientId) => {
     // Show confirmation dialog
     const confirmDelete = window.confirm(`Are you sure you want to delete "${ingredientName}"?`);
     if (!confirmDelete) return;

     setSavingIngredient(ingredientId);

     const event = occasions
       .flatMap((o) => o.events)
       .find((e) =>
         e.menu?.some((d) => d.dishId?.name?.en === selectedItem)
       );

     const dishObj = event?.menu?.find(
       (d) => d.dishId?.name?.en === selectedItem
     );

     if (!event || !dishObj) {
       console.error("Event/Dish not found for delete.");
       setSavingIngredient(null);
       return;
     }

     const payload = {
       ingredientId: ingredientId || "",
       quantity: 0, // Not used for delete but required by API
       action: "remove",
       notes: "Ingredient removed from frontend"
     };

     try {
       const token = localStorage.getItem("token");
       const response = await protectedPostApi(
         config.SaveEventDishIngredient(event._id, dishObj.dishId._id),
         payload,
         token
       );

       if (!response.success) {
         console.error("Failed to delete from backend:", response.message);
         showSweetAlert("Error", "Failed to delete ingredient", "error");
       } else {
         console.log("Deleted ingredient:", ingredientName);
         
         // Remove from saved quantities and details
         setSavedQuantities(prev => {
           const newState = { ...prev };
           delete newState[ingredientId];
           return newState;
         });
         
         setSavedIngredientDetails(prev => {
           const newState = { ...prev };
           delete newState[ingredientId];
           return newState;
         });

         // Remove from dishStats
         setDishStats(prev => {
           const currentList = prev[selectedItem] || [];
           const filteredList = currentList.filter(ing => ing.id !== ingredientId);
           return { ...prev, [selectedItem]: filteredList };
         });

         // Recompute completion for dish
         const allIds = (dishStats[selectedItem] || []).filter(ing => ing.id !== ingredientId).map((x) => x.id);
         const completed = allIds.length > 0 && allIds.every((iid) => {
           const det = savedIngredientDetails[iid];
           return det && det.customQuantity !== null && det.customQuantity !== undefined;
         });
         setDishCompletionFlag(event._id, dishObj.dishId._id, completed);
         
         showSweetAlert("Deleted!", `${ingredientName} has been removed successfully`, "success");
       }
     } catch (err) {
       console.error("API error deleting ingredient:", err);
       showSweetAlert("Error", "Failed to delete ingredient", "error");
     } finally {
       setSavingIngredient(null);
     }
   };

   const handleSaveQuantity = async (ingredientName, qty, ingredientId) => {
    setSavingIngredient(ingredientId);

    const dishIngredients = dishStats[selectedItem] || [];
    const selectedIngredient = dishIngredients.find(
      (ing) => ing.name === ingredientName
    );

    if (!selectedIngredient) {
      console.warn("Ingredient not found:", ingredientName);
      setSavingIngredient(null);
      return;
    }

    const event = occasions
      .flatMap((o) => o.events)
      .find((e) =>
        e.menu?.some((d) => d.dishId?.name?.en === selectedItem)
      );

    const dishObj = event?.menu?.find(
      (d) => d.dishId?.name?.en === selectedItem
    );

    if (!event || !dishObj) {
      console.error("Event/Dish not found for save.");
      setSavingIngredient(null);
      return;
    }

    const payload = {
      ingredientId: ingredientId || "",
      quantity: parseFloat(qty),
      action: "modify",
      notes: "Quantity updated from frontend"
    };

    try {
      const token = localStorage.getItem("token");
      const response = await protectedPostApi(
        config.SaveEventDishIngredient(event._id, dishObj.dishId._id),
        payload,
        token
      );

      if (!response.success) {
        console.error("Failed to save to backend:", response.message);
        showSweetAlert("Error", "Failed to save ingredient quantity", "error");
      } else {
        console.log("Saved ingredient override:", ingredientName);
        // Update the saved quantities state to reflect the saved value
        setSavedQuantities(prev => ({
          ...prev,
          [ingredientId]: parseFloat(qty)
        }));
        
        // Update the saved ingredient details to mark this as a custom quantity
        setSavedIngredientDetails(prev => ({
          ...prev,
          [ingredientId]: {
            ...prev[ingredientId],
            customQuantity: parseFloat(qty),
            effectiveQuantity: parseFloat(qty)
          }
        }));
        
        // After saving, compute if all ingredients are now saved and update flag
        const allIds = (dishStats[selectedItem] || []).map((x) => x.id);
        const completed = allIds.length > 0 && allIds.every((iid) => {
          const det = (iid === ingredientId)
            ? { customQuantity: parseFloat(qty) }
            : savedIngredientDetails[iid];
          return det && det.customQuantity !== null && det.customQuantity !== undefined;
        });
        setDishCompletionFlag(event._id, dishObj.dishId._id, completed);
        
        // Check if this is an update or new save
        const isUpdate = savedIngredientDetails[ingredientId]?.customQuantity !== null;
        showSweetAlert(
          isUpdate ? "Updated!" : "Saved!", 
          `${ingredientName} quantity ${isUpdate ? 'updated' : 'saved'} successfully`, 
          "success"
        );
      }
    } catch (err) {
      console.error("API error saving ingredient:", err);
      showSweetAlert("Error", "Failed to save ingredient quantity", "error");
    } finally {
      setSavingIngredient(null);
    }
  };

  const generateFinalList = () => {
    navigate(`/final-ingredient-list/${id}`,);
  };

  return (
    <>

      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {occasions.map((occasion) => (
          <Card
            key={occasion._id}
            className="border rounded-2xl shadow-md hover:shadow-xl transition-all"
          >
            <CardHeader className="bg-blue-50 rounded-t-2xl p-3 sm:p-4">
              <h2 className="text-2xl font-bold text-blue-900">
                🎉 {occasion.occasionName}
              </h2>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {console.log("occasion.events",occasion.events)}
              {occasion.events?.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        🍽️ {event.eventTypeId?.name?.en || "Unnamed Event"}
                      </h3>
                      <span className="text-sm text-gray-600 sm:hidden">
                        People: <strong>{event.noOfGuests}</strong>
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="hidden sm:inline text-sm text-gray-600">
                        People: <strong>{event.noOfGuests}</strong>
                      </span>
                     
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {event.menu?.map((item, index) => {
                      const key = `${event._id}:${item.dishId?._id}`;
                      const isComplete = !!dishCompletion[key];
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={`${isComplete ? 'bg-green-50 border-green-600 text-green-700 hover:bg-green-100' : 'border-blue-500 text-blue-700 hover:bg-blue-100'} rounded-full w-full justify-center`}
                          onClick={() =>
                            handleItemClick(
                              item.dishId?.name?.en || "Unknown",
                              item.dishId?.id,
                              event.noOfGuests
                            )
                          }
                        >
                          <span className="truncate">{item.dishId?.name?.en || "Unknown"}</span>
                        </Button>
                      );
                    })}
                  </div>
                  <span className="flex justify-end">
                   <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto mt-5 align-middle"
                        onClick={() => navigate(`/final-ingredient-list/event/${event._id}`)}
                      >
                        Generate Event List
                      </Button>
                      </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={generateFinalList}
        >
          Generate List
        </Button>
      </div>
      </div>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-[95vw] sm:w-full sm:max-w-4xl max-h-[85vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  🍽️ Ingredients for {selectedItem}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  {baseServingPeople !== null && (
                    <p className="text-sm text-gray-600">
                      Event Guests: <strong>{baseServingPeople} people</strong>
                    </p>
                  )}
                 
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {loadingStats && (
              <div className="text-center text-gray-500 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Loading ingredients...
              </div>
            )}

            {loadingSavedIngredients && (
              <div className="text-center text-blue-500 py-4 text-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Loading saved quantities...
              </div>
            )}

            {!loadingStats && !loadingSavedIngredients && (
              <>
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full border-collapse text-sm">
                                     <thead>
                     <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                       <th className="p-3 border border-gray-200 text-left font-semibold text-gray-700">Ingredient</th>
                       <th className="p-3 border border-gray-200 text-left font-semibold text-gray-700">Base Qty</th>
                       <th className="p-3 border border-gray-200 text-left font-semibold text-gray-700">Your Qty</th>
                       <th className="p-3 border border-gray-200 text-left font-semibold text-gray-700">Action</th>
                       <th className="p-3 border border-gray-200 text-left font-semibold text-gray-700">Delete</th>
                     </tr>
                   </thead>
                  <tbody>
                    {/* Existing dish ingredients */}
                    {(dishStats[selectedItem] || []).map((ing, i) => {
                      const inputId = `${selectedItem}-${ing.name}`;
                      const savedQty = savedQuantities[ing.id] || 0;
                      const savedDetails = savedIngredientDetails[ing.id];
                      const displayUnit = savedDetails?.unit || ing.unit;
                      const hasCustomQuantity = savedDetails?.customQuantity !== null && savedDetails?.customQuantity !== undefined;
                      const isSaving = savingIngredient === ing.id;
                      
                      return (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-800">{ing.name}</span>
                              <div className="flex space-x-1">
                                {ing.isMainIngredient && (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                    Main
                                  </span>
                                )}
                                {hasCustomQuantity && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3 border border-gray-200">
                            <span className="text-gray-700">
                              {savedDetails?.baseQuantity || ing.quantity} {savedDetails?.unit || ing.unit}
                            </span>
                          </td>
                          
                          <td className="p-3 border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                id={inputId}
                                ref={(el) => (inputRefs.current[inputId] = el)}
                                placeholder="Enter quantity"
                                className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={savedQty}
                                onChange={(e) => {
                                  const entered = parseFloat(e.target.value) || 0;
                                  
                                  // Update saved quantities state
                                  setSavedQuantities(prev => ({
                                    ...prev,
                                    [ing.id]: entered
                                  }));

                                  // 🛑 Exit if not 'semi', or invalid number
                                  if (
                                    generationType !== "semi" ||
                                    isNaN(entered) ||
                                    !baseQuantities[ing.name] ||
                                    !ing.isMainIngredient // ✅ Only allow autofill from main ingredients
                                  )
                                    return;

                                  const ratio = entered / baseQuantities[ing.name];

                                  Object.entries(baseQuantities).forEach(
                                    ([otherName, otherBaseQty]) => {
                                      const otherId = `${selectedItem}-${otherName}`;
                                      const ref = inputRefs.current[otherId];
                                      if (ref && otherName !== ing.name) {
                                        const calculatedValue = (ratio * otherBaseQty).toFixed(2);
                                        ref.value = calculatedValue;
                                        
                                        // Also update the saved quantities for other ingredients
                                        const otherIngredient = dishStats[selectedItem]?.find(ing => ing.name === otherName);
                                        if (otherIngredient) {
                                          setSavedQuantities(prev => ({
                                            ...prev,
                                            [otherIngredient.id]: parseFloat(calculatedValue)
                                          }));
                                        }
                                      }
                                    }
                                  );
                                }}
                              />
                              <span className="text-xs text-gray-500 font-medium">{displayUnit}</span>
                            </div>
                          </td>
                          
                          <td className="p-3 border border-gray-200">
                            {hasCustomQuantity ? (
                              <Button
                                size="sm"
                                disabled={isSaving}
                                className={`${
                                  isSaving 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white transition-colors`}
                                onClick={() => {
                                  const val = savedQuantities[ing.id] || 0;
                                  handleSaveQuantity(ing.name, val, ing.id);
                                }}
                              >
                                {isSaving ? (
                                  <div className="flex items-center space-x-1">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  'Update'
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isSaving}
                                className={`${
                                  isSaving 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'
                                } text-white transition-colors`}
                                onClick={() => {
                                  const val = savedQuantities[ing.id] || 0;
                                  handleSaveQuantity(ing.name, val, ing.id);
                                }}
                              >
                                {isSaving ? (
                                  <div className="flex items-center space-x-1">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                    <span>Saving...</span>
                                  </div>
                                ) : (
                                  'Save'
                                )}
                              </Button>
                                                         )}
                           </td>
                           <td className="p-3 border border-gray-200">
                             <Button
                               size="sm"
                               variant="destructive"
                               disabled={isSaving}
                               className={`${
                                 isSaving 
                                   ? 'bg-gray-400 cursor-not-allowed' 
                                   : 'bg-red-500 hover:bg-red-600'
                               } text-white transition-colors`}
                               onClick={() => handleDeleteIngredient(ing.name, ing.id)}
                             >
                               {isSaving ? (
                                 <div className="flex items-center space-x-1">
                                   <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                   <span>Deleting...</span>
                                 </div>
                               ) : (
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                               )}
                             </Button>
                           </td>
                         </tr>
                       );
                     })}

                    {/* New rows for adding ingredients */}
                    {addingRows.map((row) => {
                      const tempId = row.tempId;
                      return (
                        <tr key={tempId} className="bg-yellow-50">
                          <td className="p-3 border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <select
                                className="min-w-[220px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={row.ingredientId}
                                onChange={(e) => updateAddingRow(tempId, 'ingredientId', e.target.value)}
                              >
                                <option value="">Select ingredient</option>
                                {allIngredients.map((ing) => (
                                  <option key={ing._id} value={ing._id || ing.id}>
                                    {ing.name?.en || ing.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="p-3 border border-gray-200 text-gray-500">—</td>
                          <td className="p-3 border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Qty"
                                value={row.quantity}
                                onChange={(e) => updateAddingRow(tempId, 'quantity', e.target.value)}
                              />
                            </div>
                          </td>
                                                     <td className="p-3 border border-gray-200">
                             <Button
                               size="sm"
                               disabled={row.isSaving}
                               className={`${row.isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
                               onClick={() => handleSaveCustomRow(row)}
                             >
                               {row.isSaving ? 'Saving...' : 'Add'}
                             </Button>
                           </td>
                           <td className="p-3 border border-gray-200">
                             <Button
                               size="sm"
                               variant="destructive"
                               disabled={row.isSaving}
                               className={`${row.isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                               onClick={() => {
                                 setAddingRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
                               }}
                             >
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
                             </Button>
                           </td>
                         </tr>
                       );
                     })}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={addNewIngredientRow}>
                    + Add Ingredient
                  </Button>
                </div>
              </div>

              <div className="md:hidden space-y-3">
                {(dishStats[selectedItem] || []).map((ing, i) => {
                  const inputId = `${selectedItem}-${ing.name}`;
                  const savedQty = savedQuantities[ing.id] || 0;
                  const savedDetails = savedIngredientDetails[ing.id];
                  const displayUnit = savedDetails?.unit || ing.unit;
                  const hasCustomQuantity = savedDetails?.customQuantity !== null && savedDetails?.customQuantity !== undefined;
                  const isSaving = savingIngredient === ing.id;
                  return (
                    <div key={i} className="rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{ing.name}</p>
                          <div className="mt-1 flex items-center gap-2">
                            {ing.isMainIngredient && (
                              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Main</span>
                            )}
                            {hasCustomQuantity && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Custom</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-500">Base</p>
                          <p className="text-sm font-medium text-gray-800">{savedDetails?.baseQuantity || ing.quantity} {savedDetails?.unit || ing.unit}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="h-9 w-9 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              const next = Math.max(0, (savedQuantities[ing.id] || 0) - 1);
                              setSavedQuantities(prev => ({ ...prev, [ing.id]: next }));
                              const ref = inputRefs.current[inputId];
                              if (ref) ref.value = String(next);
                              if (generationType === 'semi' && baseQuantities[ing.name] && ing.isMainIngredient) {
                                const ratio = next / baseQuantities[ing.name];
                                Object.entries(baseQuantities).forEach(([otherName, otherBaseQty]) => {
                                  const otherId = `${selectedItem}-${otherName}`;
                                  const otherRef = inputRefs.current[otherId];
                                  if (otherRef && otherName !== ing.name) {
                                    const calculatedValue = (ratio * otherBaseQty).toFixed(2);
                                    otherRef.value = calculatedValue;
                                    const otherIngredient = dishStats[selectedItem]?.find(ing => ing.name === otherName);
                                    if (otherIngredient) {
                                      setSavedQuantities(prev => ({
                                        ...prev,
                                        [otherIngredient.id]: parseFloat(calculatedValue)
                                      }));
                                    }
                                  }
                                });
                              }
                            }}
                          >
                            -
                          </button>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              id={inputId}
                              ref={(el) => (inputRefs.current[inputId] = el)}
                              placeholder="Enter quantity"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={savedQty}
                              onChange={(e) => {
                                const entered = parseFloat(e.target.value) || 0;
                                setSavedQuantities(prev => ({
                                  ...prev,
                                  [ing.id]: entered
                                }));
                                if (
                                  generationType !== "semi" ||
                                  isNaN(entered) ||
                                  !baseQuantities[ing.name] ||
                                  !ing.isMainIngredient
                                ) return;
                                const ratio = entered / baseQuantities[ing.name];
                                Object.entries(baseQuantities).forEach(([otherName, otherBaseQty]) => {
                                  const otherId = `${selectedItem}-${otherName}`;
                                  const ref = inputRefs.current[otherId];
                                  if (ref && otherName !== ing.name) {
                                    const calculatedValue = (ratio * otherBaseQty).toFixed(2);
                                    ref.value = calculatedValue;
                                    const otherIngredient = dishStats[selectedItem]?.find(ing => ing.name === otherName);
                                    if (otherIngredient) {
                                      setSavedQuantities(prev => ({
                                        ...prev,
                                        [otherIngredient.id]: parseFloat(calculatedValue)
                                      }));
                                    }
                                  }
                                });
                              }}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{displayUnit}</span>
                          </div>
                          <button
                            type="button"
                            className="h-9 w-9 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              const next = (savedQuantities[ing.id] || 0) + 1;
                              setSavedQuantities(prev => ({ ...prev, [ing.id]: next }));
                              const ref = inputRefs.current[inputId];
                              if (ref) ref.value = String(next);
                              if (generationType === 'semi' && baseQuantities[ing.name] && ing.isMainIngredient) {
                                const ratio = next / baseQuantities[ing.name];
                                Object.entries(baseQuantities).forEach(([otherName, otherBaseQty]) => {
                                  const otherId = `${selectedItem}-${otherName}`;
                                  const otherRef = inputRefs.current[otherId];
                                  if (otherRef && otherName !== ing.name) {
                                    const calculatedValue = (ratio * otherBaseQty).toFixed(2);
                                    otherRef.value = calculatedValue;
                                    const otherIngredient = dishStats[selectedItem]?.find(ing => ing.name === otherName);
                                    if (otherIngredient) {
                                      setSavedQuantities(prev => ({
                                        ...prev,
                                        [otherIngredient.id]: parseFloat(calculatedValue)
                                      }));
                                    }
                                  }
                                });
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <button
                            type="button"
                            className="text-xs text-gray-600 hover:text-gray-800 underline"
                            onClick={() => {
                              const base = savedDetails?.baseQuantity || ing.quantity || 0;
                              setSavedQuantities(prev => ({ ...prev, [ing.id]: base }));
                              const ref = inputRefs.current[inputId];
                              if (ref) ref.value = String(base);
                              if (generationType === 'semi' && baseQuantities[ing.name] && ing.isMainIngredient) {
                                const ratio = base / baseQuantities[ing.name];
                                Object.entries(baseQuantities).forEach(([otherName, otherBaseQty]) => {
                                  const otherId = `${selectedItem}-${otherName}`;
                                  const otherRef = inputRefs.current[otherId];
                                  if (otherRef && otherName !== ing.name) {
                                    const calculatedValue = (ratio * otherBaseQty).toFixed(2);
                                    otherRef.value = calculatedValue;
                                    const otherIngredient = dishStats[selectedItem]?.find(ing => ing.name === otherName);
                                    if (otherIngredient) {
                                      setSavedQuantities(prev => ({
                                        ...prev,
                                        [otherIngredient.id]: parseFloat(calculatedValue)
                                      }));
                                    }
                                  }
                                });
                              }
                            }}
                          >
                            Reset to base
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          disabled={isSaving}
                          className={`${isSaving ? 'bg-gray-400 cursor-not-allowed' : hasCustomQuantity ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                          onClick={() => {
                            const val = savedQuantities[ing.id] || 0;
                            handleSaveQuantity(ing.name, val, ing.id);
                          }}
                        >
                          {isSaving ? 'Saving...' : (hasCustomQuantity ? 'Update' : 'Save')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isSaving}
                          className={`${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                          onClick={() => handleDeleteIngredient(ing.name, ing.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {addingRows.map((row) => (
                  <div key={row.tempId} className="rounded-lg border border-gray-200 p-4 shadow-sm bg-yellow-50">
                    <div className="space-y-3">
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={row.ingredientId}
                        onChange={(e) => updateAddingRow(row.tempId, 'ingredientId', e.target.value)}
                      >
                        <option value="">Select ingredient</option>
                        {allIngredients.map((ing) => (
                          <option key={ing._id} value={ing._id || ing.id}>
                            {ing.name?.en || ing.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Qty"
                        value={row.quantity}
                        onChange={(e) => updateAddingRow(row.tempId, 'quantity', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          disabled={row.isSaving}
                          className={`${row.isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
                          onClick={() => handleSaveCustomRow(row)}
                        >
                          {row.isSaving ? 'Saving...' : 'Add'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={row.isSaving}
                          className={`${row.isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                          onClick={() => {
                            setAddingRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={addNewIngredientRow}>
                    + Add Ingredient
                  </Button>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

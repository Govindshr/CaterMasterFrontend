import React, { useState, useEffect, useRef } from "react";
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const generationType = queryParams.get("type"); // 'manual' | 'semi' | 'auto'

  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userQuantities, setUserQuantities] = useState({});
  const [occasions, setOccasions] = useState([]);
  const [dishStats, setDishStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [baseServingPeople, setBaseServingPeople] = useState(null);

  const handleItemClick = async (dishName, id) => {
    setSelectedItem(dishName);
    setShowModal(true);
    setLoadingStats(true);
    setDishStats({}); // clear previous

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
        setBaseServingPeople(response.data.baseServingPeople || null);
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (err) {
      console.error("Failed to fetch dish stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    console.log("User selected list type:", generationType);

    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await protectedGetApi(
          `${config.AddBooking}/${id}/occasions-with-events`,
          token
        );
        if (response.success && response.data.occasions) {
          setOccasions(response.data.occasions);
        }
      } catch (err) {
        console.error("Failed to fetch booking occasions:", err);
      }
    };

    fetchBookingDetails();
  }, [id]);

const handleSaveQuantity = async (ingredientName, qty) => {
  setUserQuantities((prev) => ({
    ...prev,
    [ingredientName]: (prev[ingredientName] || 0) + Number(qty || 0),
  }));

  const dishIngredients = dishStats[selectedItem] || [];
  const selectedIngredient = dishIngredients.find(
    (ing) => ing.name === ingredientName
  );

  if (!selectedIngredient) {
    console.warn("Ingredient not found:", ingredientName);
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
    return;
  }

  const payload = {
    ingredientId: selectedIngredient.id || selectedIngredient.ingredientId?._id,
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
    } else {
      console.log("Saved ingredient override:", ingredientName);
    }
  } catch (err) {
    console.error("API error saving ingredient:", err);
  }
};


  const generateFinalList = () => {
    navigate("/final-ingredient-list", {
      state: { ingredients: userQuantities },
    });
  };

  return (
    <>
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {occasions.map((occasion) => (
          <Card
            key={occasion._id}
            className="border rounded-2xl shadow-md hover:shadow-xl transition-all"
          >
            <CardHeader className="bg-blue-50 rounded-t-2xl p-4">
              <h2 className="text-2xl font-bold text-blue-900">
                🎉 {occasion.occasionName}
              </h2>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {occasion.events?.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      🍽️ {event.eventTypeId?.name?.en || "Unnamed Event"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      No. of People: <strong>{event.noOfGuests}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.menu?.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="rounded-full border-blue-500 text-blue-700 hover:bg-blue-100"
                        onClick={() =>
                          handleItemClick(
                            item.dishId?.name?.en || "Unknown",
                            item.dishId?.id
                          )
                        }
                      >
                        {item.dishId?.name?.en || "Unknown"}
                      </Button>
                    ))}
                  </div>
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

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Ingredients for {selectedItem}
            </h2>
            {baseServingPeople !== null && (
              <p className="text-sm text-gray-600 mb-4">
                🍽️ Base Serving: <strong>{baseServingPeople} people</strong>
              </p>
            )}

            {loadingStats && (
              <div className="text-center text-gray-500 py-4">
                Loading ingredients...
              </div>
            )}

            <table className="w-full border text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Ingredient</th>
                  <th className="p-2 border">Sys Qty (g)</th>
                  <th className="p-2 border">Your Qty (g)</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {(dishStats[selectedItem] || []).map((ing, i) => {
                  const inputId = `${selectedItem}-${ing.name}`;
                  return (
                    <tr key={i}>
                      <td className="p-2 border">
                        {ing.name}
                        {ing.isMainIngredient && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full">
                            Main
                          </span>
                        )}
                      </td>

                      <td className="p-2 border">
                        {ing.quantity} {ing.unit}
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          id={inputId}
                          ref={(el) => (inputRefs.current[inputId] = el)}
                          placeholder="Qty"
                          className="w-full border rounded px-2 py-1"
                          onChange={(e) => {
                            const entered = parseFloat(e.target.value);

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
                                  ref.value = (ratio * otherBaseQty).toFixed(2);
                                }
                              }
                            );
                          }}
                        />
                      </td>
                      <td className="p-2 border">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => {
                            const val = document.getElementById(inputId).value;
                            handleSaveQuantity(ing.name, val);
                          }}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Button
              className="mt-4 w-full bg-gray-300"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

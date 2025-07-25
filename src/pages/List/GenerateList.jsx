import React, { useState ,useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate ,useParams } from "react-router-dom";
import { config } from "@/services/nodeconfig";
import { protectedGetApi } from "@/services/nodeapi";


export default function MenuSummary() {
    const { id } = useParams();
    const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userQuantities, setUserQuantities] = useState({});
const [occasions, setOccasions] = useState([]);


  
useEffect(() => {
  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(`${config.AddBooking}/${id}/occasions-with-events`, token);
      if (response.success && response.data.occasions) {
        setOccasions(response.data.occasions);
      }
    } catch (err) {
      console.error("Failed to fetch booking occasions:", err);
    }
  };

  fetchBookingDetails();
}, [id]);



  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSaveQuantity = (ingredient, qty) => {
    setUserQuantities((prev) => ({
      ...prev,
      [ingredient]: (prev[ingredient] || 0) + Number(qty || 0),
    }));
  };

  const generateFinalList = () => {
    navigate("/final-ingredient-list", { state: { ingredients: userQuantities } });
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
      <h2 className="text-2xl font-bold text-blue-900">🎉 {occasion.occasionName}</h2>
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
                onClick={() => handleItemClick(item.dishId?.name?.en || "Unknown")}
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
            <h2 className="text-xl font-bold mb-4">Ingredients for {selectedItem}</h2>
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
                {(ingredientMap[selectedItem] || []).map((ing, i) => {
                  const inputId = `${selectedItem}-${ing.name}`;
                  return (
                    <tr key={i}>
                      <td className="p-2 border">{ing.name}</td>
                      <td className="p-2 border">{ing.quantity}</td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          id={inputId}
                          placeholder="Qty"
                          className="w-full border rounded px-2 py-1"
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

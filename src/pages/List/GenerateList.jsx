import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const menuData = {
  "2025-03-10": {
    Breakfast: { people: 50, items: ["Tea", "Poha", "Samosa"] },
    Lunch: { people: 80, items: ["Dal Tadka", "Jeera Rice"] },
    HighTea: { people: 40, items: ["Cookies", "Masala Chai"] },
    Dinner: { people: 70, items: ["Paneer Butter Masala", "Naan"] },
  },
  "2025-03-11": {
    Breakfast: { people: 60, items: ["Upma", "Filter Coffee"] },
    Lunch: { people: 100, items: ["Rajma", "Steamed Rice"] },
    HighTea: { people: 45, items: ["Cutlets", "Green Tea"] },
    Dinner: { people: 80, items: ["Butter Chicken", "Garlic Naan"] },
  },
};

export default function MenuSummary() {
    const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userQuantities, setUserQuantities] = useState({});

  const ingredientMap = {
    Tea: [
      { name: "Tea Leaves", quantity: 5 },
      { name: "Water", quantity: 150 },
      { name: "Sugar", quantity: 10 },
      { name: "Milk", quantity: 100 },
    ],
    Poha: [
      { name: "Poha", quantity: 100 },
      { name: "Mustard Seeds", quantity: 5 },
      { name: "Onion", quantity: 30 },
      { name: "Green Chilli", quantity: 5 },
    ],
    Samosa: [
      { name: "Potato", quantity: 150 },
      { name: "Maida", quantity: 80 },
      { name: "Spices", quantity: 10 },
    ],
    "Dal Tadka": [
      { name: "Toor Dal", quantity: 100 },
      { name: "Ghee", quantity: 20 },
      { name: "Spices", quantity: 10 },
    ],
    "Jeera Rice": [
      { name: "Rice", quantity: 120 },
      { name: "Jeera", quantity: 5 },
      { name: "Oil", quantity: 10 },
    ],
    Cookies: [
      { name: "Flour", quantity: 50 },
      { name: "Butter", quantity: 20 },
      { name: "Sugar", quantity: 25 },
    ],
    "Masala Chai": [
      { name: "Tea Leaves", quantity: 5 },
      { name: "Spices", quantity: 5 },
      { name: "Milk", quantity: 100 },
    ],
    "Paneer Butter Masala": [
      { name: "Paneer", quantity: 150 },
      { name: "Butter", quantity: 30 },
      { name: "Tomato Puree", quantity: 50 },
    ],
    Naan: [
      { name: "Maida", quantity: 100 },
      { name: "Curd", quantity: 30 },
      { name: "Salt", quantity: 5 },
    ],
    Upma: [
      { name: "Rava", quantity: 100 },
      { name: "Vegetables", quantity: 50 },
      { name: "Spices", quantity: 10 },
    ],
    "Filter Coffee": [
      { name: "Coffee Powder", quantity: 10 },
      { name: "Milk", quantity: 100 },
      { name: "Sugar", quantity: 15 },
    ],
    Rajma: [
      { name: "Rajma", quantity: 120 },
      { name: "Spices", quantity: 15 },
      { name: "Tomato", quantity: 30 },
    ],
    "Steamed Rice": [
      { name: "Rice", quantity: 150 },
      { name: "Salt", quantity: 3 },
    ],
    Cutlets: [
      { name: "Potato", quantity: 100 },
      { name: "Breadcrumbs", quantity: 20 },
      { name: "Spices", quantity: 10 },
    ],
    "Green Tea": [
      { name: "Green Tea Leaves", quantity: 3 },
      { name: "Water", quantity: 150 },
    ],
    "Butter Chicken": [
      { name: "Chicken", quantity: 150 },
      { name: "Butter", quantity: 30 },
      { name: "Cream", quantity: 50 },
    ],
    "Garlic Naan": [
      { name: "Maida", quantity: 100 },
      { name: "Garlic", quantity: 10 },
      { name: "Butter", quantity: 20 },
    ],
  };

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
        {Object.entries(menuData).map(([date, meals]) => (
          <Card
            key={date}
            className="border rounded-2xl shadow-md hover:shadow-xl transition-all"
          >
            <CardHeader className="bg-blue-50 rounded-t-2xl p-4">
              <h2 className="text-2xl font-bold text-blue-900">📅 {date}</h2>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {Object.entries(meals).map(
                ([mealName, data]) =>
                  data.items.length > 0 && (
                    <div
                      key={mealName}
                      className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          🍽️ {mealName}
                        </h3>
                        <span className="text-sm text-gray-600">
                          No. of People: <strong>{data.people}</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.items.map((item, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="rounded-full border-blue-500 text-blue-700 hover:bg-blue-100"
                            onClick={() => handleItemClick(item)}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={generateFinalList}
        >
          Generate List
        </Button>

    \

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

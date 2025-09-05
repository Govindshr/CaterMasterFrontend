// src/pages/ViewDish.jsx

import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { useTranslation } from "react-i18next";

export default function ViewDish() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { id } = useParams();
  const [dishData, setDishData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await protectedGetApi(`${config.GetDishes}/${id}`, token);
        setDishData(response.data);
      } catch (err) {
        console.error("Failed to fetch dish:", err);
        setError(err.response?.data?.message || "Error loading dish");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading dish details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6">
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            Dish Details
          </h2>
          <Button
            variant="outline"
            className="flex items-center text-sm sm:text-base"
            onClick={() => navigate("/items-list")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dishes
          </Button>
        </div>

        {/* Dish Info */}
        <CardContent className="p-6 bg-white dark:bg-gray-950 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm font-medium text-gray-500">Name (English)</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.name?.en}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Name (Hindi)</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.name?.hi || "N/A"}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Category</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.categoryId?.name?.[i18n.language] || dishData?.categoryId?.name?.en}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Subcategory</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.subCategoryId?.name?.[i18n.language] || dishData?.subCategoryId?.name?.en || "N/A"}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Spice Level</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.spiceLevel}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Vegetarian</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.isVegetarian ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Vegan</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {dishData?.isVegan ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Instructions</h3>
            <p className="text-gray-800 dark:text-gray-200">{dishData?.instructions || "N/A"}</p>
          </div>

          {/* Timing and Cost */}
          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm font-medium text-gray-500">Preparation Time</span>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {dishData?.preparationTimeMinutes || "N/A"} mins
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Cooking Time</span>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {dishData?.cookingTimeMinutes || "N/A"} mins
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Estimated Cost per Serving</span>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                ₹{dishData?.estimatedCostPerServing || 0}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Selling Price per Serving</span>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                ₹{dishData?.sellingPricePerServing || 0}
              </p>
            </div>
          </div>

          {/* Informative Line  */}
             <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 italic">
    The Quantity of ingredients is for 100 people.
  </p>

          {/* Ingredients */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Ingredients</h3>
            {dishData?.ingredients?.length > 0 ? (
              <ul className="list-disc ml-6 space-y-1">
                {dishData.ingredients.map((ing, i) => (
                  <li key={i} className="text-gray-800 dark:text-gray-200">
                    {ing.ingredientId?.name?.[i18n.language] || ing.ingredientId?.name?.en} –{" "}
                    {ing.quantity} {ing.ingredientId?.unitTypeId?.symbol}{" "}
                    {ing.isMainIngredient && <span className="text-green-600 font-semibold">(Main)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-400">No ingredients added</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

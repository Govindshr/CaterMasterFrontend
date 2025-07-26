// UI for adding a new dish along with ingredients
// Design inspired by AddBooking component provided

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { protectedPostApi, protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function AddDish() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [dishCategories, setDishCategories] = useState([]);
  const [dishSubCategories, setDishSubCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [dishForm, setDishForm] = useState({
    nameEn: "",
    nameHi: "",
    categoryId: "",
    subCategoryId: "",
    isVegetarian: true,
    isVegan: false,
    spiceLevel: "medium",
    instructions: "",
    preparationTimeMinutes: "",
    cookingTimeMinutes: "",
    estimatedCostPerServing: "",
    sellingPricePerServing: "",
    baseServingPeople: "", // ✅ NEW FIELD
  });

  const [ingredientRows, setIngredientRows] = useState([
    { ingredientId: "", quantity: "", isMain: true, unit: "" },
  ]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchIngredients();
  }, [i18n.language]);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetDishCategories, token);
    setDishCategories(res.data || []);
  };

  const fetchSubCategories = async () => {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetDishSubCategories, token);
    setDishSubCategories(res.data || []);
  };

 const fetchIngredients = async () => {
  const token = localStorage.getItem("token");
  const res = await protectedGetApi(`${config.GetIngredients}?page=1&limit=1000`, token); // large limit to load all
  setIngredients(res?.data?.ingredients || []);
};


  const handleDishChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleIngredientChange = (index, key, value) => {
    setIngredientRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [key]: key === "isMain" ? value === "true" : value } : row
      )
    );
  };

  const addIngredientRow = () => {
    setIngredientRows((prev) => [...prev, { ingredientId: "", quantity: "", isMain: false, unit: "" }]);
  };

  const removeIngredientRow = (index) => {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    const token = localStorage.getItem("token");
    const payload = {
      name: { en: dishForm.nameEn, hi: dishForm.nameHi },
      categoryId: dishForm.categoryId,
      subCategoryId: dishForm.subCategoryId,
      instructions: dishForm.instructions,
      preparationTimeMinutes: parseInt(dishForm.preparationTimeMinutes, 10),
      cookingTimeMinutes: parseInt(dishForm.cookingTimeMinutes, 10),
      estimatedCostPerServing: parseFloat(dishForm.estimatedCostPerServing),
      sellingPricePerServing: parseFloat(dishForm.sellingPricePerServing),
       baseServingPeople: parseInt(dishForm.baseServingPeople, 10), // ✅ NEW FIELD INCLUDED
      isVegetarian: dishForm.isVegetarian,
      isVegan: dishForm.isVegan,
      spiceLevel: dishForm.spiceLevel,
      ingredients: ingredientRows.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: parseFloat(ing.quantity),
        isMainIngredient: ing.isMain,
      })),
    };

    try {
      const res = await protectedPostApi(config.AddDish, payload, token);
      alert("Dish Created Successfully!");
      navigate("/items-list");
    } catch (error) {
      setApiError(error.message || "Error while saving dish");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-6xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-5">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Add Dish</h2>
            <Button variant="outline" className="bg-white text-green-700" onClick={() => navigate("/dishes")}>Back</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-950">
          {apiError && <div className="text-red-600 mb-4">{apiError}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name (English)</Label>
                <Input name="nameEn" value={dishForm.nameEn} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Name (Hindi)</Label>
                <Input name="nameHi" value={dishForm.nameHi} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={dishForm.categoryId} onValueChange={(val) => setDishForm((prev) => ({ ...prev, categoryId: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {dishCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name?.[i18n.language] || cat.name?.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory</Label>
                <Select value={dishForm.subCategoryId} onValueChange={(val) => setDishForm((prev) => ({ ...prev, subCategoryId: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select Subcategory" /></SelectTrigger>
                  <SelectContent>
                    {dishSubCategories.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>{sub.name?.[i18n.language] || sub.name?.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea name="instructions" value={dishForm.instructions} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Prep Time (min)</Label>
                <Input name="preparationTimeMinutes" type="number" value={dishForm.preparationTimeMinutes} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Cook Time (min)</Label>
                <Input name="cookingTimeMinutes" type="number" value={dishForm.cookingTimeMinutes} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Estimated Cost</Label>
                <Input name="estimatedCostPerServing" type="number" value={dishForm.estimatedCostPerServing} onChange={handleDishChange} />
              </div>
              <div>
                <Label>Selling Price</Label>
                <Input name="sellingPricePerServing" type="number" value={dishForm.sellingPricePerServing} onChange={handleDishChange} />
              </div>
              <div>
  <Label>Base Serving People</Label>
  <Input
    name="baseServingPeople"
    type="number"
    value={dishForm.baseServingPeople}
    onChange={handleDishChange}
  />
</div>

              <div>
                <Label>Spice Level</Label>
                <select name="spiceLevel" value={dishForm.spiceLevel} onChange={handleDishChange} className="w-full">
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="hot">Hot</option>
                  <option value="extra-hot">Extra Hot</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <Label className="text-lg font-bold mb-2 block">Ingredients</Label>
              {ingredientRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-3 items-center mb-3">
                  <select value={row.ingredientId} onChange={(e) => handleIngredientChange(idx, "ingredientId", e.target.value)} className="col-span-2">
                    <option value="">Select Ingredient</option>
                    {ingredients.map((ing) => (
                      <option key={ing._id} value={ing._id}>{ing.name?.[i18n.language] || ing.name?.en}</option>
                    ))}
                  </select>
                  <Input type="number" placeholder="Qty" value={row.quantity} onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)} />
                  <select value={String(row.isMain)} onChange={(e) => handleIngredientChange(idx, "isMain", e.target.value)}>
                    <option value="true">Main</option>
                    <option value="false">Extra</option>
                  </select>
                  <Button type="button" variant="ghost" onClick={() => removeIngredientRow(idx)}>🗑️</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addIngredientRow} className="mt-2"><PlusCircle className="w-4 h-4 mr-1" /> Add Ingredient</Button>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving Dish..." : "Save Dish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

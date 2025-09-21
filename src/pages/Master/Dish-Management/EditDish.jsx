// src/pages/UpdateDish.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { protectedGetApi, protectedUpdateApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import Swal from "sweetalert2";

export default function UpdateDish() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [dishCategories, setDishCategories] = useState([]);
  const [dishSubCategories, setDishSubCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [dishData, setDishData] = useState(null);
  const [errors, setErrors] = useState({});
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
    baseServingPeople: "",
  });

  const [ingredientRows, setIngredientRows] = useState([
    { ingredientId: "", quantity: "", isMain: true, unit: "" },
  ]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchIngredients();
    fetchDish();
  }, [i18n.language]);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    const res = await protectedGetApi(config.GetDishCategories, token);
    setDishCategories(res.data || []);
  };

  const fetchSubCategories = async () => {
    const res = await protectedGetApi(config.GetDishSubCategories, token);
    setDishSubCategories(res.data || []);
  };

  const fetchIngredients = async () => {
    const res = await protectedGetApi(
      `${config.GetIngredients}?page=1&limit=1000`,
      token
    );
    setIngredients(res?.data?.ingredients || []);
  };
   const getUnitSymbolFor = (ingredientId) => {
    if (!ingredientId) return "";
    const ing = ingredients.find((i) => i._id === ingredientId);
    return ing?.unitTypeId?.symbol || "";
  };
  useEffect(() => {
  if (dishData && ingredients.length > 0) {
    setIngredientRows(
      dishData.ingredients?.map((ing) => ({
        ingredientId: ing.ingredientId?._id,
        quantity: ing.quantity,
        isMain: ing.isMainIngredient,
        unit:
          ingredients.find((i) => i._id === ing.ingredientId?._id)?.unitTypeId
            ?.symbol || "",
      })) || []
    );
  }
}, [dishData, ingredients]);


const fetchDish = async () => {
  try {
    const res = await protectedGetApi(`${config.GetDishes}/${id}`, token);
    const dish = res.data;

    setDishData(dish); // keep full dish

    setDishForm({
      nameEn: dish.name?.en || "",
      nameHi: dish.name?.hi || "",
      categoryId: dish.categoryId?._id || "",
      subCategoryId: dish.subCategoryId?._id || "",
      isVegetarian: dish.isVegetarian,
      isVegan: dish.isVegan,
      spiceLevel: dish.spiceLevel,
      instructions: dish.instructions || "",
      preparationTimeMinutes: dish.preparationTimeMinutes || "",
      cookingTimeMinutes: dish.cookingTimeMinutes || "",
      estimatedCostPerServing: dish.estimatedCostPerServing || "",
      sellingPricePerServing: dish.sellingPricePerServing || "",
      baseServingPeople: dish.baseServingPeople || "",
    });
  } catch (err) {
    setApiError("Failed to load dish details");
  }
};


  const handleDishChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIngredientChange = (index, key, value) => {
    setIngredientRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [key]: key === "isMain" ? value === "true" : value }
          : row
      )
    );
  };

  const addIngredientRow = () => {
    setIngredientRows((prev) => [
      ...prev,
      { ingredientId: "", quantity: "", isMain: false, unit: "" },
    ]);
  };

  const removeIngredientRow = (index) => {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    const payload = {
      name: { en: dishForm.nameEn, hi: dishForm.nameHi },
      categoryId: dishForm.categoryId,
      subCategoryId: dishForm.subCategoryId,
      instructions: dishForm.instructions,
      ...(dishForm.preparationTimeMinutes && {
        preparationTimeMinutes: parseInt(dishForm.preparationTimeMinutes, 10),
      }),
      ...(dishForm.cookingTimeMinutes && {
        cookingTimeMinutes: parseInt(dishForm.cookingTimeMinutes, 10),
      }),
      ...(dishForm.estimatedCostPerServing && {
        estimatedCostPerServing: parseFloat(dishForm.estimatedCostPerServing),
      }),
      ...(dishForm.sellingPricePerServing && {
        sellingPricePerServing: parseFloat(dishForm.sellingPricePerServing),
      }),
      ...(dishForm.baseServingPeople && {
        baseServingPeople: parseInt(dishForm.baseServingPeople, 10),
      }),
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
      await protectedUpdateApi(`${config.GetDishes}/${id}`, payload, token);
     Swal.fire({
  icon: "success",
  title: "Success",
  text: "Dish updated successfully!",
  confirmButtonColor: "#16a34a", // green
}).then(() => {
  navigate("/items-list");
});

    } catch (error) {
      setApiError(error.message || "Error while updating dish");
    } finally {
      setIsLoading(false);
    }
  };
const filteredSubCategories = dishSubCategories.filter(
  (sub) => sub.categoryId === dishForm.categoryId
);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-6xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-5">
        <CardHeader className="p-4 sm:p-5 border-b bg-white dark:bg-gray-950">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Update Dish
            </h2>
            <Button variant="outline" onClick={() => navigate("/items-list")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-950">
          {apiError && <div className="text-red-600 mb-4">{apiError}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name (English)</Label>
                  <Input
                    name="nameEn"
                    value={dishForm.nameEn}
                    onChange={handleDishChange}
                  />
                  {errors.nameEn && (
                    <p className="text-red-500 text-sm">{errors.nameEn}</p>
                  )}
                </div>
                <div>
                  <Label>Name (Hindi)</Label>
                  <Input
                    name="nameHi"
                    placeholder="उदाहरण: पनीर टिक्का"
                    value={dishForm.nameHi}
                    onChange={handleDishChange}
                  />
                  {errors.nameHi && (
                    <p className="text-red-500 text-sm">{errors.nameHi}</p>
                  )}
                </div>
                <div>
                  <Label>Category</Label>
               <Select
  value={dishForm.categoryId}
  onValueChange={(val) =>
    setDishForm((prev) => ({
      ...prev,
      categoryId: val,
      subCategoryId: "", // ✅ reset subcategory when category changes
    }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>
  <SelectContent>
    {dishCategories.map((cat) => (
      <SelectItem key={cat._id} value={cat._id}>
        {cat.name?.[i18n.language] || cat.name?.en}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                  {errors.categoryId && (
                    <p className="text-red-500 text-sm">{errors.categoryId}</p>
                  )}
                </div>

              <div>
  <Label>Subcategory</Label>
  <Select
    value={dishForm.subCategoryId}
    onValueChange={(val) =>
      setDishForm((prev) => ({ ...prev, subCategoryId: val }))
    }
    disabled={!dishForm.categoryId} // ✅ disable until category is selected
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Subcategory" />
    </SelectTrigger>
    <SelectContent>
      {filteredSubCategories.map((sub) => (
        <SelectItem key={sub._id} value={sub._id}>
          {sub.name?.[i18n.language] || sub.name?.en}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.subCategoryId && (
    <p className="text-red-500 text-sm">{errors.subCategoryId}</p>
  )}
</div>

                <div className="md:col-span-2">
                  <Label>Instructions</Label>
                  <Textarea
                    name="instructions"
                    placeholder="Short cooking or plating notes"
                    value={dishForm.instructions}
                    onChange={handleDishChange}
                  />
                </div>
              </div>
            </section>

                        {/* Informative Line  */}
             <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 italic">
    The ingredients you are filling in this are for 100 people.
  </p>

            {/* Ingredients */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <div className="space-y-2">
                {ingredientRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-3 items-start border rounded-lg p-3 bg-gray-50 dark:bg-gray-900/40"
                  >
                    <div className="col-span-12 md:col-span-6">
                      <Label className="text-xs">Ingredient</Label>
                      <Select
   value={row.ingredientId}
   onValueChange={(val) => handleIngredientChange(idx, "ingredientId", val)}
 >
   <SelectTrigger className="w-full mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 shadow-sm">
     <SelectValue placeholder="Select Ingredient" />
   </SelectTrigger>
   <SelectContent>
     {ingredients.map((ing) => (
       <SelectItem key={ing._id} value={ing._id}>
         {ing.name?.[i18n.language] || ing.name?.en}
       </SelectItem>
     ))}
   </SelectContent>
 </Select>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <Label className="text-xs">Qty</Label>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          placeholder="ex-250"
                          value={row.quantity}
                          onChange={(e) =>
                            handleIngredientChange(
                              idx,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="pr-14"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {getUnitSymbolFor(row.ingredientId)}
                        </span>
                      </div>
                      {errors[`quantity_${idx}`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`quantity_${idx}`]}</p>
                      )}
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <Label className="text-xs">Type</Label>
                      <Select
   value={String(row.isMain)}
   onValueChange={(val) => handleIngredientChange(idx, "isMain", val)}
 >
   <SelectTrigger className="w-full mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 shadow-sm">
     <SelectValue placeholder="Select Type" />
   </SelectTrigger>
   <SelectContent>
     <SelectItem value="true">Main</SelectItem>
     <SelectItem value="false">Extra</SelectItem>
   </SelectContent>
 </Select>
                    </div>
                    <div className="col-span-1 flex justify-end items-end mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-gray-400"
                        onClick={() => ingredientRows.length > 1 && removeIngredientRow(idx)}
                        disabled={ingredientRows.length === 1}
                        aria-label="Remove ingredient"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button type="button" variant="outline" onClick={addIngredientRow} className="w-full md:w-auto">
                  <PlusCircle className="w-4 h-4 mr-1" /> Add Ingredient
                </Button>
              </div>
            </section>


            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Updating Dish..." : "Update Dish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

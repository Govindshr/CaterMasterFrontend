// AddIngredient component for adding new ingredients
// Responsive, styled in blue theme

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { protectedGetApi, protectedPostApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function AddIngredient() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [ingredientTypes, setIngredientTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameHi: "",
    ingredientTypeId: "",
    unitTypeId: "",
    pricePerUnit: "",
    descriptionEn: "",
    descriptionHi: "",
    isPerishable: false,
    shelfLifeDays: "",
    supplier: "",
  });

  useEffect(() => {
    fetchDropdowns();
  }, [i18n.language]);

  const fetchDropdowns = async () => {
    const token = localStorage.getItem("token");
    const [typeRes, unitRes] = await Promise.all([
      protectedGetApi(config.GetIngredientTypes, token),
      protectedGetApi(config.GetUnitTypes, token),
    ]);
    setIngredientTypes(typeRes?.data || []);
    setUnitTypes(unitRes?.data || []);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    const payload = {
      name: { en: formData.nameEn, hi: formData.nameHi },
      description: { en: formData.descriptionEn, hi: formData.descriptionHi },
      ingredientTypeId: formData.ingredientTypeId,
      unitTypeId: formData.unitTypeId,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      isPerishable: formData.isPerishable,
      shelfLifeDays: parseInt(formData.shelfLifeDays, 10),
      supplier: formData.supplier,
    };

    try {
      const token = localStorage.getItem("token");
      await protectedPostApi(config.AddIngredients, payload, token);
      alert("Ingredient Added Successfully!");
      navigate("/all-ingredients");
    } catch (error) {
      setApiError(error.message || "Failed to add ingredient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900 px-3 py-6">
      <Card className="w-full max-w-4xl shadow-xl border border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">Add Ingredient</h2>
            <Button variant="outline" className="bg-white text-blue-700" onClick={() => navigate("/all-ingredients")}> <ArrowLeft className="w-5 h-5 mr-1" /> Back</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-950">
          {apiError && <div className="text-red-600 mb-3">{apiError}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name (English)</Label>
              <Input name="nameEn" value={formData.nameEn} onChange={handleChange} required />
            </div>
            <div>
              <Label>Name (Hindi)</Label>
              <Input name="nameHi" value={formData.nameHi} onChange={handleChange} />
            </div>
            <div>
              <Label>Description (EN)</Label>
              <Textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} />
            </div>
            <div>
              <Label>Description (HI)</Label>
              <Textarea name="descriptionHi" value={formData.descriptionHi} onChange={handleChange} />
            </div>
            <div>
              <Label>Ingredient Type</Label>
              <Select value={formData.ingredientTypeId} onValueChange={(val) => setFormData((prev) => ({ ...prev, ingredientTypeId: val }))}>
                <SelectTrigger><SelectValue placeholder="Select Ingredient Type" /></SelectTrigger>
                <SelectContent>
                  {ingredientTypes.map((type) => (
                    <SelectItem key={type._id} value={type._id}>{type.name?.[i18n.language] || type.name?.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit Type</Label>
              <Select value={formData.unitTypeId} onValueChange={(val) => setFormData((prev) => ({ ...prev, unitTypeId: val }))}>
                <SelectTrigger><SelectValue placeholder="Select Unit Type" /></SelectTrigger>
                <SelectContent>
                  {unitTypes.map((unit) => (
                    <SelectItem key={unit._id} value={unit._id}>{unit.name?.[i18n.language] || unit.name?.en} ({unit.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price Per Unit</Label>
              <Input name="pricePerUnit" type="number" value={formData.pricePerUnit} onChange={handleChange} required />
            </div>
            <div>
              <Label>Shelf Life (Days)</Label>
              <Input name="shelfLifeDays" type="number" value={formData.shelfLifeDays} onChange={handleChange} />
            </div>
            <div>
              <Label>Supplier</Label>
              <Input name="supplier" value={formData.supplier} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="isPerishable" checked={formData.isPerishable} onChange={handleChange} />
              <Label className="text-sm">Is Perishable?</Label>
            </div>
            <div className="md:col-span-2 mt-6">
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">
                {isLoading ? "Saving..." : "Add Ingredient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function AddNewItem() {
  const [itemName, setItemName] = useState({ en: "", hi: "" });
  const [category, setCategory] = useState({ en: "Sweet", hi: "मिठाई" });
  const [subcategory, setSubcategory] = useState({ en: "", hi: "" });
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

  const categories = [
    { en: "Sweet", hi: "मिठाई" },
    { en: "Main Course", hi: "मुख्य व्यंजन" },
    { en: "Beverage", hi: "पेय" },
  ];

  const subcategories = {
    Sweet: [
      { en: "Ladoo", hi: "लड्डू" },
      { en: "Barfi", hi: "बर्फी" },
      { en: "Jalebi", hi: "जलेबी" },
    ],
    "Main Course": [
      { en: "Paneer", hi: "पनीर" },
      { en: "Dal", hi: "दाल" },
      { en: "Rice", hi: "चावल" },
    ],
    Beverage: [
      { en: "Tea", hi: "चाय" },
      { en: "Coffee", hi: "कॉफ़ी" },
      { en: "Juice", hi: "जूस" },
    ],
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ itemName, category, subcategory, ingredients });
    // send to backend
  };

  return (
    <div className="max-w-8xl mx-auto">
      <Card className="shadow-lg rounded-lg p-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Item</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Category */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <Label>Item Category (English)</Label>
                <Select onValueChange={(val) => setCategory(JSON.parse(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat, i) => (
                      <SelectItem key={i} value={JSON.stringify(cat)}>
                        {cat.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label className="mt-2">Item Category (Hindi)</Label>
                <Input value={category.hi} disabled />
              </div>

              {/* Subcategory */}
              <div className="w-1/2">
                <Label>Subcategory (English)</Label>
                <Select onValueChange={(val) => setSubcategory(JSON.parse(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subcategories[category.en] || []).map((sub, i) => (
                      <SelectItem key={i} value={JSON.stringify(sub)}>
                        {sub.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label className="mt-2">Subcategory (Hindi)</Label>
                <Input value={subcategory.hi} disabled />
              </div>
            </div>

            {/* Item Name */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <Label>Item Name (English)</Label>
                <Input
                  value={itemName.en}
                  onChange={(e) =>
                    setItemName({ ...itemName, en: e.target.value })
                  }
                />
              </div>
              <div className="w-1/2">
                <Label>Item Name (Hindi)</Label>
                <Input
                  value={itemName.hi}
                  onChange={(e) =>
                    setItemName({ ...itemName, hi: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <Label>Ingredients</Label>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Name"
                    value={ing.name}
                    onChange={(e) =>
                      handleIngredientChange(i, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Quantity (gm)"
                    value={ing.quantity}
                    onChange={(e) =>
                      handleIngredientChange(i, "quantity", e.target.value)
                    }
                  />
                  <Button variant="destructive" onClick={() => removeIngredient(i)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              <Button className="mt-3" onClick={addIngredient}>
                <Plus className="w-5 h-5 mr-2" /> Add Ingredient
              </Button>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Save Item
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

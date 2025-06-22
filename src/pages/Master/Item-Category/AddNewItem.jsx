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
const [majorIngredient, setMajorIngredient] = useState("");
const [majorQty, setMajorQty] = useState("");
const [minorIngredients, setMinorIngredients] = useState([
  { ingredient_id: "", quantity: "" }
]);
const [sufficientFor, setSufficientFor] = useState("");
const [notes, setNotes] = useState("");
const ingredientOptions = [
  { id: "milk", name: "Milk" },
  { id: "sugar", name: "Sugar" },
  { id: "cardamom", name: "Cardamom" },
]; // Replace with API fetch later

  const categories = [
    { en: "Sweet", hi: "मिठाई" },
    { en: "Main Course", hi: "मुख्य व्यंजन" },
    { en: "Beverage", hi: "पेय" },
  ];

  const subcategories = {
    Sweet: [
      { en: "Milk", hi: "दूध" },
      { en: "Dry Fruit", hi: "मेवा" },
      { en: "Maida", hi: "मेडा" },
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

  const payload = {
    itemName,
    category,
    subcategory,
    majorIngredient,
    majorQty,
    minorIngredients,
    sufficientFor,
    notes,
  };

  console.log("Payload:", payload);
  // Send to backend API
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
<div className="flex space-x-4">
  <div className="w-1/2">
    <Label>Major Ingredient</Label>
    <Select onValueChange={(val) => setMajorIngredient(val)}>
      <SelectTrigger>
        <SelectValue placeholder="Select major ingredient" />
      </SelectTrigger>
      <SelectContent>
        {ingredientOptions.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="w-1/2">
    <Label>Major Quantity</Label>
    <Input
      type="text"
      placeholder="e.g., 1kg"
      value={majorQty}
      onChange={(e) => setMajorQty(e.target.value)}
    />
  </div>
</div>

          <div>
  <Label>Minor Ingredients</Label>
  {minorIngredients.map((ing, i) => (
    <div key={i} className="flex space-x-2 mt-2">
      <Select
        value={ing.ingredient_id}
        onValueChange={(val) => {
          const updated = [...minorIngredients];
          updated[i].ingredient_id = val;
          setMinorIngredients(updated);
        }}
      >
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder="Ingredient" />
        </SelectTrigger>
        <SelectContent>
          {ingredientOptions.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="w-1/2"
        placeholder="Quantity"
        value={ing.quantity}
        onChange={(e) => {
          const updated = [...minorIngredients];
          updated[i].quantity = e.target.value;
          setMinorIngredients(updated);
        }}
      />

      <Button variant="destructive" onClick={() =>
        setMinorIngredients(minorIngredients.filter((_, idx) => idx !== i))
      }>
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  ))}

  <Button className="mt-3" onClick={() =>
    setMinorIngredients([...minorIngredients, { ingredient_id: "", quantity: "" }])
  }>
    <Plus className="w-5 h-5 mr-2" /> Add Minor Ingredient
  </Button>
</div>

<div className="flex space-x-4 mt-4">
  <div className="w-1/2">
    <Label>Sufficient For</Label>
    <Input
      type="number"
      placeholder="Guests"
      value={sufficientFor}
      onChange={(e) => setSufficientFor(e.target.value)}
    />
  </div>
  <div className="w-1/2">
    <Label>Notes (optional)</Label>
    <Input
      type="text"
      placeholder="Extra details..."
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
  </div>
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

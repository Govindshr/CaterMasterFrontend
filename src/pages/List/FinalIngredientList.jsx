import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function FinalIngredientList() {
  const location = useLocation();
  const ingredients = location.state?.ingredients || {};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold">Final Ingredient List</h2>
        </CardHeader>
        <CardContent>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Ingredient</th>
                <th className="p-2 border">Total Qty (g)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ingredients).map(([name, qty]) => (
                <tr key={name}>
                  <td className="p-2 border">{name}</td>
                  <td className="p-2 border">{qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

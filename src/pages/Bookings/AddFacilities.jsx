import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddFacilities() {
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const facilities = [
    { id: "F001", name: "Dairy" },
    { id: "F002", name: "Transport" },
    { id: "F003", name: "Cold Storage" },
    { id: "F004", name: "Bakery" },
    { id: "F005", name: "Warehouse" },
    { id: "F006", name: "Packaging" },
    { id: "F007", name: "Laboratory" },
    { id: "F008", name: "Distribution Center" },
    { id: "F009", name: "Water Treatment" },
    { id: "F010", name: "Quality Control" }
  ];

  const toggleFacility = (id) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((facilityId) => facilityId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const selectedFacilityObjects = facilities.filter(facility => selectedFacilities.includes(facility.id));
    console.log("Selected Facilities:", selectedFacilityObjects);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <Card className="shadow-lg rounded-lg p-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Manage Facilities</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <label key={facility.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedFacilities.includes(facility.id)}
                  onCheckedChange={() => toggleFacility(facility.id)}
                />
                <span>{facility.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

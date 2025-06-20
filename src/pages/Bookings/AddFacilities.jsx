import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddFacilities() {
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [paidFacilities, setPaidFacilities] = useState({});

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
    setPaidFacilities((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      return updated;
    });
  };

  const handlePaidToggle = (id) => {
    setPaidFacilities((prev) => ({
      ...prev,
      [id]: { isPaid: !prev[id]?.isPaid, price: prev[id]?.price || "" },
    }));
  };

  const handlePriceChange = (id, value) => {
    setPaidFacilities((prev) => ({
      ...prev,
      [id]: { ...prev[id], price: value },
    }));
  };

  const handleSubmit = () => {
    const selectedFacilityObjects = facilities
      .filter(facility => selectedFacilities.includes(facility.id))
      .map(facility => ({
        ...facility,
        isPaid: paidFacilities[facility.id]?.isPaid || false,
        price: paidFacilities[facility.id]?.isPaid ? paidFacilities[facility.id]?.price : undefined,
      }));
    console.log("Selected Facilities:", selectedFacilityObjects);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6 mb-5">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-5">
        <CardHeader className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight text-center">Manage Facilities</h2>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-white dark:bg-gray-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <label
                key={facility.id}
                className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-3 shadow-sm border border-gray-200 dark:border-gray-800 transition-all cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedFacilities.includes(facility.id)}
                    onCheckedChange={() => toggleFacility(facility.id)}
                    className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-base">{facility.name}</span>
                </div>
                {selectedFacilities.includes(facility.id) && (
                  <div className="flex items-center gap-2 mt-2 ml-7">
                    <input
                      type="checkbox"
                      id={`isPaid-${facility.id}`}
                      checked={!!paidFacilities[facility.id]?.isPaid}
                      onChange={() => handlePaidToggle(facility.id)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <label htmlFor={`isPaid-${facility.id}`} className="text-sm text-gray-700 dark:text-gray-300 select-none">Is Paid?</label>
                    {paidFacilities[facility.id]?.isPaid && (
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={paidFacilities[facility.id]?.price || ""}
                        onChange={e => handlePriceChange(facility.id, e.target.value)}
                        className="ml-3 w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    )}
                  </div>
                )}
              </label>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all text-base md:text-lg" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

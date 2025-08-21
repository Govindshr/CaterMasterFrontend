import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function FinalIngredientList() {
  const { id, eventId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Determine if this is an event or booking report based on URL
    const isEventReport = window.location.pathname.includes('/event/');
    fetchAllDishQuantities(isEventReport);
  }, [id, eventId]);

  const fetchAllDishQuantities = async (isEventReport = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Call the appropriate API based on report type
      const apiUrl = isEventReport 
        ? config.GenerateEventList(eventId || id)
        : config.GenerateList(id);
      
      const response = await protectedGetApi(apiUrl, token);
      if (response.success) {
        console.log("final list ", response);
        setReportData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch dish quantities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format quantity with unit
  const formatQuantity = (quantity, unit) => {
    return `${quantity.toLocaleString()} ${unit}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading ingredient quantities...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-8 text-gray-500">
          <p>No data available. Please go back and save quantities for your dishes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-8xl mx-auto space-y-8">
      {/* Header Card */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 bg-white border-b border-l-4 border-blue-600">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold leading-tight">
                {window.location.pathname.includes('/event/') ? 'Event Ingredient List' : 'Final Ingredient List'}
              </h2>
              <p className="text-sm text-gray-500 truncate">{reportData.reportName}</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 items-baseline">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Total Cost</span>
                  <span className="text-lg font-semibold text-green-600">{formatCurrency(reportData.summary.totalCost)}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Ingredients</span>
                  <span className="text-sm font-semibold text-gray-800">{reportData.summary.totalUniqueIngredients}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

             {/* Booking/Event Details */}
      {reportData.bookingDetails && (
        <Card className="shadow-md">
          <CardHeader className="p-4 bg-white border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-800">📅 Booking Summary</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {reportData.bookingDetails.dateRange && (
                <div>
                  <span className="font-medium text-gray-600">Date Range:</span>
                  <p className="text-gray-800">
                    {new Date(reportData.bookingDetails.dateRange.start).toLocaleDateString()} - {new Date(reportData.bookingDetails.dateRange.end).toLocaleDateString()}
                  </p>
                </div>
              )}
              {reportData.bookingDetails.totalDays && (
                <div>
                  <span className="font-medium text-gray-600">Total Days:</span>
                  <p className="text-gray-800">{reportData.bookingDetails.totalDays}</p>
                </div>
              )}
              {reportData.bookingDetails.totalOccasions && (
                <div>
                  <span className="font-medium text-gray-600">Total Occasions:</span>
                  <p className="text-gray-800">{reportData.bookingDetails.totalOccasions}</p>
                </div>
              )}
              {reportData.bookingDetails.totalEvents && (
                <div>
                  <span className="font-medium text-gray-600">Total Events:</span>
                  <p className="text-gray-800">{reportData.bookingDetails.totalEvents}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

             {/* Ingredients by Type */}
      {reportData.ingredientsByType && Object.entries(reportData.ingredientsByType).map(([typeName, ingredients]) => (
       <Card key={typeName} className="shadow-md">
         <CardHeader className="p-4 bg-white border-l-4 border-amber-500">
           <h3 className="text-lg font-semibold text-gray-800">
             🥘 {typeName} ({ingredients.length} items)
           </h3>
         </CardHeader>
         <CardContent className="p-0">
           {/* Desktop / Tablet table */}
           <div className="overflow-x-auto hidden md:block">
             <table className="w-full text-sm">
               <thead>
                 <tr className="bg-blue-50 border-b">
                   <th className="p-3 text-left font-semibold text-gray-700">Ingredient</th>
                   <th className="p-3 text-left font-semibold text-gray-700">Total Quantity</th>
                   <th className="p-3 text-left font-semibold text-gray-700">Unit Price</th>
                   <th className="p-3 text-left font-semibold text-gray-700">Total Cost</th>
                   <th className="p-3 text-left font-semibold text-gray-700">Supplier</th>
                 </tr>
               </thead>
               <tbody>
                 {ingredients.map((item, index) => (
                   <tr key={item.ingredient._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                     <td className="p-3">
                       <div>
                         <span className="font-medium text-gray-800">{item.ingredient.name.en}</span>
                         {item.ingredient.name.hi && (
                           <p className="text-xs text-gray-500">{item.ingredient.name.hi}</p>
                         )}
                       </div>
                     </td>
                     <td className="p-3">
                       <span className="font-medium text-blue-600">
                         {formatQuantity(item.totalQuantity, item.ingredient.unitTypeId.symbol)}
                       </span>
                     </td>
                     <td className="p-3">
                       <span className="text-gray-600">
                         {formatCurrency(item.pricePerUnit)}/{item.ingredient.unitTypeId.symbol}
                       </span>
                     </td>
                     <td className="p-3">
                       <span className="font-semibold text-green-600">
                         {formatCurrency(item.totalCost)}
                       </span>
                     </td>
                     <td className="p-3">
                       <span className="text-gray-600">{item.ingredient.supplier}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* Mobile: card list */}
           <div className="md:hidden divide-y">
             {ingredients.map((item) => (
               <div key={item.ingredient._id} className="p-3">
                 <div className="flex items-start justify-between">
                   <div className="min-w-0">
                     <p className="font-medium text-gray-900 truncate">{item.ingredient.name.en}</p>
                     {item.ingredient.name.hi && (
                       <p className="text-xs text-gray-500">{item.ingredient.name.hi}</p>
                     )}
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500">Total</p>
                     <p className="text-sm font-semibold text-blue-600">{formatQuantity(item.totalQuantity, item.ingredient.unitTypeId.symbol)}</p>
                   </div>
                 </div>
                 <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                   <div>
                     <p className="text-xs text-gray-500">Unit Price</p>
                     <p className="text-gray-700">{formatCurrency(item.pricePerUnit)}/{item.ingredient.unitTypeId.symbol}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500">Total Cost</p>
                     <p className="font-semibold text-green-600">{formatCurrency(item.totalCost)}</p>
                   </div>
                 </div>
                 {item.ingredient.supplier && (
                   <p className="mt-1 text-xs text-gray-500">Supplier: <span className="text-gray-700">{item.ingredient.supplier}</span></p>
                 )}
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
     ))}

             {/* Summary Card */}
      {reportData.summary && (
        <Card className="shadow-lg">
          <CardHeader className="p-4 bg-white border-l-4 border-green-600">
            <h3 className="text-lg font-semibold">💰 Cost Summary</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Overall Summary</h4>
                <div className="space-y-2 text-sm">
                  {reportData.summary.totalCost && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(reportData.summary.totalCost)}</span>
                    </div>
                  )}
                  {reportData.summary.totalUniqueIngredients && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Ingredients:</span>
                      <span className="font-semibold">{reportData.summary.totalUniqueIngredients}</span>
                    </div>
                  )}
                  {reportData.summary.totalIngredientTypes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingredient Types:</span>
                      <span className="font-semibold">{reportData.summary.totalIngredientTypes}</span>
                    </div>
                  )}
                </div>
              </div>
              {reportData.summary.supplierWiseCost && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Supplier-wise Cost</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(reportData.summary.supplierWiseCost).map(([supplier, cost]) => (
                      <div key={supplier} className="flex justify-between">
                        <span className="text-gray-600">{supplier}:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

             {/* Purchase List */}
      {reportData.purchaseList && (
        <Card className="shadow-lg">
          <CardHeader className="p-4 bg-white border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold">📋 Purchase List</h3>
          </CardHeader>
          <CardContent className="p-6">
            {reportData.purchaseList.map((purchaseGroup, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">{purchaseGroup.ingredientType}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {purchaseGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.quantity}</div>
                      <div className="text-xs text-gray-500">Supplier: {item.supplier}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

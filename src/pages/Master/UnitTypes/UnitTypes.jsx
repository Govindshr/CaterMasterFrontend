import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { config } from "@/services/nodeconfig";
import {
  protectedGetApi,
  protectedPostApi,
  protectedDeleteApi,
} from "@/services/nodeapi";

export default function UnitTypes() {
  const { i18n } = useTranslation();
  const [units, setUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [symbol, setSymbol] = useState("");
  const [category, setCategory] = useState("weight");
  const [conversionToBase, setConversionToBase] = useState("1");
const [errors, setErrors] = useState({});
  useEffect(() => {
    fetchUnits();
  }, [i18n.language]);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetUnitTypes, token);
      if (res.success === true) {
        setUnits(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch unit types", err);
    }
  };

  const addUnit = async () => {
     const newErrors = {};
   if (!nameEn.trim()) newErrors.nameEn = "English name is required.";
   if (!nameHi.trim()) newErrors.nameHi = "Hindi name is required.";
   if (!symbol.trim()) newErrors.symbol = "Symbol is required.";
   if (!category.trim()) newErrors.category = "Category is required.";
   if (!conversionToBase || parseFloat(conversionToBase) <= 0) {
     newErrors.conversionToBase = "Conversion must be greater than 0.";
   }

   if (Object.keys(newErrors).length > 0) {
     setErrors(newErrors);
     return;
   }
   setErrors({});
    try {
      const token = localStorage.getItem("token");
      const res = await protectedPostApi(
        config.AddUnitTypes,
        {
          name: { en: nameEn, hi: nameHi },
          symbol,
          category,
          conversionToBase: parseFloat(conversionToBase),
        },
        token
      );
      if (res?.data) {
        fetchUnits();
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
        setSymbol("");
        setCategory("weight");
        setConversionToBase("1");
      }
    } catch (err) {
      console.error("Failed to add unit type", err);
    }
  };

  const deleteUnit = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this unit type?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await protectedDeleteApi(config.DeleteUnitTypes(id), token);
        Swal.fire("Deleted!", "The unit type was removed.", "success");
        fetchUnits();
      } catch (error) {
        Swal.fire("Error", error.message || "Delete failed", "error");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Unit Types
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage measurement units
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Unit Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 w-[90vw] max-w-lg transition-all duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Unit Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Name (English)</Label>
                     
                      <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={errors.nameEn ? "border-red-500 focus:ring-red-500" : ""}/>
                       {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
                    </div>
                    <div>
                      <Label>Name (Hindi)</Label>
                      <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} className={errors.nameHi ? "border-red-500 focus:ring-red-500" : ""}/>
                       {errors.nameHi && <p className="text-red-500 text-sm mt-1">{errors.nameHi}</p>}
                    </div>
                    <div>
                      <Label>Symbol</Label>
                       <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} className={errors.symbol ? "border-red-500 focus:ring-red-500" : ""}/>
                       {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
                    </div>
                    <div>
                      <Label>Category</Label>
                     <Select value={category} onValueChange={(val) => setCategory(val)}>
   <SelectTrigger className={`w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm ${errors.category ? "border-red-500" : ""}`}>
     <SelectValue placeholder="Select Category" />
   </SelectTrigger>
   <SelectContent>
     <SelectItem value="weight">Weight</SelectItem>
     <SelectItem value="volume">Volume</SelectItem>
     <SelectItem value="length">Length</SelectItem>
     <SelectItem value="quantity">Quantity</SelectItem>
   </SelectContent>
 </Select>
 {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    {/* <div>
                      <Label>Conversion To Base</Label>
                     
                       <Input  type="number" step="any" value={conversionToBase} onChange={(e) => setConversionToBase(e.target.value)} className={errors.conversionToBase ? "border-red-500 focus:ring-red-500" : ""}/>
                       {errors.conversionToBase && <p className="text-red-500 text-sm mt-1">{errors.conversionToBase}</p>}
                    </div> */}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addUnit}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Category</TableHead>
                    {/* <TableHead>Conversion</TableHead> */}
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.length > 0 ? (
                    units.map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell>{unit.name?.[i18n.language] || unit.name?.en}</TableCell>
                        <TableCell>{unit.symbol}</TableCell>
                        <TableCell>{unit.category}</TableCell>
                        {/* <TableCell>{unit.conversionToBase}</TableCell> */}
                        <TableCell className="text-center">
                          <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            onClick={() => deleteUnit(unit._id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No unit types found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

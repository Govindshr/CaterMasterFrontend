import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    if (!nameEn.trim() || !nameHi.trim() || !symbol.trim() || !category.trim() || !conversionToBase) return;
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
                <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Unit Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Name (English)</Label>
                      <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                    </div>
                    <div>
                      <Label>Name (Hindi)</Label>
                      <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} />
                    </div>
                    <div>
                      <Label>Symbol</Label>
                      <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="weight">Weight</option>
                        <option value="volume">Volume</option>
                        <option value="length">Length</option>
                        <option value="quantity">Quantity</option>
                      </select>
                    </div>
                    <div>
                      <Label>Conversion To Base</Label>
                      <Input
                        type="number"
                        step="any"
                        value={conversionToBase}
                        onChange={(e) => setConversionToBase(e.target.value)}
                      />
                    </div>
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
                    <TableHead>Conversion</TableHead>
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
                        <TableCell>{unit.conversionToBase}</TableCell>
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

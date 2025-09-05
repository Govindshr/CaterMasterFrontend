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

export default function IngredientTypes() {
  const { i18n } = useTranslation();
  const [ingredients, setIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descHi, setDescHi] = useState("");
  const [color, setColor] = useState("#FFE4B5");
const [errors, setErrors] = useState({});
  useEffect(() => {
    fetchIngredients();
  }, [i18n.language]);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetIngredientTypes, token);
      if (res.success === true) {
        setIngredients(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch ingredient types", err);
    }
  };

 const addIngredient = async () => {
    const newErrors = {};
    if (!nameEn.trim()) newErrors.nameEn = "English name is required.";
    if (!nameHi.trim()) newErrors.nameHi = "Hindi name is required.";
    if (!descEn.trim()) newErrors.descEn = "English description is required.";
    if (!descHi.trim()) newErrors.descHi = "Hindi description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const res = await protectedPostApi(
        config.AddIngredientTypes,
        {
          name: { en: nameEn, hi: nameHi },
          description: { en: descEn, hi: descHi },
          color,
        },
        token
      );
      if (res?.data) {
        fetchIngredients();
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
        setDescEn("");
        setDescHi("");
        setColor("#FFE4B5");
      }
    } catch (err) {
      console.error("Failed to add ingredient type", err);
    }
  };

  const deleteIngredient = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this ingredient type?",
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
        await protectedDeleteApi(config.DeleteIngredientTypes(id), token);
        Swal.fire("Deleted!", "The ingredient type was removed.", "success");
        fetchIngredients();
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
                  Ingredient Types
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage ingredient categories and tags
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Ingredient Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 w-[90vw] max-w-lg transition-all duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Ingredient Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Name (English)</Label>
                      {/* <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /> */}
                      <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={errors.nameEn ? "border-red-500 focus:ring-red-500" : ""} />
                      {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
                    </div>
                    <div>
                      <Label>Name (Hindi)</Label>
                      {/* <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} /> */}
                      <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} className={errors.nameHi ? "border-red-500 focus:ring-red-500" : ""} />
                      {errors.nameHi && <p className="text-red-500 text-sm mt-1">{errors.nameHi}</p>}
                    </div>
                    <div>
                      <Label>Description (English)</Label>
                      {/* <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} /> */}
                      <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} className={errors.descEn ? "border-red-500 focus:ring-red-500" : ""} />
                      {errors.descEn && <p className="text-red-500 text-sm mt-1">{errors.descEn}</p>}
                    </div>
                    <div>
                      <Label>Description (Hindi)</Label>
                      {/* <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} /> */}
                      <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} className={errors.descHi ? "border-red-500 focus:ring-red-500" : ""} />
                      {errors.descHi && <p className="text-red-500 text-sm mt-1">{errors.descHi}</p>}
                    </div>
                    {/* <div>
                      <Label>Color</Label>
                      <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div> */}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addIngredient}>
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
                    <TableHead>Description</TableHead>
                    {/* <TableHead>Color</TableHead> */}
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length > 0 ? (
                    ingredients.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name?.[i18n.language] || item.name?.en}</TableCell>
                        <TableCell>{item.description?.[i18n.language] || item.description?.en}</TableCell>
                        {/* <TableCell>
                          <span className="inline-block w-6 h-6 rounded-full border" style={{ backgroundColor: item.color }}></span>
                        </TableCell> */}
                        <TableCell className="text-center">
                          {(
    item.createdBy || 
    (() => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.userType === "admin";
      } catch {
        return false;
      }
    })()
  ) && (
    <button
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
      onClick={() => deleteIngredient(item._id)}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No ingredient types found
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
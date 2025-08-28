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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function DishSubCategory() {
  const { i18n } = useTranslation();
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descHi, setDescHi] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [categoryId, setCategoryId] = useState("");
const [errors, setErrors] = useState({});
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [i18n.language]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishCategories, token);
      if (res.success === true) {
        setCategories(res.data || []);
        if (res.data?.[0]?._id) setCategoryId(res.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishSubCategories, token);
      if (res.success === true) {
        setSubCategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch sub-categories", err);
    }
  };

 const addSubCategory = async () => {
    const newErrors = {};
    if (!nameEn.trim()) newErrors.nameEn = "English name is required.";
    if (!nameHi.trim()) newErrors.nameHi = "Hindi name is required.";
    if (!descEn.trim()) newErrors.descEn = "English description is required.";
    if (!descHi.trim()) newErrors.descHi = "Hindi description is required.";
    if (!categoryId) newErrors.categoryId = "Dish category is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const res = await protectedPostApi(
        config.AddDishSubCategories,
        {
          name: { en: nameEn, hi: nameHi },
          description: { en: descEn, hi: descHi },
          categoryId,
          sortOrder: parseInt(sortOrder, 10),
        },
        token
      );
      if (res?.data) {
        fetchSubCategories();
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
        setDescEn("");
        setDescHi("");
        setSortOrder("1");
        setCategoryId(categories[0]?._id || "");
      }
    } catch (err) {
      console.error("Failed to add sub-category", err);
    }
  };

  const deleteSubCategory = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this sub-category?",
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
        await protectedDeleteApi(config.DeleteDishSubCategories(id), token);
        Swal.fire("Deleted!", "The sub-category was removed.", "success");
        fetchSubCategories();
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
                  Dish Sub-Categories
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage all sub-categories under dish categories
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Sub-Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 w-[90vw] max-w-lg transition-all duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Dish Sub-Category
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Sub-Category Name (English)</Label>
                      {/* <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /> */}
                       <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={errors.nameEn ? "border-red-500 focus:ring-red-500" : ""} />
                       {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
                    </div>
                    <div>
                      <Label>Sub-Category Name (Hindi)</Label>
                      {/* <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} /> */}
                       <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} className={errors.nameHi ? "border-red-500 focus:ring-red-500" : ""} />
                       {errors.nameHi && <p className="text-red-500 text-sm mt-1">{errors.nameHi}</p>}
                    </div>
                    <div>
                      <Label>Description (English)</Label>
                      {/* <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} /> */}
                       <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} className={errors.descEn ? "border-red-500 focus:ring-red-500" : ""} />
                       {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.descEn}</p>}
                    </div>
                    <div>
                      <Label>Description (Hindi)</Label>
                      {/* <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} /> */}
                       <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} className={errors.descHi ? "border-red-500 focus:ring-red-500" : ""} />
                       {errors.descHi && <p className="text-red-500 text-sm mt-1">{errors.descHi}</p>}
                    </div>
                    <div>
                      <Label>Dish Category</Label>
                     <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
   <SelectTrigger className={`w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm ${errors.categoryId ? "border-red-500" : ""}`}>
     <SelectValue placeholder="Select Dish Category" />
   </SelectTrigger>
   <SelectContent>
     {categories.map((cat) => (
       <SelectItem key={cat._id} value={cat._id}>
         {cat.name?.[i18n.language] || cat.name?.en}
       </SelectItem>
     ))}
   </SelectContent>
 </Select>
 {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                    </div>
                    {/* <div>
                      <Label>Sort Order</Label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </div> */}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addSubCategory}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 hidden md:block">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subCategories.length > 0 ? (
                    subCategories.map((sub, index) => (
                      <TableRow key={index}>
                        <TableCell>{sub.name?.[i18n.language] || sub.name?.en}</TableCell>
                        <TableCell>{sub.description?.[i18n.language] || sub.description?.en}</TableCell>
                        <TableCell>
                          {
                            categories.find((cat) => cat._id === sub.categoryId)?.name?.[i18n.language] ||
                            categories.find((cat) => cat._id === sub.categoryId)?.name?.en || "-"
                          }
                        </TableCell>
                        <TableCell>{sub.sortOrder}</TableCell>
                        <TableCell className="text-center">
                          <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            onClick={() => deleteSubCategory(sub._id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No sub-categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: card list */}
            <div className="md:hidden space-y-3">
              {subCategories.length > 0 ? (
                subCategories.map((sub, index) => {
                  const cat = categories.find((c) => c._id === sub.categoryId);
                  const categoryName = cat?.name?.[i18n.language] || cat?.name?.en || "-";
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate dark:text-gray-100">
                            {sub.name?.[i18n.language] || sub.name?.en}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                            {sub.description?.[i18n.language] || sub.description?.en}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/40">
                              {categoryName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Sort: {sub.sortOrder}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <button
                            className="inline-flex items-center rounded-md px-2 py-1 text-sm text-red-600 hover:text-red-700"
                            onClick={() => deleteSubCategory(sub._id)}
                            title="Delete Sub-Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">No sub-categories found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
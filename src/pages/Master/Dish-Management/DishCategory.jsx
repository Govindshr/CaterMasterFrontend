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

export default function DishCategory() {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descHi, setDescHi] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  useEffect(() => {
    fetchCategories();
  }, [i18n.language]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishCategories, token);
      if (res.success === true) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch dish categories", err);
    }
  };

  const addCategory = async () => {
    if (!nameEn.trim() || !nameHi.trim() || !descEn.trim() || !descHi.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await protectedPostApi(
        config.AddDishCategories,
        {
          name: { en: nameEn, hi: nameHi },
          description: { en: descEn, hi: descHi },
          sortOrder: parseInt(sortOrder, 10),
        },
        token
      );
      if (res?.data) {
        fetchCategories();
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
        setDescEn("");
        setDescHi("");
        setSortOrder("1");
      }
    } catch (err) {
      console.error("Failed to add dish category", err);
    }
  };

  const deleteCategory = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this category?",
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
        await protectedDeleteApi(config.DeleteDishCategories(id), token);
        Swal.fire("Deleted!", "The dish category was removed.", "success");
        fetchCategories();
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
                  Dish Categories
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage all available dish categories
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Dish Category
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Category Name (English)</Label>
                      <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                    </div>
                    <div>
                      <Label>Category Name (Hindi)</Label>
                      <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description (English)</Label>
                      <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description (Hindi)</Label>
                      <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} />
                    </div>
                    <div>
                      <Label>Sort Order</Label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full form-control mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addCategory}>
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
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length > 0 ? (
                    categories.map((cat, index) => (
                      <TableRow key={index}>
                        <TableCell>{cat.name?.[i18n.language] || cat.name?.en}</TableCell>
                        <TableCell>{cat.description?.[i18n.language] || cat.description?.en}</TableCell>
                        <TableCell>{cat.sortOrder}</TableCell>
                        <TableCell className="text-center">
                          <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            onClick={() => deleteCategory(cat._id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No categories found
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

// src/pages/Ingredients.jsx
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
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { config } from "@/services/nodeconfig";
import { postApi, getApi } from "@/services/nodeapi";

export default function Ingredients() {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [unitEn, setUnitEn] = useState("");
  const [unitHi, setUnitHi] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(ingredients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedIngredients = ingredients.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchIngredients();
  }, [i18n.language]);

  const fetchIngredients = async () => {
    try {
      const res = await getApi(config.GetIngredients);
      setIngredients(res);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const addIngredient = async () => {
    if (!nameEn.trim() || !nameHi.trim() || !unitEn.trim() || !unitHi.trim()) return;
    try {
      await postApi(config.AddIngredient, {
        name: {
          en: nameEn,
          hi: nameHi,
        },
        unit: {
          en: unitEn,
          hi: unitHi,
        },
      });
      setIsModalOpen(false);
      setNameEn("");
      setNameHi("");
      setUnitEn("");
      setUnitHi("");
      fetchIngredients();
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex-row justify-between border-b p-4">
          <h2 className="text-2xl font-bold">Ingredients</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" /> Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Add New Ingredient
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label className="text-gray-700">Ingredient Name (English)</Label>
                <Input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Enter name in English"
                />
                <Label className="text-gray-700">Ingredient Name (Hindi)</Label>
                <Input
                  type="text"
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="Enter name in Hindi"
                />
                <Label className="text-gray-700">Unit (English)</Label>
                <Input
                  type="text"
                  value={unitEn}
                  onChange={(e) => setUnitEn(e.target.value)}
                  placeholder="Enter unit in English"
                />
                <Label className="text-gray-700">Unit (Hindi)</Label>
                <Input
                  type="text"
                  value={unitHi}
                  onChange={(e) => setUnitHi(e.target.value)}
                  placeholder="Enter unit in Hindi"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={addIngredient}>
                  Save Ingredient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead>Ingredient ID</TableHead>
                  <TableHead>Ingredient Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedIngredients.map((ingredient, index) => (
                  <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <TableCell>{ingredient._id || `I00${index + 1}`}</TableCell>
                    <TableCell>{ingredient.name?.[i18n.language] || ingredient.name?.en}</TableCell>
                    <TableCell>{ingredient.unit?.[i18n.language] || ingredient.unit?.en}</TableCell>
                    <TableCell className="flex justify-center space-x-3">
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent className="flex items-center space-x-2">
                <PaginationItem>
                  <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer">
                    <ChevronLeft className="w-5 h-5" />
                  </PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <button
                      className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext   onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="cursor-pointer">
                    <ChevronRight className="w-5 h-5" />
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

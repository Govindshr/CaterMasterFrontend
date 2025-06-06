import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ItemSubCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { id: "C001", name: "Sweets" },
    { id: "C002", name: "Namkeen" },
    { id: "C003", name: "Main-Course" },
    { id: "C004", name: "Bevarage" },
    { id: "C005", name: "Fast-Foods" },
    { id: "C006", name: "Starters" },
  ];

  const [subCategories, setSubCategories] = useState([
    { id: "SC001", name: "Ladoo", categoryId: "C001" },
    { id: "SC002", name: "Chips", categoryId: "C002" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedSubCategories = subCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addSubCategory = () => {
    if (newSubCategory.trim() === "" || selectedCategory === "") return;
    const newId = `SC00${subCategories.length + 1}`;
    setSubCategories([
      ...subCategories,
      { id: newId, name: newSubCategory, categoryId: selectedCategory },
    ]);
    setNewSubCategory("");
    setSelectedCategory("");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex-row justify-between border-b p-4">
          <h2 className="text-2xl font-bold">Item Subcategories</h2>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" /> Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 w-[400px] overflow-visible z-[900]">

              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Add New Subcategory
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label className="text-gray-700">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000] bg-white border border-gray-300 shadow-lg rounded-md max-h-60 overflow-auto">

                  {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}
                       className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-200 cursor-pointer transition-all duration-150 rounded-md"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
               
                  
               
                <Label className="text-gray-700">Subcategory Name</Label>
                <Input
                  type="text"
                  placeholder="Enter subcategory name"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  className="rounded-lg border-gray-300"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={addSubCategory}
                >
                  Save Subcategory
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
                  <TableHead>Subcategory ID</TableHead>
                  <TableHead>Subcategory Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSubCategories.map((sub, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === sub.categoryId)?.name ||
                        "-"}
                    </TableCell>
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
                  <PaginationPrevious
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <button
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer"
                  >
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

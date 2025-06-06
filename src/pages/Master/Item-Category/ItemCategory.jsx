import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ItemCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  const [categories, setCategories] = useState([
    { id: "C001", name: "Sweets" },
    { id: "C002", name: "Namkeen" },
    { id: "C003", name: "Main-Course" },
    { id: "C004", name: "Bevarage" },
    { id: "C005", name: "Fast-Foods" },
    { id: "C006", name: "Starters" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

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

  const addCategory = () => {
    if (newCategory.trim() === "") return;
    const newId = `C00${categories.length + 1}`;
    setCategories([...categories, { id: newId, name: newCategory }]);
    setNewCategory("");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex-row justify-between border-b p-4">
          <h2 className="text-2xl font-bold">Item Categories</h2>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label className="text-gray-700">Category Name</Label>
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="rounded-lg border-gray-300"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={addCategory}>Save Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead>Category ID</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCategories.map((category, index) => (
                  <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
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
                  <PaginationPrevious onClick={prevPage} disabled={currentPage === 1} className="cursor-pointer">
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
                  <PaginationNext onClick={nextPage} disabled={currentPage === totalPages} className="cursor-pointer">
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
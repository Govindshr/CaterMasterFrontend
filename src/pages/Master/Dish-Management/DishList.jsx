// List dishes with filters and pagination from API

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function ItemList() {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDishes();
  }, [currentPage, nameFilter, categoryFilter, subcategoryFilter]);

  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5,
        name: nameFilter,
        category: categoryFilter,
        subcategory: subcategoryFilter,
      });
      const res = await protectedGetApi(`${config.GetDishes}?${params}`, token);
      const data = res?.data || {};
      setDishes(data?.dishes || []);
      setCategories(data?.categories || []);
      setSubcategories(data?.subcategories || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch dishes", err);
    }
  };

  const resetPageOnFilterChange = () => setCurrentPage(1);

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg p-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Dish List</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => { setNameFilter(e.target.value); resetPageOnFilterChange(); }}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setSubcategoryFilter(""); resetPageOnFilterChange(); }}>
                <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name?.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select value={subcategoryFilter} onValueChange={(val) => { setSubcategoryFilter(val); resetPageOnFilterChange(); }}>
                <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.filter((s) => s.categoryId === categoryFilter).map((sub) => (
                    <SelectItem key={sub._id} value={sub._id}>{sub.name?.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dishes.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50">
                    <TableCell>{item.name?.en}</TableCell>
                    <TableCell>{item.categoryId?.name?.en}</TableCell>
                    <TableCell>{item.subCategoryId?.name?.en}</TableCell>
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
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
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
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
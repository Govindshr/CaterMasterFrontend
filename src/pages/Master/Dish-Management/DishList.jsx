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
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ItemList() {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [currentPage, nameFilter, categoryFilter, subcategoryFilter]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetDishCategories, token);
      if (res.success === true) {
        setCategories(res.data || []);
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
        setSubcategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch sub-categories", err);
    }
  };

  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
       search: nameFilter,        // 🔄 backend uses `search`
       categoryId: categoryFilter, // 🔄 backend uses `categoryId`
       subCategoryId: subcategoryFilter, // 🔄 backend uses `subCategoryId`
      });
      const res = await protectedGetApi(`${config.GetDishes}?${params}`, token);
      const data = res?.data || {};
      setDishes(data?.dishes || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch dishes", err);
    }
  };

  const resetPageOnFilterChange = () => setCurrentPage(1);

  const clearFilters = () => {
    setCategoryFilter("");
    setSubcategoryFilter("");
    setNameFilter("");
    resetPageOnFilterChange();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex-row justify-between items-center border-b p-4 gap-3">
          <h2 className="text-2xl font-bold">Dish List</h2>
          <div className="ml-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/add-item")}>Add Dish</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Mobile: Filters toggle */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowMobileFilters((s) => !s)}
            >
              <span className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</span>
              <span className="text-xs text-gray-500">{showMobileFilters ? "Hide" : "Show"}</span>
            </Button>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showMobileFilters ? "block" : "hidden md:grid"}`}>
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
                  {subcategories.filter((s) => !categoryFilter || s.categoryId === categoryFilter).map((sub) => (
                    <SelectItem key={sub._id} value={sub._id}>{sub.name?.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters chips */}
          {(nameFilter || categoryFilter || subcategoryFilter) && (
            <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
              <div className="flex flex-wrap gap-2">
                {nameFilter && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
                    Name: {nameFilter}
                    <button aria-label="clear name" onClick={() => setNameFilter("")}> <X className="h-3 w-3" /> </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                    {categories.find((c) => c._id === categoryFilter)?.name?.en || "Category"}
                    <button aria-label="clear category" onClick={() => setCategoryFilter("")}> <X className="h-3 w-3" /> </button>
                  </span>
                )}
                {subcategoryFilter && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
                    {subcategories.find((s) => s._id === subcategoryFilter)?.name?.en || "Subcategory"}
                    <button aria-label="clear subcategory" onClick={() => setSubcategoryFilter("")}> <X className="h-3 w-3" /> </button>
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-600 hover:text-gray-800">Clear all</Button>
            </div>
          )}

          {/* Desktop / Tablet table */}
          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dishes.map((item,index) => (
                  <TableRow key={item._id} className="hover:bg-gray-50">
                     <TableCell>{index+1}</TableCell>
                    <TableCell>{item.name?.en}</TableCell>
                    <TableCell>{item.categoryId?.name?.en}</TableCell>
                    <TableCell>{item.subCategoryId?.name?.en}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list - compact */}
          <div className="md:hidden space-y-2">
            {dishes.map((item) => (
              <div
                key={item._id}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-[14px] font-medium text-gray-900 truncate dark:text-gray-100 leading-5">
                  {item.name?.en}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/40">
                    <span className="opacity-70">Cat:</span> {item.categoryId?.name?.en || "-"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:ring-gray-600/40">
                    <span className="opacity-70">Sub:</span> {item.subCategoryId?.name?.en || "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center md:justify-end mt-4">
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
    </div>
  );
}
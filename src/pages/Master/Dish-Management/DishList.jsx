import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ItemList() {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const categories = ["Sweet", "Main Course", "Beverage"];
  const subcategories = {
    Sweet: ["Rasmalai", "Gulab Jamun"],
    "Main Course": ["Paneer", "Dal"],
    Beverage: ["Tea", "Coffee"]
  };

  const items = [
    { id: 1, name: "Rasmalai", category: "Sweet", subcategory: "Rasmalai" },
    { id: 2, name: "Gulab Jamun", category: "Sweet", subcategory: "Gulab Jamun" },
    { id: 3, name: "Paneer Butter Masala", category: "Main Course", subcategory: "Paneer" },
    { id: 4, name: "Masoor Dal", category: "Main Course", subcategory: "Dal" },
    { id: 5, name: "Tea Special", category: "Beverage", subcategory: "Tea" },
    { id: 6, name: "Cold Coffee", category: "Beverage", subcategory: "Coffee" },
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    (categoryFilter ? item.category === categoryFilter : true) &&
    (subcategoryFilter ? item.subcategory === subcategoryFilter : true)
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const resetPageOnFilterChange = () => setCurrentPage(1);

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg p-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Item List</h2>
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
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={cat}>{cat}</SelectItem>
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
                  {(subcategories[categoryFilter] || []).map((sub, idx) => (
                    <SelectItem key={idx} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.subcategory}</TableCell>
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

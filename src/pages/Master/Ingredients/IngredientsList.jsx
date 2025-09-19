import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { protectedGetApi, protectedDeleteApi, protectedUploadFileApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import { Button } from "@/components/ui/button";
import { Filter, X, Plus, Trash2, Upload ,FilePlus2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function IngredientList() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
const resetPageOnFilterChange = () => setPage(1);
const [ingredientTypes, setIngredientTypes] = useState([]);
const [unitTypes, setUnitTypes] = useState([]);

  // Static filter states (non-functional)
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

useEffect(() => {
  fetchIngredients();
}, [page, nameFilter, typeFilter, unitFilter]);
useEffect(() => {
  fetchIngredientTypes();
  fetchUnitTypes();
}, []);

const fetchIngredientTypes = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetIngredientTypes, token);
    if (res.success === true) {
      setIngredientTypes(res.data || []);
    }
  } catch (err) {
    console.error("Failed to fetch ingredient types", err);
  }
};

const fetchUnitTypes = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await protectedGetApi(config.GetUnitTypes, token);
    if (res.success === true) {
      setUnitTypes(res.data || []);
    }
  } catch (err) {
    console.error("Failed to fetch unit types", err);
  }
};

const fetchIngredients = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const params = new URLSearchParams({
      page,
      limit: 50,
      search: nameFilter,                // 🔄 backend: search
      ingredientTypeId: typeFilter,      // 🔄 backend: ingredientTypeId
      unitTypeId: unitFilter,            // 🔄 backend: unitTypeId
    });

    const res = await protectedGetApi(`${config.GetIngredients}?${params}`, token);
    setIngredients(res?.data?.ingredients || []);
    setTotalPages(res?.data?.pagination?.totalPages || 1);
    setPage(res?.data?.pagination?.currentPage || 1);
  } catch (error) {
    console.error("Failed to fetch ingredients", error);
  } finally {
    setIsLoading(false);
  }
};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await protectedDeleteApi(`${config.AddIngredients}/${id}`, token);
        Swal.fire("Deleted!", "Ingredient has been deleted.", "success");
        fetchIngredients();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete ingredient.", "error");
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      Swal.fire("Error!", "Please select a file first.", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await protectedUploadFileApi(config.BulkUploadIngredients, selectedFile, token, { dryRun: false });
      Swal.fire("Success!", "Ingredients uploaded successfully.", "success");
      setIsModalOpen(false);
      setSelectedFile(null);
      fetchIngredients();
    } catch (error) {
      Swal.fire("Error!", "Failed to upload ingredients.", "error");
    }
  };
const clearFilters = () => {
  setNameFilter("");
  setTypeFilter("");
  setUnitFilter("");
  resetPageOnFilterChange();
};


  return (
    <>
  <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
  <div className="max-w-7xl mx-auto w-full">
    <Card className="shadow-lg rounded-lg w-full max-w-full">
      <CardHeader className="flex flex-wrap justify-between border-b p-4 gap-3 w-full">
        <h2 className="text-2xl font-bold">All Ingredients</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end max-w-full">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none w-full sm:w-auto"
          onClick={() => navigate("/add-ingredient")}
          >
            + Add Ingredient
          </Button>
          <Button
   className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none w-full sm:w-auto"
   onClick={() => setIsModalOpen(true)}
 >
 <FilePlus2/>  Bulk Upload
 </Button>
        </div>
      </CardHeader>

           <CardContent className="space-y-4 p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
              {/* Mobile: Filters Sheet trigger */}
              <div className="md:hidden">
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <Filter className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl p-4">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label>Name</Label>
                       <Input
  placeholder="Search by name"
  value={nameFilter}
  onChange={(e) => { setNameFilter(e.target.value); resetPageOnFilterChange(); }}
/>
                      </div>
                      <div>
                        <Label>Type</Label>
                   <Select
  value={typeFilter}
  onValueChange={(val) => { setTypeFilter(val); resetPageOnFilterChange(); }}
>
  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
    <SelectValue placeholder="Select Type" />
  </SelectTrigger>
  <SelectContent>
    {ingredientTypes.map((type) => (
      <SelectItem key={type._id} value={type._id}>
        {type.name?.en}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                      </div>
                      <div>
                        <Label>Unit</Label>
                     <Select
  value={unitFilter}
  onValueChange={(val) => { setUnitFilter(val); resetPageOnFilterChange(); }}
>
  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
    <SelectValue placeholder="Select Unit" />
  </SelectTrigger>
  <SelectContent>
    {unitTypes.map((unit) => (
      <SelectItem key={unit._id} value={unit._id}>
        {unit.name?.en} ({unit.symbol})
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-2">
                      <Button variant="ghost" onClick={clearFilters} className="text-gray-700">Clear</Button>
                      <SheetClose asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Apply</Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop/Tablet Filters */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Name</Label>
                 <Input
  placeholder="Search by name"
  value={nameFilter}
  onChange={(e) => { setNameFilter(e.target.value); resetPageOnFilterChange(); }}
/>
                </div>
                <div>
                  <Label>Type</Label>
             <Select
  value={typeFilter}
  onValueChange={(val) => { setTypeFilter(val); resetPageOnFilterChange(); }}
>
  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
    <SelectValue placeholder="Select Type" />
  </SelectTrigger>
  <SelectContent>
    {ingredientTypes.map((type) => (
      <SelectItem key={type._id} value={type._id}>
        {type.name?.en}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                </div>
                <div>
                  <Label>Unit</Label>
                 <Select
  value={unitFilter}
  onValueChange={(val) => { setUnitFilter(val); resetPageOnFilterChange(); }}
>
  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white">
    <SelectValue placeholder="Select Unit" />
  </SelectTrigger>
  <SelectContent>
    {unitTypes.map((unit) => (
      <SelectItem key={unit._id} value={unit._id}>
        {unit.name?.en} ({unit.symbol})
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                </div>
              </div>

              {/* Table for desktop */}
              <div className="hidden md:block w-full max-w-full overflow-x-auto">
          <Table className="w-full max-w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Name (Hindi)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((ing, index) => (
                      <TableRow key={ing._id}>
                        <TableCell>{(page - 1) * 50 + index + 1}</TableCell>
                        <TableCell>{ing.name?.en}</TableCell>
                         <TableCell>{ing.name?.hi}</TableCell>
                        <TableCell>{ing.ingredientTypeId?.name?.en}</TableCell>
                        <TableCell>{ing.unitTypeId?.symbol}</TableCell>
                        <TableCell>₹{ing.pricePerUnit}</TableCell>
                       
                         <TableCell className="text-center">
                        <button
  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={() => handleDelete(ing._id)}
  disabled={!(
    ing.createdBy ||
    (() => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.userType === "admin";
      } catch {
        return false;
      }
    })()
  )}
>
  <Trash2 className="w-5 h-5" />
</button>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile card list */}
               <div className="md:hidden space-y-2 w-full max-w-full">
                {ingredients.map((ing) => (
                  <div key={ing._id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="text-[14px] font-medium text-gray-900 truncate">{ing.name?.en}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                        {ing.ingredientTypeId?.name?.en}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                        Unit: {ing.unitTypeId?.symbol}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">Price: ₹{ing.pricePerUnit}</div>
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => handleDelete(ing._id)} className="text-red-600 hover:text-red-700 flex items-center gap-1">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
               <div className="flex justify-center md:justify-end mt-4 w-full max-w-full">
          <Pagination className="w-full max-w-full overflow-x-hidden">
            <PaginationContent className="flex justify-center gap-2 w-full max-w-full">
                    {/* <PaginationItem >
                      <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} />
                    </PaginationItem> */}
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <button
                          className={`px-3 py-1 rounded-lg ${page === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </PaginationItem>
                    ))}
                    {/* <PaginationItem>
                      <PaginationNext onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
                    </PaginationItem> */}
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bulk Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Ingredients</DialogTitle>
          </DialogHeader>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setSelectedFile(e.target.files[0])} className="mt-4" />
          <DialogFooter>
            <Button onClick={handleBulkUpload} disabled={!selectedFile}>Upload</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

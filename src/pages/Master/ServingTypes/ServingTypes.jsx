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
  Search,
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
import Swal from "sweetalert2";
import {
  protectedGetApi,
  protectedPostApi,
  protectedDeleteApi,
} from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";

export default function ServingTypes() {
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  const { i18n } = useTranslation();
  const [servings, setServings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [errorEn, setErrorEn] = useState("");
  const [errorHi, setErrorHi] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(servings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    fetchServings();
  }, [i18n.language]);

  const fetchServings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.ServingTypes, token);
      if (res.success === true) {
        setServings(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching serving types:", error);
      setServings([]);
    }
  };

  const addServing = async () => {
    let valid = true;
    if (!nameEn.trim()) {
      setErrorEn("English name is required");
      valid = false;
    } else {
      setErrorEn("");
    }

    if (!nameHi.trim()) {
      setErrorHi("Hindi name is required");
      valid = false;
    } else {
      setErrorHi("");
    }

    if (!valid) return;

    try {
      const token = localStorage.getItem("token");
      await protectedPostApi(
        config.ServingTypes,
        {
          name: {
            en: nameEn,
            hi: nameHi,
          },
        },
        token
      );
      fetchServings();
      setIsModalOpen(false);
      setNameEn("");
      setNameHi("");
      setErrorEn("");
      setErrorHi("");
    } catch (error) {
      console.error("Error adding serving type:", error);
    }
  };

  const deleteServing = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this serving type?",
      text: "This action is irreversible.",
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
        await protectedDeleteApi(config.DeleteServingTypes(id), token);
        Swal.fire("Deleted!", "The serving type was removed.", "success");
        fetchServings();
      } catch (error) {
        Swal.fire("Error", error.message || "Delete failed", "error");
      }
    }
  };

  const filteredServings = servings.filter(
    (item) =>
      item.name?.[i18n.language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Serving Types
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add and manage your serving types
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add Serving Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Add Serving Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name (English)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter name in English"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                      {errorEn && <p className="text-red-500 text-xs mt-1">{errorEn}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name (Hindi)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter name in Hindi"
                        value={nameHi}
                        onChange={(e) => setNameHi(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                      {errorHi && <p className="text-red-500 text-xs mt-1">{errorHi}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addServing}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServings.length > 0 ? (
                    filteredServings.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.name?.[i18n.language] || item.name?.en}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.createdBy === currentUserId ? (
                            <button
                              onClick={() => deleteServing(item._id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                        No serving types found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredServings.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent className="flex items-center space-x-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </PaginationPrevious>
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <button
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages && setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
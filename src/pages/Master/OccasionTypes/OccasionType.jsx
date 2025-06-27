// src/pages/OccasionTypes.jsx
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
import { config } from "@/services/nodeconfig";
import {
  protectedGetApi,
  protectedPostApi,
  protectedDeleteApi,
} from "@/services/nodeapi";

export default function OccasionTypes() {
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  const { i18n } = useTranslation();
  const [occasions, setOccasions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(occasions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    fetchOccasions();
  }, [i18n.language]);

  const fetchOccasions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.OccasionTypes, token);
      if (res.success === true) {
        setOccasions(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching occasion types:", error);
      setOccasions([]);
    }
  };

  const addOccasion = async () => {
    if (!nameEn.trim() || !nameHi.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await protectedPostApi(
        config.OccasionTypes,
        {
          name: {
            en: nameEn,
            hi: nameHi,
          },
        },
        token
      );
      fetchOccasions();
      setIsModalOpen(false);
      setNameEn("");
      setNameHi("");
    } catch (error) {
      console.error("Error adding occasion:", error);
    }
  };

  const deleteOccasion = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this occasion?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!confirmed.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await protectedDeleteApi(config.DeleteOccasionTypes(id), token);
      Swal.fire("Deleted!", "The occasion type was removed.", "success");
      fetchOccasions();
    } catch (error) {
      Swal.fire("Error", error.message || "Delete failed", "error");
    }
  };

  const filteredOccasions = occasions.filter((o) =>
    o.name?.[i18n.language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.name?.en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Occasion Types
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage types of occasions used in events
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Occasion Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Add New Occasion Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Occasion Name (English)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter name in English"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Occasion Name (Hindi)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter name in Hindi"
                        value={nameHi}
                        onChange={(e) => setNameHi(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addOccasion}>
                      Save Occasion
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search occasion types..."
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
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOccasions.length > 0 ? (
                    filteredOccasions.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>{item._id}</TableCell>
                        <TableCell>{item.name?.[i18n.language] || item.name?.en}</TableCell>
                        <TableCell className="text-center">
                          {item.createdBy === currentUserId ? (
                            <button
                              onClick={() => deleteOccasion(item._id)}
                              className="text-red-500 hover:text-red-700"
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
                      <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                        No occasion types found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredOccasions.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent className="flex items-center space-x-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
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
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
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

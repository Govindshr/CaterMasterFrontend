import { useEffect, useState } from "react";
import axios from "axios";
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
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { config } from "@/services/nodeconfig";
// import { config } from "@/services/config";
import Swal from "sweetalert2";
import {
  protectedGetApi,
  protectedPostApi,
  protectedDeleteApi,
} from "@/services/nodeapi";
// import { getApi, postApi ,protected } from "@/services/api";



export default function Events() {
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Initialize with dummy data
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    // Comment out the API call for now
    fetchEvents();
  }, [i18n.language]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetEvents, token);
      if (res.success === true) {
        setEvents(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // Fallback to dummy data if API fails
      setEvents([]);
    }
  };

  const addEvent = async () => {
    if (!nameEn.trim() || !nameHi.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await protectedPostApi(
        config.AddEvents,
        {
          name: {
            en: nameEn,
            hi: nameHi,
          },
        },
        token
      );

      if (response?.data) {
        fetchEvents(); // Refresh from server
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const deleteEvent = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this event?",
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
        await protectedDeleteApi(config.DeleteEvent(id), token);
        Swal.fire("Deleted!", "The event was removed.", "success");
        fetchEvents();
      } catch (error) {
        Swal.fire("Error", error.message || "Delete failed", "error");
      }
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name?.[i18n.language]
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      event.name?.en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Events Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and organize your events
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Add New Event
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Event Name (English)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter event name in English"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Event Name (Hindi)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter event name in Hindi"
                        value={nameHi}
                        onChange={(e) => setNameHi(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      onClick={addEvent}
                    >
                      Save Event
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
                  placeholder="Search events..."
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
                    {/* <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                      Event ID
                    </TableHead> */}
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                      Event Name
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {event._id}
                        </TableCell> */}
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {event.name?.[i18n.language] || event.name?.en}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-3">
                            {event.createdBy === currentUserId ? (
                              <button
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Event"
                                onClick={() => deleteEvent(event._id)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredEvents.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent className="flex items-center space-x-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className={`cursor-pointer rounded-lg ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
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
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className={`cursor-pointer rounded-lg ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
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

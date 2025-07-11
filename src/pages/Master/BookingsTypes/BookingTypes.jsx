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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { config } from "@/services/nodeconfig";
import {
  protectedGetApi,
  protectedPostApi,
  protectedDeleteApi,
} from "@/services/nodeapi";

export default function BookingTypes() {
  const { i18n } = useTranslation();
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descHi, setDescHi] = useState("");

  useEffect(() => {
    fetchTypes();
  }, [i18n.language]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetBookingType, token);
      if (res.success === true) {
        setTypes(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch booking types", err);
    }
  };

  const addType = async () => {
    if (!nameEn.trim() || !nameHi.trim() || !descEn.trim() || !descHi.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await protectedPostApi(
        config.AddBookingType,
        {
          name: { en: nameEn, hi: nameHi },
          description: { en: descEn, hi: descHi },
        },
        token
      );
      if (res?.data) {
        fetchTypes();
        setIsModalOpen(false);
        setNameEn("");
        setNameHi("");
        setDescEn("");
        setDescHi("");
      }
    } catch (err) {
      console.error("Failed to add booking type", err);
    }
  };

  const deleteType = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this booking type?",
      text: "This action cannot be undone.",
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
        await protectedDeleteApi(config.DeleteBookingType(id), token);
        Swal.fire("Deleted!", "The booking type was removed.", "success");
        fetchTypes();
      } catch (error) {
        Swal.fire("Error", error.message || "Delete failed", "error");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Booking Types
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage all available booking types
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Booking Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-[90vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      New Booking Type
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Booking Name (English)</Label>
                      <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                    </div>
                    <div>
                      <Label>Booking Name (Hindi)</Label>
                      <Input value={nameHi} onChange={(e) => setNameHi(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description (English)</Label>
                      <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description (Hindi)</Label>
                      <Input value={descHi} onChange={(e) => setDescHi(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addType}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {types.length > 0 ? (
                    types.map((type, index) => (
                      <TableRow key={index}>
                        <TableCell>{type.name?.[i18n.language] || type.name?.en}</TableCell>
                        <TableCell>{type.description?.[i18n.language] || type.description?.en}</TableCell>
                        <TableCell className="text-center">
                          <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            onClick={() => deleteType(type._id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        No booking types found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

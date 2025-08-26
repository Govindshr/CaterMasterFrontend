// IngredientList component to list ingredients with pagination and delete

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { protectedGetApi, protectedDeleteApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import Swal from "sweetalert2";
import { Trash2, Plus } from "lucide-react";

export default function IngredientList() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, [page]);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(`${config.GetIngredients}?page=${page}&limit=10`, token);
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
        await protectedDeleteApi(`${config.DeleteIngredient}/${id}`, token);
        Swal.fire("Deleted!", "Ingredient has been deleted.", "success");
        fetchIngredients();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete ingredient.", "error");
      }
    }
  };

  return (
     <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex-row justify-between border-b p-4">
          <h2 className="text-2xl font-bold">Ingredients</h2>
          <Button onClick={() => navigate("/add-ingredient")} className="flex items-center bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" /> Add Ingredient
          </Button>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto bg-white dark:bg-gray-950">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {/* Desktop/Tablet table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                      <th className="p-2">#</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, idx) => (
                      <tr key={ing._id} className="border-t">
                        <td className="p-2">{(page - 1) * 10 + idx + 1}</td>
                        <td className="p-2">{ing.name?.[i18n.language] || ing.name?.en}</td>
                        <td className="p-2">{ing.ingredientTypeId?.name?.[i18n.language] || ing.ingredientTypeId?.name?.en}</td>
                        <td className="p-2">{ing.unitTypeId?.symbol}</td>
                        <td className="p-2">₹{ing.pricePerUnit}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDelete(ing._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Ingredient"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden space-y-3">
                {ingredients.map((ing, idx) => (
                  <div
                    key={ing._id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate dark:text-gray-100">
                          {ing.name?.[i18n.language] || ing.name?.en}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/40">
                            {ing.ingredientTypeId?.name?.[i18n.language] || ing.ingredientTypeId?.name?.en}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:ring-gray-600/40">
                            Unit: {ing.unitTypeId?.symbol}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{ing.pricePerUnit}</p>
                        <p className="text-xs text-gray-500">#{(page - 1) * 10 + idx + 1}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(ing._id)}
                        className="inline-flex items-center rounded-md px-2 py-1 text-sm text-red-600 hover:text-red-700"
                        title="Delete Ingredient"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center md:justify-between mt-6 gap-3">
            <Button disabled={page <= 1} onClick={() => setPage(page - 1)} className="w-28 md:w-auto">
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="w-28 md:w-auto">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

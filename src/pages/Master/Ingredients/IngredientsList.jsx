// IngredientList component to list ingredients with pagination and delete

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { protectedGetApi, protectedDeleteApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import Swal from "sweetalert2";

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-50 dark:bg-gray-900 px-4 py-6">
      <Card className="w-full max-w-5xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Ingredient List</h2>
            <Button onClick={() => navigate("/add-ingredient")} className="bg-white text-blue-700 hover:bg-blue-100">Add New</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto bg-white dark:bg-gray-950">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-left">
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
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ing._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// import ProtectedRoute from "../../components/ProtectedRoute";
import RestaurantForm from "../../components/restaurant/RestaurantForm";
import { apiFetch } from "../../lib/api";

export default function CreateRestaurantPage() {
  const router = useRouter();

  const handleCreate = async (form) => {
    const res = await apiFetch("/restaurants", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create restaurant");
    router.push("/restaurants/manage");
  };

  return (
    // <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#EE5F2B]">New Restaurant</h1>
              <p className="text-gray-500 mt-2">Add your restaurant to Foodie</p>
            </div>
            <RestaurantForm onSubmit={handleCreate} submitLabel="Create Restaurant" />
          </div>
        </main>
        <Footer />
      </div>
    // </ProtectedRoute>
  );
} 
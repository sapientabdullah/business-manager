"use client";
import CreatePurchase from "@/components/CreatePurchase";

export default function PurchasePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Create a Purchase</h1>
      <CreatePurchase onPurchaseCreated={() => alert("Purchase created!")} />
    </div>
  );
}

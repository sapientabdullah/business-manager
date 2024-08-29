"use client";
import { useState, useEffect } from "react";

interface Inventory {
  id: string;
  name: string;
  quantity: number;
}

const CreatePurchase = ({
  onPurchaseCreated,
}: {
  onPurchaseCreated: () => void;
}) => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch("/api/inventory");
        const data: Inventory[] = await response.json();
        setInventoryItems(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        setError("Failed to fetch inventory");
      }
    }

    fetchInventory();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedCustomerId || !selectedInventoryId || quantity <= 0) {
      setError(
        "Please select a customer, inventory item, and enter a valid quantity."
      );
      return;
    }

    try {
      const response = await fetch("/api/purchases/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          inventoryId: selectedInventoryId,
          quantity,
        }),
      });

      if (response.ok) {
        setSuccess("Purchase created successfully");

        setSelectedInventoryId("");
        setQuantity(1);
        setSelectedCustomerId("");

        onPurchaseCreated();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to create purchase:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div>
      <h2>Create Purchase</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer ID"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          required
        />
        <select
          value={selectedInventoryId}
          onChange={(e) => setSelectedInventoryId(e.target.value)}
          required
        >
          <option value="">Select an inventory item</option>
          {inventoryItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (Available: {item.quantity})
            </option>
          ))}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
        />
        <button type="submit">Create Purchase</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default CreatePurchase;

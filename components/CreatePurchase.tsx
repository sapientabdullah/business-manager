"use client";
import { useState, useEffect } from "react";

interface Inventory {
  id: string;
  name: string;
  quantity: number;
}

interface CreatePurchaseProps {
  onPurchaseCreated: () => void;
}

const CreatePurchase = ({ onPurchaseCreated }: CreatePurchaseProps) => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isRegular: false,
  });
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

    if (
      !customerDetails.firstName ||
      !customerDetails.lastName ||
      !selectedInventoryId ||
      quantity <= 0
    ) {
      setError(
        "Please fill out all customer details, select an inventory item, and enter a valid quantity."
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
          customer: customerDetails, 
          inventoryId: selectedInventoryId,
          quantity,
        }),
      });

      if (response.ok) {
        setSuccess("Purchase and customer created successfully");

        setSelectedInventoryId("");
        setQuantity(1);
        setCustomerDetails({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          isRegular: false,
        });

        onPurchaseCreated();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to create purchase and customer:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Record Purchase
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Customer Details Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={customerDetails.firstName}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  firstName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={customerDetails.lastName}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  lastName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={customerDetails.email}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={customerDetails.phone}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  phone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Optional Fields for Customer */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={customerDetails.address}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  address: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={customerDetails.city}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  city: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={customerDetails.state}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  state: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              value={customerDetails.postalCode}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  postalCode: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={customerDetails.country}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  country: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Regular Customer?
            </label>
            <input
              type="checkbox"
              checked={customerDetails.isRegular}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  isRegular: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
          </div>

          {/* Inventory Item Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Select Inventory Item
            </label>
            <select
              value={selectedInventoryId}
              onChange={(e) => setSelectedInventoryId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select an inventory item</option>
              {inventoryItems.length > 0 ? (
                inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity})
                  </option>
                ))
              ) : (
                <option disabled>Loading inventory...</option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Create Purchase
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}
      </div>
    </div>
  );
};

export default CreatePurchase;

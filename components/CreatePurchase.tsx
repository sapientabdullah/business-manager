"use client";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

interface Inventory {
  id: string;
  name: string;
  quantity: number;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CreatePurchaseProps {
  onPurchaseCreated: () => void;
}

const CreatePurchase = ({ onPurchaseCreated }: CreatePurchaseProps) => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [creatingCustomer, setCreatingCustomer] = useState<boolean>(false);
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

    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers");
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setError("Failed to fetch customers");
      }
    }

    fetchInventory();
    fetchCustomers();
  }, []);

  async function handleCustomerSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("/api/customers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerDetails),
      });

      if (response.ok) {
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
        setSelectedCustomerId(newCustomer.id);
        setCreatingCustomer(false);
        setCustomerDetails({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred while creating the customer"
        );
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
      setError("An unexpected error occurred while creating the customer");
    }
  }

  async function handlePurchaseSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedCustomerId || !selectedInventoryId || quantity <= 0) {
      setError(
        "Please select a customer and inventory item, and enter a valid quantity."
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

        // Update inventory quantities
        const updatedInventory = inventoryItems.map((item) => {
          if (item.id === selectedInventoryId) {
            return { ...item, quantity: item.quantity - quantity };
          }
          return item;
        });
        setInventoryItems(updatedInventory);

        // Generate Invoice
        const purchaseData = await response.json();
        generateInvoice(purchaseData);

        setSelectedInventoryId("");
        setSelectedCustomerId("");
        setQuantity(1);
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

  function generateInvoice(purchaseData: any) {
    const doc = new jsPDF();
    doc.text("Invoice", 20, 20);

    // Find customer and inventory item details
    const customer = customers.find((c) => c.id === purchaseData.customerId);
    const inventoryItem = inventoryItems.find(
      (item) => item.id === purchaseData.inventoryId
    );

    if (customer) {
      doc.text(`Customer: ${customer.firstName} ${customer.lastName}`, 20, 30);
      doc.text(`Email: ${customer.email}`, 20, 40);
      doc.text(`Phone: ${customer.phone}`, 20, 50);
    }

    if (inventoryItem) {
      autoTable(doc, {
        startY: 60,
        head: [["Description", "Quantity", "Price", "Total"]],
        body: [
          [
            inventoryItem.name,
            purchaseData.quantity,
            "N/A", // Replace with actual price if available
            "N/A", // Replace with total amount if price is available
          ],
        ],
      });
    } else {
      doc.text("No inventory item found", 20, 60);
    }

    doc.save("invoice.pdf");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Purchase
        </h2>

        {creatingCustomer ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Create Customer</h3>
            <form onSubmit={handleCustomerSubmit}>
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
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Create Customer
              </button>
            </form>
            <button
              onClick={() => setCreatingCustomer(false)}
              className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <form onSubmit={handlePurchaseSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Select Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select a customer</option>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </option>
                  ))
                ) : (
                  <option value="">No customers available</option>
                )}
              </select>
              <button
                type="button"
                onClick={() => setCreatingCustomer(true)}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Create New Customer
              </button>
            </div>

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
                <option value="">Select an item</option>
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Available: {item.quantity})
                    </option>
                  ))
                ) : (
                  <option value="">No inventory items available</option>
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
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
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default CreatePurchase;

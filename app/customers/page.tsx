"use client";
import { useEffect, useState } from "react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isRegular: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch(
          `/api/customers?searchTerm=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        setError("Failed to fetch customers");
      }
    }

    fetchCustomers();
  }, [searchTerm]);

  async function handleCustomerCreated() {
    setIsModalOpen(false);
    // Refresh customer list
    try {
      const response = await fetch(
        `/api/customers?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (error) {
      setError("Failed to fetch customers");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer List</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">First Name</th>
              <th className="border-b px-4 py-2 text-left">Last Name</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Phone</th>
              <th className="border-b px-4 py-2 text-left">Address</th>
              <th className="border-b px-4 py-2 text-left">City</th>
              <th className="border-b px-4 py-2 text-left">State</th>
              <th className="border-b px-4 py-2 text-left">Postal Code</th>
              <th className="border-b px-4 py-2 text-left">Country</th>
              <th className="border-b px-4 py-2 text-left">Regular Customer</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="border-b px-4 py-2">{customer.firstName}</td>
                <td className="border-b px-4 py-2">{customer.lastName}</td>
                <td className="border-b px-4 py-2">
                  {customer.email || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {customer.phone || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {customer.address || "N/A"}
                </td>
                <td className="border-b px-4 py-2">{customer.city || "N/A"}</td>
                <td className="border-b px-4 py-2">
                  {customer.state || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {customer.postalCode || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {customer.country || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {customer.isRegular ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

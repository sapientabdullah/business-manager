"use client";
import { useState } from "react";

const CreateCustomer = ({
  onCustomerCreated,
}: {
  onCustomerCreated: () => void;
}) => {
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

  async function handleSubmit(event: React.FormEvent) {
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
        setSuccess("Customer created successfully");
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
        onCustomerCreated();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
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
            <label className="block text-gray-700">Last Name</label>
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
            <label className="block text-gray-700">Email</label>
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
            <label className="block text-gray-700">Phone</label>
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

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
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
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={customerDetails.city}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, city: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">State</label>
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
            <label className="block text-gray-700">Postal Code</label>
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
            <label className="block text-gray-700">Country</label>
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

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={customerDetails.isRegular}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  isRegular: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label className="text-gray-700">Regular Customer</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Create Customer
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

export default CreateCustomer;

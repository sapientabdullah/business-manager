"use client";
import { useState } from "react";
import CreateCustomer from "@/components/CreateCustomer";

export default function CustomersPage() {
  const [customerCreated, setCustomerCreated] = useState(false);

  const handleCustomerCreated = () => {
    setCustomerCreated(true);
    // You can add more logic here, like showing a success message or refreshing the list of customers
  };

  return (
    <div>
      <CreateCustomer onCustomerCreated={handleCustomerCreated} />
    </div>
  );
}

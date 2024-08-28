"use client";

import { useForm, useFieldArray } from "react-hook-form";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

type InvoiceForm = {
  companyName: string;
  customerName: string;
  items: { description: string; quantity: number; price: number }[];
};

const Invoice = () => {
  const { register, control, handleSubmit } = useForm<InvoiceForm>({
    defaultValues: {
      items: [{ description: "", quantity: 0, price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const generatePDF = (data: InvoiceForm) => {
    const doc = new jsPDF();
    doc.text(`Company: ${data.companyName}`, 20, 20);
    doc.text(`Customer: ${data.customerName}`, 20, 30);
    doc.text("Invoice", 20, 40);
    autoTable(doc, {
      startY: 50,
      head: [["Description", "Quantity", "Price", "Total"]],
      body: data.items.map((item) => [
        item.description,
        item.quantity.toString(),
        item.price,
        item.quantity * item.price,
      ]),
    });
    doc.save("invoice.pdf");
  };

  const onSubmit = (data: InvoiceForm) => {
    generatePDF(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Create Invoice</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Company Name:</label>
        <input
          {...register("companyName")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Customer Name:</label>
        <input
          {...register("customerName")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700">Items</label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 flex items-center space-x-2">
            <input
              {...register(`items.${index}.description` as const)}
              placeholder="Description"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              {...register(`items.${index}.quantity` as const)}
              type="number"
              placeholder="Quantity"
              className="block w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              {...register(`items.${index}.price` as const)}
              type="number"
              placeholder="Price"
              className="block w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ description: "", quantity: 1, price: 0 })}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
      >
        Generate Invoice
      </button>
    </form>
  );
};

export default Invoice;

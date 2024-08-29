"use client";
import { useEffect, useState } from "react";
import CreateEmployee from "@/components/CreateEmployee";
import Modal from "@/components/Modal";

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  employmentType: string;
  salary?: number;
  status: string;
  startDate: string;
  endDate?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch(
          `/api/employees?searchTerm=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (error) {
        setError("Failed to fetch employees");
      }
    }

    fetchEmployees();
  }, [searchTerm]);

  async function handleEmployeeCreated() {
    setIsModalOpen(false);
    // Refresh employee list
    try {
      const response = await fetch(
        `/api/employees?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Employee[] = await response.json();
      setEmployees(data);
    } catch (error) {
      setError("Failed to fetch employees");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee List</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search employees..."
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Add Employee
      </button>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Name</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Phone</th>
              <th className="border-b px-4 py-2 text-left">Role</th>
              <th className="border-b px-4 py-2 text-left">Employment Type</th>
              <th className="border-b px-4 py-2 text-left">Salary</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
              <th className="border-b px-4 py-2 text-left">Start Date</th>
              <th className="border-b px-4 py-2 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border-b px-4 py-2">{employee.name}</td>
                <td className="border-b px-4 py-2">
                  {employee.email || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {employee.phone || "N/A"}
                </td>
                <td className="border-b px-4 py-2">{employee.role}</td>
                <td className="border-b px-4 py-2">
                  {employee.employmentType}
                </td>
                <td className="border-b px-4 py-2">
                  {employee.salary !== undefined
                    ? `${employee.salary.toFixed(2)} PKR`
                    : "N/A"}
                </td>
                <td className="border-b px-4 py-2">{employee.status}</td>
                <td className="border-b px-4 py-2">
                  {new Date(employee.startDate).toLocaleDateString()}
                </td>
                <td className="border-b px-4 py-2">
                  {employee.endDate
                    ? new Date(employee.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreateEmployee
            onEmployeeCreated={handleEmployeeCreated}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

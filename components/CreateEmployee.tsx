"use client";
import { useState } from "react";

interface CreateEmployeeProps {
  onEmployeeCreated: () => void;
  onClose: () => void;
}

const CreateEmployee = ({
  onEmployeeCreated,
  onClose,
}: CreateEmployeeProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const employmentTypes = ["Full-Time", "Part-Time", "Contract", "Intern"];
  const statuses = ["Active", "On Leave", "Terminated", "Resigned"];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("/api/employees/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          employmentType,
          salary: parseFloat(salary),
          status,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Employee created: ${data.name}`);

        setName("");
        setEmail("");
        setPhone("");
        setRole("");
        setEmploymentType("");
        setSalary("");
        setStatus("");
        setStartDate("");
        setEndDate("");

        onEmployeeCreated();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to create employee:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Employee
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left">Field</th>
                  <th className="border-b px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2">Name</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Email</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Phone</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Role</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Enter role"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Employment Type</td>
                  <td className="border-b px-4 py-2">
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select employment type</option>
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Salary</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="Enter salary"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Status</td>
                  <td className="border-b px-4 py-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select status</option>
                      {statuses.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">Start Date</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border-b px-4 py-2">End Date</td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Create Employee
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

export default CreateEmployee;

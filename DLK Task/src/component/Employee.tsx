import React, { useState,useEffect } from "react";
import { Config_Url } from "./api";
import axios from "axios";
import {toast} from "react-toastify";

interface Employee {
  employee_id: string;
  name: string;
  email: string;
  position: string;
  department?: string;
  isActive: boolean;
  password?: string;
  _id?: string;
}

const employeesData: Employee[] = [
  {
    employee_id: "EMP001",
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Software Engineer",
    department: "IT",
    isActive: true,
  },
  {
    employee_id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "HR Manager",
    department: "HR",
    isActive: false,
  },
  // Add more employees here
];

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );


  const getEmployees = async() => {
    try{
      const responce =  await axios.get(`${Config_Url.base_url}/employee`);
      console.log(responce, 'getting response');
      setEmployees(responce.data);
    }catch(err:any){
      console.log(err.response.data);
    }
  }
  useEffect(() => {
    getEmployees();
  }
  , []);

  // Handle Search
  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle Add/Edit Employee
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    if (employee.employee_id) {
      // Edit existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employee_id === employee.employee_id ? employee : emp
        )
      );
    } else {
      // Add new employee
      setEmployees((prev) => [
        ...prev,
        { ...employee, employee_id: `EMP${prev.length + 1}` },
      ]);
    }
    setIsModalOpen(false);
  };

  // Handle Delete Employee
  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees((prev) =>
      prev.filter((emp) => emp.employee_id !== employeeId)
    );
  };

  return (
    <div className="p-4">
      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-64"
        />
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Employee
        </button>
      </div>

      {/* Table for Web */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Position</th>
              {/* <th className="p-3 text-left">Department</th> */}
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr key={employee.employee_id} className="border-b">
                <td className="p-3">{employee.employee_id}</td>
                <td className="p-3">{employee.name}</td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3">{employee.position}</td>
                {/* <td className="p-3">{employee.department}</td> */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="md:hidden">
        {paginatedEmployees.map((employee) => (
          <div
            key={employee.employee_id}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.email}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  employee.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {employee.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">Position:</span>{" "}
                {employee.position}
              </p>
              <p className="text-sm">
                <span className="font-medium">Department:</span>{" "}
                {employee.department}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEditEmployee(employee)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span>Rows per page: </span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="p-1 border rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 mx-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 mx-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// Employee Modal Component
interface EmployeeModalProps {
  employee: Employee | null;
  onSave: (employee: Employee) => void;
  onClose: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Employee>(
    employee || {
      employee_id: "",
      name: "",
      email: "",
      position: "",
      password: "",
      isActive: true,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // onSave(formData);
    try{
      if(employee){
        const responce =  await axios.put(`${Config_Url.base_url}/employee/${employee._id}`,formData);
        console.log(responce);
        toast.success(responce.data.message);
        onClose();
        return;
      }else{
        const responce =  await axios.post(`${Config_Url.base_url}/employee/register`,formData);
        console.log(responce);
        toast.success(responce.data.message);
        onClose();
        return;
      }


    }catch(err:any){
      toast.error(err.response.data.message);
      console.log(err.response.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center animate__animated animate__fadeInTopRight">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>Active</span>
            </label>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Employee;

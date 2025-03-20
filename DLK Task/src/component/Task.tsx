import axios from "axios";
import React, { useEffect, useState } from "react";
import { Config_Url } from "./api";
import { toast } from "react-toastify";

interface Task {
  task_id: string;
  task_name: string;
  employee_id: string;
  time: string;
  status: string;
  answer: string;
  description?: string;
  _id: string;
  time_in_minutes?: number;
  name?: string;
}

interface Employee {
  _id: string;
  name: string;
}

const employeesData = [
  { employee_id: "EMP001", name: "John Doe" },
  { employee_id: "EMP002", name: "Jane Smith" },
];

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize tasks as an empty array
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [employees, setEmployees] = useState<any>([]);

  // Fetch all tasks from the API
  const getAllTask = async () => {
    try {
      const response = await axios.get(`${Config_Url.base_url}/task`);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("API response is not an array:", response.data);
        setTasks([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Fallback to an empty array
    }
  };

  useEffect(() => {
    getAllTask();
  }, []);

  // Handle Search
  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle Add/Edit Task
  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (task.task_id) {
        // Edit existing task
        const response = await axios.put(
          `${Config_Url}/task/${task.task_id}`,
          task
        );
        setTasks((prev) =>
          prev.map((t) => (t.task_id === task.task_id ? response.data : t))
        );
      } else {
        // Add new task
        const response = await axios.post(`${Config_Url}/task`, task);
        setTasks((prev) => [...prev, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${Config_Url}/task/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle View Answer
  const handleViewAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswerModalOpen(true);
  };

  // get employees
  const getEmployees = async () => {
    try {
      const response = await axios.get(`${Config_Url.base_url}/employee`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  console.log(employees, "getting employees");

  return (
    <div className="p-4">
      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-64"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Task
        </button>
      </div>

      {/* Table for Web */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Task ID</th>
              <th className="p-3 text-left">Task Name</th>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task) => (
              <tr key={task.task_id} className="border-b">
                <td className="p-3">{task._id}</td>
                <td className="p-3">{task.task_name}</td>
                <td className="p-3">
                {task.employee_id?.name}
</td>
                <td className="p-3">{task.time_in_minutes}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleViewAnswer(task.answer)}
                    className="text-green-500 hover:text-green-700"
                  >
                    View Answer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="md:hidden">
        {paginatedTasks.map((task) => (
          <div
            key={task.task_id}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{task.task_name}</h3>
                <p className="text-sm text-gray-600">
                  {
                    employeesData.find(
                      (emp) => emp.employee_id === task.employee_id
                    )?.name
                  }
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">Time:</span> {task.time}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
             
              <button
                onClick={() => handleViewAnswer(task.answer)}
                className="text-green-500 hover:text-green-700"
              >
                View Answer
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
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          employees={employees}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* View Answer Modal */}
      {isAnswerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Task Answer</h2>
            <p className="text-gray-700">{selectedAnswer}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAnswerModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Modal Component
interface TaskModalProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onClose: () => void;
  employees:  Employee[];
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose,employees }) => {
  const [formData, setFormData] = useState<Task>(
    task || {
      task_id: "",
      task_name: "",
      employee_id: "",
      time: "",
      status: "pending",
      answer: "",
      _id: "",
      
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // onSave(formData);
    console.log(formData, 'getting form data');
    try{
      const responce = await axios.post(`${Config_Url.base_url}/task/assign`,formData);
      console.log(responce.data);
      toast.success("Task Assigned");
      onClose();

    }catch(err:any){
      console.log(err.response.data);
      toast.error(err.response.data.message);

      
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="md:text-xl font-semibold mb-4">
          {task ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="task_name"
              placeholder="Task Name"
              value={formData.task_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp:any) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="time"
              placeholder="Time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />

            <textarea
              name="description"
              placeholder="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              rows={4}
            />
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

export default Task;

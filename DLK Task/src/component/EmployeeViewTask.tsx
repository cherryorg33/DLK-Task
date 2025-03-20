import React, { useState, useEffect } from "react";
import { Config_Url } from "./api";
import axios from "axios";
import {toast} from 'react-toastify'




interface Task {
  task_id: string;
  task_name: string;
  time_in_minutes: number; // Time limit in minutes
  answer?: string; // Optional answer field
  status:string;
  _id:string;
}

const tasksData: Task[] = [
  {
    task_id: "TASK001",
    task_name: "Fix Login Bug",
    time_in_minutes: 1, // 30 minutes
    status:'pending',
    _id:'1'
  },
  {
    task_id: "TASK002",
    task_name: "Update HR Policies",
    time_in_minutes: 60, // 60 minutes
    status:'pending',
    _id:'2'
  },
  // Add more tasks here
];

const EmployeeViewTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left in seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Fetch Tasks
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    const employee_id = user.employee._id;
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${Config_Url.base_url}/task/employee/${employee_id}`);
        console.log(res.data, 'getting task');  
        setTasks(res.data);
      } catch (err) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);











  // Handle View Answer
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setTimeLeft(task.time_in_minutes * 60); // Convert minutes to seconds
    setIsTimerRunning(false);
    setIsSubmitted(false);
    setAnswer("");
  };

  // Handle Start Timer
  const handleStart = () => {
    setIsTimerRunning(true);
  };

  // Handle Submit Answer
  const handleSubmit = async () => {
    if (!selectedTask) return;
  
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employee_id = user.employee._id;

    console.log(selectedTask._id, answer, employee_id);
  
    try {
      const response = await axios.put(`${Config_Url.base_url}/task/answer/${selectedTask._id}`, {
        answer,
      });
  
      if (response.status === 200) {
        toast.success("Task submitted successfully!");
  
        // Update the UI to mark the task as completed
        setTasks((prev) =>
          prev.map((t) =>
            t.task_id === selectedTask.task_id
              ? { ...t, status: "completed", answer }
              : t
          )
        );
  
        setIsSubmitted(true);
        setIsTimerRunning(false);
        setIsModalOpen(false); // Close the modal after submission
      }
    } catch (error) {
      toast.error("Failed to submit the task");
    }
  };
  

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleSubmit(); // Automatically submit when time runs out
    }
  }, [isTimerRunning, timeLeft]);

  return (
    <div className="p-4">
      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.task_id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{task.task_name}</h3>
                <p className="text-sm text-gray-600">
                  Time Limit: {task.time_in_minutes} minutes
                </p>
              </div>
              <button
  onClick={() => handleViewTask(task)}
  className="bg-blue-500 text-white px-4 py-2 rounded-md"
  disabled={task.status === "completed"} // Disable if the task is completed
>
  {task.status === "completed" ? "Completed" : "View Task"}
</button>

            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center animate__animated animate__fadeInTopRight">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Task: {selectedTask.task_name}
            </h2>
            {!isTimerRunning && !isSubmitted && (
              <button
                onClick={handleStart}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Start
              </button>
            )}
            {isTimerRunning && !isSubmitted && (
              <>
                <div className="mt-4">
                  <p className="text-sm">
                    Time Left: {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </p>
                  <textarea
                    placeholder="Enter your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-2 border rounded-md mt-2"
                    rows={4}
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
            {isSubmitted && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Answer Submitted</p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
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

export default EmployeeViewTask;

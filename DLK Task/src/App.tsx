import { useState } from "react";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import DashboardLayout from "./component/DashboardLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Employee from "./component/Employee";
import Task from "./component/Task";
import EmployeeViewTask from "./component/EmployeeViewTask";
import 'animate.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  

  return <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employee" element={<Employee />} />
          <Route path="task" element={<Task />} />
          <Route path="emp" element={<EmployeeViewTask />} />

          <Route path="task/:taskId" element={<EmployeeViewTask />} />

        </Route>

      </Routes>
        <ToastContainer />
    </Router>
  
  </>;
}

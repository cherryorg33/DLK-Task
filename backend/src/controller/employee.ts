import { Request, Response, NextFunction, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Employee from "../model/employee";
import asyncHandler from "../middleware/asyncHandler";
import dotenv from "dotenv";
import { Config_Url } from "../config";
import { sendEmail } from "../middleware/constant";
import Task from "../model/task";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * Register a new employee.
 */
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, position, department } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee)
      return res.status(400).json({ error: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Employee ID
    const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}`;

    // Create employee
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      position,
      department,
      employee_id: employeeId,
    });

    await newEmployee.save();

    // Send credentials via email
    await sendEmail(email, password);

    res.status(201).json({
      message: "Employee registered successfully!",
      employee: newEmployee,
    });
  })
);

/**
 * Employee login.
 */
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(401).json({ message: "Invalid Email" });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Define user role (Admin: 1, Others: 2)
    const role = email === "admin@gmail.com" && password === "admin" ? 1 : 2;



    // Generate JWT Token
    const token = jwt.sign(
      { employee_id: employee.employee_id, role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful", token, role , employee });
  })
);

/**
 * Get all employees.
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const employees = await Employee.find({
      email: { $ne: "admin@gmail.com" },
    });
    res.json(employees);
  })
);

/**
 * Get a single employee.
 */
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  })
);

/**
 * Update an employee.
 */
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee)
      return res.status(404).json({ error: "Employee not found" });
    res.json(updatedEmployee);
  })
);

/**
 * Delete an employee.
 */
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully!" });
  })
);

/**
 * Admin Dashboard.
 */
router.get(
  "/admin/dashboard",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Admin Dashboard");
    const totalEmployees = await Employee.countDocuments({
      email: { $ne: "admin@gmail.com" },
    });
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });

    // Group Employees by Creation Date
    const employeesByDate = await Employee.aggregate([
      { $match: { email: { $ne: "admin@gmail.com" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Group Tasks by Creation Date
    const tasksByDate = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalEmployees,
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      employeesByDate,
      tasksByDate,
    });
  })
);

/**
 * Get tasks assigned to a specific employee
 */
router.get(
  "/employee/:employee_id", // Use a parameterized route
  asyncHandler(async (req: Request, res: Response) => {
    const { employee_id } = req.params; // Extract employee_id from URL

    // Filter tasks by employee_id
    const totalTasks = await Task.countDocuments({ employee_id: employee_id });
    const pendingTasks = await Task.countDocuments({
      status: "pending",
      employee_id: employee_id,
    });
    const completedTasks = await Task.countDocuments({
      status: "completed",
      employee_id: employee_id,
    });
    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
      employee_id: employee_id,
    });

    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
    });
  })
);





// Export the router
export default router;

import { Router } from "express";
import Task from "../model/task";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

/**
 * Assign a task (Admin Only)
 */
router.post(
  "/assign",
  asyncHandler(async (req, res) => {
    const { employee_id, task_name, time,answer } = req.body;

    console.log(req.body);

    const task = new Task({
      employee_id,
      task_name,
      time_in_minutes:time,
      description:answer
    });
    await task.save();

    res.status(201).json({ message: "Task assigned successfully", task });
  })
);

/**
 * Get all tasks (Admin View)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate("employee_id", "name email");
    res.json(tasks);
  })
);

/**
 * Get tasks assigned to a specific employee
 */
router.get(
  "/employee/:employee_id",
  asyncHandler(async (req, res) => {
    const { employee_id } = req.params;
    const tasks = await Task.find({ employee_id });
    res.json(tasks);
  })
);

/**
 * Answer a task (Employee submits an answer)
 */
router.put(
  "/answer/:id",
  asyncHandler(async (req, res) => {
    const { answer } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    task.answer = answer;
    task.status = "completed";
    await task.save();

    res.json({ message: "Task answered successfully", task });
  })
);

/**
 * Delete a task (Admin Only)
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  })
);

export default router;

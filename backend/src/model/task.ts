import { Schema, model, Document } from "mongoose";

/**
 * Task Interface - Defines the structure of a Task document.
 */
interface ITask extends Document {
  employee_id: Schema.Types.ObjectId;
  task_name: string;
  description: string;
  time_in_minutes: number;
  answer?: string;
  status: "pending" | "in-progress" | "completed";
}

/**
 * Task Schema - Defines how task data is stored in MongoDB.
 */
const TaskSchema = new Schema<ITask>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    task_name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    time_in_minutes: {
      type: Number,
      required: [true, "Time duration is required"],
    },
    answer: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Export the Task model
const Task = model<ITask>("Task", TaskSchema);
export default Task;

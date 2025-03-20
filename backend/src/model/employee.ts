import { Schema, model, Document } from "mongoose";

/**
 * Employee Interface - Defines the structure of an Employee document.
 */
interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  isActive: boolean;
  employee_id: string;
}

/**
 * Employee Schema - Defines how data is stored in MongoDB.
 */
const EmployeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: String,
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    employee_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Employee model
const Employee = model<IEmployee>("Employee", EmployeeSchema);
export default Employee;

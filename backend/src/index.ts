import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { Config_Url } from "./config";
import Task from "./controller/task";
import Employee from "./controller/employee";
import EmployeeModel from "./model/employee"; // Import Employee model

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/employee", Employee);
app.use("/api/task", Task);

// Function to initialize admin user
const createAdminUser = async () => {
  try {
    const existingAdmin = await EmployeeModel.findOne({ email: "admin@gmail.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const adminUser = new EmployeeModel({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        position: "Administrator",
        department: "Management",
        employee_id: "admin_001",
      });

      await adminUser.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Start the server and insert admin user
const server = async () => {
  try {
    await mongoose.connect(Config_Url.MONGO_URL);
    console.log("MongoDB connected");

    await createAdminUser(); // Insert admin user at startup

    app.listen(Config_Url.PORT, () =>
      console.log(`Server running on http://localhost:${Config_Url.PORT}`)
    );
  } catch (error: any) {
    console.log("Error in server: ", error.message);
  }
};

server();

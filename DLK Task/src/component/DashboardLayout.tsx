import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { MdDashboard, MdTask, MdPeople, MdLogout } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import clsx from "clsx";

export default function DashboardLayout() {
  const [theme, setTheme] = useState("light");
  interface User {
    role: number;
    [key: string]: any; // Add this if there are additional properties
  }

  const [user, setUser] = useState<User>({ role: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

  

  console.log(user, "getting user");

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar for Web */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 p-4 shadow-lg">
          {
            user?.role === 1 ? (
              <nav className="mt-4 space-y-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MdDashboard /> <span>Dashboard</span>
            </Link>

            <Link
              to="/dashboard/employee"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MdPeople /> <span>Employees</span>
            </Link>
            <Link
              to="/dashboard/task"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MdTask /> <span>Tasks</span>
            </Link>
          </nav>

            ):(
              <nav className="mt-4 space-y-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MdDashboard /> <span>Dashboard</span>
            </Link>

            <Link
              to="/dashboard/emp"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MdPeople /> <span>Employees</span>
            </Link>
          
          </nav>

            )
          }
          
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          {/* Navbar */}
          <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-end">
            <div className="flex items-center space-x-4">
           
              <div className="">
                <Link to="/" >
                  Logout
                </Link >
              </div>
            </div>
          </header>

          {/* Outlet for Nested Routes */}
          <main className="p-4 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
     {user.role ===1 ? <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex justify-around py-3">
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/dashboard/employee"
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <MdPeople className="text-xl" />
          <span>Employees</span>
        </Link>
        <Link
          to="/dashboard/task"
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <MdTask className="text-xl" />
          <span>Tasks</span>
        </Link>
      </nav>:<nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex justify-around py-3">
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/dashboard/emp"
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <MdTask className="text-xl" />
          <span>Tasks</span>
        </Link>
      </nav>}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Config_Url } from './api';

export default function Dashboard() {
  const [user, setUser] = useState<{ role?: number; employee?: { _id?: string } } | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Stored User:", storedUser);

    if (!storedUser.role) return; // Prevent unnecessary API calls

    setUser(storedUser);

    const fetchDashboardData = async () => {
      try {
        let response;
        if (storedUser.role === 1) {
          response = await axios.get(`${Config_Url.base_url}/employee/admin/dashboard`);
        } else if (storedUser.role === 2 && storedUser.employee?._id) {
          response = await axios.get(`${Config_Url.base_url}/employee/employee/${storedUser.employee._id}`);
        }

        console.log("API Response:", response?.data);

        if (response?.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      {user.role === 1 ? <AdminDashboard data={data} /> : <EmployeeDashboard data={data} />}
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ data }: { data: any }) {
  if (!data) return <p>Loading admin dashboard...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <DashboardCard title="Total Employees" value={String(data?.totalEmployees || "N/A")} />
      <DashboardCard title="Pending Tasks" value={String(data?.pendingTasks || "N/A")} />
      <DashboardCard title="Completed Tasks" value={String(data?.completedTasks || "N/A")} />
    </div>
  );
}

// Employee Dashboard Component
function EmployeeDashboard({ data }: { data: any }) {
  if (!data) return <p>Loading employee dashboard...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <DashboardCard title="Assigned Tasks" value={String(data?.totalTasks || "N/A")} />
      <DashboardCard title="Completed Tasks" value={String(data?.completedTasks || "N/A")} />
      <DashboardCard title="Pending Tasks" value={String(data?.pendingTasks || 0)} />
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{value}</p>
    </div>
  );
}

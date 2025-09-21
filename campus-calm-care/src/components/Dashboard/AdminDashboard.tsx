import React, { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Calendar, User, XCircle, Moon, Sun, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import toast, { Toaster } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const REFRESH_INTERVAL = 15000; // auto-refresh every 15 sec

const AdminDashboard = () => {
  const [studentStats, setStudentStats] = useState(null);
  const [counsellorStats, setCounsellorStats] = useState(null);
  const [appointmentSummary, setAppointmentSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("Token");
  const getConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const handleUnauthorized = () => {
    toast.error("Session expired, please login again");
    localStorage.removeItem("Token");
    window.location.href = "/auth";
  };

  const fetchStats = async () => {
    try {
      const [studentRes, counsellorRes, appointmentsRes, trendRes] =
        await Promise.all([
          axios.get(
            "https://mindcare-lf3g.onrender.com/api/v1/admins/student-stats",
            getConfig()
          ),
          axios.get(
            "https://mindcare-lf3g.onrender.com/api/v1/admins/counsellor-stats",
            getConfig()
          ),
          axios.get(
            "https://mindcare-lf3g.onrender.com/api/v1/admins/appointments-summary",
            getConfig()
          ),
          axios.get(
            "https://mindcare-lf3g.onrender.com/api/v1/admins/student-statistics-trend",
            getConfig()
          ),
        ]);

      setStudentStats(studentRes.data || {});
      setCounsellorStats(counsellorRes.data || {});
      setAppointmentSummary(appointmentsRes.data || {});
      setTrendData(trendRes.data?.trend || []);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Prepare data for full Student Trend chart
  const getFullTrendChart = () => {
    const phq9 = trendData.filter((t) => t.metric === "PHQ9");
    const gad7 = trendData.filter((t) => t.metric === "GAD7");
    const ghq = trendData.filter((t) => t.metric === "GHQ");

    // Ensure same label axis (dates)
    const labels = [...new Set(trendData.map((t) => t.date))];

    return {
      labels,
      datasets: [
        {
          label: "PHQ9",
          data: labels.map(
            (date) => phq9.find((t) => t.date === date)?.value || null
          ),
          borderColor: "#6366F1",
          backgroundColor: "rgba(99,102,241,0.2)",
          tension: 0.3,
        },
        {
          label: "GAD7",
          data: labels.map(
            (date) => gad7.find((t) => t.date === date)?.value || null
          ),
          borderColor: "#10B981",
          backgroundColor: "rgba(16,185,129,0.2)",
          tension: 0.3,
        },
        {
          label: "GHQ",
          data: labels.map(
            (date) => ghq.find((t) => t.date === date)?.value || null
          ),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245,158,11,0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500`}
    >
      <Toaster position="top-right" />
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button
            className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Total Students",
              value: studentStats?.totalStudents || 0,
              icon: <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
              color: "bg-indigo-100 dark:bg-indigo-900",
            },
            {
              title: "Total Counsellors",
              value: counsellorStats?.totalCounsellors || 0,
              icon: <User className="w-6 h-6 text-green-600 dark:text-green-400" />,
              color: "bg-green-100 dark:bg-green-900",
            },
            {
              title: "Appointments Pending",
              value: appointmentSummary?.pending || 0,
              icon: <XCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
              color: "bg-yellow-100 dark:bg-yellow-900",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {card.title}
                </p>
                <div
                  className={`${card.color} p-2 rounded-xl flex items-center justify-center`}
                >
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                <CountUp end={card.value} duration={1.5} />
              </p>
            </div>
          ))}
        </div>

        {/* Appointments Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-10 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <TrendingUp /> Appointments Summary
          </h2>
          <Bar
            data={{
              labels: ["Pending", "Completed", "Cancelled"],
              datasets: [
                {
                  label: "Appointments",
                  data: [
                    appointmentSummary?.pending || 0,
                    appointmentSummary?.confirmed || 0,
                    appointmentSummary?.cancelled || 0,
                  ],
                  backgroundColor: ["#FBBF24", "#10B981", "#EF4444"],
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        {/* Student Stats Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-10 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <TrendingUp /> Student Statistics Trend
          </h2>
          {trendData.length > 0 ? (
            <Line data={getFullTrendChart()} options={{ responsive: true }} />
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Calendar, Mail, Info, XCircle } from "lucide-react";
import Header from "../Header";

const CounsellorDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }
    setToken(storedToken);
  }, []);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleUnauthorized = () => {
    toast.error("Session expired, please login again");
    localStorage.removeItem("Token");
    navigate("/auth");
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/bookings/counsellor-bookings",
        getConfig()
      );

      setBookings(res.data.bookings);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const cancelBookingAsCounsellor = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/bookings/counsellor-cancel-booking/${id}`,
        getConfig()
      );

      toast.success("Booking cancelled successfully by you");
      fetchBookings(); // Re-fetch bookings after cancellation
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        My Booked Sessions
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No bookings found. 📭
        </p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all"
            >
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                {b.student.name}
              </h2>

              <p className="text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                {b.student.email}
              </p>

              <p className="text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                <span className="font-medium">Start:</span> {formatDate(b.start)}
              </p>

              <p className="text-gray-700 mb-2">
                <Info className="inline w-4 h-4 mr-2" />
                <span className="font-medium">Duration:</span> {b.durationMinutes} min
              </p>

              <p className="text-gray-700 mb-2">
                <span className="font-medium">Notes:</span> {b.notes || "None"}
              </p>

              <p className="text-gray-700 mb-4">
                <span className="font-medium">Status:</span>{" "}
                <span className={b.status === "cancelled" ? "text-red-500" : "text-green-500"}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </p>

              {b.status !== "cancelled" && (
                <button
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => cancelBookingAsCounsellor(b._id)}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounsellorDashboardPage;

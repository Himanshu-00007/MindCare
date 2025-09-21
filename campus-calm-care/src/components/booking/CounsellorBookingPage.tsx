import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Calendar,
  Mail,
  Info,
  XCircle,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";

const CounsellorBookingPage = () => {
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
        "https://mindcare-lf3g.onrender.com/api/v1/bookings/counsellor-bookings",
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
        `https://mindcare-lf3g.onrender.com/api/v1/bookings/counsellor-cancel-booking/${id}`,
        getConfig()
      );
      toast.success("Booking cancelled successfully by you");
      fetchBookings(); // Re-fetch after cancellation
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

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <Toaster position="top-right" />

    {/* Header */}
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          My Counselling Sessions
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your upcoming and past student sessions
        </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-emerald-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">
                {bookings.filter((b) => b.status === "cancelled").length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings */}
      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No sessions scheduled</h3>
            <p className="text-gray-500 text-lg">Your upcoming counselling sessions will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-xl">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{b.student.name}</h3>
                    <p className="text-gray-500 text-sm">Student</p>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl border text-sm font-medium ${getStatusColor(
                    b.status
                  )}`}
                >
                  {getStatusIcon(b.status)}
                  <span>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium">{b.student.email}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Session Time: </span>
                    <span>{formatDate(b.start)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Duration: </span>
                    <span>{b.durationMinutes} minutes</span>
                  </div>
                </div>

                {b.notes && (
                  <div className="flex items-start space-x-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded-lg mt-1">
                      <Info className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Notes:</span>
                      <p className="text-gray-600 leading-relaxed">{b.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm & Cancel Buttons */}
              {b.status === "pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={async () => {
                      try {
                        const res = await axios.patch(
                          `https://mindcare-lf3g.onrender.com/api/v1/bookings/confirm/${b._id}`,
                          {},
                          getConfig()
                        );
                        setBookings((prev) =>
                          prev.map((bk) =>
                            bk._id === b._id ? { ...bk, status: "confirmed" } : bk
                          )
                        );
                        toast.success("Session confirmed!");
                      } catch (err) {
                        toast.error(err.response?.data?.message || "Error confirming session");
                      }
                    }}
                  >
                    Confirm Session
                  </button>

                  <button
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => cancelBookingAsCounsellor(b._id)}
                  >
                    Cancel Session
                  </button>
                </div>
              )}

              {/* Cancel button for already confirmed */}
              {b.status === "confirmed" && (
                <button
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
                  onClick={() => cancelBookingAsCounsellor(b._id)}
                >
                  <XCircle className="w-5 h-5" />
                  <span>Cancel Session</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

export default CounsellorBookingPage;

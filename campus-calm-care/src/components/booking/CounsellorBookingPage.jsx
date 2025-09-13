import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Award, BookOpen, CheckCircle, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const CounsellorBookingPage = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedCounsellorId, setBookedCounsellorId] = useState(null);
  const [bookingId, setBookingId] = useState(null);

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

  const fetchCounsellors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/counsellors/list",
        getConfig()
      );
      setCounsellors(res.data.counsellors);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Failed to load counsellors");
    }
  };

  const fetchMyBooking = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/bookings/my-booking",
        getConfig()
      );

      if (res.data.booking) {
        setBookedCounsellorId(res.data.booking.counsellor._id);
        setBookingId(res.data.booking._id);
      }
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
    }
  };

  useEffect(() => {
    if (token) {
      fetchCounsellors();
      fetchMyBooking();
    }
  }, [token]);

  const createBooking = async () => {
    if (!selectedCounsellor) {
      toast.error("Please select a counsellor first");
      return;
    }
    if (!start) {
      toast.error("Please select a date and time");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/bookings/create-booking",
        {
          counsellorId: selectedCounsellor._id,
          start,
          durationMinutes: Number(duration),
          notes,
        },
        getConfig()
      );

      toast.success("Booking confirmed successfully!");
      setBookedCounsellorId(selectedCounsellor._id);
      setBookingId(res.data.booking._id);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedCounsellor(null);
        setStart("");
        setDuration(60);
        setNotes("");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!bookingId) {
      toast.error("No booking to cancel");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/bookings/cancel-booking/${bookingId}`,
        getConfig()
      );

      toast.success("Booking cancelled successfully");
      setBookedCounsellorId(null);
      setBookingId(null);
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

  const getDesignationIcon = (designation) => {
    switch (designation) {
      case "Psychologist":
        return <BookOpen className="w-5 h-5" />;
      case "Psychiatrist":
        return <Award className="w-5 h-5" />;
      case "Mentor":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-green-200 to-green-300">
        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg">
          <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your session with <span className="font-semibold">{selectedCounsellor?.name}</span> is scheduled.
          </p>
          <p className="text-gray-500 mb-6">📅 {formatDate(start)}</p>

          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => navigate("/student-booking")}
          >
            View My Bookings
          </button>

          <button
            className="ml-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            onClick={cancelBooking}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <Toaster position="top-right" />

      {!selectedCounsellor ? (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Choose a Counsellor</h1>

          {counsellors.length === 0 ? (
            <p className="text-center text-gray-500">Loading counsellors...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counsellors.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getDesignationIcon(c.designation)}
                        <span className="font-semibold text-indigo-600">{c.designation}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.name}</h3>
                    <p className="text-gray-600 mb-4 truncate">{c.email}</p>

                    <div className="bg-indigo-50 rounded-lg p-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-500" />
                        <span className="text-gray-700 text-sm">
                          {c.experience || "Experience not specified"}
                        </span>
                      </div>
                    </div>

                    {bookedCounsellorId === c._id ? (
                      <button
                        className="w-full bg-red-500 text-white py-2 rounded-lg"
                        onClick={cancelBooking}
                      >
                        Cancel Session
                      </button>
                    ) : (
                      <button
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        onClick={() => setSelectedCounsellor(c)}
                      >
                        Book Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <button className="text-blue-600 mb-6" onClick={() => setSelectedCounsellor(null)}>
            ← Back to list
          </button>

          <h2 className="text-2xl font-bold mb-4">Schedule Session with {selectedCounsellor.name}</h2>

          <label className="block mb-2 font-medium">Select Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border p-3 rounded mb-4"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <label className="block mb-2 font-medium">Duration (minutes)</label>
          <select
            className="w-full border p-3 rounded mb-4"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </select>

          <label className="block mb-2 font-medium">Additional Notes</label>
          <textarea
            className="w-full border p-3 rounded mb-4"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional message for the counsellor"
          />

          <button
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 disabled:opacity-50"
            onClick={createBooking}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CounsellorBookingPage;

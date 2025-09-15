import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Award, BookOpen, CheckCircle, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Counsellor {
  _id: string;
  name: string;
  email: string;
  designation: string;
  experience?: string;
}

const StudentBookingPage: React.FC = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [start, setStart] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [bookedCounsellorId, setBookedCounsellorId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

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
      const res = await axios.get<{ counsellors: Counsellor[] }>(
        "http://localhost:5000/api/v1/counsellors/list",
        getConfig()
      );
      setCounsellors(res.data.counsellors);
    } catch (err: any) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Failed to load counsellors");
    }
  };

  const fetchMyBooking = async () => {
    try {
      const res = await axios.get<{ booking: { _id: string; counsellor: Counsellor } }>(
        "http://localhost:5000/api/v1/bookings/my-booking",
        getConfig()
      );

      if (res.data.booking) {
        setBookedCounsellorId(res.data.booking.counsellor._id);
        setBookingId(res.data.booking._id);
      }
    } catch (err: any) {
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
      const res = await axios.post<{ booking: { _id: string } }>(
        "http://localhost:5000/api/v1/bookings/create-booking",
        {
          counsellorId: selectedCounsellor._id,
          start,
          durationMinutes: duration,
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
    } catch (err: any) {
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
    } catch (err: any) {
      if (err.response?.status === 401) handleUnauthorized();
      else toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getDesignationIcon = (designation: string) => {
    switch (designation) {
      case "Psychologist":
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case "Psychiatrist":
        return <Award className="w-5 h-5 text-yellow-500" />;
      case "Mentor":
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-green-200 to-green-300 animate-fadeIn px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg transform scale-105">
          <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your session with <span className="font-semibold">{selectedCounsellor?.name}</span> is scheduled.
          </p>
          <p className="text-gray-500 mb-6">📅 {formatDate(start)}</p>

          <div className="flex justify-center gap-4">
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
              onClick={() => navigate("/student-booking")}
            >
              View My Bookings
            </button>

            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md"
              onClick={cancelBooking}
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      {!selectedCounsellor ? (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
            Choose a Counsellor
          </h1>

          {counsellors.length === 0 ? (
            <p className="text-center text-gray-500">Loading counsellors...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counsellors.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
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
                    </div>

                    {bookedCounsellorId === c._id ? (
                      <button
                        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition shadow-md"
                        onClick={cancelBooking}
                      >
                        Cancel Session
                      </button>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition shadow-md"
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
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
          <button className="text-blue-600 mb-6 hover:underline" onClick={() => setSelectedCounsellor(null)}>
            ← Back to list
          </button>

          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Schedule Session with {selectedCounsellor.name}
          </h2>

          <label className="block mb-2 font-medium">Select Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <label className="block mb-2 font-medium">Duration (minutes)</label>
          <select
            className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </select>

          <label className="block mb-2 font-medium">Additional Notes</label>
          <textarea
            className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional message for the counsellor"
          />

          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition shadow-md disabled:opacity-50"
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

export default StudentBookingPage;

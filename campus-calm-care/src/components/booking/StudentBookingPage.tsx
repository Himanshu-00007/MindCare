import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Award, BookOpen, CheckCircle, Sparkles, Calendar, Clock, MessageSquare, ArrowLeft, Star, Heart, Brain, Users } from "lucide-react";
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
        return <Brain className="w-6 h-6 text-purple-500" />;
      case "Psychiatrist":
        return <Heart className="w-6 h-6 text-rose-500" />;
      case "Mentor":
        return <Star className="w-6 h-6 text-yellow-500" />;
      default:
        return <Users className="w-6 h-6 text-blue-500" />;
    }
  };

  const getDesignationColor = (designation: string) => {
    switch (designation) {
      case "Psychologist":
        return "from-purple-500 to-purple-600";
      case "Psychiatrist":
        return "from-rose-500 to-rose-600";
      case "Mentor":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const getDesignationBg = (designation: string) => {
    switch (designation) {
      case "Psychologist":
        return "bg-purple-50 border-purple-200";
      case "Psychiatrist":
        return "bg-rose-50 border-rose-200";
      case "Mentor":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-teal-100/20 to-cyan-100/20"></div>
        <div className="relative bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-12 text-center max-w-lg transform animate-pulse border border-emerald-200/50">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Booking Confirmed!
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-700 mb-4 text-lg">
              Your session with <span className="font-bold text-emerald-600">{selectedCounsellor?.name}</span> is scheduled.
            </p>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-8 border border-emerald-200">
              <p className="text-emerald-700 font-semibold flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(start)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg font-medium"
                onClick={() => navigate("/student-booking")}
              >
                View My Bookings
              </button>

              <button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg font-medium"
                onClick={cancelBooking}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-purple-100/30 pointer-events-none"></div>
      <Toaster position="top-right" />

      {!selectedCounsellor ? (
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Find Your Perfect Counsellor
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with experienced professionals who are here to support your mental health journey
            </p>
          </div>

          {counsellors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-xl text-gray-500">Discovering amazing counsellors for you...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counsellors.map((c) => (
                <div
                  key={c._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 hover:border-indigo-200"
                >
                  <div className="relative">
                    <div className={`h-2 bg-gradient-to-r ${getDesignationColor(c.designation)}`}></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`bg-gradient-to-r ${getDesignationColor(c.designation)} rounded-full p-2`}>
                        {getDesignationIcon(c.designation)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${getDesignationBg(c.designation)}`}>
                        {getDesignationIcon(c.designation)}
                        <span className="font-bold text-gray-700">{c.designation}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm">{c.email}</p>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-8 border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {c.experience || "Experience details available in consultation"}
                        </span>
                      </div>
                    </div>

                    {bookedCounsellorId === c._id ? (
                      <button
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg font-bold text-lg group-hover:shadow-xl"
                        onClick={cancelBooking}
                      >
                        Cancel Session
                      </button>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold text-lg group-hover:shadow-xl"
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
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50">
            <button 
              className="flex items-center gap-2 text-indigo-600 mb-8 hover:text-indigo-700 transition-colors font-medium text-lg group" 
              onClick={() => setSelectedCounsellor(null)}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to counsellors
            </button>

            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Schedule with {selectedCounsellor.name}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-4">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Select Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-lg bg-gray-50 hover:bg-white"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-4">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Session Duration
                </label>
                <select
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-lg bg-gray-50 hover:bg-white"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  Additional Notes
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-lg bg-gray-50 hover:bg-white resize-none"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything you'd like your counsellor to know before the session..."
                />
              </div>

              <button
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-8 py-5 rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={createBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Confirming your session...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBookingPage;
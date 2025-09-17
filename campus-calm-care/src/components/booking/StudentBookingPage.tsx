import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Award,
  BookOpen,
  CheckCircle,
  Sparkles,
  Calendar,
  Clock,
  MessageSquare,
  ArrowLeft,
  Star,
  Heart,
  Brain,
  Users,
} from "lucide-react";
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

  return (
    <div className="min-h-screen relative flex flex-col items-center p-6 overflow-hidden bg-gradient-to-br from-teal-100 via-lavender-100 to-blue-100">
      {/* Floating ambient orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-lavender-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-20 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>

      <Toaster position="top-right" />

      {!selectedCounsellor ? (
        <div className="relative max-w-7xl w-full mx-auto mt-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-lavender-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Find Your Perfect Counsellor
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-300 via-lavender-300 to-blue-300 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Connect with experienced professionals who are here to support your mental health journey
            </p>
          </div>

          {counsellors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
  <Users className="w-16 h-16 text-gray-400 mb-4" />
  <p className="text-gray-600 text-xl text-center">
    No counsellors are available at the moment.<br />
    Please check back later or contact support for assistance.
  </p>
</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counsellors.map((c) => {
                let designationGradient = "";
                let designationBg = "";
                switch (c.designation) {
                  case "Psychologist":
                    designationGradient = "from-purple-200 to-purple-400";
                    designationBg = "bg-purple-100/30 border-purple-200/50";
                    break;
                  case "Counsellor":
                    designationGradient = "from-indigo-200 to-blue-300";
                    designationBg = "bg-indigo-100/30 border-indigo-200/50";
                    break;
                  default:
                    designationGradient = "from-teal-200 to-cyan-300";
                    designationBg = "bg-teal-100/30 border-teal-200/50";
                }

                return (
                  <div
                    key={c._id}
                    className="group bg-white/20 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-white/20"
                  >
                    <div className="relative">
                      <div className={`h-2 bg-gradient-to-r ${designationGradient}`}></div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className={`rounded-full p-2 bg-gradient-to-r ${designationGradient}`}>
                          {getDesignationIcon(c.designation)}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${designationBg} mb-4`}>
                        {getDesignationIcon(c.designation)}
                        <span className="font-bold text-gray-800">{c.designation}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-gray-700 mb-4 text-sm">{c.email}</p>

                      <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {c.experience || "Experience details available in consultation"}
                          </span>
                        </div>
                      </div>

                      {bookedCounsellorId === c._id ? (
                        <button
                          className="w-full bg-gradient-to-r from-red-300 to-red-400 text-white py-3 rounded-2xl hover:from-red-400 hover:to-red-500 transition-all transform hover:scale-105 shadow-md font-bold text-lg"
                          onClick={cancelBooking}
                        >
                          Cancel Session
                        </button>
                      ) : (
                        <button
                          className="w-full bg-gradient-to-r from-teal-300 via-lavender-300 to-blue-300 text-gray-900 py-3 rounded-2xl hover:from-teal-400 hover:via-lavender-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-md font-bold text-lg"
                          onClick={() => setSelectedCounsellor(c)}
                        >
                          Book Session
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="relative max-w-3xl w-full mx-auto mt-12">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20">
            <button
              className="flex items-center gap-2 text-teal-600 mb-6 hover:text-teal-800 transition-colors font-medium text-lg group"
              onClick={() => setSelectedCounsellor(null)}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to counsellors
            </button>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-lavender-400 to-blue-400 bg-clip-text text-transparent mb-3">
                Schedule with {selectedCounsellor.name}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-300 via-lavender-300 to-blue-300 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Select Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border-2 border-white/20 p-3 rounded-2xl focus:ring-4 focus:ring-teal-200 focus:border-teal-400 outline-none transition-all text-lg bg-white/20 hover:bg-white/30 text-gray-900"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                  <Clock className="w-5 h-5 text-teal-400" />
                  Session Duration
                </label>
                <select
                  className="w-full border-2 border-white/20 p-3 rounded-2xl focus:ring-4 focus:ring-teal-200 focus:border-teal-400 outline-none transition-all text-lg bg-white/20 hover:bg-white/30 text-gray-900"
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
                <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                  <MessageSquare className="w-5 h-5 text-teal-400" />
                  Additional Notes
                </label>
                <textarea
                  className="w-full border-2 border-white/20 p-3 rounded-2xl focus:ring-4 focus:ring-teal-200 focus:border-teal-400 outline-none transition-all text-lg bg-white/20 hover:bg-white/30 text-gray-900 resize-none"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything you'd like your counsellor to know before the session..."
                />
              </div>

              <button
                className="w-full bg-gradient-to-r from-teal-300 via-lavender-300 to-blue-300 text-gray-900 px-6 py-4 rounded-2xl hover:from-teal-400 hover:via-lavender-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-md font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={createBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
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

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentHeader from "../StudentHeader";

interface Message {
  sender: "student" | "ai";
  text: string;
}

interface ChatResponse {
  reply: string;
  triage: { level: string; reason: string };
  suggestBooking: boolean;
}

const StudentChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestBooking, setSuggestBooking] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      setSnackbar({ message: "Please login to use chatbot", type: "error" });
      setTimeout(() => navigate("/auth"), 1500);
      return;
    }

    axios.get("http://localhost:5000/api/v1/chatbot/history", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => setChatHistory(res.data.messages || []))
    .catch(err => console.error("History fetch error:", err.response?.data || err.message));
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const token = localStorage.getItem("Token");
    if (!token) {
      setSnackbar({ message: "Please login to use chatbot", type: "error" });
      setTimeout(() => navigate("/auth"), 1500);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post<ChatResponse>(
        "http://localhost:5000/api/v1/chatbot/chat",
        { message },
        { headers: { Authorization: "Bearer " + token } }
      );

      setChatHistory(prev => [
        ...prev,
        { sender: "student", text: message },
        { sender: "ai", text: res.data.reply }
      ]);

      setSuggestBooking(res.data.suggestBooking);
      setMessage("");
    } catch (err: any) {
      console.error("Chat send error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full min-h-screen relative flex flex-col items-center p-6 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    {/* Floating soft orbs for ambiance */}
    <div className="fixed top-16 left-16 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
    <div className="fixed top-40 right-24 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
    <div className="fixed bottom-16 left-32 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Header */}
      <div className="relative z-20 w-full mt-12 mb-12 px-4 md:px-12">
        <StudentHeader />
      </div>

      {/* Page title */}
      <div className="mb-10 text-center w-full flex justify-center px-4 md:px-0">
        <div className="inline-block bg-white/30 backdrop-blur-md border border-white/30 rounded-3xl px-8 py-4 shadow-xl">
          <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">
            🧠 Mental Health Support
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Your safe, guided space for support and wellbeing
          </p>
        </div>
      </div>

      {/* Chat container */}
      <div className="w-full px-4 md:px-12">
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col p-6 transition-all duration-300">
          <div
            className="overflow-y-auto h-[500px] p-6 space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner"
            ref={chatContainerRef}
          >
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"} animate-fade-in-up`}
              >
                <div
                  className={`px-6 py-4 rounded-2xl max-w-full md:max-w-md break-words shadow-lg transition-all duration-300 hover:scale-105 ${
                    msg.sender === "student"
                      ? "bg-gradient-to-r from-teal-400 to-blue-400 text-white shadow-teal-300/25"
                      : "bg-white/30 backdrop-blur-md text-gray-900 border border-white/20 shadow-white/10"
                  }`}
                >
                  <div className="text-medium font-medium">{msg.text}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/30 backdrop-blur-md text-gray-900 border border-white/20 px-6 py-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking suggestion */}
          {suggestBooking && (
            <div className="my-6 p-4 bg-gradient-to-r from-yellow-200/40 via-pink-200/30 to-purple-200/30 backdrop-blur-md border border-white/20 rounded-2xl text-center shadow-lg animate-slide-in">
              <div className="text-purple-700 font-medium mb-3">
                ⚠️ We recommend booking a counselling session for better support.
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-teal-300 hover:to-blue-300 transform hover:scale-105 transition-all duration-300 active:scale-95">
                Book Appointment
              </button>
            </div>
          )}

          {/* Input field */}
          <div className="flex mt-6 space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-teal-300/50 transition-all duration-300 hover:bg-white/30 shadow-lg"
                placeholder="Share your thoughts or concerns..."
                onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl hover:from-teal-300 hover:to-blue-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Sending</span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-md border transition-all duration-300 animate-slide-in ${
            snackbar.type === "success" ? "bg-green-400/80 border-green-300/40" : "bg-red-400/80 border-red-300/40"
          }`}
        >
          <div className="font-medium">{snackbar.message}</div>
        </div>
      )}
    </div>
  </div>
);






};

export default StudentChatPage;

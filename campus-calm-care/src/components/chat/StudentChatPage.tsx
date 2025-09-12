import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Message {
  sender: "student" | "ai";
  text: string;
}

interface ChatHistoryResponse {
  messages: Message[];
}

interface ChatResponse {
  reply: string;
  triage: {
    level: string;
    reason: string;
  };
  suggestBooking: boolean;
}

const StudentChatPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestBooking, setSuggestBooking] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new message appears
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  useEffect(() => {
    axios
      .get<ChatHistoryResponse>(`/api/v1/chatbot/history`, { withCredentials: true })
      .then((res) => {
        setChatHistory(res.data.messages || []);
      })
      .catch((err) =>
        console.error("History fetch error:", err.response?.data || err.message)
      );
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post<ChatResponse>(
        `/api/v1/chatbot/chat`,
        { message },
        { withCredentials: true }
      );

      setChatHistory((prev) => [
        ...prev,
        { sender: "student", text: message },
        { sender: "ai", text: res.data.reply },
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">🧠 Mental Health Support</h1>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md flex flex-col p-4">
        <div
          className="overflow-y-auto h-96 p-4 space-y-4 bg-gray-50 rounded"
          ref={chatContainerRef}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "student" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender === "student"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {suggestBooking && (
          <div className="my-4 p-3 bg-yellow-200 border border-yellow-400 rounded text-center">
            ⚠️ We recommend you book a counselling session for further support.
            <button className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Book Appointment
            </button>
          </div>
        )}

        <div className="flex mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Type your message here..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChatPage;

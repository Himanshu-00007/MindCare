import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Activity, User, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Snackbar Component
const Snackbar = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <div className="flex items-center justify-between space-x-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold">×</button>
    </div>
  </div>
);

const StudentHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error"; } | null>(null);
  const [studentName, setStudentName] = useState<string>("");

  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/");
    showSnackbar("Logged out successfully!", "success");
  };

  // Fetch student name
  useEffect(() => {
    const fetchStudentName = async () => {
      const token = localStorage.getItem("Token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/v1/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentName();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Student Name on Left */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/student-dashboard")}
          >
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-gray-300 shadow-sm">
              <User className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-800 font-semibold">{studentName || "Student"}</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <button className="flex items-center space-x-1 hover:text-indigo-600 transition" onClick={() => navigate("/student-dashboard")}>
              <Activity className="w-5 h-5" /> <span>Home</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-indigo-600 transition" onClick={() => navigate("/chat")}>
              <MessageCircle className="w-5 h-5" /> <span>AI Chatbot</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-indigo-600 transition" onClick={() => navigate("/self-assessment")}>
              <Activity className="w-5 h-5" /> <span>Self Assessment</span>
            </button>

            {/* Logout Button */}
            <Button size="sm" className="ml-4 bg-red-500 hover:bg-red-600 shadow-sm" onClick={handleLogout}>
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-200 bg-white"
            >
              <nav className="flex flex-col space-y-4 px-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-gray-300 shadow-sm mb-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-800 font-semibold">{studentName || "Student"}</span>
                </div>

                <button className="flex items-center space-x-2 py-2" onClick={() => { navigate("/"); toggleMenu(); }}>
                  <Activity className="w-5 h-5" /> <span>Home</span>
                </button>
                <button className="flex items-center space-x-2 py-2" onClick={() => { navigate("/chat"); toggleMenu(); }}>
                  <MessageCircle className="w-5 h-5" /> <span>AI Chatbot</span>
                </button>
                <button className="flex items-center space-x-2 py-2" onClick={() => { navigate("/self-assessment"); toggleMenu(); }}>
                  <Activity className="w-5 h-5" /> <span>Self Assessment</span>
                </button>

                <Button size="sm" className="bg-red-500 hover:bg-red-600 mt-2 shadow-sm" onClick={() => { handleLogout(); toggleMenu(); }}>
                  Logout
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />
      )}
    </header>
  );
};

export default StudentHeader;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3, Upload, User } from "lucide-react";
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
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-3">
        {type === "success" ? (
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors duration-200 ml-4 p-1 rounded-full hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [adminName, setAdminName] = useState<string>("");

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

  useEffect(() => {
    const fetchAdminName = async () => {
      const token = localStorage.getItem("Token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/v1/admins/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminName();
  }, []);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin-dashboard" },
    { icon: Upload, label: "Media Upload", path: "/media-dashboard" },
    { icon: User, label: "Resource Hub", path: "/resource-hub" }, // Resource Hub button
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Admin Info */}
        <motion.div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate("/admin-dashboard")}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h2 className="text-lg font-semibold text-gray-900">{adminName || "Admin"}</h2>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="outline"
              size="default"
              className="flex items-center space-x-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          ))}

          <Button
            variant="destructive"
            size="default"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <X className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <div className="flex flex-col space-y-3 p-4">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="default"
                  onClick={() => { navigate(item.path); toggleMenu(); }}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              ))}
              <Button
                variant="destructive"
                size="default"
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;

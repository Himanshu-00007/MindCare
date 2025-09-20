import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <button onClick={onClose} className="text-white font-bold">
        ×
      </button>
    </div>
  </div>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const Token = localStorage.getItem("Token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!Token);
    setRole(storedRole);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 1500);
  };
  const handleLogin = () => navigate("/auth");
  const handleDashboard = () => {
    if (role === "student") navigate("/student-dashboard");
    else if (role === "counsellor") navigate("/counsellor-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
    else navigate("/");
  };
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
    showSnackbar("Logged out successfully!", "success");
  };

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white animate-pulse-slow">
              <img src="/imp.jpeg" alt="MindCare Logo" className="w-8 h-8 object-cover" />
            </div>
            <span className="text-2xl font-bold text-foreground select-none">MindCare</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/student-dashboard")}>
                  For Students
                </Button>
                <Button size="sm" className="hover-glow" onClick={handleLogin}>
                  Login
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleDashboard}>
                  Dashboard
                </Button>
                <Button size="sm" className="hover-glow" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
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
              className="md:hidden py-4 border-t border-border bg-background"
            >
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => { scrollToSection("about"); toggleMenu(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => { scrollToSection("features"); toggleMenu(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => { scrollToSection("faq"); toggleMenu(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </button>

                <div className="flex flex-col space-y-2 pt-4">
                  {!isLoggedIn ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { navigate("/students"); toggleMenu(); }}>
                        For Students
                      </Button>
                      <Button size="sm" onClick={() => { handleLogin(); toggleMenu(); }}>
                        Login
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { handleDashboard(); toggleMenu(); }}>
                        Dashboard
                      </Button>
                      <Button size="sm" onClick={() => { handleLogout(); toggleMenu(); }}>
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Snackbar */}
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
    </header>
  );
};

export default Header;

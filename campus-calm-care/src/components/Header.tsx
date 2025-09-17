import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Snackbar = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void; }) => (
  <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${type==="success"?"bg-green-500":"bg-red-500"}`}>
    <div className="flex items-center justify-between space-x-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold">×</button>
    </div>
  </div>
);

const Header = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [role,setRole]=useState<string|null>(null);
  const [snackbar,setSnackbar]=useState<{message:string,type:"success"|"error"}|null>(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const Token = localStorage.getItem("Token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!Token);
    setRole(storedRole);
  },[]);

  const toggleMenu=()=>setIsMenuOpen(!isMenuOpen);
  const showSnackbar=(message:string,type:"success"|"error")=>{setSnackbar({message,type});setTimeout(()=>setSnackbar(null),1000);}
  const handleLogin=()=>navigate("/auth");
  const handleDashboard=()=>{if(role==="student")navigate("/student-dashboard");else if(role==="counsellor")navigate("/counsellor-booking");else if(role==="admin")navigate("/video-dashboard");else navigate("/");}
  const handleLogout=()=>{localStorage.removeItem("Token");localStorage.removeItem("id");localStorage.removeItem("role");setIsLoggedIn(false);setRole(null);navigate("/");showSnackbar("Logged out successfully!","success");}

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white"/>
            </div>
            <span className="text-xl font-semibold text-foreground">MindCare</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn?<>
              <Button variant="outline" size="sm" onClick={()=>navigate("/students")}>For Students</Button>
              <Button size="sm" className="hover-glow" onClick={handleLogin}>Login</Button>
            </>:<>
              <Button variant="outline" size="sm" onClick={handleDashboard}>Dashboard</Button>
              <Button size="sm" className="hover-glow" onClick={handleLogout}>Logout</Button>
            </>}
          </div>

          <button className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen?<X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-20,opacity:0}} transition={{duration:0.3}} className="md:hidden py-4 border-t border-border bg-background">
              <nav className="flex flex-col space-y-4">
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors" onClick={toggleMenu}>About</a>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" onClick={toggleMenu}>Features</a>
                <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors" onClick={toggleMenu}>Resources</a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors" onClick={toggleMenu}>Contact</a>

                <div className="flex flex-col space-y-2 pt-4">
                  {!isLoggedIn?<>
                    <Button variant="outline" size="sm" onClick={()=>{navigate("/students");toggleMenu();}}>For Students</Button>
                    <Button size="sm" onClick={()=>{handleLogin();toggleMenu();}}>Login</Button>
                  </>:<>
                    <Button variant="outline" size="sm" onClick={()=>{handleDashboard();toggleMenu();}}>Dashboard</Button>
                    <Button size="sm" onClick={()=>{handleLogout();toggleMenu();}}>Logout</Button>
                  </>}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={()=>setSnackbar(null)}/>}
    </header>
  );
};

export default Header;

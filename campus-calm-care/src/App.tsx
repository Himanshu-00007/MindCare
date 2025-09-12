import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import StudentRegisterPage from "./components/register/StudentRegisterPage";
import StudentLoginPage from "./components/login/StudentLoginPage";
import CounsellorRegisterPage from "./components/register/CounsellorRegisterPage";
import CounsellorLoginPage from "./components/login/CounsellorLoginPage";
import AuthGuard from "./components/AuthGuard";
import StudentChatPage from "./components/chat/StudentChatPage";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/student-register" element={<StudentRegisterPage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/counsellor-register" element={<CounsellorRegisterPage />} />
          <Route path="/counsellor-login" element={<CounsellorLoginPage />} />

          {/* Protected routes */}
          <Route
            path="/chat"
            element={
              <AuthGuard userType="student">
                <StudentChatPage/>
              </AuthGuard>
            }
          />

          

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";


import StudentBookingPage from "./components/booking/StudentBookingPage"
import CounsellorDashboardPage from "./components/booking/CounsellorDashboardPage";
import StudentChatPage from "./components/chat/StudentChatPage";
import AuthPage from "./components/Authentication/AuthPage";
import MediaDashboard from "./components/ResourceHub/MediaDashboard";
import StudentHeader from "./components/Dashboard/StudentDashboard";
import StudentMediaDashboard from "./components/ResourceHub/StudentMediaDashboard";
import SelfAssessmentForm from "./components/SelfAssessment/SelfAssessmentForm";


// Initialize react-query
const queryClient = new QueryClient();

// Define the router with future flags
const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/chat", element: <StudentChatPage /> },
    {path: "/student-booking", element: <StudentBookingPage/>},
    {path: "/counsellor-booking", element: <CounsellorDashboardPage />},
    {path: "/media-dashboard", element: <MediaDashboard />},
    {path: "/student-dashboard", element: <StudentHeader />},
    {path: "/student-media", element: <StudentMediaDashboard />},
    {path: "/self-assessment", element: <SelfAssessmentForm />},

    { path: "*", element: <NotFound /> },
    
  ],
  
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

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
import CounsellorBookingPage from "./components/booking/CounsellorBookingPage";
import StudentChatPage from "./components/chat/StudentChatPage";
import AuthPage from "./components/Authentication/AuthPage";
import MediaDashboard from "./components/ResourceHub/MediaDashboard";
import StudentHeader from "./components/Dashboard/StudentDashboard";
import StudentMediaDashboard from "./components/ResourceHub/StudentMediaDashboard";
import SelfAssessmentForm from "./components/SelfAssessment/SelfAssessmentForm";
import CounsellorDashboard from "./components/Dashboard/CounsellorDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ResourceHub from "./components/ResourceHub/ResourceHub";
import ResultsPage from "./components/SelfAssessment/ResultsPage";


// Initialize react-query
const queryClient = new QueryClient();

// Define the router with future flags
const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/chat", element: <StudentChatPage /> },
    {path: "/student-booking", element: <StudentBookingPage/>},
    {path: "/counsellor-booking", element: <CounsellorBookingPage />},
    {path: "/media-dashboard", element: <MediaDashboard />},
    {path: "/admin-dashboard", element: <AdminDashboard />},
    {path: "/student-dashboard", element: <StudentHeader />},
    {path: "/student-media", element: <StudentMediaDashboard />},
    {path: "/self-assessment", element: <SelfAssessmentForm />},
    {path: "/counsellor-dashboard", element: <CounsellorDashboard />},
    {path: "/resource-hub", element: <ResourceHub />},
    {path: "/results", element: <ResultsPage />},
    { path: "*", element: <NotFound /> },
    
  ],
  
);

const App = () => (
  
      <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
    
);

export default App;

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
import VideoDashboard from "./components/ResourceHub/VideoDashboard";


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
    {path: "/video-dashboard", element: <VideoDashboard />},

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

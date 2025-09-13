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


import CouncellorBookingPage from "./components/booking/CounsellorBookingPage.jsx"
import StudentChatPage from "./components/chat/StudentChatPage";
import AuthPage from "./components/Authentication/AuthPage";

// Initialize react-query
const queryClient = new QueryClient();

// Define the router with future flags
const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/chat", element: <StudentChatPage /> },
    {path: "/student-booking", element: <CouncellorBookingPage/>},
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

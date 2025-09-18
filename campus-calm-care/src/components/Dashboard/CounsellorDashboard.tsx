import React from "react";
import CounsellorHeader from "../CounsellorHeader";
import CounsellorBookingPage from "../booking/CounsellorBookingPage";

function CounsellorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CounsellorHeader />
      </div>

      {/* Content Section */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <CounsellorBookingPage />
      </main>
    </div>
  );
}

export default CounsellorDashboard;

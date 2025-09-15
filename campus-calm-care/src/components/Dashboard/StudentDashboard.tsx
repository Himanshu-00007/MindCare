import React from 'react';
import StudentHeader from '../StudentHeader';
import StudentBookingPage from '../booking/StudentBookingPage';

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentHeader />

      {/* Main content with top padding to avoid overlap */}
      <div className="pt-24"> {/* Adjust pt-24 depending on header height */}
        <StudentBookingPage />
      </div>
    </div>
  );
}

export default StudentDashboard;

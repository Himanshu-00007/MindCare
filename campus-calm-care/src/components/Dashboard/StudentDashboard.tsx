import React from 'react';
import StudentHeader from '../StudentHeader';
import StudentBookingPage from '../booking/StudentBookingPage';
import StudentMediaDashboard from '../ResourceHub/StudentMediaDashboard';

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentHeader />

      {/* Main content with top padding to prevent overlap with header */}
      <main className="pt-24 space-y-10">
        {/* Booking Section */}
        <StudentBookingPage />

        {/* Media Dashboard Section */}
        <StudentMediaDashboard />
      </main>
    </div>
  );
}

export default StudentDashboard;

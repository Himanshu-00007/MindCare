import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentHeader from "../StudentHeader";

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scores from SelfAssessmentForm
  const { phq9Score, gad7Score, ghqScore } = location.state || {};
  const [assessmentLevel, setAssessmentLevel] = useState<string>("");

  // Calculate level
  useEffect(() => {
    if (phq9Score === undefined || gad7Score === undefined || ghqScore === undefined) {
      navigate("/self-assessment"); // fallback
      return;
    }

    const total = phq9Score + gad7Score + ghqScore;
    if (total >= 20) setAssessmentLevel("high");
    else if (total >= 10) setAssessmentLevel("medium");
    else setAssessmentLevel("low");
  }, [phq9Score, gad7Score, ghqScore, navigate]);

  if (phq9Score === undefined || gad7Score === undefined || ghqScore === undefined) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="relative z-20 w-full  mb-3 px-4 md:px-12">
        <StudentHeader />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          📊 Your Self-Assessment Results
        </h2>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-blue-50 text-center shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-700">PHQ-9 (Depression)</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">{phq9Score}</p>
          </div>
          <div className="p-6 rounded-xl bg-indigo-50 text-center shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-indigo-700">GAD-7 (Anxiety)</h3>
            <p className="text-3xl font-bold text-indigo-900 mt-2">{gad7Score}</p>
          </div>
          <div className="p-6 rounded-xl bg-pink-50 text-center shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-pink-700">GHQ (General Health)</h3>
            <p className="text-3xl font-bold text-pink-900 mt-2">{ghqScore}</p>
          </div>
        </div>

        {/* Conditional Recommendations */}
        {assessmentLevel === "high" && (
          <div className="text-center">
            <p className="text-red-600 font-medium mb-4">
              ⚠️ Your results indicate high stress levels. We strongly recommend connecting with a
              counsellor for professional guidance.
            </p>
            <button
              onClick={() => navigate("/student-booking")}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Book a Counselling Session
            </button>
          </div>
        )}

        {assessmentLevel === "medium" && (
          <div className="text-center">
            <p className="text-blue-600 font-medium mb-4">
              ℹ️ Your results show moderate stress. Talking with peers or using relaxation
              techniques may help.
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Connect via Chat
            </button>
          </div>
        )}

        {assessmentLevel === "low" && (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">
              ✅ Your stress levels seem manageable. Keep up your healthy habits!
            </p>
            <button
              onClick={() => navigate("/student-dashboard")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Go Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;

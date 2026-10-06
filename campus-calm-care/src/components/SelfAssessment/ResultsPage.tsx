import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentHeader from "../StudentHeader";

interface AssessmentResult {
  level: string;
  description: string;
  color: string;
}

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { phq9Score, gad7Score, ghqScore } = location.state || {};

  const [phq9Result, setPhq9Result] =
    useState<AssessmentResult | null>(null);

  const [gad7Result, setGad7Result] =
    useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (
      phq9Score === undefined ||
      gad7Score === undefined ||
      ghqScore === undefined
    ) {
      navigate("/self-assessment");
      return;
    }

    // PHQ-9 scoring
    if (phq9Score <= 4) {
      setPhq9Result({
        level: "Minimal",
        description:
          "Your PHQ-9 score is in the minimal range.",
        color: "green",
      });
    } else if (phq9Score <= 9) {
      setPhq9Result({
        level: "Mild",
        description:
          "Your PHQ-9 score is in the mild range.",
        color: "yellow",
      });
    } else if (phq9Score <= 14) {
      setPhq9Result({
        level: "Moderate",
        description:
          "Your PHQ-9 score is in the moderate range. Consider talking with a mental health professional if these symptoms are affecting your daily life.",
        color: "orange",
      });
    } else if (phq9Score <= 19) {
      setPhq9Result({
        level: "Moderately Severe",
        description:
          "Your PHQ-9 score is in the moderately severe range. Professional support may be helpful.",
        color: "red",
      });
    } else {
      setPhq9Result({
        level: "Severe",
        description:
          "Your PHQ-9 score is in the severe range. Professional evaluation is recommended.",
        color: "red",
      });
    }

    // GAD-7 scoring
    if (gad7Score <= 4) {
      setGad7Result({
        level: "Minimal",
        description:
          "Your GAD-7 score is in the minimal range.",
        color: "green",
      });
    } else if (gad7Score <= 9) {
      setGad7Result({
        level: "Mild",
        description:
          "Your GAD-7 score is in the mild range.",
        color: "yellow",
      });
    } else if (gad7Score <= 14) {
      setGad7Result({
        level: "Moderate",
        description:
          "Your GAD-7 score is in the moderate range. Consider talking with a mental health professional if anxiety is affecting your daily life.",
        color: "orange",
      });
    } else {
      setGad7Result({
        level: "Severe",
        description:
          "Your GAD-7 score is in the severe range. Professional evaluation may be helpful.",
        color: "red",
      });
    }
  }, [phq9Score, gad7Score, ghqScore, navigate]);

  if (
    phq9Score === undefined ||
    gad7Score === undefined ||
    ghqScore === undefined
  ) {
    return null;
  }

  // Counselling recommendation
  const needsCounselling =
    phq9Score >= 10 || gad7Score >= 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">

      <div className="relative z-20 w-full mb-3 px-4 md:px-12">
        <StudentHeader />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
          📊 Your Self-Assessment Results
        </h2>

        <p className="text-center text-gray-500 mb-8">
          These results provide an indication of your current
          symptoms and are not a medical diagnosis.
        </p>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* PHQ-9 */}
          <div className="p-6 rounded-xl bg-blue-50 text-center shadow">
            <h3 className="text-lg font-semibold text-blue-700">
              PHQ-9
            </h3>

            <p className="text-sm text-gray-500">
              Depression Symptoms
            </p>

            <p className="text-4xl font-bold text-blue-900 mt-3">
              {phq9Score}
            </p>

            {phq9Result && (
              <p className="mt-3 font-semibold text-blue-700">
                {phq9Result.level}
              </p>
            )}
          </div>

          {/* GAD-7 */}
          <div className="p-6 rounded-xl bg-indigo-50 text-center shadow">
            <h3 className="text-lg font-semibold text-indigo-700">
              GAD-7
            </h3>

            <p className="text-sm text-gray-500">
              Anxiety Symptoms
            </p>

            <p className="text-4xl font-bold text-indigo-900 mt-3">
              {gad7Score}
            </p>

            {gad7Result && (
              <p className="mt-3 font-semibold text-indigo-700">
                {gad7Result.level}
              </p>
            )}
          </div>

          {/* GHQ */}
          <div className="p-6 rounded-xl bg-pink-50 text-center shadow">
            <h3 className="text-lg font-semibold text-pink-700">
              GHQ
            </h3>

            <p className="text-sm text-gray-500">
              General Health
            </p>

            <p className="text-4xl font-bold text-pink-900 mt-3">
              {ghqScore}
            </p>

            <p className="mt-3 font-semibold text-pink-700">
              Raw Score
            </p>
          </div>
        </div>

        {/* PHQ explanation */}
        {phq9Result && (
          <div className="mb-6 p-5 rounded-xl bg-blue-50 border border-blue-100">
            <h3 className="font-bold text-gray-800 mb-2">
              PHQ-9: {phq9Result.level}
            </h3>

            <p className="text-gray-600">
              {phq9Result.description}
            </p>
          </div>
        )}

        {/* GAD explanation */}
        {gad7Result && (
          <div className="mb-6 p-5 rounded-xl bg-indigo-50 border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-2">
              GAD-7: {gad7Result.level}
            </h3>

            <p className="text-gray-600">
              {gad7Result.description}
            </p>
          </div>
        )}

        {/* Recommendation */}
        {needsCounselling ? (
          <div className="text-center mt-8">

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-700 font-medium">
                Your PHQ-9 or GAD-7 score is in the moderate
                or higher range. Consider connecting with a
                qualified counsellor for professional support.
              </p>
            </div>

            <button
              onClick={() => navigate("/student-booking")}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Book a Counselling Session
            </button>

          </div>
        ) : (
          <div className="text-center mt-8">

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <p className="text-green-700 font-medium">
                Your PHQ-9 and GAD-7 scores are below the
                moderate range. Continue maintaining healthy
                habits and monitor how you feel over time.
              </p>
            </div>

            <button
              onClick={() => navigate("/student-dashboard")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Go Back to Dashboard
            </button>

          </div>
        )}

        {/* Important note */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
          <strong>Important:</strong> This assessment is a
          screening tool and does not provide a medical diagnosis.
          If you are experiencing significant distress or thoughts
          of self-harm, seek immediate professional help.
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;
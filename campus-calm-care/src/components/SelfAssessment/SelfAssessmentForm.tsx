import { useState, useEffect } from "react";
import axios from "axios";
import StudentHeader from "../StudentHeader";
import { Navigate, useNavigate } from "react-router-dom";

interface SnackbarState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

function SelfAssessmentForm() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [phq9Responses, setPhq9Responses] = useState<number[]>(Array(9).fill(-1));
  const [gad7Responses, setGad7Responses] = useState<number[]>(Array(7).fill(-1));
  const [ghqResponses, setGhqResponses] = useState<number[]>(Array(5).fill(-1));
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const id = localStorage.getItem("id");
    setStudentId(id);
  }, []);

  const showSnackbar = (message: string, type: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!studentId) {
    showSnackbar("Student ID is missing! Please log in again.", 'error');
    return;
  }

  // Validate answers
  const unansweredSections = [];
  if (phq9Responses.includes(-1)) unansweredSections.push('PHQ-9 Depression Assessment');
  if (gad7Responses.includes(-1)) unansweredSections.push('GAD-7 Anxiety Assessment');
  if (ghqResponses.includes(-1)) unansweredSections.push('GHQ General Health Assessment');

  if (unansweredSections.length > 0) {
    showSnackbar(
      `Please complete all questions in: ${unansweredSections.join(', ')}`, 
      'warning'
    );
    return;
  }

  const phq9Score = phq9Responses.reduce((a, b) => a + b, 0);
  const gad7Score = gad7Responses.reduce((a, b) => a + b, 0);
  const ghqScore = ghqResponses.reduce((a, b) => a + b, 0);

  const token = localStorage.getItem("Token");
  if (!token) {
    showSnackbar("Authentication required! Please log in again.", 'error');
    return;
  }

  setLoading(true);

  try {
    await axios.patch(
      `https://mindcare-lf3g.onrender.com/api/v1/students/self-assessment/${studentId}`,
      { PHQ9: phq9Score, GAD7: gad7Score, GHQ: ghqScore },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    showSnackbar("✅ Self assessment completed successfully!", 'success');

    // ✅ Redirect to ResultsPage with scores
    setTimeout(() => {
      navigate("/results", { 
        state: { phq9Score, gad7Score, ghqScore } 
      });
    }, 1000);

    // reset state
    setPhq9Responses(Array(9).fill(-1));
    setGad7Responses(Array(7).fill(-1));
    setGhqResponses(Array(5).fill(-1));

  } catch (error: any) {
    console.error(error);
    const errorMessage = error.response?.data?.message || "Failed to save assessment. Please try again.";
    showSnackbar(`❌ ${errorMessage}`, 'error');
  } finally {
    setLoading(false);
  }
};


  const renderQuestionSection = (
    questions: string[],
    responses: number[],
    setResponses: React.Dispatch<React.SetStateAction<number[]>>,
    options: string[],
    colorTheme: string = "blue"
  ) => {
    const getColorClasses = (theme: string) => {
      switch (theme) {
        case "emerald":
          return {
            select: "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500",
            selectError: "border-red-300 focus:border-red-500 focus:ring-red-500"
          };
        case "blue":
          return {
            select: "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
            selectError: "border-red-300 focus:border-red-500 focus:ring-red-500"
          };
        case "purple":
          return {
            select: "border-purple-200 focus:border-purple-500 focus:ring-purple-500",
            selectError: "border-red-300 focus:border-red-500 focus:ring-red-500"
          };
        default:
          return {
            select: "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
            selectError: "border-red-300 focus:border-red-500 focus:ring-red-500"
          };
      }
    };

    const colors = getColorClasses(colorTheme);

    return questions.map((question, index) => {
      const isUnanswered = responses[index] === -1;
      
      return (
        <div key={index} className="mb-6 last:mb-0">
          <p className="text-gray-800 font-medium mb-3 leading-relaxed">
            <span className={`inline-flex items-center justify-center w-6 h-6 ${isUnanswered ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} text-sm rounded-full mr-3 flex-shrink-0 transition-colors duration-200`}>
              {index + 1}
            </span>
            {question}
            <span className="text-red-500 ml-1">*</span>
          </p>
          <select
            value={responses[index]}
            onChange={(e) => {
              const updated = [...responses];
              updated[index] = parseInt(e.target.value);
              setResponses(updated);
            }}
            className={`w-full p-4 rounded-lg border-2 ${isUnanswered ? colors.selectError : colors.select} bg-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none hover:shadow-md text-gray-700 font-medium`}
            required
          >
            <option value={-1} disabled className="text-gray-400">
              Please select your response...
            </option>
            {options.map((opt, idx) => (
              <option key={idx} value={idx} className="text-gray-700 py-2">
                {opt}
              </option>
            ))}
          </select>
          {isUnanswered && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              This question is required
            </p>
          )}
        </div>
      );
    });
  };

  const Snackbar = () => {
    if (!snackbar.open) return null;

    const getSnackbarStyles = () => {
      switch (snackbar.type) {
        case 'success':
          return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
        case 'error':
          return 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
        case 'warning':
          return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
        default:
          return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      }
    };

    const getIcon = () => {
      switch (snackbar.type) {
        case 'success':
          return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'error':
          return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'warning':
          return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className={`${getSnackbarStyles()} px-6 py-4 rounded-lg shadow-2xl max-w-md flex items-center space-x-3 backdrop-blur-sm`}>
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm leading-relaxed">{snackbar.message}</p>
          </div>
          <button
            onClick={closeSnackbar}
            className="flex-shrink-0 ml-3 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
  <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 mt-10">
    <StudentHeader />
    <Snackbar />

    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-10 text-white">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-3">Mental Health Self Assessment</h2>
        <p className="text-center text-blue-100 text-lg leading-relaxed">
          Take a moment to reflect on your recent experiences. This assessment will help you understand your current well-being.
        </p>
        <div className="mt-4 text-center">
          <span className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-blue-100">
            <span className="text-red-300 mr-1">*</span>
            All questions are required
          </span>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 space-y-10">
        {/* PHQ9 Section */}
        <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">PHQ-9 Depression Assessment</h3>
              <p className="text-sm text-gray-600">Over the last 2 weeks, how often have you experienced the following?</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${phq9Responses.includes(-1) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {phq9Responses.filter(r => r !== -1).length}/{phq9Responses.length} completed
              </span>
            </div>
          </div>
          {renderQuestionSection(
            [
              "Little interest or pleasure in doing things",
              "Feeling down, depressed, or hopeless",
              "Trouble falling or staying asleep, or sleeping too much",
              "Feeling tired or having little energy",
              "Poor appetite or overeating",
              "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
              "Trouble concentrating on things, such as reading the newspaper or watching television",
              "Moving or speaking so slowly that other people could have noticed",
              "Thoughts that you would be better off dead, or of hurting yourself"
            ],
            phq9Responses,
            setPhq9Responses,
            ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            "emerald"
          )}
        </div>

        {/* GAD7 Section */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">GAD-7 Anxiety Assessment</h3>
              <p className="text-sm text-gray-600">Over the last 2 weeks, how often have you experienced the following?</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${gad7Responses.includes(-1) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {gad7Responses.filter(r => r !== -1).length}/{gad7Responses.length} completed
              </span>
            </div>
          </div>
          {renderQuestionSection(
            [
              "Feeling nervous, anxious, or on edge",
              "Not being able to stop or control worrying",
              "Worrying too much about different things",
              "Trouble relaxing",
              "Being so restless that it is hard to sit still",
              "Becoming easily annoyed or irritable",
              "Feeling afraid, as if something awful might happen"
            ],
            gad7Responses,
            setGad7Responses,
            ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            "blue"
          )}
        </div>

        {/* GHQ Section */}
        <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">GHQ General Health Assessment</h3>
              <p className="text-sm text-gray-600">Recently, have you experienced any of the following?</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${ghqResponses.includes(-1) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {ghqResponses.filter(r => r !== -1).length}/{ghqResponses.length} completed
              </span>
            </div>
          </div>
          {renderQuestionSection(
            [
              "Have you recently lost much sleep over worry?",
              "Have you recently felt constantly under strain?",
              "Have you recently felt you couldn't overcome difficulties?",
              "Have you recently been feeling unhappy or depressed?",
              "Have you recently been losing confidence in yourself?"
            ],
            ghqResponses,
            setGhqResponses,
            ["Not at all", "Same as usual", "Rather more than usual", "Much more than usual"],
            "purple"
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || phq9Responses.includes(-1) || gad7Responses.includes(-1) || ghqResponses.includes(-1)}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Assessment...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete Assessment</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your responses are confidential and will help provide personalized insights about your mental health.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
        <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your privacy is protected • Confidential assessment</span>
        </div>
      </div>
    </form>
  </div>
);

}

export default SelfAssessmentForm;
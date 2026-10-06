import { useState, useEffect } from "react";
import axios from "axios";
import StudentHeader from "../StudentHeader";
import { useNavigate } from "react-router-dom";

interface SnackbarState {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning";
}

function SelfAssessmentForm() {
  const [studentId, setStudentId] = useState<string | null>(null);

  const [phq9Responses, setPhq9Responses] = useState<number[]>(
    Array(9).fill(-1)
  );

  const [gad7Responses, setGad7Responses] = useState<number[]>(
    Array(7).fill(-1)
  );

  const [ghqResponses, setGhqResponses] = useState<number[]>(
    Array(5).fill(-1)
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const id = localStorage.getItem("id");
    setStudentId(id);
  }, []);

  const showSnackbar = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      type,
    });

    setTimeout(() => {
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }));
    }, 5000);
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      showSnackbar(
        "Student ID is missing! Please log in again.",
        "error"
      );
      return;
    }

    // Check whether every question has been answered
    const unansweredSections: string[] = [];

    if (phq9Responses.includes(-1)) {
      unansweredSections.push("Depression Assessment");
    }

    if (gad7Responses.includes(-1)) {
      unansweredSections.push("Anxiety Assessment");
    }

    if (ghqResponses.includes(-1)) {
      unansweredSections.push("General Health Assessment");
    }

    if (unansweredSections.length > 0) {
      showSnackbar(
        `Please complete all questions in: ${unansweredSections.join(", ")}`,
        "warning"
      );
      return;
    }

    /*
      Scoring:

      PHQ-9:
      9 questions × 0-3 = 0-27

      GAD-7:
      7 questions × 0-3 = 0-21

      GHQ:
      5 questions × 0-3 = 0-15
    */

    const phq9Score = phq9Responses.reduce(
      (total, score) => total + score,
      0
    );

    const gad7Score = gad7Responses.reduce(
      (total, score) => total + score,
      0
    );

    const ghqScore = ghqResponses.reduce(
      (total, score) => total + score,
      0
    );

    console.log("PHQ-9 Score:", phq9Score);
    console.log("GAD-7 Score:", gad7Score);
    console.log("GHQ Score:", ghqScore);

    const token = localStorage.getItem("Token");

    if (!token) {
      showSnackbar(
        "Authentication required! Please log in again.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      await axios.patch(
        `https://mindcare-lf3g.onrender.com/api/v1/students/self-assessment/${studentId}`,
        {
          PHQ9: phq9Score,
          GAD7: gad7Score,
          GHQ: ghqScore,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      showSnackbar(
        "✅ Self assessment completed successfully!",
        "success"
      );

      // Send individual scores to ResultsPage
      setTimeout(() => {
        navigate("/results", {
          state: {
            phq9Score,
            gad7Score,
            ghqScore,
          },
        });
      }, 1000);

      // Reset form
      setPhq9Responses(Array(9).fill(-1));
      setGad7Responses(Array(7).fill(-1));
      setGhqResponses(Array(5).fill(-1));
    } catch (error: any) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to save assessment. Please try again.";

      showSnackbar(`❌ ${errorMessage}`, "error");
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
            select:
              "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500",
            selectError:
              "border-red-300 focus:border-red-500 focus:ring-red-500",
          };

        case "blue":
          return {
            select:
              "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
            selectError:
              "border-red-300 focus:border-red-500 focus:ring-red-500",
          };

        case "purple":
          return {
            select:
              "border-purple-200 focus:border-purple-500 focus:ring-purple-500",
            selectError:
              "border-red-300 focus:border-red-500 focus:ring-red-500",
          };

        default:
          return {
            select:
              "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
            selectError:
              "border-red-300 focus:border-red-500 focus:ring-red-500",
          };
      }
    };

    const colors = getColorClasses(colorTheme);

    return questions.map((question, index) => {
      const isUnanswered = responses[index] === -1;

      return (
        <div key={index} className="mb-6 last:mb-0">
          <p className="text-gray-800 font-medium mb-3 leading-relaxed">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 ${
                isUnanswered
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              } text-sm rounded-full mr-3 flex-shrink-0`}
            >
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
            className={`w-full p-4 rounded-lg border-2 ${
              isUnanswered
                ? colors.selectError
                : colors.select
            } bg-white shadow-sm focus:ring-2 focus:ring-opacity-20 focus:outline-none hover:shadow-md text-gray-700 font-medium`}
            required
          >
            <option value={-1} disabled>
              Please select your response...
            </option>

            {options.map((option, optionIndex) => (
              <option
                key={optionIndex}
                value={optionIndex}
              >
                {option}
              </option>
            ))}
          </select>

          {isUnanswered && (
            <p className="text-red-500 text-sm mt-2">
              ⚠️ This question is required
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
        case "success":
          return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";

        case "error":
          return "bg-gradient-to-r from-red-500 to-rose-600 text-white";

        case "warning":
          return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";

        default:
          return "bg-blue-500 text-white";
      }
    };

    return (
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`${getSnackbarStyles()} px-6 py-4 rounded-lg shadow-2xl max-w-md flex items-center space-x-3`}
        >
          <div className="flex-1">
            <p className="font-medium text-sm">
              {snackbar.message}
            </p>
          </div>

          <button
            type="button"
            onClick={closeSnackbar}
            className="hover:bg-white/20 rounded-full p-1"
          >
            ✕
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
        className="w-full mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-10 text-white">
          <h2 className="text-3xl font-bold text-center mb-3">
            Mental Health Self Assessment
          </h2>

          <p className="text-center text-blue-100 text-lg">
            Take a moment to reflect on your recent experiences.
          </p>

          <div className="mt-4 text-center">
            <span className="text-sm text-blue-100">
              <span className="text-red-300">*</span>{" "}
              All questions are required
            </span>
          </div>
        </div>

        <div className="px-4 md:px-8 py-8 space-y-10">

          {/* PHQ-9 */}
          <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              PHQ-9 Depression Assessment
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Over the last 2 weeks, how often have you experienced the following?
            </p>

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
                "Thoughts that you would be better off dead, or of hurting yourself",
              ],
              phq9Responses,
              setPhq9Responses,
              [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
              ],
              "emerald"
            )}
          </div>

          {/* GAD-7 */}
          <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              GAD-7 Anxiety Assessment
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Over the last 2 weeks, how often have you experienced the following?
            </p>

            {renderQuestionSection(
              [
                "Feeling nervous, anxious, or on edge",
                "Not being able to stop or control worrying",
                "Worrying too much about different things",
                "Trouble relaxing",
                "Being so restless that it is hard to sit still",
                "Becoming easily annoyed or irritable",
                "Feeling afraid, as if something awful might happen",
              ],
              gad7Responses,
              setGad7Responses,
              [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
              ],
              "blue"
            )}
          </div>

          {/* GHQ */}
          <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              GHQ General Health Assessment
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Recently, have you experienced any of the following?
            </p>

            {renderQuestionSection(
              [
                "Have you recently lost much sleep over worry?",
                "Have you recently felt constantly under strain?",
                "Have you recently felt you couldn't overcome difficulties?",
                "Have you recently been feeling unhappy or depressed?",
                "Have you recently been losing confidence in yourself?",
              ],
              ghqResponses,
              setGhqResponses,
              [
                "Not at all",
                "Same as usual",
                "Rather more than usual",
                "Much more than usual",
              ],
              "purple"
            )}
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={
                loading ||
                phq9Responses.includes(-1) ||
                gad7Responses.includes(-1) ||
                ghqResponses.includes(-1)
              }
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all"
            >
              {loading
                ? "Processing Assessment..."
                : "Complete Assessment"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Your responses are confidential and will help provide
                personalized insights about your mental health.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <div className="flex items-center justify-center text-sm text-gray-500">
            🔒 Your privacy is protected • Confidential assessment
          </div>
        </div>
      </form>
    </div>
  );
}

export default SelfAssessmentForm;
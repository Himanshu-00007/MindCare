import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 🔹 Snackbar Component
const Snackbar = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <div className="flex items-center justify-between space-x-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold">
        ×
      </button>
    </div>
  </div>
);

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "counsellor" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    age: "",
    gender: "",
    course: "",
    institution: "",
  });

  const [counsellorData, setCounsellorData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    experience: "",
    institution: "",
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "student" | "counsellor" | "login"
  ) => {
    const { name, value } = e.target;
    if (type === "student") setStudentData((prev) => ({ ...prev, [name]: value }));
    else if (type === "counsellor") setCounsellorData((prev) => ({ ...prev, [name]: value }));
    else setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole: "student" | "counsellor" | "admin") => {
    setRole(selectedRole);
    if (selectedRole === "admin") setTab("login");
  };

  // 🔹 Password minimum 8 characters
  const isPasswordStrong = (password: string) => password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔹 Simplified password selection
      const password =
        tab === "login" ? loginData.password : role === "student" ? studentData.password : counsellorData.password;

      if (!isPasswordStrong(password)) {
        showSnackbar("Password must be at least 8 characters long!", "error");
        setLoading(false);
        return;
      }

      if (tab === "register") {
        const url = `https://mindcare-lf3g.onrender.com/api/v1/${role}s/${role}-register`;
        const payload = role === "student" ? studentData : counsellorData;
        await axios.post(url, payload, { withCredentials: true });

        // Auto-login after registration
        const loginUrl = `https://mindcare-lf3g.onrender.com/api/v1/${role}s/${role}-login`;
        const loginPayload = { email: payload.email, password: payload.password };
        const res = await axios.post(loginUrl, loginPayload, { withCredentials: true });

        localStorage.setItem("Token", res.data.Token);
        localStorage.setItem("id", res.data.User._id);
        localStorage.setItem("role", role);

        showSnackbar(`${role} registered and logged in successfully!`, "success");

        setTimeout(() => {
          if (role === "student") navigate("/student-dashboard");
          else if (role === "counsellor") navigate("/counsellor-dashboard");
          else if (role === "admin") navigate("/admin-dashboard");
        }, 1000);
      } else {
        const url = `https://mindcare-lf3g.onrender.com/api/v1/${role}s/${role}-login`;
        const res = await axios.post(url, loginData, { withCredentials: true });

        localStorage.setItem("Token", res.data.Token);
        localStorage.setItem("id", res.data.User._id);
        localStorage.setItem("role", role);

        showSnackbar(`${role} logged in successfully!`, "success");

        setTimeout(() => {
          if (role === "student") navigate("/student-dashboard");
          else if (role === "counsellor") navigate("/counsellor-dashboard");
          else if (role === "admin") navigate("/admin-dashboard");
        }, 1000);
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">MindCare Auth</h1>
          <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="mt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register" disabled={role === "admin"}>
                Register
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {tab === "register" && role === "student" && (
                <>
                  <Input type="text" name="name" placeholder="Full Name" value={studentData.name} onChange={(e) => handleChange(e, "student")} required />
                  <Input type="email" name="email" placeholder="Email" value={studentData.email} onChange={(e) => handleChange(e, "student")} required />
                  <Input type="text" name="mobile_number" placeholder="Mobile Number" value={studentData.mobile_number} onChange={(e) => handleChange(e, "student")} required />
                  <Input type="password" name="password" placeholder="Password" value={studentData.password} onChange={(e) => handleChange(e, "student")} required />
                  <Input type="number" name="age" placeholder="Age" value={studentData.age} onChange={(e) => handleChange(e, "student")} />
                  <Input type="text" name="gender" placeholder="Gender" value={studentData.gender} onChange={(e) => handleChange(e, "student")} />
                  <Input type="text" name="course" placeholder="Course" value={studentData.course} onChange={(e) => handleChange(e, "student")} />
                  <Input type="text" name="institution" placeholder="Institution" value={studentData.institution} onChange={(e) => handleChange(e, "student")} />
                </>
              )}

              {tab === "register" && role === "counsellor" && (
                <>
                  <Input type="text" name="name" placeholder="Full Name" value={counsellorData.name} onChange={(e) => handleChange(e, "counsellor")} required />
                  <Input type="email" name="email" placeholder="Email" value={counsellorData.email} onChange={(e) => handleChange(e, "counsellor")} required />
                  <Input type="password" name="password" placeholder="Password" value={counsellorData.password} onChange={(e) => handleChange(e, "counsellor")} required />
                  <Input type="text" name="designation" placeholder="Designation" value={counsellorData.designation} onChange={(e) => handleChange(e, "counsellor")} />
                  <Input type="text" name="experience" placeholder="Experience" value={counsellorData.experience} onChange={(e) => handleChange(e, "counsellor")} />
                  <Input type="text" name="institution" placeholder="Institution" value={counsellorData.institution} onChange={(e) => handleChange(e, "counsellor")} />
                </>
              )}

              {tab === "login" && (
                <>
                  <Input type="email" name="email" placeholder="Email" value={loginData.email} onChange={(e) => handleChange(e, "login")} required />
                  <Input type="password" name="password" placeholder="Password" value={loginData.password} onChange={(e) => handleChange(e, "login")} required />
                </>
              )}

              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <label className="flex items-center space-x-2">
                  <input type="radio" value="student" checked={role === "student"} onChange={() => handleRoleChange("student")} />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="counsellor" checked={role === "counsellor"} onChange={() => handleRoleChange("counsellor")} />
                  <span>Counsellor</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="admin" checked={role === "admin"} onChange={() => handleRoleChange("admin")} />
                  <span>Admin</span>
                </label>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Please wait..." : tab === "login" ? "Login" : "Register"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
    </div>
  );
};

export default AuthPage;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/students/student-login", formData, { withCredentials: true });

      localStorage.setItem("studentId", res.data.loggedInUser._id);
      localStorage.setItem("authToken", res.data.Token);

      alert("Logged in successfully!");
      navigate("/chat");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Student Login</h1>

        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="input-field" />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input-field" />

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default StudentLoginPage;

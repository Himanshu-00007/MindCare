import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CounsellorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/v1/counsellors/counsellor-register", formData);
      alert("Counsellor registered successfully!");
      navigate("/counsellor-login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Counsellor Registration</h1>

        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="input-field" />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="input-field" />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input-field" />
        <input type="text" name="designation" placeholder="Designation" required onChange={handleChange} className="input-field" />

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default CounsellorRegisterPage;

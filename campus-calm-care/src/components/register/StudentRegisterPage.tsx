import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Phone, Lock, Calendar, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";


const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    age: "",
    gender: "",
    course: "",
    institution: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/v1/students/student-register", formData);
      navigate("/student-login");
      toast({
        title: "Registration Successful!",
        description: "Your student account has been created successfully.",
        variant: "success"
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile_number: "",
        password: "",
        age: "",
        gender: "",
        course: "",
        institution: "",
      });
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Student Registration
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Join our learning community today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange("mobile_number", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  required
                  min="16"
                  max="100"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)} required>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course */}
              <div className="space-y-2">
                <Label htmlFor="course" className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  Course
                </Label>
                <Input
                  id="course"
                  type="text"
                  placeholder="Enter your course"
                  value={formData.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution" className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="w-4 h-4" />
                  Institution
                </Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder="Enter institution name"
                  value={formData.institution}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Create Student Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-semibold text-primary">
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegister;
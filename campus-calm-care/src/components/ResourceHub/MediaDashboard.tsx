import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminHeader from "../AdminHeader";
import { useNavigate } from "react-router-dom";

const MediaUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isImage, setIsImage] = useState(false);

  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    if (file) {
      const fileType = file.type;
      setIsImage(fileType.startsWith("image/")); // true if image, false if video
    } else {
      setIsImage(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return showSnackbar("Please select a file.", "error");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", mediaFile);
      if (!isImage) formData.append("language", language); // only append language for videos

      await axios.post("https://mindcare-lf3g.onrender.com/api/v1/videos/video-upload", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      showSnackbar("Media uploaded successfully!", "success");

      // Clear form
      setTitle(""); setDescription(""); setMediaFile(null); setIsImage(false);

      // Redirect to Resource Hub
      navigate("/resource-hub");
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <AdminHeader />
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Upload Media</h1>

      <form onSubmit={handleUpload} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        {/* Show language dropdown only if selected file is not an image */}
        {!isImage && (
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
              <SelectItem value="Tamil">Tamil</SelectItem>
              <SelectItem value="Telugu">Telugu</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Uploading..." : "Upload Media"}</Button>
      </form>

      {snackbar && (
        <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          <div className="flex items-center justify-between space-x-4">
            <span>{snackbar.message}</span>
            <button onClick={() => setSnackbar(null)} className="font-bold text-white">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;

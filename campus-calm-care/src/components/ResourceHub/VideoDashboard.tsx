import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  like: number;
  views: number;
}

const VideoDashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const token = localStorage.getItem("Token"); // should be admin token for uploads

  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/videos/get-all-videos");
      setVideos(res.data.videos);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to load videos", "error");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      showSnackbar("Please select a video file.", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);

      const res = await axios.post("http://localhost:5000/api/v1/videos/video-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      showSnackbar(res.data.message, "success");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      fetchVideos();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/videos/like-video/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar("Liked!", "success");
      fetchVideos();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to like", "error");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/videos/dislike-video/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar("Disliked!", "success");
      fetchVideos();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to dislike", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Video Dashboard</h1>

      {/* Upload Form (visible only to admins) */}
      {token && (
        <form onSubmit={handleUpload} className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4 mb-10">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
      )}

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video._id} className="bg-white shadow-lg rounded-lg">
            <video className="w-full h-48 rounded-lg" controls>
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <CardContent>
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-600">{video.description}</p>
              <div className="flex justify-between mt-4 text-sm text-gray-500">
                <span>Likes: {video.like}</span>
                <span>Views: {video.views}</span>
              </div>
              <div className="flex justify-between mt-2">
                <Button onClick={() => handleLike(video._id)} size="sm" variant="outline">
                  Like
                </Button>
                <Button onClick={() => handleDislike(video._id)} size="sm" variant="outline">
                  Dislike
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white ${
            snackbar.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center justify-between space-x-4">
            <span>{snackbar.message}</span>
            <button onClick={() => setSnackbar(null)} className="font-bold text-white">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDashboard;

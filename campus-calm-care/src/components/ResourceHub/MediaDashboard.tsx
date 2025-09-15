import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Media {
  _id: string;
  title: string;
  description: string;
  mediaFile: string;
  like: number;
  views: number;
  owner: string;
}

const MediaDashboard = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  const fetchMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/videos/get-all-videos");
      const mappedVideos = res.data.videos.map((v: any) => ({
        ...v,
        mediaFile: v.videoFile,
      }));
      setMediaList(mappedVideos);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to load media", "error");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      showSnackbar("Please select a file.", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", mediaFile);

      const res = await axios.post("http://localhost:5000/api/v1/videos/video-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar(res.data.message, "success");
      setTitle("");
      setDescription("");
      setMediaFile(null);
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/videos/like-video/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar("Liked!", "success");
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to like", "error");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/videos/dislike-video/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar("Disliked!", "success");
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to dislike", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/videos/video-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar("Media deleted", "success");
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to delete media", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Media Dashboard</h1>

      {role === "admin" && (
        <form
          onSubmit={handleUpload}
          className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4 mb-10"
        >
          <h2 className="text-2xl font-semibold">Upload Media</h2>
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
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload Media"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mediaList.map((media) => (
          <Card key={media._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {media.mediaFile ? (
              media.mediaFile.match(/\.(mp4|webm|ogg)$/) ? (
                <video className="w-full h-48 object-cover" controls>
                  <source src={media.mediaFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : media.mediaFile.match(/\.(jpeg|jpg|png|gif)$/) ? (
                <img src={media.mediaFile} alt={media.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">Unsupported media</span>
                </div>
              )
            ) : (
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">No media available</span>
              </div>
            )}

            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{media.title}</h2>
              <p className="text-gray-600 mb-2">{media.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>👍 {media.like}</span>
                <span>👁️ {media.views}</span>
              </div>

              {role === "admin" ? (
                <Button onClick={() => handleDelete(media._id)} size="sm" variant="destructive" className="w-full">
                  Delete Media
                </Button>
              ) : (
                <div className="flex space-x-4">
                  <Button onClick={() => handleLike(media._id)} size="sm" variant="outline">
                    Like
                  </Button>
                  <Button onClick={() => handleDislike(media._id)} size="sm" variant="outline">
                    Dislike
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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

export default MediaDashboard;

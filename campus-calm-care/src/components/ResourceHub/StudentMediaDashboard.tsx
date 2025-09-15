import React, { useEffect, useState } from "react";
import { Heart, Eye, Video, Camera, FileX, Sparkles, Zap } from "lucide-react";
import axios from "axios";

interface Media {
  _id: string;
  title: string;
  description: string;
  mediaFile: string;
  like: number;
  views: number;
  owner: string;
}

const StudentMediaDashboard = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const token = localStorage.getItem("Token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1/videos",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchMedia = async () => {
    try {
      const res = await api.get("/get-all-videos");
      const mapped = res.data.videos.map((v: any) => ({
        ...v,
        mediaFile: v.videoFile,
      }));
      setMediaList(mapped);
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

  const handleLike = async (id: string) => {
    try {
      await api.patch(`/like-video/${id}`);
      showSnackbar("Liked!", "success");

      // Optimistic UI update instead of refetch
      setMediaList(prev =>
        prev.map(m => (m._id === id ? { ...m, like: m.like + 1 } : m))
      );
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to like", "error");
    }
  };

  const renderMedia = (media: Media) => {
    const file = media.mediaFile.toLowerCase();
    if (file.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <div className="relative">
          <video className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" controls>
            <source src={media.mediaFile} type="video/mp4" />
          </video>
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Video className="w-3 h-3" /> VIDEO
          </div>
        </div>
      );
    } else if (file.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <div className="relative">
          <img
            src={media.mediaFile}
            alt={media.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Camera className="w-3 h-3" /> IMAGE
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex flex-col items-center justify-center">
          <FileX className="w-12 h-12 text-gray-600 mb-2" />
          <span className="text-gray-600 font-medium">Unsupported media type</span>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 relative">
      {/* Header */}
      <div className="relative pt-12 pb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Student Media Hub
          </h1>
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover inspiring content curated for your academic and personal growth
        </p>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {mediaList.map((media, index) => (
          <div
            key={media._id}
            className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 hover:border-purple-200"
          >
            {renderMedia(media)}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {media.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {media.description}
              </p>
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {media.views}
                  </div>
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart className="w-4 h-4" />
                    {media.like}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleLike(media._id)}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 px-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 animate-pulse" /> Like
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-sm border ${
              snackbar.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400"
                : "bg-gradient-to-r from-red-500 to-rose-500 border-red-400"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {snackbar.type === "success" ? (
                  <div className="bg-white/20 rounded-full p-1">
                    <Zap className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="bg-white/20 rounded-full p-1">
                    <FileX className="w-5 h-5" />
                  </div>
                )}
                <span className="font-semibold text-lg">{snackbar.message}</span>
              </div>
              <button
                onClick={() => setSnackbar(null)}
                className="text-white/80 hover:text-white font-bold text-2xl hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMediaDashboard;

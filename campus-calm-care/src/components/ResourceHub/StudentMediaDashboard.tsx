import React, { useEffect, useState } from "react";
import axios from "axios";
import MediaCard from "../MediaCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Play, Image as ImageIcon } from "lucide-react";

interface Media {
  _id: string;
  title: string;
  description: string;
  mediaFile: string;
  like: number;
  dislike: number;
  likedBy: string[];
  dislikedBy: string[];
  views: number;
  owner: string;
  type: "video" | "image";
  language: string;
}

const StudentMediaDashboard = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  const token = localStorage.getItem("Token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1/videos",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get("/get-all-videos");
      const mapped = res.data.videos.map((v: any) => ({
        ...v,
        mediaFile: v.videoFile,
        type: v.videoFile.match(/\.(mp4|webm|ogg)$/) ? "video" : "image",
        language: v.language || "English",
      }));
      setMediaList(mapped);
      setFilteredMedia(mapped);
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Failed to load media",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // filter effect
  useEffect(() => {
    let filtered = mediaList;

    if (typeFilter !== "all") {
      filtered = filtered.filter((m) => m.type === typeFilter);
    }

    if (languageFilter !== "all") {
      filtered = filtered.filter(
        (m) =>
          m.type === "image" || (m.type === "video" && m.language === languageFilter)
      );
    }

    setFilteredMedia(filtered);
  }, [typeFilter, languageFilter, mediaList]);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleLike = async (id: string) => {
    try {
      await api.patch(`/like-video/${id}`);
      showSnackbar("Liked!", "success");
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to like", "error");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await api.patch(`/dislike-video/${id}`);
      showSnackbar("Disliked!", "success");
      fetchMedia();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to dislike", "error");
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      await api.patch(`/view/${id}`);
      setMediaList((prev) =>
        prev.map((m) => (m._id === id ? { ...m, views: m.views + 1 } : m))
      );
    } catch (error: any) {
      console.error(
        "View increment failed",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-lavender-100 to-blue-100 relative overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10">
        <div className="pt-16 pb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-md">
            <span className="text-sm font-semibold bg-gradient-to-r from-teal-400 via-lavender-400 to-blue-400 bg-clip-text text-transparent">
              ✨ Educational Content Hub
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-400 via-lavender-400 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
            Psychological
            <br />
            <span className="text-4xl md:text-5xl">Resource Hub</span>
          </h1>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover curated psychological resources, interactive content, and
            expert insights to enhance your learning journey.
          </p>

          {/* Stats bar */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-center gap-8 text-center text-gray-700">
                <div>
                  <div className="text-2xl font-bold">{mediaList.length}</div>
                  <div className="text-sm font-medium">Resources</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div>
                  <div className="text-2xl font-bold">
                    {mediaList.reduce((total, media) => total + media.views, 0)}
                  </div>
                  <div className="text-sm font-medium">Total Views</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div>
                  <div className="text-2xl font-bold">
                    {mediaList.reduce((total, media) => total + media.like, 0)}
                  </div>
                  <div className="text-sm font-medium">Total Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-10 max-w-6xl mx-auto pb-6">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-64 bg-white/80 border-2 border-teal-200 rounded-xl shadow">
                <div className="flex items-center gap-3">
                  {typeFilter === "video" ? (
                    <Play className="w-5 h-5 text-blue-600" />
                  ) : typeFilter === "image" ? (
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Filter className="w-5 h-5 text-slate-600" />
                  )}
                  <SelectValue placeholder="Select Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">📹 Video</SelectItem>
                <SelectItem value="image">🖼️ Image</SelectItem>
              </SelectContent>
            </Select>

            {/* Language Filter */}
            {(typeFilter === "all" || typeFilter === "video") && (
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-64 bg-white/80 border-2 border-purple-200 rounded-xl shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                    <SelectValue placeholder="Select Language" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌍 All Languages</SelectItem>
                  <SelectItem value="English">🇺🇸 English</SelectItem>
                  <SelectItem value="Hindi">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="Marathi">🇮🇳 Marathi</SelectItem>
                  <SelectItem value="Tamil">🇮🇳 Tamil</SelectItem>
                  <SelectItem value="Telugu">🇮🇳 Telugu</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <p className="text-center text-lg text-gray-700">Loading...</p>
        ) : filteredMedia.length === 0 ? (
          <p className="text-center text-lg text-gray-700">No content found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media._id}
                media={media}
                incrementViewCount={incrementViewCount}
                handleLike={handleLike}
                handleDislike={handleDislike}
                id={localStorage.getItem("id")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-white ${
            snackbar.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default StudentMediaDashboard;

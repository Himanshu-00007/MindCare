import React, { useEffect, useState } from "react";
import axios from "axios";
import MediaCard from "../MediaCard";

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
}


const StudentMediaDashboard = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

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
      }));
      setMediaList(mapped);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to load media", "error");
    } finally {
      setLoading(false);
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

    setMediaList(prev =>
      prev.map(m => {
        if (m._id !== id) return m;

        const isAlreadyLiked = m.likedBy?.includes(localStorage.getItem("id")!);
        const isDisliked = m.dislikedBy?.includes(localStorage.getItem("id")!);

        return {
          ...m,
          like: isAlreadyLiked ? m.like - 1 : m.like + 1,
          dislike: isDisliked && !isAlreadyLiked ? m.dislike - 1 : m.dislike,
          likedBy: isAlreadyLiked
            ? m.likedBy.filter(u => u !== localStorage.getItem("id"))
            : [...m.likedBy, localStorage.getItem("id")!],
          dislikedBy: isDisliked && !isAlreadyLiked
            ? m.dislikedBy.filter(u => u !== localStorage.getItem("id"))
            : m.dislikedBy,
        };
      })
    );
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || "Failed to like", "error");
  }
};

const handleDislike = async (id: string) => {
  try {
    await api.patch(`/dislike-video/${id}`);
    showSnackbar("Disliked!", "success");

    setMediaList(prev =>
      prev.map(m => {
        if (m._id !== id) return m;

        const isAlreadyDisliked = m.dislikedBy?.includes(localStorage.getItem("id")!);
        const isLiked = m.likedBy?.includes(localStorage.getItem("id")!);

        return {
          ...m,
          dislike: isAlreadyDisliked ? m.dislike - 1 : m.dislike + 1,
          like: isLiked && !isAlreadyDisliked ? m.like - 1 : m.like,
          dislikedBy: isAlreadyDisliked
            ? m.dislikedBy.filter(u => u !== localStorage.getItem("id"))
            : [...m.dislikedBy, localStorage.getItem("id")!],
          likedBy: isLiked && !isAlreadyDisliked
            ? m.likedBy.filter(u => u !== localStorage.getItem("id"))
            : m.likedBy,
        };
      })
    );
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || "Failed to dislike", "error");
  }
};


  const incrementViewCount = async (id: string) => {
    try {
      await api.patch(`/view/${id}`);
      setMediaList(prev =>
        prev.map(m => (m._id === id ? { ...m, views: m.views + 1 } : m))
      );
    } catch (error: any) {
      console.error("View increment failed", error.response?.data?.message || error.message);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-100 via-lavender-100 to-blue-100 relative overflow-hidden">

    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lavender-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
    </div>

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
          Discover curated psychological resources, interactive content, and expert insights to enhance your learning journey.
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

    {/* Content Section */}
    <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-teal-400 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading amazing content...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-200/30 to-lavender-200/30 rounded-3xl flex items-center justify-center">
            <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-1 4l-2 2-2-2m5 0v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8h16z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No Content Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            It looks like there's no psychological content available at the moment. Check back soon for new resources!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mediaList.map((media, index) => (
            <div
              key={media._id}
              className="transform hover:scale-105 transition-all duration-300 hover:z-10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MediaCard
                media={media}
                incrementViewCount={incrementViewCount}
                handleLike={handleLike}
                handleDislike={handleDislike}
                id={localStorage.getItem("id")}
              />
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Enhanced Snackbar */}
    {snackbar && (
      <div className="fixed bottom-8 right-8 z-50">
        <div
          className={`transform transition-all duration-300 ease-out ${
            snackbar ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
          }`}
        >
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-sm border-2 max-w-sm ${
              snackbar.type === "success"
                ? "bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 border-emerald-200/50"
                : "bg-gradient-to-r from-rose-300 via-pink-300 to-rose-400 border-rose-200/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white/20`}>
                {snackbar.type === "success" ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-semibold text-lg flex-1">{snackbar.message}</span>
              <button
                onClick={() => setSnackbar(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default StudentMediaDashboard;
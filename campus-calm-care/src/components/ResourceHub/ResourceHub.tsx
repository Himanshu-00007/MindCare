import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Eye, Trash2, Play, Filter, ThumbsUp, ThumbsDown, Image } from "lucide-react";
import AdminHeader from "../AdminHeader";

interface Media {
  _id: string;
  title: string;
  description: string;
  mediaFile: string;
  like: number;
  views: number;
  language: string;
  type: "video" | "image";
}

const ResourceHub = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [languageFilter, setLanguageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const fetchMedia = async () => {
    try {
      const res = await axios.get("https://mindcare-lf3g.onrender.com/api/v1/videos/get-all-videos");
      const mappedVideos = res.data.videos
        .map((v: any) => {
          let mediaUrl = v.videoFile || "";
          if (mediaUrl.startsWith("http://")) mediaUrl = mediaUrl.replace("http://", "https://");

          return {
            ...v,
            mediaFile: mediaUrl,
            type: mediaUrl.match(/\.(mp4|webm|ogg)$/) ? "video" : "image",
            language: v.language || "English",
          };
        })
        .filter((v: any) => v.type !== null);
      setMediaList(mappedVideos);
      setFilteredMedia(mappedVideos);
    } catch (error) {
      showSnackbar("Failed to load media", "error");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    let filtered = mediaList;

    if (typeFilter !== "all") filtered = filtered.filter((m) => m.type === typeFilter);

    if (languageFilter !== "all") {
      filtered = filtered.filter((m) => m.type === "image" || (m.type === "video" && m.language === languageFilter));
    }

    setFilteredMedia(filtered);
  }, [languageFilter, typeFilter, mediaList]);

  const handleLike = async (id: string) => {
    try {
      await axios.patch(`https://mindcare-lf3g.onrender.com/api/v1/videos/like-video/${id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      fetchMedia();
    } catch {
      showSnackbar("Failed to like", "error");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await axios.patch(`https://mindcare-lf3g.onrender.com/api/v1/videos/dislike-video/${id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      fetchMedia();
    } catch {
      showSnackbar("Failed to dislike", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://mindcare-lf3g.onrender.com/api/v1/videos/video-delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMedia();
      showSnackbar("Media deleted successfully", "success");
    } catch {
      showSnackbar("Failed to delete media", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-28 px-8">
        <AdminHeader />

        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-pulse">
            Resource Hub
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Filter Content</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="relative">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-64 h-14 bg-white/80 border-2 border-blue-200 rounded-xl shadow transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200">
                    <div className="flex items-center gap-3">
                      {typeFilter === "video" ? <Play className="w-5 h-5 text-blue-600" /> : 
                       typeFilter === "image" ? <Image className="w-5 h-5 text-purple-600" /> : 
                       <Filter className="w-5 h-5 text-slate-600" />}
                      <SelectValue placeholder="Select Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                    <SelectItem value="all" className="hover:bg-blue-50 rounded-lg">All Types</SelectItem>
                    <SelectItem value="video" className="hover:bg-blue-50 rounded-lg">📹 Video</SelectItem>
                    <SelectItem value="image" className="hover:bg-purple-50 rounded-lg">🖼️ Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(typeFilter === "all" || typeFilter === "video") && (
                <div className="relative">
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger className="w-64 h-14 bg-white/80 border-2 border-purple-200 rounded-xl shadow transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                        <SelectValue placeholder="Select Language" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                      <SelectItem value="all" className="hover:bg-purple-50 rounded-lg">🌍 All Languages</SelectItem>
                      <SelectItem value="English" className="hover:bg-purple-50 rounded-lg">🇺🇸 English</SelectItem>
                      <SelectItem value="Hindi" className="hover:bg-purple-50 rounded-lg">🇮🇳 Hindi</SelectItem>
                      <SelectItem value="Marathi" className="hover:bg-purple-50 rounded-lg">🇮🇳 Marathi</SelectItem>
                      <SelectItem value="Tamil" className="hover:bg-purple-50 rounded-lg">🇮🇳 Tamil</SelectItem>
                      <SelectItem value="Telugu" className="hover:bg-purple-50 rounded-lg">🇮🇳 Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMedia.map((media) => (
              <Card key={media._id} className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden border border-white/20">
                <div className="relative overflow-hidden">
                  {media.type === "video" ? (
                    <video className="w-full h-56 object-cover" controls>
                      <source src={media.mediaFile.startsWith("http://") ? media.mediaFile.replace("http://", "https://") : media.mediaFile} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer overflow-hidden" onClick={() => setLightboxImage(media.mediaFile)}>
                      <img src={media.mediaFile.startsWith("http://") ? media.mediaFile.replace("http://", "https://") : media.mediaFile} alt={media.title} className="max-h-full max-w-full object-cover" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{media.title}</h2>
                  <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">{media.description}</p>
                  {media.type === "video" && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        🌐 {media.language}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-red-500">
                        <Heart className="w-5 h-5 fill-current" />
                        <span className="font-semibold">{media.like}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <Eye className="w-5 h-5" />
                        <span className="font-semibold">{media.views}</span>
                      </div>
                    </div>
                  </div>

                  {role === "admin" ? (
                    <Button onClick={() => handleDelete(media._id)} className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow transition-all duration-300">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Media
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button onClick={() => handleLike(media._id)} className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-xl shadow transition-all duration-300">
                        <ThumbsUp className="w-4 h-4 mr-1" /> Like
                      </Button>
                      <Button onClick={() => handleDislike(media._id)} className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-xl shadow transition-all duration-300">
                        <ThumbsDown className="w-4 h-4 mr-1" /> Dislike
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-600 mb-2">No content found</h3>
              <p className="text-slate-500">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>

        {lightboxImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer" onClick={() => setLightboxImage(null)}>
            <div className="relative max-w-5xl max-h-5xl p-4">
              <img src={lightboxImage.startsWith("http://") ? lightboxImage.replace("http://", "https://") : lightboxImage} alt="Preview" className="max-h-full max-w-full rounded-2xl shadow-2xl" />
              <button onClick={() => setLightboxImage(null)} className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold shadow-lg">×</button>
            </div>
          </div>
        )}

        {snackbar && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-md transform transition-all duration-500 ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{snackbar.message}</span>
              </div>
              <button onClick={() => setSnackbar(null)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-200">×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;

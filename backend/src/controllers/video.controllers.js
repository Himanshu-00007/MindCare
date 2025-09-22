import { Video } from "../models/video.model.js";
import Admin from "../models/admin.model.js";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinary.js";

// Upload video (using buffer)
const uploadVideo = async (req, res) => {
  try {
    const { title, description, language } = req.body; // 👈 language bhi lo
    const file = req.files?.videoFile?.[0];

    if (!file) {
      return res.status(400).json({ message: "Video file is missing" });
    }

    const videoFile = await cloudinaryUpload(file.buffer, file.originalname);
    if (!videoFile) {
      return res.status(500).json({ message: "Failed to upload video file" });
    }

    const video = await Video.create({
      title,
      description,
      language: language || "English", // 👈 yaha save karo
      videoFile: videoFile.url,
      videoFileId: videoFile.public_id,
      owner: req.user._id,
      duration: videoFile.duration || 0,
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("UploadVideo Error:", error);
    return res.status(500).json({
      message: "Something went wrong while uploading video",
      error: error.message,
    });
  }
};

// Update video title/description
const updateVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (userId.toString() !== video.owner.toString()) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    const { title, description } = req.body;
    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    const updatedVideo = await Video.findByIdAndUpdate(video._id, { $set: updatedData }, { new: true });
    return res.status(200).json({
      message: "Video details updated",
      updatedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while updating video",
      error: error.message,
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const verifiedUser = req.user._id;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (verifiedUser.toString() !== video.owner.toString())
      return res.status(403).json({ message: "Unauthorized: You can only delete your own videos" });

    await cloudinaryDelete(video.videoFileId);
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Video deleted successfully",
      deletedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting video",
      error: error.message,
    });
  }
};

// Like video
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const verifiedUser = req.user._id.toString();
    if (video.likedBy.includes(verifiedUser)) return res.status(400).json({ message: "User already liked this video" });

    // remove dislike if exists
    if (video.dislikedBy.includes(verifiedUser)) {
      video.dislike -= 1;
      video.dislikedBy = video.dislikedBy.filter((id) => id.toString() !== verifiedUser);
    }

    video.like += 1;
    video.likedBy.push(verifiedUser);
    await video.save();

    return res.status(200).json({
      message: "Liked video successfully",
      video,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while liking video",
      error: error.message,
    });
  }
};

// Dislike video
const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const verifiedUser = req.user._id.toString();
    if (video.dislikedBy.includes(verifiedUser)) return res.status(400).json({ message: "User already disliked this video" });

    // remove like if exists
    if (video.likedBy.includes(verifiedUser)) {
      video.like -= 1;
      video.likedBy = video.likedBy.filter((id) => id.toString() !== verifiedUser);
    }

    video.dislike += 1;
    video.dislikedBy.push(verifiedUser);
    await video.save();

    return res.status(200).json({
      message: "Disliked video successfully",
      video,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while disliking video",
      error: error.message,
    });
  }
};

// Increment view count
const view = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Video ID is required" });

    const video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!video) return res.status(404).json({ message: "Video not found" });

    return res.status(200).json({
      message: "Video viewed successfully",
      video,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while viewing video",
      error: error.message,
    });
  }
};

// Get videos uploaded by a user
const getUserVideos = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const userExists = await Admin.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const totalVideos = await Video.countDocuments({ owner: userId });
    const videos = await Video.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: videos.length === 0 ? "This user has not uploaded any videos yet" : "User videos fetched successfully",
      videos,
      totalVideos,
      totalPages: Math.ceil(totalVideos / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while getting user videos",
      error: error.message,
    });
  }
};

// Get all published videos
const getAllVideos = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const totalVideos = await Video.countDocuments({ isPublished: true });
    const videos = await Video.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: videos.length === 0 ? "No published videos available" : "All videos fetched successfully",
      videos,
      totalVideos,
      totalPages: Math.ceil(totalVideos / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while getting all videos",
      error: error.message,
    });
  }
};

export { uploadVideo, updateVideo, deleteVideo, likeVideo, dislikeVideo, view, getUserVideos, getAllVideos };

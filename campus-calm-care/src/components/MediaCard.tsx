import { useRef } from "react";
import { Video, Camera, FileX, Eye, Heart, ThumbsDown } from "lucide-react";

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

interface MediaCardProps {
  media: Media;
  incrementViewCount: (videoId: string) => void;
  handleLike: (id: string) => void;
  handleDislike: (id: string) => void;
  id: string | null;
}

const MediaCard = ({
  media,
  incrementViewCount,
  handleLike,
  handleDislike,
  id,
}: MediaCardProps) => {
  const watchedTime = useRef(0);
  const hasIncremented = useRef(false);

  const file = media.mediaFile.toLowerCase();

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    if (hasIncremented.current) return;
    watchedTime.current = (event.target as HTMLVideoElement).currentTime;
  };

  const handlePauseOrEnded = () => {
    if (watchedTime.current >= 7 && !hasIncremented.current) {
      incrementViewCount(media._id);
      hasIncremented.current = true;
    }
  };

  const isLiked = media.likedBy?.includes(id!);
  const isDisliked = media.dislikedBy?.includes(id!);

  const renderMediaContent = () => {
    if (file.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <div className="relative overflow-hidden">
          <video
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            controls
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePauseOrEnded}
            onEnded={handlePauseOrEnded}
            poster=""
          >
            <source src={media.mediaFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      );
    } else if (file.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <div className="relative overflow-hidden">
          <img 
            src={media.mediaFile} 
            alt={media.title} 
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-52 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center justify-center group-hover:from-gray-200 group-hover:to-gray-400 transition-all duration-300">
          <div className="p-4 rounded-full bg-white/80 backdrop-blur-sm mb-3 group-hover:bg-white transition-colors duration-300">
            <FileX className="w-8 h-8 text-gray-500" />
          </div>
          <span className="text-gray-600 font-semibold text-sm">Unsupported Format</span>
          <span className="text-gray-500 text-xs mt-1">Unable to preview this file</span>
        </div>
      );
    }
  };

 return (
  <div className="group bg-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30 backdrop-blur-md relative">
    {/* Media Content */}
    <div className="relative">
      {renderMediaContent()}
      
      {/* Media type indicator */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          {file.match(/\.(mp4|webm|ogg)$/) ? (
            <Video className="w-3.5 h-3.5 text-teal-600" />
          ) : file.match(/\.(jpeg|jpg|png|gif)$/) ? (
            <Camera className="w-3.5 h-3.5 text-pink-500" />
          ) : (
            <FileX className="w-3.5 h-3.5 text-purple-500" />
          )}
          <span className="text-gray-700 text-xs font-medium">
            {file.match(/\.(mp4|webm|ogg)$/) ? 'Video' : 
             file.match(/\.(jpeg|jpg|png|gif)$/) ? 'Image' : 'File'}
          </span>
        </div>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight group-hover:text-teal-500 transition-colors duration-300">
        {media.title}
      </h2>
      
      {/* Description */}
      <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed text-sm">
        {media.description}
      </p>

      {/* Stats Section */}
      <div className="flex items-center justify-between mb-6 text-gray-600">
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-teal-500 transition-colors duration-200">
            <div className="p-1.5 rounded-full bg-teal-100/30 group-hover:bg-teal-200/50 transition-colors duration-200">
              <Eye className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <span className="font-semibold">{media.views.toLocaleString()}</span>
          </div>
          
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          
          <div className="flex items-center gap-1.5">
            <div className={`p-1.5 rounded-full transition-colors duration-200 ${
              isLiked ? 'bg-pink-300/40' : 'bg-gray-200/50'
            }`}>
              <Heart className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isLiked ? "text-pink-500 fill-current" : "text-gray-400"
              }`} />
            </div>
            <span className={`font-semibold text-sm transition-colors duration-200 ${
              isLiked ? "text-pink-500" : "text-gray-500"
            }`}>
              {media.like.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`p-1.5 rounded-full transition-colors duration-200 ${
              isDisliked ? 'bg-blue-300/40' : 'bg-gray-200/50'
            }`}>
              <ThumbsDown className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isDisliked ? "text-blue-500 fill-current" : "text-gray-400"
              }`} />
            </div>
            <span className={`font-semibold text-sm transition-colors duration-200 ${
              isDisliked ? "text-blue-500" : "text-gray-500"
            }`}>
              {media.dislike.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleLike(media._id)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
            isLiked
              ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md shadow-pink-300/40 hover:shadow-lg hover:shadow-pink-400/50"
              : "bg-gray-200/50 text-gray-700 hover:bg-gray-300/50 border border-gray-300/50"
          }`}
        >
          <span className="text-base">{isLiked ? '❤️' : '👍'}</span>
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => handleDislike(media._id)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
            isDisliked
              ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md shadow-blue-300/40 hover:shadow-lg hover:shadow-blue-400/50"
              : "bg-gray-200/50 text-gray-700 hover:bg-gray-300/50 border border-gray-300/50"
          }`}
        >
          <span className="text-base">{isDisliked ? '💔' : '👎'}</span>
          <span>{isDisliked ? 'Disliked' : 'Dislike'}</span>
        </button>
      </div>
    </div>

    {/* Subtle pastel glow effect on hover */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-200/0 via-pink-200/0 to-purple-200/0 group-hover:from-teal-200/20 group-hover:via-pink-200/20 group-hover:to-purple-200/20 transition-all duration-500 pointer-events-none"></div>
  </div>
);


};

export default MediaCard;
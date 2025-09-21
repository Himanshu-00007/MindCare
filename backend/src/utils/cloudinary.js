const cloudinaryUpload = async (fileBuffer, folder = "uploads") => {
  try {
    if (!fileBuffer) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: "auto", 
          folder,
          secure: true // ← ensure HTTPS
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // buffer ko cloudinary stream me bhej do
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    return null;
  }
};

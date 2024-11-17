import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("File type is not supported"), false);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});

export default upload;

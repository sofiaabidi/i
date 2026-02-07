import express from "express";
import upload, { videoUpload, imageUpload } from "../middleware/multer.js";
import {
  createCourse,
  createSection,
  createLecture,
  uploadLectureVideo,
  uploadLectureImage
} from "../controllers/adminController.js";

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field" });
    }
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};

router.post("/course", createCourse);
router.post("/section", createSection);
router.post("/lecture", createLecture);

// 🔥 NEW: attach media to existing lecture
router.post(
  "/lecture/:lectureId/video",
  videoUpload.single("video"),
  handleMulterError,
  uploadLectureVideo
);

router.post(
  "/lecture/:lectureId/image",
  imageUpload.single("image"),
  handleMulterError,
  uploadLectureImage
);

export default router;

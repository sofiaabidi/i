import express from "express";
import upload from "../middleware/multer.js";
import {
  createCourse,
  createSection,
  createLecture,
  uploadLectureVideo,
  uploadLectureImage
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/course", createCourse);
router.post("/section", createSection);
router.post("/lecture", createLecture);

// 🔥 NEW: attach media to existing lecture
router.post(
  "/lecture/:lectureId/video",
  upload.single("video"),
  uploadLectureVideo
);

router.post(
  "/lecture/:lectureId/image",
  upload.single("image"),
  uploadLectureImage
);

export default router;

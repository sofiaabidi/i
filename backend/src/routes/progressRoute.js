import express from "express";
import { markLectureComplete, getCourseProgress, getAllCoursesProgress } from "../controllers/progressController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/complete", authMiddleware, markLectureComplete);
router.get("/course/:courseId", authMiddleware, getCourseProgress);
router.get("/all", authMiddleware, getAllCoursesProgress);

export default router;

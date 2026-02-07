import express from "express";
import { getCourse, getAllCourses } from "../controllers/getCourse.js";
import authMiddleware from "../middleware/auth.js";
import requireEnrollment from "../middleware/requireEnrollment.js";

const router = express.Router();

router.get("/", getAllCourses);

router.get(
  "/:courseId",
  authMiddleware,
  getCourse
);

export default router;

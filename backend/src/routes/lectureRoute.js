import express from "express";
import { getLecture } from "../controllers/getLecture.js";
import authMiddleware from "../middleware/auth.js";
import requireEnrollment from "../middleware/requireEnrollment.js";

const router = express.Router();

router.get(
  "/:courseId/:lectureId",
  authMiddleware,
  getLecture
);

export default router;

import Enrollment from "../models/Enrollment.js";

const requireEnrollment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    req.enrollment = enrollment; // pass to controller
    next();
  } catch (err) {
    console.error("Enrollment check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default requireEnrollment;

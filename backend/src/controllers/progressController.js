import Enrollment from "../models/Enrollment.js";

export const markLectureComplete = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user._id;

    // Use upsert to create enrollment if it doesn't exist
    await Enrollment.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: { completedLectures: lectureId },
        $set: { lastWatchedLecture: lectureId }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.log("Error in markLectureComplete controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ userId, courseId })
      .select("completedLectures lastWatchedLecture");

    res.json({
      success: true,
      progress: {
        completedLectures: enrollment?.completedLectures?.map(id => id.toString()) || [],
        lastWatchedLecture: enrollment?.lastWatchedLecture?.toString() || null
      }
    });
  } catch (error) {
    console.log("Error in getCourseProgress controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCoursesProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .select("courseId completedLectures");

    // Create a map of courseId to completed lecture count
    const progressMap = {};
    enrollments.forEach(enrollment => {
      progressMap[enrollment.courseId.toString()] = {
        completedCount: enrollment.completedLectures?.length || 0
      };
    });

    res.json({
      success: true,
      progress: progressMap
    });
  } catch (error) {
    console.log("Error in getAllCoursesProgress controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

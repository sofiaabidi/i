import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  completedLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }],
  lastWatchedLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }
}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);

import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String, // short explanation of the gesture
  },

  contentType: {
    type: String,
    enum: ["video", "image"],
    required: true
  },

  videoPublicId: {
    type: String,
    default: null
  },

  imagePublicId: {
    type: String,
    default: null
  },

  duration: String
}, { timestamps: true });

export default mongoose.model("Lecture", lectureSchema);

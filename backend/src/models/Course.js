
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  complexity: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
}, { timestamps: true });


const Course=mongoose.model("Course",courseSchema);
export default Course;

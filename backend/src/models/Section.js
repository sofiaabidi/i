
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: {
    type:String,
    required:true,
  },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }]
});
const Section=mongoose.model("Section", sectionSchema);
export default Section;

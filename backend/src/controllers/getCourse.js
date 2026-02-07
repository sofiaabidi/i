import Course from "../models/Course.js";
import Section from "../models/Section.js";
import cloudinary from "../config/cloudinary.js";

export async function getCourse (req, res) {
  try{
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const sections = await Section.find({ courseId })
    .populate("lectures", "title duration description contentType videoPublicId imagePublicId");

  // Generate Cloudinary URLs for each lecture
  const sectionsWithMediaUrls = sections.map(section => ({
    ...section.toObject(),
    lectures: section.lectures.map(lecture => {
      const lectureObj = lecture.toObject();
      let mediaUrl = null;
      
      if (lecture.contentType === "video" && lecture.videoPublicId) {
        mediaUrl = cloudinary.url(lecture.videoPublicId, {
          resource_type: "video",
          secure: true,
          // Preserve aspect ratio and prevent cropping
          crop: "limit",
          quality: "auto",
          fetch_format: "auto"
        });
      } else if (lecture.contentType === "image" && lecture.imagePublicId) {
        mediaUrl = cloudinary.url(lecture.imagePublicId, {
          resource_type: "image",
          secure: true,
          // Preserve aspect ratio and prevent cropping
          crop: "limit",
          quality: "auto",
          fetch_format: "auto"
        });
      }
      
      return {
        ...lectureObj,
        mediaUrl
      };
    })
  }));

  res.status(200).json({
    _id: course._id,
    title: course.title,
    description: course.description,
    complexity: course.complexity || "Beginner",
    sections: sectionsWithMediaUrls
  });
}
catch(error){
  console.log("Error in getCourse controller ",error);
  res.status(500).json({message:"Internal server error"});
}
};

export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find({}).select("title description complexity sections");
    
    // Get lecture counts for each course
    const coursesWithLectureCounts = await Promise.all(
      courses.map(async (course) => {
        const sections = await Section.find({ courseId: course._id });
        const totalLectures = sections.reduce((sum, section) => sum + (section.lectures?.length || 0), 0);
        
        return {
          _id: course._id,
          title: course.title,
          description: course.description,
          complexity: course.complexity || "Beginner",
          lectureCount: totalLectures
        };
      })
    );

    res.status(200).json({
      success: true,
      courses: coursesWithLectureCounts
    });
  } catch (error) {
    console.log("Error in getAllCourses controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
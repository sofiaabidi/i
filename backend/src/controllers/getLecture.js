import Lecture from "../models/Lecture.js";
import cloudinary from "../config/cloudinary.js";

export async function getLecture(req, res) {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  let mediaUrl = null;

  if (lecture.contentType === "video" && lecture.videoPublicId) {
    mediaUrl = cloudinary.url(lecture.videoPublicId, {
      resource_type: "video",
      secure: true
    });
  }

  if (lecture.contentType === "image" && lecture.imagePublicId) {
    mediaUrl = cloudinary.url(lecture.imagePublicId, {
      resource_type: "image",
      secure: true
    });
  }

  res.json({
    title: lecture.title,
    description: lecture.description,
    contentType: lecture.contentType,
    mediaUrl
  });
}



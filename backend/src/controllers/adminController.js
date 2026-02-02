import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import cloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

export const createSection = async (req, res) => {
  const section = await Section.create(req.body);

  await Course.findByIdAndUpdate(section.courseId, {
    $push: { sections: section._id }
  });

  res.status(201).json(section);
};

export const createLecture = async (req, res) => {
  const { title, courseId, sectionId } = req.body;

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    folder: `courses/${courseId}`
  });

  const lecture = await Lecture.create({
    title,
    courseId,
    sectionId,
    videoPublicId: uploadResult.public_id,
    duration: Math.round(uploadResult.duration) + " sec"
  });

  await Section.findByIdAndUpdate(sectionId, {
    $push: { lectures: lecture._id }
  });

  res.status(201).json(lecture);
};

export const uploadLectureVideo = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.contentType !== "video") {
      return res.status(400).json({ message: "This lecture is not video-based" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: `lectures/${lecture.courseId}`
    });

    lecture.videoPublicId = uploadResult.public_id;
    lecture.duration = Math.round(uploadResult.duration) + " sec";
    await lecture.save();

    res.json({
      success: true,
      message: "Video uploaded successfully",
      lectureId: lecture._id
    });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const uploadLectureImage = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.contentType !== "image") {
      return res.status(400).json({ message: "This lecture is not image-based" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: `lectures/${lecture.courseId}`
    });

    lecture.imagePublicId = uploadResult.public_id;
    await lecture.save();

    res.json({
      success: true,
      message: "Image uploaded successfully",
      lectureId: lecture._id
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

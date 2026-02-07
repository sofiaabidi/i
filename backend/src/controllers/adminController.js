import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

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

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.contentType !== "video") {
      return res.status(400).json({ message: "This lecture is not video-based" });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration missing");
      return res.status(500).json({ message: "Cloudinary not configured. Please check environment variables." });
    }

    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ message: "Uploaded file not found on server" });
    }

    console.log("Uploading video to Cloudinary:", {
      filePath: req.file.path,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
      courseId: lecture.courseId
    });

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: `lectures/${lecture.courseId}`,
        chunk_size: 6000000, // 6MB chunks for large videos
      });
    } catch (cloudinaryError) {
      // Clean up file if Cloudinary upload fails
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
      throw cloudinaryError;
    }

    console.log("Cloudinary upload successful:", uploadResult.public_id);

    // Clean up local file after successful upload
    try {
      fs.unlinkSync(req.file.path);
      console.log("Local file deleted:", req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file (non-critical):", unlinkError);
    }

    lecture.videoPublicId = uploadResult.public_id;
    lecture.duration = Math.round(uploadResult.duration) + " sec";
    await lecture.save();

    res.json({
      success: true,
      message: "Video uploaded successfully",
      lectureId: lecture._id,
      videoPublicId: uploadResult.public_id
    });
  } catch (err) {
    console.error("Video upload error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Provide more specific error messages
    let errorMessage = "Server error";
    if (err.message) {
      errorMessage = err.message;
    } else if (err.http_code) {
      errorMessage = `Cloudinary error: ${err.message || "Upload failed"}`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};


export const uploadLectureImage = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.contentType !== "image") {
      return res.status(400).json({ message: "This lecture is not image-based" });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration missing");
      return res.status(500).json({ message: "Cloudinary not configured. Please check environment variables." });
    }

    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ message: "Uploaded file not found on server" });
    }

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: `lectures/${lecture.courseId}`
      });
    } catch (cloudinaryError) {
      // Clean up file if Cloudinary upload fails
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
      throw cloudinaryError;
    }

    // Clean up local file after successful upload
    try {
      fs.unlinkSync(req.file.path);
      console.log("Local file deleted:", req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file (non-critical):", unlinkError);
    }

    lecture.imagePublicId = uploadResult.public_id;
    await lecture.save();

    res.json({
      success: true,
      message: "Image uploaded successfully",
      lectureId: lecture._id,
      imagePublicId: uploadResult.public_id
    });
  } catch (err) {
    console.error("Image upload error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Provide more specific error messages
    let errorMessage = "Server error";
    if (err.message) {
      errorMessage = err.message;
    } else if (err.http_code) {
      errorMessage = `Cloudinary error: ${err.message || "Upload failed"}`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

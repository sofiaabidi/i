import mongoose from "mongoose";
import dotenv from "dotenv";

import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected for Common Words seeding");

  // Delete old courses (Everyday Static Signs and Dynamic ASL Expressions)
  const existingCourses = await Course.find({ title: { $in: ["Everyday Static Signs", "Dynamic ASL Expressions"] } });
  for (const course of existingCourses) {
    await Section.deleteMany({ courseId: course._id });
    await Lecture.deleteMany({ courseId: course._id });
    await Course.deleteOne({ _id: course._id });
    console.log(`🗑️  Deleted course: ${course.title}`);
  }

  const courses = [
    /* ===================== COMMON WORDS 1 ===================== */
    {
      title: "Common Words 1",
      complexity: "Intermediate",
      sections: [
        {
          title: "Objects & Everyday Things",
          lectures: [
            { title: "Book", type: "video" },
            { title: "Computer", type: "video" },
            { title: "Chair", type: "video" },
            { title: "Clothes", type: "video" },
            { title: "Table", type: "video" },
            { title: "Bed", type: "video" },
            { title: "Hat", type: "video" },
            { title: "Shirt", type: "video" }
          ]
        },
        {
          title: "Food & Drink",
          lectures: [
            { title: "Drink", type: "video" },
            { title: "Candy", type: "video" },
            { title: "Apple", type: "video" },
            { title: "Pizza", type: "video" },
            { title: "Fish", type: "video" }
          ]
        },
        {
          title: "Actions & Activities",
          lectures: [
            { title: "Go", type: "video" },
            { title: "Walk", type: "video" },
            { title: "Help", type: "video" },
            { title: "Eat", type: "video" },
            { title: "Play", type: "video" },
            { title: "Study", type: "video" }
          ]
        }
      ]
    },

    /* ===================== COMMON WORDS 2 ===================== */
    {
      title: "Common Words 2",
      complexity: "Intermediate",
      sections: [
        {
          title: "People & Family",
          lectures: [
            { title: "Mother", type: "video" },
            { title: "Woman", type: "video" },
            { title: "Man", type: "video" },
            { title: "Cousin", type: "video" },
            { title: "Family", type: "video" }
          ]
        },
        {
          title: "Colors & Descriptions",
          lectures: [
            { title: "Black", type: "video" },
            { title: "Blue", type: "video" },
            { title: "White", type: "video" },
            { title: "Orange", type: "video" },
            { title: "Thin", type: "video" },
            { title: "Tall", type: "video" }
          ]
        },
        {
          title: "Questions, Responses & Function Words",
          lectures: [
            { title: "Who", type: "video" },
            { title: "What", type: "video" },
            { title: "Yes", type: "video" },
            { title: "No", type: "video" },
            { title: "All", type: "video" }
          ]
        },
        {
          title: "Time & Sequence",
          lectures: [
            { title: "Before", type: "video" },
            { title: "Now", type: "video" },
            { title: "Year", type: "video" }
          ]
        },
        {
          title: "Feelings & States",
          lectures: [
            { title: "Fine", type: "video" },
            { title: "Cool", type: "video" }
          ]
        }
      ]
    }
  ];

  for (const courseData of courses) {
    const course = await Course.create({
      title: courseData.title,
      description: `${courseData.title} ASL course`,
      complexity: courseData.complexity
    });

    for (const sectionData of courseData.sections) {
      const section = await Section.create({
        courseId: course._id,
        title: sectionData.title
      });

      course.sections.push(section._id);

      for (const lec of sectionData.lectures) {
        const lecture = await Lecture.create({
          title: lec.title,
          description: `ASL gesture for ${lec.title}`,
          contentType: lec.type,
          courseId: course._id,
          sectionId: section._id,
          videoPublicId: null,
          imagePublicId: null
        });

        section.lectures.push(lecture._id);
      }

      await section.save();
    }

    await course.save();
    console.log(`✅ Created course: ${course.title}`);
  }

  console.log("Common Words courses seeded successfully ✅");
  process.exit();
};

seed();


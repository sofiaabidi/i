// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the backend root directory
const envPath = join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Log environment variable status (without exposing secrets)
console.log("Environment variables loaded:");
console.log("  CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing");
console.log("  CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing");
console.log("  CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing");

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import courseRoute from "./routes/courseRoute.js";
import lectureRoute from "./routes/lectureRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import adminRoute from "./routes/adminRoute.js";
import progressRoute from "./routes/progressRoute.js";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";

const app=express();
const PORT=process.env.PORT || 5001;

connectDB();
configurePassport();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoute);
app.use("/api/courses",courseRoute);
app.use("/api/lectures",lectureRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin", adminRoute);
app.use("/api/progress", progressRoute);

app.listen(5001,()=>{
    console.log("Server started on Port", PORT);
});
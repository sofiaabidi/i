import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import courseRoute from "./routes/courseRoute.js";
import lectureRoute from "./routes/lectureRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import dotenv from "dotenv";

dotenv.config();

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

app.listen(5001,()=>{
    console.log("Server started on Port", PORT);
});
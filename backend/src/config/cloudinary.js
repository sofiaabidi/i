import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

// Validate that all required environment variables are present
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Cloudinary configuration error:");
  console.error("Missing environment variables:");
  if (!cloudName) console.error("  - CLOUDINARY_CLOUD_NAME");
  if (!apiKey) console.error("  - CLOUDINARY_API_KEY");
  if (!apiSecret) console.error("  - CLOUDINARY_API_SECRET");
  console.error("\nPlease check your .env file in the backend directory.");
  console.error("Make sure the file exists and contains:");
  console.error("CLOUDINARY_CLOUD_NAME=your_cloud_name");
  console.error("CLOUDINARY_API_KEY=your_api_key");
  console.error("CLOUDINARY_API_SECRET=your_api_secret");
} else {
  console.log("✅ Cloudinary configured successfully");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export default cloudinary;

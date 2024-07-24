const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // cloud_name:'dsnm8u71e'
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// cloudinary.config({
//   cloud_name: "dsnm8u71e",
//   api_key: "766244942886449",
//   api_secret: "tSQl5Y7WUWX0FKTi4benRK6XNCI",
// });

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "YelpCamp",
  allowedFormats: ["jpeg", "png", "jpg"],
});

module.exports = {
  cloudinary,
  storage,
};

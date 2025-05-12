// api/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
} catch (error) {
    res.json("Error : ",error.message);
}


module.exports = cloudinary;

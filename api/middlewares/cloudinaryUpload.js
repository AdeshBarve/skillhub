const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Set up storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skillhub_courses',             // Folder in Cloudinary
    allowedFormats: ['jpg', 'png', 'mp4', 'mov'], // Correct key: camelCase
    resource_type: 'auto',                  // auto = handles both images & videos
  },
});

// Create Multer upload middleware
const upload = multer({ storage });

module.exports = upload;

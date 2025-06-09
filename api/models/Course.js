const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required']
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    thumbnail: {
      type: String, // Cloudinary URL
      default: ''
    },
    videoUrl: {
      type: String, // Cloudinary or YouTube/Vimeo URL
      default: ''
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [String], // Optional: ["JavaScript", "Web Dev"]
    price: {
      type: Number,
      default: 10000
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

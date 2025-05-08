const Course = require("../models/Course");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

 const Signup=async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });
  
      // Create new user
      user = new User({ name, email, password, role });
  
      await user.save(); // Password will be hashed via pre-save middleware
  
      // Create JWT
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  const Login=async (req, res) => {
    const { email, password } = req.body;
  console.log("Email :",email);
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }


// @desc    Get instructor's own courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your courses' });
  }
};

// @desc    Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user._id
    });
    await course.save();
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
};

// @desc    Edit a course (only by owner instructor)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this course' });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;

    const updated = await course.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
};

// @desc    Delete a course (only by owner instructor)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this course' });
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};





  module.exports={Signup,Login,createCourse,deleteCourse,updateCourse,getMyCourses};
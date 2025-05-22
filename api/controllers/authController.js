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
  
const enrolledCourses =  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
  res.json(user.enrolledCourses);
  } catch (error) {
      res.json({"Error : ":error.message});
  }
  
} 

  const Login=async (req, res) => {
    const { email, password } = req.body;
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
const getInsCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({_id:req.params.id});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your courses' });
  }
};


const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email'); // populate name & email
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};



const enrollCourse= async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Create a new course
const createCourse = async (req, res) => {
  try {
    const thumbnail = req.files?.thumbnail?.[0]?.path || null;
    const videoUrl = req.files?.video?.[0]?.path || null;
    
    if (!videoUrl) {
      return res.status(400).json({ message: 'Video is required' });
    }

    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      thumbnail,
      videoUrl,
      instructor: req.user._id
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Update fields
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.price = req.body.price !== undefined ? req.body.price : course.price;

    if (req.body.tags) {
      course.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // Cloudinary upload middleware should populate req.files or req.file
    if (req.files?.thumbnail && req.files.thumbnail[0]?.path) {
      course.thumbnail = req.files.thumbnail[0].path;
    }

    if (req.files?.video && req.files.video[0]?.path) {
      course.video = req.files.video[0].path;
    }

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
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





  module.exports={getAllCourses,getCourse,enrolledCourses,enrollCourse, Signup,Login,createCourse,deleteCourse,updateCourse,getInsCourses};
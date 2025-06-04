const Course = require("../models/Course");
const User = require("../models/User");
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const Signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user
    user = new User({ name, email, password, role });

    await user.save(); // Password will be hashed via pre-save middleware

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const enrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");
    res.json(user.enrolledCourses);
  } catch (error) {
    res.json({ "Error : ": error.message });
  }
};

const deleteEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const originalLength = user.enrolledCourses.length;
    user.enrolledCourses = user.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );

    if (user.enrolledCourses.length === originalLength) {
      return res
        .status(400)
        .json({ error: "Course not found in enrolled list" });
    }

    await user.save();
    return res.json({ message: "Successfully unenrolled from course" });
  } catch (err) {
    console.error("Error during course unenrollment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteInsCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Get instructor's own courses
const getInsCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCourse = async (req, res,next) => {
  try {
    const courses = await Course.find({ _id: req.params.id });
    res.status(200).json(courses);
  } catch (error) {
    error.status=404;
    error.message="Course Not Found..!!";
    next(error)
    // res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email"); // populate name & email
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found: ");
      return res.status(404).json({ message: "User not found" });
    }
    // Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      console.log("Already enrolled ");

      return res.status(400).json({ message: "Already enrolled" });
    }
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error :", err });
  }
};
// @desc    Create a new course
const createCourse = async (req, res) => {
  try {
    const thumbnail = req.files?.thumbnail?.[0]?.path || null;
    const videoUrl = req.files?.video?.[0]?.path || null;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video is required" });
    }

    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      thumbnail,
      videoUrl,
      instructor: req.user._id,
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstructorName = async (req, res) => {
  try {
    const id = req.params.id;
    const instructor = await User.findById(id);
    res.status(201).json(instructor);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error:", err.message);
  }
};

// @desc    Edit a course (only by owner instructor)

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this course" });
    }

    // Update basic fields
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.price = req.body.price !== undefined ? req.body.price : course.price;

    if (req.body.tags) {
      course.tags = req.body.tags.split(",").map((tag) => tag.trim());
    }

    // Handle thumbnail upload
    if (req.files?.thumbnail?.[0]?.path) {
      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        {
          folder: "courses/thumbnails",
          resource_type: "image",
        }
      );

      course.thumbnail = thumbnailUpload.secure_url;
      course.thumbnailPublicId = thumbnailUpload.public_id;
    }

    // Handle video upload
    if (req.files?.video?.[0]?.path) {
      const videoUpload = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          folder: "courses/videos",
          resource_type: "video",
        }
      );

      course.video = videoUpload.secure_url;
      course.videoPublicId = videoUpload.public_id;
    }

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(500).json({ message: "Error updating course" });
  }
};

const userContact = async (req, res) => {
  try {
    const { name, phone, email, query } = req.body;

    const data = new Contact({
      name,
      email,
      phone,
      query,
    });
 
    const contactData = await data.save();
    res.status(200).json({message:"Query sent successfully..!!"});
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Contact Error :", err.message);
  }
};

// const deleteEnrolledCourse=async(req,res)=>{
//   try {
//     const userId = req.user.id;
//     const { courseId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Remove the course from enrolledCourses
//     user.enrolledCourses = user.enrolledCourses.filter(
//       (id) => id.toString() !== courseId
//     );
//     await user.save();

//     res.json({ message: 'Unenrolled from course successfully' });
//   } catch (err) {
//     console.error('Unenroll error:', err);
//     res.status(500).json({ error: 'Server error while unenrolling' });
//   }
// }

// @desc    Delete a course (only by owner instructor)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this course" });
    }

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
};

module.exports = {
  getInstructorName,
  deleteInsCourse,
  deleteEnrolledCourse,
  getAllCourses,
  getCourse,
  enrolledCourses,
  enrollCourse,
  Signup,
  Login,
  createCourse,
  deleteCourse,
  updateCourse,
  getInsCourses,
  userContact,
};

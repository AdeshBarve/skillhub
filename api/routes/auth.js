const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Signup, Login, createCourse, updateCourse, deleteCourse, getMyCourses, enrollCourse, enrolledCourses, getAllCourses } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/cloudinaryUpload');


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/user/signup',Signup);
router.post('/user/login',Login);
router.post('/course/createCourse', authenticate, authorizeRoles('instructor'),upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ])
  , createCourse);
  router.post('/course/enroll/:id',authenticate, enrollCourse);
  router.post('/course/updateCourse/:id',authenticate, authorizeRoles('instructor'),updateCourse);
  router.get('/course/deleteCourse',authenticate, authorizeRoles('instructor'),deleteCourse);
  router.get('/course/getCourses/:id',getMyCourses);
// GET /api/users/enrolled
router.get('/course/enrolled',authenticate,enrolledCourses);
router.get('/course/getAllCourses',getAllCourses);



module.exports = router;

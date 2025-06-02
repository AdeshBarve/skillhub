const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Signup, Login, createCourse, updateCourse, deleteCourse, enrollCourse, enrolledCourses, getAllCourses, getCourse, getInsCourses, deleteEnrolledCourse, deleteInsCourse, getInstructorName } = require('../controllers/authController');
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
  router.put('/course/updateCourse/:id', authenticate, authorizeRoles('instructor'), upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updateCourse
);
  router.post('/course/enroll/:id',authenticate, enrollCourse);
  // router.put('/course/updateCourse/:id',authenticate, authorizeRoles('instructor'),updateCourse);
  router.get('/course/deleteCourse',authenticate, authorizeRoles('instructor'),deleteCourse);
  router.get('/course/getInsCourses/:id',getInsCourses);
    router.get('/course/getCourse/:id',getCourse);
    router.get('/course/getInstructorName/:id',getInstructorName);

// GET /api/users/enrolled
router.delete('/course/deleteEnrolledCourse/:courseId',authenticate,deleteEnrolledCourse);
router.get('/course/enrolled',authenticate,enrolledCourses);
router.get('/course/getAllCourses',getAllCourses);
router.delete('/course/deleteEnrolledCourse',authenticate,deleteEnrolledCourse);
router.delete('/course/deleteInsCourse/:id',authenticate, authorizeRoles('instructor'),deleteInsCourse);




module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Signup, Login, createCourse, updateCourse, deleteCourse, getMyCourses } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/signup',Signup);
router.get('/login',Login);
router.post('/createCourse', authenticate, authorizeRoles('instructor'), createCourse);
  router.post('/updateCourse/:id',authenticate, authorizeRoles('instructor'),updateCourse);
  router.get('/deleteCourse',authenticate, authorizeRoles('instructor'),deleteCourse);
  router.get('/getCourses/:id',authenticate, authorizeRoles('instructor'),getMyCourses);


module.exports = router;

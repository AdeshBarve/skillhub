import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/course/getAllCourses');
        
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 to-purple-200 py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-800">
            Welcome to <span className="text-blue-600">SkillHub</span>
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Learn from top instructors. Teach your passion. Grow your skills.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            🌟 Available Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/courses/${course._id}`)}
                className="cursor-pointer"
              >
                <CourseCard
                  title={course.title}
                  instructor={course.instructor}
                  image={course.image || '/default-course.jpg'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

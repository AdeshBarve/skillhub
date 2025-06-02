import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const EnrolledCourses = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/course/enrolled",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response ", res.data);
      setEnrolledCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this course?"))
        return;

      const response = await axios.delete(
        `http://localhost:5000/api/auth/course/deleteEnrolledCourse/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response :", response.data.message);
      toast.success(response.data.message);

      // Remove course from UI
      setEnrolledCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      console.error("Failed to unenroll from course:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">
          Enrolled Courses
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="mb-3 border-b border-gray-700 pb-2 flex justify-between items-center"
            >
              <div>
                <p className="text-lg">{course.title}</p>
                <p className="text-sm text-gray-400">
                  Progress: {course.progress || "0%"}
                </p>
              </div>
              <button
                onClick={() => handleUnenroll(course._id)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
              >
                Unenroll
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No courses enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;

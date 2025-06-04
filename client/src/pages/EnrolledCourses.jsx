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
  const [expandedVideoId, setExpandedVideoId] = useState(null);

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
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      if (!window.confirm("Are you sure you want to unenroll from this course?"))
        return;

      const response = await axios.delete(
        `http://localhost:5000/api/auth/course/deleteEnrolledCourse/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
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

      {/* Enrolled Courses */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">
          Enrolled Courses
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="mb-5 border-b border-gray-700 pb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-white">{course.title}</p>
                  <p className="text-sm text-gray-400 mb-2">
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

              {/* Video Player */}
              {course.videoUrl && (
                <div className="mt-3">
                  <video
                    controls
                    className={`transition-all duration-300 rounded shadow ${
                      expandedVideoId === course._id ? "w-full h-auto" : "w-40 h-24"
                    }`}
                    src={course.videoUrl}
                  />
                  <button
                    onClick={() =>
                      setExpandedVideoId(
                        expandedVideoId === course._id ? null : course._id
                      )
                    }
                    className="mt-2 text-blue-400 hover:underline text-sm"
                  >
                    {expandedVideoId === course._id ? "Minimize" : "Watch"}
                  </button>
                </div>
              )}
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
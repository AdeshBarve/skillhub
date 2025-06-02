import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EnrolledCourses from "./EnrolledCourses";

const InstructorDashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  // const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
    thumbnail: null,
    video: null,
  });

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
      // fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/course/getInsCourses/${user.id}`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("tags", form.tags);
    formData.append("instructor", user.id);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    if (form.video) formData.append("video", form.video);

    try {
      if (editingCourseId) {
        await axios.put(
          `http://localhost:5000/api/auth/course/updateCourse/${editingCourseId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Course updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/course/createCourse",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setForm({
        title: "",
        description: "",
        price: "",
        tags: "",
        thumbnail: null,
        video: null,
      });
      setEditingCourseId(null);
      setFormVisible(false);
      fetchCourses();
    } catch (err) {
      console.error("Course submission failed:", err.message);
    }
  };
 

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      tags: course.tags.join(", "),
      thumbnail: null,
      video: null,
    });
    setEditingCourseId(course._id);
    setFormVisible(false); // Hide create form if open
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/course/deleteInsCourse/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleCancel = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      tags: "",
      thumbnail: null,
      video: null,
    });
    setEditingCourseId(null);
    setFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-400">
          Instructor Dashboard
        </h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
          onClick={() => {
            setEditingCourseId(null);
            setFormVisible(!formVisible);
            setForm({
              title: "",
              description: "",
              price: "",
              tags: "",
              thumbnail: null,
              video: null,
            });
          }}
        >
          {formVisible ? "Close" : "Create Course"}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-purple-300">
          Account Info
        </h2>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> Instructor
        </p>
      </div>

      {/* Create Course Form */}
      {formVisible && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">
            Create Course
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <input
              name="title"
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Description"
              value={form.description}
              onChange={handleInputChange}
              required
            />
            <input
              name="price"
              type="number"
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleInputChange}
            />
            <input
              name="tags"
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleInputChange}
            />
            <div>
              <label className="block mb-1">Thumbnail</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block mb-1">Video</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
              >
                Create
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course List and Inline Edit Form */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">
          Your Courses
        </h2>
        {courses.map((course) => (
          <div key={course._id} className="mb-3 border-b border-gray-700 pb-3">
            <p className="text-lg font-semibold">{course.title}</p>
            <p className="text-sm text-gray-400">Price: ₹{course.price}</p>
            <p className="text-sm text-gray-400">
              Tags: {course.tags.join(", ")}
            </p>

            <div className="mt-2 space-x-4">
              <button
                onClick={() => handleEdit(course)}
                className="text-sm text-blue-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>

            {/* Inline Edit Form Below Course */}
            {editingCourseId === course._id && (
              <div className="bg-gray-700 mt-4 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">
                  Edit Course
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  encType="multipart/form-data"
                >
                  <input
                    name="title"
                    className="w-full p-2 rounded bg-gray-600"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea
                    name="description"
                    className="w-full p-2 rounded bg-gray-600"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    className="w-full p-2 rounded bg-gray-600"
                    placeholder="Price (₹)"
                    value={form.price}
                    onChange={handleInputChange}
                  />
                  <input
                    name="tags"
                    className="w-full p-2 rounded bg-gray-600"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className="block mb-1">Thumbnail</label>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Video</label>
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
      <EnrolledCourses/>
    </div>
  );
};

export default InstructorDashboard;

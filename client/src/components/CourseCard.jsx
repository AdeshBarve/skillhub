import React from 'react';

const CourseCard = ({ title, instructor, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">Instructor: {instructor}</p>
        <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;

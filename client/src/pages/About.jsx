import React from 'react';

const About = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 to-purple-200 py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">About SkillHub</h1>
        <p className="text-xl text-gray-700 mb-6">Empowering Students and Instructors to Connect, Learn, and Grow.</p>
      </section>

      {/* About Content Section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            At SkillHub, we believe in the power of education to change lives. Our mission is to create a platform
            where students can showcase their skills, learn from top instructors, and collaborate to grow in their
            respective fields. We provide access to a wide variety of online courses and hands-on projects to help
            learners excel in their careers.
          </p>

          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">For Instructors</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            As an instructor on SkillHub, you can share your passion and expertise with students around the world. 
            We provide an intuitive platform for you to create, manage, and teach courses on your favorite topics, 
            helping students unlock their potential and gain new skills. You’ll have the tools to track student progress,
            and your content will be featured to a wide audience.
          </p>

          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Why Choose SkillHub?</h2>
          <ul className="list-disc text-lg text-gray-600 mx-auto mb-8 space-y-4 max-w-3xl">
            <li>Learn from expert instructors with real-world experience.</li>
            <li>Gain practical skills through hands-on projects and exercises.</li>
            <li>Connect with like-minded students and professionals.</li>
            <li>Get personalized recommendations based on your learning goals.</li>
            <li>Access courses anytime, anywhere, on any device.</li>
          </ul>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Join Us Today!</h3>
            <p className="text-lg text-gray-600 mb-6">
              Whether you're a student looking to improve your skills or an instructor eager to share your knowledge,
              SkillHub is the place for you. Join us today and start your learning or teaching journey!
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-6 py-3 bg-gray-800 text-white rounded-full text-lg hover:bg-gray-900 transition duration-200"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

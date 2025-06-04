import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Signup from './pages/Signup';
import About from './pages/About'; // Assuming you want an About page
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard'; // Assuming there's a Dashboard page after login
import NotFound from './components/NotFound'; // For a 404 page
import { useAuth } from './context/AuthContext';
import CourseDetails from './pages/CourseDetails';


// Optional: Import global styles (if you have any)
import './App.css';
import Footer from './components/Footer';
import Contact from './pages/Contact';
// import { AuthProvider } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
              <Navbar /> {/* Add this line here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        {user?.role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
        {user?.role === 'instructor' && <Route path="/dashboard" element={<InstructorDashboard />} />}
        <Route path='/contact' element={<Contact/>}/>
        <Route path="*" element={<NotFound />} />
       
      </Routes>
       <Footer/>
    </Router>
  );
};

export default App;

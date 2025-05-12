// api/middleware/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  try {
    return (req, res, next) => {
      const user = req.user; // assuming JWT decoded user is in req.user
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
      next();
    };
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  };
  
  module.exports = authorizeRoles;
  
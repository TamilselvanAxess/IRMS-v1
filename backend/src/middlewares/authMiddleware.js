import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

const verifyToken = async (req, res, next) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1] || req.cookies.token; // Extract token from 'Bearer <token>'
    const token = req.headers.authorization?.split(" ")[1]  // Extract token from 'Bearer <token>'
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by decoded ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized, User not found" });
    }

    req.user = user; // Attach user info to request
    next(); // Move to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};



export default verifyToken;



export const authorizeRoles = (...roles) => {
    // console.log(roles);
    return (req ,res , next) => {
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      next();
    };
  };

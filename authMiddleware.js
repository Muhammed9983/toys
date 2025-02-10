const jwt = require("jsonwebtoken");
const User = require("./userModel.js");
require("dotenv").config();

const auth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Extract the token from "Bearer <token>"
      token = authHeader.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Ensure token contains an id
      if (!decoded.userId) {
        return res.status(401).json({ error: "Invalid token structure" });
      }
      // Fetch the user from the database (excluding password)
      const user = await User.findById(decoded.userId).select("-password");
      // Ensure the user exists
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Attach user details to request object
      req.user = {
        userId: user._id.toString(), // Ensure it's a string
        role: user.role || "USER", // Default role if not set
      };

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(403).json({ error: "No token provided" });
  }
};

module.exports = auth;

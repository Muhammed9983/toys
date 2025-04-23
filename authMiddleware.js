const jwt = require("jsonwebtoken");
const User = require("./Models/userModel.js");
require("dotenv").config();

const auth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (!decoded.userId) {
        return res.status(401).json({ error: "Invalid token structure" });
      }

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = {
        userId: user._id.toString(),
        role: user.role || "USER",
      };

      next();
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(403).json({ error: "No token provided" });
  }
};

module.exports = auth;

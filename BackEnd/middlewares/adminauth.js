const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔒 Role check
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized role access" });
    }

    req.adminId = decoded.id; // store admin id
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

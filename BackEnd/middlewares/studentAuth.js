const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const studentToken = req.headers.authorization;

  if (!studentToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(studentToken, process.env.JWT_SECRET);

    req.studentId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

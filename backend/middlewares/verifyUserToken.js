const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const verifyUserToken = async (req, res, next) => {
  const { userToken } = req.cookies || {};
  
  if (!userToken) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(userToken, secret);
    if (!decoded) {
      return res.status(403).json({ message: "Can't decode the token" });
    }
    req.user = decoded.data;
    next();
  } catch (error) {
    console.error("JWT error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(403).send({ message: "Access denied. Invalid token." });
  }
};

module.exports = verifyUserToken;

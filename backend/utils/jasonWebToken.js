const jwt = require("jsonwebtoken");

const Secret = process.env.JWT_SECRET;

const generateToken = async (email) => {
  try {
    const token = jwt.sign({ data: email }, Secret, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.log("Error creating JWT token:", error);
    throw error;
  }
};

module.exports = generateToken;

const Signup = require("../models/signup");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jasonWebToken");
const ProfilePicture = require("../models/profilePicture");

//  SIGN-UP
const userSignup = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    if (!userName || !email || !password || !confirmPassword) {
      return res.status(403).json({ message: "Incomplete data" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords doesn't  match" });
    }

    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(403).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Signup({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(200).json({ message: "Signup Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  LOGIN
const userLogin = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "invalid fields" });
    }
    const userExist = await Signup.findOne({ email });
    if (!userExist) {
      return res.status(403).json({ message: "User not found" });
    }

    const verifyPassword = await bcrypt.compare(password, userExist.password);
    if (!verifyPassword) {
      return res.status(402).json({ message: "Password not match" });
    }
    const userToken = await generateToken(email);
    res.cookie("userToken", userToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Login successfull" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

// VERIFY USEREXIST
const verifyUser = async (req, res) => {
  const email = req.user;
  try {
    if (!email) {
      return res.status(403).json({ message: "Incompleted validation" });
    }
    const userExist = await Signup.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "Authentcation Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  LOG-OUT
const userLogOut = async (req, res) => {
  const userToken = req.cookies.userToken;
  if (!userToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    res.cookie("userToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
     
   return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
   return res.status(500).json({ message: "Internal server error" });
  }
};

//  USER-NAME-UPDATE
const userNameUpdate = async (req, res) => {
  const email = req.user;
  const { userName } = req.body;

  try {
    if (!userName) {
      console.log("Incomplete field");
      return res.status(400).json({ message: "Username field is required" });
    }

    const userExists = await Signup.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedSchema = await Signup.findOneAndUpdate(
      { email: email },
      { userName: userName },
      { new: true }
    );

    if (!updatedSchema) {
      return res.status(500).json({ message: "Username update failed" });
    }
    return res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  RETREIEVE USER-NAME
const getUserName = async (req, res) => {
  const email = req.user;
  try {
    const userExist = await Signup.findOne({ email: email });
    if (!userExist) {
      console.log("user not found");
      return res.status(404).json({ message: "user not found" });
    }
    
    const userName = userExist.userName;
    const userId = userExist._id;
    const user = { userName, userId };
    
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};


//   GET-ALL-USERS
const getAllUsers = async (req, res) => {
  try {
    const userList = await Signup.find();
    if(!userList){
      return res.status(403).json({message:"Users not found"})
    }
    const userIds = userList.map((user) => user._id);
    const profilePictures = await ProfilePicture.find({
      userId: { $in: userIds },
    });

    const usersWithProfilePictures = userList.map((user) => {
      const profilePic = profilePictures.find((pic) =>
        pic.userId.equals(user._id)
      );
      return {
        ...user._doc, 
        profilePicture: profilePic ? profilePic.picture : null, 
      };
    });
   return res.status(200).json(usersWithProfilePictures);
  } catch (error) {
    console.error("Error fetching users and profile pictures:", error);
   return res.status(500).json({ message: "Internal server Error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  verifyUser,
  userLogOut,
  userNameUpdate,
  getUserName,
  getAllUsers,
};

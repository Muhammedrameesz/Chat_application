const cloudinaryInstance = require("../config/cloudinary");
const profilePicture = require("../models/profilePicture");
const Signup = require("../models/signup");

const addProfilePicture = async (req, res) => {
  const email = req.user;
  if (!email) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    const userExists = await Signup.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = userExists._id;
    const profileExist = await profilePicture.findOne({ userId });

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    if (!profileExist) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "ChatApp",
      });
      const pictureUrl = result.secure_url;
      const newProfilePicture = new profilePicture({
        userId,
        picture: pictureUrl,
      });

      await newProfilePicture.save();
      return res
        .status(201)
        .json({ message: "Profile picture added successfully" });
    }
            // update profile picture
    const currentImageURL = profileExist.picture;
    const imagePublicId =
      "ChatApp/" + currentImageURL.split("/").pop().split(".")[0];

    await cloudinaryInstance.uploader.destroy(imagePublicId);

    const result = await cloudinaryInstance.uploader.upload(req.file.path, {
      folder: "ChatApp",
    });

    const pictureUrl = result.secure_url;

    const updatedProfile = await profilePicture.findByIdAndUpdate(
      profileExist._id,
      { picture: pictureUrl },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(400).json({ message: "Profile picture update failed" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in uploading profile picture:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getProfilePicture = async (req, res) => {
  const email = req.user;
  try {
    if (!email) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const userExist = await Signup.findOne({ email: email });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }
    const userId = userExist._id;
    const getPicture = await profilePicture.findOne({ userId: userId });
    if (!getPicture) {
      return res.status(404).json({ message: "Profile Picture not found" });
    }
    return res.status(200).json(getPicture);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

module.exports = { addProfilePicture, getProfilePicture };

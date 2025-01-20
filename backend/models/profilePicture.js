const mongoose = require("mongoose");

const profilePicture = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
    picture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProfilePictureS = mongoose.model("ProfilePicture", profilePicture);
module.exports = ProfilePictureS;

const MessageSchema = require("../models/messageModal");
const Signup = require("../models/signup");
const userSchema = require("../models/signup");

const saveMessage = async (req, res) => {
  try {
    const senderEmail = req.user;
    if (!senderEmail) {
      console.log("invalid credentials");
      res.status(403).json("invalid credentials");
    }
    const { message, recieverEmail } = req.body;
    if (!message || !recieverEmail) {
      console.log("incompleted data");
      return res.status(404).json({ message: "incompleted data" });
    }
    const senderId = await userSchema.findOne({ email: senderEmail });
    if (!senderId) {
      console.log("sender not found");
      return res.status(404).json({ message: "sender not found" });
    }
    const recieverId = await userSchema.findOne({ email: recieverEmail });
    if (!recieverId) {
      console.log("sender not found");
      return res.status(404).json({ message: "reciever not found" });
    }

    const NewMessage = new MessageSchema({
      message,
      senderId,
      recieverId,
    });
    if (!NewMessage) {
      console.log("New message not created");
      res.status(403).json({ message: " Newmessage not created" });
    }
    await NewMessage.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getMessage = (req, res) => {
  console.log("abc");
};



module.exports = { saveMessage, getMessage };

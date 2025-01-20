const router = require("express").Router();
const userRouter = require("./userRouter");
const messageRouter = require("./messageRoute")
const profilePictureRouter = require("./profilePicture")


router.use("/user", userRouter);
router.use("/message", messageRouter);
router.use("/profilePicture",profilePictureRouter)


module.exports = router;

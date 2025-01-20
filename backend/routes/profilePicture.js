const profilePictureRouter = require("express").Router()
const {addProfilePicture,getProfilePicture} = require("../controllers/profile")
const upload = require("../middlewares/multer")
const verify = require("../middlewares/verifyUserToken")

profilePictureRouter.post("/add",verify,upload.single("image"),addProfilePicture)
profilePictureRouter.get("/get",verify,getProfilePicture);

module.exports = profilePictureRouter;




const userRouter = require('express').Router()
const {userSignup,userLogin,verifyUser,userLogOut,userNameUpdate,getUserName,getAllUsers} = require("../controllers/userController")
const verifyUserToken = require("../middlewares/verifyUserToken")
const verify = require("../middlewares/verifyUserToken")

userRouter.post("/signup",userSignup)
userRouter.post("/login",userLogin)
userRouter.get("/login/verify",verifyUserToken,verifyUser)
userRouter.post("/updateUserName",verify,userNameUpdate)
userRouter.get("/logOut",userLogOut)
userRouter.get("/get/userName",verify,getUserName)
userRouter.get("/get/allUsers",getAllUsers)

 
module.exports = userRouter; 
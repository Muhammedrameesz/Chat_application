const messageRouter = require("express").Router()
const  {saveMessage} = require("../controllers/messageController")

messageRouter.post("/save",saveMessage)

module.exports=messageRouter;
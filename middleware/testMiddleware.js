const jwt = require("jsonwebtoken")
const userModel = require("../model/emailModel")
require("dotenv").config()

const auth = async (req, res, next) => {
    try {
        const token = req.params.token
        const myToken = jwt.verify(token, process.env.jsonSecret)

        const user = await userModel.findById(myToken.userId)

        if (!user) {
            return res.status(400).json({
                message: `unable to logout user`
            })
        }
        if(user === null){
            return res.staus(401).json({
                message: `user logged out successfully`
            })
        }
        next()
    } catch (error) {
        
    }
}
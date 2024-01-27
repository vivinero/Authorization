const jwt = require("jsonwebtoken")
const userModel = require("../model/emailModel")
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
       const id = req.params.id
       const user = await userModel.findById(id)
       if (!user) {
        return res.status(404).json({
            message: `Authentication: user not found`
        })
       }
       const token = user.token
       if (!token) {
        return res.status(401).json({
            message: `Unauthorized user`
        })
       }

       jwt.verify(token, process.env.jsonSecret, (error, payLoad)=> {
        if (error) {
            return res.status(400).json({
                message: `session expired`
            })
        }else{
            req.user = payLoad
        }
        next()
       })

    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = authenticate

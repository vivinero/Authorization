const userModel = require("../model/emailModel")
const myValidation = require("../helpers/validator")
const bcrypt = require("bcryptjs")
const sendEmail = require("../helpers/email")
const jwt = require("jsonwebtoken")
const generateDynamicEmail = require('../html')
exports.createUser = async (req, res) => {
    try {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            number: req.body.number,
            password: req.body.password
        }

        // await myValidation.validateAsync(data)
        const saltedPassWord = bcrypt.genSaltSync(10)
        const hashPassWord = bcrypt.hashSync(data.password, saltedPassWord)
        const user = await new userModel(data)
        const { lastName, firstName, email } = user
        const userToken = await jwt.sign({ lastName, firstName, email }, process.env.jsonSecret, { expiresIn: "300s" })

        user.password = hashPassWord
        user.token = userToken
        await user.save()

        const subject = `kindly verify your account`
        const link = `${req.protocol}://${req.get('host')}/updateuser/${user._id}/${user.token}`
        // const text =`Hello ${user.firstName.toUpperCase()}. ${user.lastName.slice(0, 1). toUpperCase()}, welcome on board. Kindly use the link below ${link} to verify your account. kindly note that this link expires in 5 minutes`
        const html =  generateDynamicEmail(link, user.firstName)
// console.log(html)
        await sendEmail({
            email: user.email,
            subject,
            html
        })
        res.status(200).json({
            message: `user with email ${user.email} is created`,
            data: user
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.verify = async (req, res) => {
    try {
        const id = req.params.id
        const userToken = req.params.userToken

        jwt.verify(userToken, process.env.jsonSecret)
        const updatedUser = await userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true })

        res.status(200).json({
            message: `user with email:${updatedUser.email} is updated successfully`,
            data: updatedUser
        })
    } catch (err) {
        res.status(500).json(err.message)
    }

}
exports.home = (req, res) => {
    res.json("welcome api")
}

exports.getOne = async (req, res) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)
        if (user) {
            res.status(201).json({
                message: `user updated successfully`,
                user
            })
        } else {
            res.status(500).json({
                message: `unable to update`
            })
        }
    } catch (error) {
        req.status(500).json(error.message)
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
//check if the user is existing
        const userExist = await userModel.findOne({email: email.toLowerCase()})
//check with the if statement
        if (!userExist) {
            return res.status(404).json({
                message: `user not found`

            })
        }
        //check password
        const checkPassword = bcrypt.compareSync(password, userExist.password)
    //return a response if the password is not correct 
        if (checkPassword === false) {
            return res.status(400).json({
            message: `invalid password`
        })
        }

        const token = jwt.sign({
            userId: userExist._id,
            email: userExist.email
        }, process.env.jsonSecret, {expiresIn: "1d"})

        userExist.token = token;

        const user = await userExist.save()
        res.status(200).json({
            message: `login successful`,
            user,
        })

    } catch (error) {
        res.status(404).json(error.message)
    }
}
exports.updateuser = async (req, res) => {
    try {
        const id = req.params.id
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            number: req.body.number,
        }

        const user = await userModel.findByIdAndUpdate(id, data, {new: true})
        if (!user) {
            return res.status(404).json({
                message: `unable to update user`
            })
        }
        res.status(401).json({
            message: `user updated successfully`,
            user,
        })
    } catch (error) {
        res.status(404).json(error.message)
    }
}
exports.signOut = async (req, res)=> {
       try{
        const id = req.params.id
         const user = await userModel.findById(id)

        user.token = null
        res.status(201).json({
            message: `user has been signed out successfully`
        })
    } 
    catch (error) {
        res.status(500).json(error.message)
    }
}

exports.forgotPassword = async (req, res)=> {
    try {
        //extaract users email from the request body
        const {email} = req.body
        //find the user data from the database using the email provided
        const user = await userModel.findOne({email})
        //check if the user exist in our dataase
        if (!user) {
            return res.status(404).json({
                message: " user withe mail not found"
            })
        }
        //if a user is found, generate a token for the user
        const token = jwt.sign({ userId: user._id}, process.env.jsonSecret, {expiresIn: "10m"});
        //to get the token in the console
        console.log(token)

        const link = `${req.protocol}://${req.get('host')}/reset-password/${token}`
        const html =  generateDynamicEmail(link, user.firstName)
        await sendEmail({
            email: user.email,
            subject: "PASSWORD RESET",
            html
        })

        //send a success response
        res.status(200).json({
            message: "Reset password sent successfully"
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.resetPassword = async (req, res)=> {
    try {
    // get the token from the params
    const {token} = req.params;
    //get the new password from the body
    const {newPassword, confirmPassword} = req.body;
        //verify the validity of the token
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Password does not match"
            })
        }

    const decodedToken = jwt.verify(token, process.env.jsonSecret)

     //find the user of the token by the id
     const user = await userModel.findById(decodedToken.userId)
     if (!user) {
         return res.status(404).json({
             message: " User not found "
 
         })
     }
    //  console.log(user);
    //encript the users new password
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(newPassword, salt)

        //update the users password in the database
    user.password = hash;

        //save the changes to the database
    await user.save()

     //send a success response
     res.status(200).json({
        message: "Password reset successfullly"
    })

    } catch (error) {
        res.status(500).json(error.message)
    }
}
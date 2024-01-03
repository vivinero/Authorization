// const { string } = require("joi")

// const joi = reqiure("joi")

// const val = joi.object({
//     firstname: string().min().max().reqiured(),
//     lastname: string().min().max().reqiured(),
//     number: string().pattern(new RegExp("^[0-9]")),
//     email: string().email(),
//     password: string().pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
// })

// const dotenv = require("dotenv")
// dotenv.config()
// const nodemailer = require("nodemailer")
// const sendEmail = require("./helpers/email")

// const transporter = async (options)=> {
//     const sendEmail = nodemailer.createTransport({
//         service: process.env.service,
//         auth : {
//             user: process.env.user,
//             pass: process.env.mailPassword
//         }
//     })

//     let mailOption = {
//         from: process.env.user,
//         to: options.email,
//         subject: options.subject,
//         text: options.text
//     }
// }

// await transporter.sendEmail(mailOption)

// module.exports = sendEmail
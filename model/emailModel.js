const mongoose = require("mongoose")
const emailSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: [true, "fill your name firstName"]
    },
    lastName:{
        type: String,
        require: [true, "fill your lastName"]
    },
    email: {
        type: String,
        require: [true, "fill in your email address"]
    },
    number:{
        type: String,
    },
    password:{
        type: String,
    },
    token:{
        type: String,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

const emailModel = mongoose.model("verification", emailSchema)
module.exports = emailModel
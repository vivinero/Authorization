const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv')

const app = express()
app.use(express.json())
app.use(require('./router/emailRouter'))

dotenv.config()

const port = process.env.port
const database = process.env.apiLink

mongoose.connect(database).then(()=> {

    console.log(`database successful`)

    app.listen(port, ()=>{
        console.log(`server is listening on port: ${port}`)
    })

}).catch((e)=>{
    console.log(e.message)
})


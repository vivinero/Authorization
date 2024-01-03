const router = require('express').Router()
const{home, createUser, getOne, verify, login, updateuser, signOut}= require('../controller/emailController')
const authenticate = require('../middleware/authorization')

router.get("/", home)
router.post("/createuser", createUser)
router.put("/updateuser/:id/:userToken", verify)
router.put("/getOne/:id", getOne)
router.post("/login", login)
router.put("/update/:id/:token", authenticate, updateuser)
router.put("/signout/:id", signOut)


module.exports = router
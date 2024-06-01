const { adminGetAllusers, adminUpdateUser, adminGetUserUrl } = require("../controller/adminController")

const router = require("express").Router()

router 
    .get('/user', adminGetAllusers)
    .put('/user/:userId',adminUpdateUser)
    .get('/user/url/:userId', adminGetUserUrl)
    
module.exports = router    

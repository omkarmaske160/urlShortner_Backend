const { login, register, logout } = require('../controller/authController')

const router = require('express').Router()

router
    .post('/register',register)
    .post('/login',login)
    .post('/logout',logout)
    
module.exports = router
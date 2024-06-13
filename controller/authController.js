const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require("../models/User")

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "please Provide Valid Email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "please Provide a strong password" })
    }
    if (!name) {
        return res.status(400).json({ message: "please provide name" })
    }
    const result = await User.findOne({ email })
    if (result) {
        return res.status(400).json({ message: " Already in use" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hashPass })
    res.status(201).json({ message: "user Register success " })
})
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "email and password required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: " please Provide valid email " })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "please provide valid password" })
    }

    const result = await User.findOne({ email })
    if (!result) {
        return res.status(400).json({ message: "Email is not Registered with us" })
    }
    if (!result.active) {
        return result.status(400).json({ message: "Account BLocked . get in touch with us " })
    }
    const verify = await bcrypt.compare(password, result.password)

    if (!verify) {
        return res.status(400).json({ message: "password do not match" })

    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    res.cookie("devAuth", token, { maxAge: 1000 * 60 * 60 * 12 })

    res.status(200).json({
        message: "login Success",
        result: {
            name: result.name,
            email: result.email,
            role: result.role
        }
    })

})
exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("devAuth")
    res.status(200).json({ message: " logout Success" })
})
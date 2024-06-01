const asyncHandler = require('express-async-handler')
const validator = require("validator")
const {nanoid} = require("nanoid")
const Url = require('../models/Url')

exports.addUrl = asyncHandler(async(req,res) => {
    const { shortUrl, longUrl,label } = req.body
    if (!longUrl || !label ) {
           return res.status(400).json({ message: "please provide label and long URl"})
    }
    
    if (shortUrl) {
        const result = await Url.findOne({ shortUrl })
        if (result) {
            return res.status(400).json({ message: "please choose another short URl" })
        }
    }
        else {
            req.body.shortUrl = nanoid(6)
        }
    await Url.create(req.body)
    res.status(200).json({message:"Add URL Success"})
})

exports.getUserUrl = asyncHandler(async (req, res) => {
    const result = await Url.find({ userId: req.body.userId })
    res.status(200).json({message:"url fetch success",result})
})

exports.deleteUserUrl = asyncHandler(async(req,res) => {
    const { urlId } = req.params
    await Url.findByIdAndDelete(urlId)
    res.status(200).json({ message:" url Delete Success" })
})

exports.updateUserUrl = asyncHandler(async(req,res) => {
    const { urlId } = req.params
    await Url.findByIdAndUpdate(urlId, req.body, { runValidators: true })
    return res.status(200).json({message:"url update success"})
})
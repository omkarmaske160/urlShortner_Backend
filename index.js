const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const { userProtected, adminProtected } = require('./middleware/protected')
require('dotenv').config({ path: './.env' })

// Db
mongoose.connect(process.env.MONGO_URL)
const app = express()
// MiddleWares
app.use(express.json())
// ^ to access the data of body
app.use(cookieParser())

app.use(cors({
    // origin: "https://url-shotner-seven.vercel.app/",
    origin: "https://url-shortner-seven-beta.vercel.app/",
    credentials: true
}))

// routes
app.use('/api/v1/auth', require('./routes/authRoute'))
app.use('/api/v1/user', userProtected, require('./routes/userRoutes'))
app.use('/api/v1/url', require('./routes/urlRoute'))
app.use('/api/v1/admin', adminProtected, require('./routes/adminRoute'))


// 404 
app.use("*", (req, res) => {
    res.status(404).json({ message: "resource not found" })
})

// Error Handler 
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: err.message || "something went Wrong" })
})

// server
mongoose.connection.once("open", () => {
    console.log("Mongo Connected")
    app.listen(process.env.PORT, console.log(`Server Running : http://localhost:${process.env.PORT}`))
})
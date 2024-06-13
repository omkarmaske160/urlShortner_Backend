const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const { userProtected, adminProtected } = require('./middleware/protected')
require('dotenv').config({ path: './.env' })
const path = require("path")


// Db
mongoose.connect(process.env.MONGO_URL)
const app = express()
// MiddleWares
app.use(express.json())
// ^ to access the data of body
app.use(cookieParser())


app.use(cors({
    origin: "https://url-shortner-2dr5.onrender.com",
    credentials: true
}))

app.use(express.static(path.join(__dirname, "dist")))

// app.use(cors())

// routes
app.use('/api/v1/auth', require('./routes/authRoute'))
app.use('/api/v1/user', userProtected, require('./routes/userRoutes'))
app.use('/api/v1/url', require('./routes/urlRoute'))
app.use('/api/v1/admin', adminProtected, require('./routes/adminRoute'))


app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))

})

// server
mongoose.connection.once("open", () => {
    console.log("Mongo Connected")
    app.listen(process.env.PORT, console.log(`Server Running : http://localhost:${process.env.PORT}`))
})

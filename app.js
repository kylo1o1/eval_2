const express = require('express')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const productRoute = require('./routes/productRoutes')

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:true,
}))
app.use(cookieParser())

app.use(userRoutes)
app.use('/product',productRoute)



module.exports = app
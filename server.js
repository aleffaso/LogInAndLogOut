const express = require('express')
const app = express()
const passport = require('passport')
const flash = require ('express-flash')
const session = require ('express-session')
const dotenv = require('dotenv')
const methodOverride = require('method-override')
const routes = require("./config/routes") // organize routes

dotenv.config({path: './.env'})

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(routes)

app.listen(3000, () => {
    console.log("Server Running")
})
const express = require("express")
const routes = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport')
const req = require("express/lib/request")
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

routes.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name })
})

routes.get('/login',checkNotAuthenticated,  (req, res) => {
    res.render('login.ejs')
})

routes.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

routes.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs')
})

routes.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
         const hashedPassword = await bcrypt.hash(req.body.password, 10)
         users.push({
             id: Date.now().toString(),
             name: req.body.name,
             email: req.body.email,
             password: hashedPassword
         })
         res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

routes.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = routes;


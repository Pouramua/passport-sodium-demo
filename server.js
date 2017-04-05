const express = require('express')
const flash = require('connect-flash')
const hbs = require('express-handlebars')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const path = require('path')

const auth = require('./lib/auth')
const users = require('./lib/users')
const session = require('./lib/session')

const indexRoutes = require('./routes')

const app = express()

app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(session)
app.use(flash())
app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRoutes)

passport.use(new LocalStrategy(auth.verify))
passport.serializeUser(users.serialize)
passport.deserializeUser(users.deserialize)

module.exports = app

const express = require('express')
const bodyParser = require('body-parser')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const passport = require('passport')
const users = require('../lib/users')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/login', (req, res) => {
  res.render('login', { flash: req.flash('error') })
})

//flash message
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)

// failureFlash
// passport.authenticate('local', { failureFlash: 'Invalid username or password.' })

// successFlash
// passport.authenticate('local', { successFlash: 'Welcome!' });

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

router.get('/',
  ensureLoggedIn(),
  (req, res) => {
    res.render('index')
  }
)

router.get('/register', (req, res) => {
  res.render('register', { flash: req.flash('error') })
})

router.post('/register',
  register,
  registerFail
)

function register (req, res, next) {
  users.exists(req.body.username)
    .then(exists => {
      if (exists) {
        req.flash('error', 'User already exists, sorry.')
        return res.redirect('/register')
      }

      // req.login() can be used to automatically log the user in after registering
      users.create(req.body.username, req.body.password)
        .then(() => res.redirect('/login'))
    })
    .catch(() => next())
}

function registerFail (req, res) {
  req.flash('error', "Couldn't add user.")
  res.redirect('/register')
}

module.exports = router

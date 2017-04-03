const crypto = require('./crypto')
const users = require('./users')


function verify (username, password, done) {
  users.getByName(username)
    .then(users => {
      if (users.length === 0) {
        return done(null, false, { message: 'Unrecognised user.' })
      }

      const user = users[0]
      if (!crypto.verifyUser(user, password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      done(null, {
        id: user.id,
        username: user.username
      })
    })
  .catch(err => {
    done(err, false, { message: "Couldn't check your credentials with the database." })
  })
}

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  scope: ['email'],
  profileFields: ['id', 'emails', 'name']
}

function facebookVerify (accessToken, refreshToken, profile, done) {
  return users.getByFacebook(profile.id)
    .then(result => {
      if (result.length === 0) {
        // EITHER deny access OR add another user to the database.
        // In this case, we'll add them:
        return users.createFacebook(profile)
          .then(() => ({
            id: profile.id,
            username: profile.emails[0].value
          }))
          .then((newUser) => {
            return done(null, newUser)
          })
      }
      const user = result[0]
      done(null, {
        id: user.id,
        username: user.username
      })
    })
    .catch(err => {
      done(err, false, { message: "Couldn't check your credentials with the database." })
    })
}

module.exports = {
  facebookOptions,
  facebookVerify,
  verify
}

const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

const crypto = require('./crypto')

module.exports = {
  create,
  exists,
  getById,
  getByName,
  deserialize,
  serialize
}

function create (username, password, testDb) {
  const hash = crypto.getHash(password)
  const connection = testDb || knex

  return connection('users')
    .insert({
      username: username,
      hash: hash
    })
}

function exists (username, testDb) {
  const connection = testDb || knex
  return connection('users')
    .count('id as n')
    .where('username', username)
    .then(count => {
      return count[0].n > 0
    })
}

function getById (id, testDb) {
  const connection = testDb || knex
  return connection('users')
    .select('id', 'username')
    .where('id', id)
}

function getByName (username, testDb) {
  const connection = testDb || knex
  return connection('users')
    .select()
    .where('username', username)
}

function deserialize (id, done) {
  getById(id)
    .then(users => {
      if (users.length === 0) {
        return done(null, false)
      }
      done(null, users[0])
    })
    .catch(err => done(err, false))
}

function serialize (user, done) {
  done(null, user.id)
}

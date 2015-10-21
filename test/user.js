var assert = require('assert'),
	User     = require('../models/user'),
	r        = require('../utils/rethinkdb')({db:'test'})

require('co-mocha')

describe('User Model testing', function() {
	it('should create a user', function *() {
		var user = new User()
		assert.equal(typeof user, 'object')
	})

	it('should store properties passed when instantiated', function *() {
		var username, user
		username = 'james'
		user = new User({username: username})
		assert.equal(user.username, username)
	})
	
	it('should assign an id after being saved', function *() {
		var username, password, user
		username = 'james'
		password = 'secret'
		var user = new User({username: username, password: password})
		yield user.save()
		assert(user.id)
	})

	it('should find a saved user by username', function *() {
		var user, foundUser, username, password
		username = 'james'
		password = 'secret'
		user = new User({username: username, password:password})
		yield user.save()
		foundUser = yield User.findByUsername(username)
		assert.equal(foundUser.username, username)
	})

	it('should have a hashed password after being saved', function *() {
		var user, username, password;
		username = 'james'
		password = 'secret'
		var user = new User({username: username, password: password})
		yield user.save()
		assert.notEqual(user.password, password)
	})

	it('should validate a correct password', function *() {
		var user, username, password;
		username = 'james'
		password = '123456'
		user     = new User({username:username, password: password})
		yield user.save()
		assert(yield user.isPassword(password))
	})

	it('should not validate an incorrect password', function *() {
		var user, username, password;
		username = 'james'
		password = '123456'
		user     = new User({username:username, password: password})
		yield user.save()
		assert(!(yield user.isPassword('wrongpassword')))
	})
})


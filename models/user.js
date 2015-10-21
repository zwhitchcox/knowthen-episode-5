var _    = require('lodash'),
	r      = require('../utils/rethinkdb')(),
	bcrypt = require('co-bcryptjs')

var SCHEMA = ['username', 'password'],
	TABLE = 'users'

var User = function (properties) {
	this.init()
	_.assign(this,properties)
}

User.prototype.hashPassword = function *() {
	if (this.newPassword) {
		this.newPassword = false
		var salt = yield bcrypt.genSalt(10)
		this.password = yield bcrypt.hash(this.password, salt)
	}
}

User.prototype.init = function() {
	Object.defineProperty(this, 'password', {
		get: function() {
			return this._password
		},
		set: function (password) {
			this._password = password
			this.newPassword = true
		}
	})
}

User.findByUsername = function * (username) {
	var result, criteria, user;
	criteria = {}
	criteria.username = username
	result = yield r.table(TABLE)
		.filter(criteria)
		.run()
	if (result && result.length >= 1) {
		user = new User(result[0])
	}
	return user
}

User.prototype.isPassword = function *(password) {
	return yield bcrypt.compare(password, this.password)
}

User.prototype.save = function *() {
	var result, data;
	yield this.hashPassword()
	data = _.pick(this,SCHEMA)

	if (this.id) {
		result = yield r.table(TABLE)
			.get(this.id)
			.update(data)
			.run()
	} else {
		result = yield r.table(TABLE)
			.insert(data)
			.run()
		if (result && result.inserted === 1) {
			this.id = result.generated_keys[0]
		}
	}
}

module.exports = User

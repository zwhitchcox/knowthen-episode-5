'use strict'
var r = require('../utils/rethinkdb')(),
	TABLE = 'users'


exports.up = function(next) {
	r.tableCreate(TABLE)
		.run(next)
};

exports.down = function(next) {
	r.tableDrop(TABLE)
		.run(next)
};

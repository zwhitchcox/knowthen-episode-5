'use strict'
var r = require('../utils/rethinkdb')(),
	config = require('../config/config')


exports.up = function(next) {
  r.dbCreate(config.rethink.db)
		.run(next)
};

exports.down = function(next) {
	r.dbDrop(config.rethink.db)
		run(next)
};

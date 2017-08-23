/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: String,
	password: String
}, {collection: "users"});

module.exports = mongoose.model('users', UserSchema);
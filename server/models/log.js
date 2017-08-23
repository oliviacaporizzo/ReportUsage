var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
	contract_number: String,
	method: String,
	url: String,
	date: Date,
	body: String
}, {collection: "logs"});

module.exports = mongoose.model('logs', LogSchema);
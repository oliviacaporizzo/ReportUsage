var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
	customerName: String,
	openpayPayload:{
		skuConfiguration: String
	}
}, {collection: "openpaydatas"});

module.exports = mongoose.model('openpaydatas', DataSchema);
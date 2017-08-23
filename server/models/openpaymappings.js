var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MappingSchema = new Schema({
	contractName: String,
	folderName: String,
}, {collection: "openpaymappings"});

module.exports = mongoose.model('openpaymappings', MappingSchema);
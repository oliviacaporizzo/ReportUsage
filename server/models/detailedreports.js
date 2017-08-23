var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailedSchema = new Schema({
	ContractNumber: String,
	CustomerName: String,
	SerialNumber: String,
	UsedDateTime: Date,
	SKUType: String,
	SKUName: String,
	Used: String
}, {collection: "detailedreports"});

module.exports = mongoose.model('detailedreports', DetailedSchema);
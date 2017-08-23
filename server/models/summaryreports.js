var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SummarySchema = new Schema({
	ContractNumber: String,
	CustomerName: String,
	UsedDateTime: Date,
	SKUType: String,
	Quantity: Number,
	InstalledQuantity: Number,
	Units: Number,
	Price: Number,
	Charge: Number,
	Currency: String
}, {collection: "summaryreports"});

module.exports = mongoose.model('summaryreports', SummarySchema);
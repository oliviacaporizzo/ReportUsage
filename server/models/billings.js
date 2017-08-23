var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BillingSchema = new Schema({
	ContractNumber: String,
	startDate: Date
}, {collection: "billings"});

module.exports = mongoose.model('billings', BillingSchema);
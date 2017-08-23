var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
	agreement: String,
	assets: [ {
			skuType: String,
			serialNumbers: [{
				partNumber: String,
				serialNumber: String
				}],
			remoteSites: [{
				skuName: String,
				installedQuantity: Number,
				remoteSite: String
			}]
		}
	]

}, {collection: "contracts"});

module.exports = mongoose.model('contracts', ContractSchema);
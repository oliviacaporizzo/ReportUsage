var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserMappingSchema = new Schema({
    account: String,
    users: [String]
}, {collection: "user_account_mappings"});

module.exports = mongoose.model('user_account_mappings', UserMappingSchema);
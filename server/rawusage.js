var express = require('express');
var router = express.Router();
var skuParser = require('./skuConfigurationParser');
var mapping = require('./models/openpaymappings');
var openPayData = require('./models/openpaydatas');
var contracts = require('./models/contracts');

function getInfo(contractNumber) {

	var skuType;
	var serialNumbers = [];
	var folderName;
	var data = [];
	var mapIpToSku = {};
	mapping.findOne({contractName: contractNumber}, function(err, doc) {
		if(err) {
			console.log(err);
		}
		if(doc) {
			folderName = doc.folderName;
			
		}
		
		contracts.findOne({agreement: contractNumber}, function(err, doc){
			if(err) {
				console.log(err);
			}
			if(doc) {
				for(var i = 0; i < doc.assets[0].serialNumbers.length; i++) {
					serialNumbers.push(doc.assets[0].serialNumbers[i].serialNumber);
				}
				skuType = doc.assets[0].skuType;
				for(var j = 0; j < doc.assets[0].remoteSites.length;j++) {
					mapIpToSku[doc.assets[0].remoteSites[j].remoteSite] = doc.assets[0].remoteSites[j].skuName;
				}
				
			}
			
			openPayData.find({customerName: folderName}, function(err, docs) {
				if(err) {
					console.log(err);
				}
				if(docs){
					//console.log(docs);
					for(var i = 0; i < docs.length; i++) {
						var skuFile = docs[i].openpayPayload.skuConfiguration;
						var parsedSku = skuParser.parse(contractNumber, skuFile, serialNumbers, skuType);
						//console.log(parseSku);
						data.push(parsedSku);
					}
					console.log(data[10]);
				}
			}).limit(12);
			
		});
	});
		
		
	
}


router.route('/BAVA')
	.post(function(req, res) {
		getInfo('ENNLP5157-01');
	});

router.route('/COMPUTE')
.post(function(req, res) {
	
});

router.route('/CPU')
.post(function(req, res) {
	
});

router.route('/HX')
.post(function(req, res) {
	
});

router.route('/MEMORY')
.post(function(req, res) {
	
});

router.route('/Rack')
.post(function(req, res) {
	
});

router.route('/STORAGE')
.post(function(req, res) {
	
});

exports.usageRouter = router;
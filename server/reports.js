var express = require('express');
var summaryRep = require('./models/summaryreports');
var billing = require('./models/billings');
var detailedreports = require('./models/detailedreports');
var router = express.Router();
var Contracts = require('./models/contracts');
var dateFormat = require('dateformat');


router.route('/detailed')
.post(function(req, res) {
	var limit = 50;
	var contractNumber;
	var pageNumber = req.body.pageNumber;
	var data = [];
	Contracts.findOne({accountnumber: req.body.accountNumber}, function(err, doc){
		if(err){
			console.log(err);
		} 
		if(doc) {
			contractNumber = doc.agreement;
			if(!req.body.options) {
				billing.findOne({ContractNumber: contractNumber}, function(err, doc) {
					var cycleStart;
					var endDate = new Date();
					if (err) {
						res.json({error: err});
					}
					if(doc) {
						
						cycleStart = doc.startDate;
						
					} else {
						cycleStart = new Date('1000-01-01T00:00:00.000Z');
					}
					
					detailedreports.find({ContractNumber: contractNumber, UsedDateTime: {$gte : cycleStart, $lte : endDate}}, function(err, docs) {
						if (err) {
							res.json({error: err});
						} 
						
						if(docs) {
							if(docs.length !== 0) {
								for(var i = 0; i < docs.length; i++) {
									var temp = {
										contractNumber : docs[i].ContractNumber,
										name : docs[i].CustomerName,
										usageDate : dateFormat(docs[i].UsedDateTime, "dd-mmmm-yyyy"),
										serialNumber: docs[i].SerialNumber,
										SKUName : docs[i].SKUName,
										SKU : docs[i].SKUType,
										used: docs[i].Used
									};		
									data.push(temp);
								}
								
								res.json({success: 'successfully pulled data from database', data: data});
								
							} else {
								res.json({error: 'no contracts found'});
							}
						} 
						
					}).sort({UsedDateTime:-1}).skip(pageNumber > 0 ? ((pageNumber-1)*limit) : 0).limit(limit);
				});
			} else {
				var cycleStart = req.body.startDate;
				var endDate;
				if(!req.body.endDate){
					endDate = new Date();
				} else {
					endDate = req.body.endDate;
				} 
				detailedreports.find({ContractNumber:contractNumber, UsedDateTime: {$gte : cycleStart, $lte : endDate}}, function(err, docs) {
					if (err) {
						res.json({error: err});
					} 
					
					if(docs) {
						if(docs.length !== 0) {
							for(var i = 0; i < docs.length; i++) {
								var temp = {
									contractNumber : docs[i].ContractNumber,
									name : docs[i].CustomerName,
									usageDate : dateFormat(docs[i].UsedDateTime, "dd-mmmm-yyyy"),
									serialNumber: docs[i].SerialNumber,
									SKUName : docs[i].SKUName,
									SKU : docs[i].SKUType,
									used: docs[i].Used
								};		
								data.push(temp);
							}
							
							res.json({success: 'successfully pulled data from database', data: data});
							
						} else {
							res.json({error: 'no contracts found'});
						}
					} 
					
				}).sort({UsedDateTime:-1}).skip(pageNumber > 0 ? ((pageNumber-1)*limit) : 0).limit(limit);
			}	
		}
	});
});

router.route('/summary')
.post(function(req, res) {
	var pageNumber = req.body.pageNumber;
	var limit;
	if(pageNumber == -1){
		limit = 370;
	} else {
		limit = 50;
	}
	var contractNumber;
	var data = [];
	Contracts.findOne({accountnumber: req.body.accountNumber}, function(err, doc){
		if(err){
			console.log(err);
		} 
		if(doc) {
			contractNumber = doc.agreement;
			if(!req.body.options) {
				var cycleStart;
				var endDate = new Date();
				billing.findOne({ContractNumber: contractNumber}, function(err, doc) {
					if (err) {
						res.json({error: err});
					}
					
					if(doc) {
						cycleStart = doc.startDate;
					}else {
						cycleStart = new Date('1000-01-01T00:00:00.000Z');
					}
			//from date and to date
					summaryRep.find({ContractNumber: contractNumber, UsedDateTime : {$gte: cycleStart, $lte: endDate}}, function(err, docs) { 
						if(err) {
							res.json({error: err});
						}
						if(docs){
							if(docs.length !== 0) {
								for(var i=0; i<docs.length; i++) {
									var temp = {
										contractNumber : docs[i].ContractNumber,
										name : docs[i].CustomerName,
										usageDate: dateFormat(docs[i].UsedDateTime, "dd-mmmm-yyyy"),
										date: docs[i].UsedDateTime,
										SKU: docs[i].SKUType,
										usedQuantity: docs[i].Quantity,
										installedQuantity: docs[i].InstalledQuantity,
										variableUnit: docs[i].Units,
										unitPrice: docs[i].Price,
										charge: docs[i].Charge,
										currency: docs[i].Currency
									};
									data.push(temp);
								}
								
								res.json({success: "successfully pulled data from database", data: data});
							} else {
								res.json({error: "no contracts found"});
							}
						}
					}).sort({UsedDateTime:-1}).skip(pageNumber > 0 ? ((pageNumber-1)*limit) : 0).limit(limit);
				});	
			} else {
				var cycleStart = req.body.startDate;
				var endDate;
				if(!req.body.endDate){
					endDate = new Date();
				} else {
					endDate = req.body.endDate;
				} 
				summaryRep.find({ContractNumber: contractNumber, UsedDateTime : {$gte: cycleStart, $lte: endDate}}, function(err, docs) { 
					if(err) {
						res.json({error: err});
					}
					if(docs){
						if(docs.length !== 0) {
							for(var i=0; i<docs.length; i++) {
								var temp = {
									contractNumber : docs[i].ContractNumber,
									name : docs[i].CustomerName,
									usageDate: dateFormat(docs[i].UsedDateTime, "dd-mmmm-yyyy"),
									date: docs[i].UsedDateTime,
									SKU: docs[i].SKUType,
									usedQuantity: docs[i].Quantity,
									installedQuantity: docs[i].InstalledQuantity,
									variableUnit: docs[i].Units,
									unitPrice: docs[i].Price,
									charge: docs[i].Charge,
									currency: docs[i].Currency
								};
								data.push(temp);
							}
							
							res.json({success: "successfully pulled data from database", data: data});
						} else {
							res.json({error: "no contracts found"});
						}
					}
				}).sort({UsedDateTime:-1}).skip(pageNumber > 0 ? ((pageNumber-1)*limit) : 0).limit(limit);
			}
		} else {
			console.log("didnt find");
		}
	});
	
});

exports.reportRouter = router;
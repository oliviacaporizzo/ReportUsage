process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var SummaryRep = require('../models/summaryreports');
var Billing = require('../models/billings');
var Detailedreports = require('../models/detailedreports');
var User = require('../models/users');

var should = chai.should();

chai.use(chaiHttp);

describe("Test for Reports", function() {
	var token = null;
	before(function(done) {
		//do something
		var detailedReport = new Detailedreports({
			ContractNumber: "TEST1",
			CustomerName: "test",
			SerialNumber: "test",
			UsedDateTime: new Date('2017-01-01T00:00:00.000Z'),
			SKUType: "test",
			SKUName: "test",
			Used: "test"
		});
		detailedReport.save();
		
		var detailedReport2 = new Detailedreports({
			ContractNumber: "TEST1",
			CustomerName: "test",
			SerialNumber: "test",
			UsedDateTime: new Date('2017-01-05T00:00:00.000Z'),
			SKUType: "test",
			SKUName: "test",
			Used: "test"
		});
		
		detailedReport2.save();
		
		var sumReport = new SummaryRep({
			ContractNumber : "TEST2",
			CustomerName : 'test',
			UsedDateTime: new Date('2017-01-01T00:00:00.000Z')
		});
		sumReport.save(function(err){
			console.log('here');
			if(err){
				console.log(err);
			}
		});
		
		var sumReport2 = new SummaryRep({
			ContractNumber : "TEST2",
			CustomerName : 'test',
			UsedDateTime: new Date('2017-01-05T00:00:00.000Z')
		});
		sumReport2.save();
		
		var user = new User({
			username: "TEST",
			password: "TEST"
		});
		
		user.save();
		
		chai.request(server)
		.post('/api/authenticate')
		.send({username: "TEST"})
		.end(function(err, res){
			token = res.body.token;
			done();
		});
		
		
		
	});
	
	after(function(done) {
		Detailedreports.remove({ContractNumber: "TEST1"}, function(err) {
			if(err) {
				console.log(err);
			}
			Billing.remove({ContractNumber: "TEST1"}, function(err) {
				if(err) {
					console.log(err);
				}
				
				Billing.remove({ContractNumber: "TEST2"}, function(err){
					if(err) {
						console.log(err);
					}
					User.remove({username: "TEST"}, function(err){
						if(err){
							console.log(err);
						}
						SummaryRep.remove({ContractNumber: "TEST2"}, function(err){
							if(err) {
								console.log(err);
							}
							done();
						});
					});
				});
			});
		});
		
	});
	
	describe("POST /detailed", function() {
		it("it should return all dates in array because cannot find in billing", function(done) {
			chai.request(server)
			.post('/api/reports/detailed')
			.set('authorization', token)
			.send({contract_number: "TEST1"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success');
				res.body.should.have.property('data');
				res.body.data.length.should.be.eql(2);
				done();
			});
		});
		
		it('it should only return one date because that is only date within the current billing cycle', function(done) {
			var bill = new Billing({
				ContractNumber: "TEST1",
				startDate: new Date('2017-01-03T00:00:00.000Z')
			});
			
			bill.save();
			
			chai.request(server)
			.post('/api/reports/detailed')
			.set('authorization', token)
			.send({contract_number: "TEST1"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success');
				res.body.should.have.property('data');
				res.body.data.length.should.be.eql(1);
				res.body.data[0].usageDate.should.be.eql('2017-01-05T00:00:00.000Z');
				done();
			});
		});
		
		it('it should say no contracts are found', function(done){
			chai.request(server)
			.post('/api/reports/detailed')
			.set('authorization', token)
			.send({contract_number: "TEST"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('error');
				res.body.error.should.be.eql('no contracts found');
				done();
			});
		});
	});
	
	describe('POST /summary', function() {
		it('it should only return one date because that is only date within the current billing cycle', function(done) {
			chai.request(server)
			.post('/api/reports/summary')
			.set('authorization', token)
			.send({contract_number: "TEST2"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success');
				res.body.should.have.property('data');
				res.body.data.length.should.be.eql(2);
				done();
			});
		});
		
		it('it should only return one date because that is only date within the current billing cycle', function(done) {
			var bill = new Billing({
				ContractNumber: "TEST2",
				startDate: new Date('2017-01-03T00:00:00.000Z')
			});
			
			bill.save();
			
			chai.request(server)
			.post('/api/reports/summary')
			.set('authorization', token)
			.send({contract_number: "TEST2"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success');
				res.body.should.have.property('data');
				res.body.data.length.should.be.eql(1);
				res.body.data[0].usageDate.should.be.eql('2017-01-05T00:00:00.000Z');
				done();
			});
		});
		
		it('it should say no contracts are found', function(done){
			chai.request(server)
			.post('/api/reports/summary')
			.set('authorization', token)
			.send({contract_number: "TEST"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('error');
				res.body.error.should.be.eql('no contracts found');
				done();
			});
		});

	});
});
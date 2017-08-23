process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var User = require('../models/users');

var should = chai.should();

chai.use(chaiHttp);

describe('Test Authorization with java web tokens', function(){
	before(function(done){
		var user = new User({
			username: "TEST",
			password: "TEST"
		});
		
		user.save();
		done();
	});
	
	after(function(done){
		User.remove({username: "TEST"}, function(err){
			if(err){
				console.log(err);
			}
		});
		done();
	});
	describe('POST /authenticate', function() {
		it('it should return a success with a unique token', function(done) {
			chai.request(server)
			.post('/api/authenticate')
			.send({username: "TEST"})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('token');
				done();
			});
		});
		
		it('it should send a false success because user is invalid', function(done) {
			chai.request(server)
			.post('/api/authenticate')
			.send({username: "not a user"})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Authentication failed. User not found.');
				done();
			});
		});
		
		it('it should not allow any other route without token', function(done){
			chai.request(server)
			.post('/api/reports')
			.send()
			.end(function(err, res) {
				res.should.have.status(403);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('No token provided.');
				done();
			});
		});
		
		it('it should send false success because wrong token or token not valid anymore', function(done){
			chai.request(server)
			.post('/api/reports')
			.set('authorization', 'this is not a token')
			.send()
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Failed to authenticate token.');
				done();
			});
		});
	});
	
});
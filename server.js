var express = require('express');
var reports = require('./server/reports');
var rawusage = require('./server/rawusage');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.Promise = require('bluebird');

var jwt = require('jsonwebtoken');
var db = require('./server/config/db');
var User = require('./server/models/users');
var config = require('./server/config/config');
var Log = require('./server/models/log');
var UserMapping = require('./server/models/user_account_mappings');

mongoose.connect(db.stageURL,db.options, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("connected to database");
	}
});


var app = express();

//var logger = function(req, res, next) {
//	var d = new Date();
//    var log = new Log({
//		contract_number: req.body.contract_number,
//		method: req.method,
//		url: req.url,
//		date: Date.UTC(d.getFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()),
//		body: JSON.stringify(req.body)
//    });
//    
//    log.save(function(err) {
//    	if (err) {
//    		console.log(err);
//    	}
//    });
//    
//    next();
//};

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json()); 

app.use(express.static(__dirname + 'dist'));

app.set('secret', config.secret);

//app.use(logger);

var router = express.Router();

router.route('/authenticate')
.post(function(req, res) {
	  User.findOne({username: req.body.username}, function(err, user) {
		    if (err) {
		    	res.send(err);
		    }

		    if (!user) {
		      res.json({ success: false, message: 'Authentication failed. User not found.' });
		    } else if (user) {
		    		var token = jwt.sign(user, app.get('secret'), {
		    		expiresIn: 1440 // expires in 24 hours
		        });

				UserMapping.findOne({users: {$in : [req.body.username]} }, function(err, doc){
					
					if(err) {
						console.log(err);
					}
					if(doc) {
						res.json({
							success: true,
							token: token,
							account: doc.account
						  });
					}
				});
		    }
	  });
})

router.use(function(req, res, next) {
	var token = req.headers.authorization;
	if(token) {
		jwt.verify(token, app.get('secret'), function(err, decoded) {      
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		      } else {
		        req.decoded = decoded;    
		        next();
		      }
		});
	} else {
		return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	}
});

// router.route('/isValid')
// 	.post(function(req, res) {
// 		console.log('isValid called');
// 	});

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', router);

app.use('/api/rawusage', rawusage.usageRouter);

app.use('/api/reports', reports.reportRouter);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

module.exports = app.listen(config.portNumber, function() {
	console.log("listening");
});
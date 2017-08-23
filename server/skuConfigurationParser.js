var contracts = require('./models/contracts');

//ask about differnet skus
exports.parse = function(contractNumber, file, serialNumbers, SKUType) {
	var jsonFile;
	var ra = [];
	var index = file.indexOf("@@@@");
	file = file.substring(index+4);
	index = file.indexOf("@@@@");
	var firstLine = file.substring(0,index);
	var folderName = firstLine.substring(firstLine.indexOf('=')+1, firstLine.indexOf('/'));
	folderName = folderName.substring(0, folderName.lastIndexOf('_'));
	var ipAdress = firstLine.substring(firstLine.indexOf('/')+1, firstLine.lastIndexOf('/'));
	var d = firstLine.substring(firstLine.lastIndexOf('/')+1, firstLine.lastIndexOf('_'));
	var dateString = d.substring(0,4) + '-' + d.substring(4,6)+ '-' + d.substring(6);
	
	var date = new Date(dateString);

	var hour = firstLine.substring(firstLine.lastIndexOf("_")+1, firstLine.lastIndexOf('.') );
	
	index = file.indexOf("@@@@");
	
		while(index !== -1) {
			file = file.substring(index+4);
			index = file.indexOf("@@@@");
			var line = file.substring(1,index);
			var comma = line.indexOf(',');
			var data = {};
			while(comma !== -1) {
				var key = line.substring(0, comma);
				line = line.substring(comma+1);
				comma = line.indexOf(',');
				var value = line.substring(0, comma);
				line = line.substring(comma+1);
				comma = line.indexOf(',');
				data[key] = value;
			}
			if(serialNumbers.includes(data.serialNumber)) {
				ra.push(data);
			}
		}
		ra.splice(ra.length-1,1);
		jsonFile = {
			folderName: folderName,
			contractNumber: contractNumber,
			SKUType: SKUType,
			ipAdress: ipAdress,
			usageDate: date,
			usageHour: hour,
			data: ra
		};
		return jsonFile;

};
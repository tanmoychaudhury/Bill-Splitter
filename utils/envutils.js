/**
 * env utils
 */
'use strict';
var HashMap = require('hashmap');
var fs = require("fs");
var map = new HashMap();

const logger = global.local_require('/utils/logger');

const api = 'Environment Utils :';
const file = 'utils.envutils';

var exports = module.exports = {};

var isBluemix = false;
if (process.env.VCAP_SERVICES) {
	isBluemix = true;
	var services = JSON.parse(process.env.VCAP_SERVICES);
	//console.log('Bluemix Service List = '+JSON.stringify(services));
	for ( var svcName in services) {
		var credentials = services[svcName][0]['credentials'];
		map.set(svcName, credentials);
		//console.log('Bluemix Service - '+svcName+' = '+JSON.stringify(credentials));
	}
	console.log(file+'.default loading bluemix VCAP_SERVICES completed ');
}else{
	console.log(file+'.default env set to local');
}

var localbindingsfile = global.local_file('/config/localbindings.json');
var contents = fs.readFileSync(localbindingsfile);
var localbindings = JSON.parse(contents);
// console.log(localbindings)

exports.getCredentials = function(serviceName) {
	if (isBluemix) {
		return map.get(serviceName);
	} else {
		return localbindings[serviceName];
	}
};
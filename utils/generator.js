'use strict';

var jwt = require('jwt-simple');
const NodeCache = require( "node-cache" );

var secret = 'BillSplitterApp';
const logger = global.local_require('/utils/logger');

var exports = module.exports = {};

exports.userInfoCache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );

// exports.getRandom = function generateRandom(){
// 	logger.log('INFO',' On getRandom func()');
// 	try{
// 		var random = uuid.v1({msecs: new Date().getTime()});
// 		return random;
// 	}catch(excep){
// 		logger.log('ERROR', 'Exception in getRandom = '+excep);
// 	}
// }

exports.getJwtToken = function genToken(ip){
	logger.log('INFO', 'On getJWTToken func()');
	try{
		return jwt.encode(ip, secret);
	}catch(excep){
		logger.log('ERROR', 'Exception in getJwtToken = '+excep);
	}
}

// exports.genShortId = function genTempPswd(){
// 	logger.log('INFO', 'On getJWTToken func()');
// 	var genId = shortid.generate();
// 	logger.log('INFO', 'On getJWTToken func(). Gen id is = '+genId);
// 	return genId;
// }
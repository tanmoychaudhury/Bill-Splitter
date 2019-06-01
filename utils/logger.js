/**
 * http://usejsdoc.org/
 */
'use strict';
const log4js = require('log4js');
const configFile = global.local_file('/config/log-config.json');

const api = 'Logger Utils :';
const file = 'utils.logger';

//log4js.loadAppender('file');
log4js.configure(configFile);


var isBluemix = false;

let logger = log4js.getLogger('dev');  //file

if (process.env.VCAP_SERVICES) {
	isBluemix = true;
	logger = log4js.getLogger('app');  //switch to app to read from kibana at a later point
	logger.info(file+'.default logging set to bluemix logs/app');
}else{
	logger.info(file+'.default logging set to logs/dev');
}


exports = module.exports = logger;


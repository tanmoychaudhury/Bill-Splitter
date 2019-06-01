'use strict';
const fs = require("fs");
const HashMap = require('hashmap');
const logger = global.local_require('/utils/logger');
const app_info_file = global.local_file('/config/appinfo.json');

const api = 'Common Utils :';
const file = 'utils.commonutils';


exports = module.exports = {
    get_app_info:get_app_info,
	set_error_response:set_error_response
};

let app_info = new HashMap();

load_appinfo(function(err,ok){
    if(ok)
        logger.info("Applicaiton info loaded");
     else   
         logger.info("Error in Applicaiton info,Please contact system support"); 
});

function load_appinfo(cb){
	fs.readFile(app_info_file,function(err,data){
		if(!err){
			var app_info_json = JSON.parse(data);
				for (var app in app_info_json) {
					app_info.set(app, app_info_json[app]);
				}
			cb(null,200);
		}else{
            logger.error(api+file+func+" Error in applicaiton load "+err);
			cb(500,null)
		}
	});
}


function get_app_info(key,callback) {
	if(app_info && app_info.get(key)===null){
		callback(204,null);
	}else{
		callback(null,app_info.get(key));
	}
}


function set_error_response(status,err,message){
	const func= '.set_error_resp'
	let err_resp = {};
	try{
		err_resp.status = status;
		err_resp.error = err;
		err_resp.message = message;
	}catch(err){
		 logger.error(api+file+func+' Error in response for ['+status+','+err+','+message+'] :'+err);  
	}
	return err_resp;
}
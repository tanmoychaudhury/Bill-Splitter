'use strict';
const async = require('async');
const envutils = global.local_require('/utils/envutils');
const appConfig = require('../config/appConfig');
const cloudant = (appConfig.isLocalDB)?envutils.getCredentials('localCouchDB'):envutils.getCredentials('cloudantNoSQLDB');
const logger = global.local_require('/utils/logger');
const HashMap = require('hashmap');
const isEmpty = require('lodash.isempty');

const nano = require("nano")({ 
	"url": cloudant.url,
	"log":function(id, args) { 
        	logger.info(id, args);
      	}
});

const api = 'Cloudant API :';
const file = 'utils.cloudantutils';

exports = module.exports = {
    readAll:readAll,
    insert_document:insert_document,
	merge_document:merge_document,
	delete_doc_by_id:delete_doc_by_id
};

//read all documents
function readAll(dbname,design_doc,view_name,options,callback) {
	const func = '.readAll';
	let err_resp ={};
	let retryOpts = { times:15,interval:350,
				  	  errorFilter: function (err) {
							if(err.statusCode === 429){// only retry for error code 429 couch error
							       logger.error(file+func);
								   logger.error(dbname+'.'+design_doc+'.'+view_name+'.'+options);
							       logger.error(err);
								return true;
							 }else{ return false;}
						},
					};
	async.waterfall([
		function(callback) {
			var db = nano.db.use(dbname);
			if(db && design_doc && view_name)
				callback(null,db);
			else
				callback(404,null);
		},async.retryable(retryOpts,function(db,callback){
			db.view(design_doc,view_name,options,callback);
		})
		],
		function (error,data) {
		if(error){
			logger.error(api+file+func+'Error in read operation '+error);
			callback(err_resp,null);
		}else{
			callback(null,data);
		}
		}
	);
};


var set_error_response=function(status,err,message){
	const func= '.set_error_response';
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


var setStatus=function(status,err){
	const func= '.setErr';
	let err_resp = {};
	try{
		err_resp.status = status;
		err_resp.error = err;
		err_resp.message = null;
	}catch(err){
		 logger.error(api+file+func+' Error in response for ['+status+','+err+','+message+'] :'+err);  
	}	
	return err_resp;
}

function insert_document(data,dbname,cb){
	let func = '.insert_document';
	let err_resp={};
	try{
		//console.log('db name = '+dbname);
		//console.log('data = '+JSON.stringify(data));
		let db = nano.db.use(dbname);
		db.insert(data,function (error,http_body,http_headers) {
				// console.log('headers = '+JSON.stringify(http_headers));
				// console.log('http_body = '+JSON.stringify(http_body));
				if(error){
					err_resp =  set_error_response(error,'ERR500','Error in save operation, please try after some time ');
					logger.error(api+file+func+'Error in save operation '+error);
					logger.error(api+file+func+'database :'+dbname+', record :'+JSON.stringify(data));
					cb(err_resp,null);
				}else{
					logger.info(api+file+func+'Adding record to database : '+dbname+' , record :'+JSON.stringify(data));
					logger.info(api+file+func+':'+JSON.stringify(http_headers));
					logger.info(api+file+func+':'+JSON.stringify(http_body));
					cb(null,http_body);
				}
			});	
	}catch(error){
		err_resp =  set_error_response(error,'ERR500','Error in save operation, please try after some time ');
		logger.error(api+file+func+'Error in save operation '+error);
		cb(err_resp,null);
	}

}

function merge_document(dbname,doc_id,data,cb){
	let func = '.merge_document';
	let err_resp={};
	try{
		let db = nano.db.use(dbname);
		db.get(doc_id,function(err,http_body,http_headers){
				if(err){
					err_resp =  set_error_response(err,'ERR500','Error in update operation, please try after some time ');
					logger.error(api+file+func+'Error in update operation '+err);
					logger.error(api+file+func+'database :'+dbname+', record :'+JSON.stringify(data));
					cb(err_resp,null);
				}else{
					var existing = http_body;
					//console.log('data = '+JSON.stringify(data));
					record_merge(existing,data,function(err,changed,merged_data){
					if(!err){
						if(changed){
							existing = merged_data;
							db.insert(existing,existing._id,function (error,http_body,http_headers) {
								if(error){
									err_resp =  set_error_response(error,'ERR500','Error in update operation, please try after some time ');
									logger.error(api+file+func+'Error in update operation '+error);
									logger.error(api+file+func+' database :'+dbname+', record :'+JSON.stringify(data));
									cb(err_resp,null);
								}else{	
									logger.info(api+file+func+' Editing record to database : '+dbname+' , record :'+JSON.stringify(data));
									logger.info(api+file+func+':'+JSON.stringify(http_headers));
									logger.info(api+file+func+':'+JSON.stringify(http_body));
									cb(null,http_body);	
								}
							});
							}
						}

					});
				}
			});	
	}catch(error){
		err_resp =  set_error_response(error,'ERR500','Error in update operation, please try after some time ');
		logger.error(api+file+func+'Error in update operation '+error);
		cb(err_resp,null);
	}

}


var record_merge = function(olddoc,newdoc,callback){
	let is_changed = false;
	for (var key in olddoc) {
			if (newdoc.hasOwnProperty(key)) {
				if (olddoc[key] != newdoc[key]) {
		        	olddoc[key] = newdoc[key];
					is_changed = true;
		        }
		    }
		}
		callback(null,is_changed,olddoc);
}

//delete document
function delete_doc_by_id(dbname,doc_id,cb){
	let func = '.merge_document';
	let err_resp={};
	try{
		let db = nano.db.use(dbname);
		db.get(doc_id,function(err,http_body,http_headers){
			if(err){
				err_resp =  set_error_response(err,'ERR500','Error in get operation, please try after some time ');
				logger.error(api+file+func+'Error in get operation '+err);
				logger.error(api+file+func+'database :: '+dbname+', record :: '+JSON.stringify(http_body));
				cb(err_resp,null);
			}else{
				db.destroy(doc_id, http_body._rev, function(err, body, header) {
					if(err) {
						err_resp =  set_error_response(err,'ERR500','Error in delete operation, please try after some time ');
						logger.error(api+file+func+'Error in delete operation '+err);
						logger.error(api+file+func+'database :: '+dbname+', record :: '+JSON.stringify(body));
						cb(err_resp,null);
					}else{
						cb(null,"deleted "+doc_id);
					}
					// return res.send(200, { message: "deleted " + req.params.bear_id});
				});
			}
		});
	}catch(error){
		err_resp =  set_error_response(error,'ERR500','Error in delete operation, please try after some time');
		logger.error(api+file+func+'Error in delete operation :: '+error);
		cb(err_resp,null);
	}
}
'use strict';
const async =require('async');
const logger = global.local_require('/utils/logger');
const c_utils = global.local_require('/utils/commonutils');
const cloudant = global.local_require('/utils/cloudantutils');
var gen = global.local_require('/utils/generator');

const api = 'BILL RECORD API :: ';
const file = 'api.record.index :: ';


exports = module.exports = {
		save_data:save_data,
		update_bill:update_bill,
        show_bill_data:show_bill_data,
        show_bill_cycle_info:show_bill_cycle_info,
        update_bill_cycle_info:update_bill_cycle_info
}


function save_data(request_data,cb){
	let func = ".save_data"
	
	cloudant.insert_document(request_data,'bill_details',function(err,data){
		if(err){
			//console.log('error saving doc'+JSON.stringify(err));
			logger.error(api+file+func+"ERROR saving bill detials "+err);
			cb(err,null);
		}
		else{
			//console.log('save doc success = '+data);
			let op = {'status':200,'message':'Bill Details ADDED successfully','id':data.id};
			logger.info(api+file+func+"Bill record saved "+data);
			cb(null,op);
		}
});
}

function update_bill(doc_id,request_data,cb){
	let func = ".update_bill"
	cloudant.merge_document('bill_details',doc_id,request_data,function(err,data){
		if(err){
			//console.log('error saving doc'+JSON.stringify(err));
			logger.error(api+file+func+"ERROR updating bill details "+err);
			cb(err,null);
		}
		else{
			//console.log('save doc success');
			console.log(data);
			let op = {'status':200,'message':'Bill Details UPDATED successfully','id':data.id};
			logger.info(api+file+func+"Bill Details updated "+data);
			cb(null,op);
		}
    });
}

//function update_bill(request_data,cb){
//	let func = ".update_bill"
//	
//	cloudant.insert_document(request_data,'bill_update',function(err,data){
//		if(err){
//			//console.log('error saving doc'+JSON.stringify(err));
//			logger.error(api+file+func+"ERROR updating bill detials "+err);
//			cb(err,null);
//		}
//		else{
//			//console.log('save doc success = '+data);
//			let op = {'status':200,'message':'bill details updated successfully','id':data.id};
//			logger.info(api+file+func+"Bill record updated "+data);
//			cb(null,op);
//		}
//});
//}

function show_bill_data(token,cb) {
    let func = 'show_bill_data :: ';
    let err_resp ={};
    try{
        async.auto({
            user:async.apply(get_user,token),
            inbox:['user', async.apply(load_inbox)]
        },function(err,ok){
            if(!err)
                cb(null, ok.inbox);
            else
                cb(err, null);
        });
    }catch(err){
        err_resp =  c_utils.set_error_response(500,'ERR500','Server Error');
		logger.error(api+file+func+' Server Error in retriving data from database:'+err);  
		cb(err_resp,null);
    }
}
function get_user(token,cb){
    gen.userInfoCache.get(token,function(err,val){
        if(err){
            let err_resp =  c_utils.set_http_error_response(500,'ERR-CACHE','Error retrieving user info from cache '+JSON.stringify(err));
            cb(err_resp, null);
        }else{
            if(val === undefined)
                cb('ERR-AUTH','Unauthorized user');
            else
                cb(null, val);
        }
    });
}
function load_inbox(params,cb){
    let func = 'load_inbox :: ';
    if(typeof(params.user)==='object'){
        cloudant.readAll('bill_details','bills','vw_all_bills',{'include_docs':true},function(err,data){
            if(!err){
               async.map(data.rows,function(bill,cb){
                   cb(null,bill.doc);
               },function(err,data){
                   if(err){
                       err_resp =  c_utils.set_error_response(500,'ERR500','Internal Server Error '+err);
                       console.log(api+file+func+' Internal Server Error :'+err);  
                       cb(err_resp,null);
                   }else{
                       cb(null,data);
                       //console.log(JSON.stringify(data));
                   }
               });
           }else{
               cb(null,[]);
           }
       });
    }else{
        cb('ERR-AUTH','Unauthorized user');
    }
    
}
function show_bill_cycle_info(cb){
    let func = 'show_bill_cycle_info :: ';
        cloudant.readAll('bill_details','bills','vw_bill_cycle_info',{'include_docs':true},function(err,data){
            if(!err){
               async.map(data.rows,function(bill,cb){
                   cb(null,bill.doc);
               },function(err,data){
                   if(err){
                       err_resp =  c_utils.set_error_response(500,'ERR500','Internal Server Error '+err);
                       console.log(api+file+func+' Internal Server Error :'+err);  
                       cb(err_resp,null);
                   }else{
                       cb(null,data);
                       //console.log(JSON.stringify(data));
                   }
               });
           }else{
               cb(null,[]);
           }
       });    
}
function update_bill_cycle_info(doc_id,request_data,cb){
	let func = ".update_bill_cycle_info"
	cloudant.merge_document('bill_details',doc_id,request_data,function(err,data){
		if(err){
			//console.log('error saving doc'+JSON.stringify(err));
			logger.error(api+file+func+"ERROR updating bill cycle info "+err);
			cb(err,null);
		}
		else{
			//console.log('save doc success');
			console.log(data);
			let op = {'status':200,'message':'Bill Cycle Info UPDATED successfully','id':data.id};
			logger.info(api+file+func+"Bill Details updated "+data);
			cb(null,op);
		}
    });
}
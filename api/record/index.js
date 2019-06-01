/**
 * API routes for Saving Bill Details 
 */
'use strict';
const express = require('express');
const service = global.local_require('api/record/service');
const logger = global.local_require('/utils/logger');

const api = 'BILL RECORD API :: ';
const file = 'api.record.index :: ';

const record= express();

/**
 * @swagger
 * definitions:
 *    BILL:
 *     properties:
 *       PAYER:
 *         type: string
 *         example: Deadpool
 *       BILLDATE:
 *         type: string
 *         example: "2017-06-15"
 *       AMOUNT:
 *         type: string
 *         example: 450
 *       MEMBER1:
 *         type: string
 *         example: 100
 *       MEMBER2:
 *         type: string
 *         example: 50
 *       MEMBER3:
 *         type: string
 *         example: 100
 *       MEMBER4:
 *         type: string
 *         example: 50
 *       MEMBER5:
 *         type: string
 *         example: 150
 *       BILLDESC:
 *         type: string
 *         example: Chimichanga
 **/

/**
 * @swagger
 *  /api/v1/record/add:
 *   post:
 *     tags:
 *       - Bill Details
 *     summary: add bill details
 *     description: save bill details into the database
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: user input that needs to be saved into the database
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/BILL'
 *     responses:
 *       200:
 *         description: successful operation
 */

record.post('/add',  function(req, res) {
	const func = '.post';
	//console.log('req = '+JSON.stringify(req.body));
	try {
	   //console.log('req.body = '+JSON.stringify(req));
        if(req.body && Object.keys(req.body).length > 0) {
	        let request_ip = req.body;
	        //console.log('inside req.body = '+JSON.stringify(req.body));
                     service.save_data(request_ip,function(err,data){
                        if(!err){
                            res.status(200).json(data);     
                        }else{
                        	//console.log('err = '+JSON.stringify(err));
               				let status = err.status;
                            let error = err.error;
                            let message = err.message;
                            let response_message = {'status':status,'message':message};
                            logger.error(api+file+func+' Internal Server Error in saving bill details :'+err);  
                            res.status(status).json(response_message);
                        }
                    });
             
        }else{
             res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});
        }
       }catch(err){
        logger.error(api+file+func+' Internal Server Error in saving bill details :'+err);
        //console.log('catch err = '+JSON.stringify(err));
        res.status(500).json({'status':500,'message':'API Response Error'});
 }
});

/**
 * @swagger
 *  /api/v1/record/update/{id}:
 *   put:
 *     tags:
 *       - Bill Details
 *     summary: update bill details 
 *     description: update an existing bill details into the database
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: bill id
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: user object that needs to be updated to the application
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/BILL'
 *     responses:
 *       200:
 *         description: successful operation
 */


record.put('/update/:id', function(req, res) {
	const func = '.put';
	    try {
	        var doc_id = req.params.id;
	        if(doc_id ===''){
	            res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});           
	        }
	        else{
                if(req.body && Object.keys(req.body).length > 0) {
                    let request_ip = req.body;
                    // console.log('doc_id = '+doc_id);
                    // console.log('request_ip = '+JSON.stringify(request_ip));
    	            service.update_bill(doc_id,request_ip,function(err,data){
                        if(!err){
                            res.status(200).json(data);
                        }else{
                            logger.error(api+file+func+' Internal Server Error in updating bill details :'+err); 
                            //console.log('try err = '+JSON.stringify(err)); 
                            res.status(500).json({'status':500,'message':'API Response Error','data':[]});
                        }
                    });
                }else{
                   res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});
                }
            }
	       }catch(err){
                logger.error(api+file+func+' Internal Server Error in updating bill details :'+err);
                //console.log('catch err = '+JSON.stringify(err));  
                res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	     }
	});

/**
 * @swagger
 * /api/v1/record/show:
 *   get:
 *     tags:
 *       - Bill Details
 *     summary: find all bills  
 *     description: Returns all bills
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all bills from database
 *         schema:
 *           $ref: '#/definitions/BILL'
 */

record.get('/show',  function(req, res) {
	const func = 'get/show :: ';
	    try {
            var token = req.headers.authtoken;
            console.log('auth token = '+token);
	        service.show_bill_data(token,function(err,result){
	            if(!err){
	                res.status(200).json({'status':'ok','message':'success','data':result});
	            }else{
                    if(err === 'ERR-AUTH'){
						console.log('ERROR', api+file+func+'Unauthorized user');  
	                	res.status(401).json({'status':401,'message':'Unauthorized user','data':[]});
					}else{
                        console.log(api+file+func+' Internal Server Error in retriving all bills from database :'+JSON.stringify(err));  
                        res.status(500).json({'status':500,'message':'Authentication failed','data':[]});
                    }
	            }
	        });
	     }catch(err){
	        console.log(api+file+func+' Internal Server Error in retriving bills from database :'+err);  
	        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	    }
	});
record.get('/bill_cycle/info', function(req,res){
    let func = '/bill_cycle/info :: ';
    try{
        // var token = req.headers.authtoken;
        // console.log('auth token = '+token);
	    service.show_bill_cycle_info(function(err,result){
	        if(!err){
	            res.status(200).json({'status':'ok','message':'success','data':result});
	        }else{
                if(err === 'ERR-AUTH'){
					console.log('ERROR', api+file+func+'Unauthorized user');  
	                res.status(401).json({'status':401,'message':'Unauthorized user','data':[]});
				}else{
                    console.log(api+file+func+' Internal Server Error in retriving bill cycle info from database :'+JSON.stringify(err));  
                    res.status(500).json({'status':500,'message':'Authentication failed','data':[]});
                }
	        }
	    });
    }catch(err){
        console.log(api+file+func+' Internal Server Error in retriving bill cycle info from database :'+err);  
        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
    }
})

record.put('/bill_cycle/update', function(req, res) {
	const func = '.put';
	    try {
	        var doc_id = '730a3f5f91a50a3bbc1e71d927baf059';
	        if(doc_id ===''){
	            res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});           
	        }
	        else{
                if(req.body && Object.keys(req.body).length > 0) {
                    let request_ip = req.body;
                    // console.log('doc_id = '+doc_id);
                    // console.log('request_ip = '+JSON.stringify(request_ip));
    	            service.update_bill_cycle_info(doc_id,request_ip,function(err,data){
                        if(!err){
                            res.status(200).json(data);
                        }else{
                            logger.error(api+file+func+' Internal Server Error in updating bill details :'+err); 
                            //console.log('try err = '+JSON.stringify(err)); 
                            res.status(500).json({'status':500,'message':'API Response Error','data':[]});
                        }
                    });
                }else{
                   res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});
                }
            }
	       }catch(err){
                logger.error(api+file+func+' Internal Server Error in updating bill details :'+err);
                //console.log('catch err = '+JSON.stringify(err));  
                res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	     }
});
///**
// * @swagger
// * definitions:
// *    BILLUPDATE:
// *     properties:
// *       PAYER:
// *         type: string
// *         example: Deadpool
// *       BILLDATE:
// *         type: string
// *         example: "2017-06-15"
// *       AMOUNT:
// *         type: string
// *         example: 450
// *       MEMBER1:
// *         type: string
// *         example: "0"
// *       MEMBER2:
// *         type: string
// *         example: "0"
// *       MEMBER3:
// *         type: string
// *         example: "0"
// *       MEMBER4:
// *         type: string
// *         example: 90
// *       MEMBER5:
// *         type: string
// *         example: "0"
// *       BILLDESC:
// *         type: string
// *         example: Chimichanga
// **/
//
///**
// * @swagger
// *  /api/v1/record/update:
// *   post:
// *     tags:
// *       - Bill Details
// *     summary: update bill details
// *     description: update existing bill details into the database
// *     produces:
// *       - application/json
// *     parameters:
// *       - name: body
// *         description: user input that needs to be saved into the database
// *         in: body
// *         required: true
// *         schema:
// *           $ref: '#/definitions/BILLUPDATE'
// *     responses:
// *       200:
// *         description: successful operation
// */
//
//record.post('/update',  function(req, res) {
//	const func = '.post';
//	//console.log('req = '+JSON.stringify(req.body));
//	try {
//	   //console.log('req.body = '+JSON.stringify(req));
//        if(req.body && Object.keys(req.body).length > 0) {
//	        let request_ip = req.body;
//	        //console.log('inside req.body = '+JSON.stringify(req.body));
//                     service.update_bill(request_ip,function(err,data){
//                        if(!err){
//                            res.status(200).json(data);     
//                        }else{
//                        	//console.log('err = '+JSON.stringify(err));
//               				let status = err.status;
//                            let error = err.error;
//                            let message = err.message;
//                            let response_message = {'status':status,'message':message};
//                            logger.error(api+file+func+' Internal Server Error in updating bill details :'+err);  
//                            res.status(status).json(response_message);
//                        }
//                    });
//             
//        }else{
//             res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});
//        }
//       }catch(err){
//        logger.error(api+file+func+' Internal Server Error in updating bill details :'+err);
//        console.log('catch err = '+JSON.stringify(err));
//        res.status(500).json({'status':500,'message':'API Response Error'});
// }
//});
module.exports = record;

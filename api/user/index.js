/**
 * Login API 
 */
'use strict';
const express = require('express');
const service = global.local_require('api/user/service');
const logger = global.local_require('/utils/logger');

const api = 'USER API :';
const file = 'api.user.index';

const login= express();

/**
 * @swagger
 * definitions:
 *    REGISTRATION:
 *     properties:
 *       TYPE:
 *         type: string
 *         example: USER_MASTER
 *       User_Id:
 *         type: string
 *         example: 1111
 *       First_Name:
 *         type: string
 *         example: "Peter"
 *       Last_Name:
 *         type: string
 *         example: "Parkar"
 *       Password:
 *         type: string
 *         example: "welcome"
 *       User_Type:
 *         type: string
 *         example: "Individual"
 *       Created_by:
 *         type: string
 *         example: "admin"
 *       Created_date:
 *         type: string
 *         example: "2017-10-09T15:31:44.852Z"
 *       Modified_by:
 *         type: string
 *         example: "admin"
 *       Modified_date:
 *         type: string
 *         example: "2017-10-09T17:19:40.038Z"
 **/

/**
 * @swagger
 *  /api/v1/user/registration:
 *   post:
 *     tags:
 *       - User
 *     summary: create account
 *     description: create a new account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: user input that needs to be saved into the database
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/REGISTRATION'
 *     responses:
 *       200:
 *         description: successful operation
 */

login.post('/registration',  function(req, res) {
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
                    logger.error(api+file+func+' Internal Server Error in saving new user details :'+err);  
                    res.status(status).json(response_message);
                }
            });            
        }else{
             res.status(422).json({'status':422,'message':'Missing or Unparsebale Entity','data':[]});
        }
       }catch(err){
        logger.error(api+file+func+' Internal Server Error in saving new user details :'+err);
        //console.log('catch err = '+JSON.stringify(err));
        res.status(500).json({'status':500,'message':'API Response Error'});
 }
});

login.get('/accounts', function(req,res){
	const func = '.get/accounts :: ';
	try{
		service.get_all_accounts(function(err,result){
			if(!err){
				res.status(200).json({'status':200,'message':'success','data':result});
			}else{
				console.log(api+file+func+' Internal Server Error in retriving users from database :'+JSON.stringify(err));  
				res.status(500).json({'status':500,'message':'Internal Server Error in retriving users from database','data':[]});
			}
		});
	}catch(err){
        console.log(api+file+func+' Internal Server Error in retieving all user details :: '+JSON.stringify(err));
        res.status(500).json({'status':500,'message':'API Response Error'});
 	}
});
/**
 * @swagger
 * /api/v1/user/inbox/id/{id}/weekid/{weekid}:
 *   get:
 *     tags:
 *       - User
 *     summary: Show inbox details
 *     description: Returns inbox details
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *       - name: weekid
 *         description: week id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns inbox details from database
 */

login.get('/inbox/id/:id/weekid/:weekid',  function(req, res) {
	const func = '.get';
	    try {
            var id = req.params.id;
            var weekid = req.params.weekid;
	        service.get_inbox_details_data(id, weekid, function(err,result){
	            if(!err){
                    // console.log('result = '+JSON.stringify(result));
	                res.status(200).json({'status':'ok','message':'success','data':result});
	            }else{
	                logger.error(api+file+func+' Internal Server Error in retriving all bills from database :'+err);  
	                res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	            }
	        });
	     }catch(err){
	        logger.error(api+file+func+' Internal Server Error in retriving bills from database :'+err);  
	        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	    }
	});

/**
 * @swagger
 * /api/v1/user/inbox/id/{id}/year/{year}:
 *   get:
 *     tags:
 *       - User
 *     summary: Show user inbox
 *     description: Returns user inbox details
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *       - name: year
 *         description: year
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns user inbox details from database
 */

login.get('/inbox/id/:id/year/:year',  function(req, res) {
	const func = '.get';
	    try {
            var id = req.params.id;
			var year = req.params.year;
	        service.get_inbox_data(id, year, function(err,result){
	            if(!err){
                    // console.log('result = '+JSON.stringify(result));
	                res.status(200).json({'status':'ok','message':'success','data':result});
	            }else{
	                logger.error(api+file+func+' Internal Server Error in retriving all bills from database :'+err);  
	                res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	            }
	        });
	     }catch(err){
	        logger.error(api+file+func+' Internal Server Error in retriving bills from database :'+err);  
	        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	    }
	});

/**
 * @swagger
 * /api/v1/user/monthlydetails/id/{id}/year/{year}:
 *   get:
 *     tags:
 *       - User
 *     summary: Show monthly details
 *     description: Returns monthly inbox details
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *       - name: year
 *         description: year
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns monthly inbox details from database
 */

login.get('/monthlydetails/id/:id/year/:year',  function(req, res) {
	const func = '.get';
	    try {
            var id = req.params.id;
			var year = req.params.year;
	        service.get_monthly_details_data(id, year, function(err,result){
	            if(!err){
                    // console.log('result = '+JSON.stringify(result));
	                res.status(200).json({'status':'ok','message':'success','data':result});
	            }else{
	                logger.error(api+file+func+' Internal Server Error in retriving all bills from database :'+err);  
	                res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	            }
	        });
	     }catch(err){
	        logger.error(api+file+func+' Internal Server Error in retriving bills from database :'+err);  
	        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
	    }
	});


login.get('/show/del_bill',  function(req, res) {
	const func = 'get/show/del_bill :: ';
		try {
			service.show_del_bill(function(err,result){
				if(!err){
					res.status(200).json({'status':200,'message':'success','data':result});
				}else{
					console.log(api+file+func+' Internal Server Error in retriving deleted bills from database :'+JSON.stringify(err));  
					res.status(500).json({'status':500,'message':'Internal Server Error in retriving deleted bills from database','data':[]});
				}
			});
		}catch(err){
			console.log(api+file+func+' Internal Server Error in retriving deleted bills from database :'+err);  
			res.status(500).json({'status':500,'message':'API Response Error','data':[]});
		}
});	
//delete doc by id API
login.delete('/remove/:id', function(req, res){
    const func = '/remove/{id} :: ';
    try{
        var id = req.params.id;
        service.delete_doc(id,function(err,result){
            if(!err){
                res.status(200).json(result);
                // res.status(200).json({'status':'ok','message':'success','data':result});
            }else{
                console.log(api+file+func+' Internal Server Error in deleting record from database :'+JSON.stringify(err));
                res.status(500).json({'status':500,'message':'Internal Server Error in deleting record','data':[]});
            }
        });
    }catch(err){
        console.log(api+file+func+' Internal Server Error in deleting record from database :: '+err);  
        res.status(500).json({'status':500,'message':'API Response Error','data':[]});
    }
});

module.exports = login;

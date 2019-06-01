'use strict';

var express = require('express');
var security = express();

const logger = global.local_require('/utils/logger');
var dbManager = global.local_require('/api/auth/service');
var gen = global.local_require('/utils/generator');
const file = 'api.auth.index.js :: ';

// /**
//  * @swagger
//  * definitions:
//  *    LOGIN:
//  *      properties:
//  *       username:
//  *         type: string
//  *       password:
//  *         type: string
//  */

// /**
//  * @swagger
//  *  /api/public/login:
//  *   post:
//  *     tags:
//  *       - Security
//  *     summary: User login
//  *     description: User login API
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: body
//  *         description: object to provide User login
//  *         in: body
//  *         required: true
//  *         schema:
//  *           $ref: '#/definitions/LOGIN'
//  *     responses:
//  *       200:
//  *         description: successful operation
//  */
security.post('/login',function(req,res){
	const func = 'security.post(/login) :: ';
	console.log(file+func +'API login is called');
	try{
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 
		req.socket.remoteAddress || req.connection.socket.remoteAddress;
		// var con = req.headers["REMOTE_ADDR"];
		var userinfo; 

		console.log(file+func +'Client IP Address :: '+ip);
		// console.log(file+func +'connection :: '+con);
        // req.body = JSON.parse(req.body);
        console.log(JSON.stringify(req.body));

		if(!req.body.username && !req.body.password){
			console.log(file+func +'Username or password not found in HTTP request. Returning.');
			res.sendStatus(400);
			res.end('Bad Request');
			return;
		} else {
			dbManager.login(req.body.username, req.body.password, req.body.timestamp, function(err, result) {
				if(err){
					var errorResponse = {};
					switch(err){
					case 'ERR-INPROG-ACC':
	                    errorResponse.status = 400;
						break;
						
					case 'ERR-RJ-ACC':
	                    errorResponse.status = 400;
						break;
						
					case 'ERR-NO-RECORD':
	                    errorResponse.status = 404;
						break;
						
					case 'ERR-PSWD-MISMATCH':
						errorResponse.status = 422;
						break;
						
					case 'ERR-DB-ERROR':
						errorResponse.status = 502;
						break;
					}
					errorResponse.message = result;
					console.log(file+func +'User login failed for Username : ' + req.body.username + ' Error :'+err+ ' Details :'+JSON.stringify(errorResponse));
					res.status(errorResponse.status);
                    res.send(errorResponse);
				}else{
                    var gentoken = gen.getJwtToken(req.body.username);
					
					userinfo = {
							userid: result.User_Id,
							firstname: result.First_Name,
							lastname: result.Last_Name,
							usertype: result.User_Type,
							clientIP: ip
					};
					// logger.info(file+func +'User is now logged in, Generated tokenData is: ' + userinfo.userid + " User role: " + userinfo.role +' Emp Id = '+userinfo.empid);
					// logger.info(file+func +'Res data = '+JSON.stringify(userinfo));
					gen.userInfoCache.set(gentoken, userinfo);
					res.send({status: 200, message: "Login successful", data: {'authtoken': gentoken, userinfo}});
				}
			});
		}
	} catch(excep){
		logger.log('ERROR', 'Exception in login API :: '+excep)
	}
});

// /**
//  * @swagger
//  *  /api/public/logout:
//  *   post:
//  *     tags:
//  *       - Security
//  *     summary: User logout
//  *     description: User logout API
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: authtoken
//  *         description: user token
//  *         in: header
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: successful operation
//  */
security.post('/logout',function(req,res){
	const func = 'security.post(/logout) :: ';
	logger.debug(file+func +'API Logout is called');
	try{
		var token = req.headers.api_key;		
		gen.userInfoCache.del(token, function(err, value){
			if(err){
				logger.error(file+func +'Error deleting user info from cache err = '+err);
			}else{
				logger.debug(file+func +'Token deleted from cache');
			}
		});
		res.status(200).json({'status':200, 'message':'Logout success', 'data':[]});

	}catch(excep){
		logger.error(file+func +'Exception in login API :: '+excep);
	}
});

module.exports = security;
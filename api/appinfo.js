'use strict';
const express = require('express');
const c_utils =  global.local_require('/utils/commonutils');

let appinfo = express();

/**
 * @swagger
 * /api/about:
 *   get:
 *     tags:
 *       - Application
 *     summary: About application  
 *     description: About application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: About the application
 */

appinfo.get('/about',function(req, res) {
	try{
		c_utils.get_app_info('about',function(err,data){
			if(!err){
				res.status(200).json(data);
			}else{
				res.status(200).json('property of Tanmoy Chaudhury');
			}
		});
	}catch(err){
		res.status(200).json('property of Tanmoy Chaudhury');
	}
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     tags:
 *       - Application
 *     summary: Application status  
 *     description: Application status  
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Application status
 */

appinfo.get('/status',function(req, res) {
	try{
		res.status(200).json('Bill-Splitter Application is up and running');
	}catch(err){
		res.status(200).json('property of Tanmoy Chaudhury');
	}
});



/**
 * @swagger
 * /api/credits:
 *   get:
 *     tags:
 *       - Application
 *     summary: Note of Thanks  
 *     description: Application credits
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Application credits
 */

appinfo.get('/credits',function(req, res) {
	try{
		c_utils.get_app_info('credits',function(err,data){
			if(!err){
				res.status(200).json(data);
			}else{
				res.status(200).json('property of Tanmoy Chaudhury');
			}
		});
	}catch(err){
		res.status(200).json('property of Tanmoy Chaudhury');
	}
});

module.exports = appinfo;
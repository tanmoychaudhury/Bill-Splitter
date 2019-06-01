'use strict';

var express = require('express');
var http = require('http');
var swaggerJSDoc = require('swagger-jsdoc');

// create a new express server
var app = express();
var bodyParser = require('body-parser');
//Enable reverse proxy support in Express. This causes the
//the "X-Forwarded-Proto" header field to be trusted so its
//value can be used to determine the protocol. See 
//http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

app.use(function (req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  }else{
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

global.local_file = function(name) {
	return (__dirname + '/' + name);
};

global.local_require = function(name) {
	return require(__dirname + '/' + name);
};

app.use(bodyParser.urlencoded({
    extended: true
}));
//all environments 
app.set('port', process.env.VCAP_APP_PORT || 8001);
app.set('host', process.env.VCAP_APP_HOST || '0.0.0.0');

//serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
/**
 * swagger definition
 **/
// var swaggerDefinition = {
//   info: {
//     title: 'Bill-Splitter HTTP API',
//     version: '1.0.0',
//     description: 'This is the current version of the Bill-Splitter HTTP API with Swagger',
//     termsOfService: "https://support-pilot.podc.sl.edst.ibm.com/support/home/",
//     contact: {
//       name: 'Bill-Splitter Application Support',
//       url: 'https://support-pilot.podc.sl.edst.ibm.com/support/home/',
//       email: 'tanmchau@in.ibm.com'
//     },
//     license: {
//       name: 'IBM License',
//       url: 'https://www-01.ibm.com/software/passportadvantage/licensing.html'
//     }
//   },
//   host: 'bill-splitter.mybluemix.net',
//   // host: 'localhost:8001',
//   basePath: '/'
// };

// //options for the swagger docs
// var options = {
//   // import swaggerDefinitions
//   swaggerDefinition: swaggerDefinition,
//   // path to the API docs
//   //apis: ['./api/routes/*.js','./api/routes/auth/*.js'],
//   apis: ['./api/record/*.js', './api/user/*.js', './api/appinfo.js']
// };


// // initialize swagger-jsdoc
// var swaggerSpec = swaggerJSDoc(options);

	

// app.get('/swagger.json', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Access-Control-Allow-Origin', '*'); 
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS'); 
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, X-Auth-Token, Content-Type');
//   res.json(swaggerSpec);
// });


var app_routes = global.local_require('/approuter')(app);

var App_start = global.local_require('/startup/appstart');


// Handle 404
app.use(function(req, res) {
    res.status(404).json('404: Page not Found');
 });
  
// Handle 500
app.use(function(error, req, res, next) {
     res.status(500).json('500: Internal Server Error');
 });

var server = http.createServer(app);

//start server
function startServer(){
  server.listen(app.get('port'), function() {
    App_start.load_app_settings();
    console.log('Express server starting on port '+ app.get('port'));
  });
}

startServer();


function ready(){
//Expose app
 app.emit("appStarted");
 console.log('Express server ready to accept connections');
}

setTimeout(ready, 1000);
exports = module.exports = app;
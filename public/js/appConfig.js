'use strict'
billapp.factory('appConfig', function(){
	return {
		//appUrl : 'http://localhost:3001/api',
		appUrl : 'http://amexapp.mybluemix.net/api/v1',
		sessionToken : 'nosession',
		isFirstLoad : true
	};
});
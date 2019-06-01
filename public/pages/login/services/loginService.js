'use strict'
billapp.factory('loginHttpService', ['$http', '$q', 'authService', function($http, $q, authService){
	
	return {
		loginAPI: function(user) {
			$('.loader').show();
			return $http.post('/api/public/login',user)
			.then(function(response){
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				// alert(errResponse.data.message);
				$('.loader').hide();
				return $q.reject(errResponse);
			}
			);
		},
		logoutAPI: function() {
			$('.loader').show();
			return $http.post('/api/public/logout',{
				"authtoken": authService.apiKey
			})
			.then(function(response){
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				console.log('Error while logout');
				return $q.reject(errResponse);
			}
			);
		},
		regAPI: function(req) {
			$('.loader').show();
			return $http({
				method: 'POST',
				url:'/api/v1/user/registration',
				"headers": {
					"content-type": "application/json"
				},
				data: req
			})
			.then(function(response){
				$('.loader').hide();
				return response;
			},
			function(errResponse){
				// alert(errResponse.data.message);
				$('.loader').hide();
				return $q.reject(errResponse);
			}
			);
		}
	};
}]);
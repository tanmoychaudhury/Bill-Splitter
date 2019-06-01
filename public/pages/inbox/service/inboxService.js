'use strict'
billapp.service('inboxHttpService', ['$http', '$q','authService', function($http, $q,authService){
	
	return {
		getAccounts: function() {
			$('.loader').show();
			return $http.get('/api/v1/user/accounts')
			.then(function(response){
				//console.log('inbox response ==>'+JSON.stringify(response.data));
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				$('.loader').hide();
				return $q.reject(errResponse);
			});
		},
		getDelBills: function() {
			$('.loader').show();
			return $http.get('/api/v1/user/show/del_bill')
			.then(function(response){
				//console.log('inbox response ==>'+JSON.stringify(response.data));
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				$('.loader').hide();
				return $q.reject(errResponse);
			});
		},
		permanentDelete: function(id) {
			$('.loader').show();
			return $http.delete('/api/v1/user/remove/'+id)
			.then(function(response){
				//console.log('inbox response ==>'+JSON.stringify(response.data));
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				$('.loader').hide();
				return $q.reject(errResponse);
			});
		},
		getBillCycleInfo: function() {
			$('.loader').show();
			// return $http.get('/api/v1/record/bill_cycle/info',{
			// 	headers: {'authtoken': authService.apiKey}
			// })
			return $http.get('/api/v1/record/bill_cycle/info')
			.then(function(response){
				// console.log('bill cycle info = '+JSON.stringify(response));
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				$('.loader').hide();
				return $q.reject(errResponse);
			});
		},
		updateBillCycleInfo: function(req) {
			console.log(req);
			$('.loader').show();
			return $http.put('/api/v1/record/bill_cycle/update',req)
			.then(function(response){
				// console.log('bill cycle info = '+JSON.stringify(response));
				$('.loader').hide();
				return response.data;
			},
			function(errResponse){
				$('.loader').hide();
				return $q.reject(errResponse);
			});
		}
	};
}]);
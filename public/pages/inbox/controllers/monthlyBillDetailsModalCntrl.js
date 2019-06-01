'use strict'
billapp.controller('monthlyBillDetailsModalController', function($scope, $http, $uibModal, $uibModalInstance, billingyear) {
	console.log('Add Bill button click');
	/*close modal view */
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    }
	$scope.year = billingyear;
	/* monthly details API GET call */
	var id = 1111;
	var monthlyDetailsURLGET = "/api/v1/user/monthlydetails/id/"+id+"/year/"+billingyear;
	$('.loader, .overlay').show();
	$http({
		url: monthlyDetailsURLGET,
		method: "GET"
	}).success(function(response) {
		$('.loader, .overlay').hide();
		//var monthlyDetailsData  = response.data;
		console.log('Monthly details = '+ JSON.stringify(response.data));
		
		/*angular-chart javascript */
		$scope.labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		$scope.series = ['Expense'];

		$scope.data = [response.data];// for diff color use response.data
	});
});

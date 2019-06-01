'use strict'; 
billapp.controller('abouttabController', ['$scope','$uibModalInstance', function ($scope, $uibModalInstance){
	
	console.log('On abouttabController');
	
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
}]);
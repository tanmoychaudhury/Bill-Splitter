'use strict'
billapp.controller('maintabController', function($scope, $state, $uibModal, loginHttpService, authService) {
	console.log('Main tab controller called');
	$scope.username = authService.firstname+' '+authService.lastname;

	$scope.about = function () {
		console.log('opening pop up');
		var modalInstance = $uibModal.open({
			templateUrl: './pages/about/templates/abouttab.htm',
			controller: 'abouttabController',
		});
	}

	// $scope.logoutBtnClick = function(){
	// 	console.log('Logout button clicked');
	// 	$state.go('login');
	// }
	$scope.click = function($event){
		console.log($event.target.clientWidth);
		$scope.logoutBtnWidth = $event.target.clientWidth;//$event.target.offsetWidth
	}
    $scope.logoutBtnClick = function(){
		$('.loader, .overlay').show();
		loginHttpService.logoutAPI()
		.then(function() {
			$('.loader, .overlay').hide();
			authService.clear();
			$state.go('login');
		});
	};
});
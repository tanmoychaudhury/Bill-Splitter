'use strict'; 
billapp.controller('noteModalController', function ($scope,$uibModal,$uibModalInstance,authService,inboxHttpService,userDataConfigService) {
	
	console.log('On noteModalController');
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.openModal= function(titleName, message){
        var modalInstance= $uibModal.open({
        backdrop: 'static',
        keyboard: false,
        templateUrl: './pages/common/templates/commonModalView.htm',
            controller: 'commonModalViewController',
            resolve:{
                titleNameVal: function(){
                    return titleName;
                },
                messageVal: function(){
                    return message;
                }
            },
            windowClass: 'smallModalWindow'
        })
    }
	inboxHttpService.getBillCycleInfo()
	.then(function(data){
		console.log('Bill Cycle Info');
		console.log(data);
		$scope.lastBillDate = data.data[0].LAST_CLEARANCE_DATE;
		$scope.currentBillCycle = data.data[0].CURRENT_BILL_CYCLE_DATE;
		$scope.modBy = data.data[0].MODIFIED_BY;
		$scope.modDate = data.data[0].MODIFIED_DATE;
	}, function (errRes) {
		console.log('Bill Cycle Info Err = '+JSON.stringify(errRes));
	})
	// $scope.lastBillDate = localStorage.getItem('billSplitterLastBillDate');
	// $scope.currentBillCycle = localStorage.getItem('billSplitterCurrentBillCycle');
	$scope.userType = authService.userType;

	$scope.updateBillCycle = (a=0,b=0)=>{
		console.log('Bill Cycle Update');
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		let update = {
			"ltdt": moment($scope.lastBillDate).add(a,'days').toISOString(),
			"stdt": moment($scope.currentBillCycle).add(b,'days').toISOString(),
			"name": `${authService.firstname} ${authService.lastname}`
		};
		// console.log(update);
		let req = userDataConfigService.billCycleInfoUpdateJson(update);
		inboxHttpService.updateBillCycleInfo(req)
		.then(function(data){
			// console.log(data);
			$('.loader, .overlay').hide();
			$scope.openModal("Update Bill Cycle", data.message);
		}, function (errRes) {
			console.log('Bill Cycle Info Err = '+JSON.stringify(errRes));
		})
	}
	$scope.resetBillCycle = ()=>{
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		let update = {
			"ltdt": moment().toISOString(),
			"stdt": moment().toISOString(),
			"name": `${authService.firstname} ${authService.lastname}`
		};
		// console.log(update);
		let req = userDataConfigService.billCycleInfoUpdateJson(update);
		inboxHttpService.updateBillCycleInfo(req)
		.then(function(data){
			// console.log(data);
			$('.loader, .overlay').hide();
			$scope.openModal("Update Bill Cycle", data.message);
		}, function (errRes) {
			console.log('Bill Cycle Info Err = '+JSON.stringify(errRes));
		})
	}
});
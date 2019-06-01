'use strict'
billapp.controller('billDetailsModalController', function($scope, $http, $uibModal, $uibModalInstance,rowData,inboxDetails,userDataConfigService,inboxHttpService) {
	console.log('Bill Details button click');
    $scope.inboxDetails = inboxDetails;
    $scope.rowData = rowData;
    console.log('rowData = '+JSON.stringify($scope.rowData));
    console.log('inboxDetails = '+JSON.stringify($scope.inboxDetails));
	/*close modal view */
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    }
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

    /*delete button function */
    $scope.remove = function (data,index) {
		$uibModalInstance.dismiss('cancel');
		inboxHttpService.permanentDelete(data._id)
		.then(function(ok){
			$scope.openModal("Permanent Delete", ok.message);
		}, function (errRes) {
			$scope.openModal("Permanent Delete", errRes.message);
		})
    };

    /* Edit button functionality  */     
    $scope.edited = -1;

    $scope.edit = function (index) {
        $scope.edited = index;
    };

    $scope.cancel = function () {
		$scope.edited = -1;
    }

    /* Save edited fields */
	$scope.updateEdit =	function (data,billupdate) {
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		var billupdateURLPUT = "/api/v1/record/update/"+data._id;	
		
		var billupdateJSON = userDataConfigService.adminBillUpdateJson(billupdate)
		//console.log('billupdateJSON = '+JSON.stringify(billupdateJSON));
		var postFunction = $http({
			url: billupdateURLPUT,
			dataType:"json",
			crossDomain: true,
			header : {"Access-Control-Allow-Headers " : "Content-Type "},
			header : {"X-Requested-With ": "Content-Type" },
			data: billupdateJSON,
			method: "PUT"
		})
		.success(function(response) {//success handling
			console.log('Success response recieved '+ JSON.stringify(response));
			$('.loader, .overlay').hide();
			if(response.status == "500"){
                $scope.openModal("Save Bill", response.message);					
			}else{
				if(response.status == "200"){
                    $scope.openModal("Save Bill", response.message);
				}else if(response.status == "422"){
                    $scope.openModal("Save Bill", response.message);
				}
			}
		})
		.error(function(response) {//err handling
			$scope.openModal("Save Bill", response.message);
		});
        $scope.edited = -1;

    };
});

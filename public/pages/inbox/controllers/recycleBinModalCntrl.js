'use strict'
billapp.controller('recycleBinModalController', function($scope, $http, $uibModal, $uibModalInstance, inboxHttpService, data) {
    console.log('recycle button click');
    $scope.dataLength = data.length;
    $scope.delBills = data;

    /* sort feature */
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverseSort = !$scope.reverseSort; //if true make it false and vice versa
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
	};
	/*close modal view */
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    }

    //Accept Account
    $scope.restore =	function (data) {
        console.log(data);
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		var billupdateURLPUT = "/api/v1/record/update/"+data._id;	
		var billupdateJSON = {
			"DELETED_DATE": null
		}
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
                $scope.openModal("Restore", response.message);					
			}else{
				$scope.openModal("Restore", "Record restored");
			}
		})
		.error(function(response) {//err handling
			$scope.openModal("Restore", response.message);
		});

    };

    //delete permanently
    $scope.delPermanent = function(data){
        $uibModalInstance.dismiss('cancel');
		inboxHttpService.permanentDelete(data._id)
		.then(function(ok){
			$scope.openModal("Permanent Delete", ok.message);
		}, function (errRes) {
			$scope.openModal("Permanent Delete", errRes.message);
		})
	}
});
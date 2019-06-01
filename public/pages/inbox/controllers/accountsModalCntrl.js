'use strict'
billapp.controller('accountsModalController', function($scope, $http, $uibModal, $uibModalInstance, data) {
    console.log('accounts button click');
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
    
    $scope.tabs = [
        {   title:'Requests',
            content: data.filter(function(acc){return acc.Status === 'In Progress';}),
            length: data.filter(function(acc){return acc.Status === 'In Progress';}).length,
            empty_msg: "No account request yet"
        },
        {   title:'Active Accounts',
            content: data.filter(function(acc){return (acc.Status === 'Accepted' && acc.User_Type === 'Individual');}),
            length: data.filter(function(acc){return (acc.Status === 'Accepted' && acc.User_Type === 'Individual');}).length,
            empty_msg: "No active account yet"
        },
        {   title:'Rejected Accounts',
            content: data.filter(function(acc){return acc.Status === 'Rejected';}),
            length: data.filter(function(acc){return acc.Status === 'Rejected';}).length,
            empty_msg: "No account rejected yet"
        },
        {   title:'Admin',
            content: data.filter(function(acc){return acc.User_Type === 'Admin'}),
            length: data.filter(function(acc){return acc.User_Type === 'Admin'}).length,
            empty_msg: "Please assign an Admin ASAP"
        }
    ];

    //Accept Account
    $scope.accAccept =	function (data) {
        console.log(data);
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		var billupdateURLPUT = "/api/v1/record/update/"+data._id;	
		var billupdateJSON = {
			"Status": "Accepted"
            // "Approval_Date": moment().toISOString()
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
                $scope.openModal("Accept Account", response.message);					
			}else{
				if(response.status == "200"){
                    $scope.openModal("Accept Account", "Account Accepted");
				}else if(response.status == "422"){
                    $scope.openModal("Accept Account", response.message);
				}
			}
		})
		.error(function(response) {//err handling
			$scope.openModal("Accept Account", response.message);
		});

    };

    //Reject Account
    $scope.accReject =	function (data) {
		$uibModalInstance.dismiss('cancel');
		$('.loader, .overlay').show();
		var billupdateURLPUT = "/api/v1/record/update/"+data._id;	
		var billupdateJSON = {
			"Status": "Rejected"
		}
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
		.success(function(response) {
			$('.loader, .overlay').hide();
			if(response.status == "500"){
                $scope.openModal("Reject Account", response.message);					
			}else{
				if(response.status == "200"){
                    $scope.openModal("Reject Account", "Account Rejected");
				}else if(response.status == "422"){
                    $scope.openModal("Reject Account", response.message);
				}
			}
		})
		.error(function(response) {//err handling
			$scope.openModal("Reject Account", response.message);
		});

    };
});
'use strict'
billapp.controller('billentrytabController', function($scope,$http,$filter,$uibModal, $uibModalInstance, authService,userDataConfigService) {

	console.log('On billentrytabController');
	
	$("#menu_dashboard").attr("class","active");
	// $("#menu_billentry").attr("class","");
	// $("#menu_billupdate").attr("class","");
	
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
	$scope.billpayer = [
        { 	"id": "1001",
            "name": "Arindam"
        },
        { 	"id": "1002",
        	"name": "Subhasis"
        },
        { 	"id": "1003",
            "name": "Tanmoy"
        },
        { 	"id": "1004",
            "name": "Debu"
        },
        { 	"id": "1005",
        	"name": "Anupam"
		},
		{ 	"id": "1006",
        	"name": "Surajit"
        }
    ];

	var billdetailsURLPOST = "/api/v1/record/add";
	function recordSubmit(){
		$('.loader, .overlay').show();
		console.log('submit button clicked');

		$scope.num = (Math.floor(Math.random() * 1000000));
		$scope.billid=$scope.bill_payer.id+$scope.num;
		
		var billdetailsJSON = userDataConfigService.userBillAddJson($scope.billid,$scope.bill_payer.name,$scope.bill_date,
						$scope.bill_amount,$scope.arindam1001,$scope.anupam1005,$scope.subhasis1002,$scope.debu1004,
						$scope.tanmoy1003,$scope.surajit1006,$scope.bill_desc);
		//console.log('billdetailsJSON = '+JSON.stringify(billdetailsJSON));
		var postFunction = $http({
			    url: billdetailsURLPOST,
			    dataType:"json",
			    crossDomain: true,
			    header : {"Access-Control-Allow-Headers " : "Content-Type "},
			    header : {"X-Requested-With ": "Content-Type" },
			    data: billdetailsJSON,
			    method: "POST"
			 })
			.success(function(response) {//success handling
					console.log('Success response recieved '+ JSON.stringify(response));
					$uibModalInstance.dismiss('cancel');
                    $('.loader, .overlay').hide();
					if(response.status == "500"){
						console.log('success if');
						$scope.openModal("Add Bill", response.message);
						// swal({
						// 	   title: response.message,
						// 	   type: "error" });					
					}else{
						console.log('success else');
						
						if(response.status == "200"){
							$scope.openModal("Add Bill", response.message);
							// swal({
							// 	   title: response.message,
							// 	   type: "success" });	
						}	
						else if(response.status == "422"){
							$scope.openModal("Add Bill", response.message);
							// swal({
							// 	   title: response.message,
							// 	   type: "warning" });
						}	
						
						// $scope.recordReset();
					}
				})
				.error(function(response) {//err handling
					console.log('err');
					console.log('Error response recieved '+ JSON.stringify(response));
					$uibModalInstance.dismiss('cancel');
					$scope.openModal("Add Bill", response.message);
					// swal({
					// 	   title: response.message,
					// 	   type: "error" });
				});
	}
	$scope.recordSubmit = recordSubmit;
	
	function recordReset(){
		console.log('reset button clicked');
		$scope.bill_payer = '';
		$scope.bill_date = '';
		$scope.bill_amount = 0;
		$scope.arindam1001 = 0;
		$scope.anupam1005 = 0;
		$scope.subhasis1002 = 0;
		$scope.debu1004 = 0;
		$scope.tanmoy1003 = 0;
		$scope.bill_desc = '';
	}
	$scope.recordReset = recordReset;

	/*angular date picker */
    $scope.today = function() {
        $scope.fromDate = new Date();
    };
    //$scope.today();
    $scope.clear = function () {
        $scope.fromDate = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        /*dateDisabled: disabled,*/
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        today: false,
        showWeeks: true
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open = function () {
        $scope.popup.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.fromDate = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMM-yyyy'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup = {
        opened: false
    };

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
});
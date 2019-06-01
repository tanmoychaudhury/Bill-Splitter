'use strict'
billapp.controller('addBillDetailsModalController', function($scope, $http, $uibModal, $uibModalInstance,userDataConfigService) {
	console.log('Add Bill button click');
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

    /*submit button function */
    $scope.submitBillDetails = function() {
        $('.loader, .overlay').show();
        var billdetailsURLPOST = "/api/v1/record/add";
        var weekID = 'Y'+moment($scope.fromDate).year()+'W'+moment($scope.fromDate).isoWeek();
        
		var billdetailsJSON = userDataConfigService.adminBillAddJson(weekID,$scope.fromDate,$scope.bill_amount,$scope.bill_desc);
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
					}
				})
				.error(function(response) {//err handling
					console.log('Error response recieved '+ JSON.stringify(response));
                    $uibModalInstance.dismiss('cancel');
                    $scope.openModal("Add Bill", response.message);
					// swal({
					// 	   title: response.message,
					// 	   type: "error" });
				});

    };

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
        maxDate: new Date(2020, 11, 31),
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

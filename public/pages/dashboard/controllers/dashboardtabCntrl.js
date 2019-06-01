'use strict'
billapp.controller('dashboardtabController', function($scope,$http,$uibModal,authService,userDataConfigService) {

	console.log('On dashboardtabController');
	
	$("#menu_dashboard").attr("class","active");
	$("#menu_billentry").attr("class","");
	$("#menu_billupdate").attr("class","");
	
	$scope.finalCalculation=(amount1,amount2)=>{
		let diff = amount1-amount2;
		return (diff<=0)?0:diff;
	}
	$scope.curdt = new Date().getMonth();
	$scope.openAddBillModal = function () {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			templateUrl: './pages/billentry/templates/billEntryModal.htm',
			controller: 'billentrytabController',
			windowClass: 'registerModalWindow'
		});
	}
	$scope.openNotelModal = function () {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			templateUrl: './pages/note/templates/noteModal.htm',
			controller: 'noteModalController',
			windowClass: 'registerModalWindow'
		});
	}
	$scope.openBillDetailsModal = function (data) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			templateUrl: './pages/dashboard/templates/dashboardBillDetailsModal.htm',
			controller: 'dashboardBillDetailsModalController',
			resolve:{
				rowData: function(){
					return data;
				}
			},
			windowClass: 'billDetailsModalWindow'
		});
	}
	/* angular clock feature */
	$scope.format = 'EEEE MMMM d,yyyy';//EEEE MMMM d,yyyy hh:mm:ss a Z, dd-MMM-yyyy hh:mm:ss a, EEEE MMMM d,yyyy hh:mm:ss a
	$scope.theme = 'blue-light';//also use dark for dark theme
	
	/* sort feature */
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverseSort = !$scope.reverseSort; //if true make it false and vice versa
    }
	
	var billdetailsURLGET = "/api/v1/record/show";
	$('.loader, .overlay').show();
	/* http get call */
	$http({
		url: billdetailsURLGET,
		method: "GET",
		headers: {'authtoken': authService.apiKey}
	}).success(function(response) {
			$('.loader, .overlay').hide();
			response.data.sort(function(a,b){
				/*sort by name */
				// var nameA = a.PAYER.toLowerCase();
				// var nameB = b.PAYER.toLowerCase();
				// if(nameA<nameB)
				// 	return -1;
				// if(nameA>nameB)
				// 	return 1;
				// return 0;

				/*sort by date */
				var dateA = moment(a.BILLDATE);
				var dateB = moment(b.BILLDATE);
				return dateB - dateA;
			});
			// console.log('List of bills - Success response recieved. '+ JSON.stringify(response)); /* printing API response on console - unit testing purpose*/
			$scope.bills  = response;
			$scope.responseDataLength = response.data.length;
			$scope.billCalculate(response);
		});

		/* individual bill calculation */
		$scope.billCalculate = function (response) {
            $scope.arindamRECEIVE = 0;
			$scope.anupamRECEIVE = 0;
			$scope.subhasisRECEIVE = 0;
			$scope.debuRECEIVE = 0;
			$scope.tanmoyRECEIVE = 0;
			$scope.surajitRECEIVE = 0;
			
			$scope.arindamDUE1 = 0;$scope.arindamDUE2 = 0;$scope.arindamDUE3 = 0;$scope.arindamDUE4 = 0;$scope.arindamDUE5 = 0;$scope.arindamDUE6 = 0;
			$scope.anupamDUE1 = 0;$scope.anupamDUE2 = 0;$scope.anupamDUE3 = 0;$scope.anupamDUE4 = 0;$scope.anupamDUE5 = 0;$scope.anupamDUE6 = 0;
			$scope.subhasisDUE1 = 0;$scope.subhasisDUE2 = 0;$scope.subhasisDUE3 = 0;$scope.subhasisDUE4 = 0;$scope.subhasisDUE5 = 0;$scope.subhasisDUE6 = 0;
			$scope.debuDUE1 = 0;$scope.debuDUE2 = 0;$scope.debuDUE3 = 0;$scope.debuDUE4 = 0;$scope.debuDUE5 = 0;$scope.debuDUE6 = 0;
			$scope.tanmoyDUE1 = 0;$scope.tanmoyDUE2 = 0;$scope.tanmoyDUE3 = 0;$scope.tanmoyDUE4 = 0;$scope.tanmoyDUE5 = 0;$scope.tanmoyDUE6 = 0;
			$scope.surajitDUE1 = 0;$scope.surajitDUE2 = 0;$scope.surajitDUE3 = 0;$scope.surajitDUE4 = 0;$scope.surajitDUE5 = 0;$scope.surajitDUE6 = 0;
			
			for(var i=0;i<response.data.length;i++){
				if(response.data[i].ARINDAM != undefined){
					if(response.data[i].PAYER == 'Arindam'){
						//$scope.arindam =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.arindam) - parseFloat(response.data[i].ARINDAM);
						$scope.arindamDUE1 = 0;
						$scope.anupamDUE1 = parseFloat($scope.anupamDUE1) + parseFloat(response.data[i].ANUPAM);
						$scope.subhasisDUE1 = parseFloat($scope.subhasisDUE1) + parseFloat(response.data[i].SUBHASIS);
						$scope.debuDUE1 = parseFloat($scope.debuDUE1) + parseFloat(response.data[i].DEBU);
						$scope.tanmoyDUE1 = parseFloat($scope.tanmoyDUE1) + parseFloat(response.data[i].TANMOY);
						$scope.surajitDUE1 = parseFloat($scope.surajitDUE1) + parseFloat(response.data[i].SURAJIT);
						
						$scope.arindamRECEIVE = $scope.arindamDUE1+$scope.anupamDUE1+$scope.subhasisDUE1+$scope.debuDUE1+$scope.tanmoyDUE1+$scope.surajitDUE1;
					}/*else{
						$scope.arindam = parseFloat($scope.arindam) - parseFloat(response.data[i].ARINDAM);
					}*/
				}
				if(response.data[i].ANUPAM != undefined){
					if(response.data[i].PAYER == 'Anupam'){
						//$scope.anupam =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.anupam) - parseFloat(response.data[i].ANUPAM);
						$scope.arindamDUE2 = parseFloat($scope.arindamDUE2) + parseFloat(response.data[i].ARINDAM);
						$scope.anupamDUE2 = 0;
						$scope.subhasisDUE2 = parseFloat($scope.subhasisDUE2) + parseFloat(response.data[i].SUBHASIS);
						$scope.debuDUE2 = parseFloat($scope.debuDUE2) + parseFloat(response.data[i].DEBU);
						$scope.tanmoyDUE2 = parseFloat($scope.tanmoyDUE2) + parseFloat(response.data[i].TANMOY);
						$scope.surajitDUE2 = parseFloat($scope.surajitDUE2) + parseFloat(response.data[i].SURAJIT);
						
						$scope.anupamRECEIVE = $scope.arindamDUE2+$scope.anupamDUE2+$scope.subhasisDUE2+$scope.debuDUE2+$scope.tanmoyDUE2+$scope.surajitDUE2;
					}/*else{
						$scope.anupam = parseFloat($scope.anupam) - parseFloat(response.data[i].ANUPAM);
					}*/
				}
				if(response.data[i].SUBHASIS != undefined){
					if(response.data[i].PAYER == 'Subhasis'){
						//$scope.subhasis =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.subhasis) - parseFloat(response.data[i].SUBHASIS);
						$scope.arindamDUE3 = parseFloat($scope.arindamDUE3) + parseFloat(response.data[i].ARINDAM);
						$scope.anupamDUE3 = parseFloat($scope.anupamDUE3) + parseFloat(response.data[i].ANUPAM);
						$scope.subhasisDUE3 = 0;
						$scope.debuDUE3 = parseFloat($scope.debuDUE3) + parseFloat(response.data[i].DEBU);
						$scope.tanmoyDUE3 = parseFloat($scope.tanmoyDUE3) + parseFloat(response.data[i].TANMOY);
						$scope.surajitDUE3 = parseFloat($scope.surajitDUE3) + parseFloat(response.data[i].SURAJIT);
						
						$scope.subhasisRECEIVE = $scope.arindamDUE3+$scope.anupamDUE3+$scope.subhasisDUE3+$scope.debuDUE3+$scope.tanmoyDUE3+$scope.surajitDUE3;
					}/*else{
						$scope.subhasis = parseFloat($scope.subhasis) - parseFloat(response.data[i].SUBHASIS);
					}*/
				}
				if(response.data[i].DEBU != undefined){
					if(response.data[i].PAYER == 'Debu'){
						//$scope.debu =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.debu) - parseFloat(response.data[i].DEBU);
						$scope.arindamDUE4 = parseFloat($scope.arindamDUE4) + parseFloat(response.data[i].ARINDAM);
						$scope.anupamDUE4 = parseFloat($scope.anupamDUE4) + parseFloat(response.data[i].ANUPAM);
						$scope.subhasisDUE4 = parseFloat($scope.subhasisDUE4) + parseFloat(response.data[i].SUBHASIS);
						$scope.debuDUE4 = 0;
						$scope.tanmoyDUE4 = parseFloat($scope.tanmoyDUE4) + parseFloat(response.data[i].TANMOY);
						$scope.surajitDUE4 = parseFloat($scope.surajitDUE4) + parseFloat(response.data[i].SURAJIT);
						
						$scope.debuRECEIVE = $scope.arindamDUE4+$scope.anupamDUE4+$scope.subhasisDUE4+$scope.debuDUE4+$scope.tanmoyDUE4+$scope.surajitDUE4;
					}/*else{
						$scope.debu = parseFloat($scope.debu) - parseFloat(response.data[i].DEBU);
					}*/
				}
				if(response.data[i].TANMOY != undefined){
					if(response.data[i].PAYER == 'Tanmoy'){
						//$scope.tanmoy =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.tanmoy) - parseFloat(response.data[i].TANMOY);
						$scope.arindamDUE5 = parseFloat($scope.arindamDUE5) + parseFloat(response.data[i].ARINDAM);
						$scope.anupamDUE5 = parseFloat($scope.anupamDUE5) + parseFloat(response.data[i].ANUPAM);
						$scope.subhasisDUE5 = parseFloat($scope.subhasisDUE5) + parseFloat(response.data[i].SUBHASIS);
						$scope.debuDUE5 = parseFloat($scope.debuDUE5) + parseFloat(response.data[i].DEBU);
						$scope.tanmoyDUE5 = 0;
						$scope.surajitDUE5 = parseFloat($scope.surajitDUE5) + parseFloat(response.data[i].SURAJIT);
						
						$scope.tanmoyRECEIVE = $scope.arindamDUE5+$scope.anupamDUE5+$scope.subhasisDUE5+$scope.debuDUE5+$scope.tanmoyDUE5+$scope.surajitDUE5;
					}/*else{
						$scope.tanmoy = parseFloat($scope.tanmoy) - parseFloat(response.data[i].TANMOY);
					}*/
				}
				if(response.data[i].TANMOY != undefined){
					if(response.data[i].PAYER == 'Surajit'){
						//$scope.tanmoy =  parseFloat(response.data[i].AMOUNT) + parseFloat($scope.tanmoy) - parseFloat(response.data[i].TANMOY);
						$scope.arindamDUE6 = parseFloat($scope.arindamDUE6) + parseFloat(response.data[i].ARINDAM);
						$scope.anupamDUE6 = parseFloat($scope.anupamDUE6) + parseFloat(response.data[i].ANUPAM);
						$scope.subhasisDUE6 = parseFloat($scope.subhasisDUE6) + parseFloat(response.data[i].SUBHASIS);
						$scope.debuDUE6 = parseFloat($scope.debuDUE6) + parseFloat(response.data[i].DEBU);
						$scope.tanmoyDUE6 = parseFloat($scope.tanmoyDUE6) + parseFloat(response.data[i].TANMOY);
						$scope.surajitDUE6 = 0;
						
						$scope.surajitRECEIVE = $scope.arindamDUE6+$scope.anupamDUE6+$scope.subhasisDUE6+$scope.debuDUE6+$scope.tanmoyDUE6+$scope.surajitDUE6;
					}/*else{
						$scope.tanmoy = parseFloat($scope.tanmoy) - parseFloat(response.data[i].TANMOY);
					}*/
				}
				
			}
			
			$scope.arindamPAY = $scope.arindamDUE1+$scope.arindamDUE2+$scope.arindamDUE3+$scope.arindamDUE4+$scope.arindamDUE5+$scope.arindamDUE6;
			$scope.anupamPAY = $scope.anupamDUE1+$scope.anupamDUE2+$scope.anupamDUE3+$scope.anupamDUE4+$scope.anupamDUE5+$scope.anupamDUE6;
			$scope.subhasisPAY = $scope.subhasisDUE1+$scope.subhasisDUE2+$scope.subhasisDUE3+$scope.subhasisDUE4+$scope.subhasisDUE5+$scope.subhasisDUE6;
			$scope.debuPAY = $scope.debuDUE1+$scope.debuDUE2+$scope.debuDUE3+$scope.debuDUE4+$scope.debuDUE5+$scope.debuDUE6;
			$scope.tanmoyPAY = $scope.tanmoyDUE1+$scope.tanmoyDUE2+$scope.tanmoyDUE3+$scope.tanmoyDUE4+$scope.tanmoyDUE5+$scope.tanmoyDUE6;
			$scope.surajitPAY = $scope.surajitDUE1+$scope.surajitDUE2+$scope.surajitDUE3+$scope.surajitDUE4+$scope.surajitDUE5+$scope.surajitDUE6;
        };

		 $scope.remove = function (data,index) {
			var billdeleteURLPUT = "/api/v1/record/update/"+data._id;
			// $scope.dt = new Date();
			$('.loader, .overlay').show();
			var billdeleteJSON = {
				"DELETED_DATE": moment().toISOString()
			}
			
			console.log('url = '+billdeleteURLPUT);
			console.log('billupdateJSON = '+JSON.stringify(billdeleteJSON));
			var postFunction = $http({
					url: billdeleteURLPUT,
					dataType:"json",
					crossDomain: true,
					header : {"Access-Control-Allow-Headers " : "Content-Type "},
					header : {"X-Requested-With ": "Content-Type" },
					data: billdeleteJSON,
					method: "PUT"
				})
				.success(function(response) {//success handling
					console.log('Success response recieved '+ JSON.stringify(response));
					$('.loader, .overlay').hide();
					if(response.status == "500"){
						console.log('success if');
						swal({
							   title: "Please Try Again",
							   text: "Internal Server Error",
							   type: "error" });					
					}else{
						console.log('success else');
						
						if(response.status == "200"){
							swal({
								   title: "Success",
								   text: "Bill details deleted successfully",
								   type: "success" });
							/* http get call */
							$http({
								url: billdetailsURLGET,
								method: "GET",
								headers: {'authtoken': authService.apiKey}
							}).success(function(response) {
									response.data.sort(function(a,b){
										var dateA = moment(a.BILLDATE);
										var dateB = moment(b.BILLDATE);
										return dateB - dateA;
									});
									// console.log('List of bills - Success response recieved. '+ JSON.stringify(response)); /* printing API response on console - unit testing purpose*/
									$scope.bills  = response;
									$scope.responseDataLength = response.data.length;
									$scope.billCalculate(response);
								});	
						}	
						else if(response.status == "422"){
							swal({
								   title: "Please Try Again",
								   text: "Internal Server Error",
								   type: "warning" });
						}
					}
				})
				.error(function(response) {//err handling
					console.log('err');
					console.log('Error response recieved '+ JSON.stringify(response));
					swal({
						   title: "Internal Server Error",
						   type: "error" });
				});
         };
		
		$scope.edited = -1;

        $scope.edit = function (index) {
            $scope.edited = index;
        };

		/* Save edited fields */
		function updateEdit(data,billupdate) {
			$('.loader, .overlay').show();
			var billupdateURLPUT = "/api/v1/record/update/"+data._id;
			$scope.dt = billupdate.billdate?moment(billupdate.billdate):data.BILLDATE;
			// $scope.diff = $scope.curdt - Date.parse(data.BILLDATE);
			// console.log('diff = '+Date.parse(data.BILLDATE));
			
			var billupdateJSON = userDataConfigService.userBillUpdateJson($scope.dt,billupdate);
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
						console.log('success if');
						swal({
							   title: response.message,
							   type: "error" });					
					}else{
						console.log('success else');
						
						if(response.status == "200"){
							swal({
								   title: response.message,
								   type: "success" });
							/* http get call */
							$http({
								url: billdetailsURLGET,
								method: "GET",
								headers: {'authtoken': authService.apiKey}
							}).success(function(response) {
									response.data.sort(function(a,b){
										var dateA = moment(a.BILLDATE);
										var dateB = moment(b.BILLDATE);
										return dateB - dateA;
									});
									// console.log('List of bills - Success response recieved. '+ JSON.stringify(response)); /* printing API response on console - unit testing purpose*/
									$scope.bills  = response;
									$scope.responseDataLength = response.data.length;
									$scope.billCalculate(response);
							});	
						}	
						else if(response.status == "422"){
							swal({
								   title: response.message,
								   type: "warning" });
						}
					}
				})
				.error(function(response) {//err handling
					console.log('err');
					console.log('Error response recieved '+ JSON.stringify(response));
					swal({
						   title: response.message,
						   type: "error" });
				});
            $scope.edited = -1;

        }
		$scope.updateEdit = updateEdit;

		$scope.close = function () {
			$scope.edited = -1;
			/* http get call */
			$http({
				url: billdetailsURLGET,
				method: "GET",
				headers: {'authtoken': authService.apiKey}
			}).success(function(response) {
					response.data.sort(function(a,b){
						var dateA = moment(a.BILLDATE);
						var dateB = moment(b.BILLDATE);
						return dateB - dateA;
					});
					// console.log('List of bills - Success response recieved. '+ JSON.stringify(response)); /* printing API response on console - unit testing purpose*/
					$scope.bills  = response;
					$scope.responseDataLength = response.data.length;
					$scope.billCalculate(response);
			});
		};
});
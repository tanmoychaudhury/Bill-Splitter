'use strict'
billapp.controller('billupdatetabController', function($scope,$http) {

	console.log('On billupdatetabController');
	
	$("#menu_dashboard").attr("class","");
	$("#menu_billentry").attr("class","");
	$("#menu_billupdate").attr("class","active");
	
	
	
	var billupdateURLPOST = "/api/v1/record/update";
	function recordUpdateSubmit(){
		
		console.log('submit button clicked');
		if($scope.bill_update_date){
			$scope.dt = $scope.bill_update_date.replace(/-/, '').replace(/-/, '');
		}
		$scope.num = (Math.floor(Math.random() * 1000000));
		$scope.billid=$scope.bill_update_payer.name.toLowerCase()+$scope.num;
		console.log('bill-id = '+$scope.billid);
		/*console.log('payer = '+$scope.bill_payer.name);
		console.log('date = '+$scope.bill_date);
		console.log('amount = '+$scope.bill_amount.toString());
		console.log('desc = '+$scope.bill_desc);*/
		
		var billupdateJSON = {
				"BILLID": $scope.billid,
				"PAYER": $scope.bill_update_payer.name,
				"BILLDATE": $scope.bill_update_date,
				"AMOUNT": $scope.bill_update_amount.toString(),
				"ARINDAM": $scope.arindam_update1001.toString(),
				"ANUPAM": $scope.anupam_update1005.toString(),
				"SUBHASIS": $scope.subhasis_update1002.toString(),
				"DEBU": $scope.debu_update1004.toString(),
				"TANMOY": $scope.tanmoy_update1003.toString(),
				"SURAJIT": $scope.surajit_update1006.toString(),
				"BILLDESC": $scope.bill_update_desc
		}
		
		var postFunction = $http({
			    url: billupdateURLPOST,
			    dataType:"json",
			    crossDomain: true,
			    header : {"Access-Control-Allow-Headers " : "Content-Type "},
			    header : {"X-Requested-With ": "Content-Type" },
			    data: billupdateJSON,
			    method: "POST"
			 })
			.success(function(response) {//success handling
					console.log('Success response recieved '+ JSON.stringify(response));
					
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
						}	
						else if(response.status == "422"){
							swal({
								   title: response.message,
								   type: "warning" });
						}	
						
						$scope.recordReset();
					}
				})
				.error(function(response) {//err handling
					console.log('err');
					console.log('Error response recieved '+ JSON.stringify(response));
					swal({
						   title: "Under maintenance, try again after sometimes",
						   type: "error" });
				});
	}
	$scope.recordUpdateSubmit = recordUpdateSubmit;
	
	function recordUpdateReset(){
		console.log('reset button clicked');
		$scope.bill_update_payer = '';
		$scope.bill_update_date = '';
		$scope.bill_update_amount = '';
		$scope.arindam_update1001 = '';
		$scope.anupam_update1005 = '';
		$scope.subhasis_update1002 = '';
		$scope.debu_update1004 = '';
		$scope.tanmoy_update1003 = '';
		$scope.bill_update_desc = '';
	}
	$scope.recordUpdateReset = recordUpdateReset;
});
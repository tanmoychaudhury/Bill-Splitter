'use strict'
billapp.controller('dashboardBillDetailsModalController', function($scope, $http, $uibModalInstance, rowData) {
    // console.log('rowData = '+JSON.stringify(rowData));
    $scope.BILLID = rowData.BILLID;
    $scope.PAYER = rowData.PAYER;
    $scope.BILLDATE = rowData.BILLDATE;
    $scope.AMOUNT = rowData.AMOUNT;
    $scope.ARINDAM = rowData.ARINDAM;
    $scope.ANUPAM = rowData.ANUPAM;
    $scope.SUBHASIS = rowData.SUBHASIS;
    $scope.DEBU = rowData.DEBU;
    $scope.TANMOY = rowData.TANMOY;
    $scope.SURAJIT = rowData.SURAJIT;
    $scope.BILLDESC = rowData.BILLDESC;
    $scope.CREATED_BY = rowData.CREATED_BY;
    $scope.CREATED_DATE = rowData.CREATED_DATE;
    $scope.MODIFIED_BY = rowData.MODIFIED_BY;
    $scope.MODIFIED_DATE = rowData.MODIFIED_DATE;
	/*close modal view */
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    }
    
});

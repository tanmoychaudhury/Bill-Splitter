'use strict'
billapp.controller('commonModalViewController', function($scope,$window, $uibModalInstance,titleNameVal, messageVal){
    $scope.titleText= titleNameVal;
    $scope.messageText= messageVal;
    $scope.close= function(){
       $uibModalInstance.dismiss('cancel');
       $window.location.reload();

    }
})
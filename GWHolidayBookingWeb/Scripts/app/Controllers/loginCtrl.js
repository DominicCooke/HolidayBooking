loginCtrl = function ($scope, dataService) {
    var vm = this;
    $scope.login = function () {
        dataService.getToken($scope.username, $scope.password).then(function () {
            alert("woo");
        }).catch(function () {
            alert("boo");
        });


    };
};
loginCtrl.$inject = ['$scope', 'dataService'];
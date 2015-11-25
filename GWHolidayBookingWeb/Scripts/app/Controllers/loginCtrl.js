loginCtrl = function ($scope, dataService, userService) {
    var vm = this;
    $scope.login = function () {
        dataService.getToken($scope.username, $scope.password).then(function () {
            userService.setUser();
        });
    };
};
loginCtrl.$inject = ['$scope', 'dataService', 'userService'];
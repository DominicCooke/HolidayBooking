loginCtrl = function ($scope, dataService, userService) {
    var vm = this;
    $scope.login = function () {
        dataService.getToken($scope.username, $scope.password).then(function() {
            userService.setUser();
        }, function() {
            $('.alert').show();
            $('#password').val('');
        });
    };
};
loginCtrl.$inject = ['$scope', 'dataService', 'userService'];
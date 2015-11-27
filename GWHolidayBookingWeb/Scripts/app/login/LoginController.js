LoginController = function ($scope, dataService, userService) {
    'use strict';
    var vm = this;
    $scope.login = function () {
        dataService.getLoginAuthToken($scope.username, $scope.password).then(function() {
            userService.setUser();
        }, function() {
            $('.alert').show();
            $('#password').val('');
        });
    };
};
LoginController.$inject = ['$scope', 'dataService', 'userService'];
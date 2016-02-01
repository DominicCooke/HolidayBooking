ManagementController = function ($scope, dataService) {
    "use strict";
    $scope.init = function () {
        dataService.userGet().then(function (response) {
            $scope.data = response.data.ListOfCalendarViewModels;
            $scope.roles = response.data.ListOfIdentityRoles;
        });
    };

    $scope.delete = function (user) {
        dataService.userDelete(user).then(function (response) {
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.register = function (user) {
        dataService.userRegister(user).then(function () {
            $scope.resetRegister();
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.update = function (user) {
        dataService.employeeUpdate(user);
    };

    $scope.userSetRole = function (user, role) {
        dataService.userSetRole(user, role).then(function (response) {
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.init();
};
ManagementController.$inject = ["$scope", "dataService"];
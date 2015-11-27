userTableCtrl = function ($scope, $http, dataService) {

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
            $('.createContainer').toggleClass('hidden');
            $('.createUserForm').trigger("reset");
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.update = function (user) {
        dataService.employeeUpdate(user);
    };

    $scope.showCreate = function () {
        $('.createContainer').toggleClass('hidden');
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
userTableCtrl.$inject = ['$scope', '$http', 'dataService'];

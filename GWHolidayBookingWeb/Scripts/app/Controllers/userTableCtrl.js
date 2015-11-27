userTableCtrl = function ($scope, $http, dataService) {

    $scope.init = function () {
        dataService.getIdentityEmployees().then(function (response) {
            $scope.data = response.data.ListOfCalendarViewModels;
            $scope.roles = response.data.ListOfIdentityRoles;
        });
    };

    $scope.delete = function (user) {
        dataService.deleteUser(user).then(function (response) {
            dataService.getIdentityEmployees().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.register = function (user) {
        dataService.registerUser(user).then(function () {
            $('.createContainer').toggleClass('hidden');
            $('.createUserForm').trigger("reset");
            dataService.getIdentityEmployees().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.update = function (user) {
        dataService.updateUser(user);
    };

    $scope.showCreate = function () {
        $('.createContainer').toggleClass('hidden');
    };

    $scope.setRole = function (user, role) {
        dataService.setRole(user, role).then(function (response) {
            dataService.getIdentityEmployees().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.init();
};
userTableCtrl.$inject = ['$scope', '$http', 'dataService'];

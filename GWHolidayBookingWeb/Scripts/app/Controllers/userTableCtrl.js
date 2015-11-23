userTableCtrl = function ($scope, $http, dataService) {

    $scope.init = function () {
        dataService.getIdentityEmployees().then(function (response) {
            $scope.data = response.data;
        });
        dataService.getIdentityRoles().then(function (response) {
            $scope.roles = response.data;
        });
    };

    $scope.delete = function (user) {
        dataService.deleteUser(user).then(function (response) {
            dataService.getIdentityEmployees().then(function (response) {
                $scope.data = response.data;
            });
        });
    };

    $scope.register = function (user) {
        dataService.registerUser(user).then(function () {
            $('.createContainer').toggleClass('hidden');
            $('.createUserForm').trigger("reset");
            dataService.getIdentityEmployees().then(function (response) {
                $scope.data = response.data;
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
                $scope.data = response.data;
            });
        });
    };

    $scope.init();
};
userTableCtrl.$inject = ['$scope', '$http', 'dataService'];

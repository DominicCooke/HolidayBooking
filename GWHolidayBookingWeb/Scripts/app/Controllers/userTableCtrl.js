userTableCtrl = function ($scope, $http) {

    $scope.init = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:57068/api/Employee/GetIdentityEmployees'
        }).success(function (response) {
            $scope.data = response;
        });
        $http({
            method: "GET",
            url: "http://localhost:57068/api/Employee/GetIdentityRoles"
        }).success(function (response) {
            $scope.roles = response;
        });
    }

    $scope.delete = function () {

    };

    $scope.update = function (user, employee) {
        $http({
            url: "http://localhost:57068/api/Employee/Update",
            method: "POST",
            data: user
        }).success(function(data, status, headers, config) {
        });
    };

    $scope.create = function () {

    };

    $scope.init();
};
userTableCtrl.$inject = ['$scope', '$http'];

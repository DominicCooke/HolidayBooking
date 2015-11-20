userTableCtrl = function ($scope, $http) {

    $scope.init = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:57068/api/Employee/GetIdentityEmployees'
        }).success(function (response) {
            $scope.data = response;
        });
    };

    $scope.delete = function () {

    };

    $scope.update = function (user, employee) {
        $http({
            url: "http://localhost:57068/api/Employee/Update",
            method: "POST",
            data: user
        }).success(function (data, status, headers, config) {
        });
    };

    $scope.create = function () {
        $scope.inserted = {
            FirstName: '',
            LastName: '',
            EmailAddress: ''
        };
        $scope.data.push($scope.inserted);
    };

    $scope.init();
};
userTableCtrl.$inject = ['$scope', '$http'];

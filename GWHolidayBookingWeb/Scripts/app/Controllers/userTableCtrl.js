userTableCtrl = function ($scope, $http) {

    $scope.init = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:57068/api/Employee/GetIdentityEmployees'
        }).success(function (response) {
            $scope.data = response;
        }).error(function (data, status) {

        });
    };

    $scope.delete = function (user) {
        $http({
            url: "http://localhost:57068/api/Employee/Delete",
            method: "POST",
            data: { StaffId: user.StaffId, IdentityId: user.UserViewModel.IdentityId }
        }).success(function () {
            $scope.init();
        });
    };

    $scope.register = function (user) {
        $http({
            url: "http://localhost:57068/api/Employee/Register",
            method: "POST",
            data: user
        }).success(function() {
            $('.createContainer').toggleClass('hidden');
            $('.createUserForm').trigger("reset");
            $scope.init();
        });
    };

    $scope.update = function (user, employee) {
        $http({
            url: "http://localhost:57068/api/Employee/Update",
            method: "POST",
            data: user
        });
    };

    $scope.showCreate = function () {
        $('.createContainer').toggleClass('hidden');
    };

    $scope.init();
};
userTableCtrl.$inject = ['$scope', '$http'];

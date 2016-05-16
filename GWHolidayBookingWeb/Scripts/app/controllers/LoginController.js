LoginController = function ($scope, loginService, authService, userService, viewService, $timeout) {
    "use strict";
    $scope.login = function () {
        authService.authenticateAccount($scope.username, $scope.password)
            .then(function (result) {
                if (result.data == true) {
                    loginService.setLoginStatus(true);
                    userService.setUser();
                } else {
                    $(".alert").show();
                    $("#password").val("");
                };
            });
    };
};
LoginController.$inject = ["$scope", "loginService", "authService", "userService", "viewService",  "$timeout"];
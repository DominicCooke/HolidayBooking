MainController = function ($scope, viewService, loginService, userService, $timeout) {
    "use strict";
    var childScope;

    init();

    function init() {
        $scope.$on("loggedIn",
            function () {
                $scope.loginStatus = loginService.getLoginStatus();
                var user = userService.getUser();
                $scope.role = user.RoleName.toLowerCase();
                $scope.loggedInUsername = user.FirstName + " " + user.LastName;
                $scope.navigate("EmployeeCalendar");
            });
        $timeout(function () {
            if (loginService.checkLoginStatus()) {
                userService.setUser();
                loginService.setLoginStatus(true);
            } else {
                defaultViews();
            }
        });
    };

    function defaultViews() {
        viewService.gotoView($scope, views.Login);
        $scope.loginStatus = loginService.getLoginStatus();
    };

    $scope.logOut = function () {
        loginService.setLoginStatus(false);
        defaultViews();
    };

    $scope.navigate = function (nameOfLink) {
        if (typeof childScope !== "undefined")
            childScope.$destroy();

        $(".bodyContainer").empty();
        childScope = $scope.$new();
        viewService.gotoView(childScope, views[nameOfLink]);
        $scope.setMenuLinkActive(nameOfLink);

        if (nameOfLink === "EmployeeCalendar")
            userService.refreshUser();
    };

};
MainController.$inject = ["$scope", "viewService", "loginService", "userService", "$timeout"];
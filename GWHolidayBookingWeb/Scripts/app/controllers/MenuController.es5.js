"use strict";

MenuController = function($scope, viewService, tokenService, userService) {
    "use strict";
    var childScope;

    init();

    function init() {
        defaultViews();
        $scope.$on("loggedIn",
            function() {
                $scope.loginStatus = tokenService.getLoginStatus();
                var user = userService.employeeGetById();
                $scope.role = user.RoleName.toLowerCase();
                $scope.loggedInUsername = user.FirstName + " " + user.LastName;
                $scope.navigate("EmployeeCalendar");
            });
    };

    function defaultViews() {
        viewService.menuGotoView($scope, views.Menu, ".side-bar-menu");
        viewService.gotoView($scope, views.Login);
        $scope.loginStatus = tokenService.getLoginStatus();
    };

    $scope.logOut = function() {
        tokenService.setToken("", false);
        defaultViews();
    };

    $scope.navigate = function(nameOfLink) {
        if (typeof childScope !== "undefined") childScope.$destroy();

        $(".bodyContainer").empty();
        childScope = $scope.$new();
        viewService.gotoView(childScope, views[nameOfLink]);
        //$scope.setMenuLinkActive(nameOfLink);

        if (nameOfLink === "EmployeeCalendar") userService.refreshUser();
    };
};
MenuController.$inject = ["$scope", "viewService", "tokenService", "userService"];
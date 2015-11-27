MenuController = function ($scope, viewService, tokenService, userService) {
    'use strict';
    var childScope;
    function init() {
        defaultViews();
        $scope.$on("loggedIn", function () {
            $scope.loginStatus = tokenService.getLoginStatus();
            var user = userService.employeeGetById();
            $scope.role = user.RoleName.toLowerCase();
            $scope.loggedInUsername = user.FirstName + ' ' + user.LastName;
            $scope.navigate('EmployeeCalendar');
        });
    };

    function defaultViews()
    {
        viewService.menuGotoView($scope, views.Menu, '.side-bar-menu');
        viewService.gotoView($scope, views.Login);
        $scope.loginStatus = tokenService.getLoginStatus();
    };

    $scope.logOut = function () {
        tokenService.setToken('', false);
        defaultViews();
    };

    $scope.navigate = function (nameOfLink) {
        if (typeof $scope.state === "undefined")
            $scope.state = "New";
        if ($scope.state == "New") {
            $scope.state = 'Old';
            childScope = $scope.$new();
            viewService.gotoView(childScope, views[nameOfLink]);
        } else {
            childScope.$destroy();
            $('.bodyContainer').empty();
            $scope.state = "New";
            $scope.navigate(nameOfLink);
        }
        var clickFrom = angular.element(document.getElementsByClassName("active"));
        clickFrom.removeClass();
        var clickTo = angular.element(document.getElementById(nameOfLink));
        clickTo.addClass("active");
    };

    init();
};
MenuController.$inject = ['$scope', 'viewService', 'tokenService', 'userService'];
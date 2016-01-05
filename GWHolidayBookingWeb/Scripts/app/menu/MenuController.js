MenuController = function($scope, viewService, tokenService, userService) {
    "use strict";
    var childScope;

    function init() {
        defaultViews();
        $scope.$on("loggedIn", function() {
            $scope.loginStatus = tokenService.getLoginStatus();
            var user = userService.employeeGetById();
            $scope.role = user.RoleName.toLowerCase();
            $scope.loggedInUsername = user.FirstName + " " + user.LastName;
            $scope.navigate("EmployeeCalendar");

            $('.menu-toggle').click(function() {
                $('.mainContainer').toggleClass('minimized');
                if ($('.menu-toggle').hasClass('fa-caret-square-o-left')) {
                    $('.menu-toggle').removeClass('fa-caret-square-o-left');
                    $('.menu-toggle').addClass('fa-caret-square-o-right');
                } else {
                    $('.menu-toggle').removeClass('fa-caret-square-o-right');
                    $('.menu-toggle').addClass('fa-caret-square-o-left');
                }

            });
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
        if (typeof $scope.state === "undefined")
            $scope.state = "New";
        if ($scope.state === "New") {
            $scope.state = "Old";
            childScope = $scope.$new();
            viewService.gotoView(childScope, views[nameOfLink]);
        } else {
            childScope.$destroy();
            $(".bodyContainer").empty();
            $scope.state = "New";
            $scope.navigate(nameOfLink);
        }
        if (nameOfLink !== "Link") {
            var allMenuLinks = $(".menuLink");
            var targetMenuLink = $("#" + nameOfLink);
            allMenuLinks.css("pointer-events", "all");
            targetMenuLink.css("pointer-events", "none");
            allMenuLinks.removeClass("active");
            targetMenuLink.addClass("active");
        }
        if (nameOfLink === "EmployeeCalendar") {
            userService.refreshUser();
        }
    };

    init();
};
MenuController.$inject = ["$scope", "viewService", "tokenService", "userService"];
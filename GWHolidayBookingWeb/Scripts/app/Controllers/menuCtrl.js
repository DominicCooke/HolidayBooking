menuCtrl = function ($scope, viewService, $rootScope) {
    var childScope;
    var init = function () {
        viewService.gotoView($scope, views.Menu, '#menu');
        viewService.gotoView($scope, views.Dashboard);
    };
    init();
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
    }
};
menuCtrl.$inject = ['$scope', 'viewService', '$rootScope'];

menuCtrl = function($scope, viewService) {
    var childScope;

    function init() {
        viewService.menuGotoView($scope, views.Menu, '.side-bar-menu');
        viewService.gotoView($scope, views.Dashboard);
    };

    $scope.navigate = function(nameOfLink) {
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
menuCtrl.$inject = ['$scope', 'viewService'];
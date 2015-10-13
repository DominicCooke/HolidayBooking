menuCtrl = function ($scope, viewService) {
    var init = function () {
        viewService.gotoView($scope, views.Menu, 'div#menu');
        viewService.gotoView($scope, views.Dashboard);
    };
    init();
    $scope.navigate = function (nameOfLink) {
        viewService.gotoView($scope, views[nameOfLink]);

        var clickFrom = angular.element(document.getElementsByClassName("active"));
        clickFrom.removeClass();
        var clickTo = angular.element(document.getElementById(nameOfLink));
        clickTo.addClass("active");
    }
};
menuCtrl.$inject = ['$scope', 'viewService'];

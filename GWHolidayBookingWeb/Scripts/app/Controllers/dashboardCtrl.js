dashboardCtrl = function ($scope) {
    var init = function () {
        $scope.labels = ["Entitlement", "Planned", "Taken"];
        $scope.data = [21, 2, 2];
    };
    init();
};
dashboardCtrl.$inject = ['$scope'];

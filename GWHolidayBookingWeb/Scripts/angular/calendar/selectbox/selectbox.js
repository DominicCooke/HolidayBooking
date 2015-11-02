selectboxDirective = function (dataService) {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/selectboxTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            $scope.isSelect = function (id) {
                dataService.getUserById(id).then(function (response) {
                    $scope.userHolidayBookings = response.data;
                    $scope.initData([$scope.userHolidayBookings]);
                    $scope.userHolidayBookings.isVisible = !$scope.userHolidayBookings.isVisible;
                });
            }
        }
    }
};
selectboxDirective.$inject = ['dataService'];


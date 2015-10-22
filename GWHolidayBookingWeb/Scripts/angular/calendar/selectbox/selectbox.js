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
                    $scope.HolidayDays = response.data;
                    $scope.initData([$scope.HolidayDays]);
                    $scope.HolidayDays.isVisible = !$scope.HolidayDays.isVisible;
                });
            }
        }
    }
};
selectboxDirective.$inject = ['dataService'];


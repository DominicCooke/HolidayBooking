selectboxDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/selectboxTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            $scope.isSelect = function (member) {
                var teamHolidays = $scope.teamHolidays;
                for (var i = 0; i < teamHolidays.length; i++) {
                    if (teamHolidays[i].Name == member) {
                        teamHolidays[i].isVisible = !teamHolidays[i].isVisible;
                        $scope.HolidayDays = teamHolidays[i];
                        return;
                    }
                }
            }
        }
    };

};
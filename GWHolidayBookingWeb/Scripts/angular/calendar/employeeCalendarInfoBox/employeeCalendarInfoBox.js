employeeCalendarInfoBoxDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/employeeCalendarInfoBoxTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            $scope.$watch('userHolidayBookings', function () {
                var pendingCount = 0, confirmedCount = 0, cancelledCount = 0;
                if (typeof $scope.userHolidayBookings !== "undefined") {
                    var holidayBookings = $scope.userHolidayBookings.HolidayBookings;
                    for (var i = 0; i < holidayBookings.length; i++) {
                        if (holidayBookings[i].BookingStatus == 0) {
                            pendingCount++;
                        } else if (holidayBookings[i].BookingStatus == 1) {
                            confirmedCount++;
                        } else {
                            cancelledCount++;
                        }
                    }
                    $scope.infoBoxDaysPending = pendingCount;
                    $scope.infoBoxDaysConfirmed = confirmedCount;
                    $scope.infoBoxDaysCancelled = cancelledCount;
                    $scope.infoBoxDaysRemaining = $scope.userHolidayBookings.RemainingAllowance;
                    $scope.infoBoxName = $scope.userHolidayBookings.FirstName + " " + $scope.userHolidayBookings.LastName;
                }
            }, true);

        }
    };
};
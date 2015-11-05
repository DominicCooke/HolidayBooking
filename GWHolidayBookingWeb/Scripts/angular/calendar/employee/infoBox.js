infoBoxDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/employee/employeeCalendarInfoBoxTemplate.html",
        controller: 'calendarCtrl',
        scope: true,
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
                    $scope.infoBoxDays = { Pending: pendingCount, Confirmed: confirmedCount, Cancelled: cancelledCount, Remaining: $scope.userHolidayBookings.RemainingAllowance, Name: $scope.userHolidayBookings.FirstName + " " + $scope.userHolidayBookings.LastName }
                }
            }, true);

        }
    };
};
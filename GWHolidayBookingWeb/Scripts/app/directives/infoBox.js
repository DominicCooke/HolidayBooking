infoBoxDirective = function() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/components/employeeCalendarInfoBoxTemplate.html",
        controller: "CalendarController",
        scope: true,
        link: function($scope) {
            // watches the users holiday booking array and updates the info box based on the details of the users holidays (such as remaining holiday)
            $scope.$watch("userHolidayBookings", function() {
                var pendingCount = 0, confirmedCount = 0, cancelledCount = 0;
                if (typeof $scope.userHolidayBookings !== "undefined") {
                    var holidayBookings = $scope.userHolidayBookings.HolidayBookings;
                    for (var i = 0; i < holidayBookings.length; i++) {
                        if (holidayBookings[i].BookingStatus === 0) {
                            pendingCount++;
                        } else if (holidayBookings[i].BookingStatus === 1) {
                            confirmedCount++;
                        } else {
                            cancelledCount++;
                        }
                    }
                    $scope.infoBoxDays = { Pending: pendingCount, Confirmed: confirmedCount, Cancelled: cancelledCount, Remaining: $scope.userHolidayBookings.RemainingAllowance, Name: $scope.userHolidayBookings.FirstName + " " + $scope.userHolidayBookings.LastName };
                }
            }, true);

        }
    };
};
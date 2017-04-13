tooltipDirective = function(templates) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "CalendarController",
        scope: false,
        link: function($scope) {

            $scope.checkIsFound = function(isFoundState) {
                $scope.isFoundValue = null;
                if (isFoundState === "checked") {
                    $scope.isFoundValue = "checked";
                } else if (isFoundState === "pending") {
                    $scope.isFoundValue = "pending";
                } else if (isFoundState === "cancelled") {
                    $scope.isFoundValue = "cancelled";
                }
            };

            $scope.getHolidayAmount = function(holidayCount) {
                $scope.HolidayAmount = holidayCount;
            };

            // populates the tooltip with whether or not the team member has a holiday request on a given date
            function checkHowManyHolidaysAreOnEachDay(date) {
                var employeeWithHolidayNames = [];
                var employeeWithHolidayCount = 0;
                var employeeWithHolidayCountConfirmed = 0;
                for (var j = 0; j < $scope.listOfTeamMembers.length; j++) {
                    var teamNameEntry = { 'name': $scope.listOfTeamMembers[j], 'isFoundState': "crossed" };
                    employeeWithHolidayNames.push(teamNameEntry);
                }
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                        if (tUHB[i].HolidayBookings[k].StartDate.isSame(date, "day")) {
                            employeeWithHolidayCount++;
                            if (tUHB[i].HolidayBookings[k].BookingStatus === 0) {
                                employeeWithHolidayNames[i].isFoundState = "pending";
                            } else if (tUHB[i].HolidayBookings[k].BookingStatus === 1) {
                                employeeWithHolidayNames[i].isFoundState = "checked";
                                employeeWithHolidayCountConfirmed++;
                            } else {
                                employeeWithHolidayNames[i].isFoundState = "cancelled";
                            }
                        }
                    }
                }
                return {
                    allCount: employeeWithHolidayCount,
                    names: employeeWithHolidayNames,
                    confirmedCount: employeeWithHolidayCountConfirmed
                };
            }

            // shows the tooltip and gathers the required info on the day that is being hovered upon
            $scope.showTooltip = function(e, day) {
                var countAndNamesOfEmployeesWithHolidayOnDate = checkHowManyHolidaysAreOnEachDay(day.date);
                if (day.isTeamHoliday === false || countAndNamesOfEmployeesWithHolidayOnDate.allCount === 0) {
                    $scope.tooltipIsVisible = false;
                    return;
                }
                $scope.tooltipIsVisible = true;
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;
                $scope.holidayConfirmCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.confirmedCount;
                $scope.holidayCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.allCount;
                $scope.holidayEmployeeNamesTooltip = countAndNamesOfEmployeesWithHolidayOnDate.names;
            };

            // moves the tooltip
            $scope.moveTooltip = function(e) {
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;
            };

            // hides the tooltip
            $scope.hideTooltip = function() {
                $scope.tooltipIsVisible = false;
            };
        }
    };
};
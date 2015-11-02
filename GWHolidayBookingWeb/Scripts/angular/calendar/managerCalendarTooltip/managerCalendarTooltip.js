managerCalendarTooltipDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/managerCalendarTooltipTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            $scope.checkIsFound = function (isFoundState) {
                $scope.isFoundValue = "null";
                if (isFoundState == "checked")
                    $scope.isFoundValue = "checked";
                else if (isFoundState == "pending")
                    $scope.isFoundValue = "pending";
                else if (isFoundState == "cancelled")
                    $scope.isFoundValue = "cancelled";

            }

            $scope.getHolidayAmount = function (holidayCount) {
                $scope.HolidayAmount = holidayCount;
            }

            $scope.checkHowManyHolidaysAreOnEachDay = function (date) {
                var employeeWithHolidayNames = [];
                var employeeWithHolidayCount = 0;

                for (var j = 0; j < $scope.listOfTeamMembers.length; j++) {
                    var teamNameEntry = { 'name': $scope.listOfTeamMembers[j], 'isFoundState': "crossed" };
                    employeeWithHolidayNames.push(teamNameEntry);
                }
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                        if (tUHB[i].HolidayBookings[k].StartDate.isSame(date, 'day')) {
                            employeeWithHolidayCount++;
                            if (tUHB[i].HolidayBookings[k].BookingStatus == "0") {
                                employeeWithHolidayNames[i].isFoundState = "pending";
                            } else if (tUHB[i].HolidayBookings[k].BookingStatus == "1") {
                                employeeWithHolidayNames[i].isFoundState = "checked";
                            } else {
                                employeeWithHolidayNames[i].isFoundState = "cancelled";
                            }
                        }
                    }
                }
                return { count: employeeWithHolidayCount, names: employeeWithHolidayNames }
            }

            $scope.showTooltip = function (e, day) {
                countAndNamesOfEmployeesWithHolidayOnDate = $scope.checkHowManyHolidaysAreOnEachDay(day.date);
                day.isTeamHoliday = $scope.isTeamHoliday(day.date);
                if (day.isTeamHoliday == false || countAndNamesOfEmployeesWithHolidayOnDate.count == 0) {
                    $scope.tooltipIsVisible = false;
                    return;
                }

                $scope.tooltipIsVisible = true;
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;

                $scope.holidayCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.count;
                $scope.holidayEmployeeNamesTooltip = countAndNamesOfEmployeesWithHolidayOnDate.names;
            }

            $scope.moveTooltip = function (e) {
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;
            }

            $scope.hideTooltip = function () {
                $scope.tooltipIsVisible = false;
            }
        }
    };

};
tooltipDirective = function (templates) {
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'calendarCtrl',
        scope: false,
        link: function ($scope) {
            $scope.checkIsFound = function (isFoundState) {
                $scope.isFoundValue = null;
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
                        if (tUHB[i].HolidayBookings[k].StartDate.isSame(date, 'day')) {
                            employeeWithHolidayCount++;
                            if (tUHB[i].HolidayBookings[k].BookingStatus == "0") {
                                employeeWithHolidayNames[i].isFoundState = "pending";
                            } else if (tUHB[i].HolidayBookings[k].BookingStatus == "1") {
                                employeeWithHolidayNames[i].isFoundState = "checked";
                                employeeWithHolidayCountConfirmed++;
                            } else {
                                employeeWithHolidayNames[i].isFoundState = "cancelled";
                            }
                        }
                    }
                }
                return { allCount: employeeWithHolidayCount, names: employeeWithHolidayNames, confirmedCount: employeeWithHolidayCountConfirmed }
            }

            $scope.showTooltip = function (e, day) {
                countAndNamesOfEmployeesWithHolidayOnDate = checkHowManyHolidaysAreOnEachDay(day.date);
                if (day.isTeamHoliday == false || countAndNamesOfEmployeesWithHolidayOnDate.allCount == 0) {
                    $scope.tooltipIsVisible = false;
                    return;
                }

                $scope.tooltipIsVisible = true;
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;

                $scope.holidayVisibleCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.confirmedCount;
                $scope.holidayCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.allCount;
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
tooltipDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/tooltipTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            $scope.checkIsFound = function (isFoundState) {
                $scope.isFoundValue = "crossed";
                if (isFoundState == "checked")
                    $scope.isFoundValue = "checked";
                else if (isFoundState == "pending")
                    $scope.isFoundValue = "pending";

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

                for (var i = 0; i < $scope.TeamHolidays.length; i++) {
                    for (var k = 0; k < $scope.TeamHolidays[i].HolidayBookings.length; k++) {
                        if ($scope.TeamHolidays[i].isVisible == true) {
                            if ($scope.TeamHolidays[i].HolidayBookings[k].StartDate.isSame(date)) {
                                employeeWithHolidayCount++;
                                if ($scope.TeamHolidays[i].HolidayBookings[k].BookingStatus == "0") {
                                    employeeWithHolidayNames[i].isFoundState = "pending";
                                } else {
                                    employeeWithHolidayNames[i].isFoundState = "checked";
                                }
                            }

                        }
                    }
                }
                return { count: employeeWithHolidayCount, names: employeeWithHolidayNames }
            }

            $scope.showTooltip = function (e, day) {
                if ($scope.mode == "manager") {
                    countAndNamesOfEmployeesWithHolidayOnDate = $scope.checkHowManyHolidaysAreOnEachDay(day.date);
                    day.isTeamHoliday = $scope.isTeamHoliday(day.date);
                    if (day.isPublicHoliday == true || day.isTeamHoliday == false || countAndNamesOfEmployeesWithHolidayOnDate.count == 0) {
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
            }

            $scope.moveTooltip = function (e) {
                if ($scope.mode == "manager") {
                    var left = e.clientX + 40 + "px";
                    var top = e.clientY + "px";
                    var divTooltip = $(".hoverTooltip")[0];
                    divTooltip.style.left = left;
                    divTooltip.style.top = top;
                }
            }

            $scope.hideTooltip = function () {
                $scope.tooltipIsVisible = false;
            }
        }
    };

};
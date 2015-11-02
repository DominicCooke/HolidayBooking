calendarDirective = function (templates) {
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'calendarCtrl',
        $scope: false,
        link: function ($scope) {
            $scope.select = function (date) {
                $scope.selected = date;
                if ($scope.editMode == true) {
                    if ($scope.isStatusHoliday(date, 0) == true || $scope.isStatusHoliday(date, 1) == true || $scope.isStatusHoliday(date, 2) == true) {
                        var isFound = true;
                    }
                    var hB = $scope.userHolidayBookings.HolidayBookings;
                    if (isFound == true) {
                        for (var i = 0; i < hB.length; i++) {
                            if (hB[i].StartDate.isSame(date, "day")) {
                                if (hB[i].BookingStatus == 0) {
                                    hB.splice(i, 1);
                                    $scope.userHolidayBookings.RemainingAllowance++;
                                } else if (hB[i].BookingStatus == 1) {
                                    hB[i].BookingStatus = 2;
                                } else if (hB[i].BookingStatus == 2) {
                                    hB[i].BookingStatus = 1;
                                }
                            }
                        }
                    } else {
                        $scope.userHolidayBookings.RemainingAllowance--;
                        // add an hour to reflect the time zone GMT +1
                        var sDate, eDate;
                        sDate = date.clone().add(1, 'h'),
                            eDate = date.clone().add(1, 'h'),
                            hB.push(
                            {
                                StartDate: sDate,
                                EndDate: eDate,
                                AllowanceDays: 1,
                                BookingStatus: 0,
                                HolidayId: 0
                            });
                    }
                    $scope.reloadCalendar();
                }
            };

            $scope.next = function () {
                var next = $scope.month.clone();
                _removeTime(next.month(next.month() + 1).date(0));
                $scope.month.month($scope.month.month() + 1);
                _buildMonth($scope, next, $scope.month);
            };

            $scope.previous = function () {
                var previous = $scope.month.clone();
                _removeTime(previous.month(previous.month() - 1).date(0));
                $scope.month.month($scope.month.month() - 1);
                _buildMonth($scope, previous, $scope.month);
            };

            $scope.isStatusHoliday = function (date, state) {
                var isFound = false;
                if ($scope.userHolidayBookings.isVisible == true) {
                    var hB = $scope.userHolidayBookings.HolidayBookings;
                    for (var k = 0; k < hB.length; k++) {
                        if (hB[k].StartDate.isSame(date, 'day')) {
                            if (hB[k].BookingStatus == state) {
                                isFound = true;
                                break;
                            }
                        }
                    }
                }
                return isFound;
            };

            $scope.isPublicHoliday = function (date) {
                var isFound;
                for (var i = 0; i < $scope.publicHolidays.days.length; i++) {
                    if ($scope.publicHolidays.days[i].isSame(date, 'day')) {
                        isFound = true;
                        break;
                    } else {
                        isFound = false;
                    }
                }
                return isFound;
            };

            $scope.isTeamHoliday = function (date) {
                var isFound = false;
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    var tHB = tUHB[i].HolidayBookings;
                    for (var k = 0; k < tHB.length; k++) {
                        if (tHB[k].StartDate.isSame(date, 'day')) {
                            return true;
                        }
                    }
                }
                return isFound;
            };

            $scope.isPendingHolidayRequestTeam = function (date) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                        if (tUHB[i].isVisible == true) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, 'day')) {
                                if (tHB.BookingStatus == 0) {
                                    return true;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                }
                return false;
            };

            $scope.isCancelledHolidayRequestTeam = function (date) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                        if (tUHB[i].isVisible == true) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, 'day')) {
                                if (tHB.BookingStatus == 2) {
                                    return true;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                }
                return false;
            };

            $scope.isWeekend = function (date) {
                var dayNumber = date.day();
                if (dayNumber == 6 || dayNumber == 0) {
                    return true
                } else {
                    return false
                }
            };

            $scope.isTeamHolidayAndPopulatesHolidayCount = function (date) {
                var holidayCount = 0;
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                        if (tUHB[i].isVisible == true) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, 'day')) {
                                holidayCount++;
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                if (holidayCount > 5)
                    holidayCount = 5;
                if (holidayCount > 0)
                    return holidayCount;
            };

            $scope.reloadCalendar = function () {
                $scope.month = $scope.selected.clone();
                var start = $scope.selected.clone();
                start.date(-3);
                _removeTime(start.day(0));
                _buildMonth($scope, start, $scope.month);
            };

            $scope.reloadCalendar();

            $scope.$watch('teamUserHolidayBookings', function () {
                $scope.reloadCalendar();
            }, true);

            $scope.$watch('userHolidayBookings', function () {
                $scope.reloadCalendar();
            }, true);
        }
    };

    function _removeTime(date) {
        return date.day(1).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth($scope, start, month) {
        $scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            $scope.weeks.push({ days: _buildWeek($scope, date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek($scope, date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            if ($scope.mode == "manager") {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    isPublicHoliday: $scope.isPublicHoliday(date),
                    isWeekend: $scope.isWeekend(date),
                    date: date,
                    isPendingHoliday: $scope.isPendingHolidayRequestTeam(date),
                    isCancelledHoliday: $scope.isCancelledHolidayRequestTeam(date),
                    holidayCount: $scope.isTeamHolidayAndPopulatesHolidayCount(date)
                });
            } else {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    isPublicHoliday: $scope.isPublicHoliday(date),
                    isWeekend: $scope.isWeekend(date),
                    date: date,
                    isConfirmedHoliday: $scope.isStatusHoliday(date, 1),
                    isCancelledHoliday: $scope.isStatusHoliday(date, 2),
                    isPendingHoliday: $scope.isStatusHoliday(date, 0)
                });
            }
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
};
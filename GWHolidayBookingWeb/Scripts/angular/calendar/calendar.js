calendarDirective = function (templates) {
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        $scope: false,
        link: function ($scope) {
            $scope.month = $scope.selected.clone();
            var start = $scope.selected.clone();
            start.date(-3);
            _removeTime(start.day(0));
            _buildMonth($scope, start, $scope.month);

            $scope.select = function (date) {

                $scope.selected = date;
                if ($scope.editMode == true) {
                    if ($scope.isStatusHoliday(date, 0) == true || $scope.isStatusHoliday(date, 1) == true || $scope.isStatusHoliday(date, 2) == true)
                        var isFound = true;
                    var holidayBookings = $scope.HolidayDays.HolidayBookings;
                    if (isFound == true) {
                        for (var i = 0; i < holidayBookings.length; i++) {
                            if (holidayBookings[i].StartDate.isSame(date)) {
                                if (holidayBookings[i].BookingStatus == 0) {
                                    holidayBookings.splice(i, 1);
                                    $scope.HolidayDays.RemainingAllowance++;
                                } else if (holidayBookings[i].BookingStatus == 1) {
                                    holidayBookings[i].BookingStatus = 2;
                                } else if (holidayBookings[i].BookingStatus == 2) {
                                    holidayBookings[i].BookingStatus = 1;
                                }
                            }
                        }
                    } else {
                        $scope.HolidayDays.RemainingAllowance--;
                        holidayBookings.push(
                        {
                            StartDate: date,
                            EndDate: date,
                            AllowanceDays: 1,
                            BookingStatus: 0
                        });
                    }
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
                var holidayBookings = $scope.HolidayDays.HolidayBookings;
                for (var k = 0; k < holidayBookings.length; k++) {
                    if (holidayBookings[k].StartDate.isSame(date))
                        if (holidayBookings[k].BookingStatus == state) {
                            isFound = true;
                            break;
                        }
                }
                return isFound;
            }

            $scope.isPublicHoliday = function (date) {
                var isFound;
                for (var i = 0; i < $scope.publicHolidays.days.length; i++) {
                    if ($scope.publicHolidays.days[i].isSame(date)) {
                        isFound = true;
                        break;
                    } else
                        isFound = false;
                }
                return isFound;
            }

            $scope.isTeamHoliday = function (date) {
                var isFound = false;
                var teamHolidays = $scope.teamHolidays;
                for (var i = 0; i < teamHolidays.length; i++) {
                    var teamHolidaybookings = $scope.teamHolidays[i].HolidayBookings;
                    for (var k = 0; k < teamHolidaybookings.length; k++) {
                        if (teamHolidaybookings[k].StartDate.isSame(date)) {
                            isFound = true;
                        }
                    }
                }
                return isFound;
            }

            $scope.isWeekend = function (date) {
                var dayNumber = date.day();
                if (dayNumber == 6 || dayNumber == 0)
                    return true
                else
                    return false
            }
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
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
};
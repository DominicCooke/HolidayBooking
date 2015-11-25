calendarDirective = function (templates, $timeout, userService) {
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'calendarCtrl',
        scope: false,
        link: function ($scope) {
            $scope.select = function (date) {
                $scope.selected = date;
                if ($scope.editMode == true) {
                    if (isStatusHoliday(date, 0) == true || isStatusHoliday(date, 1) == true || isStatusHoliday(date, 2) == true) {
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
                    $scope.reloadCalendar(true);
                    $scope.teamHolidayCount();
                }
            };

            $scope.next = function () {
                var next = $scope.month.clone();
                removeTime(next.month(next.month() + 1).date(0));
                $scope.month.month($scope.month.month() + 1);
                buildMonth($scope, next, $scope.month);
                $scope.selected = $scope.month.clone();
                $scope.teamHolidayCount();
            };

            $scope.previous = function () {
                var previous = $scope.month.clone();
                removeTime(previous.month(previous.month() - 1).date(0));
                $scope.month.month($scope.month.month() - 1);
                buildMonth($scope, previous, $scope.month);
                $scope.selected = $scope.month.clone();
                $scope.teamHolidayCount();
            };

            function isWeekend(date) {
                var dayNumber = date.day();
                if (dayNumber == 6 || dayNumber == 0) {
                    return true;
                } else {
                    return false;
                }
            };

            function isTeamHolidayAndPopulatesHolidayCount(date) {
                var holidayCount = 0;
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].isVisible == true) {
                        for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, 'day') && tHB.BookingStatus == 1) {
                                holidayCount++;
                                break;
                            }

                        }
                    }
                }
                if (holidayCount > 0) {
                    return holidayCount;
                }
            };

            function isStatusHoliday(date, state) {
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

            function isPublicHoliday(date) {
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

            function isStatusHolidayTeam(date, state) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].isVisible == true) {
                        for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, 'day')) {
                                if (tHB.BookingStatus == state) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };

            function removeTime(date) {
                return date.day(1).hour(0).minute(0).second(0).millisecond(0);
            }

            function buildMonth($scope, start, month) {
                $scope.weeks = [];
                var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
                while (!done) {
                    $scope.weeks.push({ days: buildWeek($scope, date.clone(), month) });
                    date.add(1, "w");
                    done = count++ > 2 && monthIndex !== date.month();
                    monthIndex = date.month();
                }
            }

            function buildWeek($scope, date, month) {
                var days = [];
                for (var i = 0; i < 7; i++) {
                    if ($scope.mode == "manager") {
                        days.push({
                            name: date.format("dd").substring(0, 1),
                            number: date.date(),
                            isCurrentMonth: date.month() === month.month(),
                            isToday: date.isSame(new Date(), "day"),
                            isPublicHoliday: isPublicHoliday(date),
                            isWeekend: isWeekend(date),
                            date: date,
                            isPendingHoliday: isStatusHolidayTeam(date, 0),
                            isCancelledHoliday: isStatusHolidayTeam(date, 2),
                            holidayCount: isTeamHolidayAndPopulatesHolidayCount(date)
                        });
                    } else {
                        days.push({
                            name: date.format("dd").substring(0, 1),
                            number: date.date(),
                            isCurrentMonth: date.month() === month.month(),
                            isToday: date.isSame(new Date(), "day"),
                            isPublicHoliday: isPublicHoliday(date),
                            isWeekend: isWeekend(date),
                            date: date,
                            isConfirmedHoliday: isStatusHoliday(date, 1),
                            isCancelledHoliday: isStatusHoliday(date, 2),
                            isPendingHoliday: isStatusHoliday(date, 0),
                            holidayCount: isTeamHolidayAndPopulatesHolidayCount(date)
                        });
                    }
                    date = date.clone();
                    date.add(1, "d");
                }
                return days;
            }

            $scope.teamHolidayCount = function () {
                $timeout(function () {
                    $('.day').each(function (index) {
                        var holidayCount = $(this)[0].getAttribute('amountofholiday');
                        var isFound = false;
                        for (var i = 0; i <= holidayCount; i++) {
                            if ($(this).hasClass("employeeCalendar")) {
                                className = "teamHolidayEmployee" + i;
                            } else {
                                className = "teamHoliday" + i;
                            }
                            if ($(this).hasClass(className)) {
                                isFound = true;
                                $(this).children(".confirmedHolidayCount").text(holidayCount);
                                if ($(this).children(".confirmedHolidayCount").css("display") == "none") {
                                    $(this).children(".confirmedHolidayCount").fadeIn("slow");
                                }
                                break;
                            }
                        }
                    });
                });
            };

            $scope.reloadCalendar = function (mode) {
                if (mode == true) {
                    var start = $scope.month.clone();
                } else {
                    $scope.month = $scope.selected.clone();
                    var start = $scope.selected.clone();
                }
                start.date(-3);
                removeTime(start.day(0));
                buildMonth($scope, removeTime(start.endOf('month')), $scope.month);
            };

            function init() {
                if ($scope.mode == "employee") {
                    $scope.userHolidayBookings = userService.getUser();
                    $scope.initData([$scope.userHolidayBookings]);
                    $scope.userHolidayBookings.isVisible = !$scope.userHolidayBookings.isVisible;
                };
                $scope.reloadCalendar();
            };

            init();
        }
    };
};
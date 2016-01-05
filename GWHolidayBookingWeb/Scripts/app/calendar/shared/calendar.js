calendarDirective = function(templates, $timeout, userService) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "CalendarController",
        scope: false,
        link: function($scope) {

            // triggered when the user has selected a day on the calendar
            // checks whether or not the calendar is in edit mode, and then checks what state the day the user has chosen is in
            // creates a row in the changes table so the user can track the changes that they have made
            $scope.select = function(date) {
                $scope.selected = date;
                var pending = 0;
                var confirmed = 1;
                var cancelled = 2;
                if ($scope.editMode === true) {
                    var isFound;
                    if (isStatusHoliday(date, pending) === true || isStatusHoliday(date, confirmed) === true || isStatusHoliday(date, cancelled) === true) {
                        isFound = true;
                    }
                    var hB = $scope.userHolidayBookings.HolidayBookings;
                    if (isFound === true) {
                        for (var i = 0; i < hB.length; i++) {
                            if (hB[i].StartDate.isSame(date, "day")) {
                                if (hB[i].BookingStatus === pending) {
                                    hB.splice(i, 1);
                                    $scope.userHolidayBookings.RemainingAllowance++;
                                    changeTableCreate(date, "Unbook Holiday");
                                } else if (hB[i].BookingStatus === confirmed) {
                                    hB[i].BookingStatus = cancelled;
                                    changeTableCreate(date, "Cancel Holiday");
                                } else if (hB[i].BookingStatus === cancelled) {
                                    hB[i].BookingStatus = confirmed;
                                    changeTableCreate(date, "Uncancel Holiday");
                                }
                            }
                        }
                    } else {
                        $scope.userHolidayBookings.RemainingAllowance--;
                        // add an hour to reflect the time zone GMT +1
                        var sDate = date.clone().add(1, "h");
                        var eDate = date.clone().add(1, "h");
                        hB.push(
                        {
                            StartDate: sDate,
                            EndDate: eDate,
                            AllowanceDays: 1,
                            BookingStatus: pending,
                            HolidayId: 0
                        });
                        changeTableCreate(date, "Book Holiday");
                    }
                    $scope.reloadCalendar(true);
                    $scope.teamHolidayCount();
                }
            };

            // changes the calendar to the next month
            $scope.next = function() {
                var next = $scope.month.clone();
                removeTime(next.month(next.month() + 1).date(0));
                $scope.month.month($scope.month.month() + 1);
                buildMonth($scope, next, $scope.month);
                $scope.selected = $scope.month.clone();
                $scope.teamHolidayCount();
            };

            // changes the calendar to the previous month
            $scope.previous = function() {
                var previous = $scope.month.clone();
                removeTime(previous.month(previous.month() - 1).date(0));
                $scope.month.month($scope.month.month() - 1);
                buildMonth($scope, previous, $scope.month);
                $scope.selected = $scope.month.clone();
                $scope.teamHolidayCount();
            };

            // checks whether the change is already in the table, in which case it removes the entry from the table.
            // otherwise the new row is slid down using a method.
            function changeTableCreate(date, state) {
                var push = true;
                $scope.changes.forEach(function(entry) {
                    var duplicateIndex = $scope.changes.indexOf(entry);
                    if (entry.dateChange.isSame(date, "day")) {
                        push = false;
                        $scope.changes.splice(duplicateIndex, 1);
                    }
                });
                if (push) {
                    $scope.changes.push({ dateChange: date, stateChange: state });
                    $timeout(function() {
                        $scope.slideDownChangesContainerTableRow();
                    });
                }
            };

            // checks whether a date is a weekend
            function isWeekend(date) {
                var dayNumber = date.day();
                if (dayNumber === 6 || dayNumber === 0) {
                    return true;
                } else {
                    return false;
                }
            };

            // checks how many holidays have been picked on a certain date
            function isTeamHolidayAndPopulatesHolidayCount(date) {
                var holidayCount = 0;
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].isVisible === true) {
                        for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, "day") && tHB.BookingStatus === 1) {
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

            // generic check of if a date is a state
            function isStatusHoliday(date, state) {
                var isFound = false;
                if ($scope.userHolidayBookings.isVisible === true) {
                    var hB = $scope.userHolidayBookings.HolidayBookings;
                    for (var k = 0; k < hB.length; k++) {
                        if (hB[k].StartDate.isSame(date, "day")) {
                            if (hB[k].BookingStatus === state) {
                                isFound = true;
                                break;
                            }
                        }
                    }
                }
                return isFound;
            };

            // checks if a date is a public holiday
            function isPublicHoliday(date) {
                var isFound;
                for (var i = 0; i < $scope.publicHolidays.length; i++) {
                    if ($scope.publicHolidays[i].Date.isSame(date, "day")) {
                        isFound = true;
                        break;
                    } else {
                        isFound = false;
                    }
                }
                return isFound;
            };

            // checks if a date is a holiday within any of the team members holidays
            function isStatusHolidayTeam(date, state) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].isVisible === true) {
                        for (var k = 0; k < tUHB[i].HolidayBookings.length; k++) {
                            var tHB = tUHB[i].HolidayBookings[k];
                            if (tHB.StartDate.isSame(date, "day")) {
                                if (tHB.BookingStatus === state) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };

            // strips a moment of its time and leaves it with just the day
            function removeTime(date) {
                return date.day(1).hour(0).minute(0).second(0).millisecond(0);
            }

            // creates as many weeks as needed and bundles them into a month
            function buildMonth(scope, start, month) {
                scope.weeks = [];
                var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
                while (!done) {
                    scope.weeks.push({ days: buildWeek(scope, date.clone(), month) });
                    date.add(1, "w");
                    done = count++ > 2 && monthIndex !== date.month();
                    monthIndex = date.month();
                }
            }

            // builds each week of the calendar, and populates the days with the classes that represent if they're a pending holiday etc
            function buildWeek(scope, date, month) {
                var days = [];
                for (var i = 0; i < 7; i++) {
                    if (scope.mode === "manager") {
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

            // iterates over all of the days in the calendar, and updates the mini-preview of how many team members have booked for each day
            $scope.teamHolidayCount = function() {
                $timeout(function() {
                    $(".day").each(function(index) {
                        var holidayCount = $(this)[0].getAttribute("amountofholiday");
                        for (var i = 0; i <= holidayCount; i++) {
                            var className;
                            if ($(this).hasClass("employeeCalendar")) {
                                className = "teamHolidayEmployee" + i;
                            } else {
                                className = "teamHoliday" + i;
                            }
                            if ($(this).hasClass(className)) {
                                $(this).children(".confirmedHolidayCount").text(holidayCount);
                                if ($(this).children(".confirmedHolidayCount").css("display") === "none") {
                                    $(this).children(".confirmedHolidayCount").fadeIn("fast");
                                }
                                break;
                            }
                        }
                    });
                });
            };

            // reloads the calendar which has the effect of resetting all the classes on the days
            $scope.reloadCalendar = function(mode) {
                var start;
                if (mode === true) {
                    start = $scope.month.clone();
                } else {
                    $scope.month = $scope.selected.clone();
                    start = $scope.selected.clone();
                }
                start.date(-3);
                removeTime(start.day(0));
                buildMonth($scope, removeTime(start.endOf("month")), $scope.month);
            };

            // initializes on creation of a calendar, if the mode is employee then the users holidays are retrieved from the database 
            // the data is then initialized (turning the dates into moment etc) and then the holiday is made visible
            // otherwise the calendar is just loaded
            function init() {
                if ($scope.mode === "employee") {
                    $scope.userHolidayBookings = userService.employeeGetById();
                    $scope.initData([$scope.userHolidayBookings]);
                    $scope.userHolidayBookings.isVisible = true;
                };
                $scope.reloadCalendar();
            };

            init();
        }
    };
};
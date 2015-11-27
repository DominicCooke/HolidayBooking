///#source 1 1 /Scripts/app/calendar/employee/infoBox.js
infoBoxDirective = function () {
    'use strict';
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/calendar/employee/infoBox.html",
        controller: 'CalendarController',
        scope: true,
        link: function($scope) {
            $scope.$watch('userHolidayBookings', function() {
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
                    $scope.infoBoxDays = { Pending: pendingCount, Confirmed: confirmedCount, Cancelled: cancelledCount, Remaining: $scope.userHolidayBookings.RemainingAllowance, Name: $scope.userHolidayBookings.FirstName + " " + $scope.userHolidayBookings.LastName };
                }
            }, true);

        }
    };
};
///#source 1 1 /Scripts/app/calendar/shared/tooltip.js
tooltipDirective = function (templates) {
    'use strict';
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'CalendarController',
        scope: false,
        link: function($scope) {
            $scope.checkIsFound = function(isFoundState) {
                $scope.isFoundValue = null;
                if (isFoundState == "checked")
                    $scope.isFoundValue = "checked";
                else if (isFoundState == "pending")
                    $scope.isFoundValue = "pending";
                else if (isFoundState == "cancelled")
                    $scope.isFoundValue = "cancelled";

            };
            $scope.getHolidayAmount = function(holidayCount) {
                $scope.HolidayAmount = holidayCount;
            };

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
                return { allCount: employeeWithHolidayCount, names: employeeWithHolidayNames, confirmedCount: employeeWithHolidayCountConfirmed };
            }

            $scope.showTooltip = function(e, day) {
                var countAndNamesOfEmployeesWithHolidayOnDate = checkHowManyHolidaysAreOnEachDay(day.date);
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
                $scope.holidayConfirmCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.confirmedCount;
                $scope.holidayCountTooltip = countAndNamesOfEmployeesWithHolidayOnDate.allCount;
                $scope.holidayEmployeeNamesTooltip = countAndNamesOfEmployeesWithHolidayOnDate.names;
            };
            $scope.moveTooltip = function(e) {
                var left = e.clientX + 40 + "px";
                var top = e.clientY + "px";
                var divTooltip = $(".hoverTooltip")[0];
                divTooltip.style.left = left;
                divTooltip.style.top = top;
            };
            $scope.hideTooltip = function() {
                $scope.tooltipIsVisible = false;
            };
        }
    };
};
///#source 1 1 /Scripts/app/calendar/shared/calendar.js
calendarDirective = function (templates, $timeout, userService) {
    'use strict';
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'CalendarController',
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
                                var className = "teamHolidayEmployee" + i;
                            } else {
                                var className = "teamHoliday" + i;
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
///#source 1 1 /Scripts/app/calendar/shared/calendarControls.js
calendarControlsDirective = function (dataService, templates) {
    'use strict';
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'CalendarController',
        scope: false,
        link: function ($scope) {

            $scope.$watch('tabHolidays', function () {
                if ($scope.mode == "manager") {
                    if (typeof $scope.tabHolidays !== "undefined") {
                        $('.tabTableHeaderRow').removeClass('hidden');
                        if ($scope.tabHolidays.TabHolidays.length == 0) {
                            $('.tabTableHeaderRow').addClass('hidden');
                        } else {
                            if ($scope.tabHolidays.TypeOfHoliday == 0) {
                                $('.pendingHolidayRow').show();
                            } else if ($scope.tabHolidays.TypeOfHoliday == 2) {
                                $('.cancelledHolidayRow').show();
                            }
                        }
                    } else {
                        $('.tabTableHeaderRow').addClass('hidden');
                    }
                }
            }, true);

            $scope.$watch('teamUserHolidayBookings', function () {
                if ($scope.mode == "manager") {
                    if (typeof $scope.teamUserHolidayBookings !== "undefined") {
                        var tUHB = $scope.teamUserHolidayBookings;
                        var pendingCount = 0, cancelledCount = 0;
                        for (var i = 0; i < tUHB.length; i++) {
                            pendingCount = pendingCount + tUHB[i].PendingHolidays;
                            cancelledCount = cancelledCount + tUHB[i].CancelledHolidays;
                        }
                        $scope.pendingNotificationCount = pendingCount;
                        $scope.cancelledNotificationCount = cancelledCount;
                        if (pendingCount == 0) {
                            $('.notification-counter-pending').hide();
                        } else {
                            $('.notification-counter-pending').show();
                        }
                        if (cancelledCount == 0) {
                            $('.notification-counter-cancelled').hide();
                        } else {
                            $('.notification-counter-cancelled').show();
                        }
                    }
                }
            }, true);

            $scope.isChecked = function(event) {
                var optionChecked = event.target.getAttribute('value');
                toggleClass(event.target, "active");
                setTeamSelected(optionChecked, event);
                $scope.reloadCalendar();
                $scope.teamHolidayCount();
            };

            $scope.populateTableCounts = function(user) {
                var pendingCount = 0;
                var confirmedCount = 0;
                var cancelledCount = 0;
                var hB = user.HolidayBookings;
                for (var i = 0; i < hB.length; i++) {
                    if (hB[i].BookingStatus == 0) {
                        pendingCount++;
                    } else if (hB[i].BookingStatus == 1)
                        confirmedCount++;
                    else {
                        cancelledCount++;
                    }
                }
                user.PendingHolidays = pendingCount;
                user.ConfirmedHolidays = confirmedCount;
                user.CancelledHolidays = cancelledCount;
            };

            $scope.addScrollBar = function() {
                jQuery('.subTableBody').scrollbar();
                jQuery('.subTabTableBody').scrollbar();
            };

            $scope.formatDate = function(date) {
                var dateObject = date.toObject();
                var dateMoment = moment(dateObject);
                var formattedDate = dateMoment.format("dddd, MMMM Do YYYY");
                return formattedDate;
            };

            $scope.tabHolidayAction = function(date, staffId, typeOfHoliday, action) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].StaffId == staffId) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].StartDate.isSame(date, 'day') && tUHB[i].StaffId == staffId) {
                                var tH = $scope.tabHolidays;
                                for (var k = 0; k < tH.TabHolidays.length; k++) {
                                    if (tH.TabHolidays[k].StaffId == tUHB[i].StaffId && tH.TabHolidays[k].HolidayDate == tUHB[i].HolidayBookings[j]) {
                                        tH.TabHolidays.splice(k, 1);
                                    }
                                }
                                if (action == "accept") {
                                    if (tUHB[i].HolidayBookings[j].BookingStatus == 0) {
                                        tUHB[i].HolidayBookings[j].BookingStatus = 1;
                                    } else {
                                        tUHB[i].HolidayBookings.splice(j, 1);
                                        tUHB[i].RemainingAllowance++;
                                    }
                                } else {
                                    if (tUHB[i].HolidayBookings[j].BookingStatus == 0) {
                                        tUHB[i].HolidayBookings.splice(j, 1);
                                        tUHB[i].RemainingAllowance++;
                                    } else {
                                        tUHB[i].HolidayBookings[j].BookingStatus = 1;
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.reloadCalendar();
                $scope.teamHolidayCount();
            };

            $scope.tabHolidaySelect = function(staffId, typeOfHoliday) {
                var tUHB = $scope.teamUserHolidayBookings;
                var tabHolidays = [];
                for (var i = 0; i < tUHB.length; i++) {
                    tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings, function(Booking) { return Booking.StartDate; });
                    if (tUHB[i].StaffId == staffId) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].BookingStatus == typeOfHoliday) {
                                tabHolidays.push({
                                    StaffId: staffId,
                                    HolidayDate: tUHB[i].HolidayBookings[j],
                                    TypeOfHoliday: typeOfHoliday
                                });
                            }
                        }
                    }
                }
                $scope.tabHolidays = {
                    TabHolidays: tabHolidays,
                    TypeOfHoliday: typeOfHoliday
                };
            };

            function setTeamSelected(userOptionChecked, event) {
                var allSelected = false;
                var teamMembers = $('.teamMember');
                var tUHB = $scope.teamUserHolidayBookings;
                if (userOptionChecked == "all") {
                    if (event.target.classList.contains("active")) {
                        allSelected = true;
                    }
                    for (var j = 0; j < teamMembers.length; j++) {
                        toggleClass(teamMembers[j], "dead");
                    }
                    for (var i = 0; i < tUHB.length; i++) {
                        tUHB[i].isVisible = allSelected;
                    }
                } else {
                    for (var i = 0; i < tUHB.length; i++) {
                        if (tUHB[i].StaffId == userOptionChecked) {
                            tUHB[i].isVisible = !tUHB[i].isVisible;
                        }
                    }
                }
            };

            function toggleClass(element, className) {
                if (!element.classList.contains(className)) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                    element.classList.remove("active");
                }
            };
        }
    };
};
calendarControlsDirective.$inject = ['dataService', 'templates'];

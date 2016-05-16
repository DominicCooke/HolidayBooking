infoBoxDirective = function() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/components/employeeCalendarInfoBoxTemplate.html",
        controller: "CalendarController",
        scope: true,
        link: function($scope) {

            // watches the users holiday booking array and updates the info box based on the details of the users holidays (such as remaining holiday)
            $scope.$watch("userHolidayBookings",
                function() {
                    if (typeof $scope.userHolidayBookings !== "undefined") {
                        var pendingCount = 0, confirmedCount = 0, cancelledCount = 0;
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
                        $scope.infoBoxDays = {
                            Pending: pendingCount,
                            Confirmed: confirmedCount,
                            Cancelled: cancelledCount,
                            Remaining: $scope.userHolidayBookings.RemainingAllowance,
                            Name: $scope.userHolidayBookings.FirstName + " " + $scope.userHolidayBookings.LastName
                        };
                    }
                },
                true);

        }
    };
};
calendarDirective = function(templates, $timeout, userService, helperService, dataService) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "CalendarController",
        scope: false,
        link: function($scope) {
            init();

            // initializes on creation of a calendar, if the mode is employee then the users holidays are retrieved from the database 
            // the data is then initialized (turning the dates into moment etc) and then the holiday is made visible
            function init() {
                dataService.publicHolidaysGet()
                    .then(function(listOfPublicHolidays) {
                        listOfPublicHolidays.data.forEach(function(publicHoliday) {
                            publicHoliday.Date = moment(publicHoliday.Date, "YYYY-MM-DD-Z");
                        });
                        $scope.publicHolidays = listOfPublicHolidays.data;
                        $scope.selected = moment();

                        if ($scope.mode === "employee") {
                            $scope.userHolidayBookings = userService.getUser();
                            $scope.teamName = $scope.userHolidayBookings.TeamName;
                            $scope.initData($scope.userHolidayBookings);
                            $scope.userHolidayBookings.isVisible = true;

                            dataService.employeesGetTeam($scope.userHolidayBookings.TeamId)
                                .then(function(response) {
                                    $scope.teamUserHolidayBookings = response.data;
                                    $scope.initData($scope.teamUserHolidayBookings);
                                    $scope.reloadCalendar();
                                });
                        };

                        if ($scope.mode === "manager") {
                            dataService.employeesGet()
                                .then(function(response) {
                                    $scope.teamUserHolidayBookings = response.data;
                                    $scope.initData($scope.teamUserHolidayBookings);
                                    $scope.reloadCalendar();
                                });
                            dataService.teamsGet()
                                .then(function(response) {
                                    $scope.teams = response.data;
                                });
                        };
                    });
            };

            // triggered when the user has selected a day on the calendar
            // checks whether or not the calendar is in edit mode, and then checks what state the day the user has chosen is in
            // creates a row in the changes table so the user can track the changes that they have made
            $scope.select = function(date) {
                $scope.selected = date;
                var pending = 0;
                var confirmed = 1;
                var cancelled = 2;
                var hB = $scope.userHolidayBookings.HolidayBookings;
                if ($scope.editMode === true &&
                (isStatusHoliday(date, pending) === true ||
                    isStatusHoliday(date, confirmed) === true ||
                    isStatusHoliday(date, cancelled) === true)) {
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
                        HolidayId: helperService.guid()
                    });
                    changeTableCreate(date, "Book Holiday");
                }
                $scope.reloadCalendar(true);
                $scope.teamHolidayCount();
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
            // otherwise the new row is slid down using the slideDownChangesContainerTableRow method.
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
                    $(".day")
                        .each(function(index) {
                            var holidayCount = $(this)[0].getAttribute("amountofholiday");
                            if (holidayCount > 0) {
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
                                            //$(this).children(".confirmedHolidayCount").css("display", "inline");
                                            $(this).children(".confirmedHolidayCount").fadeIn();
                                        }
                                        break;
                                    }
                                }
                            };
                        });
                });
            };

            // reloads the calendar which has the effect of resetting all the classes on the days, if mode is set to false then the calendar is reset without centering on the current day
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
        }
    };
};
calendarControlsDirective = function(templates, $timeout, dataService) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "CalendarController",
        scope: false,
        link: function($scope) {

            // watches the user changes table and hides it if there aren't any changes pending, but otherwise shows it if there are outstanding changes.
            $scope.$watch("changes",
                function() {
                    if ($scope.mode === "employee") {
                        if (typeof $scope.changes !== "undefined") {
                            var changesContainer = $(".changesContainer");
                            if ($scope.changes.length === 0) {
                                $scope.hideChanges(changesContainer);
                            } else {
                                if (changesContainer.is(":hidden") || changesContainer.hasClass("hiding")) {
                                    changesContainer.clearQueue()
                                        .stop()
                                        .animate({ height: "show" }, 600);
                                }
                            }
                        }
                    }
                },
                true);

            // watches the team holiday bookings array and updates the notification divs based on whether or not there are pending requests
            $scope.$watch("teamUserHolidayBookings",
                function() {
                    if ($scope.mode === "manager") {
                        if (typeof $scope.teamUserHolidayBookings !== "undefined") {
                            var tUHB = $scope.teamUserHolidayBookings;
                            var pendingCount = 0, cancelledCount = 0;
                            for (var i = 0; i < tUHB.length; i++) {
                                pendingCount = pendingCount + tUHB[i].PendingHolidays;
                                cancelledCount = cancelledCount + tUHB[i].CancelledHolidays;
                            }
                            $scope.pendingNotificationCount = pendingCount;
                            $scope.cancelledNotificationCount = cancelledCount;
                            if (pendingCount === 0) {
                                $(".notification-counter-pending").hide();
                            } else {
                                $(".notification-counter-pending").show();
                            }
                            if (cancelledCount === 0) {
                                $(".notification-counter-cancelled").hide();
                            } else {
                                $(".notification-counter-cancelled").show();
                            }
                        }
                    }
                },
                true);

            $scope.hideChanges = function(container, callback) {
                container.addClass("hiding")
                    .clearQueue()
                    .animate({ height: "hide" },
                        600,
                        function() {
                            $(this).hide();
                            $(this).removeClass("hiding");
                            if (callback) {
                                callback();
                            }
                        });
            };

            // submits the changes that the user has made and hides the submit related divs
            $scope.acceptChanges = function() {
                if ($scope.mode === "employee") {
                    $scope.submitHolidaySingleEmployee();
                } else {
                    $scope.submitTeamUsersData();
                }
                $scope.toggleSubmitStatus();
            };

            // slides the last row in the changes table downwards and shows it
            $scope.slideDownChangesContainerTableRow = function() {
                var lastRow = $(".tableBody.changes").children("tbody").children("tr:last");
                lastRow.children(".tableCellAction")
                    .wrapInner('<div class="td-slider fa fa-times" style="display:none;"/>');
                lastRow.removeClass("hidden")
                    .children(".tableCell.default")
                    .wrapInner('<div class="td-slider" style="display:none;"/>');
                lastRow.children("td")
                    .children(".td-slider")
                    .clearQueue()
                    .stop()
                    .animate({ height: "show", padding: "3px" }, 700);
            };

            // slides the corresponding row in the changes table upwards and hides it
            $scope.slideUpChangesContainerTableRow = function(event, date) {
                var selectedRow = $(event.target).parent("td").parent("tr");
                $(selectedRow)
                    .children("td")
                    .children(".td-slider")
                    .clearQueue()
                    .stop()
                    .animate({ height: "hide", padding: "0" },
                        700,
                        function() {
                            var cellIndex = this.parentNode.cellIndex;
                            if (cellIndex == 0) {
                                $scope.select(date);
                            }
                        });
            };

            $scope.toggleEditMode = function(e) {
                $scope.editMode = !$scope.editMode;
                $(e.target).toggleClass("active");
            };

            $scope.updateFilter = function() {
                if (this.selection === "") {
                    dataService.employeesGet()
                        .then(function(response) {
                            $scope.teamUserHolidayBookings = response.data;
                            $scope.initData($scope.teamUserHolidayBookings);
                            filterHelper();
                        });
                } else {
                    dataService.employeesGetTeam(this.selection)
                        .then(function(response) {
                            $scope.teamUserHolidayBookings = response.data;
                            $scope.initData($scope.teamUserHolidayBookings);
                            filterHelper();
                        });
                };
            };

            function filterHelper() {
                $timeout(function() {
                    $(".allPeople").addClass("selected");
                    setTeamSelected("all", null, true);
                    $scope.reloadCalendar(true);
                    $scope.teamHolidayCount();
                });
            };

            $scope.toggleSubmitStatus = function() {
                var acceptSlider = $(".acceptSlider");
                var acceptText = $(".acceptText");
                var declineSlider = $(".declineSlider");
                var declineText = $(".declineText");
                var submitText = $(".submitText");

                acceptSlider.toggleClass("active");
                declineSlider.toggleClass("active");
                submitText.toggleClass("active");
                acceptText.clearQueue().stop();
                declineText.clearQueue().stop();
                acceptText.fadeToggle(800);
                declineText.fadeToggle(800);
            };

            // triggered when the user has clicked a team member/all in the first column of the controls table
            $scope.teamMemberSelected = function(event) {
                var optionChecked = event.target.getAttribute("value");
                $(event.target).toggleClass("selected");
                setTeamSelected(optionChecked, event);
                $scope.reloadCalendar(true);
                $scope.teamHolidayCount();
            };

            // gathers the information on each team members holidays
            $scope.populateTableCounts = function(teamMember) {
                var pendingCount = 0;
                var confirmedCount = 0;
                var cancelledCount = 0;
                var hB = teamMember.HolidayBookings;
                for (var i = 0; i < hB.length; i++) {
                    if (hB[i].BookingStatus === 0) {
                        pendingCount++;
                    } else if (hB[i].BookingStatus === 1)
                        confirmedCount++;
                    else {
                        cancelledCount++;
                    }
                }
                teamMember.PendingHolidays = pendingCount;
                teamMember.ConfirmedHolidays = confirmedCount;
                teamMember.CancelledHolidays = cancelledCount;
            };

            // adds a scroll bar to the table, called upon when it has finished initializing
            $scope.addScrollBar = function() {
                jQuery(".scrollBar").scrollbar();
            };

            // formats the a moment date into one of three formats
            $scope.formatDate = function(date, type) {
                if (typeof date !== "undefined") {
                    var dateObject = date.toObject();
                    var dateMoment = moment(dateObject);
                    if (type === 1) {
                        return dateMoment.format("dddd, MMM Do YYYY");
                    } else if (type === 2) {
                        return dateMoment.format("ddd MMM Do YYYY");
                    } else {
                        return dateMoment.format("DMYYYY");
                    }
                }
            };

            // deals with the accepting/declining of holiday requests by managers
            $scope.holidayRequestAction = function(date, staffId, action) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].StaffId === staffId) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].StartDate
                                .isSame(date, "day") &&
                                tUHB[i].StaffId === staffId) {
                                var hR = $scope.holidayRequests;
                                for (var k = 0; k < hR.HolidayRequests.length; k++) {
                                    if (hR.HolidayRequests[k].StaffId === tUHB[i].StaffId &&
                                        hR.HolidayRequests[k].HolidayDate === tUHB[i].HolidayBookings[j]) {
                                        hR.HolidayRequests.splice(k, 1);
                                    }
                                }
                                if (action === "accept") {
                                    if (tUHB[i].HolidayBookings[j].BookingStatus === 0) {
                                        tUHB[i].HolidayBookings[j].BookingStatus = 1;
                                    } else {
                                        tUHB[i].HolidayBookings.splice(j, 1);
                                        tUHB[i].RemainingAllowance++;
                                    }
                                } else {
                                    if (tUHB[i].HolidayBookings[j].BookingStatus === 0) {
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

            // populates the table of holiday requests
            $scope.holidayRequestSelect = function(staffId, typeOfHoliday, e) {
                var teamMemberElement = e.target.parentElement.firstElementChild;
                if ($(e.target).text() > 0) {
                    $(".tableCell").removeClass("clicked");
                    $(e.target).addClass("clicked");
                    if ($(e.target).hasClass("isCancelledHoliday")) {
                        $(e.target).effect("highlight", { color: "rgb(155, 89, 182);" }, 400);
                    } else {
                        $(e.target).effect("highlight", { color: "rgb(52, 152, 219);" }, 400);
                    }

                    $timeout(function() {
                        if (!($(teamMemberElement).hasClass("selected") || $(teamMemberElement).hasClass("all-selected")
                        )) {
                            $(teamMemberElement).trigger("click");
                        }
                    });
                    var tUHB = $scope.teamUserHolidayBookings;
                    var holidayRequests = [];
                    for (var i = 0; i < tUHB.length; i++) {
                        tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings,
                            function(booking) { return booking.StartDate; });
                        if (tUHB[i].StaffId === staffId) {
                            for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                                if (tUHB[i].HolidayBookings[j].BookingStatus === typeOfHoliday) {
                                    holidayRequests.push({
                                        StaffId: staffId,
                                        StaffName: tUHB[i].FirstName + " " + tUHB[i].LastName.charAt(0),
                                        HolidayDate: tUHB[i].HolidayBookings[j],
                                        TypeOfHoliday: typeOfHoliday
                                    });
                                }
                            }
                        }
                    }
                    $scope.holidayRequests = {
                        HolidayRequests: holidayRequests,
                        TypeOfHoliday: typeOfHoliday
                    };
                    var actionsContainer = $(".actionsContainer");
                    if (actionsContainer.is(":hidden") || actionsContainer.hasClass("hiding")) {
                        actionsContainer.clearQueue()
                            .stop()
                            .animate({ height: "show" }, 600);
                    }
                }
            };

            // helper function that triggers classes base on what the user has selected. e.g if the user has selected all then the other cells in the first column are made inactive as they're already active.
            function setTeamSelected(userOptionChecked, event, filter) {
                var teamMembers = $(".teamMember");
                var tUHB = $scope.teamUserHolidayBookings;
                var i;
                if (filter) {
                    teamMembers.addClass("all-selected");
                    teamMembers.removeClass("selected");
                    for (i = 0; i < tUHB.length; i++) {
                        tUHB[i].isVisible = true;
                    }
                } else {
                    var allSelected = false;

                    if (userOptionChecked === "all") {
                        if (event.target.classList.contains("selected")) {
                            allSelected = true;
                        }
                        teamMembers.toggleClass("all-selected");
                        teamMembers.removeClass("selected");
                        for (i = 0; i < tUHB.length; i++) {
                            tUHB[i].isVisible = allSelected;
                        }
                    } else {
                        for (i = 0; i < tUHB.length; i++) {
                            if (tUHB[i].StaffId === userOptionChecked) {
                                tUHB[i].isVisible = !tUHB[i].isVisible;
                            }
                        }
                    }
                }
            };
        }
    };
};
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
managementDirective = function(templates) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "",
        scope: true,
        link: function($scope) {

            $scope.showCreate = function showCreate() {
                $(".createContainer").toggleClass("hidden");
            };

            $scope.resetRegister = function resetRegister() {
                $(".createContainer").toggleClass("hidden");
                $(".createForm").trigger("reset");
            };
        }
    };
};
sideMenuDirective = function(templates) {
    return {
        restrict: "E",
        templateUrl: templates.sideMenu,
        controller: "",
        scope: false,
        link: function($scope) {

            $(".menu-toggle")
                .click(function() {
                    $(".mainContainer").toggleClass("minimized");
                    if ($(".menu-toggle").hasClass("fa-caret-square-o-left")) {
                        $(".menu-toggle").removeClass("fa-caret-square-o-left");
                        $(".menu-toggle").addClass("fa-caret-square-o-right");
                    } else {
                        $(".menu-toggle").removeClass("fa-caret-square-o-right");
                        $(".menu-toggle").addClass("fa-caret-square-o-left");
                    }
                });

            $scope.setMenuLinkActive = function setMenuLinkActive(nameOfLink) {
                var allMenuLinks = $(".menuLink");
                var targetMenuLink = $("#" + nameOfLink);
                allMenuLinks.css("pointer-events", "all");
                targetMenuLink.css("pointer-events", "none");
                allMenuLinks.removeClass("active");
                targetMenuLink.addClass("active");
            };
        }
    };
};
calendarControlsDirective = function (dataService, templates, $timeout) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "CalendarController",
        scope: false,
        link: function ($scope) {

            // watches the tab holidays table and hides it if there aren't any changes pending, but otherwise shows it if there are pending requests.
            $scope.$watch("tabHolidays", function () {
                if ($scope.mode === "manager") {
                    if (typeof $scope.tabHolidays !== "undefined") {
                        $(".tableHeadRow.secondary").removeClass("hidden");
                        if ($scope.tabHolidays.TabHolidays.length === 0) {
                            $(".tableHeadRow.secondary").addClass("hidden");
                        } else {
                            if ($scope.tabHolidays.TypeOfHoliday === 0) {
                                $(".pendingHolidayRow").show();
                            } else if ($scope.tabHolidays.TypeOfHoliday === 2) {
                                $(".cancelledHolidayRow").show();
                            }
                        }
                    } else {
                        $(".tableHeadRow.secondary").addClass("hidden");
                    }
                }
            }, true);

            // watches the user changes table and hides it if there aren't any changes pending, but otherwise shows it if there are outstanding changes.
            $scope.$watch("changes", function () {
                if ($scope.mode === "employee") {
                    if (typeof $scope.changes !== "undefined") {
                        var changesContainer = $(".changesContainer");
                        if ($scope.changes.length === 0) {
                            if (!changesContainer.is(":hidden")) {
                                $scope.hideChanges();
                            }
                        } else {
                            if (changesContainer.is(":hidden") || changesContainer.hasClass("hiding")) {
                                changesContainer.clearQueue()
                                    .stop()
                                    .animate({ "height": "show" }, 600);
                            }
                        }
                    }
                }
            }, true);

            $scope.hideChanges = function (callback) {
                var changesContainer = $(".changesContainer");
                changesContainer.addClass("hiding")
                                .clearQueue()
                                .animate({ "height": "hide" }, 600, function () {
                                    $(this).hide();
                                    $(this).removeClass("hiding")
                                    if (typeof (callback) == "function") {
                                        callback();
                                    }
                                });
            };

            // watches the team holiday bookings array and updates the notification divs based on whether or not there are pending requests
            $scope.$watch("teamUserHolidayBookings", function () {
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
            }, true);

            // slides the last row in the changes table downwards and shows it
            $scope.slideDownChangesContainerTableRow = function () {
                var lastRow = $(".tableBody.changes").children("tbody").children("tr:last");
                lastRow.children(".tableCellAction")
                    .wrapInner('<div class="td-slider fa fa-times" style="display:none;"/>');
                lastRow.removeClass("hidden")
                    .children(".tableCell.default")
                    .wrapInner('<div class="td-slider" style="display:none;"/>');
                lastRow.children("td")
                    .children(".td-slider")
                    .animate({ "height": "show", padding: "3px" }, 700);
            };

            // slides the corresponding row in the changes table upwards and hides it
            $scope.slideUpChangesContainerTableRow = function (event, date) {
                var selectedRow = $(event.target).parent("td").parent("tr");
                $(selectedRow)
                    .children("td")
                    .children(".td-slider")
                    .animate({ "height": "hide", padding: "0" }, 700, function () {
                        var cellIndex = this.parentNode.cellIndex;
                        if (cellIndex == 0) {
                            $scope.select(date);
                        }
                    });
            };

            // submits the changes that the user has made and hides the submit related divs
            $scope.acceptChanges = function () {
                $scope.submitHolidaySingleEmployee();
                $scope.toggleSubmitStatus();
            };

            $scope.toggleSubmitStatus = function () {
                $(".submitText").toggleClass("active");
                $(".acceptSlider").toggleClass("active").children(".acceptText").toggle("slide", 1000);;
                $(".declineSlider").toggleClass("active").children(".declineText").toggle("slide", { direction: "right" }, 1000);;
            };


            // triggered when the user has clicked a team member/all in the first column of the controls table
            $scope.teamMemberSelected = function (event) {
                var optionChecked = event.target.getAttribute("value");
                $(event.target).toggleClass("active");
                setTeamSelected(optionChecked, event);
                $scope.reloadCalendar(true);
                $scope.teamHolidayCount();
            };

            // gathers the information on each team members holidays
            $scope.populateTableCounts = function (teamMember) {
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
            $scope.addScrollBar = function () {
                jQuery(".scrollBar").scrollbar();
            };

            // formats the a moment date into one of three formats
            $scope.formatDate = function (date, type) {
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
            $scope.tabHolidayAction = function (date, staffId, typeOfHoliday, action) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].StaffId === staffId) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].StartDate.isSame(date, "day") && tUHB[i].StaffId === staffId) {
                                var tH = $scope.tabHolidays;
                                for (var k = 0; k < tH.TabHolidays.length; k++) {
                                    if (tH.TabHolidays[k].StaffId === tUHB[i].StaffId && tH.TabHolidays[k].HolidayDate === tUHB[i].HolidayBookings[j]) {
                                        tH.TabHolidays.splice(k, 1);
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
            $scope.tabHolidaySelect = function (staffId, typeOfHoliday, e) {
                var teamMemberElement = e.target.parentElement.firstElementChild;
                if (e.target.innerText > 0) {
                    $(".tableCell").removeClass("clicked");
                    $(e.target).addClass("clicked");
                    $(e.target).effect("highlight", { color: "#2A3F54" }, 500);

                    $timeout(function () {
                        if (!($(teamMemberElement).hasClass("active") || $(teamMemberElement).hasClass("dead"))) {
                            $(teamMemberElement).trigger("click");
                        }
                    });
                    var tUHB = $scope.teamUserHolidayBookings;
                    var tabHolidays = [];
                    for (var i = 0; i < tUHB.length; i++) {
                        tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings, function (booking) { return booking.StartDate; });
                        if (tUHB[i].StaffId === staffId) {
                            for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                                if (tUHB[i].HolidayBookings[j].BookingStatus === typeOfHoliday) {
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
                }
            };

            // helper function that triggers classes base on what the user has selected. e.g if the user has selected all then the other cells in the first column are made inactive as they're already active.
            function setTeamSelected(userOptionChecked, event) {
                var allSelected = false;
                var teamMembers = $(".teamMember");
                var tUHB = $scope.teamUserHolidayBookings;
                var i;
                if (userOptionChecked === "all") {
                    if (event.target.classList.contains("active")) {
                        allSelected = true;
                    }
                    teamMembers.each(function () {
                        $(this).toggleClass("dead");
                    });
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
            };
        }
    };
};
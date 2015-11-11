calendarControlsDirective = function(dataService, templates) {
    return {
        restrict: "E",
        templateUrl: function($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: 'calendarCtrl',
        scope: false,
        link: function($scope) {
            $scope.$watch('tabHolidays', function() {
                if (typeof $scope.tabHolidays !== "undefined") {
                    $('.tabHolidayContainer').show();
                    if (!$scope.tabHolidays.TabHolidays.length == 0 && $scope.tabHolidays.TypeOfHoliday == 0) {
                        $('.pendingHolidayRow').show();
                    }
                    if (!$scope.tabHolidays.TabHolidays.length == 0 && $scope.tabHolidays.TypeOfHoliday == 2) {
                        $('.cancelledHolidayRow').show();
                    };
                } else {
                    $('.tabHolidayContainer').hide();
                }
            }, true);

            $scope.$watch('teamUserHolidayBookings', function() {
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
                $('.teamMemberInfoContainer').slimScroll({
                    height: '35%',
                    alwaysVisible: true,
                    color: 'rgba(255, 255, 255, 0.95)'
                });
                $('.tabHolidayContainer').slimScroll({
                    height: '25%',
                    color: 'rgba(255, 255, 255, 0.95)'
                });
                $('.teamMemberInfoContainerEmployee').slimScroll({
                    height: '27%',
                    alwaysVisible: true,
                    color: 'rgba(255, 255, 255, 0.95)'
                });
            };

            $scope.formatDate = function(date) {
                var dateObject = date.toObject();
                var dateMoment = moment(dateObject);
                var formattedDate = dateMoment.format("dddd, MMMM Do YYYY");
                return formattedDate;
            };

            $scope.tabHolidayAction = function(date, staffNumber, typeOfHoliday, action) {
                var tUHB = $scope.teamUserHolidayBookings;
                for (var i = 0; i < tUHB.length; i++) {
                    if (tUHB[i].StaffNumber == staffNumber) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].StartDate.isSame(date, 'day') && tUHB[i].StaffNumber == staffNumber) {
                                var tH = $scope.tabHolidays;
                                for (var k = 0; k < tH.TabHolidays.length; k++) {
                                    if (tH.TabHolidays[k].StaffNumber == tUHB[i].StaffNumber && tH.TabHolidays[k].HolidayDate == tUHB[i].HolidayBookings[j]) {
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

            $scope.tabHolidaySelect = function(staffNumber, typeOfHoliday) {
                var tUHB = $scope.teamUserHolidayBookings;
                var tabHolidays = [];
                for (var i = 0; i < tUHB.length; i++) {
                    tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings, function(Booking) { return Booking.StartDate; });
                    if (tUHB[i].StaffNumber == staffNumber) {
                        for (var j = 0; j < tUHB[i].HolidayBookings.length; j++) {
                            if (tUHB[i].HolidayBookings[j].BookingStatus == typeOfHoliday) {
                                tabHolidays.push({
                                    StaffNumber: staffNumber,
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
                var teamMembers = $('.person');
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
                        if (tUHB[i].StaffNumber == userOptionChecked) {
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
managerCalendarControlsDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/managerCalendarControlsTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {

            $scope.isChecked = function (event) {
                var optionChecked = event.target.getAttribute('value');
                $scope.toggleClass(event.target, "active");
                $scope.setTeamSelected(optionChecked, event);
            }

            $scope.setTeamSelected = function (userOptionChecked, event) {
                var allSelected = false;
                var teamMembers = $('.person');
                var teamHolidays = $scope.teamHolidays;
                if (userOptionChecked == "all") {
                    if (event.target.classList.contains("active")) {
                        allSelected = true;
                    }
                    for (var j = 0; j < teamMembers.length; j++) {
                        $scope.toggleClass(teamMembers[j], "dead");
                    }
                    for (var i = 0; i < teamHolidays.length; i++) {
                        teamHolidays[i].isVisible = allSelected;
                    }
                } else {
                    for (var i = 0; i < teamHolidays.length; i++) {
                        if (teamHolidays[i].StaffNumber == userOptionChecked) {
                            teamHolidays[i].isVisible = !teamHolidays[i].isVisible;
                        }
                    }
                }
            }
            $scope.toggleClass = function (element, className) {
                if (!element.classList.contains(className)) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                    element.classList.remove("active");
                }
            }

            $scope.populateTableCounts = function (user) {
                var pendingCount = 0;
                var confirmedCount = 0;
                var cancelledCount = 0;
                var holidayBookings = user.HolidayBookings;
                for (var i = 0; i < holidayBookings.length; i++) {
                    if (holidayBookings[i].BookingStatus == 0) {
                        pendingCount++;
                    } else if (holidayBookings[i].BookingStatus == 1)
                        confirmedCount++;
                    else {
                        cancelledCount++;
                    }
                }
                user.PendingHolidays = pendingCount;
                user.ConfirmedHolidays = confirmedCount;
                user.CancelledHolidays = cancelledCount;
            }
            $scope.formatDate = function (date) {
                var dateObject = date.toObject();
                var dateMoment = moment(dateObject);
                var formattedDate = dateMoment.format("dddd, MMMM Do YYYY");
                return formattedDate;
            }

            $scope.pendingHolidayActionAccept = function (date, staffNumber) {
                var teamHolidays = $scope.teamHolidays;
                for (var i = 0; i < teamHolidays.length; i++) {
                    for (var j = 0; j < teamHolidays[i].HolidayBookings.length; j++) {
                        if (teamHolidays[i].HolidayBookings[j].StartDate.isSame(date) && teamHolidays[i].StaffNumber == staffNumber) {
                            teamHolidays[i].HolidayBookings[j].BookingStatus = 1;
                            var pendingHolidays = $scope.tabPendingHolidays;
                            for (var k = 0; k < pendingHolidays.length; k++) {
                                if (pendingHolidays[k].StaffNumber == teamHolidays[i].StaffNumber && pendingHolidays[k].holidayDate == teamHolidays[i].HolidayBookings[j]) {
                                    pendingHolidays.splice(k, 1);
                                }
                            }
                            _.defer(function () { $scope.$apply(); });
                        }
                    }
                }
            }

            $scope.pendingHolidayActionDecline = function (date, staffNumber) {
                var teamHolidays = $scope.teamHolidays;
                for (var i = 0; i < teamHolidays.length; i++) {
                    for (var j = 0; j < teamHolidays[i].HolidayBookings.length; j++) {
                        if (teamHolidays[i].HolidayBookings[j].StartDate.isSame(date) && teamHolidays[i].StaffNumber == staffNumber) {
                            var pendingHolidays = $scope.tabPendingHolidays;
                            teamHolidays[i].RemainingAllowance++;
                            for (var k = 0; k < pendingHolidays.length; k++) {
                                if (pendingHolidays[k].StaffNumber == teamHolidays[i].StaffNumber && pendingHolidays[k].holidayDate == teamHolidays[i].HolidayBookings[j]) {
                                    pendingHolidays.splice(k, 1);
                                }
                            }
                            teamHolidays[i].HolidayBookings.splice(j, 1);
                            _.defer(function () { $scope.$apply(); });

                        }
                    }
                }
            }
            $scope.$watch('tabPendingHolidays', function () {
                if (typeof $scope.tabPendingHolidays !== "undefined") {
                    if ($scope.tabPendingHolidays.length == 0) {
                        $('.pendingHolidayContainer').hide();
                    } else {
                        $('.pendingHolidayContainer').show();
                    }
                }
            }, true);
            $scope.pendingHolidaySelect = function (staffNumber) {
                var teamHolidays = $scope.teamHolidays;
                var pendingHolidays = [];
                for (var i = 0; i < teamHolidays.length; i++) {
                    if (teamHolidays[i].StaffNumber == staffNumber) {
                        for (var j = 0; j < teamHolidays[i].HolidayBookings.length; j++) {
                            if (teamHolidays[i].HolidayBookings[j].BookingStatus == 0) {
                                pendingHolidays.push({
                                    StaffNumber: staffNumber,
                                    holidayDate: teamHolidays[i].HolidayBookings[j]
                                });
                            }
                        }
                    }
                }
                $scope.tabPendingHolidays = pendingHolidays;
            }
        }
    };

};
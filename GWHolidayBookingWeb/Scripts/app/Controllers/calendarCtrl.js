calendarCtrl = function ($scope, dataService, viewService) {
    $scope.init = function (mode) {
        $scope.mode = mode;
        $scope.editMode = false;
        $scope.publicHolidays = {
            days: [
                moment("2015-10-4", "YYYY MM DD"), moment("2015-10-10", "YYYY MM DD"), moment("2015-10-17", "YYYY MM DD"), moment("2015-10-11", "YYYY MM DD"), moment("2015-10-18", "YYYY MM DD"), moment("2015-10-24", "YYYY MM DD")
            ]
        };
        $scope.selected = moment();
        if (mode == 'manager') {
            dataService.getAllUsers().then(function (response) {
                $scope.teamHolidays = response.data;
                $scope.initData($scope.teamHolidays);
                $scope.getListOfTeamMembers($scope.teamHolidays);
                viewService.calendarGoToView($scope, views.CalendarModeManager);
                $scope.tabPendingHolidays = [];
            });
        } else {
            dataService.getUserById(1).then(function (response) {
                $scope.HolidayDays = response.data;
                $scope.initData([$scope.HolidayDays]);
                $scope.HolidayDays.isVisible = !$scope.HolidayDays.isVisible;
                viewService.calendarGoToView($scope, views.CalendarModeEmployee);
                $scope.temporarygetlistofteammembers();
            });
        }

    };

    $scope.temporarygetlistofteammembers = function () {
        dataService.getAllUsers().then(function (response) {
            $scope.teamHolidays = response.data;
            $scope.getListOfTeamMembers($scope.teamHolidays);
        });
    };

    $scope.initData = function (holidayArray) {
        for (var i = 0; i < holidayArray.length; i++) {
            $scope.parseDateTimeToMoment(holidayArray[i].HolidayBookings);
        }
        $scope.unmergeHolidays(holidayArray);
    };

    $scope.unmergeHolidays = function(holidayArray) {
        for (var i = 0; i < holidayArray.length; i++) {
            var count = holidayArray[i].HolidayBookings.length;
            for (var j = 0; j < count; j++) {
                while (holidayArray[i].HolidayBookings[j].StartDate.day() != holidayArray[i].HolidayBookings[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep(holidayArray[i].HolidayBookings[j]);
                    copyOfHolidayBooking.EndDate = moment(copyOfHolidayBooking.EndDate);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    holidayArray[i].HolidayBookings.push(copyOfHolidayBooking);
                    holidayArray[i].HolidayBookings[j].EndDate = holidayArray[i].HolidayBookings[j].EndDate.subtract(1, 'days');
                }

            }
        }
    };

    $scope.setAllowanceDaysOfUnmergedHolidays = function(holidayArray) {
        for (var j = 0; j < holidayArray.HolidayBookings.length; j++) {
            holidayArray.HolidayBookings[j].AllowanceDays = 1;
            //holidayArray.HolidayBookings[j].HolidayId = 0;
        }
    };

    $scope.parseDateTimeToMoment = function(holidayBookingsArray) {
        for (var j = 0; j < holidayBookingsArray.length; j++) {
            var teamHolidayBookings = holidayBookingsArray[j];
            if (typeof teamHolidayBookings.StartDate === "object") {
                teamHolidayBookings.StartDate = moment(teamHolidayBookings.StartDate, "YYYY-MM-DD-Z");
                teamHolidayBookings.EndDate = moment(teamHolidayBookings.EndDate, "YYYY-MM-DD Z");
            } else {
                teamHolidayBookings.StartDate = moment(teamHolidayBookings.StartDate + "-+0000", "YYYY-MM-DD-Z");
                teamHolidayBookings.EndDate = moment(teamHolidayBookings.EndDate + "-+0000", "YYYY-MM-DD Z");
            }

        }
    };

    $scope.$watch('HolidayDays', function () {
        var pendingCount = 0;
        var confirmedCount = 0;
        var cancelledCount = 0;
        if (typeof $scope.HolidayDays !== "undefined") {
            var holidayBookings = $scope.HolidayDays.HolidayBookings;
            for (var i = 0; i < holidayBookings.length; i++) {
                if (holidayBookings[i].BookingStatus == 0)
                    pendingCount++;
                else if (holidayBookings[i].BookingStatus == 1)
                    confirmedCount++;
                else {
                    cancelledCount++;
                }
            }
            $scope.infoBoxDaysPending = pendingCount;
            $scope.infoBoxDaysConfirmed = confirmedCount;
            $scope.infoBoxDaysCancelled = cancelledCount;
            $scope.infoBoxDaysRemaining = $scope.HolidayDays.RemainingAllowance;
        }
    }, true);


    $scope.getListOfTeamMembers = function(holidayArray) {
        var listOfTeamMembers = [];
        for (var i = 0; i < holidayArray.length; i++) {
            listOfTeamMembers.push({
                Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                StaffNumber: holidayArray[i].StaffNumber
            });
        }
        $scope.listOfTeamMembers = listOfTeamMembers;
    };

    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };

    $scope.submitHoliday = function() {
        $scope.HolidayDays.HolidayBookings = _.sortBy($scope.HolidayDays.HolidayBookings, function(Booking) { return Booking.StartDate });
        $scope.setAllowanceDaysOfUnmergedHolidays($scope.HolidayDays);
        var userHolidaysClone = _.cloneDeep($scope.HolidayDays);
        var userHolidaysCloneHolidayBookings = userHolidaysClone.HolidayBookings;
        $scope.parseDateTimeToMoment(userHolidaysCloneHolidayBookings);
        if (userHolidaysCloneHolidayBookings.length > 0) {
            var consolidatedHolidayBookings = $scope.consolidateHolidayBookings(userHolidaysCloneHolidayBookings);
            if (consolidatedHolidayBookings.length > 0) {
                userHolidaysClone.HolidayBookings = consolidatedHolidayBookings;
            }
        }
        userHolidaysClone.isVisible = false;
        dataService.sendUserData(userHolidaysClone);
    };

    $scope.consolidateHolidayBookings = function(holidayBooking) {
        var consolidatedHolidayBookings = [];
        var startFlag = true;
        var test = null;
        while (holidayBooking.length != 1) {
            if (holidayBooking[0].StartDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == true && holidayBooking[0].BookingStatus == holidayBooking[1].BookingStatus) {
                // if [1] in the array is a consecutive day of [0] then
                // set end date of [0] to the start date of [1]
                // remove [1] from the list of holidaybookings
                // set start flag false, as a consolidated holiday booking has started
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                holidayBooking[0].AllowanceDays++;
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
                startFlag = false;
            } else if (holidayBooking[0].EndDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == false && holidayBooking[0].BookingStatus == holidayBooking[1].BookingStatus) {
                // if [1] in the array is a consecutive day of [0] then
                // set end date of [0] to the start date of [1]
                // remove [1] from the list of holidaybookings
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                holidayBooking[0].AllowanceDays++;
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
            } else if (holidayBooking[0].EndDate.day() + 1 == holidayBooking[1].StartDate.day() && holidayBooking[0].BookingStatus != holidayBooking[1].BookingStatus) {
                holidayBooking[1].HolidayId = 0;
                consolidatedHolidayBookings.push(holidayBooking[0]);
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[1]);
                }
                holidayBooking.splice(0, 1);
                startFlag = true;
            } else {
                // if [1] in the array isn't a consecutive day of [0] then
                // push the current consolidated holiday booking to the consolidated array
                // remove it from the array of holiday bookings
                // set start flag true, as a consolidated holiday booking has ended
                if (test == holidayBooking[0].HolidayId) {
                    holidayBooking[0].HolidayId = 0;
                } else {
                    test = holidayBooking[0].HolidayId
                }
                consolidatedHolidayBookings.push(holidayBooking[0]);
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[1]);
                }
                holidayBooking.splice(0, 1);
                startFlag = true;
            }
        }
        return consolidatedHolidayBookings;
    };

};
calendarCtrl.$inject = ['$scope', 'dataService', 'viewService'];

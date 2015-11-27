calendarCtrl = function($scope, dataService, viewService) {
    $scope.init = function(mode) {
        $scope.mode = mode;
        $scope.editMode = false;
        $scope.publicHolidays = {
            days: [
                moment("2015-10-4", "YYYY MM DD"), moment("2015-10-10", "YYYY MM DD"), moment("2015-10-17", "YYYY MM DD"), moment("2015-10-11", "YYYY MM DD"), moment("2015-10-18", "YYYY MM DD"), moment("2015-10-24", "YYYY MM DD")
            ]
        };
        $scope.selected = moment();
        if (mode == 'manager') {
            dataService.employeesGet().then(function(response) {
                $scope.teamUserHolidayBookings = response.data;
                $scope.initData($scope.teamUserHolidayBookings);
                $scope.getListOfTeamMembers($scope.teamUserHolidayBookings);
                viewService.calendarGoToView($scope, views.CalendarModeManager);
                $scope.tabPendingHolidays = [];
            });
        } else {
            dataService.employeesGet().then(function(response) {
                $scope.teamUserHolidayBookings = response.data;
                $scope.initData($scope.teamUserHolidayBookings);
                $scope.getListOfTeamMembers($scope.teamUserHolidayBookings);
                viewService.calendarGoToView($scope, views.CalendarModeEmployee);
            });
        }
    };

    $scope.initData = function(holidayArray) {
        for (var i = 0; i < holidayArray.length; i++) {
            $scope.parseDateTimeToMoment(holidayArray[i].HolidayBookings);
        }
        $scope.unmergeHolidayBookings(holidayArray);
        for (var i = 0; i < holidayArray.length; i++) {
            holidayArray[i].HolidayBookings = _.sortBy(holidayArray[i].HolidayBookings, function(Booking) { return Booking.StartDate; });
        }
    };

    $scope.unmergeHolidayBookings = function(holidayArray) {
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
            holidayArray[i].RemainingAllowance = holidayArray[i].HolidayAllowance - holidayArray[i].HolidayBookings.length;
        }

    };

    $scope.setAllowanceDaysOfUnmergedHolidays = function(holidayArray) {
        for (var j = 0; j < holidayArray.HolidayBookings.length; j++) {
            holidayArray.HolidayBookings[j].AllowanceDays = 1;
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

    $scope.getListOfTeamMembers = function(holidayArray) {
        var listOfTeamMembers = [];
        for (var i = 0; i < holidayArray.length; i++) {
            listOfTeamMembers.push({
                Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                StaffId: holidayArray[i].StaffId
            });
        }
        $scope.listOfTeamMembers = listOfTeamMembers;
    };

    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };

    $scope.submitHolidaySingleEmployee = function() {
        $scope.userHolidayBookings.HolidayBookings = _.sortBy($scope.userHolidayBookings.HolidayBookings, function(Booking) { return Booking.StartDate; });
        $scope.setAllowanceDaysOfUnmergedHolidays($scope.userHolidayBookings);
        var userHolidaysClone = _.cloneDeep($scope.userHolidayBookings);
        var userHolidaysCloneHolidayBookings = userHolidaysClone.HolidayBookings;
        $scope.parseDateTimeToMoment(userHolidaysCloneHolidayBookings);
        if (userHolidaysCloneHolidayBookings.length > 0) {
            var consolidatedHolidayBookings = combineHolidayBookings(userHolidaysCloneHolidayBookings);
            if (consolidatedHolidayBookings.length > 0) {
                userHolidaysClone.HolidayBookings = consolidatedHolidayBookings;
            }
        }
        userHolidaysClone.isVisible = false;
        dataService.employeeUpdateHoliday(userHolidaysClone);
    };

    $scope.submitTeamUsersData = function() {
        var arrayOfTeamUserHolidayBookings = [];
        var tUHB = $scope.teamUserHolidayBookings;
        for (var i = 0; i < tUHB.length; i++) {
            tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings, function(Booking) { return Booking.StartDate; });
            $scope.setAllowanceDaysOfUnmergedHolidays(tUHB[i]);
            var userHolidaysClone = _.cloneDeep(tUHB[i]);
            var userHolidaysCloneHolidayBookings = userHolidaysClone.HolidayBookings;
            $scope.parseDateTimeToMoment(userHolidaysCloneHolidayBookings);
            if (userHolidaysCloneHolidayBookings.length > 0) {
                var consolidatedHolidayBookings = combineHolidayBookings(userHolidaysCloneHolidayBookings);
                if (consolidatedHolidayBookings.length > 0) {
                    userHolidaysClone.HolidayBookings = consolidatedHolidayBookings;
                }
            }
            arrayOfTeamUserHolidayBookings.push(userHolidaysClone);
        }
        dataService.employeesUpdateHolidays(arrayOfTeamUserHolidayBookings).then(function(response) {
            alert("woo");
        });
    };

    function combineHolidayBookings(holidayBooking) {
        var consolidatedHolidayBookings = [];
        var startFlag = true;
        var test = null;
        while (holidayBooking.length != 1) {
            if (holidayBooking[0].StartDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == true && holidayBooking[0].BookingStatus == holidayBooking[1].BookingStatus) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                holidayBooking[0].AllowanceDays++;
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
                startFlag = false;
            } else if (holidayBooking[0].EndDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == false && holidayBooking[0].BookingStatus == holidayBooking[1].BookingStatus) {
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
                if (test == holidayBooking[0].HolidayId) {
                    holidayBooking[0].HolidayId = 0;
                } else {
                    test = holidayBooking[0].HolidayId;
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
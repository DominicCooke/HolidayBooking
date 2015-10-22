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
                $scope.tempthing();
            });
        }

    };
    $scope.tempthing = function () {
        dataService.getAllUsers().then(function (response) {
            $scope.teamHolidays = response.data;
            $scope.getListOfTeamMembers($scope.teamHolidays);
        });
    };
    $scope.initData = function (holidayArray) {
        $scope.parseDateTimeToMoment(holidayArray);
        $scope.unmergeHolidays(holidayArray);
        $scope.parseDateTimeToMoment(holidayArray);

    };
    $scope.unmergeHolidays = function (holidayArray) {
        for (var i = 0; i < holidayArray.length; i++) {
            var count = holidayArray[i].HolidayBookings.length;

            for (var j = 0; j < count; j++) {
                holidayArray[i].HolidayBookings[j].AllowanceDays = 1;
                while (holidayArray[i].HolidayBookings[j].StartDate.day() != holidayArray[i].HolidayBookings[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep(holidayArray[i].HolidayBookings[j]);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    holidayArray[i].HolidayBookings.push(copyOfHolidayBooking);
                    holidayArray[i].HolidayBookings[j].EndDate = holidayArray[i].HolidayBookings[j].EndDate.subtract(1, 'days');
                }
            }
        }
    }

    $scope.parseDateTimeToMoment = function (holidayArray) {

        for (var i = 0; i < holidayArray.length; i++) {
            for (var j = 0; j < holidayArray[i].HolidayBookings.length; j++) {
                var teamHolidayBookings = holidayArray[i].HolidayBookings[j];
                teamHolidayBookings.StartDate = moment(teamHolidayBookings.StartDate);
                teamHolidayBookings.EndDate = moment(teamHolidayBookings.EndDate)
            }
        }
    }

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


    $scope.getListOfTeamMembers = function (holidayArray) {
        var listOfTeamMembers = [];
        for (var i = 0; i < holidayArray.length; i++) {
            listOfTeamMembers.push({
                Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                StaffNumber: holidayArray[i].StaffNumber
            });
        }
        $scope.listOfTeamMembers = listOfTeamMembers;
    }

    $scope.toggleEditMode = function () {
        $scope.editMode = !$scope.editMode;
    }

    $scope.hasPendingHolidayRequestTeam = function (date) {
        var teamHolidays = $scope.teamHolidays;
        for (var i = 0; i < teamHolidays.length; i++) {
            for (var k = 0; k < teamHolidays[i].HolidayBookings.length; k++) {
                if (teamHolidays[i].isVisible == true) {
                    var teamHolidayBookings = $scope.teamHolidays[i].HolidayBookings[k];
                    if (teamHolidayBookings.StartDate.isSame(date)) {
                        if (teamHolidayBookings.BookingStatus == 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    $scope.populateScopeWithHolidayCounts = function (date) {
        $scope.holidayCount = 0;
        var teamHolidays = $scope.teamHolidays;
        for (var i = 0; i < teamHolidays.length; i++) {
            for (var k = 0; k < teamHolidays[i].HolidayBookings.length; k++) {
                if (teamHolidays[i].isVisible == true) {
                    var teamHolidayBookings = $scope.teamHolidays[i].HolidayBookings[k];
                    if (teamHolidayBookings.StartDate.isSame(date)) {
                        $scope.holidayCount++;
                    }
                }
            }
        }
        if ($scope.holidayCount > 5)
            $scope.holidayCount = 5;
        if ($scope.holidayCount > 0)
            return true;
    }
    $scope.submitHoliday = function () {
        $scope.HolidayDays.HolidayBookings = _.sortBy($scope.HolidayDays.HolidayBookings, function (Booking) { return Booking.StartDate });
        var startFlag = true;
        var consolidatedHolidayBookings = [];
        var holidayDays = JSON.parse(JSON.stringify($scope.HolidayDays));
        var holidayBooking = $scope.HolidayDays.HolidayBookings.slice();
        do {
            if (holidayBooking[0].StartDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == true) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
                startFlag = false;
            } else if (holidayBooking[0].EndDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == false) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                if (holidayBooking.length == 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
            } else {
                consolidatedHolidayBookings.push(holidayBooking[0]);
                holidayBooking.splice(0, 1);
                startFlag = true;
            }
        } while (holidayBooking.length != 1)
        holidayDays.HolidayBookings = consolidatedHolidayBookings;
        dataService.sendData(holidayDays).then(function (response) {
            alert("woo");
        });
    }
};
calendarCtrl.$inject = ['$scope', 'dataService', 'viewService'];

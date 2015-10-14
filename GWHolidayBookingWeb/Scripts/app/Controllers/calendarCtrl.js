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
        dataService.getData().then(function (response) {
            $scope.teamHolidays = response.data;
            $scope.parseDateTimeToMoment();
            $scope.unmergeHolidays();
            $scope.parseDateTimeToMoment();
            $scope.getListOfTeamMembers();

            if (mode == 'manager')
                viewService.calendarGoToView($scope, views.CalendarModeManager);
            else {
                viewService.calendarGoToView($scope, views.CalendarModeEmployee);
                $scope.isSelect('John');
            }
        });
    };

    $scope.unmergeHolidays = function () {
        for (var i = 0; i < $scope.teamHolidays.length; i++) {
            var count = $scope.teamHolidays[i].HolidayBookings.length;
            for (var j = 0; j < count; j++) {
                while ($scope.teamHolidays[i].HolidayBookings[j].StartDate.day() != $scope.teamHolidays[i].HolidayBookings[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep($scope.teamHolidays[i].HolidayBookings[j]);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    $scope.teamHolidays[i].HolidayBookings.push(copyOfHolidayBooking);
                    $scope.teamHolidays[i].HolidayBookings[j].EndDate = $scope.teamHolidays[i].HolidayBookings[j].EndDate.subtract(1, 'days');
                }
            }
        }
    }

    $scope.parseDateTimeToMoment = function () {

        for (var i = 0; i < $scope.teamHolidays.length; i++) {
            for (var j = 0; j < $scope.teamHolidays[i].HolidayBookings.length; j++) {
                var teamHolidayBookings = $scope.teamHolidays[i].HolidayBookings[j];
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


    $scope.getListOfTeamMembers = function () {
        var listOfTeamMembers = [];
        for (var i = 0; i < $scope.teamHolidays.length; i++) {
            listOfTeamMembers.push($scope.teamHolidays[i].Name);
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
                if (holidayBooking.length == 2)
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                holidayBooking.splice(1, 1);
                startFlag = false;
            } else if (holidayBooking[0].EndDate.day() + 1 == holidayBooking[1].StartDate.day() && startFlag == false) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                if (holidayBooking.length == 2)
                    consolidatedHolidayBookings.push(holidayBooking[0]);
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

    $scope.resetHoliday = function () {
        $scope.HolidayDays = [];
    }
};
calendarCtrl.$inject = ['$scope', 'dataService', 'viewService'];

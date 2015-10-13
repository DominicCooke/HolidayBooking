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
            $scope.getListOfTeamMembers();

            if (mode == 'manager')
                viewService.calendarGoToView($scope, views.CalendarModeManager);
            else {
                viewService.calendarGoToView($scope, views.CalendarModeEmployee);
                $scope.isSelect('John');
            }
        });
    };

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
        for (var i = 0; i < $scope.HolidayDays.HolidayBookings.length; i++) {
            if ($scope.HolidayDays.HolidayBookings[i].StartDate) {

            }
        }


        dataService.sendData($scope.HolidayDays).then(function (response) {
            alert("woo");
        });
    }

    $scope.resetHoliday = function () {
        $scope.HolidayDays = [];
    }
};
calendarCtrl.$inject = ['$scope', 'dataService', 'viewService'];

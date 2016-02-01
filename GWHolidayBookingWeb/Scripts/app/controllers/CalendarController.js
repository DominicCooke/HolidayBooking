CalendarController = function ($scope, dataService, helperService) {
    "use strict";
    $scope.init = function (mode) {
        $scope.mode = mode;
        $scope.editMode = false;
        $scope.changes = [];
        $scope.tabPendingHolidays = [];
    };

    $scope.initData = function (holidayArray) {
        var i;

        if ($scope.mode == "employee" && typeof holidayArray.length == "undefined") {
            helperService.parseDateTimeToMoment(holidayArray.HolidayBookings);
            helperService.unmergeHolidayBookings(holidayArray.HolidayBookings);
            holidayArray.HolidayBookings = _.sortBy(holidayArray.HolidayBookings, function (booking) { return booking.StartDate; });
        } else {
            for (i = 0; i < holidayArray.length; i++) {
                helperService.parseDateTimeToMoment(holidayArray[i].HolidayBookings);
                helperService.unmergeHolidayBookings(holidayArray[i].HolidayBookings);
                holidayArray[i].HolidayBookings = _.sortBy(holidayArray[i].HolidayBookings, function (booking) { return booking.StartDate; });
            }
        }
    };

    $scope.submitHolidaySingleEmployee = function () {
        $scope.userHolidayBookings.HolidayBookings = _.sortBy($scope.userHolidayBookings.HolidayBookings, function (booking) { return booking.StartDate; });
        helperService.setAllowanceDaysOfUnmergedHolidays($scope.userHolidayBookings);
        var userHolidaysClone = _.cloneDeep($scope.userHolidayBookings);
        var userHolidaysCloneHolidayBookings = userHolidaysClone.HolidayBookings;
        helperService.parseDateTimeToMoment(userHolidaysCloneHolidayBookings);
        if (userHolidaysCloneHolidayBookings.length > 0) {
            var consolidatedHolidayBookings = helperService.combineHolidayBookings(userHolidaysCloneHolidayBookings);
            if (consolidatedHolidayBookings.length > 0) {
                userHolidaysClone.HolidayBookings = consolidatedHolidayBookings;
            }
        }
        userHolidaysClone.isVisible = false;
        $scope.hideChanges($(".changesContainer"), function () {
            $scope.changes = [];
        });
        dataService.employeeUpdateHoliday(userHolidaysClone);
    };

    $scope.submitTeamUsersData = function () {
        var arrayOfTeamUserHolidayBookings = [];
        var tUHB = $scope.teamUserHolidayBookings;
        for (var i = 0; i < tUHB.length; i++) {
            tUHB[i].HolidayBookings = _.sortBy(tUHB[i].HolidayBookings, function (booking) { return booking.StartDate; });
            helperService.setAllowanceDaysOfUnmergedHolidays(tUHB[i]);
            var userHolidaysClone = _.cloneDeep(tUHB[i]);
            var userHolidaysCloneHolidayBookings = userHolidaysClone.HolidayBookings;
            helperService.parseDateTimeToMoment(userHolidaysCloneHolidayBookings);
            if (userHolidaysCloneHolidayBookings.length > 0) {
                var consolidatedHolidayBookings = helperService.combineHolidayBookings(userHolidaysCloneHolidayBookings);
                if (consolidatedHolidayBookings.length > 0) {
                    userHolidaysClone.HolidayBookings = consolidatedHolidayBookings;
                }
            }
            arrayOfTeamUserHolidayBookings.push(userHolidaysClone);
        }
        dataService.employeesUpdateHolidays(arrayOfTeamUserHolidayBookings).then(function (response) {
            $scope.hideChanges($(".actionsContainer"));
        });
    };

};
CalendarController.$inject = ["$scope", "dataService", "helperService"];
MenuController = function ($scope, viewService, tokenService, userService) {
    "use strict";
    var childScope;

    function init() {
        defaultViews();
        $scope.$on("loggedIn", function () {
            $scope.loginStatus = tokenService.getLoginStatus();
            var user = userService.employeeGetById();
            $scope.role = user.RoleName.toLowerCase();
            $scope.loggedInUsername = user.FirstName + " " + user.LastName;
            $scope.navigate("EmployeeCalendar");
        });
    };

    function defaultViews() {
        viewService.menuGotoView($scope, views.Menu, ".side-bar-menu");
        viewService.gotoView($scope, views.Login);
        $scope.loginStatus = tokenService.getLoginStatus();
    };

    $scope.logOut = function () {
        tokenService.setToken("", false);
        defaultViews();
    };

    $scope.navigate = function (nameOfLink) {
        if (typeof childScope !== "undefined")
            childScope.$destroy();

        $(".bodyContainer").empty();
        childScope = $scope.$new();
        viewService.gotoView(childScope, views[nameOfLink]);
        $scope.setMenuLinkActive(nameOfLink);

        if (nameOfLink === "EmployeeCalendar")
            userService.refreshUser();

    };

    init();
};
MenuController.$inject = ["$scope", "viewService", "tokenService", "userService"];
LoginController = function ($scope, dataService, userService) {
    "use strict";
    var vm = this;
    $scope.login = function () {
        dataService.getLoginAuthToken($scope.username, $scope.password).then(function () {
            userService.setUser();
        }, function () {
            $(".alert").show();
            $("#password").val("");
        });
    };
};
LoginController.$inject = ["$scope", "dataService", "userService"];
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
ManagementController = function ($scope, dataService) {
    "use strict";
    $scope.init = function () {
        dataService.userGet().then(function (response) {
            $scope.data = response.data.ListOfCalendarViewModels;
            $scope.roles = response.data.ListOfIdentityRoles;
            $scope.teams = response.data.ListOfTeams;
        });
    };

    $scope.deleteUser = function (user) {
        dataService.userDelete(user).then(function () {
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };
    $scope.deleteTeam = function (team) {
        dataService.teamDelete(team).then(function() {
                dataService.userGet().then(function (response) {
                    $scope.teams = response.data.ListOfTeams;
                });
        });
    };
    $scope.userRegister = function (user) {
        dataService.userRegister(user).then(function () {
            $scope.resetRegister();
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.teamRegister = function (team) {
        dataService.teamRegister(team).then(function () {
            $scope.resetRegister();
            dataService.userGet().then(function (response) {
                $scope.teams = response.data.ListOfTeams;
            });
        });
    };

    $scope.updateUser = function (user) {
        dataService.employeeUpdate(user);
    };

    $scope.updateTeam = function (team) {
        dataService.teamUpdate(team);
    };

    $scope.userSetRole = function (user, role) {
        dataService.userSetRole(user, role).then(function () {
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.teamSetEmployee = function (user, team) {
        dataService.teamSetEmployee(user, team).then(function () {
            dataService.userGet().then(function (response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.init();
};
ManagementController.$inject = ["$scope", "dataService"];
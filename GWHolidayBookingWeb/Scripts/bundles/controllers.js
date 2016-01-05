MenuController = function($scope, viewService, tokenService, userService) {
    "use strict";
    var childScope;

    function init() {
        defaultViews();
        $scope.$on("loggedIn", function() {
            $scope.loginStatus = tokenService.getLoginStatus();
            var user = userService.employeeGetById();
            $scope.role = user.RoleName.toLowerCase();
            $scope.loggedInUsername = user.FirstName + " " + user.LastName;
            $scope.navigate("EmployeeCalendar");

            $('.menu-toggle').click(function() {
                $('.mainContainer').toggleClass('minimized');
                if ($('.menu-toggle').hasClass('fa-caret-square-o-left')) {
                    $('.menu-toggle').removeClass('fa-caret-square-o-left');
                    $('.menu-toggle').addClass('fa-caret-square-o-right');
                } else {
                    $('.menu-toggle').removeClass('fa-caret-square-o-right');
                    $('.menu-toggle').addClass('fa-caret-square-o-left');
                }

            });
        });
    };

    function defaultViews() {
        viewService.menuGotoView($scope, views.Menu, ".side-bar-menu");
        viewService.gotoView($scope, views.Login);
        $scope.loginStatus = tokenService.getLoginStatus();
    };

    $scope.logOut = function() {
        tokenService.setToken("", false);
        defaultViews();
    };

    $scope.navigate = function(nameOfLink) {
        if (typeof $scope.state === "undefined")
            $scope.state = "New";
        if ($scope.state === "New") {
            $scope.state = "Old";
            childScope = $scope.$new();
            viewService.gotoView(childScope, views[nameOfLink]);
        } else {
            childScope.$destroy();
            $(".bodyContainer").empty();
            $scope.state = "New";
            $scope.navigate(nameOfLink);
        }
        if (nameOfLink !== "Link") {
            var allMenuLinks = $(".menuLink");
            var targetMenuLink = $("#" + nameOfLink);
            allMenuLinks.css("pointer-events", "all");
            targetMenuLink.css("pointer-events", "none");
            allMenuLinks.removeClass("active");
            targetMenuLink.addClass("active");
        }
        if (nameOfLink === "EmployeeCalendar") {
            userService.refreshUser();
        }
    };

    init();
};
MenuController.$inject = ["$scope", "viewService", "tokenService", "userService"];
LoginController = function($scope, dataService, userService) {
    "use strict";
    var vm = this;
    $scope.login = function() {
        dataService.getLoginAuthToken($scope.username, $scope.password).then(function() {
            userService.setUser();
        }, function() {
            $(".alert").show();
            $("#password").val("");
        });
    };
};
LoginController.$inject = ["$scope", "dataService", "userService"];
CalendarController = function ($scope, dataService, viewService) {
    "use strict";
    $scope.init = function (mode) {
        $scope.mode = mode;
        $scope.editMode = false;
        $scope.changes = [];
        dataService.publicHolidaysGet().then(function (listOfPublicHolidays) {
            listOfPublicHolidays.data.forEach(function (publicHoliday) {
                publicHoliday.Date = moment(publicHoliday.Date, "YYYY-MM-DD-Z");
            });
            $scope.publicHolidays = listOfPublicHolidays.data;
            $scope.selected = moment();
            if (mode === "manager") {
                dataService.employeesGet().then(function (response) {
                    $scope.teamUserHolidayBookings = response.data;
                    $scope.initData($scope.teamUserHolidayBookings);
                    $scope.getListOfTeamMembers($scope.teamUserHolidayBookings);
                    viewService.calendarGoToView($scope, views.CalendarModeManager);
                    $scope.tabPendingHolidays = [];
                });
            } else {
                dataService.employeesGet().then(function (response) {
                    $scope.teamUserHolidayBookings = response.data;
                    $scope.initData($scope.teamUserHolidayBookings);
                    $scope.getListOfTeamMembers($scope.teamUserHolidayBookings);
                    viewService.calendarGoToView($scope, views.CalendarModeEmployee);

                });
            };
        });
    };


    $scope.initData = function (holidayArray) {
        var i;
        for (i = 0; i < holidayArray.length; i++) {
            $scope.parseDateTimeToMoment(holidayArray[i].HolidayBookings);
        }
        $scope.unmergeHolidayBookings(holidayArray);
        for (i = 0; i < holidayArray.length; i++) {
            holidayArray[i].HolidayBookings = _.sortBy(holidayArray[i].HolidayBookings, function (booking) { return booking.StartDate; });
        }
    };

    $scope.unmergeHolidayBookings = function (holidayArray) {
        for (var i = 0; i < holidayArray.length; i++) {
            var count = holidayArray[i].HolidayBookings.length;
            for (var j = 0; j < count; j++) {
                while (holidayArray[i].HolidayBookings[j].StartDate.day() !== holidayArray[i].HolidayBookings[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep(holidayArray[i].HolidayBookings[j]);
                    copyOfHolidayBooking.EndDate = moment(copyOfHolidayBooking.EndDate);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    holidayArray[i].HolidayBookings.push(copyOfHolidayBooking);
                    holidayArray[i].HolidayBookings[j].EndDate = holidayArray[i].HolidayBookings[j].EndDate.subtract(1, "days");
                }
            }
            holidayArray[i].RemainingAllowance = holidayArray[i].HolidayAllowance - holidayArray[i].HolidayBookings.length;
        }

    };

    $scope.setAllowanceDaysOfUnmergedHolidays = function (holidayArray) {
        for (var j = 0; j < holidayArray.HolidayBookings.length; j++) {
            holidayArray.HolidayBookings[j].AllowanceDays = 1;
        }
    };

    $scope.parseDateTimeToMoment = function (holidayBookingsArray) {
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

    $scope.getListOfTeamMembers = function (holidayArray) {
        var listOfTeamMembers = [];
        for (var i = 0; i < holidayArray.length; i++) {
            listOfTeamMembers.push({
                Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                StaffId: holidayArray[i].StaffId
            });
        }
        $scope.listOfTeamMembers = listOfTeamMembers;
    };

    $scope.toggleEditMode = function (e) {
        $scope.editMode = !$scope.editMode;
        $(e.target).toggleClass("active");
    };

    $scope.submitHolidaySingleEmployee = function () {
        $scope.userHolidayBookings.HolidayBookings = _.sortBy($scope.userHolidayBookings.HolidayBookings, function (booking) { return booking.StartDate; });
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
        dataService.employeesUpdateHolidays(arrayOfTeamUserHolidayBookings).then(function (response) {
            $scope.hideChanges($(".actionsContainer"));
        });
    };

    function combineHolidayBookings(holidayBooking) {
        var consolidatedHolidayBookings = [];
        var startFlag = true;
        var test = null;
        while (holidayBooking.length !== 1) {
            if (holidayBooking[0].StartDate.day() + 1 === holidayBooking[1].StartDate.day() && startFlag === true && holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                holidayBooking[0].AllowanceDays++;
                if (holidayBooking.length === 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
                startFlag = false;
            } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() && startFlag === false && holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                holidayBooking[0].AllowanceDays++;
                if (holidayBooking.length === 2) {
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                }
                holidayBooking.splice(1, 1);
            } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() && holidayBooking[0].BookingStatus !== holidayBooking[1].BookingStatus) {
                holidayBooking[1].HolidayId = 0;
                consolidatedHolidayBookings.push(holidayBooking[0]);
                if (holidayBooking.length === 2) {
                    consolidatedHolidayBookings.push(holidayBooking[1]);
                }
                holidayBooking.splice(0, 1);
                startFlag = true;
            } else {
                if (test === holidayBooking[0].HolidayId) {
                    holidayBooking[0].HolidayId = 0;
                } else {
                    test = holidayBooking[0].HolidayId;
                }
                consolidatedHolidayBookings.push(holidayBooking[0]);
                if (holidayBooking.length === 2) {
                    consolidatedHolidayBookings.push(holidayBooking[1]);
                }
                holidayBooking.splice(0, 1);
                startFlag = true;
            }
        }
        return consolidatedHolidayBookings;
    };
};
CalendarController.$inject = ["$scope", "dataService", "viewService"];
UserTableController = function($scope, $http, dataService) {
    "use strict";
    $scope.init = function() {
        dataService.userGet().then(function(response) {
            $scope.data = response.data.ListOfCalendarViewModels;
            $scope.roles = response.data.ListOfIdentityRoles;
        });
    };

    $scope.delete = function(user) {
        dataService.userDelete(user).then(function(response) {
            dataService.userGet().then(function(response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.register = function(user) {
        dataService.userRegister(user).then(function() {
            $(".createContainer").toggleClass("hidden");
            $(".createUserForm").trigger("reset");
            dataService.userGet().then(function(response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.update = function(user) {
        dataService.employeeUpdate(user);
    };

    $scope.showCreate = function() {
        $(".createContainer").toggleClass("hidden");
    };

    $scope.userSetRole = function(user, role) {
        dataService.userSetRole(user, role).then(function(response) {
            dataService.userGet().then(function(response) {
                $scope.data = response.data.ListOfCalendarViewModels;
            });
        });
    };

    $scope.init();
};
UserTableController.$inject = ["$scope", "$http", "dataService"];
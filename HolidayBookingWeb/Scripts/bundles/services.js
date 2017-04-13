loginService = function($rootScope) {
    "use strict";
    var loginStatus = false;
    return {
        broadcast: function() {
            $rootScope.$broadcast("loggedIn");
        },
        setLoginStatus: function(status) {
            loginStatus = status;
            localStorage.setItem("loggedIn", status);
        },
        getLoginStatus: function() {
            return loginStatus;
        },
        checkLoginStatus: function() {
            return localStorage.getItem("loggedIn");
        }
    };
}
templateService = function($http, $compile, $templateCache) {
    "use strict";
    return {
        getTemplate: function(templateUrl) {
            return $http.get(templateUrl,
            {
                cache: $templateCache
            });
        },
        cacheTemplate: function(templateUrl, template) {
            $templateCache.put(templateUrl, template);
        },
        compileTemplate: function(template, scope) {
            var compiledTemplate = $compile(template);
            return compiledTemplate(scope);
        },
        renderTemplate: function(target, html, append) {
            var element = angular.element(target);
            if (append === true)
                element.append(html);
            else
                element.html(html);
        },
        addTemplate: function(templateUrl, target, scope, append) {
            var service = this;
            service.getTemplate(templateUrl)
                .success(function(template) {
                    service.cacheTemplate(templateUrl, template);
                    var html = service.compileTemplate(template, scope);
                    service.renderTemplate(target, html, append);
                })
                .error(function(data, status, headers, config) {
                    throw (data);
                });
        }
    };
}
dataService = function($http, notificationService) {
    "use strict";
    return {
        publicHolidaysGet: function() {
            return $http({
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/GetPublicHolidays"
            });
        },
        employeeGetById: function() {
            return $http({
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/GetEmployeeById"
            });
        },
        employeesGetTeam: function(teamId) {
            return $http({
                method: "GET",
                params: { teamId: teamId },
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/GetEmployeesTeam"
            });
        },
        employeesGet: function() {
            return $http({
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/GetEmployees"
            });
        },
        employeeUpdate: function(employee) {
            return $http({
                data: employee,
                method: "POST",
                url: "http://localhost:57068/api/Employee/UpdateEmployee"
            });
        },
        employeeUpdateHoliday: function(employeeData) {
            return $http({
                data: employeeData,
                method: "POST",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/UpdateEmployeeAndHoliday"
            });
        },
        employeesUpdateHolidays: function(employeeData) {
            return $http({
                data: employeeData,
                method: "POST",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: "http://localhost:57068/api/Employee/UpdateEmployeesAndHolidays"
            });
        },
        userDelete: function(user) {
            return $http({
                data: { StaffId: user.StaffId, IdentityId: user.UserViewModel.IdentityId },
                method: "POST",
                url: "http://localhost:57068/api/User/DeleteUserAndEmployee"
            });
        },
        userRegister: function(user) {
            return $http({
                data: user,
                method: "POST",
                url: "http://localhost:57068/api/User/RegisterUserAndEmployee"
            });
        },
        userSetRole: function(user, role) {
            return $http({
                data: { RoleName: role.Name, IdentityId: user.UserViewModel.IdentityId },
                method: "POST",
                url: "http://localhost:57068/api/User/UserSetRole"
            });
        },
        userGet: function() {
            return $http({
                method: "GET",
                url: "http://localhost:57068/api/User/GetUsersAndRoles"
            });
        },
        teamRegister: function(team) {
            return $http({
                data: team,
                method: "POST",
                url: "http://localhost:57068/api/Team/CreateTeam"
            });
        },
        teamUpdate: function(team) {
            return $http({
                data: team,
                method: "POST",
                url: "http://localhost:57068/api/Team/UpdateTeam"
            });
        },
        teamDelete: function(team) {
            return $http({
                    data: team,
                    method: "POST",
                    url: "http://localhost:57068/api/Team/DeleteTeam"
                })
                .then(function(response) {
                    if (response.data.length > 0)
                        notificationService.generateNotification("error", response.data);
                });
        },
        teamsGet: function() {
            return $http({
                method: "GET",
                url: "http://localhost:57068/api/Team/GetTeams"
            });
        },
        teamSetEmployee: function(employee, team) {
            return $http({
                data: { Employee: employee, Team: team },
                method: "POST",
                url: "http://localhost:57068/api/Employee/EmployeeSetTeam"
            });
        }

    };
}
authService = function($http) {
    return {
        authenticateAccount: function(u, p) {
            return $http({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: { username: u, password: p },
                    url: "http://localhost:57068/api/Account/Login"
                })
                .success(function(data) {
                    if (data == false) {
                        return false;
                    } else {
                        return true;
                    }
                });
        }
    };
};
userService = function(dataService, loginService) {
    "use strict";
    var user;
    return {
        setUser: function() {
            dataService.employeeGetById()
                .then(function(response) {
                    user = response.data;
                    loginService.broadcast();
                });
        },
        getUser: function () {
            return user;
        },
        refreshUser: function() {
            dataService.employeeGetById()
                .then(function(response) {
                    user = response.data;
                });
        }
    };
}
authService = function($http) {
    return {
        authenticateAccount: function(u, p) {
            return $http({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: { username: u, password: p },
                    url: "http://localhost:57068/api/Account/Login"
                })
                .success(function(data) {
                    if (data == false) {
                        return false;
                    } else {
                        return true;
                    }
                });
        }
    };
};
helperService = function() {
    "use strict";
    return {
        guid: function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                s4() +
                s4();
        },
        combineHolidayBookings: function(holidayBooking) {
            var consolidatedHolidayBookings = [];
            var startFlag = true;
            var duplicateHolidayId = null;
            while (holidayBooking.length !== 1) {
                if (holidayBooking[0].StartDate.day() + 1 === holidayBooking[1].StartDate.day() &&
                    startFlag === true &&
                    holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                    holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                    holidayBooking[0].AllowanceDays++;
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[0]);
                    }
                    holidayBooking.splice(1, 1);
                    startFlag = false;
                } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() &&
                    startFlag === false &&
                    holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                    holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                    holidayBooking[0].AllowanceDays++;
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[0]);
                    }
                    holidayBooking.splice(1, 1);
                } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() &&
                    holidayBooking[0].BookingStatus !== holidayBooking[1].BookingStatus) {
                    holidayBooking[1].HolidayId = this.guid();
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[1]);
                    }
                    holidayBooking.splice(0, 1);
                    startFlag = true;
                } else {
                    if (duplicateHolidayId === holidayBooking[0].HolidayId) {
                        holidayBooking[0].HolidayId = this.guid();
                    } else {
                        duplicateHolidayId = holidayBooking[0].HolidayId;
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
        },
        getListOfTeamMembers: function(holidayArray) {
            var listOfTeamMembers = [];
            for (var i = 0; i < holidayArray.length; i++) {
                listOfTeamMembers.push({
                    Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                    StaffId: holidayArray[i].StaffId
                });
            }
            return listOfTeamMembers;
        },
        unmergeHolidayBookings: function(holidayBookingsArray) {
            for (var j = 0; j < holidayBookingsArray.length; j++) {
                while (holidayBookingsArray[j].StartDate.day() !== holidayBookingsArray[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep(holidayBookingsArray[j]);
                    copyOfHolidayBooking.EndDate = moment(copyOfHolidayBooking.EndDate);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    holidayBookingsArray.push(copyOfHolidayBooking);
                    holidayBookingsArray[j].EndDate = holidayBookingsArray[j].EndDate.subtract(1, "days");
                }
            }
        },
        parseDateTimeToMoment: function(holidayBookingsArray) {
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
        },
        setAllowanceDaysOfUnmergedHolidays: function(holidayArray) {
            for (var j = 0; j < holidayArray.HolidayBookings.length; j++) {
                holidayArray.HolidayBookings[j].AllowanceDays = 1;
            }
        }
    };
}
notificationService = function() {
    "use strict";
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "5000",
        "hideDuration": "1500",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    return {
        generateNotification: function(type, message) {
            if (type == "success") {
                toastr.success(message);
            } else if (type == "warning") {
                toastr.warning(message);
            } else if (type == "error") {
                toastr.error(message);
            }
        }
    };
}
viewService = function(templateService) {
    "use strict";
    return {
        gotoView: function($scope, view, target) {
            if (!target || target.length === 0)
                target = "div.pageBody";
            templateService.addTemplate(view, target, $scope, false);
        }
        //},
        //menuGotoView: function($scope, view, target) {
        //    templateService.addTemplate(view, target, $scope, false);
        //}
    };
}
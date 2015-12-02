dataService = function ($http, tokenService, guidService) {
    'use strict';
    return {
        getLoginAuthToken: function (u, p) {
            return $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: $.param({ username: u, password: p, grant_type: "password" }),
                url: 'http://localhost:57068/token'
            }).success(function (data) {
                tokenService.setToken(data.access_token, true);
            }).error(function () {

            });
        },
        publicHolidaysGet: function () {
            return $http({
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Employee/GetPublicHolidays'
            });
        },
        employeeGetById: function () {
            return $http({
                method: 'GET',
                params: {

                },
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Employee/GetEmployeeById'
            });
        },
        employeesGet: function () {
            return $http({
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Employee/GetEmployees'
            });
        },
        employeeUpdate: function (employee) {
            return $http({
                data: employee,
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                },
                url: "http://localhost:57068/api/Employee/UpdateEmployee"
            });
        },
        employeeUpdateHoliday: function (employeeData) {
            return $http({
                data: employeeData,
                method: 'POST',
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Employee/UpdateEmployeeAndHoliday'
            });
        },
        employeesUpdateHolidays: function (employeeData) {
            return $http({
                data: employeeData,
                method: 'POST',
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Employee/UpdateEmployeesAndHolidays'
            });
        },


        userDelete: function (user) {
            return $http({
                data: { StaffId: user.StaffId, IdentityId: user.UserViewModel.IdentityId },
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                },
                url: "http://localhost:57068/api/User/DeleteUserAndEmployee"
            });
        },
        userRegister: function (user) {
            return $http({
                data: user,
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                },
                url: "http://localhost:57068/api/User/RegisterUserAndEmployee"
            });
        },
        userSetRole: function (user, role) {
            return $http({
                data: { RoleName: role.Name, IdentityId: user.UserViewModel.IdentityId },
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                },
                url: "http://localhost:57068/api/User/UserSetRole"
            });
        },
        userGet: function () {
            return $http({
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + tokenService.getLoginAuthToken(),
                },
                url: 'http://localhost:57068/api/User/GetUsersAndRoles'
            });
        }
    };
}
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
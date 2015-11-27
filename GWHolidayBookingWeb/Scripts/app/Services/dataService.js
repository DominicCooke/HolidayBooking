dataService = function ($http, tokenService, guidService) {
    return {
        getAllUsers: function () {
            return $http({
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/GetEmployees'
            });
        },
        sendUserData: function (userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/UpdateHoliday'
            });
        },
        sendUsersData: function (userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/UpdateHolidays'
            });
        },
        getUser: function () {
            return $http({
                method: 'GET',
                params: {

                },
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/GetEmployeeById'
            });
        },
        getToken: function (u, p) {
            return $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: $.param({ username: u, password: p, grant_type: "password" }),
                url: 'http://localhost:57068/token'
            }).success(function(data) {
                tokenService.setToken(data.access_token, true);
            }).error(function() {

            });
        },
        deleteUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Delete",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                },
                data: { StaffId: user.StaffId, IdentityId: user.UserViewModel.IdentityId }
            });
        },
        registerUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Register",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                },
                data: user
            });
        },
        updateUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Update",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                },
                data: user
            });
        },
        setRole: function (user, role) {
            return $http({
                url: "http://localhost:57068/api/Employee/SetRole",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                },
                data: { RoleName: role.Name, IdentityId: user.UserViewModel.IdentityId }
            });
        },
        getIdentityEmployees: function () {
            return $http({
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                },
                url: 'http://localhost:57068/api/Employee/GetIdentityEmployeesRoles'
            });
        }
    };
}
dataService = function($http, tokenService) {
    return {
        getAllUsers: function() {
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
        sendUserData: function(userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/UpdateEmployee'
            });
        },
        sendUsersData: function(userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/UpdateEmployees'
            });
        },
        getUserById: function(id) {
            return $http({
                method: 'GET',
                params: {
                    staffId: id
                },
                headers: {
                    "Authorization": "Bearer " + tokenService.getToken(),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                url: 'http://localhost:57068/api/Calendar/GetEmployeeById'
            });
        },
        getToken: function(u, p) {
            return $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: $.param({ username: u, password: p, grant_type: "password" }),
                url: 'http://localhost:57068/token'
            }).success(function(data) {
                tokenService.setToken(data.access_token);
            });
        }
    };
}
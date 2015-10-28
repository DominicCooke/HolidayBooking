dataService = function ($http) {
    return {
        getAllUsers: function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:57068/api/theApi/GetUsers'
            }).success(function (data) {
                return data;
            });
        }, sendUserData: function (userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                url: 'http://localhost:57068/api/theApi/PostUser'
            }).success(function (data) {

            });
        }, sendUsersData: function (userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: userData,
                url: 'http://localhost:57068/api/theApi/PostUsers'
            }).success(function (data) {

            });
        }, getUserById: function (id) {
            return $http({
                method: 'GET',
                params: {
                    staffNumber: id
                },
                url: 'http://localhost:57068/api/theApi/GetUserById'
            }).success(function (data) {

            });
        }
    };
}
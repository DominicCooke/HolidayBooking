dataService = function ($http) {
    return {
        getAllUsers: function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:57068/api/theApi/GetUsers'
            }).success(function (data) {
                return data;
            });
        }, sendData: function (userData) {
            return $http({
                method: 'POST',
                contentType: "application/json",
                data: JSON.stringify(userData),
                url: 'http://localhost:57068/api/theApi/PostUsers'
            }).success(function (data) {

            });
        }, getUserById: function (id) {
            return $http({
                method: 'GET',
                params: {
                    StaffNumber: id
                },
                url: 'http://localhost:57068/api/theApi/GetUserById'
            }).success(function (data) {

            });
        }
    };
}
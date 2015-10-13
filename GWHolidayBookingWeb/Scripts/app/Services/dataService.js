dataService = function ($http) {
    return {
        getData: function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:57068/api/theApi/GetUsers'
            }).success(function (data) {
                return data;
            });
        }, sendData: function (test) {
            return $http({
                method: 'POST',
                data: test,
                url: 'http://localhost:57068/api/theApi/PostUsers'
            }).success(function (data) {
                
            });
        }
    };
}
authService = function($http) {
    return {
        authenticateAccount: function(u, p) {
            return $http({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: { username: u, password: p },
                    url: "http://192.133.244.6:57068/api/Account/Login"
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
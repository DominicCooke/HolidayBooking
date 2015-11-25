///#source 1 1 /Scripts/app/Services/dataService.js
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
        getIdentityRoles: function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:57068/api/Employee/GetIdentityRoles'
            });
        },
        deleteUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Delete",
                method: "POST",
                data: { StaffId: user.StaffId, IdentityId: user.UserViewModel.IdentityId }
            });
        },
        registerUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Register",
                method: "POST",
                data: user
            });
        },
        updateUser: function (user) {
            return $http({
                url: "http://localhost:57068/api/Employee/Update",
                method: "POST",
                data: user
            });
        },
        setRole: function (user, role) {
            return $http({
                url: "http://localhost:57068/api/Employee/SetRole",
                method: "POST",
                data: { RoleName: role.Name, IdentityId: user.UserViewModel.IdentityId }
            });
        },
        getIdentityEmployees: function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:57068/api/Employee/GetIdentityEmployees'
            });
        }
    };
}
///#source 1 1 /Scripts/app/Services/loginService.js
loginService = function ($rootScope) {
    return {
        broadcast: function () {
            $rootScope.$broadcast("loggedIn");
        }
    };
}
///#source 1 1 /Scripts/app/Services/templateService.js
templateService = function($http, $compile, $templateCache) {
    return {
        getTemplate: function(templateUrl) {
            return $http.get(templateUrl, {
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
            if (append == true)
                element.append(html);
            else
                element.html(html);
        },
        addTemplate: function(templateUrl, target, scope, append) {
            var service = this;
            service.getTemplate(templateUrl).success(function(template) {
                service.cacheTemplate(templateUrl, template);
                var html = service.compileTemplate(template, scope);
                service.renderTemplate(target, html, append);
            }).error(function(data, status, headers, config) {
                throw (data);
            });
        }
    };
}
///#source 1 1 /Scripts/app/Services/tokenService.js
tokenService = function() {
    var serviceToken;
    var LoginStatus = false;
    return {
        getToken: function() {
            return serviceToken;
        },
        setToken: function (token, loginStatus) {
            serviceToken = token;
            LoginStatus = loginStatus;
        },
        getLoginStatus: function() {
            return LoginStatus;
        }
    };
}
///#source 1 1 /Scripts/app/Services/userService.js
userService = function (dataService, loginService) {
    var User;
    return {
        setUser: function () {
            dataService.getUser().then(function (response) {
                User = response.data;
                loginService.broadcast();
            });
        },
        getUser: function() {
            return User;
        }
    };
}
///#source 1 1 /Scripts/app/Services/viewService.js
viewService = function (templateService) {
    return {
        gotoView: function ($scope, view, target) {
            if (!target || target.length == 0)
                target = 'div.pageBody';
            templateService.addTemplate(view, target, $scope, false);
        },
        menuGotoView: function ($scope, view, target) {
            templateService.addTemplate(view, target, $scope, false);
        },
        calendarGoToView: function ($scope, view, target) {
            if (!target || target.length == 0)
                target = 'div.bodyContainer';
            templateService.addTemplate(view, target, $scope, true);
        }
    };
}

loginService = function ($rootScope) {
    'use strict';
    return {
        broadcast: function () {
            $rootScope.$broadcast("loggedIn");
        }
    };
}
tokenService = function () {
    'use strict';
    var loginAuthToken;
    var loginStatus = false;
    return {
        getLoginAuthToken: function() {
            return loginAuthToken;
        },
        setToken: function (token, status) {
            loginAuthToken = token;
            loginStatus = status;
        },
        getLoginStatus: function() {
            return loginStatus;
        }
    };
}
templateService = function ($http, $compile, $templateCache) {
    'use strict';
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
userService = function (dataService, loginService) {
    'use strict';
    var User;
    return {
        setUser: function () {
            dataService.employeeGetById().then(function (response) {
                User = response.data;
                loginService.broadcast();
            });
        },
        employeeGetById: function() {
            return User;
        },
        refreshUser: function() {
            dataService.employeeGetById().then(function (response) {
                User = response.data;
            });
        }
    };
}
viewService = function (templateService) {
    'use strict';
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
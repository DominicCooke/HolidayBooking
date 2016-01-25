var app = angular.module("holApp", ["chart.js", "ui.bootstrap", "xeditable", "ngAnimate"]);

angular.module("holApp", ["chart.js", "ui.bootstrap", "xeditable", "ngAnimate"])
    .service("templateService", ["$http", "$compile", "$templateCache", templateService])
    .service("viewService", ["templateService", viewService])
    .service("tokenService", [tokenService])
    .service("helperService", [helperService])
    .service("userService", ["dataService", "loginService", userService])
    .service("loginService", ["$rootScope", loginService])
    .service("dataService", ["$http", "tokenService", dataService])
    .controller("MenuController", MenuController)
    .controller("CalendarController", CalendarController)
    .controller("LoginController", LoginController)
    .controller("ManagementController", ManagementController)
    .directive("calendar", calendarDirective)
    .directive("calendarcontrols", calendarControlsDirective)
    .directive("tooltip", tooltipDirective)
    .directive("infobox", infoBoxDirective)
    .factory("templates", templates);
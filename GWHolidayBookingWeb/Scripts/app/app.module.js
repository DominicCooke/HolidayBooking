var app = angular.module("holApp", ['chart.js', 'ui.bootstrap', 'xeditable']);

angular.module('holApp', ['chart.js', 'ui.bootstrap', 'xeditable'])
    .service('templateService', ['$http', '$compile', '$templateCache', templateService])
    .service('viewService', ['templateService', viewService])
    .service('tokenService', [tokenService])
    .service('userService', ['dataService', 'loginService', userService])
    .service('loginService', ['$rootScope', loginService])
    .service('dataService', ['$http', 'tokenService', dataService])
    .controller('MenuController', MenuController)
    .controller('CalendarController', CalendarController)
    .controller('LoginController', LoginController)
    .controller('UserTableController', UserTableController)
    .directive('calendar', calendarDirective)
    .directive('calendarcontrols', calendarControlsDirective)
    .directive('tooltip', tooltipDirective)
    .directive('infobox', infoBoxDirective)
    .factory('templates', templates);
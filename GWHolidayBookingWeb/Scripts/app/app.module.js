var app = angular.module("holApp", ['chart.js', 'ui.bootstrap', 'xeditable']);


app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

app.service('templateService', ['$http', '$compile', '$templateCache', templateService]);
app.service('viewService', ['templateService', viewService]);
app.service('tokenService', [tokenService]);
app.service('userService', ['dataService', 'loginService', userService]);
app.service('loginService', ['$rootScope', loginService]);
app.service('dataService', ['$http', 'tokenService', dataService]);

app.controller('menuCtrl', menuCtrl);
app.controller('calendarCtrl', calendarCtrl);
app.controller('loginCtrl', loginCtrl);
app.controller('userTableCtrl', userTableCtrl);

app.directive('calendar', calendarDirective);
app.directive('calendarcontrols', calendarControlsDirective);
app.directive('tooltip', tooltipDirective);
app.directive('tabs', tabsDirective);
app.directive('infobox', infoBoxDirective);

app.factory('templates', templates);
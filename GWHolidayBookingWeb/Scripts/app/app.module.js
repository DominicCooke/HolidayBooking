'use strict';
var app = angular.module("holApp", ['chart.js', 'ui.bootstrap']);

app.service('templateService', ['$http', '$compile', '$templateCache', templateService]);

app.service('viewService', ['templateService', viewService]);

app.service('dataService', ['$http', dataService]);

app.controller('menuCtrl', menuCtrl);
app.controller('dashboardCtrl', dashboardCtrl);
app.controller('calendarCtrl', calendarCtrl);

app.directive('calendar', calendarDirective);
app.directive('calendarcontrols', calendarControlsDirective);
app.directive('selectbox', selectboxDirective);
app.directive('managercalendartooltip', managerCalendarTooltipDirective);
app.directive('managercalendartabs', managerCalendarTabsDirective);
app.directive('employeecalendarinfobox', employeeCalendarInfoBoxDirective);

app.factory('templates', templates);


'use strict';
var app = angular.module("holApp", ['chart.js', 'ui.bootstrap']);

app.service('templateService', ['$http', '$compile', '$templateCache', templateService]);

app.service('viewService', ['templateService', viewService]);

app.service('dataService', ['$http', dataService]);

app.controller('menuCtrl', menuCtrl);
app.controller('dashboardCtrl', dashboardCtrl);
app.controller('calendarCtrl', calendarCtrl);

app.directive('calendar', calendarDirective);
app.directive('managercalendarcontrols', managerCalendarControlsDirective);
app.directive('selectbox', selectboxDirective);
app.directive('managercalendartooltip', managerCalendarTooltipDirective);
app.directive('managercalendartabs', managerCalendarTabsDirective);

app.factory('templates', templates);


'use strict';
var app = angular.module("holApp", ['chart.js', 'ui.bootstrap']);

app.service('templateService', ['$http', '$compile', '$templateCache', templateService]);
app.service('viewService', ['templateService', viewService]);
app.service('tokenService', [tokenService]);
app.service('dataService', ['$http', 'tokenService', dataService]);

app.controller('menuCtrl', menuCtrl);
app.controller('dashboardCtrl', dashboardCtrl);
app.controller('calendarCtrl', calendarCtrl);
app.controller('loginCtrl', loginCtrl);

app.directive('calendar', calendarDirective);
app.directive('calendarcontrols', calendarControlsDirective);
app.directive('selectbox', selectboxDirective);
app.directive('tooltip', tooltipDirective);
app.directive('tabs', tabsDirective);
app.directive('infobox', infoBoxDirective);

app.factory('templates', templates);
tabsDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/manager/managerCalendarTabsTemplate.html",
        controller: 'calendarCtrl',
        scope: true,
        link: function ($scope) {

        }
    };

};
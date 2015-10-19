managerCalendarTabsDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/managerCalendarTabsTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            
        }
    };

};
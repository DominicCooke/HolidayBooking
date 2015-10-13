tabsDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/tabsTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {
            
        }
    };

};
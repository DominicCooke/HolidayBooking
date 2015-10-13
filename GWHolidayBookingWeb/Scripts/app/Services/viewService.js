viewService = function (templateService) {
    return {
        gotoView: function ($scope, view, target, callback) {
            if (!target || target.length == 0)
                target = 'div#pageBody';
            templateService.addTemplate(view, target, $scope, callback, false);
        },
        calendarGoToView: function ($scope, view, target, callback) {
            if (!target || target.length == 0)
                target = 'div.bodyContainer';
            templateService.addTemplate(view, target, $scope, callback, true);
        }
    };
}

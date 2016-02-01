viewService = function(templateService) {
    "use strict";
    return {
        gotoView: function($scope, view, target) {
            if (!target || target.length === 0)
                target = "div.pageBody";
            templateService.addTemplate(view, target, $scope, false);
        },
        menuGotoView: function($scope, view, target) {
            templateService.addTemplate(view, target, $scope, false);
        }
    };
}
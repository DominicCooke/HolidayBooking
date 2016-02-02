managementDirective = function (templates) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: function ($elem, $attr) {
            return templates[$attr.mode];
        },
        controller: "",
        scope: true,
        link: function ($scope) {
            $scope.showCreate = function showCreate() {
                $(".createContainer").toggleClass("hidden");
            };

            $scope.resetRegister = function resetRegister() {
                $(".createContainer").toggleClass("hidden");
                $(".createForm").trigger("reset");
            };
        }
    };
};
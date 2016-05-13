sideMenuDirective = function(templates) {
    return {
        restrict: "E",
        templateUrl: templates.sideMenu,
        controller: "",
        scope: false,
        link: function($scope) {

            $(".menu-toggle")
                .click(function() {
                    $(".mainContainer").toggleClass("minimized");
                    if ($(".menu-toggle").hasClass("fa-caret-square-o-left")) {
                        $(".menu-toggle").removeClass("fa-caret-square-o-left");
                        $(".menu-toggle").addClass("fa-caret-square-o-right");
                    } else {
                        $(".menu-toggle").removeClass("fa-caret-square-o-right");
                        $(".menu-toggle").addClass("fa-caret-square-o-left");
                    }
                });

            $scope.setMenuLinkActive = function setMenuLinkActive(nameOfLink) {
                var allMenuLinks = $(".menuLink");
                var targetMenuLink = $("#" + nameOfLink);
                allMenuLinks.css("pointer-events", "all");
                targetMenuLink.css("pointer-events", "none");
                allMenuLinks.removeClass("active");
                targetMenuLink.addClass("active");
            };
        }
    };
};
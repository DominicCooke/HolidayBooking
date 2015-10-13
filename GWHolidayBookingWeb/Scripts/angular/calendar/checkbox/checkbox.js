checkboxDirective = function () {
    return {
        restrict: "E",
        templateUrl: "/Scripts/app/templates/checkboxTemplate.html",
        controller: 'calendarCtrl',
        controllerAs: 'vm',
        scope: false,
        link: function ($scope) {

            $scope.isChecked = function (event) {
                var optionChecked = event.target.getAttribute('value');
                $scope.toggleClass(event.target, "active");
                $scope.setTeamSelected(optionChecked, event);
            }

            $scope.setTeamSelected = function (userOptionChecked, event) {
                var allSelected = false;
                var teamMembers = $('.person');
                var teamHolidays = $scope.teamHolidays;
                if (userOptionChecked == "all") {
                    if (event.target.classList.contains("active"))
                        allSelected = true;
                    for (var j = 0; j < teamMembers.length; j++) {
                        $scope.toggleClass(teamMembers[j], "dead"); 
                    }
                    for (var i = 0; i < teamHolidays.length; i++) {
                        teamHolidays[i].isVisible = allSelected;
                    }
                } else {
                    for (var i = 0; i < teamHolidays.length; i++) {
                        if (teamHolidays[i].Name == userOptionChecked) {
                            teamHolidays[i].isVisible = !teamHolidays[i].isVisible;
                        }
                    }
                }
            }
            $scope.toggleClass = function (element, className) {
                if (!element.classList.contains(className))
                    element.classList.add(className);
                else {
                    element.classList.remove(className);
                    element.classList.remove("active");
                }
            }
        }
    };

};